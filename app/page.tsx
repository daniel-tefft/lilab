import Link from 'next/link';
import GelHero from '@/components/GelHero';
import ImpactBand from '@/components/ImpactBand';
import PublicationList from '@/components/PublicationList';
import { SITE } from '@/content/site';
import { HOW_TO_APPLY } from '@/content/openings';

/**
 * Home — led by the photographic gel-electrophoresis hero, then straight into
 * the Impact & Support band, featured publications, and the recruiting CTA.
 * There is no dedicated /join page: prospective applicants email the PI
 * directly from this section (or via /contact).
 */

export default function HomePage() {
  return (
    <>
      <GelHero />

      {/* Impact & funding */}
      <ImpactBand />

      {/* Featured publications */}
      <section className="section shell content-layer" aria-labelledby="pubs-h">
        <div className="section__head">
          <span className="eyebrow" data-reveal="up-sm">
            Selected Work
          </span>
          <h2 id="pubs-h" className="section__title" data-reveal="up">
            Featured publications.
          </h2>
        </div>
        <PublicationList limit={5} />
        <div style={{ marginTop: '2rem' }} data-reveal="up-sm">
          <Link className="btn" href="/publications">
            All publications <span className="btn__arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Recruiting CTA */}
      <section className="section shell content-layer" aria-labelledby="join-cta-h">
        <div className="section__head">
          <h2 id="join-cta-h" className="section__title" data-reveal="up">
            Build instruments for immunity.
          </h2>
          <p className="lede" data-reveal="up" data-reveal-delay="0.1">
            The lab welcomes motivated researchers who want to study innate
            immunity at the level of atoms and machines.
          </p>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <h3
            className="section__title"
            style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2rem)' }}
            data-reveal="up"
          >
            How to apply
          </h3>
          <ol className="prose" data-reveal="up-sm" style={{ paddingLeft: '1.2rem', marginTop: '1rem' }}>
            {HOW_TO_APPLY.map((step, i) => (
              <li key={i} style={{ marginBottom: '0.9rem', color: 'var(--chrome)', lineHeight: 1.7 }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div style={{ marginTop: '1rem' }} data-reveal="up-sm">
          <Link className="btn" href={`mailto:${SITE.email}`}>
            Email Professor Li <span className="btn__arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
