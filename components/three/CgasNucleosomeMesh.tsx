'use client';

/**
 * The cGAS-nucleosome structure featured (with citation, unlike the anonymous
 * gallery specimens) in the Impact & Support section. Self-contained: it does
 * NOT use the shared stage/store — it's a standalone card viewer the visitor
 * can drag/scroll to inspect.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const TARGET_RADIUS = 2.4;

export function CgasNucleosomeMesh({
  reduced,
  interacting,
}: {
  reduced: boolean;
  interacting: React.MutableRefObject<boolean>;
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);

  const { scene } = useGLTF('/models/cgas-nucleosome.glb', false, true);

  const { geometry, baseScale } = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;
    scene.traverse((o) => {
      if (!geo && (o as THREE.Mesh).isMesh) geo = (o as THREE.Mesh).geometry;
    });
    const g = (geo ?? new THREE.SphereGeometry(1)) as THREE.BufferGeometry;
    g.computeBoundingSphere();
    const r = g.boundingSphere?.radius ?? 1;
    return { geometry: g, baseScale: TARGET_RADIUS / r };
  }, [scene]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0.82, 0.85, 0.92),
        metalness: 0.9,
        roughness: 0.24,
        clearcoat: 0.55,
        clearcoatRoughness: 0.3,
        envMapIntensity: 1.2,
      }),
    []
  );

  useFrame((_, rawDelta) => {
    const g = group.current;
    if (!g) return;
    if (reduced || interacting.current) return;
    const delta = Math.min(rawDelta, 0.05);
    spin.current += delta * 0.16;
    g.rotation.y = spin.current;
  });

  return (
    <group ref={group} scale={baseScale}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
    </group>
  );
}

useGLTF.preload('/models/cgas-nucleosome.glb', false, true);
