import LegalPage, { LegalSection } from './LegalPage'

export default function RetoursRemboursements() {
  return (
    <LegalPage
      documentTitle="Retours et remboursements | EVplug"
      breadcrumb="Retours et remboursements"
      title="Retours et remboursements"
      intro={
        <p className="m-0" style={{ color: '#333333' }}>
          Cette page précise les modalités de rétractation, de retour et de remboursement applicables aux commandes
          passées sur le Site Internet{' '}
          <a href="https://www.evplug.ma" target="_blank" rel="noopener noreferrer">
            www.evplug.ma
          </a>
          . Elle complète nos <a href="/general-terms-and-conditions">conditions générales</a>.
        </p>
      }
    >
      <LegalSection title="Droit de rétractation">
        <p className="m-0">
          Conformément à la loi, le Client dispose d’un délai de rétractation de sept (7) jours à compter de la
          réception de sa commande. Le Client ne peut exercer son droit de rétractation pour les services totalement
          exécutés, ou dont l’exécution a commencé avec son accord avant l’expiration du délai.
        </p>
      </LegalSection>

      <LegalSection title="Comment exercer votre droit de rétractation">
        <p>Pour exercer ce droit, le Client doit :</p>
        <ul className="m-0">
          <li>
            Compléter le formulaire de rétractation disponible sur le Site Internet, ou nous adresser une demande claire
            par e-mail.
          </li>
          <li>
            Indiquer le numéro de commande, le nom de l’Adhérent et l’adresse e-mail utilisés lors de l’inscription.
          </li>
          <li>
            Envoyer votre demande à <a href="mailto:support@evplug.ma">support@evplug.ma</a> dans le délai de sept (7)
            jours.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Conditions de retour du matériel">
        <p className="m-0">
          Lorsque la commande porte sur du matériel (carte ou clé de recharge, équipement), celui-ci doit être retourné
          complet, dans son emballage d’origine et en parfait état. Les frais de retour restent à la charge du Client,
          sauf en cas de produit défectueux ou d’erreur de notre part.
        </p>
      </LegalSection>

      <LegalSection title="Remboursement">
        <p className="m-0">
          Après réception et vérification du retour, EVplug procède au remboursement des sommes dûment versées, en
          Dirhams, par le même moyen de paiement que celui utilisé lors de la commande. Le remboursement intervient dans
          les meilleurs délais à compter de l’acceptation de la rétractation.
        </p>
      </LegalSection>

      <LegalSection title="Nous contacter">
        <p className="m-0">
          Pour toute question relative à un retour ou un remboursement, contactez notre équipe support à{' '}
          <a href="mailto:support@evplug.ma">support@evplug.ma</a> ou au{' '}
          <a href="tel:+212521335075">05 21 33 50 75</a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
