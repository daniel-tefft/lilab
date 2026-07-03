/**
 * One-off STL -> GLB conversion for the cGAS-nucleosome structure featured
 * (with citation) in the Impact & Support section.
 *
 * This is intentionally SEPARATE from scripts/prep-meshes.mjs and its
 * manifest.json: that pipeline feeds the anonymous specimen gallery (no
 * identity may ever be attached to those meshes). This structure is the
 * opposite case — the PI explicitly wants it attributed to Zhao et al.,
 * Nature 2020 — so it must never be merged into the anonymous CATALOG/manifest.
 *
 * Reuses the same parse/weld/decimate/meshopt-compress steps as
 * prep-meshes.mjs. Run manually: `node scripts/build-cgas-mesh.mjs`.
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
const SRC_PATH = path.join(ROOT, 'raw_stl', 'cgas_nucleosome_tethering.stl');
const OUT_PATH = path.join(ROOT, 'public', 'models', 'cgas-nucleosome.glb');
const TARGET_TRIS = 150_000;

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
    offset += 12;
    for (let v = 0; v < 3; v++) {
      positions[p++] = dv.getFloat32(offset, true);
      positions[p++] = dv.getFloat32(offset + 4, true);
      positions[p++] = dv.getFloat32(offset + 8, true);
      offset += 12;
    }
    offset += 2;
  }
  return { positions, triangles };
}

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

async function main() {
  console.log('\n▶ cGAS-nucleosome mesh — STL → Meshopt GLB\n');
  await MeshoptSimplifier.ready;
  await MeshoptEncoder.ready;
  await MeshoptDecoder.ready;

  const buffer = fs.readFileSync(SRC_PATH);
  const { positions: rawPos, triangles } = parseBinarySTL(buffer);
  if (triangles === 0) throw new Error('0 triangles parsed from STL');

  const { positions, indices, bbox, center } = weldVertices(rawPos);
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] -= center[0];
    positions[i + 1] -= center[1];
    positions[i + 2] -= center[2];
  }
  const normals = computeNormals(positions, indices);

  const doc = new Document();
  const buf = doc.createBuffer();
  const posAcc = doc.createAccessor('POSITION').setType('VEC3').setArray(positions).setBuffer(buf);
  const normAcc = doc.createAccessor('NORMAL').setType('VEC3').setArray(normals).setBuffer(buf);
  const idxAcc = doc.createAccessor('indices').setType('SCALAR').setArray(indices).setBuffer(buf);
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
  const mesh = doc.createMesh('cgas-nucleosome').addPrimitive(prim);
  const node = doc.createNode('cgas-nucleosome').setMesh(mesh);
  doc.createScene().addChild(node);

  const ratio = Math.min(1, TARGET_TRIS / triangles);
  const transforms = [weld({ tolerance: 0 })];
  if (ratio < 0.999) {
    transforms.push(
      simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.0015, lockBorder: false })
    );
  }
  transforms.push(prune(), dedup());
  await doc.transform(...transforms);

  const finalIdx = doc.getRoot().listMeshes()[0].listPrimitives()[0].getIndices();
  const finalTris = finalIdx ? finalIdx.getCount() / 3 : triangles;

  await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'high' }));

  const io = new NodeIO()
    .registerExtensions([EXTMeshoptCompression])
    .registerDependencies({
      'meshopt.decoder': MeshoptDecoder,
      'meshopt.encoder': MeshoptEncoder,
    });

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  await io.write(OUT_PATH, doc);
  const outSize = fs.statSync(OUT_PATH).size;

  console.log(
    `  ✓ ${path.basename(SRC_PATH)} → ${path.relative(ROOT, OUT_PATH)}  ${triangles.toLocaleString()} → ${Math.round(
      finalTris
    ).toLocaleString()} tris  bbox ${bbox.map((v) => Math.round(v)).join(' × ')}  (${(outSize / 1024 / 1024).toFixed(2)} MB)\n`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
