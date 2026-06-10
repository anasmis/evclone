import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import heroImage from '../../migrated/assets/solutions/hotels/hero.jpeg'
import storyImage from '../../migrated/assets/solutions/hotels/story.jpeg'
import platformImage from '../../migrated/assets/solutions/hotels/platform.jpg'

const services = [
  {
    icon: icons.charger,
    title: 'Étude électrique',
    description:
      "Audit complet de votre installation électrique et dimensionnement adapté au flux de vos clients et à l'infrastructure de votre établissement.",
  },
  {
    icon: icons.standaloneCharger,
    title: 'Bornes connectées AC et DC',
    description:
      "Bornes AC pour les recharges nocturnes et DC pour les recharges rapides à l'arrivée. Compatibles tous véhicules, design discret et professionnel.",
  },
  {
    icon: icons.sendFeedback,
    title: 'SAV & Maintenance',
    description:
      'Support technique réactif et interventions de maintenance préventive pour garantir la disponibilité de vos bornes 365 jours par an.',
  },
  {
    icon: icons.dashboard,
    title: 'Plateforme Evone Hôtels',
    description:
      'Interface de gestion dédiée aux hôteliers : supervision en temps réel, facturation automatique et reporting de consommation par borne.',
  },
  {
    icon: icons.tick,
    title: 'Gestion tierce complète',
    description:
      "Nous prenons en charge l'intégralité de l'exploitation. Votre seul objectif : bien servir vos clients. Nous nous occupons de tout le reste.",
  },
  {
    icon: icons.quotes,
    title: 'Expérience client premium',
    description:
      'Vos clients rechargent pendant leur séjour, sans friction. Un service différenciant qui valorise votre établissement auprès des voyageurs électriques.',
  },
]

const evoneFeatures = [
  'Tableau de bord en temps réel : état des bornes, sessions actives, alertes',
  'Facturation automatique par chambre ou carte client',
  "Reporting mensuel de consommation et de chiffre d'affaires recharge",
  'Accès multi-sites pour les groupes hôteliers',
  'Intégration avec les systèmes PMS existants',
  'Notifications techniques automatiques vers vos équipes',
]

export default function Hotels() {
  return (
    <SolutionPageLayout
      documentTitle="EVplug Hôtels | Recharge électrique pour l'hôtellerie au Maroc"
      ctaInterest="Solution hôtel"
      ctaButtonLabel="Recharger mes clients"
      ctaTitle="Recharge pour votre hôtel"
      ctaSubtitle="Offrez la recharge à vos clients. Décrivez votre établissement, on vous propose une solution sur-mesure."
      ctaAccentColor="#e8b04e"
    >
      <SolutionTemplate
        tag="Hôtellerie & Hospitality"
        heroTitle="Recharge électrique pour vos clients, zéro souci pour vous."
        heroSubtitle="EVplug équipe votre hôtel de bornes connectées AC et DC, gère l'exploitation et vous laisse vous concentrer sur ce qui compte : offrir la meilleure expérience à vos clients."
        heroImage={heroImage}
        storyImage={storyImage}
        platformImage={platformImage}
        heroCta="Étudier votre projet"
        services={services}
        imagePanel1Title="Une installation sans interruption pour votre activité"
        imagePanel1Body="Nos techniciens interviennent selon votre calendrier. L'installation se déroule sans impact sur vos clients ni votre personnel, quelle que soit la taille ou la configuration de votre établissement."
        evoneBadge="Plateforme Evone Hôtels"
        evoneTitle="Pilotez votre infrastructure de recharge."
        evoneSubtitle="La plateforme Evone est conçue pour les hôteliers. Une interface intuitive pour superviser, facturer et optimiser chaque borne de votre établissement, sans compétences techniques requises."
        evoneFeatures={evoneFeatures}
        ctaTitle="Équipez votre hôtel en recharge électrique."
        ctaBody="De l'étude électrique à l'exploitation quotidienne, EVplug vous accompagne à chaque étape. Un interlocuteur unique, une solution clé en main."
      />
    </SolutionPageLayout>
  )
}
