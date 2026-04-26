import { Link } from 'react-router-dom'

export default function SolutionPage({ title, description, features = [] }) {
  return (
    <main style={{ padding: '6rem 2rem 4rem', maxWidth: 900, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#163e4c', marginBottom: '1rem' }}>{title}</h1>
      <p style={{ fontSize: '1.125rem', color: '#444', marginBottom: '2rem', lineHeight: 1.7 }}>{description}</p>
      {features.length > 0 && (
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '2.5rem' }}>
          {features.map((f, i) => (
            <li key={i} style={{ marginBottom: '0.5rem', color: '#333' }}>{f}</li>
          ))}
        </ul>
      )}
      <Link
        to="/contact-us"
        style={{
          display: 'inline-block', background: '#163e4c', color: '#fff',
          padding: '0.75rem 1.75rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600,
        }}
      >
        Étudier votre projet
      </Link>
    </main>
  )
}
