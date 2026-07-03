'use client';

/**
 * Global reveal initializer: batches all [data-reveal] elements into a single
 * ScrollTrigger so non-structure sections animate in with deliberate, varied
 * easing (avoiding the "everything fades up 20px" tell — direction/scale vary
 * by `data-reveal` value). Honors prefers-reduced-motion (instant, no motion).
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/useReducedMotion';

export default function RevealInit() {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const variants: Record<string, gsap.TweenVars> = {
      up: { y: 34, opacity: 0 },
      'up-sm': { y: 18, opacity: 0 },
      left: { x: -40, opacity: 0 },
      right: { x: 40, opacity: 0 },
      scale: { scale: 0.94, opacity: 0, transformOrigin: 'center' },
      mask: { y: 60, opacity: 0 },
    };

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      els.forEach((el) => {
        const kind = el.dataset.reveal || 'up';
        const from = variants[kind] || variants.up;
        const delay = parseFloat(el.dataset.revealDelay || '0');
        gsap.from(el, {
          ...from,
          duration: 1.05,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      });
      ScrollTrigger.refresh();

      // Images (e.g. research figures) can still be loading at this point;
      // an unloaded <img> has no intrinsic height, so the trigger positions
      // computed above can be wrong for anything below/around it — leaving
      // that reveal stuck at opacity:0 until a manual scroll forces a
      // recalculation. Refresh again once any in-flight images resolve.
      const pendingImages = gsap.utils
        .toArray<HTMLImageElement>('img')
        .filter((img) => !img.complete);
      if (pendingImages.length) {
        let remaining = pendingImages.length;
        const onLoad = () => {
          remaining -= 1;
          if (remaining <= 0) ScrollTrigger.refresh();
        };
        pendingImages.forEach((img) => {
          img.addEventListener('load', onLoad, { once: true });
          img.addEventListener('error', onLoad, { once: true });
        });
      }
    });

    return () => ctx.revert();
  }, [reduced, pathname]);

  return null;
}
