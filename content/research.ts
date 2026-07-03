/**
 * Research areas — the lab's program on the molecular basis of double-stranded
 * DNA sensing through the cGAS–STING pathway. The six areas trace the signal
 * from detection of viral DNA to the activation, control, and propagation of
 * the antiviral response, grounded in the lab's structural work.
 *
 * `specimen` links an area to an abstract structure used purely as a section
 * anchor / atmosphere — NOT as a claim that the mesh depicts that molecule.
 */

export type ResearchArea = {
  id: string;
  kicker: string;
  title: string;
  body: string[];
  /** Structural figure (from the lab's published work) under /public. */
  image: string;
  /** Real pixel dimensions of `image` — reserves aspect ratio before it loads
   *  so the GSAP scroll-reveal doesn't measure the row against a collapsed,
   *  not-yet-loaded image and get stuck hidden. */
  imageSize: [number, number];
  /** Short caption shown under the figure. */
  caption: string;
  /** Short, honest tags — pathway/method terms, no resolution/identity claims. */
  tags: string[];
};

export const RESEARCH_AREAS: ResearchArea[] = [
  {
    id: 'cgas-activation',
    kicker: '01',
    title: 'How cGAS detects viral DNA',
    body: [
      'When double-stranded DNA appears in the cytoplasm — a hallmark of infection — the enzyme cGAS binds it and switches on. Our crystal structures captured cGAS before and after DNA binding, revealing the conformational change that opens its catalytic site.',
      'We showed that cGAS and DNA assemble into a cooperative 2:2 complex through two distinct DNA-binding surfaces and a dimer interface. This oligomerization is what licenses cGAS to synthesize cGAMP — the second messenger that carries the alarm forward.',
    ],
    image: '/research/cgas.jpg',
    imageSize: [1352, 1103],
    caption: 'Crystal structure of the cGAS catalytic-domain dimer.',
    tags: ['cGAS', 'dsDNA', 'cGAMP', 'X-ray crystallography'],
  },
  {
    id: 'sting-activation',
    kicker: '02',
    title: 'How cGAMP switches on STING',
    body: [
      'cGAMP comes in two chemical forms, and STING tells them apart: our binding studies showed it recognizes the mammalian 2′3′-cGAMP far more tightly than the bacterial 3′3′ isomer.',
      'Ligand binding triggers a conformational change in STING and drives it to oligomerize. We resolved how this higher-order assembly of full-length STING builds the platform for everything downstream.',
    ],
    image: '/research/sting.jpg',
    imageSize: [1485, 1113],
    caption: 'STING dimer, ligand-free (blue) and cGAMP-bound (green), superposed.',
    tags: ['STING', 'cGAMP', 'oligomerization', 'ITC / SPR'],
  },
  {
    id: 'tbk1-recruitment',
    kicker: '03',
    title: 'Recruiting the TBK1 kinase',
    body: [
      'Activated STING must hand the signal to the kinase TBK1. We identified a short, conserved PLPLRT/SD motif in STING’s C-terminal tail as the docking site — present across mammalian STING sequences.',
      'Our structure of the TBK1–STING complex shows exactly how that motif engages the kinase, and mutations at the interface disrupt STING-mediated signaling in cells.',
    ],
    image: '/research/tbk1.jpg',
    imageSize: [1600, 804],
    caption: 'The TBK1 dimer engaging the STING C-terminal tail, two views.',
    tags: ['TBK1', 'PLPLRT/SD motif', 'kinase'],
  },
  {
    id: 'irf3-activation',
    kicker: '04',
    title: 'Activating the IRF-3 transcription factor',
    body: [
      'Once phosphorylated, STING recruits the transcription factor IRF-3 through a conserved pLxIS motif. We mapped the structural basis of that recognition and showed how phosphorylation creates the binding site.',
      'We then captured phosphorylated IRF-3 forming a domain-swapped dimer with its coactivator CBP — explaining how STING concertedly recruits and activates IRF-3 to switch on the type I interferon genes.',
    ],
    image: '/research/irf3.jpg',
    imageSize: [1500, 660],
    caption: 'Phosphorylated IRF-3 bound to CBP as a domain-swapped dimer.',
    tags: ['IRF-3', 'pLxIS motif', 'CBP', 'interferon'],
  },
  {
    id: 'cgas-nuclear-tethering',
    kicker: '05',
    title: 'Keeping cGAS off our own DNA',
    body: [
      'cGAS faces a problem: the cell is full of its own genomic DNA. We found that most cGAS sits in the nucleus, where the nucleosome binds it tightly and shuts its enzymatic activity down.',
      'Our cryo-EM structure of cGAS bound to the nucleosome shows how histone surfaces tether and inhibit it — a built-in safeguard against autoimmunity that helps the cell tell self from non-self DNA.',
    ],
    image: '/research/nucleosome.jpg',
    imageSize: [664, 605],
    caption: 'Cryo-EM density of cGAS bound to the nucleosome.',
    tags: ['nucleosome', 'self / non-self', 'autoimmunity', 'cryo-EM'],
  },
  {
    id: 'cgamp-export',
    kicker: '06',
    title: 'Exporting cGAMP between cells',
    body: [
      'cGAMP can also travel between cells to spread the antiviral signal, but it needs a transporter to cross the membrane. We identified the multidrug transporter ABCC1 as a cGAMP exporter.',
      'Our cryo-EM structures of ABCC1 — alone and bound to cGAMP — reveal the binding pocket and an inward- to outward-facing cycle that pumps cGAMP out; mutations in the pocket block export.',
    ],
    image: '/research/abcc1.jpg',
    imageSize: [1500, 1338],
    caption: 'Cryo-EM structure of the ABCC1 transporter.',
    tags: ['ABCC1', 'transporter', 'cGAMP export', 'cryo-EM'],
  },
];
