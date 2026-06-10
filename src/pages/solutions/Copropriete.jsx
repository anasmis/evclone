import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import heroImage from '../../migrated/assets/solutions/copropriete/hero.jpeg'
import storyImage from '../../migrated/assets/solutions/copropriete/story.jpeg'
import platformImage from '../../migrated/assets/solutions/copropriete/platform.jpeg'

const services = [
  {
    icon: icons.charger,
    title: 'Étude électrique collective',
    description:
      "Diagnostic de votre tableau commun, analyse de la capacité disponible et plan d'équipement progressif selon le nombre de résidents intéressés.",
  },
  {
    icon: icons.standaloneCharger,
    title: 'Bornes AC individuelles',
    description:
      'Bornes dédiées par place de parking résident, adaptées à la recharge nocturne. Installation soignée sans travaux lourds sur les parties communes.',
  },
  {
    icon: icons.sendFeedback,
    title: 'SAV & Maintenance',
    description:
      "Suivi technique et interventions rapides pour l'ensemble de la copropriété. Un seul interlocuteur pour le syndic, une fiabilité maximale pour les résidents.",
  },
  {
    icon: icons.chargingDuration,
    title: 'Facturation individuelle',
    description:
      'Chaque résident est facturé à sa consommation réelle. Aucune mutualisation des coûts, transparence totale et rapports mensuels par résident.',
  },
  {
    icon: icons.installation,
    title: 'Accompagnement syndic',
    description:
      "EVplug accompagne le syndic dans les démarches : aide à la préparation de l'AG, dossiers techniques et administratifs, coordination avec les prestataires.",
  },
  {
    icon: icons.dashboard,
    title: 'Plateforme Evone Copropriété',
    description:
      "Interface dédiée au syndic : état des bornes, consommations par résident, facturation automatique et historique d'interventions accessibles à tout moment.",
  },
]

const evoneFeatures = [
  'Tableau de bord syndic : état global de toutes les bornes de la copropriété',
  'Facturation individuelle automatique par résident chaque mois',
  'Suivi des consommations en kWh et en dirhams par place',
  'Historique complet des sessions de charge et des interventions techniques',
  "Ajout ou suppression d'un résident en quelques clics",
  "Notifications automatiques en cas d'anomalie ou de panne",
]

export default function Copropriete() {
  return (
    <SolutionPageLayout
      documentTitle="EVplug Copropriété | Recharge électrique en résidence au Maroc"
      ctaInterest="Solution copropriété"
      ctaButtonLabel="Équiper ma copropriété"
      ctaTitle="Projet de copropriété"
      ctaSubtitle="Résident ou syndic ? Décrivez votre résidence, on vous accompagne de l'AG à la mise en service."
      ctaAccentColor="#7fd58a"
    >
      <SolutionTemplate
        tag="EV Copropriété"
        heroTitle="La recharge électrique pour votre résidence, simple et équitable."
        heroSubtitle="EVplug équipe votre copropriété de bornes individuelles, gère la facturation par résident et accompagne le syndic de l'étude au quotidien. Sans mutualisation des coûts, sans complications."
        heroImage={heroImage}
        storyImage={storyImage}
        platformImage={platformImage}
        heroCta="Étudier votre projet"
        services={services}
        imagePanel1Title="Une solution progressive, sans engagement collectif"
        imagePanel1Body="L'installation commence avec les résidents intéressés et s'étend au rythme des adhésions. Chaque borne est indépendante, la facturation est individuelle. La copropriété n'est jamais exposée à des frais collectifs non prévus."
        evoneBadge="Plateforme Evone Copropriété"
        evoneTitle="Le syndic gère tout depuis une seule interface."
        evoneSubtitle="Evone Copropriété donne au syndic la visibilité et les outils pour administrer l'ensemble des bornes de la résidence : consommations, facturation individuelle et suivi technique, sans compétences particulières."
        evoneFeatures={evoneFeatures}
        ctaTitle="Équipez votre copropriété en recharge électrique."
        ctaBody="De l'étude de faisabilité électrique au vote en AG, en passant par l'installation et l'exploitation, EVplug gère l'intégralité du projet pour votre copropriété."
      />
    </SolutionPageLayout>
  )
}
