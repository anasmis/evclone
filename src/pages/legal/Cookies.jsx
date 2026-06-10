import LegalPage, { LegalSection } from './LegalPage'

const COOKIE_TYPES = [
  {
    name: 'Cookies techniques',
    role: 'Nécessaires au bon fonctionnement technique du site et à la sécurité de la navigation.',
    consent: 'Toujours actifs',
  },
  {
    name: 'Cookies fonctionnels',
    role: 'Mémorisent vos préférences (langue, paramètres d’affichage) pour améliorer votre confort d’utilisation.',
    consent: 'Toujours actifs',
  },
  {
    name: 'Cookies analytiques',
    role: 'Nous aident à mesurer l’audience et à optimiser le site. Ils ne portent pas atteinte à votre vie privée.',
    consent: 'Anonymisés',
  },
]

export default function Cookies() {
  return (
    <LegalPage
      documentTitle="Politique de cookies | EVplug"
      breadcrumb="Cookies"
      title="Politique de cookies"
      intro={
        <p className="m-0" style={{ color: '#333333' }}>
          Cette politique explique comment EVplug utilise les cookies et technologies similaires sur le Site Internet{' '}
          <a href="https://www.evplug.ma" target="_blank" rel="noopener noreferrer">
            www.evplug.ma
          </a>
          . Elle complète notre{' '}
          <a href="/legal/privacy-and-cookies-policy">politique de confidentialité</a>.
        </p>
      }
    >
      <LegalSection title="Qu’est-ce qu’un cookie ?">
        <p className="m-0">
          Un cookie est un petit fichier texte stocké sur votre ordinateur, tablette ou smartphone lors de votre
          première visite sur ce site web. Il permet au site de reconnaître votre appareil et de mémoriser certaines
          informations sur votre visite.
        </p>
      </LegalSection>

      <LegalSection title="Les cookies que nous utilisons">
        <p>
          EVplug utilise uniquement des cookies techniques et fonctionnels, ainsi que des cookies analytiques qui ne
          portent pas atteinte à votre vie privée. Ces cookies sont nécessaires au bon fonctionnement technique du site
          web et à votre confort d’utilisation. Ils veillent au bon fonctionnement du site, se souviennent de vos
          paramètres préférés et nous permettent d’optimiser notre site web.
        </p>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Type de cookie</th>
                <th>Rôle</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {COOKIE_TYPES.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td>
                  <td>{c.role}</td>
                  <td>{c.consent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="Gérer ou supprimer les cookies">
        <p className="m-0">
          Vous pouvez vous désabonner des cookies en configurant votre navigateur Internet pour qu’il n’enregistre plus
          de cookies. Vous pouvez également supprimer toutes les informations précédemment enregistrées via les
          paramètres de votre navigateur. Le blocage de certains cookies peut toutefois affecter le bon fonctionnement
          de certaines parties du site.
        </p>
      </LegalSection>

      <LegalSection title="Nous contacter">
        <p className="m-0">
          Pour toute question relative à cette politique de cookies, vous pouvez nous écrire à{' '}
          <a href="mailto:support@evplug.com">support@evplug.com</a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
