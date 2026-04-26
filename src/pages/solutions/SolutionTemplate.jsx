import { useEffect, useRef, useState } from 'react'

const ICONS = '/assets/podenergy.com/sites/default/files'
const ICONS_11 = `${ICONS}/2025-11`

// ---------------------------------------------------------------------------
// Benefits strip — 4 centered icon/title/description columns (easy-to-setup)
// ---------------------------------------------------------------------------
function BenefitsStrip({ items }) {
  return (
    <section className="bg-white easy-to-setup relative py-spacing-7xl rounded-b-4xl">
      <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile">
        <div className="grid gap-spacing-6xl">
          <h2 className="text-center tracking-tight m-0">Pourquoi EVplug</h2>
          <div className="flex mx-auto flex-wrap xl:flex-nowrap xl:gap-spacing-8xl gap-spacing-6xl justify-center items-start">
            {items.map((item) => (
              <div key={item.title} className="w-full grid gap-spacing-4xl text-center md:max-w-[276px] mx-auto">
                <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center mx-auto p-3">
                  <img className="mx-auto" src={`${ICONS}/${item.icon}`} alt={item.title} loading="lazy" />
                </div>
                <div className="grid gap-spacing-xl">
                  <div className="title"><h6>{item.title}</h6></div>
                  <div className="description m-0"><p>{item.description}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Single image-text row (image left, text right). Reversed via prop.
// ---------------------------------------------------------------------------
function ImageTextRow({ image, title, body, ctaLabel, ctaHref = '/contact-us', reversed = false }) {
  return (
    <div
      className={`flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block${reversed ? ' md:flex-row-reverse' : ''}`}
    >
      <div className="md:w-6/12 w-full">
        <img className="w-full rounded-2xl" src={image} alt="" loading="lazy" />
      </div>
      <div className="md:w-6/12 w-full">
        <div className="max-w-[480px] grid gap-spacing-3xl">
          <div className="grid gap-spacing-3xl">
            <h3 className="tracking-tight m-0">{title}</h3>
            <div className="hero-banner-des">
              <p>{body}</p>
            </div>
          </div>
          <div className="flex justify-start gap-spacing-xl">
            <a href={ctaHref} className="btn btn-primary font-base">
              {ctaLabel || 'Demander un accompagnement'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Services accordion (how-we-help) + stacked images — your-charger-section
// ---------------------------------------------------------------------------
function ServicesAccordion({ services, topImage, bottomImage }) {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section className="relative your-charger-section top-spacing">
      <div className="bg-white">
        <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
          <div className="flex gap-spacing-7xl items-center xl:justify-between justify-center xl:flex-nowrap flex-wrap">
            {/* Left — accordion */}
            <div className="xl:max-w-[480px] xl:w-6/12">
              <div className="grid gap-spacing-6xl">
                <div className="view-header">
                  <div className="grid gap-spacing-3xl">
                    <h3 className="tracking-tight m-0 pr-spacing-3xl">Nos services inclus</h3>
                    <div className="m-0 pr-spacing-3xl">
                      <p>Une offre complete de l&rsquo;etude a l&rsquo;exploitation, avec un interlocuteur unique EVplug.</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-wrapper grid gap-4">
                  {services.map((s, idx) => {
                    const isOpen = idx === openIdx
                    return (
                      <div
                        key={s.title}
                        className={`bg-surface rounded-2xl common_accordion${isOpen ? ' active' : ''}`}
                      >
                        <button
                          className="w-full flex p-spacing-3xl justify-between items-center text-left common_accordion_title cursor-pointer"
                          onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                        >
                          <h6 className="m-0 pr-spacing-3xl">{s.title}</h6>
                          <div
                            className="accordion-arrow w-[24px] h-[24px] flex items-center justify-center cursor-pointer transition-transform duration-200"
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                          >
                            <i className="arrow-down fa-solid fa-angle-down text-base" />
                          </div>
                        </button>
                        {isOpen && (
                          <div className="common_accordion_dec item-listing leading-relaxed px-spacing-3xl pb-spacing-3xl">
                            <p>{s.description}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right — stacked images */}
            <div className="flex flex-col items-center gap-6 md:max-w-[582px] max-w-[370px] xl:w-6/12 w-full">
              <div className="first-top xl:ml-auto">
                <img
                  src={topImage}
                  alt=""
                  className="md:w-[379px] md:h-[505px] w-[240px] h-auto object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
              <div className="second-bottom mr-auto relative -mt-[120px]">
                <img
                  src={bottomImage || topImage}
                  alt=""
                  className="md:w-[276px] md:h-[276px] w-[175px] h-[175px] object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// EVone management service section inspired by workplace-charging feature list
// ---------------------------------------------------------------------------
function EvoneManagementService({ ctaLabel, ctaHref = '/contact-us' }) {
  return (
    <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
      <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
        <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block">
          <div className="md:w-6/12 w-full">
            <img
              className="w-full rounded-2xl"
              src={`${ICONS}/styles/b18_image_style/public/2026-02/POD190-Laptop-Mockup%20(2).png992c.webp?h=827069f2&itok=da2rZeb6`}
              alt="Plateforme EVone pour la gestion de site"
              loading="lazy"
            />
          </div>
          <div className="md:w-6/12 w-full">
            <div className="max-w-[480px] grid gap-spacing-3xl">
              <div className="grid gap-spacing-3xl">
                <h3 className="tracking-tight m-0">EVone, la plateforme de gestion intelligente</h3>
                <div className="hero-banner-des">
                  <p>Que vous equipiez un seul site ou un reseau national, EVplug centralise le pilotage de vos bornes depuis EVone pour simplifier l&apos;exploitation au quotidien.</p>
                  <ul>
                    <li>Gerer les acces, les tarifs et les droits utilisateurs en quelques clics</li>
                    <li>Suivre les usages, les revenus et les remboursements par site</li>
                    <li>Mesurer la performance et l&apos;impact CO2 de votre infrastructure</li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-start gap-spacing-xl">
                <a href={ctaHref} className="btn btn-primary font-base">
                  {ctaLabel || 'Demander un devis'}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block md:flex-row-reverse">
          <div className="md:w-6/12 w-full">
            <img
              className="w-full rounded-2xl"
              src={`${ICONS}/styles/b18_image_style/public/2026-01/Twin%20Install.jpgcba7.webp?h=c74750f6&itok=Gy_Wci2T`}
              alt="Accompagnement EVplug pour le financement des bornes"
              loading="lazy"
            />
          </div>
          <div className="md:w-6/12 w-full">
            <div className="max-w-[480px] grid gap-spacing-3xl">
              <div className="grid gap-spacing-3xl">
                <h3 className="tracking-tight m-0">Financement et deploiement maitrises au Maroc</h3>
                <div className="hero-banner-des">
                  <p>EVplug vous accompagne pour structurer votre projet de recharge en entreprise, en copropriete ou en hôtellerie, avec une approche adaptee aux contraintes locales a Casablanca, Rabat, Marrakech et Tanger.</p>
                  <p>De l&apos;etude technique a la mise en service, nos experts vous aident a optimiser les couts, planifier les travaux et choisir le bon modele d&apos;exploitation sur EVone.</p>
                </div>
              </div>
              <div className="flex justify-start gap-spacing-xl">
                <a href={ctaHref} className="btn btn-primary font-base">
                  {ctaLabel || 'Parler a un expert'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Evone platform section — image left + title/subtitle/feature-pills/CTA right
// ---------------------------------------------------------------------------
function EvonePlatformSection({ title, subtitle, features, badge, platformImage, heroImage, storyImage, heroCta }) {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef(null)
  const topImage =
    platformImage ||
    storyImage ||
    `${ICONS}/styles/b7_top_right/public/2026-01/Solo%203S%20Installation%20-%20Low-res-52.jpgb00f.webp?h=56d0ca2e&itok=FeJRuLCq`
  const bottomImage =
    heroImage ||
    `${ICONS}/styles/b7_mid_left/public/2026-01/LEVC%20-%20Low-res-31.jpg02e2.webp?h=56d0ca2e&itok=0WKjq2ZA`

  useEffect(() => {
    if (!sectionRef.current || features.length === 0) return

    let ticking = false

    const updateActiveStepFromScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const viewportMid = window.innerHeight * 0.55
      const totalScrollable = rect.height + window.innerHeight * 0.6
      const rawProgress = (viewportMid - rect.top) / totalScrollable
      const clampedProgress = Math.min(1, Math.max(0, rawProgress))
      const nextStep = Math.min(features.length - 1, Math.floor(clampedProgress * features.length))
      setActiveStep((prev) => (prev === nextStep ? prev : nextStep))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        updateActiveStepFromScroll()
        ticking = false
      })
    }

    updateActiveStepFromScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [features.length])

  return (
    <section ref={sectionRef} className="relative our-insllation-process-section bg-surface xl:pt-spacing-9xl xl:pb-spacing-7xl py-spacing-7xl top-spacing">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto">
        <div className="grid gap-spacing-6xl">
          <div className="view-header text-center">
            <div className="heading-block grid gap-spacing-3xl">
              {badge && <span className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-sm font-semibold w-fit mx-auto">{badge}</span>}
              <h2 className="tracking-tight m-0">{title}</h2>
              <div><p>{subtitle}</p></div>
            </div>
          </div>

          <div className="oip_block">
            <div className="oip_pr md:sticky md:top-[170px]">
              <div className="oip_steps rounded-2xl bg-white">
                {features.map((feature, idx) => (
                  <div key={feature} className={`oip_step flex relative gap-4${idx === activeStep ? ' active' : ''}`}>
                    <div className="step-number">{idx + 1}</div>
                    <div className="step-content">
                      <h6 className="cursor-pointer" onClick={() => setActiveStep(idx)}>
                        {feature}
                        <div className="md:hidden accordion-arrow top-0 w-[24px] h-[24px] flex items-center justify-center cursor-pointer absolute right-0 mt-2">
                          <i className="arrow-down fa-solid fa-angle-down text-base" />
                        </div>
                      </h6>
                      {idx === activeStep && (
                        <div className="step_content_dec">
                          <p>EVone simplifie cette etape avec un suivi clair pour le syndic, des donnees fiables en temps reel et l&apos;accompagnement EVplug de l&apos;etude a l&apos;exploitation.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="right flex flex-col">
              <div className="oip_img flex justify-end relative w-full max-w-[553px] ml-auto">
                <div>
                  <img
                    src={topImage}
                    className="w-[276px] object-cover rounded-2xl"
                    alt={title}
                    loading="lazy"
                  />
                  <div className="oip_img_label oip_img_label_left text-lg">
                    <div className="icon">
                      <img src={`${ICONS}/2025-11/Charger-sign-guide.svg`} alt="" loading="lazy" />
                    </div>
                    <div className="m-0 font-semibold"><p>Pilotage centralise des bornes de la residence</p></div>
                  </div>
                </div>
              </div>
              <div className="oip_img flex relative w-full max-w-[551px] mr-auto">
                <div>
                  <img
                    src={bottomImage}
                    className="w-[275px] object-cover rounded-2xl"
                    alt={title}
                    loading="lazy"
                  />
                  <div className="oip_img_label oip_img_label_left text-lg">
                    <div className="icon">
                      <img src={`${ICONS}/2025-10/installation.svg`} alt="" loading="lazy" />
                    </div>
                    <div className="m-0 font-semibold"><p>Facturation individuelle et suivi technique simplifie</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-spacing-xl flex-wrap justify-center pt-spacing-5xl">
            <a href="/contact-us" className="btn btn-primary font-base">
              {heroCta || 'Etudier votre projet'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// EVone insights section — copy of Commercial "Site Management Service" part
// ---------------------------------------------------------------------------
function EvoneInsightsSection() {
  return (
    <section id="evone-sms" className="text-left-right-variant relative image-text-section bg-surface top-spacing">
      <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
        <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block ">
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// CTA banner — full Podenergy layout with decorative right box
// ---------------------------------------------------------------------------
function CtaBanner({ title, body }) {
  return (
    <section className="relative cta-banner">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile relative mx-auto md:py-spacing-7xl pt-spacing-7xl md:!pb-[170px]">
        <div className="grid md:grid-flow-col gap-spacing-4xl text-white">
          <div className="bg-blue-dianne md:w-[calc(100%-65px)] xl:w-[calc(100%-178px)] rounded-2xl">
            <div className="relative z-10 p-spacing-7xl max-w-[762px]">
              <div className="grid gap-spacing-3xl w-full">
                <div className="grid gap-spacing-xl">
                  <h3 className="text-pear uppercase font-PosterCutNeue m-0 font-normal">{title}</h3>
                  <div className="m-0 link-white">
                    <p>{body}</p>
                  </div>
                </div>
                <div className="flex gap-spacing-xl flex-wrap">
                  <a href="/contact-us" className="btn btn-secondary font-base">
                    Demander un devis
                  </a>
                  <a href="/contact-us" className="btn btn-secondary-outline font-base">
                    Parler a un expert
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            className="p-10 rounded-2xl flex justify-center items-center md:w-[270px] md:h-[270px] xl:w-[379px] xl:h-[379px] md:absolute xl:top-[120px] xl:right-[130px] md:top-[290px] md:right-[30px]"
            style={{ backgroundColor: '#87b4e1' }}
          >
            <img
              src={`${ICONS_11}/Pod Home Charging.svg`}
              alt=""
              className="h-[255px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main template — compose all sections
// ---------------------------------------------------------------------------
export default function SolutionTemplate({
  tag,
  heroTitle,
  heroSubtitle,
  heroImage,
  storyImage,
  platformImage,
  heroCta,
  services,
  imagePanel1Title,
  imagePanel1Body,
  managementTitle,
  managementSubtitle,
  managementItems,
  managementCta,
  evoneTitle,
  evoneSubtitle,
  evoneFeatures,
  evoneBadge,
  ctaTitle,
  ctaBody,
}) {
  const benefitsItems = services.slice(0, 4)
  const managementSectionItems =
    managementItems ||
    [
      {
        icon: '2025-11/Dashboard.svg',
        title: 'Site management',
        description:
          'Pilotez vos bornes par site, gelez ou activez des points de charge, et suivez la disponibilite en temps reel depuis un tableau de bord unique.',
      },
      {
        icon: '2025-11/Profile-2.svg',
        title: 'User management',
        description:
          'Administrez les profils utilisateurs, les acces, les droits et les habitudes de charge avec une gouvernance claire par equipe ou par entite.',
      },
      {
        icon: '2025-11/Coins.svg',
        title: 'Expense and driver management',
        description:
          'Maitrisez les tarifs, remboursements et rapports financiers avec des exports exploitables pour la finance, la paie et le pilotage operationnel.',
      },
    ]

  return (
    <>
      {/* 1. Hero */}
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
                <h1 className="tracking-tight m-0">{heroTitle}</h1>
                <div className="hero-banner-des">
                  <p>{heroSubtitle}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-start gap-spacing-xl">
                <a href="/contact-us" className="btn btn-primary font-base">
                  {heroCta || 'Etudier votre projet'}
                </a>
                <a href="/contact-us" className="btn btn-secondary-outline font-base">
                  Parler a un expert
                </a>
              </div>
            </div>
            <div className="solution-image">
              {heroImage && (
                <img
                  className="mx-auto rounded-2xl object-cover"
                  src={heroImage}
                  alt=""
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Benefits strip */}
      <BenefitsStrip items={benefitsItems} />

      {/* 3. Image-text — story panel */}
      <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
        <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
          <ImageTextRow
            image={storyImage || heroImage}
            title={imagePanel1Title}
            body={imagePanel1Body}
            ctaLabel="Demander un devis"
          />
        </div>
      </section>

      {/* 4. How we help — services accordion + stacked images */}
      <ServicesAccordion
        services={services}
        topImage={heroImage}
        bottomImage={storyImage}
      />

      {/* 5. EVone SMS — copy of Commercial Site Management Service part */}
      <EvoneInsightsSection image={storyImage} />

      {/* 6. EVone management service */}
      <EvoneManagementService
        title={managementTitle || 'Notre EVone Management Service'}
        subtitle={
          managementSubtitle ||
          'Comme sur les pages business Podenergy, EVplug centralise l\'exploitation dans un service de gestion connecte pour piloter acces, tarification et performance.'
        }
        items={managementSectionItems}
        ctaLabel={managementCta || 'Decouvrir EVone Management Service'}
      />

      {/* 7. Evone platform */}
      <EvonePlatformSection
        title={evoneTitle}
        subtitle={evoneSubtitle}
        features={evoneFeatures}
        badge={evoneBadge}
        platformImage={platformImage}
        heroImage={heroImage}
        storyImage={storyImage}
        heroCta={heroCta}
      />

      {/* 8. CTA banner */}
      <CtaBanner title={ctaTitle} body={ctaBody} />
    </>
  )
}
