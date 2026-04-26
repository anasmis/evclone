import SolutionPageLayout from './SolutionPageLayout'
import SolutionTemplate from './SolutionTemplate'

const ICONS = '/assets/podenergy.com/sites/default/files'

const services = [
  {
    icon: '2025-10/charger.svg',
    title: 'Etude electrique collective',
    description:
      'Diagnostic de votre tableau commun, analyse de la capacite disponible et plan d\'equipement progressif selon le nombre de residents interesses.',
  },
  {
    icon: '2025-11/standalone-charger.svg',
    title: 'Bornes AC individuelles',
    description:
      'Bornes dediees par place de parking resident, adaptees a la recharge nocturne. Installation soignee sans travaux lourds sur les parties communes.',
  },
  {
    icon: '2025-11/Send-feedback.svg',
    title: 'SAV & Maintenance',
    description:
      'Suivi technique et interventions rapides pour l\'ensemble de la copropriete. Un seul interlocuteur pour le syndic, une fiabilite maximale pour les residents.',
  },
  {
    icon: '2025-11/Charging Duration.svg',
    title: 'Facturation individuelle',
    description:
      'Chaque resident est facture a sa consommation reelle. Aucune mutualisation des couts, transparence totale et rapports mensuels par resident.',
  },
  {
    icon: '2025-10/installation.svg',
    title: 'Accompagnement syndic',
    description:
      'EVplug accompagne le syndic dans les demarches : aide a la preparation de l\'AG, dossiers techniques et administratifs, coordination avec les prestataires.',
  },
  {
    icon: '2025-11/Dashboard.svg',
    title: 'Plateforme Evone Copropriete',
    description:
      'Interface dediee au syndic : etat des bornes, consommations par resident, facturation automatique et historique d\'interventions accessibles a tout moment.',
  },
]

const evoneFeatures = [
  'Tableau de bord syndic : etat global de toutes les bornes de la copropriete',
  'Facturation individuelle automatique par resident chaque mois',
  'Suivi des consommations en kWh et en dirhams par place',
  'Historique complet des sessions de charge et des interventions techniques',
  'Ajout ou suppression d\'un resident en quelques clics',
  'Notifications automatiques en cas d\'anomalie ou de panne',
]

export default function Copropriete() {
  return (
    <SolutionPageLayout documentTitle="EVplug Copropriete | Recharge electrique en residence au Maroc">
      <SolutionTemplate
        tag="EV Copropriete"
        heroTitle="La recharge electrique pour votre residence, simple et equitable."
        heroSubtitle="EVplug equipe votre copropriete de bornes individuelles, gere la facturation par resident et accompagne le syndic de l'etude au quotidien. Sans mutualisation des couts, sans complications."
        heroImage={`${ICONS}/2025-11/CRS09462.jpg`}
        storyImage={`${ICONS}/2025-11/CRS09261.jpg`}
        platformImage={`${ICONS}/2025-11/CRS09749_0.jpg`}
        heroCta="Etudier votre projet"
        services={services}
        imagePanel1Title="Une solution progressive, sans engagement collectif"
        imagePanel1Body="L'installation commence avec les residents interesses et s'etend au rythme des adhesions. Chaque borne est independante, la facturation est individuelle. La copropriete n'est jamais exposee a des frais collectifs non prevus."
        evoneBadge="Plateforme Evone Copropriete"
        evoneTitle="Le syndic gere tout depuis une seule interface."
        evoneSubtitle="Evone Copropriete donne au syndic la visibilite et les outils pour administrer l'ensemble des bornes de la residence : consommations, facturation individuelle et suivi technique, sans competences particulieres."
        evoneFeatures={evoneFeatures}
        ctaTitle="Equipez votre copropriete en recharge electrique."
        ctaBody="De l'etude de faisabilite electrique au vote en AG, en passant par l'installation et l'exploitation, EVplug gere l'integralite du projet pour votre copropriete."
      />
    </SolutionPageLayout>
  )
}
