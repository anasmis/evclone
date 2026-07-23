import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'
import { submitParkingRequest } from '../../lib/api/strapi'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import heroImage from '../../migrated/assets/solutions/parkings/hero.jpeg'
import storyImage from '../../migrated/assets/solutions/parkings/story.jpeg'
import platformImage from '../../migrated/assets/solutions/parkings/platform.jpg'

const services = [
  {
    icon: icons.charger,
    title: 'Étude électrique',
    description:
      "Dimensionnement optimisé selon le flux et la capacité de votre parking ou station. Étude de puissance et plan d'infrastructure adapté à votre configuration.",
  },
  {
    icon: icons.standaloneCharger,
    title: 'Bornes connectées AC et DC',
    description:
      'Mix AC et DC adapté aux différentes durées de stationnement. Courte durée, longue durée ou mixte : chaque place est équipée de façon pertinente.',
  },
  {
    icon: icons.sendFeedback,
    title: 'SAV & Maintenance',
    description:
      'Support 7j/7 et interventions rapides pour maintenir un taux de disponibilité maximal. Vos clients ne tombent jamais sur une borne hors service.',
  },
  {
    icon: icons.installation,
    title: 'Connectivité plateforme parking',
    description:
      'Intégration API native avec votre système de gestion de parking ou station. Synchronisation en temps réel des disponibilités bornes et places libres.',
  },
  {
    icon: icons.vehicle,
    title: 'Expérience utilisateur fluide',
    description:
      "Le client localise une place libre avec borne disponible, se gare, recharge et paie stationnement + énergie en un seul parcours digital, sans file d'attente.",
  },
  {
    icon: icons.dashboard,
    title: 'Plateforme Evone Parkings & Stations',
    description:
      "Tableau de bord dédié aux gestionnaires : taux d'occupation des bornes, revenus recharge, alertes techniques et reporting d'activité complet.",
  },
]

const evoneFeatures = [
  "Consommation d'énergie (kWh) par borne et par période",
  'Revenus générés et suivi des encaissements',
  "Temps de stationnement et taux d'occupation des places",
  "Tarification et accès par profils d'utilisateurs",
  'Rapports exportables pour finance et opérations',
  "Aide au dimensionnement : pics d'utilisation et besoins futurs",
]

export default function Parkings() {
  return (
    <SolutionPageLayout
      documentTitle="EVplug Parkings & Stations | Solutions de recharge au Maroc"
      ctaInterest="Solution parking"
      ctaButtonLabel="Équiper mon parking"
      ctaTitle="Équipons votre parking"
      ctaSubtitle="Nombre de places, type d'usage, contraintes électriques : on dimensionne votre projet."
      ctaAccentColor="#5cc0e8"
      ctaSubmitFn={submitParkingRequest}
    >
      <SolutionTemplate
        tag="EV Parking & Stations"
        heroTitle="Transformez vos parkings et stations en infrastructure de mobilité électrique."
        heroSubtitle="EVplug intègre la recharge électrique à vos parkings et stations de services. Vos clients trouvent une place libre avec borne disponible, rechargent et paient en un seul parcours. Vous monétisez chaque site."
        heroImage={heroImage}
        storyImage={storyImage}
        platformImage={platformImage}
        heroCta="Étudier votre projet"
        services={services}
        imagePanel1Title="Intégration native avec vos systèmes de gestion"
        imagePanel1Body="Evone se connecte à votre plateforme de gestion parking ou station via une API ouverte. La synchronisation en temps réel des disponibilités bornes et places libres est automatique, sans développement supplémentaire de votre côté."
        evoneBadge="EVone Site Management"
        evoneTitle="EVone Site Management Service"
        evoneSubtitle="Analysez l'usage, optimisez vos tarifs et planifiez l'extension grâce à des tableaux de bord en temps réel et des rapports exploitables."
        evoneFeatures={evoneFeatures}
        ctaTitle="Modernisez vos parkings et stations avec la recharge électrique."
        ctaBody="Qu'il s'agisse d'un parking public, privé, en ouvrage ou d'une station de services, EVplug conçoit la solution adaptée à votre flux et à votre système existant."
      />
    </SolutionPageLayout>
  )
}
