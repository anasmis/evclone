import { Link } from 'react-router-dom'

// Centered "Besoin d'aide ?" support band with an icon, title, body and link.
export default function HelpBand({ icon, iconAlt = '', title = "Besoin d'aide ?", body, linkLabel = 'Nous contacter', linkTo = '/contact-us' }) {
  return (
    <section className="benefits-list relative bg-white md:py-spacing-9xl py-spacing-7xl">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto">
        <div className="text-center mx-auto grid gap-spacing-md paragraph-max-width">
          {icon && (
            <div className="text-center">
              <img className="mx-auto" src={icon} alt={iconAlt} />
            </div>
          )}
          <div className="font-lg font-bold">
            <h6>{title}</h6>
          </div>
          {body && (
            <div className="font-xl m-0">
              {typeof body === 'string' ? <p>{body}</p> : body}
            </div>
          )}
          <div className="text-center justify-center grid gap-spacing-xl font-xl">
            <Link to={linkTo} className="font-bold hover:no-underline underline">
              {linkLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
