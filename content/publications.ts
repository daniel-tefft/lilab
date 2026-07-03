/**
 * Publications.
 *
 * Seed list verified against the spec (§11.A.4) and Google Scholar. Lab members
 * are emphasized via the `emphasize` array (matched case-insensitively against
 * author surnames). Extend from Scholar:
 *   https://scholar.google.com/citations?user=ARl1Z1sAAAAJ
 *
 * Only REAL citations — never fabricate authors, venues, years, or DOIs. Leave
 * `doi`/`pdf`/`code` undefined if a verified link is not available.
 */

export type Publication = {
  authors: string;
  title: string;
  venue: string;
  year: number;
  doi?: string;
  pdf?: string;
  code?: string;
  /** Marks the small set of flagship papers (spec §11.A.2). */
  flagship?: boolean;
};

/** Surnames to emphasize as lab members in author lists. */
export const LAB_SURNAMES = ['Li', 'Zhao', 'Shu', 'Yi', 'Xu', 'Jing', 'Shinde'];

export const PUBLICATIONS: Publication[] = [
  {
    authors: 'Shinde O, Li P.',
    title:
      'The molecular mechanism of dsDNA sensing through the cGAS-STING pathway.',
    venue: 'Advances in Immunology',
    year: 2024,
    doi: 'https://doi.org/10.1016/bs.ai.2024.02.003',
  },
  {
    authors: 'Zhao B, Xu P, Rowlett CM, Jing T, Shinde O, Lei Y, West AP, Liu WR, Li P.',
    title:
      'The molecular basis of tight nuclear tethering and inactivation of cGAS.',
    venue: 'Nature',
    year: 2020,
    flagship: true,
    doi: 'https://doi.org/10.1038/s41586-020-2749-z',
  },
  {
    authors:
      'Zhao B, Du F, Xu P, Shu C, Sankaran B, Bell SL, Liu M, Lei Y, Gao X, Fu X, Zhu F, Liu Y, Laganowsky A, Zheng X, Ji J-Y, West AP, Watson RO, Li P.',
    title:
      'A conserved PLPLRT/SD motif of STING mediates the recruitment and activation of TBK1.',
    venue: 'Nature',
    year: 2019,
    flagship: true,
    doi: 'https://doi.org/10.1038/s41586-019-1228-x',
  },
  {
    authors: 'Zhao B, Shu C, Gao X, Sankaran B, Du F, Shelton CL, Herr AB, Ji J-Y, Li P.',
    title:
      'Structural basis for concerted recruitment and activation of IRF-3 by innate immune adaptor proteins.',
    venue: 'Proceedings of the National Academy of Sciences (PNAS)',
    year: 2016,
    doi: 'https://doi.org/10.1073/pnas.1516465113',
  },
  {
    authors:
      'Li X, Shu C, Yi G, Chaton CT, Shelton CL, Diao J, Zuo X, Kao CC, Herr AB, Li P.',
    title:
      'Cyclic GMP-AMP synthase is activated by double-stranded DNA-induced oligomerization.',
    venue: 'Immunity',
    year: 2013,
    doi: 'https://doi.org/10.1016/j.immuni.2013.10.019',
  },
  {
    authors: 'Shu C, Yi G, Watts T, Kao CC, Li P.',
    title:
      'Structure of STING bound to cyclic di-GMP reveals the mechanism of cyclic dinucleotide recognition by the immune system.',
    venue: 'Nature Structural & Molecular Biology',
    year: 2012,
    flagship: true,
    doi: 'https://doi.org/10.1038/nsmb.2331',
  },
];
