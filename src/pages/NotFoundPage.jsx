import { Link, useLocation } from 'react-router-dom'
import MirrorShell from './MirrorShell'

export default function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <MirrorShell documentTitle="Page introuvable | EVplug">
      <section
        className="py-spacing-7xl"
        style={{
          backgroundColor: 'var(--brand-color-page)',
          color: 'var(--brand-color-text)',
          minHeight: 'calc(100vh - 320px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile">
          <div
            className="grid gap-spacing-4xl text-center mx-auto"
            style={{ maxWidth: '720px' }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--brand-font-heading)',
                fontSize: 'clamp(4rem, 14vw, 8rem)',
                lineHeight: 1,
                color: 'var(--brand-color-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              404
            </p>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--brand-font-heading)',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                color: 'var(--brand-color-primary)',
              }}
            >
              Cette page est introuvable
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '1.05rem',
                lineHeight: 1.6,
                color: 'var(--brand-color-text)',
                opacity: 0.85,
              }}
            >
              Le lien que vous avez suivi n&apos;existe plus ou n&apos;a pas encore été
              migré. Revenez à l&apos;accueil ou explorez nos sections principales.
            </p>
            <span
              style={{
                justifySelf: 'center',
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: '999px',
                backgroundColor: 'var(--brand-color-secondary)',
                color: 'var(--brand-color-primary)',
                fontSize: '0.9rem',
                fontFamily: 'var(--brand-font-body)',
                wordBreak: 'break-all',
              }}
            >
              {pathname}
            </span>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'center',
                marginTop: '8px',
              }}
            >
              <Link
                to="/"
                style={{
                  textDecoration: 'none',
                  padding: '12px 22px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--brand-color-primary)',
                  color: 'var(--brand-navbar-text)',
                  fontWeight: 600,
                }}
              >
                Retour à l&apos;accueil
              </Link>
              <Link
                to="/contact-us"
                style={{
                  textDecoration: 'none',
                  padding: '12px 22px',
                  borderRadius: '999px',
                  border: '1px solid var(--brand-color-primary)',
                  color: 'var(--brand-color-primary)',
                  fontWeight: 600,
                  backgroundColor: 'transparent',
                }}
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MirrorShell>
  )
}
