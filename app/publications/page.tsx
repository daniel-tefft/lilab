import type { Metadata } from 'next';
import PublicationList from '@/components/PublicationList';
import { SCHOLAR_URL } from '@/content/impact';
import { PUBLICATIONS } from '@/content/publications';

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Peer-reviewed publications from the Li lab.',
};

/**
 * /publications — reverse-chronological list (already ordered in the data
 * layer). Seed list is verified; extend from Google Scholar. Lab members are
 * emphasized in author strings.
 */
export default function PublicationsPage() {
  const years = PUBLICATIONS.map((p) => p.year);
  const span = `${Math.min(...years)}–${Math.max(...years)}`;

  return (
    <div className="content-layer">
      <header className="page-hero shell">
        <span className="eyebrow" data-reveal="up-sm">
          Publications · {span}
        </span>
        <h1 className="section__title" data-reveal="up" style={{ marginTop: '1rem' }}>
          Selected &amp; recent work.
        </h1>
        <p className="lede" data-reveal="up" data-reveal-delay="0.1" style={{ marginTop: '1.4rem' }}>
          A verified selection; the full record continues on{' '}
          <a className="link-underline" href={SCHOLAR_URL} target="_blank" rel="noopener noreferrer">
            Google Scholar
          </a>
          .
        </p>
      </header>

      <section className="shell section--tight">
        <PublicationList />
        <div style={{ marginTop: '2.4rem' }} data-reveal="up-sm">
          <a className="btn" href={SCHOLAR_URL} target="_blank" rel="noopener noreferrer">
            View on Google Scholar <span className="btn__arrow">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
