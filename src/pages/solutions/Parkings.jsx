import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'

const ICONS = '/assets/podenergy.com/sites/default/files'

const services = [
  {
    icon: '2025-10/charger.svg',
    title: 'Etude electrique',
    description:
      'Dimensionnement optimise selon le flux et la capacite de votre parking. Etude de puissance et plan d\'infrastructure adapte a votre configuration.',
  },
  {
    icon: '2025-11/standalone-charger.svg',
    title: 'Bornes connectees AC et DC',
    description:
      'Mix AC et DC adapte aux differentes durees de stationnement. Courte duree, longue duree ou mixte : chaque place est equipee de facon pertinente.',
  },
  {
    icon: '2025-11/Send-feedback.svg',
    title: 'SAV & Maintenance',
    description:
      'Support 7j/7 et interventions rapides pour maintenir un taux de disponibilite maximal. Vos clients ne tombent jamais sur une borne hors service.',
  },
  {
    icon: '2025-10/installation.svg',
    title: 'Connectivite plateforme parking',
    description:
      'Integration API native avec votre systeme de gestion de parking. Synchronisation en temps reel des disponibilites bornes et places libres.',
  },
  {
    icon: '2025-11/vehicle.svg',
    title: 'Experience utilisateur fluide',
    description:
      'Le client localise une place libre avec borne disponible, se gare, recharge et paie stationnement + energie en un seul parcours digital, sans file d\'attente.',
  },
  {
    icon: '2025-11/Dashboard.svg',
    title: 'Plateforme Evone Parkings',
    description:
      'Tableau de bord dedie aux gestionnaires : taux d\'occupation des bornes, revenus recharge, alertes techniques et reporting d\'activite complet.',
  },
]

// EVone Site Management Service — aligne sur la section "Site Management Service" (Commercial charging)
const evoneFeatures = [
  'Consommation d’energie (kWh) par borne et par periode',
  'Revenus generes et suivi des encaissements',
  'Temps de stationnement et taux d’occupation des places',
  'Tarification et acces par profils d’utilisateurs',
  'Rapports exportables pour finance et operations',
  'Aide au dimensionnement: pics d’utilisation et besoins futurs',
]

export default function Parkings() {
  return (
    <SolutionPageLayout documentTitle="EVplug Parkings | Solutions de recharge pour parkings au Maroc">
      <SolutionTemplate
        tag="EV Parking"
        heroTitle="Transformez vos parkings en infrastructure de mobilite electrique."
        heroSubtitle="EVplug integre la recharge electrique a votre gestion de parking. Vos clients trouvent une place libre avec borne disponible, rechargent et paient en un seul parcours. Vous monetisez chaque place."
        heroImage={`${ICONS}/2025-11/CRS09433.jpg`}
        storyImage={`${ICONS}/2025-11/CRS09749_0.jpg`}
        platformImage={`${ICONS}/2025-11/CRS09462.jpg`}
        heroCta="Etudier votre projet"
        services={services}
        imagePanel1Title="Integration native avec votre systeme de gestion"
        imagePanel1Body="Evone se connecte a votre plateforme de gestion parking via une API ouverte. La synchronisation en temps reel des disponibilites bornes et places libres est automatique, sans developpement supplementaire de votre cote."
        evoneBadge="EVone Site Management"
        evoneTitle="EVone Site Management Service"
        evoneSubtitle="Analysez l’usage, optimisez vos tarifs et planifiez l’extension grace a des tableaux de bord en temps reel et des rapports exploitables."
        evoneFeatures={evoneFeatures}
        ctaTitle="Modernisez votre parking avec la recharge electrique."
        ctaBody="Qu'il s'agisse d'un parking public, prive ou en ouvrage, EVplug conçoit la solution adaptee a votre flux et a votre systeme existant."
      />
    </SolutionPageLayout>
  )
}
