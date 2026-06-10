import LegalPage, { LegalSection } from './LegalPage'

const SITE = 'www.evplug.com'
const SITE_URL = 'https://www.evplug.com'

const ARTICLES = [
  {
    id: 'art-1',
    title: 'Article 1 – Objet',
    body: (
      <p className="m-0">
        Les présentes Conditions Générales d’Utilisation et de Vente (CGUV) régissent les modalités d’adhésion et
        d’utilisation du Programme d’abonnement EVplug. En adhérant au Programme, le Client accepte sans réserve les
        termes des présentes CGUV.
      </p>
    ),
  },
  {
    id: 'art-2',
    title: 'Article 2 – Adhésion au Programme d’abonnement',
    body: (
      <>
        <p>
          Pour devenir Adhérent au Programme d’abonnement EVplug, le Client doit exprimer son acceptation en cliquant
          sur l’onglet «&nbsp;J’AI LU ET J’ACCEPTE LES CONDITIONS GÉNÉRALES D’UTILISATION ET DE VENTE EVPLUG&nbsp;» lors
          de son inscription sur le site web.
        </p>
        <p>
          En acceptant ces conditions, l’Adhérent consent automatiquement au traitement de ses Données à caractère
          personnel et approuve la Politique de Confidentialité du Programme disponible sur le Site Internet{' '}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE}
          </a>
          .
        </p>
        <p>
          L’inscription est libre et gratuite, sans contrainte préalable de la part de l’Organisateur ou des
          Partenaires, hormis les exigences légales d’éligibilité.
        </p>
        <p>
          En acceptant les CGUV, l’Adhérent confirme être majeur, avoir la capacité juridique nécessaire pour conclure
          un contrat, et garantit l’exactitude des informations fournies lors de son inscription.
        </p>
        <p>
          Il incombe à l’Adhérent de maintenir à jour ses informations personnelles et de notifier toute modification,
          assurant ainsi l’exactitude des données fournies.
        </p>
        <p className="m-0">
          Une fois les CGUV acceptées, l’Adhérent reçoit un code d’authentification par e-mail ou SMS sur son numéro de
          téléphone mobile ou son adresse e-mail fournis lors de l’inscription. Ce code doit être conservé confidentiel
          et ne doit pas être partagé.
        </p>
      </>
    ),
  },
  {
    id: 'art-3',
    title: 'Article 3 – Réseau de partenaires affiliés au Programme',
    body: (
      <>
        <p>
          Conformément au Contrat d’Affiliation, chaque Partenaire approuve les Adhérents EVplug lors du règlement de la
          location de bornes de recharge effectuée par un Adhérent dans ses points de vente. La liste des Partenaires
          affiliés à EVplug est accessible sur le Site Internet{' '}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE}
          </a>
          .
        </p>
        <p className="m-0">
          L’Organisateur se réserve le droit de mettre à jour cette liste à tout moment, et il est recommandé à
          l’Adhérent de consulter régulièrement les mises à jour sur le Site Internet{' '}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'art-4',
    title: 'Article 4 – Accès au Programme d’abonnement',
    body: (
      <>
        <p>
          L’adhésion au Programme d’abonnement est conclue pour une durée indéterminée, sauf dispositions contraires des
          CGUV. Toutefois, l’Organisateur peut vérifier les informations fournies et invalider une adhésion sans
          justification, si les conditions requises ne sont pas remplies.
        </p>
        <p>
          L’accès au Programme est matérialisé par la connexion au Compte via le Site Internet{' '}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE}
          </a>
          , suivie de l’attribution d’un identifiant unique communiqué par e-mail ou SMS.
        </p>
        <p className="m-0">
          L’Adhérent est informé des tarifs de bornes de recharge fixés par EVplug selon la formule d’adhésion choisie.
          Il est invité à consulter régulièrement les offres de tarification accessibles sur le Site Internet{' '}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'art-5',
    title: 'Article 5 – Fonctionnement du Programme',
    body: (
      <>
        <h3 className="legal-subheading">5.1 Location de bornes de recharge</h3>
        <p>
          La location de bornes de recharge permet à l’Adhérent de disposer de bornes de recharge pour véhicules
          électriques selon les modalités définies par le Programme EVplug.
        </p>

        <h3 className="legal-subheading">5.2 Passation d’une commande</h3>
        <p>
          Les étapes pour passer une commande sont détaillées comme suit : inscription sur le Site Internet {SITE},
          sélection du type de borne de recharge et du mode de paiement, paiement en ligne sécurisé, réception d’une
          confirmation de commande par e-mail ou SMS.
        </p>

        <h3 className="legal-subheading">5.3 Prix, disponibilité des services</h3>
        <p>
          Les prix des bornes de recharge EVplug sont affichés sur le Site Internet {SITE} et sont indiqués en Dirhams,
          toutes taxes comprises. Les commandes sont acceptées dans la limite de la disponibilité des bornes, mise à
          jour sur le Site Internet.
        </p>

        <h3 className="legal-subheading">5.4 Droit de rétractation</h3>
        <p className="m-0">
          Conformément à la loi, le Client dispose d’un délai de rétractation de sept (7) jours. Pour exercer ce droit,
          le Client doit envoyer le formulaire de rétractation disponible sur le Site Internet {SITE}. Le Client ne peut
          exercer son droit de rétractation pour les services totalement exécutés ou dont l’exécution a commencé avant
          l’expiration du délai.
        </p>
      </>
    ),
  },
  {
    id: 'art-6',
    title: 'Article 6 – Obligations de l’Adhérent',
    body: (
      <>
        <p>En adhérant au Programme EVplug, l’Adhérent s’engage à :</p>
        <ul className="m-0">
          <li>Utiliser les bornes de recharge conformément aux règles et instructions du Programme.</li>
          <li>Payer les frais de location des bornes de recharge selon les modalités convenues.</li>
          <li>Maintenir la confidentialité de son identifiant unique et ne pas le divulguer à des tiers.</li>
          <li>Mettre à jour ses informations personnelles en cas de changement.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'art-7',
    title: 'Article 7 – Responsabilités de l’Organisateur',
    body: (
      <>
        <p>EVplug s’engage à :</p>
        <ul className="m-0">
          <li>Mettre à disposition des bornes de recharge fonctionnelles et conformes.</li>
          <li>Assurer le bon fonctionnement du Programme EVplug dans la mesure du possible.</li>
          <li>Traiter les données personnelles des Adhérents conformément à la législation en vigueur.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'art-8',
    title: 'Article 8 – Modifications des CGUV',
    body: (
      <p className="m-0">
        L’Organisateur se réserve le droit de modifier les présentes CGUV à tout moment, sous réserve d’en informer
        préalablement les Adhérents par e-mail ou via le Site Internet {SITE}. Les modifications entrent en vigueur à la
        date de leur publication.
      </p>
    ),
  },
  {
    id: 'art-9',
    title: 'Article 9 – Durée et résiliation',
    body: (
      <p className="m-0">
        L’adhésion au Programme EVplug est conclue pour une durée indéterminée, sauf résiliation par l’une des parties.
        En cas de non-respect des CGUV par l’Adhérent, l’Organisateur se réserve le droit de résilier son adhésion sans
        préavis.
      </p>
    ),
  },
  {
    id: 'art-10',
    title: 'Article 10 – Loi applicable et juridiction compétente',
    body: (
      <p className="m-0">
        Les présentes CGUV sont régies par le droit marocain. Tout litige relatif à l’interprétation ou à l’exécution
        des CGUV relève de la compétence exclusive des tribunaux de Casablanca.
      </p>
    ),
  },
  {
    id: 'art-11',
    title: 'Article 11 – Dispositions finales',
    body: (
      <p className="m-0">
        En acceptant les présentes CGUV, l’Adhérent reconnaît avoir pris connaissance de l’ensemble des dispositions et
        les accepter sans réserve. Toutefois, toute disposition contraire ou additionnelle ne fait pas partie des
        présentes CGUV et doit faire l’objet d’un accord écrit entre les parties.
      </p>
    ),
  },
  {
    id: 'art-12',
    title: 'Article 12 – Protection des données personnelles',
    body: (
      <>
        <p>
          En acceptant les présentes CGUV, l’Adhérent autorise l’Organisateur à traiter ses données personnelles,
          telles que son nom, prénom, adresse e-mail, genre et ville de résidence, dans le but de permettre l’accès et
          l’utilisation du Programme EVplug, ainsi que pour la fourniture et la gestion des services offerts. L’Adhérent
          consent également à l’utilisation de ses données à des fins d’analyses, d’enquêtes commerciales et de
          marketing, ainsi qu’à la réception d’informations personnalisées et d’offres promotionnelles par tout moyen de
          communication à distance.
        </p>
        <p className="m-0">
          Conformément à la législation en vigueur, l’Adhérent dispose d’un droit d’accès, de rectification et
          d’opposition concernant ses données personnelles. Pour exercer ces droits, l’Adhérent peut contacter Afri
          Mobility SA à l’adresse indiquée sur le site web {SITE}.
        </p>
      </>
    ),
  },
  {
    id: 'art-13',
    title: 'Article 13 – Force majeure et loi applicable',
    body: (
      <>
        <h3 className="legal-subheading">13.1 Force majeure</h3>
        <p>
          EVplug ainsi que ses Partenaires ne pourront pas être tenus responsables en cas de manquement ou de retard
          dans l’exécution de l’une de ses obligations envers l’Adhérent si ce manquement ou retard est dû à un cas de
          force majeure.
        </p>

        <h3 className="legal-subheading">13.2 Définition</h3>
        <p>
          Un cas de force majeure signifie tout acte ou événement en dehors de notre contrôle tels que les cas énoncés
          par les articles 268 et 269 du Dahir portant Code des Obligations et des Contrats, et par la jurisprudence
          marocaine, comprenant notamment : toute guerre, insurrection, émeute, épidémie, troubles civils, catastrophe
          naturelle, accident, incendie, inondation, explosion, panne mécanique, panne informatique ou toute panne de
          système ou panne de matériel, toute panne ou un dysfonctionnement de tout moyen de communication quelle qu’en
          soit la raison, toute interruption (totale ou partielle) de fourniture électrique ou d’autres fournitures de
          services, toute grève ou arrêt de travail (total ou partiel), contentieux commerciaux, toute loi, règlement ou
          ordonnance promulgué par un État ou un organe gouvernemental, pannes des réseaux publics ou privés de
          télécommunication ou de transport ou toute autre cause ou circonstance échappant à notre contrôle.
        </p>

        <h3 className="legal-subheading">13.3 Loi applicable et compétence juridictionnelle</h3>
        <p>Les présentes CGUV sont régies par le droit marocain.</p>

        <h3 className="legal-subheading">13.4 Accord amiable</h3>
        <p>
          Les parties tenteront de régler amiablement toutes difficultés d’interprétation, d’exécution et tous
          différends relatifs aux présentes CGUV et plus généralement à l’accès à l’Application et aux avantages offerts
          par le Programme EVplug.
        </p>

        <h3 className="legal-subheading">13.5 Délai de règlement amiable</h3>
        <p className="m-0">
          Dans l’hypothèse où aucun accord amiable n’a pu être trouvé dans un délai de trente (30) jours de la naissance
          du litige, les différends relèveront de la compétence exclusive des tribunaux de Casablanca, ce que l’Adhérent
          reconnaît et accepte.
        </p>
      </>
    ),
  },
]

export default function TermsAndConditions() {
  return (
    <LegalPage
      documentTitle="Conditions générales | EVplug"
      breadcrumb="Conditions générales"
      title="Conditions générales"
      intro={
        <p className="m-0" style={{ color: '#333333' }}>
          Conditions Générales d’Utilisation et de Vente (CGUV) du Programme d’abonnement EVplug.
        </p>
      }
    >
      {ARTICLES.map((article) => (
        <LegalSection key={article.id} title={article.title}>
          {article.body}
        </LegalSection>
      ))}
    </LegalPage>
  )
}
