/**
 * Person card for the /people grid. Falls back to an initials monogram tile
 * when no photo is provided (roster supplied by PI; photos optional). Hover
 * triggers the chrome shimmer defined in CSS.
 */
import type { Person } from '@/content/people';

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function PersonCard({ person }: { person: Person }) {
  return (
    <article className="person" data-reveal="up-sm">
      {person.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="person__photo" src={person.photo} alt={`${person.name}, ${person.role}`} />
      ) : (
        <div className="person__monogram" aria-hidden="true">
          {initials(person.name)}
        </div>
      )}
      <h3 className="person__name">{person.name}</h3>
      <div className="person__role">{person.role}</div>
      <p className="person__focus">{person.focus}</p>
      {person.links && person.links.length > 0 && (
        <div className="person__links">
          {person.links.map((link) => (
            <a
              key={link.href}
              className="person__link"
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
