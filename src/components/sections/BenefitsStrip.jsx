// Centered icon/title/description column strip — used on solution and home pages
// for "Pourquoi EVplug" / "Rejoignez l'ecosysteme" style intros.
// `items`: [{ icon, title, description }]
export default function BenefitsStrip({ heading, items }) {
  return (
    <section className="bg-white easy-to-setup relative py-spacing-7xl rounded-b-4xl">
      <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile">
        <div className="grid gap-spacing-6xl">
          {heading && <h2 className="text-center tracking-tight m-0">{heading}</h2>}
          <div className="flex mx-auto flex-wrap xl:flex-nowrap xl:gap-spacing-8xl gap-spacing-6xl justify-center items-start">
            {items.map((item, idx) => (
              <div key={idx} className="w-full grid gap-spacing-4xl text-center md:max-w-[276px] mx-auto">
                <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center mx-auto p-3">
                  <img className="mx-auto" src={item.icon} alt={item.title} loading="lazy" />
                </div>
                <div className="grid gap-spacing-xl">
                  <div className="title">
                    <h6>{item.title}</h6>
                  </div>
                  <div className="description m-0">
                    {typeof item.description === 'string' ? <p>{item.description}</p> : item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
