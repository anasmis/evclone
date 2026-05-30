import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import heroImage from '../../migrated/assets/solutions/parkings/hero.jpeg'
import storyImage from '../../migrated/assets/solutions/parkings/story.jpeg'
import platformImage from '../../migrated/assets/solutions/parkings/platform.jpg'

const services = [
  {
    icon: icons.charger,
    title: 'Etude electrique',
    description:
      "Dimensionnement optimise selon le flux et la capacite de votre parking ou station. Etude de puissance et plan d'infrastructure adapte a votre configuration.",
  },
  {
    icon: icons.standaloneCharger,
    title: 'Bornes connectees AC et DC',
    description:
      'Mix AC et DC adapte aux differentes durees de stationnement. Courte duree, longue duree ou mixte : chaque place est equipee de facon pertinente.',
  },
  {
    icon: icons.sendFeedback,
    title: 'SAV & Maintenance',
    description:
      'Support 7j/7 et interventions rapides pour maintenir un taux de disponibilite maximal. Vos clients ne tombent jamais sur une borne hors service.',
  },
  {
    icon: icons.installation,
    title: 'Connectivite plateforme parking',
    description:
      'Integration API native avec votre systeme de gestion de parking ou station. Synchronisation en temps reel des disponibilites bornes et places libres.',
  },
  {
    icon: icons.vehicle,
    title: 'Experience utilisateur fluide',
    description:
      "Le client localise une place libre avec borne disponible, se gare, recharge et paie stationnement + energie en un seul parcours digital, sans file d'attente.",
  },
  {
    icon: icons.dashboard,
    title: 'Plateforme Evone Parkings & Stations',
    description:
      "Tableau de bord dedie aux gestionnaires : taux d'occupation des bornes, revenus recharge, alertes techniques et reporting d'activite complet.",
  },
]

const evoneFeatures = [
  "Consommation d'energie (kWh) par borne et par periode",
  'Revenus generes et suivi des encaissements',
  "Temps de stationnement et taux d'occupation des places",
  "Tarification et acces par profils d'utilisateurs",
  'Rapports exportables pour finance et operations',
  "Aide au dimensionnement: pics d'utilisation et besoins futurs",
]

export default function Parkings() {
  return (
    <SolutionPageLayout
      documentTitle="EVplug Parkings & Stations | Solutions de recharge au Maroc"
      ctaInterest="Solution parking"
      ctaButtonLabel="Equiper mon parking"
      ctaTitle="Equipons votre parking"
      ctaSubtitle="Nombre de places, type d'usage, contraintes electriques : on dimensionne votre projet."
      ctaAccentColor="#5cc0e8"
    >
      <SolutionTemplate
        tag="EV Parking & Stations"
        heroTitle="Transformez vos parkings et stations en infrastructure de mobilite electrique."
        heroSubtitle="EVplug integre la recharge electrique a vos parkings et stations de services. Vos clients trouvent une place libre avec borne disponible, rechargent et paient en un seul parcours. Vous monetisez chaque site."
        heroImage={heroImage}
        storyImage={storyImage}
        platformImage={platformImage}
        heroCta="Etudier votre projet"
        services={services}
        imagePanel1Title="Integration native avec vos systemes de gestion"
        imagePanel1Body="Evone se connecte a votre plateforme de gestion parking ou station via une API ouverte. La synchronisation en temps reel des disponibilites bornes et places libres est automatique, sans developpement supplementaire de votre cote."
        evoneBadge="EVone Site Management"
        evoneTitle="EVone Site Management Service"
        evoneSubtitle="Analysez l'usage, optimisez vos tarifs et planifiez l'extension grace a des tableaux de bord en temps reel et des rapports exploitables."
        evoneFeatures={evoneFeatures}
        ctaTitle="Modernisez vos parkings et stations avec la recharge electrique."
        ctaBody="Qu'il s'agisse d'un parking public, prive, en ouvrage ou d'une station de services, EVplug conçoit la solution adaptee a votre flux et a votre systeme existant."
      />
    </SolutionPageLayout>
  )
}
