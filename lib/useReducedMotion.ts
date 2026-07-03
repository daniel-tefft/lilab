'use client';

import { useEffect, useState } from 'react';

/** Tracks prefers-reduced-motion, updating live if the user changes it. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/**
 * Coarse "low power" heuristic for degrading the 3D stage on mobile / weak
 * devices (spec §5 fallbacks): small viewport, few cores, or no hover.
 */
export function useLowPower(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const cores = (navigator as Navigator & { hardwareConcurrency?: number })
      .hardwareConcurrency;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const small = window.innerWidth < 768;
    const fewCores = typeof cores === 'number' && cores <= 4;
    setLow(small || (coarse && fewCores));
  }, []);
  return low;
}
