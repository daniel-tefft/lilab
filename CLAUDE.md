# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # start dev server at http://localhost:3000
npm run build         # production build
npm run start         # serve production build
npm run lint          # ESLint via next lint
npm run prep:meshes   # STL → GLB pipeline (only if you add a new anonymous specimen)
```

There are no test files in this project.

## Architecture

**Next.js 14 App Router** with a fully static content layer. There is no persistent/fixed 3D canvas — the only 3D content is a single bounded, inline R3F viewer in the Impact & Support section (see below). An earlier "fixed-canvas" design (a full-viewport pinned `<Canvas>` driving an always-on HUD via a zustand store) was built but never wired into any page; it was removed as dead code. If you want a scroll-driven, full-bleed 3D hero again, it needs to be rebuilt and actually imported from a page — nothing currently references that pattern.

### The one interactive 3D structure

`components/ImpactStructureFeature.tsx` (rendered from `ImpactBand.tsx`) dynamically imports `components/three/CgasNucleosomeCanvas.tsx` (`ssr: false`, since R3F can't SSR). It's a small, bounded, square canvas — not fixed/full-viewport — with its own `OrbitControls` (drag to rotate, pinch to zoom; plain wheel/trackpad scroll is intentionally left alone so it doesn't hijack page scroll — see the comment in that file). Unlike a hypothetical anonymous gallery, this structure is **deliberately attributed**: a caption and full MLA citation render directly beneath it (data in `content/impact.ts` → `CGAS_STRUCTURE_FEATURE`).

### Scroll authority

`SmoothScroll.tsx` is the single scroll authority: Lenis is driven by GSAP's ticker (no competing rAF loops), and GSAP `ScrollTrigger` reads Lenis for scroll-linked reveals (`RevealInit.tsx`). When `prefers-reduced-motion` is set, Lenis is disabled and native scroll is used — `ScrollTrigger.refresh()` still runs so reveals work.

### Content layer

All editable data lives in `content/*.ts` as typed TypeScript. No JSX required to update copy, people, publications, or impact stats. Key files:

| File | Contents |
|---|---|
| `content/site.ts` | Lab name, tagline, address, contact |
| `content/people.ts` | `PEOPLE` array with `group` field (`pi`/`postdoc`/`grad`/`undergrad`/`staff`/`alumni`) |
| `content/publications.ts` | `PUBLICATIONS` array; `LAB_SURNAMES` drives auto-bold; venue `'Nature'` auto-renders the Nature logo instead of text (see `PublicationList.tsx`) |
| `content/research.ts` | Research areas, each with a static figure image (`research/*.jpg`) — no 3D tie-in |
| `content/impact.ts` | Funding/impact signals (`confirmBeforeLaunch` can flag a drifting number for PI confirmation, though nothing currently uses it) plus `CGAS_STRUCTURE_FEATURE` (the one attributed interactive structure: GLB path, caption, MLA citation, DOI) |
| `content/openings.ts` | Recruiting stance and how-to-apply text |

### Mesh pipeline

Two independent, one-off STL → GLB conversion scripts (both manual binary STL parsing, no DOM/three loaders — vertex welding, smooth normals, centering, meshoptimizer decimation, Meshopt compression):

- `scripts/prep-meshes.mjs` — the original anonymous-specimen pipeline. `CATALOG` maps `raw_stl/*.stl` → `public/models/manifest.json` + GLBs. **Currently has no consumer** (the gallery that read `manifest.json` was removed); it's kept as reusable tooling in case an anonymous gallery is rebuilt. Re-running it will regenerate `public/models/specimen.glb` + `manifest.json` from `raw_stl/structure4_p17_J156_005.stl`, but nothing reads that output today.
- `scripts/build-cgas-mesh.mjs` — one-off script that produced `public/models/cgas-nucleosome.glb` from `raw_stl/cgas_nucleosome_tethering.stl`. This one **is** live (it's the GLB `CgasNucleosomeCanvas.tsx` loads). Deliberately kept separate from `prep-meshes.mjs`/`manifest.json` — this structure is attributed, so it must never be merged into the anonymous-specimen catalog.

`raw_stl/` also holds a few other unreferenced source STLs (`cryosparc1.stl`, `structure2.stl`, `structure3.stl`, `structure5_p12_J102_004.stl`) kept on disk as original, hard-to-replace mesh exports even though nothing currently converts them.

### Motion and accessibility

- `lib/useReducedMotion.ts` — `prefers-reduced-motion` + low-power heuristics (mobile/battery API); used by `GelHero.tsx` and `CgasNucleosomeCanvas.tsx`
- Reduced motion: Lenis off, gel hero bands static, structure viewer auto-rotate off (drag/pinch still work)
- All content works without JS/WebGL — the 3D viewer is the only thing that degrades, and it degrades gracefully (Suspense fallback, no layout shift)

### Design tokens

Defined in `app/globals.css` (`:root`) and `tailwind.config.ts`: `--void`, `--carbon`, `--chrome`, `--steel`, `--accent`. Fonts: Space Grotesk (display), Inter (sans), JetBrains Mono (mono).

Scroll reveals use `data-reveal` attributes with values `up | up-sm | left | right | scale | mask` — batched by `RevealInit.tsx`.

## Editorial honesty (load-bearing constraint)

If an **anonymous** gallery of sculptural structures is ever reintroduced (e.g. by reviving `scripts/prep-meshes.mjs`'s output), it must show only real, non-scientific geometry — neutral gallery index, actual triangle count, bounding box in model units (`u`, never `Å`), live rotation/scroll progress. **Never add** protein names, PDB/EMDB IDs, resolutions, or any field implying biological identity for those anonymous meshes.

This constraint does **not** apply to `CGAS_STRUCTURE_FEATURE` in `content/impact.ts` — that structure is intentionally the opposite case: explicitly attributed, captioned, and cited (Zhao et al., *Nature* 2020), per direct PI request. The two are deliberately kept as separate systems (see Mesh pipeline above) so attribution is never accidentally mixed into the anonymous case, or vice versa.
