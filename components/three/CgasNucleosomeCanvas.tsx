'use client';

/**
 * Canvas wrapper for the cGAS-nucleosome feature. Bounded and inline (not the
 * fixed persistent stage) — it lives inside a normal card in the Impact &
 * Support section, so it can carry a citation directly beneath it.
 */
import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  Lightformer,
  OrbitControls,
  ContactShadows,
} from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CgasNucleosomeMesh } from './CgasNucleosomeMesh';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Plain two-finger scroll (trackpad/mouse wheel) should scroll the PAGE, not
 * zoom the viewer — only a pinch gesture should zoom. Browsers report trackpad
 * pinch as a wheel event with ctrlKey set (there's no native "pinch" event for
 * non-touch trackpads), so a capture-phase listener on an ancestor toggles
 * OrbitControls' enableZoom for that one event, strictly before OrbitControls'
 * own listener (on the canvas, at the target phase) reads it. We never call
 * stopPropagation, so the event still bubbles to the window where Lenis
 * handles the actual page scroll — blocking propagation here would silently
 * break scrolling over the canvas entirely, not just the zoom.
 * Real touch-pinch (mobile) never fires wheel events at all, so it's
 * unaffected and always works via OrbitControls' own touch handling.
 */
function usePinchOnlyZoom(
  wrapperRef: React.RefObject<HTMLDivElement>,
  controlsRef: React.RefObject<OrbitControlsImpl>
) {
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const controls = controlsRef.current;
      if (!controls) return;
      controls.enableZoom = e.ctrlKey;
      if (!e.ctrlKey) {
        // Restore the default so an unrelated touch-pinch right after a plain
        // scroll isn't left blocked by this transient, per-event override.
        requestAnimationFrame(() => {
          if (controlsRef.current) controlsRef.current.enableZoom = true;
        });
      }
    };
    el.addEventListener('wheel', onWheel, { capture: true, passive: true });
    return () => el.removeEventListener('wheel', onWheel, { capture: true });
  }, [wrapperRef, controlsRef]);
}

function ViewerEnvironment() {
  return (
    <Environment resolution={256}>
      <group>
        <Lightformer intensity={2} position={[0, 4, -5]} scale={[8, 5, 1]} color="#f2f4f7" />
        <Lightformer intensity={1} position={[-5, 0, 3]} scale={[5, 7, 1]} color="#9aa3b2" />
        <Lightformer intensity={1.2} position={[5, -1, 3]} scale={[5, 7, 1]} color="#c9cdd3" />
        <Lightformer intensity={0.7} position={[0, -4, 2]} scale={[8, 3, 1]} color="#3b82f6" />
      </group>
    </Environment>
  );
}

export default function CgasNucleosomeCanvas() {
  const reduced = useReducedMotion();
  const interacting = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  usePinchOnlyZoom(wrapperRef, controlsRef);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0.3, 6.4], fov: 38, near: 0.1, far: 100 }}
        frameloop="always"
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 6, 4]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-6, -2, -4]} intensity={0.45} color="#7c8aa5" />

        <ViewerEnvironment />

        <Suspense fallback={null}>
          <CgasNucleosomeMesh reduced={reduced} interacting={interacting} />
          <ContactShadows
            position={[0, -2.2, 0]}
            opacity={0.45}
            scale={10}
            blur={2.4}
            far={4}
            resolution={512}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableZoom
          // Zooming in to inspect detail matters far more than zooming out, so
          // the out-limit is kept tight (just past the default framing).
          minDistance={2.6}
          maxDistance={7}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          onStart={() => {
            interacting.current = true;
            clearTimeout(resumeTimer.current);
          }}
          onEnd={() => {
            resumeTimer.current = setTimeout(() => {
              interacting.current = false;
            }, 1200);
          }}
        />
      </Canvas>
    </div>
  );
}
