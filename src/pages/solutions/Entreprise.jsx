import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import heroImage from '../../migrated/assets/solutions/entreprise/hero.jpeg'
import storyImage from '../../migrated/assets/solutions/entreprise/story.jpeg'
import platformImage from '../../migrated/assets/solutions/entreprise/platform.jpeg'

const services = [
  {
    icon: icons.charger,
    title: 'Etude electrique',
    description:
      'Diagnostic electrique de vos sites, dimensionnement des bornes selon vos besoins de flotte et mise en conformite de votre installation.',
  },
  {
    icon: icons.standaloneCharger,
    title: 'Bornes connectees AC et DC',
    description:
      'Bornes professionnelles sur vos sites et locaux pour recharger vos vehicules de fonction, de flotte et les vehicules de vos collaborateurs.',
  },
  {
    icon: icons.sendFeedback,
    title: 'SAV & Maintenance',
    description:
      'Support dedie entreprises avec SLA garantis. Interventions prioritaires pour assurer la continuite de recharge de votre flotte.',
  },
  {
    icon: icons.smartCharge,
    title: 'Electrification intelligente de flotte',
    description:
      "Strategie progressive d'electrification de vos vehicules. Analyse de vos usages, planification des renouvellements et accompagnement au changement.",
  },
  {
    icon: icons.milesEarned,
    title: 'Etude de rentabilite de flotte',
    description:
      'Modelisation financiere complete : TCO compare essence/electrique, economies sur le carburant, aides disponibles au Maroc et retour sur investissement.',
  },
  {
    icon: icons.profile,
    title: 'Experience collaborateurs inedite',
    description:
      'Offrez la recharge au bureau ou chez vos collaborateurs. Un avantage concret qui renforce votre marque employeur et fidélise vos equipes.',
  },
  {
    icon: icons.chargingDuration,
    title: 'Maitrise des consommations',
    description:
      'Pilotage fin de la recharge par collaborateur : budgets individuels, quotas, suivi de consommation en temps reel et reporting RH integre.',
  },
  {
    icon: icons.coins,
    title: "Outil d'avantages collaborateurs",
    description:
      "Dotez vos equipes d'un avantage recharge. Attribution de credits, gestion des beneficiaires et reporting des avantages accordes depuis une interface unique.",
  },
  {
    icon: icons.dashboard,
    title: 'Plateforme Evone Entreprise',
    description:
      'Gerez vos bornes, vos collaborateurs et les avantages qui leur sont attribues depuis une seule interface. Facturation, reporting et administration centralises.',
  },
]

const evoneFeatures = [
  'Gestion des bornes par site, par service et par collaborateur',
  'Attribution et suivi des avantages recharge individuelle',
  'Reporting RH : consommations par collaborateur et remboursement automatise',
  'Suivi en temps reel de la flotte : statut de charge, disponibilite vehicule',
  'Pilotage de la recharge intelligente pour lisser la consommation et reduire les couts',
  'Exports compatibles avec vos outils paie et comptabilite',
  'Acces multi-sites pour les groupes et holdings',
]

export default function Entreprise() {
  return (
    <SolutionPageLayout
      documentTitle="EVplug Entreprise | Electrification de flotte et recharge collaborateurs au Maroc"
      ctaInterest="Solution entreprise"
      ctaButtonLabel="Electrifier ma flotte"
      ctaTitle="Electrifions votre flotte"
      ctaSubtitle="Decrivez votre site et le nombre de vehicules : un expert flotte EVplug vous rappelle sous 24h."
      ctaAccentColor="#c8d72d"
    >
      <SolutionTemplate
        tag="EV Entreprise"
        heroTitle="Electrifiez votre flotte et dotez vos collaborateurs d'un avantage recharge."
        heroSubtitle="De l'etude de rentabilite au deploiement des bornes sur site, EVplug vous accompagne dans la transition electrique de votre entreprise. Maitrisez vos couts, valorisez vos equipes."
        heroImage={heroImage}
        storyImage={storyImage}
        platformImage={platformImage}
        heroCta="Etudier votre projet"
        services={services}
        imagePanel1Title="Maitrisez les couts de votre mobilite professionnelle"
        imagePanel1Body="En electrifiant votre flotte et en equipant vos locaux de bornes intelligentes, vous realisez jusqu'a 60 % d'economies sur le carburant par vehicule. Evone vous aide a piloter chaque euro depense par vos collaborateurs et votre flotte."
        evoneBadge="Plateforme Evone Entreprise"
        evoneTitle="Une plateforme pour vos bornes, votre flotte et vos collaborateurs."
        evoneSubtitle="Evone Entreprise centralise la gestion de votre infrastructure de recharge, le suivi de votre flotte electrique et l'administration des avantages collaborateurs. Un outil unique, un gain de temps considerable."
        evoneFeatures={evoneFeatures}
        ctaTitle="Passez a la mobilite electrique d'entreprise."
        ctaBody="Etude de rentabilite, deploiement des bornes, formation des collaborateurs et exploitation continue : EVplug prend en charge l'integralite de votre transition electrique."
      />
    </SolutionPageLayout>
  )
}
