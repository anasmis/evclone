import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'
import { submitStationServiceRequest } from '../../lib/api/strapi'
import { icons } from '../../migrated/assets/solutions/shared/icons'
import heroImage from '../../migrated/assets/solutions/stations-service/hero.jpeg'
import storyImage from '../../migrated/assets/solutions/stations-service/story.jpeg'
import platformImage from '../../migrated/assets/solutions/stations-service/platform.jpg'

const services = [
  {
    icon: icons.charger,
    title: 'Étude électrique & raccordement',
    description:
      'Audit de votre station, plan de raccordement haute puissance et coordination complète avec les fournisseurs réseau pour un raccordement sans accroc.',
  },
  {
    icon: icons.standaloneCharger,
    title: 'Bornes DC haute puissance',
    description:
      'Recharge rapide de 50 kW à 300 kW. Vos clients rechargent en 15 à 45 minutes pendant leur pause. Formats compatibles CCS2, CHAdeMO et AC Type 2.',
  },
  {
    icon: icons.sendFeedback,
    title: 'SAV 24h/24 et 7j/7',
    description:
      'Supervision à distance en continu, téléassistance immédiate et interventions terrain prioritaires pour minimiser toute immobilisation commerciale.',
  },
  {
    icon: icons.tariff,
    title: 'Interopérabilité & paiement',
    description:
      "Compatible paiement CB sans contact, badge RFID, application mobile et roaming avec les grands réseaux de recharge. Aucune exclusion d'utilisateur.",
  },
  {
    icon: icons.dashboard,
    title: 'Plateforme Evone Station',
    description:
      "Gestion tarifaire en temps réel, monitoring des bornes, reporting chiffre d'affaires recharge, analyse du flux clients et alertes techniques automatiques.",
  },
  {
    icon: icons.tick,
    title: 'Gestion tierce complète',
    description:
      "Exploitation totale de votre infrastructure de recharge : supervision, maintenance et relation clients recharge. Vous vous concentrez sur votre cœur de métier.",
  },
]

const evoneFeatures = [
  'Monitoring en temps réel : état de chaque borne DC, sessions actives, alertes',
  'Gestion tarifaire dynamique : tarifs heures pleines, heures creuses, abonnés',
  "Reporting financier : chiffre d'affaires recharge par période et par borne",
  'Compatibilité roaming OCPI avec les grands réseaux nationaux et africains',
  "Tableau de bord flux clients : temps de charge moyen, taux d'occupation, heures de pointe",
  'Intégration OCPP 1.6 et 2.0 pour tous les équipements',
]

const managementItems = [
  {
    icon: icons.dashboard,
    title: 'Site management',
    description:
      'Supervisez toutes vos bornes DC en direct, pilotez leur disponibilité et appliquez des règles de fonctionnement par station, axe routier ou zone.',
  },
  {
    icon: icons.profile,
    title: 'User management',
    description:
      "Gérez les accès par type d'utilisateur (grand public, flottes, partenaires), les droits d'usage et les parcours de recharge depuis une seule console.",
  },
  {
    icon: icons.coins,
    title: 'Expense and driver management',
    description:
      "Contrôlez les tarifs, le chiffre d'affaires recharge, les reversements et les historiques de sessions pour une exploitation rentable et traçable.",
  },
]

export default function StationsService() {
  return (
    <SolutionPageLayout
      documentTitle="EVplug Stations | Recharge rapide DC pour stations de services au Maroc"
      ctaInterest="Station-service"
      ctaButtonLabel="Installer une borne DC"
      ctaTitle="Station-service & recharge rapide"
      ctaSubtitle="Localisation, trafic, puissance disponible : on cadre votre projet de borne rapide DC."
      ctaAccentColor="#fe5716"
      ctaSubmitFn={submitStationServiceRequest}
    >
      <SolutionTemplate
        tag="EV Station de services"
        heroTitle="Faites de votre station un hub de mobilité électrique."
        heroSubtitle="EVplug installe et exploite des bornes DC haute puissance sur votre station. Vos clients rechargent en moins de 45 minutes, vous générez de nouveaux revenus et renforcez votre attractivité."
        heroImage={heroImage}
        storyImage={storyImage}
        platformImage={platformImage}
        heroCta="Étudier votre projet"
        services={services}
        imagePanel1Title="Raccordement haute puissance, expertise incluse"
        imagePanel1Body="Nos équipes coordonnent le raccordement électrique haute puissance avec les fournisseurs de réseau. Vous n'avez pas à gérer les démarches techniques : EVplug prend tout en charge, du dossier de raccordement à la mise en service commerciale."
        managementTitle="Notre EVone Management Service pour stations"
        managementSubtitle="Inspiré du modèle workplace-charging de Podenergy, ce service EVone unifie la gestion de site, des utilisateurs et des revenus de recharge dans une plateforme unique."
        managementItems={managementItems}
        managementCta="Voir EVone Management Service"
        evoneBadge="Plateforme Evone Stations"
        evoneTitle="Supervisez et monétisez votre infrastructure de recharge rapide."
        evoneSubtitle="Evone Station vous donne le contrôle total de vos bornes DC : tarification, monitoring, reporting financier et compatibilité avec les grands réseaux de roaming. Une plateforme pensée pour maximiser vos revenus recharge."
        evoneFeatures={evoneFeatures}
        ctaTitle="Devenez un acteur de la mobilité électrique au Maroc."
        ctaBody="Que vous exploitiez une station de services, une aire d'autoroute ou un hub logistique, EVplug conçoit et déploie votre infrastructure de recharge rapide de A à Z."
      />
    </SolutionPageLayout>
  )
}
