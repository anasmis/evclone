import LegalPage, { LegalSection } from './LegalPage'

export default function Securite() {
  return (
    <LegalPage
      documentTitle="Sécurité | EVplug"
      breadcrumb="Sécurité"
      title="Sécurité"
      intro={
        <p className="m-0" style={{ color: '#333333' }}>
          La sécurité de nos services, de nos bornes de recharge et des données de nos clients est une priorité pour
          EVplug. Cette page explique comment nous protégeons votre vie privée et comment nous signaler une
          vulnérabilité.
        </p>
      }
    >
      <LegalSection title="Notre engagement">
        <p className="m-0">
          EVplug met en œuvre des mesures techniques et organisationnelles pour protéger ses systèmes, ses points de
          charge et les données personnelles de ses clients contre tout accès non autorisé, altération, divulgation ou
          destruction. Les données sont traitées conformément à la législation en vigueur, comme décrit dans notre{' '}
          <a href="/legal/privacy-and-cookies-policy">politique de confidentialité</a>.
        </p>
      </LegalSection>

      <LegalSection title="Signaler une vulnérabilité">
        <p>
          Si vous pensez avoir découvert une faille de sécurité dans nos services, notre site web ou nos bornes de
          recharge, nous vous invitons à nous en informer de manière responsable. Merci de :
        </p>
        <ul className="m-0">
          <li>
            Nous écrire à <a href="mailto:support@evplug.com">support@evplug.com</a> en décrivant la vulnérabilité et
            les étapes permettant de la reproduire.
          </li>
          <li>Ne pas exploiter la faille au-delà de ce qui est nécessaire pour en démontrer l’existence.</li>
          <li>Ne pas accéder, modifier ou supprimer des données qui ne vous appartiennent pas.</li>
          <li>Nous laisser un délai raisonnable pour corriger le problème avant toute divulgation publique.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Bonnes pratiques pour votre compte">
        <p className="m-0">
          Conservez votre code d’authentification et votre identifiant unique de manière confidentielle et ne les
          partagez jamais avec des tiers. En cas de doute sur la sécurité de votre compte, contactez immédiatement notre
          équipe support à <a href="mailto:support@evplug.com">support@evplug.com</a> ou au{' '}
          <a href="tel:+212521335075">05 21 33 50 75</a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
