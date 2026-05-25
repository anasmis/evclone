import { useState } from 'react'
import MirrorShell from '../MirrorShell'
import Breadcrumb from '../../components/sections/Breadcrumb'
import Hero from '../../components/sections/Hero'
import BenefitsStrip from '../../components/sections/BenefitsStrip'
import CtaBanner from '../../components/sections/CtaBanner'
import FloatingCtaForm from '../../components/common/FloatingCtaForm'
import BookingCalendar from '../../components/common/BookingCalendar'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import ctaImageSrc from '../../migrated/assets/solutions/shared/cta-image.svg'
import heroImg from '../../migrated/assets/solutions/entreprise/hero.jpg'
import storyImg from '../../migrated/assets/solutions/entreprise/story.jpg'
import platformImg from '../../migrated/assets/solutions/entreprise/platform.jpg'

const ADVISOR_EMAIL = 'mailto:contact@evplug.com'

const benefits = [
  {
    icon: icons.profile,
    title: 'Equipes autonomes',
    description:
      'Des equipes plus autonomes sur la mise en service, le suivi et les bonnes pratiques de recharge EV.',
  },
  {
    icon: icons.chargingDuration,
    title: 'Deploiements plus rapides',
    description:
      'Des techniciens formes qui livrent plus vite, avec moins de retours chantier et moins de blocages.',
  },
  {
    icon: icons.tick,
    title: 'Qualite et securite',
    description:
      'Des equipes alignees avec vos exigences de qualite et de securite, pour des installations conformes.',
  },
  {
    icon: icons.dashboard,
    title: 'Format sur mesure',
    description:
      'En ligne ou sur site, inter-entreprises ou intra-entreprise. Nous adaptons le rythme et le contenu.',
  },
]

const levels = [
  {
    number: '01',
    name: 'Niveau 1 — Sensibilisation',
    duration: '2h en ligne',
    audience: 'Equipes operationnelles et support',
    summary:
      'Donnez une base commune sur la recharge VE, les enjeux et les bonnes pratiques de securite.',
    bullets: [
      'Vocabulaire et fondamentaux de la recharge VE',
      'Risques electriques et reflexes HSE',
      'Roles et responsabilites sur un projet de recharge',
    ],
  },
  {
    number: '02',
    name: 'Niveau 2 — Operationnel',
    duration: '1 a 2 jours sur site',
    audience: 'Techniciens, chefs de chantier, HSE',
    summary:
      'Mise en service, controles de conformite et procedures terrain pour deployer en confiance.',
    bullets: [
      'Sequence de mise en service et tests fonctionnels',
      'Controles de conformite et PV de reception',
      'Diagnostic, reprise chantier et tracabilite',
    ],
  },
  {
    number: '03',
    name: 'Niveau 3 — Referent',
    duration: '3 jours intra-entreprise',
    audience: 'Responsables techniques et qualite',
    summary:
      "Pilotez votre parc de bornes : qualite, supervision et amelioration continue avec l'ecosysteme EVplug.",
    bullets: [
      "Supervision multi-sites et indicateurs cles",
      "Plan qualite, retours d'experience et formation interne",
      'Integration avec EVone et roadmap de deploiement',
    ],
  },
]

const adaptedModules = [
  {
    icon: icons.tick,
    audience: 'HSE & techniciens',
    title: 'Securite',
    description:
      "Bonnes pratiques HSE specifiques aux installations de recharge, pour proteger vos equipes et vos chantiers.",
    bullets: [
      'Habilitations electriques et EPI adaptes',
      'Consignation et gestion des risques sur site',
      'Lecture des schemas et reperage des dangers',
    ],
  },
  {
    icon: icons.chargerSignGuide,
    audience: 'Techniciens & chefs de chantier',
    title: 'Mise en service',
    description:
      "Procedures guidees pour livrer une installation prete a charger, du premier test au PV de reception.",
    bullets: [
      'Sequence de mise sous tension et tests fonctionnels',
      'Controles de conformite et validation client',
      'Documentation et tracabilite de la mise en service',
    ],
  },
  {
    icon: icons.smartCharge,
    audience: 'Equipes terrain',
    title: 'Bonnes pratiques',
    description:
      "Methodes eprouvees pour cabler, dimensionner et integrer la borne au tableau electrique sans surprise.",
    bullets: [
      'Dimensionnement et choix du materiel',
      'Integration au tableau et protections',
      'Anticipation des contraintes specifiques au site',
    ],
  },
  {
    icon: icons.dashboard,
    audience: 'Operations & qualite',
    title: 'Suivi des installations',
    description:
      "Suivi qualite et amelioration continue de votre parc, pour faire monter en competence l'ensemble de l'equipe.",
    bullets: [
      "Suivi qualite et retours d'experience",
      'Gestion des incidents et reprise de chantier',
      'Indicateurs et boucle d\'amelioration continue',
    ],
  },
]

export default function Corporate() {
  const [openModuleIndex, setOpenModuleIndex] = useState(null)

  const handleModuleToggle = (index) => {
    setOpenModuleIndex((current) => (current === index ? null : index))
  }

  return (
    <MirrorShell documentTitle="Formations Professionnelles EVplug | Qualifier vos equipes a la recharge EV">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb
              current="Entreprises"
              trail={[{ to: '/training', label: 'Formation' }]}
            />

            <Hero
              tag="Service Entreprise"
              title="Formations Professionnelles pour entreprises"
              subtitle={
                <>
                  <p>
                    <strong>
                      Qualifiez vos equipes a la recharge EV, a votre rythme et selon votre contexte terrain.
                    </strong>
                  </p>
                  <p>
                    EVplug accompagne les entreprises avec des formations sur mesure pour les equipes techniques, HSE
                    et operations. Nous adaptons chaque parcours a votre contexte terrain, a votre rythme et a vos
                    contraintes de deploiement.
                  </p>
                </>
              }
              ctas={[
                { to: '/contact-us', label: 'Demander un devis entreprise', variant: 'primary' },
                { href: ADVISOR_EMAIL, label: 'Parler a un conseiller', variant: 'primary-outline' },
              ]}
              image={heroImg}
              imageAlt="Formations Professionnelles EVplug"
            />

            <BenefitsStrip heading="Vos objectifs, notre programme" items={benefits} />

            {/* Story panel */}
            <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
              <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
                <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block">
                  <div className="md:w-6/12 w-full">
                    <img className="w-full rounded-2xl object-cover" src={storyImg} alt="Formations sur mesure" loading="lazy" />
                  </div>
                  <div className="md:w-6/12 w-full">
                    <div className="max-w-[480px] grid gap-spacing-3xl">
                      <h3 className="tracking-tight m-0">Des equipes plus autonomes, plus rapides, mieux alignees</h3>
                      <div className="hero-banner-des">
                        <p>
                          EVplug accompagne les entreprises avec des formations sur mesure pour les equipes techniques,
                          HSE et operations. Nous adaptons chaque parcours a votre contexte terrain, a votre rythme et
                          a vos contraintes de deploiement.
                        </p>
                        <p>
                          Objectif : des equipes plus autonomes, plus rapides et mieux alignees avec vos exigences de
                          qualite et de securite.
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-start gap-spacing-xl">
                        <a href="/contact-us" className="btn btn-primary font-base">
                          Demander un devis
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Niveaux */}
            <section className="relative bg-white top-spacing" id="niveaux">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid gap-spacing-6xl">
                  <div className="view-header text-center max-w-[720px] mx-auto">
                    <div className="heading-block grid gap-spacing-3xl">
                      <span className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-sm font-semibold w-fit mx-auto">
                        Parcours en 3 niveaux
                      </span>
                      <h2 className="tracking-tight m-0">Les niveaux de formation entreprise</h2>
                      <p>
                        Un parcours progressif pour faire monter vos equipes en competence, de la
                        sensibilisation a la prise en charge de votre parc de bornes.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-spacing-4xl">
                    {levels.map((lvl) => (
                      <div
                        key={lvl.number}
                        className="bg-surface rounded-2xl p-spacing-6xl border border-gray-200 grid gap-spacing-3xl"
                      >
                        <div className="flex items-start justify-between gap-spacing-xl">
                          <span className="font-PosterCutNeue text-5xl leading-none text-black">
                            {lvl.number}
                          </span>
                          <span className="text-xs uppercase tracking-[0.15em] font-semibold bg-lime text-black px-spacing-md py-spacing-xs rounded-full">
                            {lvl.duration}
                          </span>
                        </div>
                        <div className="grid gap-spacing-sm">
                          <h3 className="m-0 tracking-tight text-2xl">{lvl.name}</h3>
                          <p className="uppercase tracking-[0.15em] text-xs font-semibold text-gray-600 m-0">
                            {lvl.audience}
                          </p>
                        </div>
                        <p className="m-0">{lvl.summary}</p>
                        <ul className="m-0 p-0 list-none grid gap-spacing-sm">
                          {lvl.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-spacing-sm">
                              <img
                                src={icons.tick}
                                alt=""
                                width={12}
                                height={12}
                                className="mt-1 shrink-0"
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-spacing-3xl">
                    <a href="#calendrier" className="btn btn-primary font-base">
                      Voir le calendrier
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <BookingCalendar
              formationKey="corporate"
              title="Reservez une session entreprise"
              subtitle="Selectionnez une date pour decouvrir les sessions ouvertes ou demander une session intra-entreprise."
              accentColor="#c8d72d"
            />

            {/* Ce que nous adaptons */}
            <section className="relative bg-white top-spacing">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="grid gap-spacing-6xl">
                  <div className="view-header text-center max-w-[720px] mx-auto">
                    <div className="heading-block grid gap-spacing-3xl">
                      <span className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-sm font-semibold w-fit mx-auto">
                        Programme sur mesure
                      </span>
                      <h2 className="tracking-tight m-0">Ce que nous adaptons</h2>
                      <div>
                        <p>
                          Quatre modules combines a la carte, selon le profil de vos equipes et la phase de votre
                          deploiement. Chaque module est ajustable en duree, en profondeur et en exemples terrain.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-spacing-4xl">
                    {adaptedModules.map((module, idx) => {
                      const isOpen = openModuleIndex === idx
                      const detailsId = `module-details-${idx}`
                      const moduleIconSize = module.icon === icons.tick ? 20 : 32

                      return (
                        <div
                          key={module.title}
                          className="bg-surface rounded-2xl p-spacing-6xl border border-gray-200 hover:border-gray-300 transition text-black"
                        >
                          <button
                            type="button"
                            className="w-full text-left grid gap-spacing-3xl bg-transparent border-0 p-0 cursor-pointer"
                            onClick={() => handleModuleToggle(idx)}
                            aria-expanded={isOpen}
                            aria-controls={detailsId}
                          >
                            <div className="flex items-start justify-between gap-spacing-xl">
                              <div className="w-14 h-14 bg-lime rounded-full flex items-center justify-center p-3 shrink-0">
                                <img
                                  src={module.icon}
                                  alt=""
                                  width={moduleIconSize}
                                  height={moduleIconSize}
                                  className="object-contain"
                                />
                              </div>
                              <span className="font-PosterCutNeue text-4xl text-gray-300 leading-none" aria-hidden="true">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <div className="grid gap-spacing-sm">
                              <p className="uppercase tracking-[0.2em] text-xs font-semibold text-black m-0">
                                {module.audience}
                              </p>
                              <h3 className="m-0 tracking-tight text-2xl">{module.title}</h3>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="uppercase tracking-[0.15em] text-xs font-semibold text-black m-0">
                                {isOpen ? 'Masquer le programme' : 'Voir le programme'}
                              </span>
                              <span className="text-2xl leading-none" aria-hidden="true">
                                {isOpen ? '-' : '+'}
                              </span>
                            </div>
                          </button>
                          <div
                            id={detailsId}
                            aria-hidden={!isOpen}
                            className="overflow-hidden transition-all duration-300 ease-out"
                            style={{ maxHeight: isOpen ? '480px' : '0px', opacity: isOpen ? 1 : 0 }}
                          >
                            <div className="pt-spacing-3xl grid gap-spacing-3xl">
                              <p className="m-0">{module.description}</p>
                              <div className="border-t border-gray-200 pt-spacing-xl grid gap-spacing-sm">
                                <p className="uppercase tracking-[0.15em] text-xs font-semibold text-gray-500 m-0">
                                  Au programme
                                </p>
                                <ul className="m-0 p-0 list-none grid gap-spacing-sm">
                                  {module.bullets.map((bullet) => (
                                    <li key={bullet} className="flex items-start gap-spacing-sm">
                                      <img
                                        src={icons.tick}
                                        alt=""
                                        width={12}
                                        height={12}
                                        className="mt-1 shrink-0"
                                      />
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex justify-center pt-spacing-3xl">
                    <a href="/contact-us" className="btn btn-primary font-base">
                      Composer mon programme
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Formats panel */}
            <section className="text-left-right-variant relative image-text-section bg-surface top-spacing">
              <div className="grid container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile gap-spacing-4xl image-text-block">
                <div className="flex flex-col md:flex-row py-spacing-7xl items-center justify-between xl:gap-spacing-9xl gap-spacing-7xl grid-block md:flex-row-reverse rounded-3xl bg-white border border-gray-200 p-spacing-7xl">
                  <div className="md:w-6/12 w-full">
                    <img className="w-full rounded-2xl object-cover" src={platformImg} alt="Formats de formation" loading="lazy" />
                  </div>
                  <div className="md:w-6/12 w-full">
                    <div className="max-w-[480px] grid gap-spacing-3xl">
                      <h3 className="tracking-tight m-0">Formats</h3>
                      <div className="hero-banner-des">
                        <p>
                          Sessions en ligne ou sur site, inter-entreprises ou intra-entreprise, selon vos besoins
                          operationnels.
                        </p>
                        <ul>
                          <li>En ligne ou sur site</li>
                          <li>Inter-entreprises (sessions ouvertes) ou intra-entreprise (sur mesure)</li>
                          <li>Rythme et contenu adaptes a vos contraintes de deploiement</li>
                        </ul>
                      </div>
                      <div className="flex flex-wrap justify-start gap-spacing-xl">
                        <a href="/contact-us" className="btn btn-primary font-base">
                          Demander un devis entreprise
                        </a>
                        <a href={ADVISOR_EMAIL} className="btn btn-secondary font-base">
                          Parler a un conseiller
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <CtaBanner
              title="Construisons votre programme de formation"
              body="Decrivez vos equipes, vos sites et vos objectifs de deploiement : un conseiller EVplug vous propose un parcours sur mesure."
              ctas={[
                { to: '/contact-us', label: 'Demander un devis entreprise', variant: 'secondary' },
                { href: ADVISOR_EMAIL, label: 'Parler a un conseiller', variant: 'secondary-outline' },
              ]}
              decorImage={ctaImageSrc}
              decorBg="#c8d72d"
            />
          </div>
        </article>
      </div>
      <FloatingCtaForm
        buttonLabel="Devis entreprise"
        title="Construisons votre programme"
        subtitle="Decrivez vos equipes, vos sites et vos objectifs : un conseiller EVplug vous recontacte sous 24h."
        interestOptions={[
          'Formation HSE & securite',
          'Mise en service',
          'Bonnes pratiques terrain',
          'Suivi des installations',
          'Programme sur mesure',
          'Autre',
        ]}
        defaultInterest="Programme sur mesure"
        accentColor="#c8d72d"
      />
    </MirrorShell>
  )
}
