import { Link } from 'react-router-dom'

// Bottom-of-page CTA banner. Dark blue panel on the left, optional decorative
// box on the right. `ctas`: [{ to/href, label, variant?, external? }].
export default function CtaBanner({ title, body, ctas = [], decorImage, decorAlt = '', decorBg = '#87B4E1' }) {
  return (
    <section className="relative cta-banner">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile relative mx-auto md:py-spacing-7xl pt-spacing-7xl md:!pb-[170px]">
        <div className="grid md:grid-flow-col gap-spacing-4xl text-white">
          <div className="bg-blue-dianne md:w-[calc(100%-65px)] xl:w-[calc(100%-178px)] rounded-2xl">
            <div className="relative z-10 p-spacing-7xl max-w-[762px]">
              <div className="grid gap-spacing-3xl w-full">
                <div className="grid gap-spacing-xl">
                  <h3 className="text-pear uppercase font-PosterCutNeue m-0 font-normal">{title}</h3>
                  {body && (
                    <div className="m-0 link-white">
                      {typeof body === 'string' ? <p>{body}</p> : body}
                    </div>
                  )}
                </div>
                {ctas.length > 0 && (
                  <div className="flex gap-spacing-xl flex-wrap">
                    {ctas.map((cta, i) => {
                      const className = `btn btn-${cta.variant || 'secondary'} font-base`
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
              </div>
            </div>
          </div>
          {decorImage && (
            <div
              className="p-10 rounded-2xl flex justify-center items-center md:w-[270px] md:h-[270px] xl:w-[379px] xl:h-[379px] md:absolute xl:top-[120px] xl:right-[130px] md:top-[290px] md:right-[30px]"
              style={{ backgroundColor: decorBg }}
            >
              <img src={decorImage} alt={decorAlt} className="h-[255px]" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
