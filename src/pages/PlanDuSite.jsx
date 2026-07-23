import { Link } from 'react-router-dom'
import MirrorShell from './MirrorShell'
import Breadcrumb from '../components/sections/Breadcrumb'

const SITEMAP = [
  {
    title: 'Accueil',
    links: [{ label: 'Page d’accueil', to: '/' }],
  },
  {
    title: 'Particuliers',
    links: [
      { label: 'Recharge à domicile', to: '/home/home-charging' },
      { label: 'Installation', to: '/installation' },
      { label: 'Carte EVplug', to: '/products/carte-evplug' },
    ],
  },
  {
    title: 'Professionnels',
    links: [
      { label: 'Entreprise', to: '/solutions/entreprise' },
      { label: 'Copropriété', to: '/solutions/copropriete' },
      { label: 'Parkings', to: '/solutions/parkings' },
      { label: 'Hôtels', to: '/solutions/hotels' },
      { label: 'Stations-service', to: '/solutions/stations-service' },
      { label: 'Plateforme EVone', to: '/solutions/evone-management-platform' },
    ],
  },
  {
    title: 'Conseils & ressources',
    links: [
      { label: 'Notre réseau', to: '/reseau' },
      { label: 'Guides', to: '/guides' },
      { label: 'Actualités', to: '/news' },
      { label: 'Guides véhicules', to: '/vehicle-guides' },
    ],
  },
  {
    title: 'Formation',
    links: [
      { label: 'Centre de formation', to: '/training' },
      { label: 'Formation installateurs', to: '/training/electricians' },
      { label: 'Formation entreprises', to: '/training/corporate' },
      { label: 'Simulateur de recharge', to: '/training/simulator' },
    ],
  },
  {
    title: 'À propos',
    links: [
      { label: 'À propos d’EVplug', to: '/about' },
      { label: 'APIME', to: '/about/apime' },
      { label: 'Contactez-nous', to: '/contact-us' },
    ],
  },
  {
    title: 'Informations légales',
    links: [
      { label: 'Conditions générales', to: '/general-terms-and-conditions' },
      { label: 'Politique de confidentialité', to: '/legal/privacy-and-cookies-policy' },
      { label: 'Cookies', to: '/legal/cookies-policy' },
      { label: 'Retours et remboursements', to: '/legal/returns-and-refunds' },
      { label: 'Sécurité', to: '/security' },
    ],
  },
]

export default function PlanDuSite() {
  return (
    <MirrorShell documentTitle="Plan du site | EVplug">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Plan du site" />

            <section className="legal-page">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-4xl pb-spacing-7xl">
                <header className="grid gap-spacing-2xl mb-spacing-4xl">
                  <h1 className="font-TTCommons m-0" style={{ color: '#000000' }}>
                    Plan du site
                  </h1>
                  <p className="m-0" style={{ color: '#333333' }}>
                    Retrouvez l’ensemble des pages du site EVplug Maroc, organisées par thématique.
                  </p>
                </header>

                <div className="sitemap-grid">
                  {SITEMAP.map((group) => (
                    <nav key={group.title} className="sitemap-group" aria-label={group.title}>
                      <h2 className="sitemap-group__title">{group.title}</h2>
                      <ul className="sitemap-group__list">
                        {group.links.map((link) => (
                          <li key={link.to}>
                            <Link to={link.to} className="sitemap-link">
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}
