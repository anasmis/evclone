import { Link } from 'react-router-dom'

// Breadcrumb section. Pass `current` for the final non-link crumb.
// Optional `trail` for intermediate crumbs: [{ to, label }, ...].
export default function Breadcrumb({ current, trail = [] }) {
  const links = [{ to: '/', label: 'Domicile' }, ...trail]
  return (
    <section className="relative breadcrumb-section">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-7xl pb-spacing-xl">
        <nav className="flex items-center flex-wrap space-x-2 text-sm" aria-label="Breadcrumb">
          {links.map((l) => (
            <span key={l.to} className="flex items-center space-x-2">
              <Link to={l.to} className="font-semibold underline hover:no-underline">
                {l.label}
              </Link>
              <span className="font-xs">
                <i className="fa-solid fa-angle-right" />
              </span>
            </span>
          ))}
          <span className="font-semibold">{current}</span>
        </nav>
      </div>
    </section>
  )
}
