import LegalPage, { LegalSection } from './LegalPage'

const SECTIONS = [
  {
    id: 'responsable',
    title: 'Responsable du traitement',
    body: (
      <>
        <p>
          EVPLUG est responsable du traitement des données personnelles telles que décrites dans cette déclaration de
          confidentialité.
        </p>
        <p className="m-0">
          <strong>Coordonnées :</strong>
          <br />
          <a href="https://www.evplug.ma" target="_blank" rel="noopener noreferrer">
            https://www.evplug.ma
          </a>
          <br />
          Boulevard Zoulikha Nasri, Florida Center Park 2, Étage 2, Bureau N23, Sidi Maarouf, Casablanca
          <br />
          Fixe : <a href="tel:+212520003120">+212 5 20 00 31 20</a>
          <br />
          Mobile : <a href="tel:+212665254905">+212 6 65 25 49 05</a>
          <br />
          Support : <a href="mailto:support@evplug.com">support@evplug.com</a>
        </p>
      </>
    ),
  },
  {
    id: 'donnees-traitees',
    title: 'Données personnelles que nous traitons',
    body: (
      <>
        <p>
          EVPLUG traite vos données personnelles lorsque vous utilisez nos services et/ou lorsque vous les fournissez
          vous-même. Voici un aperçu des données personnelles que nous traitons :
        </p>
        <ul>
          <li>Prénom et nom de famille</li>
          <li>Sexe</li>
          <li>Coordonnées (adresse, numéro de téléphone, adresse e-mail)</li>
          <li>Navigateur Internet et type d’appareil</li>
          <li>Numéro de compte bancaire</li>
        </ul>
        <p className="m-0">
          EVPLUG ne collecte pas sciemment des données sur les visiteurs de sites web de moins de 16 ans. Nous
          recommandons aux parents de s’impliquer dans les activités en ligne de leurs enfants pour éviter la collecte
          de données sans autorisation parentale. Si vous pensez que nous avons collecté des données personnelles sur
          un mineur sans cette autorisation, veuillez nous contacter à{' '}
          <a href="mailto:support@evplug.com">support@evplug.com</a> pour que nous puissions supprimer ces informations.
        </p>
      </>
    ),
  },
  {
    id: 'objectifs',
    title: 'Objectifs et base légale du traitement',
    body: (
      <>
        <p>EVPLUG traite vos données personnelles pour les objectifs suivants :</p>
        <ul className="m-0">
          <li>Traitement de vos paiements</li>
          <li>Envoi de notre newsletter</li>
          <li>Possibilité de vous appeler ou de vous envoyer un e-mail si nécessaire pour exécuter nos services</li>
          <li>Livraison de biens et services à votre adresse</li>
        </ul>
      </>
    ),
  },
  {
    id: 'decisions-automatisees',
    title: 'Décisions automatisées',
    body: (
      <p className="m-0">
        EVPLUG prend des décisions automatisées sur des questions qui peuvent avoir des conséquences (significatives)
        pour les personnes. Il s’agit de décisions prises par des programmes informatiques ou des systèmes, sans
        l’intervention d’une personne (par exemple, un employé de test). EVPLUG utilise les programmes ou systèmes
        informatiques suivants : WordPress Plugin Woocommerce, pour les commandes en ligne de clés de charge, et
        Reviews Ultimated, pour recueillir des avis. Ces systèmes n’auront pas de conséquences futures pour la personne
        concernée.
      </p>
    ),
  },
  {
    id: 'conservation',
    title: 'Durée de conservation',
    body: (
      <p className="m-0">
        EVPLUG ne conserve pas vos données personnelles plus longtemps que nécessaire pour atteindre les objectifs pour
        lesquels elles sont collectées.
      </p>
    ),
  },
  {
    id: 'partage',
    title: 'Partage de données personnelles avec des tiers',
    body: (
      <p className="m-0">
        EVPLUG ne fournit des informations à des tiers que si cela est nécessaire pour l’exécution de notre contrat avec
        vous ou pour se conformer à une obligation légale. EVPLUG ne vend pas vos données personnelles à des tiers.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies et technologies similaires',
    body: (
      <p className="m-0">
        EVPLUG utilise uniquement des cookies techniques et fonctionnels, ainsi que des cookies analytiques qui ne
        portent pas atteinte à votre vie privée. Un cookie est un petit fichier texte stocké sur votre ordinateur,
        tablette ou smartphone lors de votre première visite sur ce site web. Les cookies que nous utilisons sont
        nécessaires au bon fonctionnement technique du site web et à votre confort d’utilisation. Ils veillent au bon
        fonctionnement du site et se souviennent, par exemple, de vos paramètres préférés. Ils nous permettent
        également d’optimiser notre site web. Vous pouvez vous désabonner des cookies en configurant votre navigateur
        Internet pour qu’il n’enregistre plus de cookies. Vous pouvez également supprimer toutes les informations
        précédemment enregistrées via les paramètres de votre navigateur.
      </p>
    ),
  },
  {
    id: 'droits',
    title: 'Accès, correction et suppression des données',
    body: (
      <p className="m-0">
        Vous avez le droit d’accéder, de corriger ou de supprimer vos données personnelles. Vous avez également le droit
        de retirer votre consentement au traitement des données ou de vous opposer au traitement de vos données
        personnelles, ainsi que le droit à la portabilité des données. Cela signifie que vous pouvez nous demander de
        vous envoyer, ou à une autre organisation de votre choix, les données personnelles que nous détenons vous
        concernant sous forme de fichier informatique. Vous pouvez envoyer une demande d’accès, de correction, de
        suppression, de transfert de données, de retrait de votre consentement ou d’opposition au traitement de vos
        données personnelles à <a href="mailto:support@evplug.com">support@evplug.com</a>. Pour garantir que la demande
        d’accès a bien été faite par vous, nous vous demandons d’accompagner votre demande d’une copie de votre pièce
        d’identité.
      </p>
    ),
  },
]

export default function PrivacyPolicy() {
  return (
    <LegalPage
      documentTitle="Politique de confidentialité | EVplug"
      breadcrumb="Politique de confidentialité"
      title="Politique de confidentialité"
      intro={
        <>
          <p className="m-0" style={{ color: '#333333' }}>
            EVPLUG prend très au sérieux la protection de votre vie privée. Nous traitons donc vos données personnelles
            de manière confidentielle et avec le plus grand soin. Cette politique de confidentialité s’applique à toutes
            les données personnelles collectées et utilisées par EVPLUG. Ces données incluent les informations client
            que vous avez fournies, mais aussi des données sur les visites sur notre site web, les inscriptions aux
            newsletters, la participation à des campagnes ou promotions, ainsi que des données sur les sessions et points
            de charge.
          </p>
          <p className="m-0" style={{ color: '#333333' }}>
            EVPLUG utilise vos données uniquement avec votre consentement ou si EVPLUG a besoin de vos données pour vous
            fournir des produits ou services. EVPLUG ne vend pas vos données personnelles à des tiers. EVPLUG ne met les
            données à la disposition que des tiers impliqués dans l’exécution du contrat entre EVPLUG et vous. Lorsque
            EVPLUG traite vos données de toute autre manière, cela nécessite votre consentement (explicite).
          </p>
        </>
      }
    >
      {SECTIONS.map((section) => (
        <LegalSection key={section.id} title={section.title}>
          {section.body}
        </LegalSection>
      ))}
    </LegalPage>
  )
}
