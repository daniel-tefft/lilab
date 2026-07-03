# Li Lab — website

Dark, terminal-flavored site for the **Li lab** (structural biology of innate
immunity, Texas A&M). The homepage opens with an **animated gel-electrophoresis
hero** (synthetic SVG) under a centered mission headline. Further down, in
**Impact & Support**, one cryo-EM structure — the cGAS–nucleosome tethering
complex from Zhao et al., *Nature* 2020 — appears as a small, interactive,
**explicitly attributed** 3D viewer (drag to rotate, pinch to zoom) with its
caption and MLA citation directly beneath it. A subtle terminal/CLI theme
(cd-prefixed nav, prompt lines, blinking cursor) runs throughout. Research,
people, publications, funding, recruiting, and contact are delivered with equal
craft.

Built with **Next.js (App Router) + TypeScript**, **React Three Fiber + drei**,
**GSAP/ScrollTrigger**, **Lenis** smooth scroll, and **Tailwind**.

## Design notes

- **Gel hero** (`components/GelHero.tsx`) — fully synthetic SVG gel: 7 lanes of
  glowing bands that subtly migrate + breathe, charcoal background fading into
  the void top/bottom. Decorative and abstract — not presented as real data.
- **One interactive structure** — `components/ImpactStructureFeature.tsx`
  (in the Impact & Support section) dynamically imports
  `components/three/CgasNucleosomeCanvas.tsx`, a small bounded/square R3F
  canvas (not a fixed/full-viewport stage). Unlike a hypothetical anonymous
  gallery, this one is deliberately captioned and cited — see Editorial
  honesty below.
- **Terminal theme (moderate)** — `LI LAB` wordmark with a blinking cursor (no
  A&M logo in the nav, per request — the real A&M lettermark PNG appears in
  the footer, `/people`, and `/contact` as affiliation). Nav links are
  `cd research`, `cd people`, … Prompt lines use `.term-prompt`; buttons use
  `.term-btn`. All in `app/globals.css`.
- **No dedicated /join page** — the homepage's "Build instruments for
  immunity" section carries the recruiting stance, a "How to apply" list
  (`content/openings.ts` → `HOW_TO_APPLY`), and a single "Email Professor Li"
  CTA. Prospective contacts otherwise use `/contact`.

---

## Editorial honesty (load-bearing)

**`CGAS_STRUCTURE_FEATURE`** (`content/impact.ts`), the one interactive
structure on the site, is the deliberate *exception*: it's captioned ("Cryo-EM
density map of mouse cGAS–nucleosome complex") and paired with a full MLA
citation + DOI, because the PI explicitly asked for it to be attributed.

If an **anonymous** gallery of sculptural structures is ever reintroduced (the
original design called for one — see `scripts/prep-meshes.mjs` below, which is
unused today but kept as reusable tooling), it must show **only real,
non-scientific geometry** and never protein names, resolutions, or PDB/EMDB
IDs:

- a neutral gallery index (a catalog sequence, not an ID)
- triangle count of the loaded mesh
- bounding box in **model units** (`u`, never `Å`)
- live rotation / scroll progress

When editing content, **never invent** science, citations, names, resolutions,
or structure identities — and never let the two systems (anonymous vs.
attributed) blend together.

---

## Quick start

```bash
npm install
npm run dev           # http://localhost:3000
npm run build && npm run start   # production
```

> Don't run `npm run build` while `npm run dev` is also running against the
> same directory — both write to `.next/` and can corrupt each other's build
> cache (you'll see `Cannot find module './NNN.js'` errors). Stop the dev
> server first, or build in a separate checkout.

`npm run prep:meshes` re-runs the anonymous-specimen STL → GLB pipeline (see
below); it has no current consumer, so you only need it if you're reviving
that gallery.

---

## Project structure

```
app/                       # routes (/, /research, /people, /publications, /contact)
  layout.tsx               # fonts, metadata, SmoothScroll, Nav/Footer, RevealInit
  globals.css              # design tokens + all component styles
components/
  three/
    CgasNucleosomeCanvas.tsx  # bounded R3F canvas: lighting, OrbitControls (drag/pinch)
    CgasNucleosomeMesh.tsx    # loads the GLB, chrome material, auto-frame, idle spin
  ImpactStructureFeature.tsx  # card wrapper: canvas + hint + caption + MLA citation
  ImpactBand.tsx               # Impact & Support section (stats, funders, the structure)
  GelHero.tsx                  # animated synthetic gel-electrophoresis homepage hero
  SmoothScroll.tsx             # Lenis <-> ScrollTrigger wiring (single scroll authority)
  RevealInit.tsx                # batched, varied [data-reveal] scroll reveals
  Nav.tsx / Footer.tsx (real A&M logo: public/tamu-logo.png)
  PublicationList.tsx / PersonCard.tsx
content/                   # the editable data layer (see below)
lib/
  useReducedMotion.ts      # prefers-reduced-motion + low-power heuristics
scripts/
  build-cgas-mesh.mjs      # one-off: raw_stl/cgas_nucleosome_tethering.stl -> the live GLB
  prep-meshes.mjs          # anonymous-specimen pipeline; currently unused, kept for reuse
raw_stl/                   # source meshes (git-ignored; large)
public/models/             # generated *.glb (cgas-nucleosome.glb is the only one in use)
```

---

## Editing content (no JSX required)

Everything editable lives in `content/` as typed `.ts` files. Adding a paper,
person, or funder is a one-file edit.

| To change… | Edit | Notes |
|---|---|---|
| A **publication** | `content/publications.ts` | Append to `PUBLICATIONS` (reverse-chronological). Real citations only; leave `doi/pdf/code` undefined if unverified. Lab surnames in `LAB_SURNAMES` are auto-emphasized. Venue `'Nature'` or the PNAS venue string auto-render a logo instead of text — see `VENUE_LOGOS` in `PublicationList.tsx`. |
| A **person** | `content/people.ts` | Append to `PEOPLE` with a `group` (`pi`/`postdoc`/`grad`/`undergrad`/`staff`/`alumni`). `photo` is optional → falls back to an initials monogram. |
| A **research area** | `content/research.ts` | Each area has a static figure image (`public/research/*.jpg`) — no 3D tie-in. |
| **Impact / funding** | `content/impact.ts` | Verified signals only. `confirmBeforeLaunch` can flag a drifting number for PI confirmation (not currently used). Also holds `CGAS_STRUCTURE_FEATURE` (glb path, caption, citation, DOI). |
| **How to apply** | `content/openings.ts` | `HOW_TO_APPLY` steps, rendered on the homepage CTA. |
| **Site identity / contact** | `content/site.ts` | Wordmark, thesis, address, email, `NAV_LINKS`. |

---

## The mesh pipelines

Two independent, one-off STL → GLB conversion scripts (both do manual binary
STL parsing — no DOM/three loaders — then vertex welding, smooth normals,
centering, meshoptimizer decimation, and Meshopt compression):

- **`scripts/build-cgas-mesh.mjs`** — live. Produced `public/models/cgas-nucleosome.glb`
  from `raw_stl/cgas_nucleosome_tethering.stl`; this is the GLB
  `CgasNucleosomeCanvas.tsx` actually loads.
- **`scripts/prep-meshes.mjs`** — the original anonymous-specimen pipeline.
  `CATALOG` at the top maps `raw_stl/*.stl` → `public/models/manifest.json` +
  GLBs. **Currently has no consumer** — kept as reusable tooling in case an
  anonymous gallery is rebuilt. Deliberately kept separate from the cGAS
  script so an attributed structure never accidentally ends up in the
  anonymous catalog, or vice versa.

`raw_stl/` also holds a few other unreferenced source STLs, kept on disk as
original, hard-to-replace mesh exports even though nothing currently converts
them.

---

## Tuning the look

- **Design tokens** — `app/globals.css` `:root` and `tailwind.config.ts`
  (`--void`, `--carbon`, `--chrome`, `--steel`, `--accent`).
- **Structure material** — `components/three/CgasNucleosomeMesh.tsx`:
  `MeshPhysicalMaterial` (`metalness ~0.9`, low roughness, light clearcoat).
- **Lighting / reflections** — `components/three/CgasNucleosomeCanvas.tsx`
  `ViewerEnvironment` uses drei `Lightformer`s (HDRI-free, works offline).
- **Zoom limits** — `OrbitControls` in `CgasNucleosomeCanvas.tsx`:
  `minDistance`/`maxDistance` are intentionally asymmetric (generous zoom-in,
  tight zoom-out cap). Plain wheel/trackpad scroll is deliberately left alone
  (doesn't hijack page scroll) — only a pinch gesture (`ctrlKey` on trackpads,
  real multi-touch on mobile) zooms; see the comment in that file.
- **Motion** — page-load reveal in `GelHero.tsx`; scroll reveals in
  `RevealInit.tsx` (vary `data-reveal="up|up-sm|left|right|scale|mask"`).

---

## Accessibility, performance & fallbacks

- **Reduced motion** (`prefers-reduced-motion`) — Lenis off (native scroll),
  gel hero bands static, structure viewer auto-rotate off (drag/pinch still
  work).
- **No-JS / no-3D** — the structure canvas is `ssr:false` and loads inside a
  bounded card (no layout shift); all navigation and meaning remain fully
  usable without it.
- **Semantics** — landmarks, skip link, visible keyboard focus, ARIA labels,
  monogram alt fallbacks.

---

## Tech stack

Next.js 14 · React 18 · TypeScript · @react-three/fiber + @react-three/drei ·
GSAP + ScrollTrigger · Lenis · Tailwind · gltf-transform + meshoptimizer
(build-time mesh pipelines).
