import { Link, useLocation } from 'react-router-dom'

const styles = {
  page: {
    minHeight: '100vh',
    padding: 'clamp(24px, 6vw, 64px)',
    display: 'grid',
    placeItems: 'center',
    background:
      'radial-gradient(circle at 20% 20%, rgba(0, 168, 255, 0.16), transparent 45%), radial-gradient(circle at 80% 0%, rgba(11, 96, 176, 0.2), transparent 40%), #f8fbff',
    fontFamily: '"Segoe UI", system-ui, sans-serif',
    color: '#0e2e4f',
  },
  card: {
    width: 'min(760px, 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(14, 46, 79, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    boxShadow: '0 16px 56px rgba(14, 46, 79, 0.12)',
    padding: 'clamp(24px, 5vw, 48px)',
  },
  code: {
    marginTop: '12px',
    display: 'inline-block',
    borderRadius: '999px',
    backgroundColor: '#eaf4ff',
    color: '#16497a',
    border: '1px solid #cae2ff',
    padding: '8px 14px',
    fontSize: '0.92rem',
    wordBreak: 'break-all',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '22px',
  },
  primaryButton: {
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    padding: '11px 18px',
    backgroundColor: '#007fd8',
    color: '#fff',
    fontWeight: 600,
  },
  secondaryButton: {
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    padding: '11px 18px',
    border: '1px solid #bad8f8',
    color: '#0e3f72',
    fontWeight: 600,
    backgroundColor: '#fff',
  },
}

export default function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={{ margin: 0, letterSpacing: '0.08em', fontWeight: 700, color: '#2a73b2' }}>ERROR 404</p>
        <h1 style={{ marginTop: '10px', marginBottom: '8px', fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
          This page does not exist
        </h1>
        <p style={{ marginTop: 0, fontSize: '1.04rem', lineHeight: 1.6, color: '#375f88' }}>
          We could not match the requested route in the migrated pages. You can return home or jump
          to the main guides section.
        </p>
        <span style={styles.code}>Requested path: {pathname}</span>

        <div style={styles.actions}>
          <Link to="/" style={styles.primaryButton}>
            Back to home
          </Link>
          <Link to="/guides" style={styles.secondaryButton}>
            Browse guides
          </Link>
        </div>
      </section>
    </main>
  )
}
