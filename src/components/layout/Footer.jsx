import { Link } from 'react-router-dom'
import logo from '../../migrated/assets/layout/footer-logo.webp'

const COLUMNS = [
  {
    title: 'À propos',
    links: [
      { label: "À propos d'EVplug", to: '/about' },
      { label: 'News', to: '/news' },
    ],
  },
  {
    title: 'Assistance',
    links: [
      { label: 'Contactez-nous', to: '/contact-us' },
      { label: 'Notre réseau', to: '/reseau' },
      { label: 'Plan du site', to: '/sitemap' },
      { label: 'Sécurité', to: '/security' },
    ],
  },
  {
    title: 'Informations légales',
    links: [
      { label: 'Conditions générales', to: '/general-terms-and-conditions' },
      { label: 'Politique de confidentialité', to: '/legal/privacy-and-cookies-policy' },
      { label: 'Cookies', to: '/legal/cookies-policy' },
      { label: 'Retours et remboursements', to: '/legal/returns-and-refunds' },
    ],
  },
]

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/evplug-ma/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/evplug.ma?igshid=MzMyNGUyNmU2YQ==',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.26.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.32.79.74 1.46 1.38 2.13.66.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.32 1.46-.74 2.13-1.38.66-.66 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91A5.86 5.86 0 0 0 21.99 2 5.86 5.86 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/evplug.ma?mibextid=LQQJ4d',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.95.93-1.95 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
      </svg>
    ),
  },
]

const SUPPORT_PHONE = { label: '05 21 33 50 75', href: 'tel:+212521335075' }

const DIRECT_PHONES = [
  { label: '+212 661 11 66 26', href: 'tel:+212661116626' },
  { label: '+212 661 22 80 10', href: 'tel:+212661228010' },
]

const TICKET_URL = 'https://myaccount.evplug.ma/forms/ticket?styled=1&with_logo=1'

function FooterColumn({ column }) {
  return (
    <div className="w-full at-item">
      <div className="footer-menu grid gap-spacing-xl">
        <h6 className="text-white font-semibold font-lg at-title">{column.title}</h6>
        <ul className="menu at-tab block">
          {column.links.map((link) => (
            <li key={link.to} className="menu-item">
              <Link to={link.to} className="nav-link block text-white/80 hover:text-white py-1">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer role="contentinfo" className="footer-section z-10 mt-auto text-white">
      <div className="container-max-width-desktop container-max-width-tablet py-spacing-4xl md:px-spacing-4xl px-spacing-xl xl:py-spacing-3xl pb-spacing-xl md:pb-spacing-3xl xl:px-spacing-7xl mx-auto">
        <div className="grid bg-black rounded-2xl gap-spacing-7xl xl:py-spacing-5xl xl:px-spacing-7xl px-spacing-4xl py-spacing-5xl">
          <div className="xl:gap-spacing-lg gap-spacing-lg grid xl:grid-flow-col xl:items-start accordion">
            <div className="w-full xl:max-w-65 xl:pb-spacing-0 pb-spacing-xl">
              <Link to="/" className="logo mb-8 inline-block" aria-label="EVplug Maroc">
                <img src={logo} alt="EVplug Maroc" className="img-fluid max-w-35 md:max-w-45" loading="lazy" />
              </Link>
              <p
                className="text-white mt-spacing-xl"
                style={{
                  fontFamily: 'var(--brand-font-heading)',
                  fontSize: 'clamp(2.2rem, 3.4vw, 2.3rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                  margin: '12px 0 0',
                  maxWidth: '15ch',
                }}
              >
                Trust and love your charging experience
              </p>
            </div>
            <div className="w-full grid gap-spacing-2xl xl:gap-spacing-3xl xl:self-start">
              <div className="grid gap-spacing-3xl xl:grid-cols-3 xl:gap-spacing-2xl">
                {COLUMNS.map((col) => (
                  <FooterColumn key={col.title} column={col} />
                ))}
              </div>

              <div className="w-full border-t border-white/15 pt-spacing-3xl">
                <div className="flex flex-col gap-spacing-md">
                  <h6 className="text-white font-semibold font-lg uppercase tracking-[0.12em]">
                    Lignes directes
                  </h6>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {DIRECT_PHONES.map((phone, index) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="inline-flex items-center gap-2 text-white font-semibold hover:text-white/90 font-sm"
                        style={{ letterSpacing: '0.02em' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2z" />
                        </svg>
                        {phone.label}
                        {index === 0 && <span className="text-white/35">|</span>}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full social-icons pt-spacing-4xl xl:pt-0">
              <div className="footer-menu grid xl:justify-end xl:gap-spacing-5xl gap-spacing-4xl">
                <div className="grid gap-spacing-xl grid-flow-row">
                  <h6 className="text-white font-semibold font-lg">Support</h6>
                  <div
                    className="w-full"
                    style={{
                      width: '100%',
                      maxWidth: '320px',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.18)',
                      background: 'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
                      padding: '18px 20px',
                    }}
                  >
                    <a href={SUPPORT_PHONE.href} className="block">
                      <span
                        className="flex items-center gap-3 text-white/60 font-xs uppercase"
                        style={{ letterSpacing: '0.12em', whiteSpace: 'nowrap' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2z" />
                        </svg>
                        Support client
                      </span>
                      <span
                        className="block text-white mt-2"
                        style={{
                          fontFamily: 'var(--brand-font-heading)',
                          fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
                          letterSpacing: '0.02em',
                          lineHeight: 1.1,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {SUPPORT_PHONE.label}
                      </span>
                    </a>
                    <div
                      aria-hidden="true"
                      style={{ height: '1px', background: 'rgba(255,255,255,0.14)', margin: '16px 0' }}
                    />
                    <a
                      href={TICKET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 font-semibold"
                      style={{
                        width: '100%',
                        borderRadius: '999px',
                        padding: '11px 16px',
                        background: 'var(--brand-color-accent, #c8d72d)',
                        color: '#0a1f1a',
                        letterSpacing: '0.01em',
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
                        <path d="M13 5v14" />
                      </svg>
                      Ouvrir un ticket
                    </a>
                  </div>
                </div>
                <div className="grid gap-spacing-3xl grid-flow-row">
                  <h6 className="text-white font-semibold font-lg">Suivez-nous</h6>
                  <ul className="flex flex-row gap-3">
                    {SOCIAL_LINKS.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          title={s.label}
                          className="inline-flex items-center justify-center text-white/80 hover:text-white"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '999px',
                            border: '1px solid rgba(255,255,255,0.25)',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            transition: 'background-color 0.2s, border-color 0.2s',
                          }}
                        >
                          {s.icon}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom pt-4">
            <div className="grid gap-spacing-xl xl:grid-flow-col font-sm items-center">
              <div className="copyright text-white/60">&copy; EVplug Maroc 2026</div>
              <div className="text-white xl:text-right">
                <span className="font-semibold">EVplug Maroc</span>
                &nbsp;&mdash; Siège : Casablanca, Maroc &nbsp;&middot;&nbsp; Interventions partout au Maroc, à partir de
                Casablanca, Rabat, Marrakech et Tanger
              </div>
            </div>
            <div className="pt-6 copyright-bottom font-xs text-start text-white/60">
              <p>
                EVplug Maroc accompagne la transition vers la mobilité électrique avec des solutions de recharge pour
                particuliers et professionnels. Les offres, délais et conditions de service peuvent varier selon la
                ville, la configuration électrique du site et la disponibilité des équipes techniques. Pour un cadrage
                précis de votre projet, merci de contacter notre équipe commerciale.&nbsp;
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
