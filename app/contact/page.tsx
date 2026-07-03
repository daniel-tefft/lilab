import type { Metadata } from 'next';
import { SITE } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the Li lab — Department of Biochemistry & Biophysics, Texas A&M University.',
};

/**
 * /contact — minimal, high-contrast. Verified contact details (spec §11.A.5).
 */
export default function ContactPage() {
  const mapsQuery = encodeURIComponent(
    'Interdisciplinary Life Sciences Building, 300 Olsen Blvd, College Station, TX 77843'
  );

  return (
    <div className="content-layer">
      <header className="page-hero shell">
        <span className="eyebrow" data-reveal="up-sm">
          Contact
        </span>
        <h1 className="section__title" data-reveal="up" style={{ marginTop: '1rem' }}>
          Get in touch.
        </h1>
      </header>

      <section className="shell section--tight">
        <div className="contact-grid" data-reveal="up">
          <div className="contact-cell">
            <div className="contact-cell__label">Principal Investigator</div>
            <div className="contact-cell__value">
              {SITE.pi}
              <br />
              <a className="link-underline" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              <br />
              <a className="link-underline" href={SITE.phoneHref}>
                {SITE.phone}
              </a>
            </div>
          </div>

          <div className="contact-cell">
            <div className="contact-cell__label">Office &amp; Mail</div>
            <div className="contact-cell__value">
              {SITE.office}
              <br />
              {SITE.institution}
              <br />
              {SITE.address}
            </div>
          </div>

          <div className="contact-cell">
            <div className="contact-cell__label">Affiliation</div>
            <div className="contact-cell__value" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="tamu-mark-logo"
                src="/tamu-logo.png"
                alt="Texas A&M University"
                width={22}
                height={22}
              />
              Texas A&amp;M University
            </div>
          </div>

          <div className="contact-cell">
            <div className="contact-cell__label">Online</div>
            <div className="contact-cell__value">
              <a className="link-underline" href={SITE.scholar} target="_blank" rel="noopener noreferrer">
                Google Scholar
              </a>
              <br />
              <a className="link-underline" href={SITE.department} target="_blank" rel="noopener noreferrer">
                Department profile
              </a>
            </div>
          </div>
        </div>

        <a
          className="btn"
          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: '2rem' }}
          data-reveal="up-sm"
        >
          Open in Maps <span className="btn__arrow">→</span>
        </a>
      </section>
    </div>
  );
}
