import { useEffect, useRef, useState } from 'react'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import evoneLaptopImg from '../../migrated/assets/solutions/shared/evone-laptop.jpeg'
import evoneInstallImg from '../../migrated/assets/solutions/shared/evone-install.jpeg'
import ctaImageSrc from '../../migrated/assets/solutions/shared/cta-image.svg'
import Hero from '../../components/sections/Hero'
import BenefitsStrip from '../../components/sections/BenefitsStrip'
import CtaBanner from '../../components/sections/CtaBanner'

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
                      <p>Une offre complète de l&rsquo;étude à l&rsquo;exploitation, avec un interlocuteur unique EVplug.</p>
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
              src={evoneLaptopImg}
              alt="Plateforme EVone pour la gestion de site"
              loading="lazy"
            />
          </div>
          <div className="md:w-6/12 w-full">
            <div className="max-w-[480px] grid gap-spacing-3xl">
              <div className="grid gap-spacing-3xl">
                <h3 className="tracking-tight m-0">EVone, la plateforme de gestion intelligente</h3>
                <div className="hero-banner-des">
                  <p>Que vous équipiiez un seul site ou un réseau national, EVplug centralise le pilotage de vos bornes depuis EVone pour simplifier l&apos;exploitation au quotidien.</p>
                  <ul>
                    <li>Gérer les accès, les tarifs et les droits utilisateurs en quelques clics</li>
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
              src={evoneInstallImg}
              alt="Accompagnement EVplug pour le financement des bornes"
              loading="lazy"
            />
          </div>
          <div className="md:w-6/12 w-full">
            <div className="max-w-[480px] grid gap-spacing-3xl">
              <div className="grid gap-spacing-3xl">
                <h3 className="tracking-tight m-0">Financement et déploiement maîtrisés au Maroc</h3>
                <div className="hero-banner-des">
                  <p>EVplug vous accompagne pour structurer votre projet de recharge en entreprise, en copropriété ou en hôtellerie, avec une approche adaptée aux contraintes locales à Casablanca, Rabat, Marrakech et Tanger.</p>
                  <p>De l&apos;étude technique à la mise en service, nos experts vous aident à optimiser les coûts, planifier les travaux et choisir le bon modèle d&apos;exploitation sur EVone.</p>
                </div>
              </div>
              <div className="flex justify-start gap-spacing-xl">
                <a href={ctaHref} className="btn btn-primary font-base">
                  {ctaLabel || 'Parler à un expert'}
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
  const topImage = platformImage || storyImage || evoneInstallImg
  const bottomImage = heroImage || evoneLaptopImg

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
                          <p>EVone simplifie cette étape avec un suivi clair pour le syndic, des données fiables en temps réel et l&apos;accompagnement EVplug de l&apos;étude à l&apos;exploitation.</p>
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
                      <img src={icons.chargerSignGuide} alt="" loading="lazy" />
                    </div>
                    <div className="m-0 font-semibold"><p>Pilotage centralisé des bornes de la résidence</p></div>
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
                      <img src={icons.installation} alt="" loading="lazy" />
                    </div>
                    <div className="m-0 font-semibold"><p>Facturation individuelle et suivi technique simplifié</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-spacing-xl flex-wrap justify-center pt-spacing-5xl">
            <a href="/contact-us" className="btn btn-primary font-base">
              {heroCta || 'Étudier votre projet'}
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

const SOLUTION_CTAS = [
  { to: '/contact-us', label: 'Demander un devis', variant: 'secondary' },
  { to: '/contact-us', label: 'Parler à un expert', variant: 'secondary-outline' },
]

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
        icon: icons.dashboard,
        title: 'Site management',
        description:
          'Pilotez vos bornes par site, gelez ou activez des points de charge, et suivez la disponibilité en temps réel depuis un tableau de bord unique.',
      },
      {
        icon: icons.profile,
        title: 'User management',
        description:
          "Administrez les profils utilisateurs, les accès, les droits et les habitudes de charge avec une gouvernance claire par équipe ou par entité.",
      },
      {
        icon: icons.coins,
        title: 'Expense and driver management',
        description:
          'Maîtrisez les tarifs, remboursements et rapports financiers avec des exports exploitables pour la finance, la paie et le pilotage opérationnel.',
      },
    ]

  return (
    <>
      {/* 1. Hero */}
      <Hero
        tag={tag}
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImage}
        ctas={[
          { href: '/contact-us', label: heroCta || 'Étudier votre projet', variant: 'primary' },
          { href: '/contact-us', label: 'Parler à un expert', variant: 'secondary-outline' },
        ]}
      />

      {/* 2. Benefits strip */}
      <BenefitsStrip heading="Pourquoi EVplug" items={benefitsItems} />

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
          "Comme sur les pages business Podenergy, EVplug centralise l'exploitation dans un service de gestion connecté pour piloter accès, tarification et performance."
        }
        items={managementSectionItems}
        ctaLabel={managementCta || 'Découvrir EVone Management Service'}
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
      <CtaBanner title={ctaTitle} body={ctaBody} ctas={SOLUTION_CTAS} decorImage={ctaImageSrc} decorBg="#87b4e1" />
    </>
  )
}
