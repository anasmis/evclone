import { useState } from 'react'
import { Link } from 'react-router-dom'
import MirrorShell from '../MirrorShell'
import BrandsMarquee from '../../components/common/BrandsMarquee'
import FloatingCtaForm from '../../components/common/FloatingCtaForm'
import { submitHomeChargingRequest } from '../../lib/api/strapi'
import Breadcrumb from '../../components/sections/Breadcrumb'
import Hero from '../../components/sections/Hero'
import Accordion from '../../components/sections/Accordion'
import StepsList from '../../components/sections/StepsList'
import HelpBand from '../../components/sections/HelpBand'
import CtaBanner from '../../components/sections/CtaBanner'
import BenefitsStrip from '../../components/sections/BenefitsStrip'
import hero from '../../migrated/assets/installation/standard-img-1.jpeg'
import iconOffers from '../../migrated/assets/home-charging/icon-offers.svg'
import iconInstall from '../../migrated/assets/home-charging/icon-install.svg'
import iconCard from '../../migrated/assets/home-charging/icon-card.svg'
import twoCardsImg from '../../migrated/assets/home-charging/twocards-img.png'
import iconSubscription from '../../migrated/assets/home-charging/icon-subscription.svg'
import iconSmartCharge from '../../migrated/assets/home-charging/icon-smart-charge.svg'
import iconStarWhite from '../../migrated/assets/home-charging/icon-star-white.svg'
import step1 from '../../migrated/assets/home-charging/step-1.svg'
import step2 from '../../migrated/assets/home-charging/step-2.svg'
import step3 from '../../migrated/assets/home-charging/step-3.svg'
import step4 from '../../migrated/assets/home-charging/step-4.svg'
import methodImg1 from '../../migrated/assets/home-charging/method-img-1.jpeg'
import methodImg2 from '../../migrated/assets/home-charging/method-img-2.jpeg'
import iconInstallation from '../../migrated/assets/home-charging/icon-installation.svg'
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

const intro = [
  { icon: iconOffers, title: 'Deux offres claires', body: 'Choisissez le mode qui correspond à votre budget et votre usage : Installation EVplug ou Carte EVplug.' },
  { icon: iconInstall, title: 'Installation certifiée à domicile', body: 'Audit électrique, pose, tests et mise en service réalisés par les techniciens qualifiés EVplug.' },
  { icon: iconCard, title: 'Carte EVplug + pilotage intelligent', body: "Recharge publique avec la carte EVplug et suivi des sessions domicile/public depuis l'application." },
]

const compareFeatures = [
  { label: 'Vitesse de recharge', card: '7.4kW', install: '7.4kW' },
  { label: 'Type de câble', card: 'Avec câble inclus', install: 'Avec ou sans câble (+490 MAD)' },
  { label: 'Compatible solaire', card: 'Oui', install: 'Oui' },
  { label: 'Recharge publique', card: 'Accès inclus au réseau de bornes EVplug Maroc', install: 'Carte EVplug en option' },
  { label: 'Garantie', card: "Pendant tout l'abonnement", install: '5 ans' },
  { label: 'Protection contre les surtensions', card: 'Incluse', install: '+990 MAD' },
]

const steps = [
  { n: 1, title: 'Choisir votre formule', img: step1 },
  { n: 2, title: 'Étude technique à domicile', img: step2 },
  { n: 3, title: 'Pose par un technicien certifié', img: step3 },
  { n: 4, title: 'Rechargez sereinement', img: step4 },
]

const methodSteps = [
  {
    title: 'Demande et étude technique',
    body: "Un conseiller EVplug étudie votre installation électrique, votre place de stationnement et vos usages de recharge afin de sélectionner la borne et la pose les plus adaptées à votre logement.",
  },
  {
    title: 'Devis et planification',
    body: "Après l'étude, nous confirmons votre éligibilité au forfait standard. Plus de 90 % des clients en bénéficient. Si votre installation nécessite des travaux complémentaires, nous vous remettons un devis ferme avant tout engagement, puis planifions l'intervention à la date qui vous convient.",
  },
  {
    title: 'Installation',
    body: "Un technicien certifié EVplug réalise la pose de votre borne dans le respect des normes en vigueur. L'intervention dure généralement entre 2 et 4 heures. Après mise en service, il vous accompagne sur l'utilisation de la borne et sur l'application EVplug avant de quitter votre domicile.",
  },
]

const brands = [ford, bmw, jeep, audi, fiat, kia, landRover, toyota]

const faqInstallation = [
  {
    q: 'Quel est le meilleur emplacement pour installer une borne ?',
    a: "L'emplacement idéal est un mur extérieur ou intérieur de garage, à proximité de votre stationnement habituel. La borne doit être installée dans un endroit sec, ventilé et accessible pour que la recharge soit à la fois sûre et confortable. Vérifiez la longueur du câble nécessaire entre la borne et la prise de votre véhicule. Au Maroc, les configurations de villas, riads et copropriété varient beaucoup : notre conseiller EVplug étudie chaque cas pour vous proposer la longueur de câble et le positionnement adaptés. La distance entre votre tableau électrique et l'emplacement souhaité joue un rôle important : plus elle est courte, plus l'installation est économique. Notre étude technique gratuite cadre ces points avant intervention.",
  },
]

const faqGeneral = [
  {
    q: 'Tout électricien peut-il installer une borne de recharge ?',
    a: "Seul un électricien qualifié peut installer une borne de recharge en respectant les normes en vigueur. Au Maroc, les techniciens EVplug sont formés spécifiquement aux normes IEC 61851 et aux exigences de sécurité des installations de recharge électrique. Tous nos partenaires installateurs disposent des qualifications électriques requises et d'une expérience confirmée en pose de bornes. EVplug propose l'installation comme prestation intégrée à l'achat de votre borne via notre marketplace. Si vous préférez confier l'installation à votre propre électricien, contactez nos équipes pour obtenir les spécifications techniques et les recommandations de pose adaptées au modèle de borne choisi.",
  },
  {
    q: 'Faut-il une autorisation pour installer une borne ?',
    a: "Si vous êtes propriétaire d'une villa avec parking privé, aucune autorisation spécifique n'est nécessaire. Si vous êtes locataire ou propriétaire dans une copropriété, vous devez obtenir l'accord du syndic ou du propriétaire avant l'installation. EVplug propose une solution dédiée aux copropriétés : étude électrique du parking, installation mutualisée avec refacturation individualisée via la plateforme EVone, et gestion administrative simplifiée. Notre équipe accompagne les syndics dans la présentation du projet en assemblée générale.",
  },
  {
    q: 'Une borne EVplug est-elle compatible avec des panneaux solaires ?',
    a: "Oui. Le Maroc bénéficie d'un ensoleillement exceptionnel et plusieurs bornes du catalogue EVplug intègrent la compatibilité solaire native. Vous pouvez recharger votre véhicule avec votre installation photovoltaïque, le réseau ONEE, ou un mix des deux selon vos préférences. Mode solaire pur : recharge uniquement via l'énergie solaire excédentaire, idéal pour les longues journées ensoleillées fréquentes au Maroc. Mode mixte solaire et réseau : combine l'énergie solaire et un complément réseau pour assurer une vitesse de recharge constante. Notre conseiller EVplug vous oriente vers le modèle de borne le plus adapté à votre configuration solaire.",
  },
  {
    q: 'Ma borne EVplug peut-elle se connecter à mes autres équipements connectés ?',
    a: "Les bornes connectées du catalogue EVplug s'utilisent via l'application mobile EVplug. Connectez votre borne au Wi-Fi de votre domicile et pilotez-la à distance : programmation des sessions de recharge, verrouillage de la borne, choix du mode de charge, suivi de consommation et historique des sessions. Selon le modèle de borne choisi, des intégrations supplémentaires (assistants vocaux, domotique) peuvent être disponibles.",
  },
  {
    q: 'EVplug fonctionne-t-il avec mon abonnement ONEE ?',
    a: "Oui. Les bornes du catalogue EVplug fonctionnent avec votre abonnement ONEE ou régie locale, sans modification d'abonnement. Si votre tarification comporte des plages horaires distinctes, programmez la recharge sur les heures les plus avantageuses depuis l'application EVplug pour optimiser le coût de chaque session.",
  },
  {
    q: 'Puis-je rouler en électrique sans place de parking privée ?',
    a: "Si vous ne disposez pas d'un parking privé, plusieurs solutions s'offrent à vous au Maroc : utilisez la carte EVplug pour accéder au réseau de bornes publiques EVplug et de nos partenaires d'itinérance, ou rechargez sur les bornes en entreprise lorsque c'est possible. EVplug développe progressivement son maillage public sur Casablanca, Rabat, Marrakech et Tanger. Pour les logements en copropriété sans place attribuée, contactez-nous : nous accompagnons votre syndic dans la mise en place d'une infrastructure mutualisée pour l'ensemble des résidents.",
  },
  {
    q: "Que se passe-t-il si mon installation n'est pas standard ?",
    a: "Les installations spécifiques (longues distances de câble, travaux de génie civil, mise à niveau du tableau électrique, raccordement triphasé) peuvent générer un coût additionnel. À la suite de votre demande, nos techniciens réalisent une étude détaillée et vous remettent un devis ferme sans engagement. Si vous ne souhaitez pas donner suite, aucun frais ne vous est facturé pour cette étude.",
  },
  {
    q: 'Ma borne a-t-elle besoin du Wi-Fi pour fonctionner ?',
    a: "Nous recommandons de connecter votre borne au Wi-Fi de votre domicile pour profiter pleinement des fonctionnalités intelligentes : programmation des sessions, verrouillage à distance, suivi de consommation, et mises à jour logicielles automatiques. En cas de coupure du Wi-Fi, votre véhicule continue à se recharger normalement. Seules les fonctions connectées sont temporairement indisponibles pendant la coupure. L'abonnement EVplug Card nécessite une connexion Wi-Fi stable, indispensable au pilotage intelligent de la recharge et à la maintenance proactive de votre borne.",
  },
  {
    q: "Combien de temps faut-il pour installer une borne EVplug à domicile ?",
    a: "Une installation standard est réalisée en 2 à 4 heures sur site. Pour les configurations spécifiques (génie civil, mise à niveau électrique), notre équipe vous communique le délai estimé après étude technique.",
  },
]

const faqInstallationItems = faqInstallation.map(({ q, a }) => ({ title: q, body: a }))
const faqGeneralItems = faqGeneral.map(({ q, a }) => ({ title: q, body: a }))

function ComparisonColumn({ title, priceLabel, monthlyValue, monthlyNote, cta, ctaTo, footerNote, valueIndex }) {
  return (
    <div className="bg-surface/40 rounded-2xl flex flex-col justify-between h-full w-full">
      <div className="bg-surface rounded-t-2xl xl:p-spacing-5xl p-spacing-4xl flex items-center justify-between h-[106px]">
        <h5 className="font-bold leading-9 text-[30px] text-black mb-0">{title}</h5>
      </div>
      <div className="xl:px-spacing-5xl px-spacing-4xl flex flex-col flex-grow justify-start">
        <div className="grid gap-8 mt-8 pb-8 border-b border-gray-200">
          <div className="flex gap-spacing-xl items-end">
            <div className="grid gap-spacing-xl m-0 min-w-[90px]">
              <div className="font-base text-black">Frais initiaux</div>
              <div className="font-bold text-[40px] text-[#163e4c]">{priceLabel}</div>
            </div>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
              <path d="M12 21.587V2.41304" stroke="black" strokeWidth="1.2" />
              <path d="M2.41304 12H21.587" stroke="black" strokeWidth="1.2" />
            </svg>
            <div className="grid gap-spacing-xl">
              <div className="font-base text-black m-0">Mensualité</div>
              <div className="flex text-start items-end gap-2">
                <div className="font-bold text-[40px] text-[#163e4c] m-0">{monthlyValue}</div>
                <div className="xl:font-base font-xs text-black h-[17px]">{monthlyNote}</div>
              </div>
            </div>
          </div>
          <Link to={ctaTo} className="btn btn-primary">
            {cta}
          </Link>
          {footerNote && <p className="text-sm text-gray-600 mt-3 mb-0">{footerNote}</p>}
        </div>
        <div className="grid gap-spacing-3xl pb-8 mt-5">
          {compareFeatures.map((feature, i) => (
            <div key={feature.label} className="compare-table-column-main">
              <div className="grid gap-spacing-xl compare-table-column">
                <div className="flex items-center gap-spacing-xl">
                  <div className="font-semibold font-lg text-black m-0">{feature.label}</div>
                </div>
                <div className="m-0 font-xl">
                  <p>{valueIndex === 'card' ? feature.card : feature.install}</p>
                </div>
              </div>
              {i < compareFeatures.length - 1 && <div className="bg-gray-200 h-px mt-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ComparisonTable() {
  const [tab, setTab] = useState('card')
  return (
    <section className="comparison-table-section bg-white rounded-b-4xl md:pt-spacing-7xl md:pb-spacing-9xl py-spacing-7xl gap-spacing-6xl top-spacing">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto">
        <div className="grid gap-12 justify-items-center">
          <div className="text-center grid gap-spacing-3xl">
            <h3 className="m-0">Comparez vos options</h3>
            <div className="m-0">
              <p>
                Deux façons de passer à l'électrique avec EVplug : <strong>installez votre propre borne</strong> à
                domicile pour une recharge dédiée, ou <strong>prenez la Carte EVplug</strong> pour accéder à notre
                réseau public de bornes au Maroc — également disponible pour les{' '}
                <Link to="/solutions/entreprise" className="underline">
                  infrastructures d'entreprise
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Desktop: two columns */}
          <div className="hidden md:grid compare-table-block xl:gap-[69px] gap-spacing-4xl w-full md:grid-cols-2 justify-center">
            <ComparisonColumn
              title="EVplug Card"
              priceLabel="990 MAD"
              monthlyValue="399 MAD"
              monthlyNote="pendant 36 mois"
              cta="Obtenir la Carte EVplug"
              ctaTo="/contact-us"
              footerNote={
                <>
                  Carte aussi émise pour les{' '}
                  <Link to="/solutions/entreprise" className="underline">
                    infrastructures d'entreprise
                  </Link>
                  .
                </>
              }
              valueIndex="card"
            />
            <ComparisonColumn
              title="Installation EVplug"
              priceLabel="11 990 MAD"
              monthlyValue="0 MAD"
              monthlyNote=""
              cta="Installer une borne EVplug"
              ctaTo="/installation"
              valueIndex="install"
            />
          </div>

          {/* Mobile: tabs */}
          <div className="block md:hidden w-full">
            <div className="flex bg-white rounded-t-xl overflow-hidden">
              <button
                onClick={() => setTab('card')}
                className={`flex-1 font-xl font-bold px-6 py-3 text-center rounded-t-2xl cursor-pointer transition-colors duration-150 ${
                  tab === 'card' ? 'bg-surface text-black' : 'bg-transparent text-gray-400'
                }`}
                type="button"
                aria-selected={tab === 'card'}
              >
                EVplug Card
              </button>
              <button
                onClick={() => setTab('install')}
                className={`flex-1 font-xl font-bold px-6 py-3 text-center rounded-t-2xl cursor-pointer transition-colors duration-150 ${
                  tab === 'install' ? 'bg-surface text-black' : 'bg-transparent text-gray-400'
                }`}
                type="button"
                aria-selected={tab === 'install'}
              >
                Installation EVplug
              </button>
            </div>
            <div>
              {tab === 'card' && (
                <ComparisonColumn
                  title="EVplug Card"
                  priceLabel="990 MAD"
                  monthlyValue="399 MAD"
                  monthlyNote="pendant 36 mois"
                  cta="Obtenir la Carte EVplug"
                  ctaTo="/contact-us"
                  footerNote={
                    <>
                      Carte aussi émise pour les{' '}
                      <Link to="/solutions/entreprise" className="underline">
                        infrastructures d'entreprise
                      </Link>
                      .
                    </>
                  }
                  valueIndex="card"
                />
              )}
              {tab === 'install' && (
                <ComparisonColumn
                  title="Installation EVplug"
                  priceLabel="11 990 MAD"
                  monthlyValue="0 MAD"
                  monthlyNote=""
                  cta="Installer une borne EVplug"
                  ctaTo="/installation"
                  valueIndex="install"
                />
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
    <MirrorShell documentTitle="Comparer nos offres de recharge | EVplug Maroc">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Comparer nos offres de recharge" />

            <Hero
              title="Deux offres EVplug pour démarrer facilement"
              subtitle="Choisissez entre l'offre Installation EVplug (achat unique) et la Carte EVplug (abonnement). Dans les deux cas, vous bénéficiez d'une installation certifiée et d'un accompagnement complet."
              ctas={[
                { to: '/installation', label: "Voir l'offre Installation", variant: 'primary' },
                { to: '/products/carte-evplug', label: 'Découvrir la Carte EVplug', variant: 'primary-outline' },
              ]}
              footnote="Installation EVplug : achat unique. Carte EVplug : formule avec abonnement mensuel et services inclus."
              image={hero}
              imageAlt="Borne de recharge EVplug installée à domicile au Maroc"
            />

            <BenefitsStrip
              heading="Rejoignez l'écosystème EVplug au Maroc"
              items={intro.map((item) => ({ icon: item.icon, title: item.title, description: item.body }))}
            />

            {/* Two cards image section */}
            <section className="relative image-with-two-cards bg-surface">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-7xl md:pt-spacing-7xl py-spacing-4xl">
                <div className="flex gap-spacing-4xl flex-col-reverse xl:flex-row xl:flex-nowrap xl:grid-flow-col">
                  <div className="rounded-2xl overflow-hidden xl:w-5/12">
                    <img
                      src={twoCardsImg}
                      alt="EVplug en action"
                      className="w-full h-full object-cover md:aspect-3/2 aspect-2/1"
                    />
                  </div>
                  <div className="flex xl:w-7/12 flex-wrap">
                    <div className="max-w-[480px] grid gap-spacing-2xl mb-12">
                      <h3 className="tracking-tight m-0">Deux options simples pour commencer la recharge</h3>
                      <div className="m-0">
                        <p>
                          Choisissez l'option qui vous convient le mieux. Les deux incluent l'installation EVplug à
                          domicile et l'accompagnement de mise en service.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-spacing-4xl md:grid-flow-col two-cards-column md:grid-cols-2">
                      <div className="bg-blue-dianne col text-white rounded-2xl p-spacing-3xl gap-spacing-4xl relative">
                        <span className="absolute -top-[24px] right-4 text-black font-semibold py-spacing-sm px-spacing-md rounded-md text-lg text-center bg-pear">
                          Jusqu'à 12 000 MAD économisés à l'achat
                        </span>
                        <div className="gap-spacing-2xl h-full justify-between flex flex-col">
                          <div className="grid gap-spacing-xl">
                            <h6 className="text-white">Étudier votre projet</h6>
                            <div className="text-white image-two-card-des m-0">
                              <p>Abonnement mensuel avec services EVplug inclus</p>
                            </div>
                          </div>
                          <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-spacing-sm">
                              <span className="inline-flex shrink-0">
                                <img src={iconSubscription} alt="" className="w-6 h-6 object-contain" />
                              </span>
                              <div>
                                <p className="font-semibold mb-1">Sans coût initial élevé</p>
                                <div className="text-white">
                                  <p>Étalez le coût avec une mensualité simple et fixe.</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-spacing-sm">
                              <span className="inline-flex shrink-0">
                                <img src={iconSmartCharge} alt="" className="w-6 h-6 object-contain" />
                              </span>
                              <div>
                                <p className="font-semibold mb-1">Recharge intelligente qui vous récompense</p>
                                <div className="text-white">
                                  <p>Gagnez jusqu'à 2 000 MAD/an en récompenses selon vos usages.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex mt-auto">
                            <Link to="/products/carte-evplug" className="font-base btn-secondary w-full">
                              Découvrir la Carte EVplug
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-dianne col text-white rounded-2xl p-spacing-3xl gap-spacing-4xl relative">
                        <span className="absolute -top-[24px] right-4 text-black font-semibold py-spacing-sm px-spacing-md rounded-md text-lg text-center bg-pear">
                          À partir de 11 990 MAD
                        </span>
                        <div className="gap-spacing-2xl h-full justify-between flex flex-col">
                          <div className="grid gap-spacing-xl">
                            <h6 className="text-white">Installer une borne EVplug</h6>
                            <div className="text-white image-two-card-des m-0">
                              <p>Recharge à domicile à partir de 11 990 MAD</p>
                            </div>
                          </div>
                          <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-spacing-sm">
                              <span className="inline-flex shrink-0">
                                <img src={iconStarWhite} alt="" className="w-6 h-6 object-contain" />
                              </span>
                              <div>
                                <p className="font-semibold mb-1">Un achat unique, une fiabilité au quotidien.</p>
                                <div className="text-white">
                                  <p>
                                    Technologie de recharge fiable pour votre domicile avec installation et garantie
                                    EVplug.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex mt-auto">
                            <Link to="/contact-us" className="font-base btn-secondary w-full">
                              Parler à un expert
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Comparison table */}
            <ComparisonTable />

            {/* How it works */}
            <section className="bg-surface relative xl:py-spacing-9xl py-spacing-7xl how-it-work-section">
              <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile how-it-work-block">
                <div className="grid gap-spacing-6xl">
                  <div className="grid gap-spacing-3xl text-center max-w-[788px] mx-auto pr-spacing-2xl md:pr-spacing-4xl xl:pr-spacing-none">
                    <h3 className="text-center tracking-tight m-0">Comment ça marche</h3>
                    <div className="m-0">
                      <p>Un accompagnement complet, du choix de la borne à la mise en service.</p>
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
                    <Link to="/contact-us" className="btn btn-primary">
                      Demander un devis
                    </Link>
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

            {/* Installation method */}
            <section className="relative our-insllation-process-section bg-surface xl:pt-spacing-9xl xl:pb-spacing-7xl py-spacing-7xl top-spacing">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto">
                <div className="grid gap-spacing-6xl">
                  <div className="view-header text-center">
                    <div className="heading-block grid gap-spacing-3xl">
                      <h2 className="tracking-tight m-0">Notre méthode d'installation</h2>
                      <div>
                        <p>Plus de 90 % de nos clients bénéficient de notre forfait d'installation standard EVplug.</p>
                      </div>
                    </div>
                  </div>
                  <div className="oip_block">
                    <div className="oip_pr md:sticky md:top-[170px]">
                      <StepsList items={methodSteps} />
                    </div>
                    <div className="right flex flex-col">
                      <div className="oip_img flex justify-end relative w-full max-w-[553px] ml-auto">
                        <div>
                          <img src={methodImg1} className="w-[276px] object-cover rounded-2xl" alt="Installation" />

                        </div>
                      </div>
                      <div className="oip_img flex relative w-full max-w-[551px] mr-auto">
                        <div>
                          <img src={methodImg2} className="w-[275px] object-cover rounded-2xl" alt="Installation" />
                          <div className="oip_img_label oip_img_label_left text-lg">
                            <div className="icon">
                              <img src={iconInstallation} alt="" />
                            </div>
                            <div className="m-0 font-semibold">
                              <p>Pose réalisée par des techniciens qualifiés EVplug</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-spacing-xl flex-wrap justify-center pt-spacing-5xl">
                  <Link to="/installation" className="btn btn-primary font-base">
                    En savoir plus sur l'installation
                  </Link>
                </div>
              </div>
            </section>

            {/* Single image */}
            <section className="single-image relative py-spacing-7xl gap-spacing-6xl bg-surface">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto grid">
                <img src={singleImage} alt="EVplug" className="w-full h-auto rounded-xl object-cover" />
              </div>
            </section>

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
              title="Une technologie éprouvée."
              body="Des bornes sélectionnées pour la fiabilité, posées par des techniciens certifiés, avec un suivi continu via l'application EVplug."
              ctas={[{ to: '/contact-us', label: 'Découvrir notre offre', variant: 'secondary' }]}
              decorImage={ctaImage}
            />
          </div>
        </article>
      </div>
      <FloatingCtaForm
        buttonLabel="Recharger chez moi"
        title="Recharge à domicile"
        subtitle="Installation EVplug ou Carte EVplug : indiquez votre besoin, un conseiller vous recontacte sous 24h."
        defaultInterest="Installation à domicile"
        accentColor="#c8d72d"
        submitFn={submitHomeChargingRequest}
      />
    </MirrorShell>
  )
}
