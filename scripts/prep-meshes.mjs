/**
 * STL -> decimated, Meshopt-compressed GLB pipeline for the Li Lab site.
 *
 * For each validated source mesh (see build spec §11.C) this script:
 *   1. Parses the binary STL (manual parser — no DOM/three loaders needed).
 *   2. Merges coincident vertices (indexed geometry) and computes smooth
 *      vertex normals so the chrome/PBR material reveals surface relief
 *      instead of flattening to a grey blob.
 *   3. Centers the mesh on the origin (records original bbox in MODEL UNITS).
 *   4. Builds a glTF-Transform Document, decimates with meshoptimizer's
 *      simplifier to the per-file triangle target, then applies Meshopt
 *      compression.
 *   5. Writes public/models/<name>.glb and a shared public/models/manifest.json
 *      carrying ONLY honest geometry (index, tris, bbox) for the HUD.
 *
 * EDITORIAL HONESTY: no scientific identity, resolution, or PDB/EMDB id is ever
 * derived or written. The structures are anonymous sculptural objects.
 *
 * Empty/superseded files (the two 84-byte STLs from the spec) are skipped
 * defensively by the byte-size / triangle-count guard.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document, NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression } from '@gltf-transform/extensions';
import { weld, simplify, prune, dedup, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'raw_stl');
const OUT_DIR = path.join(ROOT, 'public', 'models');

/**
 * Catalog of the five usable meshes. `index` is a NEUTRAL gallery index
 * (Specimen I–V), not a scientific identifier. `target` is the post-decimation
 * triangle budget (§9: heaviest decimated to <= ~150k).
 */
const CATALOG = [
  // Only one specimen is used on the site (the lab selected structure 4). It is
  // still presented ANONYMOUSLY as a single neutral catalog entry.
  { index: 'I', roman: 'I', n: 1, source: 'structure4_p17_J156_005.stl', out: 'specimen.glb', target: 150_000 },
];

// ---------------------------------------------------------------------------
// Binary STL parser -> { positions: Float32Array, triangles: number }
// ---------------------------------------------------------------------------
function parseBinarySTL(buffer) {
  const dv = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const triangles = dv.getUint32(80, true);
  const expected = 84 + triangles * 50;
  if (triangles === 0 || buffer.byteLength < expected) {
    return { positions: new Float32Array(0), triangles: 0 };
  }
  const positions = new Float32Array(triangles * 9);
  let offset = 84;
  let p = 0;
  for (let i = 0; i < triangles; i++) {
    offset += 12; // skip face normal
    for (let v = 0; v < 3; v++) {
      positions[p++] = dv.getFloat32(offset, true);
      positions[p++] = dv.getFloat32(offset + 4, true);
      positions[p++] = dv.getFloat32(offset + 8, true);
      offset += 12;
    }
    offset += 2; // attribute byte count
  }
  return { positions, triangles };
}

// ---------------------------------------------------------------------------
// Weld coincident vertices -> indexed { positions, indices, bbox, center }
// quantized hash merge (1e-4 of the bbox diagonal) for robustness.
// ---------------------------------------------------------------------------
function weldVertices(rawPositions) {
  const vertCount = rawPositions.length / 3;
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < vertCount; i++) {
    for (let a = 0; a < 3; a++) {
      const val = rawPositions[i * 3 + a];
      if (val < min[a]) min[a] = val;
      if (val > max[a]) max[a] = val;
    }
  }
  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const diag = Math.hypot(size[0], size[1], size[2]) || 1;
  const eps = diag * 1e-4;
  const inv = 1 / eps;

  const map = new Map();
  const positions = [];
  const indices = new Uint32Array(vertCount);
  for (let i = 0; i < vertCount; i++) {
    const x = rawPositions[i * 3];
    const y = rawPositions[i * 3 + 1];
    const z = rawPositions[i * 3 + 2];
    const key =
      Math.round(x * inv) + '_' + Math.round(y * inv) + '_' + Math.round(z * inv);
    let idx = map.get(key);
    if (idx === undefined) {
      idx = positions.length / 3;
      positions.push(x, y, z);
      map.set(key, idx);
    }
    indices[i] = idx;
  }
  return {
    positions: new Float32Array(positions),
    indices,
    bbox: size,
    center: [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2],
  };
}

// Smooth (area-weighted) vertex normals from indexed geometry.
function computeNormals(positions, indices) {
  const normals = new Float32Array(positions.length);
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3;
    const b = indices[i + 1] * 3;
    const c = indices[i + 2] * 3;
    const ax = positions[a], ay = positions[a + 1], az = positions[a + 2];
    const bx = positions[b], by = positions[b + 1], bz = positions[b + 2];
    const cx = positions[c], cy = positions[c + 1], cz = positions[c + 2];
    const e1x = bx - ax, e1y = by - ay, e1z = bz - az;
    const e2x = cx - ax, e2y = cy - ay, e2z = cz - az;
    // cross product (magnitude == 2*area, so it area-weights naturally)
    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;
    normals[a] += nx; normals[a + 1] += ny; normals[a + 2] += nz;
    normals[b] += nx; normals[b + 1] += ny; normals[b + 2] += nz;
    normals[c] += nx; normals[c + 1] += ny; normals[c + 2] += nz;
  }
  for (let i = 0; i < normals.length; i += 3) {
    const len = Math.hypot(normals[i], normals[i + 1], normals[i + 2]) || 1;
    normals[i] /= len; normals[i + 1] /= len; normals[i + 2] /= len;
  }
  return normals;
}

async function buildGLB(entry) {
  const srcPath = path.join(SRC_DIR, entry.source);
  if (!fs.existsSync(srcPath)) {
    console.warn(`  ⚠  SKIP ${entry.source} — file not found`);
    return null;
  }
  const stat = fs.statSync(srcPath);
  if (stat.size < 200) {
    console.warn(`  ⚠  SKIP ${entry.source} — empty/superseded (${stat.size} bytes)`);
    return null;
  }

  const buffer = fs.readFileSync(srcPath);
  const { positions: rawPos, triangles } = parseBinarySTL(buffer);
  if (triangles === 0) {
    console.warn(`  ⚠  SKIP ${entry.source} — 0 triangles`);
    return null;
  }

  const { positions, indices, bbox, center } = weldVertices(rawPos);
  // center on origin
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] -= center[0];
    positions[i + 1] -= center[1];
    positions[i + 2] -= center[2];
  }
  const normals = computeNormals(positions, indices);

  // Build glTF-Transform document.
  const doc = new Document();
  const buf = doc.createBuffer();
  const posAcc = doc
    .createAccessor('POSITION')
    .setType('VEC3')
    .setArray(positions)
    .setBuffer(buf);
  const normAcc = doc
    .createAccessor('NORMAL')
    .setType('VEC3')
    .setArray(normals)
    .setBuffer(buf);
  const idxAcc = doc
    .createAccessor('indices')
    .setType('SCALAR')
    .setArray(indices)
    .setBuffer(buf);
  const mat = doc
    .createMaterial('chrome')
    .setBaseColorFactor([0.8, 0.82, 0.85, 1])
    .setMetallicFactor(0.9)
    .setRoughnessFactor(0.25);
  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', posAcc)
    .setAttribute('NORMAL', normAcc)
    .setIndices(idxAcc)
    .setMaterial(mat);
  const mesh = doc.createMesh(entry.out).addPrimitive(prim);
  const node = doc.createNode('specimen').setMesh(mesh);
  doc.createScene().addChild(node);

  // Decimate to target triangle budget.
  const ratio = Math.min(1, entry.target / triangles);
  const transforms = [weld({ tolerance: 0 })];
  if (ratio < 0.999) {
    transforms.push(
      simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.0015, lockBorder: false })
    );
  }
  transforms.push(prune(), dedup());
  await doc.transform(...transforms);

  // Final triangle count after decimation.
  const finalIdx = doc.getRoot().listMeshes()[0].listPrimitives()[0].getIndices();
  const finalTris = finalIdx ? finalIdx.getCount() / 3 : triangles;

  // Meshopt-compress.
  await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'high' }));

  const io = new NodeIO()
    .registerExtensions([EXTMeshoptCompression])
    .registerDependencies({
      'meshopt.decoder': MeshoptDecoder,
      'meshopt.encoder': MeshoptEncoder,
    });

  const outPath = path.join(OUT_DIR, entry.out);
  await io.write(outPath, doc);
  const outSize = fs.statSync(outPath).size;

  const bboxRounded = bbox.map((v) => Math.round(v));
  console.log(
    `  ✓ ${entry.source} → ${entry.out}  ${triangles.toLocaleString()} → ${Math.round(
      finalTris
    ).toLocaleString()} tris  (${(outSize / 1024 / 1024).toFixed(2)} MB)`
  );

  return {
    index: entry.index,
    n: entry.n,
    label: `Specimen ${entry.roman}`,
    source_file: entry.source,
    glb_path: `/models/${entry.out}`,
    tris: Math.round(finalTris),
    bbox: bboxRounded,
    fallback: !!entry.fallback,
  };
}

async function main() {
  console.log('\n▶ Li Lab mesh pipeline — STL → decimated Meshopt GLB\n');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  await MeshoptSimplifier.ready;
  await MeshoptEncoder.ready;
  await MeshoptDecoder.ready;

  const manifest = [];
  for (const entry of CATALOG) {
    const result = await buildGLB(entry);
    if (result) manifest.push(result);
  }

  const manifestPath = path.join(OUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n▶ Wrote ${manifest.length} specimens → ${path.relative(ROOT, manifestPath)}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
