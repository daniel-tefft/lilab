import Link from 'next/link';
import { SITE } from '@/content/site';

export default function Footer() {
  return (
    <footer className="footer content-layer">
      <div className="shell footer__grid">
        <div className="footer__brand">
          <div className="footer__wordmark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="footer__logo"
              src="/tamu-logo.png"
              alt="Texas A&M University"
              width={48}
              height={31}
            />
            <span>{SITE.labName}</span>
          </div>
          <p className="footer__thesis">{SITE.tagline}</p>
        </div>

        <div className="footer__col">
          <h2 className="footer__h">Affiliation</h2>
          <p>{SITE.institution}</p>
          <p>
            {SITE.office} · {SITE.address}
          </p>
        </div>

        <div className="footer__col">
          <h2 className="footer__h">Contact</h2>
          <p>
            <a className="link-underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
          <p>
            <a className="link-underline" href={SITE.phoneHref}>
              {SITE.phone}
            </a>
          </p>
          <p>
            <a
              className="link-underline"
              href={SITE.scholar}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Scholar
            </a>
          </p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__h">Site</h2>
          <Link className="link-underline" href="/research">
            Research
          </Link>
          <Link className="link-underline" href="/people">
            People
          </Link>
          <Link className="link-underline" href="/publications">
            Publications
          </Link>
          <Link className="link-underline" href="/contact">
            Contact
          </Link>
        </nav>
      </div>

      <div className="shell footer__base">
        <span className="mono footer__credit">
          © {new Date().getFullYear()} {SITE.labName} · {SITE.pi}
        </span>
        <span className="mono footer__credit footer__credit--muted">
          Structures shown as abstract form. No scientific claims are made by the
          3D visuals.
        </span>
      </div>
    </footer>
  );
}
