import MirrorShell from '../MirrorShell'
import FloatingCtaForm from '../../components/common/FloatingCtaForm'
import { submitCarteRequest } from '../../lib/api/strapi'
import Breadcrumb from '../../components/sections/Breadcrumb'
import Hero from '../../components/sections/Hero'
import Accordion from '../../components/sections/Accordion'
import HelpBand from '../../components/sections/HelpBand'
import heroImg from '../../migrated/assets/carte-evplug/hero.png'
import featureUntethered from '../../migrated/assets/carte-evplug/feature-untethered.jpeg'
import featureApp from '../../migrated/assets/carte-evplug/feature-app.jpeg'
import featureTethered from '../../migrated/assets/carte-evplug/feature-tethered.jpeg'
import chatIcon from '../../migrated/assets/carte-evplug/chat-icon.svg'

// Opens the page's floating CTA form (FloatingCtaForm listens for this event)
// so the CTAs surface the lead form instead of leaving the page.
const openCtaForm = () => window.dispatchEvent(new CustomEvent('floating-cta-form:open'))

// Each worthy pillar (the card, EVONE, EVPAY) gets its own highlighted section.
// The supporting items — network access, consumption tracking, budget control —
// are folded in as points on the section they naturally belong to.
const sections = [
  {
    tag: 'La carte',
    title: 'Une seule carte pour recharger partout',
    intro:
      "La Carte EVplug est une carte RFID sécurisée : un seul support pour accéder au réseau de bornes et payer vos recharges, où que vous soyez.",
    image: featureUntethered,
    imageAlt: 'Recharge avec la Carte EVplug',
    badge: { icon: 'fa-id-card', title: 'Une seule carte', sub: 'Accès + paiement' },
    cta: 'Obtenir ma carte',
    points: [
      {
        icon: 'fa-charging-station',
        title: 'Accès au réseau de bornes',
        body: "Rechargez sur l'ensemble du réseau EVplug Maroc et sur les bornes partenaires en itinérance.",
      },
      {
        icon: 'fa-shield-halved',
        title: 'Carte RFID sécurisée',
        body: "Démarrez la recharge d'un simple geste ; en cas de perte, révoquez la carte instantanément.",
      },
      {
        icon: 'fa-user',
        title: 'Associée à un conducteur ou un véhicule',
        body: 'Liez la carte à votre compte, à un conducteur ou à un véhicule selon votre usage.',
      },
    ],
  },
  {
    tag: 'Plateforme EVONE',
    title: 'Trouvez, pilotez et maîtrisez votre recharge',
    intro:
      "EVONE centralise votre recharge dans un seul espace : localisez les bornes disponibles, accédez à celles de votre entreprise ou de votre résidence, suivez votre consommation et gardez le contrôle de votre budget.",
    image: featureApp,
    imageAlt: 'Plateforme EVONE',
    badge: { icon: 'fa-location-dot', title: 'Temps réel', sub: 'Bornes disponibles' },
    reverse: true,
    surface: true,
    cta: 'Découvrir la plateforme EVONE',
    points: [
      {
        icon: 'fa-map-location-dot',
        title: 'Les bornes disponibles les plus proches',
        body: "EVONE affiche en temps réel les bornes ouvertes autour de vous, avec disponibilité et tarifs lorsqu'ils sont fournis.",
      },
      {
        icon: 'fa-building',
        title: "Vos bornes d'entreprise ou de résidence",
        body: "Accédez et pilotez les bornes de votre société ou de votre immeuble selon les droits qui vous sont attribués.",
      },
      {
        icon: 'fa-chart-line',
        title: 'Suivi de consommation',
        body: "Énergie consommée, durée et coût de chaque session, ainsi que l'historique complet, en direct.",
      },
      {
        icon: 'fa-sack-dollar',
        title: 'Maîtrise de votre budget',
        body: 'Séparez le budget recharge du budget personnel lié à votre véhicule et anticipez vos dépenses.',
      },
    ],
  },
  {
    tag: 'Paiement EVPAY',
    title: 'Payez vos recharges partout, en un seul geste',
    intro:
      "EVPAY est le paiement intégré à la Carte EVplug : réglez vos recharges partout avec un seul moyen de paiement, sans multiplier les comptes ni les applications.",
    image: featureTethered,
    imageAlt: 'Paiement EVPAY',
    badge: { icon: 'fa-wallet', title: 'Un seul paiement', sub: 'Partout' },
    cta: 'Activer EVPAY',
    points: [
      {
        icon: 'fa-wallet',
        title: 'Un seul moyen de paiement',
        body: 'Réseau public, bornes partenaires et bornes privées : tout se règle via EVPAY.',
      },
      {
        icon: 'fa-file-invoice',
        title: 'Facturation transparente',
        body: 'Tarifs affichés avant démarrage lorsqu\'ils sont disponibles, et relevés détaillés de vos sessions.',
      },
      {
        icon: 'fa-briefcase',
        title: 'Pensé pour les entreprises',
        body: 'Centralisez la facturation par site, centre de coût ou véhicule, avec des rapports détaillés.',
      },
    ],
  },
]

const faqItems = [
  {
    q: "Qu'est-ce que la Carte EVplug ?",
    a: "La Carte EVplug est une carte RFID sécurisée qui vous permet de démarrer et de payer vos recharges sur le réseau public EVplug Maroc et sur les bornes partenaires. Elle donne accès à la plateforme EVONE et au paiement EVPAY, et se gère depuis l'application EVplug.",
  },
  {
    q: "Qu'est-ce que la plateforme EVONE ?",
    a: "EVONE centralise votre recharge : localisez les bornes disponibles les plus proches, accédez aux bornes de votre entreprise ou de votre résidence, suivez votre consommation et maîtrisez votre budget, le tout depuis un seul espace.",
  },
  {
    q: "Qu'est-ce qu'EVPAY ?",
    a: "EVPAY est le service de paiement intégré à la Carte EVplug. Il vous permet de régler vos recharges partout — réseau public, bornes partenaires et bornes privées — avec un seul moyen de paiement, sans multiplier les comptes.",
  },
  {
    q: 'Où puis-je utiliser la Carte EVplug ?',
    a: "Sur les bornes EVplug Maroc et sur un large réseau de partenaires interopérables. Les points de charge compatibles apparaissent dans EVONE, avec disponibilité et tarifs en temps réel lorsqu'ils sont fournis par l'opérateur.",
  },
  {
    q: 'Comment suis-je facturé(e) ?',
    a: "Les tarifs sont affichés avant démarrage lorsqu'ils sont disponibles. Vous recevez un relevé détaillé de vos sessions dans l'application et des factures périodiques récapitulatives. Pour les entreprises, la facturation peut être centralisée par site, centre de coût ou véhicule.",
  },
  {
    q: 'Puis-je séparer mon budget recharge de mon budget personnel ?',
    a: "Oui. EVONE vous permet de suivre distinctement votre budget de recharge et votre budget personnel lié au véhicule, pour garder le contrôle de vos dépenses et anticiper vos coûts mensuels.",
  },
  {
    q: 'Que faire en cas de perte ou de vol ?',
    a: "Désactivez immédiatement la carte depuis l'application ou le portail EVONE pour empêcher toute utilisation, puis demandez l'émission d'une nouvelle carte. Des frais de remplacement peuvent s'appliquer.",
  },
  {
    q: 'Proposez-vous des cartes pour les entreprises ?',
    a: "Oui. La Carte EVplug Entreprise permet d'émettre des cartes à vos équipes, de fixer des plafonds de dépenses, de centraliser la facturation et d'accéder aux bornes de vos sites via EVONE, avec des rapports détaillés par site, véhicule ou collaborateur.",
  },
]

// FAQ items reshaped from {q,a} → {title,body} for the shared Accordion variant.
const faqAccordionItems = faqItems.map(({ q, a }) => ({ title: q, body: a }))

// One highlighted section per pillar: tagged heading + icon points on one side,
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

export default function CarteEvplug() {
  return (
    <MirrorShell documentTitle="Carte EVplug | EVplug Maroc">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Carte EVplug" />

            <Hero
              title="Carte EVplug"
              subtitle="Une seule carte pour accéder à tout l'écosystème EVplug : localisez les bornes disponibles avec la plateforme EVONE, rechargez sur tout le réseau, payez partout avec EVPAY, et suivez votre consommation comme votre budget."
              ctas={[{ onClick: openCtaForm, label: 'Obtenir ma carte', variant: 'primary' }]}
              footnote="Pour les particuliers et les entreprises. Sous réserve d'éligibilité."
              image={heroImg}
              imageAlt="Carte EVplug"
            />

            {sections.map((section) => (
              <FeatureSection key={section.tag} {...section} />
            ))}

            {/* FAQ */}
            <section className="bg-white">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
                <div className="view-header text-center">
                  <div className="heading-block pb-12 grid gap-spacing-sm">
                    <h4 className="tracking-tight m-0">Questions fréquentes</h4>
                  </div>
                </div>
                <Accordion variant="faq" items={faqAccordionItems} defaultOpen={-1} />
              </div>
            </section>

            <HelpBand
              icon={chatIcon}
              body="Notre équipe support est disponible 24/7. Contactez-nous depuis votre espace client ou via la page de contact."
            />
          </div>
        </article>
      </div>
      <FloatingCtaForm
        buttonLabel="Obtenir ma carte"
        title="Obtenir votre Carte EVplug"
        subtitle="Particulier ou entreprise : indiquez votre besoin, un conseiller EVplug vous recontacte sous 24h."
        interestOptions={[
          'Carte EVplug Particulier',
          'Carte EVplug Entreprise',
          'Recharge publique & itinérance',
          'Autre',
        ]}
        defaultInterest="Carte EVplug Particulier"
        accentColor="#c8d72d"
        submitFn={submitCarteRequest}
      />
    </MirrorShell>
  )
}
