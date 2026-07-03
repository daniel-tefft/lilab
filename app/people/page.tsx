import type { Metadata } from 'next';
import PersonCard from '@/components/PersonCard';
import {
  PEOPLE,
  PI,
  GROUP_ORDER,
  GROUP_LABELS,
  type PersonGroup,
} from '@/content/people';

export const metadata: Metadata = {
  title: 'People',
  description: 'The Li lab team — principal investigator, students, and researchers.',
};

/**
 * /people — PI expanded at top, then grouped grid (PI → postdocs → grad →
 * undergrad → staff → alumni). Roster supplied by PI (spec §11.B); photos are
 * optional and fall back to initials monograms.
 */
export default function PeoplePage() {
  const byGroup = (g: PersonGroup) =>
    PEOPLE.filter((p) => p.group === g && p.slug !== PI.slug);

  return (
    <div className="content-layer">
      <header className="page-hero shell">
        <span className="eyebrow" data-reveal="up-sm">
          People
        </span>
        <h1 className="section__title" data-reveal="up" style={{ marginTop: '1rem' }}>
          The lab.
        </h1>
      </header>

      <section className="shell section--tight">
        {/* PI feature */}
        <div className="pi-card" data-reveal="up">
          <div>
            {PI.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="person__photo"
                src={PI.photo}
                alt={`${PI.name}, ${PI.role}`}
                style={{ objectPosition: '50% 15%' }}
              />
            ) : (
              <div className="person__monogram" aria-hidden="true" style={{ fontSize: '3.4rem' }}>
                {PI.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')}
              </div>
            )}
          </div>
          <div>
            <h2 className="pi-card__name">{PI.name}</h2>
            <div className="pi-card__role">{PI.role}</div>
            <div className="pi-card__bio">
              {PI.bio?.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {PI.links && (
              <div className="pi-card__links">
                {PI.links.map((l) => (
                  <a
                    key={l.href}
                    className="person__link"
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Groups */}
        {GROUP_ORDER.filter((g) => g !== 'pi').map((group) => {
          const members = byGroup(group);
          if (members.length === 0) return null;
          return (
            <div className="people-group" key={group}>
              <h2 className="people-group__label">{GROUP_LABELS[group]}</h2>
              <div className="people-grid">
                {members.map((person) => (
                  <PersonCard key={person.slug} person={person} />
                ))}
              </div>
            </div>
          );
        })}

        <p className="framing-line" data-reveal="up-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="tamu-mark-logo"
            src="/tamu-logo.png"
            alt="Texas A&M University"
            width={22}
            height={22}
          />{' '}
          Department of Biochemistry &amp; Biophysics, Texas A&amp;M University
        </p>
      </section>
    </div>
  );
}
