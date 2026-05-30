import { useState } from 'react'
import { Link } from 'react-router-dom'
import MirrorShell from '../MirrorShell'
import CardsCarousel from '../../components/common/CardsCarousel'
import Breadcrumb from '../../components/sections/Breadcrumb'
import Hero from '../../components/sections/Hero'
import Accordion from '../../components/sections/Accordion'
import HelpBand from '../../components/sections/HelpBand'
import heroImg from '../../migrated/assets/carte-evplug/hero.png'
import filterIcon from '../../migrated/assets/carte-evplug/filter-icon.svg'
import featureUntethered from '../../migrated/assets/carte-evplug/feature-untethered.jpeg'
import featureApp from '../../migrated/assets/carte-evplug/feature-app.jpeg'
import featureTethered from '../../migrated/assets/carte-evplug/feature-tethered.jpeg'
import featureWarranty from '../../migrated/assets/carte-evplug/feature-warranty.jpeg'
import tickIcon from '../../migrated/assets/carte-evplug/tick.svg'
import coinsIcon from '../../migrated/assets/carte-evplug/coins.svg'
import chargerAccordion1 from '../../migrated/assets/carte-evplug/charger-accordion-1.jpeg'
import chargerAccordion2 from '../../migrated/assets/carte-evplug/charger-accordion-2.jpeg'
import appAccordion1 from '../../migrated/assets/carte-evplug/app-accordion-1.jpeg'
import appAccordion2 from '../../migrated/assets/carte-evplug/app-accordion-2.jpeg'
import chatIcon from '../../migrated/assets/carte-evplug/chat-icon.svg'

const carouselItems = [
  {
    title: 'Cout initial reduit, services inclus',
    description:
      "Votre formule peut inclure une borne partenaire, l'installation domicile, la carte EVplug et un package de credits de recharge selon le profil d'usage.",
    image: featureUntethered,
    tag: { icon: tickIcon, label: "Economisez jusqu'a 12 000 MAD a l'achat" },
    cta: { href: 'https://www.maborneelectrique.ma/connexion', label: 'Verifier mon eligibilite', external: true },
  },
  {
    title: 'Recharge intelligente, maitrisez vos couts',
    description:
      "La recharge intelligente optimise automatiquement vos sessions selon les plages horaires les plus avantageuses. Indiquez simplement l'heure a laquelle votre vehicule doit etre pret, et notre application s'occupe du reste pour minimiser votre facture d'electricite.",
    image: featureApp,
    tag: { icon: coinsIcon, label: "Pilotage intelligent de votre recharge via l'application" },
    cta: { href: 'https://www.maborneelectrique.ma/connexion', label: 'Verifier mon eligibilite', external: true },
  },
  {
    title: 'Maintenance et support inclus',
    description:
      'Votre abonnement Carte EVplug inclut un suivi technique, un support reactif et une garantie sur la borne pendant toute la duree de l\'abonnement. Notre equipe reste disponible pour vous accompagner en cas de besoin.',
    image: featureTethered,
    cta: { href: 'https://www.maborneelectrique.ma/connexion', label: 'Verifier mon eligibilite', external: true },
  },
  {
    title: 'La borne reste chez vous',
    description:
      'Des le premier jour, la borne est a vous. Au terme de votre abonnement, nous vous contactons pour discuter de la meilleure facon de continuer a profiter des services Carte EVplug.',
    image: featureWarranty,
    cta: { href: '/contact-us', label: 'Verifier mon eligibilite', external: false },
  },
]

const cardAccordionItems = [
  {
    title: 'Acces a tout notre reseau',
    body: "Des milliers de points de charge ouverts et partenaires partout au Maroc. Trouvez, lancez et suivez vos sessions depuis l'application EVplug.",
  },
  {
    title: 'Carte RFID securisee',
    body: 'Paiement sans contact, assignation par utilisateur ou vehicule et revocation instantanee en cas de perte.',
  },
  {
    title: 'Suivi en temps reel',
    body: "Visualisez vos sessions, l'energie consommee et les couts en direct. Exportez vos rapports mensuels en un clic.",
  },
  {
    title: 'Pour les entreprises',
    body: 'Emettez des cartes a vos equipes, definissez des plafonds de depenses, liez des centres de cout et centralisez la facturation.',
  },
  {
    title: 'Acces a vos bornes privees',
    body: "Utilisez la carte EVplug comme controle d'acces RFID sur vos sites et suivez l'usage prive/pro pour une refacturation simplifiee.",
  },
]

const appAccordionItems = [
  {
    title: 'Pilotez votre recharge intelligente',
    body: "Indiquez simplement votre objectif de charge et l'heure a laquelle votre vehicule doit etre pret – par exemple 80 % a 7h – et l'application programme automatiquement votre session pour optimiser votre consommation d'electricite.",
  },
  {
    title: 'Suivez vos sessions de recharge',
    body: "Consultez l'historique complet de vos sessions de recharge : date, duree, energie consommee et couts associes.",
  },
  {
    title: 'Acces a la recharge publique avec la Carte EVplug',
    body: 'Votre abonnement inclut la Carte EVplug pour acceder au reseau de bornes publiques EVplug Maroc et aux bornes partenaires en itinerance. Une seule carte pour recharger partout.',
  },
  {
    title: 'Gestion multi-vehicules',
    body: 'Connectez et gerez plusieurs vehicules electriques depuis la meme application. Un invite peut egalement recharger son vehicule via votre borne.',
  },
  {
    title: 'Mode « Boost » pour recharger immediatement',
    body: 'Besoin de recharger immediatement ? Activez le mode Boost pour demarrer la recharge sans attendre la plage horaire optimale.',
  },
  {
    title: 'Tableau de bord de votre activite',
    body: "Consultez une synthese detaillee de votre activite de recharge : duree des sessions, energie consommee et evolution de vos usages, en un seul coup d'oeil.",
  },
]

const faqItems = [
  {
    q: 'Qu’est-ce que la Carte EVplug ?',
    a: "La Carte EVplug est une carte RFID securisee qui vous permet de demarrer et payer vos recharges sur le reseau public EVplug Maroc ainsi que sur les bornes partenaires en itinerance. Elle peut etre liee a un utilisateur ou a un vehicule et se gere depuis l'application EVplug ou le portail entreprise.",
  },
  {
    q: 'Ou puis-je utiliser la Carte EVplug ?',
    a: "Vous pouvez utiliser la carte sur les bornes EVplug Maroc et sur un large reseau de partenaires interoperables. Les points de charge compatibles apparaissent dans la carte interactive de l'application EVplug, avec les tarifs et disponibilites en temps reel lorsque ceux-ci sont fournis par l'operateur.",
  },
  {
    q: 'Comment activer ma carte ?',
    a: "Apres reception, ajoutez la carte depuis l'application EVplug (section Portefeuille/Cartes) ou depuis le portail entreprise. Associez-la a un utilisateur ou un vehicule et, si necessaire, definissez un code PIN. La carte est alors prete a l'emploi.",
  },
  {
    q: 'Comment suis-je facture(e) ?',
    a: "Les tarifs sont affiches avant demarrage lorsque disponibles. Vous recevez un releve detaille de vos sessions dans l'application et des factures periodiques (mensuelles) recapitulatives. Pour les entreprises, la facturation peut etre centralisee par site, centre de cout ou vehicule.",
  },
  {
    q: 'Que faire en cas de perte ou de vol ?',
    a: "Desactivez immediatement la carte depuis l'application ou le portail pour empecher toute utilisation. Vous pouvez demander l'emission d'une nouvelle carte. Des frais de remplacement peuvent s'appliquer.",
  },
  {
    q: 'Puis-je gerer plusieurs cartes et utilisateurs ?',
    a: 'Oui. Les particuliers peuvent associer plusieurs vehicules a un meme compte. Les entreprises peuvent emettre et gerer un parc de cartes, attribuer des droits, fixer des plafonds et suivre les depenses par utilisateur, site ou vehicule.',
  },
  {
    q: 'La carte peut-elle controler l’acces a mes bornes privees ?',
    a: "Oui, si vos bornes privees sont compatibles avec le controle d'acces RFID. La Carte EVplug peut alors servir de badge d'acces et vous permettre de distinguer les recharges privees et professionnelles pour une refacturation simplifiee.",
  },
  {
    q: 'Ai-je besoin d’une connexion Internet ?',
    a: "Une connexion est necessaire pour activer la carte et consulter l'historique dans l'application. Sur les bornes publiques, la recharge via RFID fonctionne sans connexion de votre telephone. Certaines fonctions avancees (statuts en temps reel, mises a jour) requierent l'acces Internet.",
  },
  {
    q: 'Y a-t-il des frais associes a la carte ?',
    a: "Des frais d'emission ou de remplacement peuvent s'appliquer. Les tarifs de recharge dependent du point de charge et de l'operateur. Le detail des prix est indique avant demarrage lorsqu'il est fourni par l'operateur.",
  },
  {
    q: 'Proposez-vous des cartes pour les entreprises ?',
    a: "Oui. La Carte EVplug Entreprise permet d'emettre des cartes a vos equipes, de fixer des limites de depenses, de centraliser la facturation et d'acceder a des rapports detailles par site, vehicule ou collaborateur.",
  },
]

// FAQ items reshaped from {q,a} → {title,body} for the shared Accordion variant.
const faqAccordionItems = faqItems.map(({ q, a }) => ({ title: q, body: a }))

function CarouselFeatures() {
  return (
    <div className="container-max-width-tablet mx-auto xl:mx-none container-padding-tablet container-padding-mobile">
      <CardsCarousel ariaLabel="Avantages Carte EVplug">
        {carouselItems.map((item) => (
          <div key={item.title} className="flex md:flex-nowrap flex-wrap md:gap-[25px] gap-spacing-xl">
            <div className="horizontal-slider-new-content md:w-6/12 w-full">
              <div className="bg-blue-dianne rounded-2xl grid gap-spacing-4xl text-white p-spacing-6xl horizontal-card auto-rows-max h-full">
                <div className="grid gap-spacing-2xl">
                  <h4 className="m-0 font-4xl !hidden sm:!block">{item.title}</h4>
                  <h5 className="m-0 font-3xl !block sm:!hidden">{item.title}</h5>
                  <div className="text-block vertical-carousel-des m-0">
                    <p>{item.description}</p>
                  </div>
                </div>
                <div className="flex justify-start gap-spacing-xl flex-wrap">
                  {item.cta.external ? (
                    <a
                      href={item.cta.href}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary-outline font-base md:px-spacing-md lg:px-spacing-2xl px-spacing-lg"
                    >
                      {item.cta.label}
                    </a>
                  ) : (
                    <Link
                      to={item.cta.href}
                      className="btn btn-secondary-outline font-base md:px-spacing-md lg:px-spacing-2xl px-spacing-lg"
                    >
                      {item.cta.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="horizontal-slider-new-image relative md:w-6/12 w-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full object-cover rounded-xl lg:max-w-[484px] lg:h-[340px] md:max-w-[272px] md:h-[363px] max-w-full h-[208px]"
                loading="lazy"
              />
              {item.tag && (
                <div className="image-tag grid-flow-col">
                  <div className="w-[40px] h-[40px]">
                    <img className="w-[40px] h-[40px]" src={item.tag.icon} alt="" />
                  </div>
                  <div className="md:font-lg font-base font-semibold md:max-w-[190px] max-w-full w-full m-0">
                    <p>
                      <span style={{ whiteSpace: 'pre-wrap' }}>{item.tag.label}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardsCarousel>
    </div>
  )
}

function StickyTabs() {
  const tabs = [
    { id: 'benefits', label: 'Avantages' },
    { id: 'yourcharger', label: 'Votre carte' },
    { id: 'yourapp', label: 'Application' },
  ]
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('benefits')
  const handleSelect = (id) => {
    setSelected(id)
    setOpen(false)
    const target = document.getElementById(id)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <>
      <section className="w-full z-50 tab-section tab-section-desktop sticky top-0 hidden md:block">
        <div className="container-max-width-desktop container-max-width-tablet px-spacing-xl md:px-spacing-4xl xl:px-spacing-7xl mx-auto">
          <div className="grid grid-flow-col gap-spacing-4xl justify-center tab-block bg-surface rounded-b-2xl shadow py-spacing-md">
            {tabs.map((tab) => (
              <a key={tab.id} href={`#${tab.id}`} className="nav-link">
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full z-50 tab-section tab-section-mobile accordion-block sticky top-0 md:hidden">
        <div className="tab-block-mobile container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto">
          <div className="grid grid-flow-col items-center justify-between w-full gap-spacing-4xl bg-surface rounded-b-2xl shadow py-spacing-sm md:px-spacing-4xl px-spacing-xl">
            <div className="title font-semibold whitespace-nowrap">Aller a :</div>
            <div className="relative w-full custom-dropdown col-span-2">
              <div
                onClick={() => setOpen((v) => !v)}
                className="text-black dropdown-selected rounded-md px-spacing-md py-spacing-sm bg-white font-semibold cursor-pointer flex items-center justify-between"
              >
                <div className="grid grid-flow-col gap-spacing-4xl items-center justify-between w-full pr-[25px]">
                  <span className="selected-text">{tabs.find((t) => t.id === selected)?.label}</span>
                  <span className="w-[24px] h-[24px] flex items-center justify-center absolute right-[6px]">
                    <img className="w-[12px]" src={filterIcon} alt="icon" loading="lazy" />
                  </span>
                </div>
              </div>
              {open && (
                <div className="text-black font-semibold dropdown-options absolute left-0 right-0 mt-2 bg-white border border-blue-dianne rounded-md shadow-md z-50">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      onClick={() => handleSelect(tab.id)}
                      className="dropdown-option px-spacing-xl py-spacing-sm hover:bg-blue-dianne/10 cursor-pointer"
                    >
                      {tab.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function CarteEvplug() {
  return (
    <MirrorShell documentTitle="Carte EVplug | EVplug Maroc">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Carte EVplug" />

            <Hero
              title="Carte EVplug"
              subtitle="Une carte unique pour recharger partout sur notre reseau et chez nos partenaires. Pour les particuliers et les entreprises, gerez l'emission de cartes, l'acces a vos bornes locales et le suivi des depenses depuis un seul espace."
              ctas={[{ to: '/contact-us', label: 'Obtenir ma carte', variant: 'primary' }]}
              footnote="Sous reserve d'eligibilite. Conditions generales applicables."
              image={heroImg}
              imageAlt="Carte EVplug"
            />

            <StickyTabs />

            {/* Section title */}
            <section
              id="benefits"
              className="header-two relative top-spacing"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-7xl grid gap-spacing-7xl">
                <div className="max-w-[480px] grid gap-spacing-3xl relative">
                  <h2 className="tracking-tight m-0">La carte de recharge universelle</h2>
                  <div className="hero-banner-des">
                    <p>Ce que vous obtenez :</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Feature cards grid */}
            <section className="horizontal-carousel-new-section relative overflow-hidden md:pb-spacing-7xl pb-spacing-4xl">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto md:pt-spacing-7xl md:pb-spacing-6xl py-spacing-4xl">
                <CarouselFeatures />
              </div>
            </section>

            {/* Votre carte EVplug accordion */}
            <section id="yourcharger" className="relative your-charger-section top-spacing">
              <div className="bg-white">
                <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                  <div className="flex gap-spacing-7xl items-center xl:justify-between justify-center xl:flex-nowrap flex-wrap xl:flex-row-reverse">
                    <div className="xl:max-w-[480px] xl:w-6/12">
                      <div className="grid gap-spacing-6xl">
                        <div className="view-header">
                          <div className="grid gap-spacing-3xl">
                            <h2 className="tracking-tight m-0 pr-spacing-3xl">Votre carte EVplug</h2>
                            <div className="m-0 pr-spacing-3xl">
                              <p>
                                Rechargez sur l'ensemble de notre reseau public et partenaires avec une seule carte
                                RFID securisee. Associez-la a un utilisateur ou a un vehicule et maitrisez vos
                                depenses.
                              </p>
                            </div>
                          </div>
                        </div>
                        <Accordion items={cardAccordionItems} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-6 md:max-w-[582px] max-w-[370px] xl:w-6/12 w-full">
                      <div className="first-top xl:ml-auto">
                        <img
                          src={chargerAccordion1}
                          alt=""
                          className="md:w-[379px] md:h-[505px] w-[240px] h-auto object-cover rounded-2xl"
                        />
                      </div>
                      <div className="second-bottom mr-auto relative -mt-[120px]">
                        <img
                          src={chargerAccordion2}
                          alt=""
                          className="md:w-[276px] md:h-[276px] w-[175px] h-[175px] object-cover rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Application accordion */}
            <section id="yourapp" className="relative your-charger-section top-spacing">
              <div className="bg-white">
                <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                  <div className="flex gap-spacing-7xl items-center xl:justify-between justify-center xl:flex-nowrap flex-wrap">
                    <div className="xl:max-w-[480px] xl:w-6/12">
                      <div className="grid gap-spacing-6xl">
                        <div className="view-header">
                          <div className="grid gap-spacing-3xl">
                            <h3 className="tracking-tight m-0 pr-spacing-3xl">L'application EVplug</h3>
                            <div className="m-0 pr-spacing-3xl">
                              <p>
                                L'application EVplug centralise tout ce dont vous avez besoin pour piloter, suivre et
                                optimiser votre recharge depuis votre smartphone.
                              </p>
                            </div>
                          </div>
                        </div>
                        <Accordion items={appAccordionItems} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-6 md:max-w-[582px] max-w-[370px] xl:w-6/12 w-full">
                      <div className="first-top xl:ml-auto">
                        <img
                          src={appAccordion1}
                          alt=""
                          className="md:w-[379px] md:h-[505px] w-[240px] h-auto object-cover rounded-2xl"
                        />
                      </div>
                      <div className="second-bottom mr-auto relative -mt-[120px]">
                        <img
                          src={appAccordion2}
                          alt=""
                          className="md:w-[276px] md:h-[276px] w-[175px] h-[175px] object-cover rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="bg-white">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="view-header text-center">
                  <div className="heading-block pb-12 grid gap-spacing-sm">
                    <h4 className="tracking-tight m-0">Questions frequentes</h4>
                  </div>
                </div>
                <Accordion variant="faq" items={faqAccordionItems} defaultOpen={-1} />
              </div>
            </section>

            <HelpBand
              icon={chatIcon}
              body="Notre equipe support est disponible 24/7. Contactez-nous depuis votre espace client ou via la page de contact."
            />
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}
