'use client';

/**
 * Interactive, citable structure card for the Impact & Support section. Unlike
 * the anonymous gallery specimens (StructureStage), this one is deliberately
 * attributed — it's paired with its published citation directly beneath it.
 */
import dynamic from 'next/dynamic';
import { CGAS_STRUCTURE_FEATURE } from '@/content/impact';

const CgasNucleosomeCanvas = dynamic(
  () => import('@/components/three/CgasNucleosomeCanvas'),
  { ssr: false }
);

export default function ImpactStructureFeature() {
  return (
    <div className="impact-structure" data-reveal="scale">
      <div className="impact-structure__canvas">
        <CgasNucleosomeCanvas />
        <span className="impact-structure__hint">Drag to rotate — pinch to zoom</span>
      </div>
      <p className="impact-structure__caption">{CGAS_STRUCTURE_FEATURE.caption}</p>
      <p className="impact-structure__citation">
        {CGAS_STRUCTURE_FEATURE.citationMLA}{' '}
        <a
          className="link-underline"
          href={CGAS_STRUCTURE_FEATURE.doi}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CGAS_STRUCTURE_FEATURE.doi}
        </a>
      </p>
    </div>
  );
}
