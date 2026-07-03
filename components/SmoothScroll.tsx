'use client';

/**
 * Normalized smooth scroll (Lenis) wired into GSAP's ScrollTrigger so there is
 * a single scroll authority site-wide (spec §7). ScrollTrigger reads Lenis;
 * Lenis is driven by GSAP's ticker — no competing rAF loops.
 *
 * Honors prefers-reduced-motion: when reduced, Lenis is disabled and native
 * scrolling is used (ScrollTrigger still works).
 */
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/useReducedMotion';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      // Native scroll; still refresh ScrollTrigger for section reveals.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Let ScrollTrigger drive layout reads through Lenis.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
