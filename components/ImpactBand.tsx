/**
 * Impact & funding band (spec §11.A.2). Renders ONLY verified signals.
 */
import {
  IMPACT_STATS,
  FUNDERS,
  FUNDING_LINE,
  FLAGSHIP_NOTE,
  PDB_NOTE,
  RECOGNITION,
} from '@/content/impact';
import ImpactStructureFeature from '@/components/ImpactStructureFeature';

export default function ImpactBand() {
  return (
    <section className="section impact" aria-labelledby="impact-h">
      <div className="shell">
        <div className="section__head" data-reveal="up">
          <span className="eyebrow">Impact &amp; Support</span>
          <h2 id="impact-h" className="section__title">
            A record peers can check.
          </h2>
        </div>

        <div className="impact__stats" data-reveal="up">
          {IMPACT_STATS.map((stat) => (
            <div className="impact__stat" key={stat.label}>
              <div className="impact__value">
                {stat.href ? (
                  <a
                    className="link-underline"
                    href={stat.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {stat.value}
                  </a>
                ) : (
                  <span>{stat.value}</span>
                )}
                {stat.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="impact__logo"
                    src={stat.logo.src}
                    alt={stat.logo.alt}
                    height={40}
                  />
                )}
              </div>
              <div className="impact__label">{stat.label}</div>
              {stat.note && <div className="impact__note">{stat.note}</div>}
              {stat.confirmBeforeLaunch && (
                <div className="impact__note">
                  <span className="flag">confirm before launch</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="impact__row">
          <div className="impact__meta" data-reveal="up" data-reveal-delay="0.1">
            <p>{FLAGSHIP_NOTE}</p>
            <p>
              <a
                className="link-underline"
                href={PDB_NOTE.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {PDB_NOTE.text}
              </a>
              . {RECOGNITION}
            </p>

            <div>
              <p style={{ marginBottom: '0.4rem' }}>{FUNDING_LINE}</p>
              <div className="impact__funders">
                {FUNDERS.map((f) => (
                  <div className="impact__funder" key={f.name}>
                    <div className="impact__funder-name">
                      {f.name}
                      {f.confirmBeforeLaunch && (
                        <span className="flag" style={{ marginLeft: '0.5rem' }}>
                          verify
                        </span>
                      )}
                    </div>
                    {f.detail && (
                      <p className="impact__funder-detail">{f.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ImpactStructureFeature />
        </div>
      </div>
    </section>
  );
}
