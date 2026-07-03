import type { Metadata } from 'next';
import { RESEARCH_AREAS } from '@/content/research';

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Structural mechanisms of innate immune signaling in the cGAS–STING pathway — X-ray crystallography and cryo-EM at the Li lab.',
};

/**
 * /research — a clean editorial index of the lab's program on the cGAS–STING
 * pathway. Each of the six themes pairs plain-language text with a structural
 * figure from the lab's published work, in alternating rows. No 3D canvas.
 */
export default function ResearchPage() {
  return (
    <>
      <header className="research-hero shell content-layer">
        <span className="eyebrow" data-reveal="up-sm">
          Research
        </span>
        <h1 className="research-hero__title" data-reveal="up">
          The molecular basis of DNA sensing.
        </h1>
        <p className="research-hero__lede" data-reveal="up" data-reveal-delay="0.1">
          We use X-ray crystallography and cryo-electron microscopy, alongside
          biochemistry and cell biology, to resolve the machines of innate
          immunity — following the cGAS–STING pathway from the moment a cell
          detects viral DNA to how that alarm is amplified, kept in check, and
          passed between cells.
        </p>
      </header>

      <div className="research-list shell content-layer">
        {RESEARCH_AREAS.map((area, i) => (
          <article
            id={area.id}
            key={area.id}
            className={`research-row research-row--${i % 2 === 0 ? 'figure-left' : 'figure-right'}`}
          >
            <figure className="research-figure" data-reveal="scale">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={area.image}
                alt={area.caption}
                className="research-figure__img"
                width={area.imageSize[0]}
                height={area.imageSize[1]}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="research-figure__cap">{area.caption}</figcaption>
            </figure>

            <div className="research-copy">
              <span className="research-copy__num" data-reveal="up-sm">
                {area.kicker}
              </span>
              <h2 className="research-copy__title" data-reveal="up">
                {area.title}
              </h2>
              {area.body.map((p, j) => (
                <p className="research-copy__body" key={j} data-reveal="up-sm">
                  {p}
                </p>
              ))}
              <div className="research-copy__tags" data-reveal="up-sm">
                {area.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="section shell content-layer">
        <p className="framing-line" data-reveal="up-sm">
          Figures are drawn from the lab’s published structural work. Full
          context, methods, and credit appear in the original papers — see{' '}
          <a className="link-underline" href="/publications">
            publications
          </a>
          .
        </p>
      </section>
    </>
  );
}
