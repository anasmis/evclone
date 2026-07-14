import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import MirrorShell from '../MirrorShell'
import BrandsMarquee from '../../components/common/BrandsMarquee'
import FloatingCtaForm from '../../components/common/FloatingCtaForm'
import { submitHomeChargingRequest } from '../../lib/api/strapi'
import Breadcrumb from '../../components/sections/Breadcrumb'
import Hero from '../../components/sections/Hero'
import Accordion from '../../components/sections/Accordion'
import HelpBand from '../../components/sections/HelpBand'
import CtaBanner from '../../components/sections/CtaBanner'
import BenefitsStrip from '../../components/sections/BenefitsStrip'
import HomeChargingSimulator from '../../components/sections/HomeChargingSimulator'
import hero from '../../migrated/assets/installation/standard-img-1.jpeg'
import iconCharger from '../../migrated/assets/home-charging/icon-charger.svg'
import iconInstall from '../../migrated/assets/home-charging/icon-install.svg'
import iconOffers from '../../migrated/assets/home-charging/icon-offers.svg'
import step1 from '../../migrated/assets/home-charging/step-1.svg'
import step2 from '../../migrated/assets/home-charging/step-2.svg'
import step3 from '../../migrated/assets/home-charging/step-3.svg'
import step4 from '../../migrated/assets/home-charging/step-4.svg'
import methodImg1 from '../../migrated/assets/home-charging/method-img-1.jpeg'
import methodImg2 from '../../migrated/assets/home-charging/method-img-2.jpeg'
import singleImage from '../../migrated/assets/home-charging/single-image.jpeg'
import helpIcon from '../../migrated/assets/home-charging/help-icon.png'
import ctaImage from '../../migrated/assets/home-charging/cta-image.svg'
import ford from '../../migrated/assets/home-charging/brands/ford.svg'
import bmw from '../../migrated/assets/home-charging/brands/bmw.svg'
import jeep from '../../migrated/assets/home-charging/brands/jeep.svg'
import audi from '../../migrated/assets/home-charging/brands/audi.svg'
import fiat from '../../migrated/assets/home-charging/brands/fiat.svg'
import kia from '../../migrated/assets/home-charging/brands/kia.svg'
import landRover from '../../migrated/assets/home-charging/brands/land-rover.svg'
import toyota from '../../migrated/assets/home-charging/brands/toyota.svg'

// High-level promises shown right under the hero.
const pillars = [
  {
    icon: iconCharger,
    title: 'Borne fiable et garantie',
    body: 'Des bornes sélectionnées pour leur fiabilité, adaptées à votre véhicule et à votre logement, livrées avec garantie.',
  },
  {
    icon: iconInstall,
    title: 'Installation certifiée à domicile',
    body: 'Audit électrique, pose, tests et mise en service réalisés par des techniciens qualifiés EVplug.',
  },
  {
    icon: iconOffers,
    title: 'Accompagnement de A à Z',
    body: "De l'étude technique gratuite au suivi après installation, un interlocuteur unique du début à la fin.",
  },
]

// Core commitments — the heart of the home-charging offer. Grouped so each item
// is distinct (professionalism, standards, audit, premium protection, guarantee,
// tailored solutions) rather than ten overlapping bullets.
const engagements = [
  {
    icon: 'fa-helmet-safety',
    title: 'Installation professionnelle & équipes certifiées',
    body: "Pose réalisée dans les règles de l'art par des experts et des équipes techniques certifiées, formés à la recharge de véhicules électriques.",
  },
  {
    icon: 'fa-clipboard-check',
    title: 'Respect des normes, en résidence et copropriété',
    body: 'Installations conformes aux normes électriques en vigueur (IEC 61851), en résidence individuelle comme en copropriété.',
  },
  {
    icon: 'fa-magnifying-glass-chart',
    title: 'Audit technique et conformité',
    body: "Nous auditons votre installation électrique existante et vérifions sa conformité avant toute intervention.",
  },
  {
    icon: 'fa-shield-halved',
    title: 'Protection et câblage premium',
    body: 'Protection contre les surtensions, disjoncteur dédié et, si nécessaire, tirage de câble et goulotte — le tout de qualité premium.',
  },
  {
    icon: 'fa-file-shield',
    title: 'Borne et installation garanties',
    body: 'Des bornes fiables livrées avec garantie, et une installation garantie avec suivi et intervention en cas de besoin.',
  },
  {
    icon: 'fa-screwdriver-wrench',
    title: 'Solutions adaptées à vos contraintes',
    body: 'Nous nous adaptons à vos contraintes techniques et trouvons des solutions fiables, quel que soit votre logement.',
  },
]

const steps = [
  { n: 1, title: 'Choisir votre borne', img: step1 },
  { n: 2, title: 'Étude technique à domicile', img: step2 },
  { n: 3, title: 'Pose par un technicien certifié', img: step3 },
  { n: 4, title: 'Rechargez chez vous', img: step4 },
]

// Worthy engagement themes expanded into highlighted sections. Supporting
// commitments from the spotlight are folded in as points on the section they
// belong to, so every engagement is developed in depth somewhere on the page.
const featureSections = [
  {
    tag: 'Installation certifiée',
    title: "Une installation professionnelle, dans les règles de l'art",
    intro:
      "Votre borne est posée par des experts et des équipes techniques certifiées, dans le respect strict des normes — pour une recharge sûre et durable chez vous.",
    image: methodImg1,
    imageAlt: 'Installation à domicile par un technicien certifié EVplug',
    badge: { icon: 'fa-helmet-safety', title: 'Techniciens certifiés', sub: 'Formés à la recharge EV' },
    reverse: true,
    surface: true,
    cta: 'Demander mon installation',
    points: [
      {
        icon: 'fa-user-graduate',
        title: 'Experts et équipes certifiées',
        body: 'Des techniciens formés spécifiquement à la recharge de véhicules électriques.',
      },
      {
        icon: 'fa-clipboard-check',
        title: 'Respect des normes, résidence et copropriété',
        body: 'Installations conformes aux normes IEC 61851, en villa comme en copropriété.',
      },
      {
        icon: 'fa-magnifying-glass-chart',
        title: 'Audit technique et conformité',
        body: "Nous vérifions la conformité de votre installation électrique existante avant toute intervention.",
      },
    ],
  },
  {
    tag: 'Qualité premium',
    title: 'Du matériel et une protection de qualité premium',
    intro:
      "Une borne fiable et garantie, protégée par un appareillage électrique de qualité premium et un raccordement soigné.",
    image: methodImg2,
    imageAlt: 'Borne EVplug et protection électrique premium',
    badge: { icon: 'fa-shield-halved', title: 'Protection premium', sub: 'Borne et logement protégés' },
    cta: 'Demander un devis',
    points: [
      {
        icon: 'fa-certificate',
        title: 'Borne fiable et garantie',
        body: 'Des bornes sélectionnées pour leur fiabilité, livrées avec garantie constructeur et EVplug.',
      },
      {
        icon: 'fa-bolt',
        title: 'Protection électrique premium',
        body: 'Disjoncteur dédié, différentiel et protection contre les surtensions de qualité premium.',
      },
      {
        icon: 'fa-plug-circle-bolt',
        title: 'Tirage de câble premium',
        body: 'Si nécessaire, câble et goulotte de protection de qualité premium pour un raccordement propre et durable.',
      },
    ],
  },
  {
    tag: 'Garanties & sur-mesure',
    title: 'Des garanties et des solutions adaptées à votre logement',
    intro:
      "Votre borne et votre installation sont garanties, et nos équipes s'adaptent à vos contraintes techniques pour trouver la solution la plus fiable.",
    image: singleImage,
    imageAlt: 'Recharge à domicile EVplug',
    badge: { icon: 'fa-file-shield', title: 'Garantie incluse', sub: 'Borne + installation' },
    reverse: true,
    surface: true,
    cta: 'Demander mon étude technique gratuite',
    points: [
      {
        icon: 'fa-file-shield',
        title: 'Garantie borne et installation',
        body: 'Suivi et intervention par nos équipes en cas de besoin, sur la borne comme sur la pose.',
      },
      {
        icon: 'fa-screwdriver-wrench',
        title: 'Solutions adaptées à vos contraintes',
        body: 'Quel que soit votre logement, nous trouvons une solution fiable adaptée à vos contraintes techniques.',
      },
      {
        icon: 'fa-house-circle-check',
        title: 'Étude technique gratuite',
        body: "Une étude sans engagement cadre l'emplacement, le câblage et la mise aux normes avant intervention.",
      },
    ],
  },
]

const brands = [ford, bmw, jeep, audi, fiat, kia, landRover, toyota]

const faqInstallation = [
  {
    q: 'Quel est le meilleur emplacement pour installer une borne ?',
    a: "L'emplacement idéal est un mur extérieur ou intérieur de garage, à proximité de votre stationnement habituel. La borne doit être installée dans un endroit sec, ventilé et accessible pour que la recharge soit à la fois sûre et confortable. Vérifiez la longueur du câble nécessaire entre la borne et la prise de votre véhicule. Au Maroc, les configurations de villas, riads et copropriété varient beaucoup : notre conseiller EVplug étudie chaque cas pour vous proposer la longueur de câble et le positionnement adaptés. La distance entre votre tableau électrique et l'emplacement souhaité joue un rôle important : plus elle est courte, plus l'installation est économique. Notre étude technique gratuite cadre ces points avant intervention.",
  },
  {
    q: 'Faut-il une autorisation pour installer une borne à domicile ?',
    a: "Si vous êtes propriétaire d'une villa avec parking privé, aucune autorisation spécifique n'est nécessaire. Si vous êtes locataire ou propriétaire dans une copropriété, vous devez obtenir l'accord du syndic ou du propriétaire avant l'installation. EVplug propose une solution dédiée aux copropriétés : étude électrique du parking, installation dans le respect des normes collectives et gestion administrative simplifiée. Notre équipe accompagne les syndics dans la présentation du projet en assemblée générale.",
  },
  {
    q: 'Combien de temps faut-il pour installer une borne EVplug à domicile ?',
    a: "Une installation standard est réalisée en 2 à 4 heures sur site. Pour les configurations spécifiques (génie civil, mise à niveau électrique, long tirage de câble), notre équipe vous communique le délai estimé après étude technique.",
  },
  {
    q: "Que se passe-t-il si mon installation n'est pas standard ?",
    a: "Les installations spécifiques (longues distances de câble, travaux de génie civil, mise à niveau du tableau électrique, raccordement triphasé) peuvent générer un coût additionnel. À la suite de votre demande, nos techniciens réalisent une étude détaillée et s'adaptent à vos contraintes pour vous proposer une solution fiable, puis vous remettent un devis ferme sans engagement. Si vous ne souhaitez pas donner suite, aucun frais ne vous est facturé pour cette étude.",
  },
]

const faqGeneral = [
  {
    q: 'Tout électricien peut-il installer une borne de recharge ?',
    a: "Seul un électricien qualifié peut installer une borne de recharge en respectant les normes en vigueur. Au Maroc, les techniciens EVplug sont formés spécifiquement aux normes IEC 61851 et aux exigences de sécurité des installations de recharge électrique. Tous nos partenaires installateurs disposent des qualifications électriques requises et d'une expérience confirmée en pose de bornes. EVplug propose l'installation comme prestation intégrée à l'achat de votre borne.",
  },
  {
    q: 'Une borne EVplug est-elle compatible avec des panneaux solaires ?',
    a: "Oui. Le Maroc bénéficie d'un ensoleillement exceptionnel et plusieurs bornes du catalogue EVplug intègrent la compatibilité solaire native. Vous pouvez recharger votre véhicule avec votre installation photovoltaïque, le réseau ONEE, ou un mix des deux selon vos préférences. Notre conseiller EVplug vous oriente vers le modèle de borne le plus adapté à votre configuration solaire.",
  },
  {
    q: 'EVplug fonctionne-t-il avec mon abonnement ONEE ?',
    a: "Oui. Les bornes du catalogue EVplug fonctionnent avec votre abonnement ONEE ou régie locale, sans modification d'abonnement. Si votre tarification comporte des plages horaires distinctes, programmez la recharge sur les heures les plus avantageuses depuis l'application EVplug pour optimiser le coût de chaque session.",
  },
]

const faqInstallationItems = faqInstallation.map(({ q, a }) => ({ title: q, body: a }))
const faqGeneralItems = faqGeneral.map(({ q, a }) => ({ title: q, body: a }))

// Opens the page's floating CTA form (FloatingCtaForm listens for this event)
// so "Demander" buttons surface the lead form instead of leaving the page.
const openCtaForm = () => window.dispatchEvent(new CustomEvent('floating-cta-form:open'))

// Interactive, auto-rotating spotlight for the home-charging commitments.
// Cycles on its own (5s), pauses on hover, and lets you hover/click any item
// to feature it. Motion is disabled under prefers-reduced-motion.
function EngagementsShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const count = engagements.length
  const panelRef = useRef(null)

  // On tap, the feature card sits above the selector rail on mobile, so bring it
  // back into view to show the commitment the user just picked. Desktop keeps the
  // sticky panel + hover behaviour, so no scroll there.
  const handleSelect = (i) => {
    setActive(i)
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1280px)').matches) {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (paused || reduced) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % count), 5000)
    return () => clearInterval(id)
  }, [paused, reduced, count])

  const cur = engagements[active]

  return (
    <section className="bg-surface relative xl:py-spacing-9xl py-spacing-7xl">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto">
        <div className="grid gap-spacing-6xl">
          <div className="grid gap-spacing-3xl text-center max-w-[820px] mx-auto">
            <h2 className="tracking-tight m-0">Nos engagements pour votre installation à domicile</h2>
            <div className="m-0">
              <p>
                Une borne fiable, posée dans les règles de l'art, garantie et adaptée à votre logement — villa,
                appartement ou copropriété. Survolez ou sélectionnez un engagement.
              </p>
            </div>
          </div>

          <div
            className="grid gap-spacing-4xl xl:grid-cols-[1.1fr_1fr] items-start"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Feature panel */}
            <div
              ref={panelRef}
              className="relative self-start xl:sticky xl:top-[120px] bg-blue-dianne rounded-3xl p-spacing-6xl md:p-spacing-7xl text-white overflow-hidden flex flex-col justify-between min-h-[380px] scroll-mt-[100px]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-pear/20 blur-3xl"
              />
              <div key={active} className="eng-spot-content grid gap-spacing-3xl relative">
                <span className="w-16 h-16 rounded-2xl bg-pear flex items-center justify-center">
                  <i className={`fa-solid ${cur.icon} text-3xl text-blue-dianne`} aria-hidden="true" />
                </span>
                <h3 className="text-white m-0 tracking-tight">{cur.title}</h3>
                <div className="m-0">
                  <p className="text-white/85">{cur.body}</p>
                </div>
              </div>
              <div className="mt-spacing-5xl h-1 rounded-full bg-white/5 overflow-hidden">
                <span
                  key={active}
                  className={`eng-spot-progress block h-full w-full origin-left bg-white/15${paused ? ' is-paused' : ''}`}
                />
              </div>
            </div>

            {/* Selector rail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-spacing-sm content-start">
              {engagements.map((e, i) => {
                const on = i === active
                return (
                  <button
                    type="button"
                    key={e.title}
                    onClick={() => handleSelect(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-current={on}
                    className={`text-left flex items-center gap-spacing-xl rounded-2xl p-spacing-2xl cursor-pointer transition-all duration-200 ${
                      on
                        ? 'bg-white -translate-y-0.5 shadow-[0_14px_34px_-16px_rgba(22,62,76,0.55)]'
                        : 'bg-white/45 hover:bg-white/80'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        on ? 'bg-lime' : 'bg-surface'
                      }`}
                    >
                      <i
                        className={`fa-solid ${e.icon} text-lg ${on ? 'text-blue-dianne' : 'text-blue-dianne/60'}`}
                        aria-hidden="true"
                      />
                    </span>
                    <span className={`font-semibold leading-snug ${on ? 'text-black' : 'text-black/70'}`}>
                      {e.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="text-center grid justify-center">
            <button type="button" className="btn btn-primary" onClick={openCtaForm}>
              Demander mon étude technique gratuite
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes eng-spot-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes eng-spot-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .eng-spot-content { animation: eng-spot-in .45s cubic-bezier(.2,.8,.3,1) both; }
        .eng-spot-progress { animation: eng-spot-fill 5s linear both; }
        .eng-spot-progress.is-paused { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .eng-spot-content { animation: none; }
          .eng-spot-progress { animation: none; transform: scaleX(1); }
        }
      `}</style>
    </section>
  )
}

// One highlighted section per theme: tagged heading + icon points on one side,
// a photo with a floating badge on the other, alternating sides down the page.
function FeatureSection({ tag, title, intro, points, image, imageAlt, badge, reverse = false, surface = false, cta }) {
  const circleBg = surface ? 'bg-white' : 'bg-surface'
  return (
    <section className={`relative ${surface ? 'bg-surface' : 'bg-white'} xl:py-spacing-9xl py-spacing-7xl`}>
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto">
        <div
          className={`flex gap-spacing-7xl items-center xl:justify-between justify-center xl:flex-nowrap flex-wrap${
            reverse ? ' xl:flex-row-reverse' : ''
          }`}
        >
          <div className="xl:max-w-[520px] xl:w-6/12 w-full">
            <div className="grid gap-spacing-5xl">
              <div className="grid gap-spacing-3xl">
                <span className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-sm font-semibold w-fit">
                  {tag}
                </span>
                <h2 className="tracking-tight m-0">{title}</h2>
                <div className="m-0">
                  <p>{intro}</p>
                </div>
              </div>
              <ul className="grid gap-spacing-3xl m-0 p-0 list-none">
                {points.map((p) => (
                  <li key={p.title} className="flex items-start gap-spacing-xl">
                    <span className={`shrink-0 w-11 h-11 rounded-full ${circleBg} flex items-center justify-center`}>
                      <i className={`fa-solid ${p.icon} text-lg text-blue-dianne`} aria-hidden="true" />
                    </span>
                    <div className="grid gap-spacing-xs content-start">
                      <span className="font-semibold font-lg">{p.title}</span>
                      <div className="m-0">
                        <p>{p.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {cta && (
                <div>
                  <button type="button" className="btn btn-primary" onClick={openCtaForm}>
                    {cta}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="xl:w-6/12 w-full flex justify-center">
            <div className="relative w-full max-w-[520px]">
              <img src={image} alt={imageAlt} className="w-full object-cover rounded-2xl aspect-[4/3]" loading="lazy" />
              {badge && (
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-[260px] bg-white rounded-2xl shadow-xl p-spacing-2xl flex items-center gap-spacing-md">
                  <span className="shrink-0 w-11 h-11 rounded-full bg-lime flex items-center justify-center">
                    <i className={`fa-solid ${badge.icon} text-lg text-blue-dianne`} aria-hidden="true" />
                  </span>
                  <div className="grid gap-spacing-xs">
                    <span className="font-semibold leading-tight">{badge.title}</span>
                    <span className="font-sm leading-tight text-gray-500">{badge.sub}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomeCharging() {
  return (
    <MirrorShell documentTitle="Recharge à domicile | EVplug Maroc">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Recharge à domicile" />

            <Hero
              tag="Recharge à domicile"
              title="Rechargez votre voiture électrique chez vous, en toute sérénité"
              subtitle={
                <>
                  <p>
                    <strong>
                      Installez une borne de recharge fiable à votre domicile, posée par des techniciens certifiés
                      EVplug.
                    </strong>
                  </p>
                  <p>
                    Audit technique, mise aux normes, protection premium et garantie : nous nous adaptons à votre
                    logement — villa, appartement ou copropriété — pour une recharge sûre et durable.
                  </p>
                </>
              }
              ctas={[
                { onClick: openCtaForm, label: 'Demander mon installation', variant: 'primary' },
                { to: '/installation', label: "Comment se passe l'installation ?", variant: 'primary-outline' },
              ]}
              footnote="Étude technique gratuite et sans engagement · Techniciens certifiés · Garantie borne et installation"
              image={hero}
              imageAlt="Borne de recharge EVplug installée à domicile au Maroc"
            />

            <BenefitsStrip
              heading="La recharge à domicile, faite dans les règles de l'art"
              items={pillars.map((item) => ({ icon: item.icon, title: item.title, description: item.body }))}
            />

            {/* Quality commitments */}
            <EngagementsShowcase />

            {/* Decide your needs — interactive charging configurator */}
            <HomeChargingSimulator />

            {/* How it works */}
            <section className="bg-surface relative xl:py-spacing-9xl py-spacing-7xl how-it-work-section">
              <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile how-it-work-block">
                <div className="grid gap-spacing-6xl">
                  <div className="grid gap-spacing-3xl text-center max-w-[788px] mx-auto pr-spacing-2xl md:pr-spacing-4xl xl:pr-spacing-none">
                    <h3 className="text-center tracking-tight m-0">Comment ça marche</h3>
                    <div className="m-0">
                      <p>Un accompagnement complet, du choix de la borne à la mise en service chez vous.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-spacing-4xl justify-center">
                    {steps.map((s) => (
                      <div key={s.n} className="w-full text-center bg-white p-spacing-3xl rounded-2xl justify-center">
                        <div className="grid gap-spacing-4xl">
                          <div className="grid gap-spacing-xl justify-center">
                            <div className="bg-pear w-[44px] mx-auto h-[44px] rounded-full flex items-center justify-center text-black font-semibold font-2xl">
                              {s.n}
                            </div>
                            <h6 className="m-0 min-h-[60px] line-clamp-2">{s.title}</h6>
                          </div>
                          <div className="bg-surface rounded-2xl gap-spacing-md items-center justify-center w-full min-h-[190px] p-spacing-3xl grid">
                            <img className="mx-auto h-[120px]" src={s.img} alt={s.title} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center grid justify-center">
                    <button type="button" className="btn btn-primary" onClick={openCtaForm}>
                      Demander un devis
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Brand logos */}
            <section className="relative logo-spread-section bg-white rounded-b-4xl xl:pt-spacing-7xl xl:pb-spacing-9xl py-spacing-7xl gap-spacing-4xl">
              <div className="max-w-[590px] mx-auto w-full text-center mb-spacing-6xl px-spacing-xl">
                <h3 className="tracking-tight m-0">Compatibles avec toutes les marques de véhicules électriques</h3>
              </div>
              <div className="container-max-width-desktop container-max-width-tablet mx-auto">
                <div className="grid gap-spacing-3xl">
                  <BrandsMarquee logos={brands} direction="left" speed={45} />
                  <BrandsMarquee logos={[...brands].reverse()} direction="right" speed={45} />
                </div>
              </div>
            </section>

            {/* Highlighted commitment sections */}
            {featureSections.map((section) => (
              <FeatureSection key={section.tag} {...section} />
            ))}

            <div className="bg-surface flex gap-spacing-xl flex-wrap justify-center pb-spacing-9xl">
              <Link to="/installation" className="btn btn-primary font-base">
                En savoir plus sur l'installation
              </Link>
            </div>

            {/* FAQ */}
            <section className="bg-white">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="view-header text-center">
                  <div className="heading-block pb-12 grid gap-spacing-sm">
                    <h4 className="tracking-tight m-0">Questions fréquentes</h4>
                  </div>
                </div>
                <div className="grid sm:gap-spacing-7xl gap-spacing-5xl">
                  <div className="space-y-6">
                    <h2 className="md:font-4xl font-3xl font-bold tracking-tight text-start">Installation</h2>
                    <Accordion variant="faq" items={faqInstallationItems} defaultOpen={-1} />
                  </div>
                  <Accordion variant="faq" items={faqGeneralItems} defaultOpen={-1} />
                </div>
              </div>
            </section>

            <HelpBand
              icon={helpIcon}
              title="Notre équipe support est joignable 24h/24, 7j/7."
              body={
                <>
                  Besoin d'aide ?{' '}
                  <Link to="/contact-us">
                    <strong>
                      <u>Contactez-nous</u>
                    </strong>
                  </Link>
                </>
              }
            />

            <CtaBanner
              title="Votre recharge à domicile commence ici."
              body="Une borne fiable et garantie, posée par des techniciens certifiés et adaptée à votre logement. Demandez votre étude technique gratuite."
              ctas={[{ onClick: openCtaForm, label: 'Demander mon installation', variant: 'secondary' }]}
              decorImage={ctaImage}
            />
          </div>
        </article>
      </div>
      <FloatingCtaForm
        buttonLabel="Recharger chez moi"
        title="Recharge à domicile"
        subtitle="Installation d'une borne à votre domicile : indiquez votre besoin, un conseiller EVplug vous recontacte sous 24h."
        defaultInterest="Installation à domicile"
        accentColor="#c8d72d"
        submitFn={submitHomeChargingRequest}
      />
    </MirrorShell>
  )
}
