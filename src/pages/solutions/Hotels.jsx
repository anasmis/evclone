import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import heroImage from '../../migrated/assets/solutions/hotels/hero.jpeg'
import storyImage from '../../migrated/assets/solutions/hotels/story.jpeg'
import platformImage from '../../migrated/assets/solutions/hotels/platform.jpg'

const services = [
  {
    icon: icons.charger,
    title: 'Etude electrique',
    description:
      "Audit complet de votre installation electrique et dimensionnement adapte au flux de vos clients et a l'infrastructure de votre etablissement.",
  },
  {
    icon: icons.standaloneCharger,
    title: 'Bornes connectees AC et DC',
    description:
      "Bornes AC pour les recharges nocturnes et DC pour les recharges rapides a l'arrivee. Compatibles tous vehicules, design discret et professionnel.",
  },
  {
    icon: icons.sendFeedback,
    title: 'SAV & Maintenance',
    description:
      'Support technique reactif et interventions de maintenance preventive pour garantir la disponibilite de vos bornes 365 jours par an.',
  },
  {
    icon: icons.dashboard,
    title: 'Plateforme Evone Hotels',
    description:
      'Interface de gestion dediee aux hoteliers : supervision en temps reel, facturation automatique et reporting de consommation par borne.',
  },
  {
    icon: icons.tick,
    title: 'Gestion tierce complete',
    description:
      "Nous prenons en charge l'integralite de l'exploitation. Votre seul objectif : bien servir vos clients. Nous nous occupons de tout le reste.",
  },
  {
    icon: icons.quotes,
    title: 'Experience client premium',
    description:
      'Vos clients rechargent pendant leur sejour, sans friction. Un service differenciant qui valorise votre etablissement aupres des voyageurs electriques.',
  },
]

const evoneFeatures = [
  'Tableau de bord en temps reel : etat des bornes, sessions actives, alertes',
  'Facturation automatique par chambre ou carte client',
  "Reporting mensuel de consommation et de chiffre d'affaires recharge",
  'Acces multi-sites pour les groupes hoteliers',
  'Integration avec les systemes PMS existants',
  'Notifications techniques automatiques vers vos equipes',
]

export default function Hotels() {
  return (
    <SolutionPageLayout
      documentTitle="EVplug Hotels | Recharge electrique pour l'hotellerie au Maroc"
      ctaInterest="Solution hotel"
      ctaButtonLabel="Recharger mes clients"
      ctaTitle="Recharge pour votre hotel"
      ctaSubtitle="Offrez la recharge a vos clients. Decrivez votre etablissement, on vous propose une solution sur-mesure."
      ctaAccentColor="#e8b04e"
    >
      <SolutionTemplate
        tag="Hotellerie & Hospitality"
        heroTitle="Recharge electrique pour vos clients, zero souci pour vous."
        heroSubtitle="EVplug equipe votre hotel de bornes connectees AC et DC, gere l'exploitation et vous laisse vous concentrer sur ce qui compte : offrir la meilleure experience a vos clients."
        heroImage={heroImage}
        storyImage={storyImage}
        platformImage={platformImage}
        heroCta="Etudier votre projet"
        services={services}
        imagePanel1Title="Une installation sans interruption pour votre activite"
        imagePanel1Body="Nos techniciens interviennent selon votre calendrier. L'installation se deroule sans impact sur vos clients ni votre personnel, quelle que soit la taille ou la configuration de votre etablissement."
        evoneBadge="Plateforme Evone Hotels"
        evoneTitle="Pilotez votre infrastructure de recharge."
        evoneSubtitle="La plateforme Evone est concue pour les hoteliers. Une interface intuitive pour superviser, facturer et optimiser chaque borne de votre etablissement, sans competences techniques requises."
        evoneFeatures={evoneFeatures}
        ctaTitle="Equipez votre hotel en recharge electrique."
        ctaBody="De l'etude electrique a l'exploitation quotidienne, EVplug vous accompagne a chaque etape. Un interlocuteur unique, une solution cle en main."
      />
    </SolutionPageLayout>
  )
}
