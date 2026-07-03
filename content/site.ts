/**
 * Site-wide identity & contact (spec §11.A.1 / §11.A.5). Single source of truth
 * for the nav wordmark, footer, and /contact.
 */

export const SITE = {
  labName: 'Li Lab',
  wordmark: 'LI LAB',
  tagline: 'Structural biology of innate immunity',
  /** Centered hero headline (from the homepage mock). */
  heroHeadline: 'Advancing understanding of innate immunity against viral infection',
  thesis:
    'We use structural biology — X-ray crystallography and cryo-EM — to reveal how the innate immune system detects viral DNA and launches a defense, centered on the cGAS–STING pathway.',
  institution: 'Department of Biochemistry & Biophysics, Texas A&M University',
  pi: 'Pingwei Li',
  email: 'pingwei.li@ag.tamu.edu',
  phone: '979-845-1469',
  phoneHref: 'tel:+19798451469',
  office: 'ILSB 2155',
  address: '300 Olsen Blvd, College Station, TX 77843-2128',
  scholar: 'https://scholar.google.com/citations?user=ARl1Z1sAAAAJ',
  department: 'https://bcbp.tamu.edu/people/li-pingwei/',
} as const;

export const NAV_LINKS = [
  { href: '/research', label: 'Research' },
  { href: '/people', label: 'People' },
  { href: '/publications', label: 'Publications' },
  { href: '/contact', label: 'Contact' },
] as const;
