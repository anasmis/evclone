import { useEffect, useMemo, useState } from 'react'
import AnimatedSection from '../common/AnimatedSection'
import CardsCarousel from '../common/CardsCarousel'
import { fetchGoogleReviews } from '../../lib/api/strapi'

// Live "best reviews" from the EVplug Google Business profile. Data comes from
// the backend proxy (GET /api/google-reviews) which caches the Google Places
// response. Renders nothing until real reviews are available so the homepage
// never shows an empty shell.

const STAR_PATH =
  'M12 17.27 5.82 21l1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.73L18.18 21z'

function GoogleG({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

// Five stars with a gold overlay clipped to (value / 5) so fractional aggregate
// ratings (e.g. 4.8) render an accurate partial star.
function Stars({ value = 0, size = 18 }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))
  const row = (fill) =>
    [0, 1, 2, 3, 4].map((i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={fill} style={{ display: 'block' }}>
        <path d={STAR_PATH} />
      </svg>
    ))
  return (
    <span className="gr-stars" role="img" aria-label={`${value} sur 5 étoiles`}>
      <span className="gr-stars-row">{row('#E3E0DA')}</span>
      <span className="gr-stars-row gr-stars-row--fill" style={{ width: `${pct}%` }}>
        {row('#FBBC04')}
      </span>
    </span>
  )
}

function initialsOf(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
}

const AVATAR_COLORS = ['#123d33', '#2f6f4f', '#c8d72d', '#87B4E1', '#fe5716', '#4285F4']
function colorFor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

function Avatar({ name, photo }) {
  const [broken, setBroken] = useState(false)
  if (photo && !broken) {
    return (
      <img
        src={photo}
        alt=""
        className="gr-avatar"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    )
  }
  const bg = colorFor(name)
  return (
    <span className="gr-avatar gr-avatar--initials" style={{ background: bg }} aria-hidden="true">
      {initialsOf(name) || 'G'}
    </span>
  )
}

export default function GoogleReviews() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true
    fetchGoogleReviews()
      .then((res) => {
        if (alive) setData(res)
      })
      .catch(() => {
        if (alive) setData(null)
      })
    return () => {
      alive = false
    }
  }, [])

  const reviews = useMemo(() => data?.reviews ?? [], [data])

  // Nothing to show until the proxy returns real reviews.
  if (!data || reviews.length === 0) return null

  const ratingLabel = data.rating ? data.rating.toFixed(1) : '—'

  return (
    <AnimatedSection className="relative google-reviews-section">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto md:pt-spacing-6xl pt-spacing-4xl md:pb-spacing-7xl pb-spacing-4xl gap-spacing-4xl">
        <div className="gr-summary">
          <div className="gr-summary-brand">
            <GoogleG size={40} />
            <div className="gr-summary-meta">
              <p className="gr-summary-label">Avis Google</p>
              <div className="gr-summary-rating">
                <span className="gr-rating-num">{ratingLabel}</span>
                <Stars value={data.rating || 0} size={20} />
              </div>
              <p className="gr-summary-count">
                {data.total} avis vérifiés sur Google
              </p>
            </div>
          </div>
          <div className="gr-summary-actions">
            {data.url && (
              <a className="btn btn-secondary font-base" href={data.url} target="_blank" rel="noopener noreferrer">
                Voir tous les avis
              </a>
            )}
            {data.writeReviewUrl && (
              <a
                className="btn btn-secondary-outline font-base"
                href={data.writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Laisser un avis
              </a>
            )}
          </div>
        </div>

        <div className="gr-carousel-wrap">
          <CardsCarousel
            ariaLabel="Avis Google des clients EVplug"
            autoPlay={reviews.length > 1}
            interval={6500}
            slideClassName="w-full md:w-1/2 xl:w-1/3 pr-spacing-4xl"
          >
            {reviews.map((r, i) => (
              <article key={`${r.author}-${i}`} className="gr-card">
                <header className="gr-card-head">
                  <Avatar name={r.author} photo={r.profilePhoto} />
                  <div className="gr-card-id">
                    <p className="gr-card-name">{r.author}</p>
                    {r.relativeTime && <p className="gr-card-time">{r.relativeTime}</p>}
                  </div>
                  <GoogleG size={20} />
                </header>
                <Stars value={r.rating} size={16} />
                <p className="gr-review-text">{r.text}</p>
              </article>
            ))}
          </CardsCarousel>
        </div>
      </div>

      <style>{`
        .google-reviews-section .gr-summary {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
        }
        .google-reviews-section .gr-summary-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .google-reviews-section .gr-summary-meta { display: grid; gap: 2px; }
        .google-reviews-section .gr-summary-label {
          margin: 0;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-blue-dianne);
        }
        .google-reviews-section .gr-summary-rating {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .google-reviews-section .gr-rating-num {
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1;
          color: var(--color-blue-dianne);
        }
        .google-reviews-section .gr-summary-count {
          margin: 0;
          font-size: 0.85rem;
          color: rgba(18, 61, 51, 0.65);
        }
        .google-reviews-section .gr-summary-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .gr-stars { position: relative; display: inline-flex; line-height: 0; }
        .gr-stars-row { display: inline-flex; }
        .gr-stars-row--fill {
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          white-space: nowrap;
        }

        .google-reviews-section .gr-card {
          background: #ffffff;
          border: 1px solid rgba(18, 61, 51, 0.08);
          border-radius: 16px;
          padding: 24px;
          height: 100%;
          min-height: 244px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 10px 26px rgba(18, 61, 51, 0.06);
        }
        .google-reviews-section .gr-card-head {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .google-reviews-section .gr-avatar {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .google-reviews-section .gr-avatar--initials {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
        }
        .google-reviews-section .gr-card-id { flex: 1; min-width: 0; }
        .google-reviews-section .gr-card-name {
          margin: 0;
          font-weight: 700;
          font-size: 1rem;
          color: #1a1a1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .google-reviews-section .gr-card-time {
          margin: 0;
          font-size: 0.8rem;
          color: rgba(0, 0, 0, 0.5);
        }
        .google-reviews-section .gr-review-text {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </AnimatedSection>
  )
}
