import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../migrated/assets/layout/logo.webp'
import iconCompare from '../../migrated/assets/layout/nav/compare.svg'
import iconStandalone from '../../migrated/assets/layout/nav/standalone-charger.svg'
import iconInstallation from '../../migrated/assets/layout/nav/installation.svg'
import iconTakeTheLead from '../../migrated/assets/layout/nav/take-the-lead.svg'
import iconPluggedIn from '../../migrated/assets/layout/nav/plugged-in.svg'
import iconHome from '../../migrated/assets/layout/nav/home.svg'
import iconCharger from '../../migrated/assets/layout/nav/charger.svg'
import iconHeartSun from '../../migrated/assets/layout/nav/heart-sun.svg'
import iconTariff from '../../migrated/assets/layout/nav/tariff.svg'
import iconVehicle from '../../migrated/assets/layout/nav/vehicle.svg'
import iconInfo from '../../migrated/assets/layout/nav/info.svg'
import iconKnowledge from '../../migrated/assets/layout/nav/knowledge.svg'
import iconProfile from '../../migrated/assets/layout/nav/profile.svg'
import iconEnergy from '../../migrated/assets/layout/nav/energy.svg'

// Top nav structure:
// 3 mega-dropdowns + 2 flat links (Notre Reseau, Formation),
// plus icon action buttons (My account, Contact, Devis) in the top-right.
// Mirrors the transforms applied in the legacy home/Navbar.jsx HTML pipeline.
const NAV_ITEMS = [
  {
    label: 'Particuliers',
    children: [
      {
        icon: iconCompare,
        label: 'Comparer nos solutions de recharge',
        to: '/home/home-charging',
        description: 'Trouvez la formule adaptee a votre usage',
      },
      {
        icon: iconStandalone,
        label: 'Decouvrir notre borne intelligente',
        href: 'https://www.maborneelectrique.ma/',
        external: true,
        description: 'Notre borne primee, simple et fiable',
      },
      {
        icon: iconInstallation,
        label: 'Installation a domicile',
        to: '/installation',
        description: 'Pose realisee par des techniciens certifies EVplug',
      },
    ],
    highlight: {
      bg: '#005F41',
      icon: iconTakeTheLead,
      title: 'evplug card.',
      titleColor: '#c8d72d',
      description: 'Recharge intelligente tout inclus',
      cta: { label: 'En savoir plus', to: '/products/carte-evplug' },
    },
  },
  {
    label: 'Professionnels',
    children: [
      {
        icon: iconPluggedIn,
        label: 'Recharge en entreprise',
        to: '/solutions/entreprise',
        description: 'Equipez vos sites pour vos equipes et visiteurs',
      },
      {
        icon: iconHome,
        label: 'Coproprietes',
        to: '/solutions/copropriete',
        description: 'Recharge mutualisee pour residences et syndics',
      },
      {
        icon: iconPluggedIn,
        label: 'Hotels',
        to: '/solutions/hotels',
        description: 'Bornes pour clients et personnel, integrees a votre experience hoteliere',
      },
      {
        icon: iconCharger,
        label: 'Flottes',
        description: 'Solutions dediees aux parkings et stations-service. Choisissez votre univers :',
        links: [
          { label: 'Parkings', to: '/solutions/parkings' },
          { label: 'Stations-service', to: '/solutions/stations-service' },
        ],
      },
    ],
    highlight: {
      bg: '#c85f14',
      icon: iconHeartSun,
      title: 'Pilotez vos bornes avec EVone.',
      titleColor: '#ffdc50',
      description: 'La plateforme de gestion tout-en-un pour superviser et facturer vos sites.',
      cta: { label: 'Decouvrir EVone', to: '/solutions/evone-management-platform' },
    },
  },
  {
    label: 'Ressources',
    children: [
      {
        icon: iconInfo,
        label: 'Actualites',
        to: '/news',
        description: 'Les dernieres nouvelles de la mobilite electrique au Maroc',
      },
      {
        icon: iconTariff,
        label: 'Guides',
        to: '/guides',
        description: 'Conseils, astuces et tutoriels',
      },
      {
        icon: iconVehicle,
        label: 'Guides vehicules',
        to: '/vehicle-guides',
        description: "De l'autonomie a la recharge, tout au meme endroit",
      },
      {
        icon: iconInfo,
        label: "Centre d'aide",
        to: '/contact-us',
        description: "Besoin d'aide ? Notre equipe vous accompagne.",
      },
    ],
    highlight: {
      bg: '#c8d72d',
      icon: iconKnowledge,
      title: 'Qui sommes-nous ?',
      titleColor: '#123d33',
      textColor: '#123d33',
      cta: { label: 'A propos', to: '/about' },
      description: 'Decouvrez la mission, l’equipe et la vision EVplug Maroc.',
    },
  },
  // Flat links — no mega-dropdown
  { label: 'Notre Reseau', to: '/reseau' },
  {
    label: 'Formation',
    children: [
      {
        icon: iconInstallation,
        label: 'Formation installateurs',
        to: '/training/electricians',
        description: 'Certification EVplug pour electriciens : niveaux, calendrier et garantie 5 ans.',
      },
      {
        icon: iconProfile,
        label: 'Formations entreprises',
        to: '/training/corporate',
        description: 'Programmes sur mesure pour equipes techniques, HSE et operations.',
      },
    ],
    highlight: {
      bg: '#0a1f1a',
      icon: iconEnergy,
      title: 'APIME.',
      titleColor: '#ffdc50',
      textColor: '#ffdc50',
      ctaColor: '#ffdc50',
      description: "EVplug, vice-president de l'APIME : decouvrez notre contribution a la mobilite electrique au Maroc.",
      cta: { label: 'Notre role a l’APIME', to: '/about/apime' },
    },
  },
]


function splitIntoColumns(children) {
  if (children.length <= 1) return [children]
  const mid = Math.ceil(children.length / 2)
  return [children.slice(0, mid), children.slice(mid)]
}

function SubmenuLink({ child, onNavigate }) {
  const className = 'submenu-item-block'
  const inner = (
    <>
      {child.icon && (
        <div className="menu-item-icon">
          <img loading="lazy" width="960" src={child.icon} alt="" className="img-fluid" />
        </div>
      )}
      <div className="submenu-block">
        <span className="nav-link">{child.label}</span>
        {child.description && (
          <span className="menu-item-description">
            <p>{child.description}</p>
          </span>
        )}
        {child.links && (
          <div className="submenu-sublinks">
            {child.links.map((l) => (
              <Link key={l.to} to={l.to} className="submenu-sublink" onClick={onNavigate}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
  if (child.links) {
    return (
      <div className={className}>{inner}</div>
    )
  }
  if (child.external) {
    return (
      <a href={child.href} className={className} target="_blank" rel="noopener noreferrer" tabIndex={0} onClick={onNavigate}>
        {inner}
      </a>
    )
  }
  return (
    <Link to={child.to} className={className} tabIndex={0} onClick={onNavigate}>
      {inner}
    </Link>
  )
}

function HighlightBox({ highlight, onNavigate }) {
  return (
    <div className="megamenu-column megamenu-column--image">
      <div
        className="megamenu-box"
        style={{
          background: highlight.bg,
          '--mm-title': highlight.titleColor || '#c8d72d',
          '--mm-text': highlight.textColor || '#ffffff',
          '--mm-cta': highlight.ctaColor || '#ffdc50',
        }}
      >
        {highlight.icon && (
          <div className="icon">
            <img loading="lazy" width="960" src={highlight.icon} alt="" className="img-fluid" />
          </div>
        )}
        <div className="grid gap-spacing-sm grid-flow-row">
          <div className="grid gap-spacing-sm">
            <h4
              className="font-PosterCutNeue font-2xl xl:font-5xl text-lime font-normal"
              style={{ color: highlight.titleColor || '#c8d72d' }}
            >
              {highlight.title}
            </h4>
            {highlight.description && (
              <div className="font-lg font-bold" style={{ color: highlight.textColor || '#ffffff' }}>
                <p>{highlight.description}</p>
              </div>
            )}
          </div>
          {highlight.cta && (
            <div className="flex mega-menu-cta">
              <Link
                to={highlight.cta.to}
                onClick={onNavigate}
                style={highlight.ctaColor ? { color: highlight.ctaColor } : undefined}
              >
                {highlight.cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Megamenu({ item, onNavigate }) {
  const columns = item.children ? splitIntoColumns(item.children) : []
  return (
    <div className="megamenu">
      <div className="megamenu-columns">
        {columns.map((colItems, ci) => (
          <div key={ci} className="megamenu-column">
            <ul>
              {colItems.map((child) => (
                <li key={child.label} className="nav-item">
                  <SubmenuLink child={child} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        {item.highlight && <HighlightBox highlight={item.highlight} onNavigate={onNavigate} />}
      </div>
    </div>
  )
}

function NavbarInner() {
  const [openIndex, setOpenIndex] = useState(-1)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSubIndex, setMobileSubIndex] = useState(-1)

  const closeAll = useCallback(() => {
    setOpenIndex(-1)
    setMobileOpen(false)
    setMobileSubIndex(-1)
  }, [])

  // Toggle body.megamenu-active when any desktop megamenu is open.
  useEffect(() => {
    if (openIndex >= 0) document.body.classList.add('megamenu-active')
    else document.body.classList.remove('megamenu-active')
    return () => document.body.classList.remove('megamenu-active')
  }, [openIndex])

  // ESC closes everything.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeAll()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeAll])

  // Lock body scroll while mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  return (
    <header role="banner" className="header-section z-30 top-0">
      <nav className="bg-white navbar navbar-expand-lg navbar-dark text-light bg-dark">
        <div
          id="mobile-menu-main"
          className={`container-max-width-desktop container-max-width-tablet p-spacing-xl md:pt-spacing-3xl md:px-spacing-4xl xl:pt-spacing-3xl pb-spacing-none xl:px-spacing-7xl mx-auto${
            mobileOpen ? ' open' : ''
          }`}
        >
          <div className="bg-black rounded-2xl xl:px-spacing-7xl px-spacing-4xl xl:py-spacing-none py-spacing-xl md:py-spacing-3xl w-full relative header-section-inner">
            <div className="grid grid-flow-col items-center">
              <div className="grid gap-spacing-5xl items-center grid-flow-col xl:justify-start justify-between">
                <div className="logo w-[45px] h-[45px]">
                  <Link to="/" aria-label="EVplug Maroc" onClick={closeAll}>
                    <img src={logo} alt="EVplug Maroc" className="img-fluid" />
                  </Link>
                </div>

                <div className="navbar-collapse" id="navbarSupportedContent">
                  <div className="desktop-menu">
                    <ul data-region="nav_main" data-block="nav_main" className="nav navbar-nav">
                      {NAV_ITEMS.map((item, idx) => {
                        const hasChildren = !!item.children
                        const isOpen = openIndex === idx
                        return (
                          <li
                            key={item.label}
                            className={`nav-item${isOpen ? ' megamenu-open' : ''}`}
                            onMouseEnter={() => hasChildren && setOpenIndex(idx)}
                            onMouseLeave={() => hasChildren && setOpenIndex(-1)}
                          >
                            {hasChildren ? (
                              <span
                                className="nav-link dropdown-toggle"
                                role="button"
                                tabIndex={0}
                                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    setOpenIndex(isOpen ? -1 : idx)
                                  }
                                }}
                                aria-expanded={isOpen}
                                aria-haspopup="true"
                              >
                                {item.label}
                              </span>
                            ) : (
                              <Link to={item.to} className="nav-link" onClick={closeAll}>
                                {item.label}
                              </Link>
                            )}
                            {hasChildren && <Megamenu item={item} onNavigate={closeAll} />}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="top-right-block evplug-nav-actions">
                <a
                  href="https://myaccount.evplug.ma/authentication/login"
                  className="evplug-icon-btn"
                  aria-label="My account"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M20 20a8 8 0 1 0-16 0"/></svg>
                  <span className="sr-only">My account</span>
                </a>
                <Link to="/contact-us" className="evplug-icon-btn" aria-label="Contact" onClick={closeAll}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-4 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z"/></svg>
                  <span className="sr-only">Contact</span>
                </Link>
              </div>

              {/* Burger — only shown < xl */}
              <button
                type="button"
                className="xl:hidden ml-auto w-11 h-11 rounded-full text-white flex items-center justify-center hover:bg-white/10 transition"
                aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'} text-xl`} />
              </button>
            </div>
          </div>

          {/* Mobile slide-out menu */}
          <div id="mobile-menu" className="xl:hidden z-50 slide-menu shadow-lg">
            <div className="mobile-menu">
              <div className="region region-nav-main">
                <ul
                  data-region="nav_main"
                  data-block="nav_main"
                  className={`nav navbar-nav${mobileSubIndex >= 0 ? ' sidebar-open' : ''}`}
                >
                  {NAV_ITEMS.map((item, idx) => {
                    const hasChildren = !!item.children
                    const isOpenMobile = mobileSubIndex === idx
                    return (
                      <li key={item.label} className={`nav-item${isOpenMobile ? ' open-sidebar' : ''}`}>
                        {hasChildren ? (
                          <span
                            className={`nav-link dropdown-toggle${isOpenMobile ? ' active' : ''}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => setMobileSubIndex(isOpenMobile ? -1 : idx)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setMobileSubIndex(isOpenMobile ? -1 : idx)
                              }
                            }}
                            aria-expanded={isOpenMobile}
                          >
                            {item.label}
                          </span>
                        ) : (
                          <Link to={item.to} className="nav-link" onClick={closeAll}>
                            {item.label}
                          </Link>
                        )}
                        {hasChildren && (
                          <div className="megamenu">
                            <div className="megamenu-columns">
                              <div
                                className="mobile-back-btn md:hidden"
                                role="button"
                                tabIndex={0}
                                onClick={() => setMobileSubIndex(-1)}
                              >
                                <span className="back-arrow font-semibold font-lg pl-spacing-4xl">
                                  <i className="fa-solid fa-angle-left mr-2" />
                                  Retour
                                </span>
                              </div>
                              <div className="megamenu-column">
                                <ul>
                                  {item.children.map((child) => (
                                    <li key={child.label} className="nav-item">
                                      <SubmenuLink child={child} onNavigate={closeAll} />
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {item.highlight && <HighlightBox highlight={item.highlight} onNavigate={closeAll} />}
                            </div>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="evplug-mobile-actions">
                <a
                  href="https://myaccount.evplug.ma/authentication/login"
                  className="evplug-mobile-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M20 20a8 8 0 1 0-16 0"/></svg>
                  <span className="label">My account</span>
                </a>
                <Link to="/contact-us" className="evplug-mobile-btn" onClick={closeAll}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-4 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z"/></svg>
                  <span className="label">Contact</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default function Navbar() {
  const location = useLocation()
  return <NavbarInner key={location.pathname} />
}
