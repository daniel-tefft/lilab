/**
 * Impact & funding band (spec §11.A.2).
 *
 * VERIFIED signals only — NOTHING embellished. Do not add an h-index
 * (unverified) or attribute PDB codes to the anonymous meshes.
 */

export type ImpactStat = {
  value: string;
  label: string;
  href?: string;
  /** Citation counts / grant dates drift — flag for PI confirmation. */
  confirmBeforeLaunch?: boolean;
  note?: string;
  /** Optional venue logo (e.g. Nature) shown alongside the stat. */
  logo?: { src: string; alt: string };
};

export const SCHOLAR_URL =
  'https://scholar.google.com/citations?user=ARl1Z1sAAAAJ';

export const IMPACT_STATS: ImpactStat[] = [
  {
    value: '~11,900',
    label: 'Citations',
    href: SCHOLAR_URL,
    note: 'Google Scholar, retrieved 2026',
  },
  {
    value: '80+',
    label: 'Peer-reviewed publications',
  },
  {
    value: '2 ×',
    label: 'Papers in Nature (2019, 2020)',
    logo: { src: '/nature-logo.png', alt: 'Nature' },
  },
];

/** Flagship venues, plainly stated (no claims beyond what is verified). */
export const FLAGSHIP_NOTE =
  'Flagship work appears in Nature (2019, 2020), Nature Structural & Molecular Biology (2012), Immunity (2013), and PNAS (2016).';

/** Phrased to avoid attributing specific codes to the anonymous hero meshes. */
export const PDB_NOTE = {
  text: 'Structures deposited in the Protein Data Bank',
  href: 'https://www.rcsb.org/search?request=%7B%22query%22%3A%7B%22type%22%3A%22terminal%22%2C%22service%22%3A%22full_text%22%2C%22parameters%22%3A%7B%22value%22%3A%22Pingwei%20Li%22%7D%7D%2C%22return_type%22%3A%22entry%22%7D',
};

export type Funder = {
  name: string;
  detail?: string;
  confirmBeforeLaunch?: boolean;
};

/** Present as short text/logos: "Supported by NIH/NIAID, CPRIT, and the Welch Foundation." */
export const FUNDERS: Funder[] = [
  {
    name: 'NIH / NIAID',
    detail:
      'R01 AI145287 — “Molecular Basis of Viral DNA Sensing through the cGAS–STING Pathway” (~2019–2024). Prior R01 on RIG-I-like receptors (2010–2016) and award AI087741.',
  },
  {
    name: 'CPRIT',
    detail: 'Cancer Prevention & Research Institute of Texas (RP150454).',
  },
  {
    name: 'The Welch Foundation',
    detail: 'A-1931, later A-2107.',
  },
];

export const FUNDING_LINE =
  'Supported by NIH/NIAID, CPRIT, and the Welch Foundation.';

export const RECOGNITION =
  '2021 Texas A&M AgriLife Research Director’s Award.';

/**
 * The one structure on the site shown WITH attribution (unlike the anonymous
 * gallery specimens): the cGAS-nucleosome tethering complex from Zhao et al.,
 * Nature 2020, featured here as a citable, interactive figure.
 */
export const CGAS_STRUCTURE_FEATURE = {
  glbPath: '/models/cgas-nucleosome.glb',
  caption: 'Cryo-EM density map of mouse cGAS–nucleosome complex',
  citationMLA:
    'Zhao, Baoyu, et al. "The Molecular Basis of Tight Nuclear Tethering and Inactivation of cGAS." Nature, vol. 587, no. 7835, 2020, pp. 673–677.',
  doi: 'https://doi.org/10.1038/s41586-020-2749-z',
};
