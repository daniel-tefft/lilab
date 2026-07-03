'use client';

/**
 * Homepage hero — an animated, synthetic agarose-gel electrophoresis panel
 * rendered in SVG (no image asset). Charcoal background with glowing bands that
 * subtly migrate + pulse; the panel fades top/bottom into the site's void.
 *
 * The gel is DECORATIVE and abstract — it is not presented as specific lab data
 * and carries no captions claiming results (consistent with the site's
 * editorial-honesty stance).
 *
 * Reduced motion: bands are static (animation disabled via CSS).
 */
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { SITE } from '@/content/site';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Band = { y: number; i: number; h?: number };
type Lane = { x: number; bands: Band[] };

// Deterministic layout (no Math.random — avoids hydration mismatch) loosely
// matching the reference mock: 7 lanes, varied band ladders.
const LANE_W = 132;
const LANES: Lane[] = [
  { x: 111, bands: [{ y: 150, i: 1.0 }, { y: 238, i: 0.72 }, { y: 332, i: 0.46 }] },
  { x: 273, bands: [{ y: 112, i: 0.8 }, { y: 172, i: 1.0, h: 8 }, { y: 336, i: 0.4 }] },
  { x: 435, bands: [{ y: 182, i: 0.86 }, { y: 214, i: 0.8 }, { y: 330, i: 0.42 }, { y: 372, i: 0.34 }] },
  { x: 597, bands: [{ y: 150, i: 0.92 }, { y: 236, i: 0.86 }, { y: 262, i: 0.8 }, { y: 332, i: 0.4 }] },
  { x: 759, bands: [{ y: 236, i: 0.82 }, { y: 262, i: 0.98, h: 8 }, { y: 342, i: 0.5 }] },
  { x: 921, bands: [{ y: 150, i: 0.84 }, { y: 330, i: 0.4 }] },
  { x: 1083, bands: [{ y: 120, i: 1.0 }, { y: 140, i: 0.95 }, { y: 160, i: 0.9 }, { y: 212, i: 0.8 }, { y: 300, i: 0.6 }, { y: 316, i: 0.58 }] },
];

const WELL_Y = 60;

// Deterministic pseudo-random. Values are ROUNDED before use: Math.sin can
// differ in the last few digits between Node (server) and the browser (client),
// so rounding keeps the serialized inline styles identical → no hydration
// mismatch.
const rand = (i: number, s: number) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const round = (n: number, d = 2) => Number(n.toFixed(d));

/**
 * Electrolysis bubbles. Running a gel electrolyzes the buffer: O2 forms at the
 * anode, H2 at the cathode, and a stream of fine bubbles rising from the
 * electrodes is the visual cue that current is flowing. These rise from the
 * bottom electrode and fizz upward through the buffer.
 */
type Bubble = {
  left: number;
  size: number;
  rise: number;
  drift: number;
  op: number;
  dur: number;
  delay: number;
};
const BUBBLES: Bubble[] = Array.from({ length: 34 }, (_, i) => {
  const size = 2 + rand(i, 2) * 4.5;
  const dur = 4.6 + rand(i, 3) * 5.4;
  return {
    left: round(1.5 + rand(i, 1) * 97),
    size: round(size),
    rise: round(150 + rand(i, 6) * 230, 1),
    drift: round((rand(i, 5) - 0.5) * 30, 1),
    // smaller bubbles are fainter; all stay subtle so the bands dominate
    op: round(0.16 + (1 - size / 6.5) * 0.4, 3),
    dur: round(dur),
    delay: round(-rand(i, 4) * dur),
  };
});

export default function GelHero() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-gel-prompt]', { opacity: 0, duration: 0.6 })
        .from('[data-gel-headline] span', { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.1)
        .from('.gel-svg', { opacity: 0, duration: 1.1 }, 0.3)
        .from('[data-gel-cta]', { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, 0.7);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // Split the headline into words for a staggered set-in.
  const words = SITE.heroHeadline.split(' ');

  return (
    <section className="gel-hero" ref={root} aria-label="Introduction">
      <div className="gel-hero__top shell">
        <p className="term-prompt" data-gel-prompt>
          <span className="term-prompt__path">~/li-lab</span>
          <span className="term-prompt__sym"> $ </span>
          <span className="term-prompt__cmd">cat mission.txt</span>
          <span className="term-cursor" aria-hidden="true" />
        </p>
        <h1 className="gel-hero__headline" data-gel-headline>
          {words.map((w, i) => (
            <span key={i}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>
      </div>

      <div className="gel-wrap" aria-hidden="true">
        <svg
          className="gel-svg"
          viewBox="0 0 1200 420"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Decorative gel electrophoresis panel"
        >
          <defs>
            {/* Uneven illumination: a brighter "hot" centre falling off to near
                black at the edges, like a real transilluminator exposure. */}
            <radialGradient id="gelField" cx="50%" cy="40%" r="78%">
              <stop offset="0%" stopColor="#1b2026" />
              <stop offset="48%" stopColor="#0f1216" />
              <stop offset="100%" stopColor="#06070a" />
            </radialGradient>
            {/* Darkens the corners — the lens vignette of a captured photo. */}
            <radialGradient id="gelVignette" cx="50%" cy="43%" r="74%">
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="72%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.78" />
            </radialGradient>
            {/* Horizontal falloff across each band so it fades into the lane
                edges instead of ending in a hard rectangle. */}
            <linearGradient id="bandGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="12%" stopColor="#eef4ff" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="88%" stopColor="#eef4ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            {/* Faint DNA smear trailing down each lane below the wells. */}
            <linearGradient id="smearGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9d8ea" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#c9d8ea" stopOpacity="0" />
            </linearGradient>
            {/* Roughens + softens the sharp band cores: turbulence displaces the
                edges (the gel "smile"/wobble) then a small blur fuzzes them. */}
            <filter id="bandWarp" x="-25%" y="-260%" width="150%" height="620%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.006" numOctaves="2" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="1.1" />
            </filter>
            {/* Same displacement, heavier blur — the bloom/halo around bands.
                Matching seed keeps the halo registered to its core. */}
            <filter id="haloWarp" x="-30%" y="-320%" width="160%" height="740%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.006" numOctaves="2" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="5" />
            </filter>
            {/* Low-frequency blotches — uneven gel slab + buffer mottling. */}
            <filter id="bgMottle">
              <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="3" seed="11" result="t" />
              <feColorMatrix in="t" type="saturate" values="0" />
            </filter>
            {/* Fine sensor grain. */}
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>

          {/* Illuminated field */}
          <rect x="0" y="0" width="1200" height="420" fill="url(#gelField)" />

          {/* Mottled unevenness across the slab */}
          <rect x="0" y="0" width="1200" height="420" filter="url(#bgMottle)" opacity="0.05" />

          {/* DNA smears trailing down each lane from the wells */}
          {LANES.map((lane, i) => (
            <rect
              key={`smear-${i}`}
              x={lane.x - LANE_W / 2 + 14}
              y={WELL_Y}
              width={LANE_W - 28}
              height={300}
              fill="url(#smearGrad)"
            />
          ))}

          {/* Loading wells (bright diffuse smears at the top of each lane) */}
          <g filter="url(#haloWarp)" opacity="0.8">
            {LANES.map((lane, i) => (
              <rect
                key={`well-${i}`}
                x={lane.x - LANE_W / 2 + 6}
                y={WELL_Y - 5}
                width={LANE_W - 12}
                height={11}
                rx={4}
                fill="url(#bandGrad)"
                opacity={0.7}
              />
            ))}
          </g>

          {/* Band halos (warped bloom) */}
          <g className="gel-migrate" filter="url(#haloWarp)">
            {LANES.map((lane, li) =>
              lane.bands.map((b, bi) => (
                <rect
                  key={`halo-${li}-${bi}`}
                  x={lane.x - LANE_W / 2 + 4}
                  y={b.y - (b.h ?? 6) / 2}
                  width={LANE_W - 8}
                  height={b.h ?? 6}
                  rx={3}
                  fill="url(#bandGrad)"
                  opacity={b.i * 0.5}
                />
              ))
            )}
          </g>

          {/* Band cores (warped + lightly blurred). Group breathing multiplies
              each band's own intensity, so relative brightness is preserved. */}
          <g className="gel-migrate gel-cores" filter="url(#bandWarp)">
            {LANES.map((lane, li) =>
              lane.bands.map((b, bi) => (
                <rect
                  key={`core-${li}-${bi}`}
                  x={lane.x - LANE_W / 2 + 8}
                  y={b.y - (b.h ?? 5) / 2}
                  width={LANE_W - 16}
                  height={b.h ?? 5}
                  rx={2.5}
                  fill="url(#bandGrad)"
                  opacity={b.i}
                />
              ))
            )}
          </g>

          {/* Corner vignette */}
          <rect x="0" y="0" width="1200" height="420" fill="url(#gelVignette)" />

          {/* Grain overlay */}
          <rect x="0" y="0" width="1200" height="420" filter="url(#grain)" opacity="0.085" />
        </svg>

        {/* Electrolysis bubbles rising from the bottom electrode */}
        <div className="gel-bubbles" aria-hidden="true">
          {BUBBLES.map((b, i) => (
            <span
              key={i}
              className="gel-bubble"
              style={
                {
                  left: `${b.left}%`,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  '--rise': `${b.rise}px`,
                  '--drift': `${b.drift}px`,
                  '--op': b.op,
                  animationDuration: `${b.dur}s`,
                  animationDelay: `${b.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div className="gel-hero__cta shell">
        <Link className="term-btn" href="/research" data-gel-cta>
          <span className="term-btn__bracket">[</span>
          explore the research
          <span className="term-btn__arrow">→</span>
          <span className="term-btn__bracket">]</span>
        </Link>
        <Link className="term-btn" href="/publications" data-gel-cta>
          <span className="term-btn__bracket">[</span>
          publications
          <span className="term-btn__bracket">]</span>
        </Link>
      </div>
    </section>
  );
}
