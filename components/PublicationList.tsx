/**
 * Publication list. Emphasizes lab-member surnames in author strings and shows
 * verified links only. `limit` renders a featured subset (Home); omit for the
 * full list (/publications).
 */
import { PUBLICATIONS, LAB_SURNAMES, type Publication } from '@/content/publications';

/** Venues shown as their logo instead of text. */
const VENUE_LOGOS: Record<string, string> = {
  Nature: '/nature-logo.png',
  'Proceedings of the National Academy of Sciences (PNAS)': '/pnas-logo.png',
  Immunity: '/immunity-logo.png',
  'Nature Structural & Molecular Biology': '/nsmb-logo.png',
  'Advances in Immunology': '/advances-in-immunology-logo.png',
};

/** Logos that are a stacked, multi-line lockup need extra height to stay
 *  legible — a single shared line-height would compress the whole mark. */
const VENUE_LOGOS_TALL = new Set(['Nature Structural & Molecular Biology']);

/** Wordmarks that read too small at the base height and want a larger lockup. */
const VENUE_LOGOS_LARGE = new Set(['Immunity', 'Advances in Immunology']);

/** Logos rendered as a solid-red fill via CSS mask (the source art is a dark
 *  wordmark, so a plain color filter can't cleanly recolor it). */
const VENUE_LOGOS_RED = new Set(['Nature Structural & Molecular Biology']);

function AuthorLine({ authors }: { authors: string }) {
  // Emphasize lab surnames without altering the verified author string.
  const parts = authors.split(/(,\s*)/);
  return (
    <p className="pub__authors">
      {parts.map((part, i) => {
        const isLab = LAB_SURNAMES.some((s) =>
          new RegExp(`(^|\\s)${s}\\b`).test(part)
        );
        return isLab ? (
          <span className="me" key={i}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </p>
  );
}

function PubRow({ pub }: { pub: Publication }) {
  return (
    <article className="pub" data-reveal="up-sm">
      <div className="pub__year mono">{pub.year}</div>
      <div className="pub__main">
        <h3 className="pub__title">
          {pub.title}
          {pub.flagship && <span className="pub__flag">Flagship</span>}
        </h3>
        <AuthorLine authors={pub.authors} />
        <div className="pub__venue">
          {VENUE_LOGOS[pub.venue] ? (
            VENUE_LOGOS_RED.has(pub.venue) ? (
              <span
                className={`pub__venue-logo pub__venue-logo--red${VENUE_LOGOS_TALL.has(pub.venue) ? ' pub__venue-logo--tall' : ''}`}
                style={{
                  WebkitMaskImage: `url(${VENUE_LOGOS[pub.venue]})`,
                  maskImage: `url(${VENUE_LOGOS[pub.venue]})`,
                }}
                role="img"
                aria-label={pub.venue}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={`pub__venue-logo${VENUE_LOGOS_TALL.has(pub.venue) ? ' pub__venue-logo--tall' : ''}${VENUE_LOGOS_LARGE.has(pub.venue) ? ' pub__venue-logo--lg' : ''}`}
                src={VENUE_LOGOS[pub.venue]}
                alt={pub.venue}
              />
            )
          ) : (
            pub.venue
          )}
        </div>
      </div>
      <div className="pub__links">
        {pub.doi && (
          <a className="pub__link" href={pub.doi} target="_blank" rel="noopener noreferrer">
            DOI
          </a>
        )}
        {pub.pdf && (
          <a className="pub__link" href={pub.pdf} target="_blank" rel="noopener noreferrer">
            PDF
          </a>
        )}
        {pub.code && (
          <a className="pub__link" href={pub.code} target="_blank" rel="noopener noreferrer">
            Code
          </a>
        )}
      </div>
    </article>
  );
}

export default function PublicationList({ limit }: { limit?: number }) {
  const pubs = limit ? PUBLICATIONS.slice(0, limit) : PUBLICATIONS;
  return (
    <div className="pub-list">
      {pubs.map((pub) => (
        <PubRow key={`${pub.year}-${pub.title}`} pub={pub} />
      ))}
    </div>
  );
}
