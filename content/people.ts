/**
 * People roster.
 *
 * Verified PI details come from the TAMU BCBP page and Google Scholar (spec
 * §11.A.1). Trainee roster supplied by the PI (spec §11.B). To add a person:
 * append an entry below — no JSX required. `group` controls the section the
 * card lands in; ordering within a group follows array order.
 */

export type PersonGroup =
  | 'pi'
  | 'postdoc'
  | 'grad'
  | 'undergrad'
  | 'staff'
  | 'alumni';

export type PersonLink = {
  label: string;
  href: string;
};

export type Person = {
  slug: string;
  name: string;
  role: string;
  group: PersonGroup;
  /** One-line research focus. */
  focus: string;
  /** Longer bio — only the PI is rendered expanded. */
  bio?: string[];
  photo?: string; // path under /public, optional; falls back to a monogram tile
  links?: PersonLink[];
};

export const GROUP_LABELS: Record<PersonGroup, string> = {
  pi: 'Principal Investigator',
  postdoc: 'Postdoctoral Researchers',
  grad: 'Graduate Students',
  undergrad: 'Undergraduate Researchers',
  staff: 'Staff',
  alumni: 'Alumni',
};

export const GROUP_ORDER: PersonGroup[] = [
  'pi',
  'postdoc',
  'grad',
  'undergrad',
  'staff',
  'alumni',
];

export const PEOPLE: Person[] = [
  {
    slug: 'pingwei-li',
    name: 'Pingwei Li',
    role: 'Professor · AgriLife Faculty Fellow',
    group: 'pi',
    photo: '/Pingwei-Li-Headshot.jpeg',
    focus:
      'Structural mechanisms of innate immune signaling in the cGAS–STING pathway.',
    bio: [
      'Pingwei Li is a Professor and AgriLife Faculty Fellow in the Department of Biochemistry & Biophysics at Texas A&M University, where he has led a structural-biology group since 2005.',
      'The lab uses X-ray crystallography and cryo-electron microscopy, together with biochemical and cellular methods, to reveal how the innate immune system detects viral DNA and launches a defense — work centered on the cGAS–STING pathway and related DNA- and RNA-sensing receptors.',
      'He received his B.S. from Northwest University (1989) and Ph.D. from Peking University (1996), followed by postdoctoral training at the Fred Hutchinson Cancer Research Center (2001) and the California Institute of Technology (2005).',
    ],
    links: [
      { label: 'Email', href: 'mailto:pingwei.li@ag.tamu.edu' },
      {
        label: 'Google Scholar',
        href: 'https://scholar.google.com/citations?user=ARl1Z1sAAAAJ',
      },
      {
        label: 'Department',
        href: 'https://bcbp.tamu.edu/people/li-pingwei/',
      },
    ],
  },
  {
    slug: 'hamza-ammar',
    name: 'Hamza Ammar',
    role: 'Graduate Student',
    group: 'grad',
    focus: 'Structural biology of innate immune signaling complexes.',
    links: [],
  },
  {
    slug: 'daniel-tefft',
    name: 'Daniel Tefft',
    role: 'Undergraduate Researcher',
    group: 'undergrad',
    focus: 'Undergraduate research in the Li lab.',
    links: [],
  },
  {
    slug: 'lane-limbaugh',
    name: 'Lane Limbaugh',
    role: 'Undergraduate Researcher',
    group: 'undergrad',
    focus: 'Undergraduate research in the Li lab.',
    links: [],
  },
];

export const PI = PEOPLE.find((p) => p.group === 'pi')!;
