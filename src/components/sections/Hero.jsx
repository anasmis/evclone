import { Link } from 'react-router-dom'

// Standard two-column page hero.
// `subtitle` accepts a string or JSX.
// `ctas`: [{ to?, href?, label, variant?: 'primary'|'primary-outline'|'secondary'|'secondary-outline', external? }]
// `tag` renders a lime badge above the title.
// `footnote` renders small text below the CTA row.
export default function Hero({ tag, title, subtitle, ctas = [], image, imageAlt = '', footnote }) {
  return (
    <section className="relative key-page-hero-section bg-white">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-3xl lg:pb-spacing-9xl pb-spacing-7xl">
        <div className="grid xl:grid-cols-2 xl:grid-flow-col items-center justify-between gap-spacing-4xl grid-block">
          <div className="grid gap-spacing-4xl">
            <div className="grid gap-spacing-3xl">
              {tag && (
                <span className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-sm font-semibold w-fit">
                  {tag}
                </span>
              )}
              <h1 className="tracking-tight m-0">{title}</h1>
              {subtitle && (
                <div className="hero-banner-des">
                  {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
                </div>
              )}
            </div>
            {ctas.length > 0 && (
              <div className="flex flex-wrap justify-start gap-spacing-xl">
                {ctas.map((cta, i) => {
                  const className = `btn btn-${cta.variant || 'primary'} font-base`
                  if (cta.onClick) {
                    return (
                      <button key={i} type="button" className={className} onClick={cta.onClick}>
                        {cta.label}
                      </button>
                    )
                  }
                  if (cta.to && !cta.external) {
                    return (
                      <Link key={i} to={cta.to} className={className}>
                        {cta.label}
                      </Link>
                    )
                  }
                  return (
                    <a
                      key={i}
                      href={cta.href || cta.to}
                      className={className}
                      {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {cta.label}
                    </a>
                  )
                })}
              </div>
            )}
            {footnote && <div className="font-sm mt-2 mb-0">{typeof footnote === 'string' ? <p>{footnote}</p> : footnote}</div>}
          </div>
          {image && (
            <div className="solution-image">
              <img className="mx-auto rounded-2xl object-cover" src={image} alt={imageAlt} loading="lazy" decoding="async" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
