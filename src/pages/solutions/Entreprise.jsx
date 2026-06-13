import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'
import { submitEnterpriseRequest } from '../../lib/api/strapi'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import heroImage from '../../migrated/assets/solutions/entreprise/hero.jpeg'
import storyImage from '../../migrated/assets/solutions/entreprise/story.jpeg'
import platformImage from '../../migrated/assets/solutions/entreprise/platform.jpeg'

const services = [
  {
    icon: icons.charger,
    title: 'Étude électrique',
    description:
      'Diagnostic électrique de vos sites, dimensionnement des bornes selon vos besoins de flotte et mise en conformité de votre installation.',
  },
  {
    icon: icons.standaloneCharger,
    title: 'Bornes connectées AC et DC',
    description:
      'Bornes professionnelles sur vos sites et locaux pour recharger vos véhicules de fonction, de flotte et les véhicules de vos collaborateurs.',
  },
  {
    icon: icons.sendFeedback,
    title: 'SAV & Maintenance',
    description:
      'Support dédié entreprises avec SLA garantis. Interventions prioritaires pour assurer la continuité de recharge de votre flotte.',
  },
  {
    icon: icons.smartCharge,
    title: 'Électrification intelligente de flotte',
    description:
      "Stratégie progressive d'électrification de vos véhicules. Analyse de vos usages, planification des renouvellements et accompagnement au changement.",
  },
  {
    icon: icons.milesEarned,
    title: 'Étude de rentabilité de flotte',
    description:
      'Modélisation financière complète : TCO comparé essence/électrique, économies sur le carburant, aides disponibles au Maroc et retour sur investissement.',
  },
  {
    icon: icons.profile,
    title: 'Expérience collaborateurs inédite',
    description:
      'Offrez la recharge au bureau ou chez vos collaborateurs. Un avantage concret qui renforce votre marque employeur et fidélise vos équipes.',
  },
  {
    icon: icons.chargingDuration,
    title: 'Maîtrise des consommations',
    description:
      'Pilotage fin de la recharge par collaborateur : budgets individuels, quotas, suivi de consommation en temps réel et reporting RH intégré.',
  },
  {
    icon: icons.coins,
    title: "Outil d'avantages collaborateurs",
    description:
      "Dotez vos équipes d'un avantage recharge. Attribution de crédits, gestion des bénéficiaires et reporting des avantages accordés depuis une interface unique.",
  },
  {
    icon: icons.dashboard,
    title: 'Plateforme Evone Entreprise',
    description:
      'Gérez vos bornes, vos collaborateurs et les avantages qui leur sont attribués depuis une seule interface. Facturation, reporting et administration centralisés.',
  },
]

const evoneFeatures = [
  'Gestion des bornes par site, par service et par collaborateur',
  'Attribution et suivi des avantages recharge individuelle',
  'Reporting RH : consommations par collaborateur et remboursement automatisé',
  'Suivi en temps réel de la flotte : statut de charge, disponibilité véhicule',
  'Pilotage de la recharge intelligente pour lisser la consommation et réduire les coûts',
  'Exports compatibles avec vos outils paie et comptabilité',
  'Accès multi-sites pour les groupes et holdings',
]

export default function Entreprise() {
  return (
    <SolutionPageLayout
      documentTitle="EVplug Entreprise | Électrification de flotte et recharge collaborateurs au Maroc"
      ctaInterest="Solution entreprise"
      ctaButtonLabel="Électrifier ma flotte"
      ctaTitle="Électrifions votre flotte"
      ctaSubtitle="Décrivez votre site et le nombre de véhicules : un expert flotte EVplug vous rappelle sous 24h."
      ctaAccentColor="#c8d72d"
      ctaSubmitFn={submitEnterpriseRequest}
    >
      <SolutionTemplate
        tag="EV Entreprise"
        heroTitle="Électrifiez votre flotte et dotez vos collaborateurs d'un avantage recharge."
        heroSubtitle="De l'étude de rentabilité au déploiement des bornes sur site, EVplug vous accompagne dans la transition électrique de votre entreprise. Maîtrisez vos coûts, valorisez vos équipes."
        heroImage={heroImage}
        storyImage={storyImage}
        platformImage={platformImage}
        heroCta="Étudier votre projet"
        services={services}
        imagePanel1Title="Maîtrisez les coûts de votre mobilité professionnelle"
        imagePanel1Body="En électrifiant votre flotte et en équipant vos locaux de bornes intelligentes, vous réalisez jusqu'à 60 % d'économies sur le carburant par véhicule. Evone vous aide à piloter chaque euro dépensé par vos collaborateurs et votre flotte."
        evoneBadge="Plateforme Evone Entreprise"
        evoneTitle="Une plateforme pour vos bornes, votre flotte et vos collaborateurs."
        evoneSubtitle="Evone Entreprise centralise la gestion de votre infrastructure de recharge, le suivi de votre flotte électrique et l'administration des avantages collaborateurs. Un outil unique, un gain de temps considérable."
        evoneFeatures={evoneFeatures}
        ctaTitle="Passez à la mobilité électrique d'entreprise."
        ctaBody="Étude de rentabilité, déploiement des bornes, formation des collaborateurs et exploitation continue : EVplug prend en charge l'intégralité de votre transition électrique."
      />
    </SolutionPageLayout>
  )
}
