import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'

const ICONS = '/assets/podenergy.com/sites/default/files'

const services = [
  {
    icon: '2025-10/charger.svg',
    title: 'Etude electrique & raccordement',
    description:
      'Audit de votre station, plan de raccordement haute puissance et coordination complete avec les fournisseurs reseau pour un raccordement sans accroc.',
  },
  {
    icon: '2025-11/standalone-charger.svg',
    title: 'Bornes DC haute puissance',
    description:
      'Recharge rapide de 50 kW a 300 kW. Vos clients rechargent en 15 a 45 minutes pendant leur pause. Formats compatibles CCS2, CHAdeMO et AC Type 2.',
  },
  {
    icon: '2025-11/Send-feedback.svg',
    title: 'SAV 24h/24 et 7j/7',
    description:
      'Supervision a distance en continu, teleassistance immediate et interventions terrain prioritaires pour minimiser toute immobilisation commerciale.',
  },
  {
    icon: '2025-11/tariff.svg',
    title: 'Interoperabilite & paiement',
    description:
      'Compatible paiement CB sans contact, badge RFID, application mobile et roaming avec les grands reseaux de recharge. Aucune exclusion d\'utilisateur.',
  },
  {
    icon: '2025-11/Dashboard.svg',
    title: 'Plateforme Evone Station',
    description:
      'Gestion tarifaire en temps reel, monitoring des bornes, reporting chiffre d\'affaires recharge, analyse du flux clients et alertes techniques automatiques.',
  },
  {
    icon: '2025-11/Tick.svg',
    title: 'Gestion tierce complete',
    description:
      'Exploitation totale de votre infrastructure de recharge : supervision, maintenance et relation clients recharge. Vous vous concentrez sur votre coeur de metier.',
  },
]

const evoneFeatures = [
  'Monitoring en temps reel : etat de chaque borne DC, sessions actives, alertes',
  'Gestion tarifaire dynamique : tarifs heures pleines, heures creuses, abonnes',
  'Reporting financier : chiffre d\'affaires recharge par periode et par borne',
  'Compatibilite roaming OCPI avec les grands reseaux nationaux et africains',
  'Tableau de bord flux clients : temps de charge moyen, taux d\'occupation, heures de pointe',
  'Integration OCPP 1.6 et 2.0 pour tous les equipements',
]

const managementItems = [
  {
    icon: '2025-11/Dashboard.svg',
    title: 'Site management',
    description:
      'Supervisez toutes vos bornes DC en direct, pilotez leur disponibilite et appliquez des regles de fonctionnement par station, axe routier ou zone.',
  },
  {
    icon: '2025-11/Profile-2.svg',
    title: 'User management',
    description:
      'Gerez les acces par type d utilisateur (grand public, flottes, partenaires), les droits d usage et les parcours de recharge depuis une seule console.',
  },
  {
    icon: '2025-11/Coins.svg',
    title: 'Expense and driver management',
    description:
      'Controlez les tarifs, le chiffre d affaires recharge, les reversements et les historiques de sessions pour une exploitation rentable et tracable.',
  },
]

export default function StationsService() {
  return (
    <SolutionPageLayout documentTitle="EVplug Stations | Recharge rapide DC pour stations de services au Maroc">
      <SolutionTemplate
        tag="EV Station de services"
        heroTitle="Faites de votre station un hub de mobilite electrique."
        heroSubtitle="EVplug installe et exploite des bornes DC haute puissance sur votre station. Vos clients rechargent en moins de 45 minutes, vous generez de nouveaux revenus et renforcez votre attractivite."
        heroImage={`${ICONS}/2025-11/CRS09749_0.jpg`}
        storyImage={`${ICONS}/2025-11/CRS09749.jpg`}
        platformImage={`${ICONS}/2025-11/CRS09433.jpg`}
        heroCta="Etudier votre projet"
        services={services}
        imagePanel1Title="Raccordement haute puissance, expertise incluse"
        imagePanel1Body="Nos equipes coordonnent le raccordement electrique haute puissance avec les fournisseurs de reseau. Vous n'avez pas a gerer les demarches techniques : EVplug prend tout en charge, du dossier de raccordement a la mise en service commerciale."
        managementTitle="Notre EVone Management Service pour stations"
        managementSubtitle="Inspire du modele workplace-charging de Podenergy, ce service EVone unifie la gestion de site, des utilisateurs et des revenus de recharge dans une plateforme unique."
        managementItems={managementItems}
        managementCta="Voir EVone Management Service"
        evoneBadge="Plateforme Evone Stations"
        evoneTitle="Supervisez et monetisez votre infrastructure de recharge rapide."
        evoneSubtitle="Evone Station vous donne le controle total de vos bornes DC : tarification, monitoring, reporting financier et compatibilite avec les grands reseaux de roaming. Une plateforme pensee pour maximiser vos revenus recharge."
        evoneFeatures={evoneFeatures}
        ctaTitle="Devenez un acteur de la mobilite electrique au Maroc."
        ctaBody="Que vous exploitiez une station de services, une aire d\'autoroute ou un hub logistique, EVplug concoit et deploie votre infrastructure de recharge rapide de A a Z."
      />
    </SolutionPageLayout>
  )
}
