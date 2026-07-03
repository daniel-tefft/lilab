'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV_LINKS, SITE } from '@/content/site';

export default function Nav() {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`nav ${condensed ? 'nav--condensed' : ''}`}>
      <Link href="/" className="nav__wordmark" aria-label={`${SITE.labName} home`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="nav__logo"
          src="/tamu-logo.png"
          alt="Texas A&M University"
          width={40}
          height={26}
        />
        <span className="nav__sep" aria-hidden="true">|</span>
        <span className="nav__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="nav__mark"
            src="/li-lab-mark.svg"
            alt=""
            width={30}
            height={55}
          />
          <span className="nav__brand-text">{SITE.wordmark}</span>
        </span>
      </Link>

      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'CLOSE' : 'MENU'}
      </button>

      <nav
        id="primary-nav"
        className={`nav__links ${open ? 'nav__links--open' : ''}`}
        aria-label="Primary"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="nav__link"
            aria-current={pathname === link.href ? 'page' : undefined}
          >
            <span className="nav__cd" aria-hidden="true">cd </span>
            {link.label.toLowerCase()}
          </Link>
        ))}
      </nav>
    </header>
  );
}
