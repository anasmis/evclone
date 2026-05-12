import { useEffect, useRef, useState } from 'react'
import { submitLead } from '../../lib/api/strapi'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  interest: '',
  message: '',
}

export default function FloatingCtaForm({
  buttonLabel = 'Demander un devis',
  title = 'Parlons de votre projet',
  subtitle = "Laissez-nous vos coordonnees, un conseiller EVplug vous recontacte sous 24h.",
  interestOptions = [
    'Installation a domicile',
    'Carte EVplug',
    'Solution entreprise',
    'Solution copropriete',
    'Solution parking',
    'Solution hotel',
    'Station-service',
    'Autre',
  ],
  defaultInterest = '',
  accentColor = '#c8d72d',
  icon = null,
}) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ ...INITIAL_FORM, interest: defaultInterest })
  const panelRef = useRef(null)
  const firstFieldRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => firstFieldRef.current?.focus(), 250)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      clearTimeout(t)
    }
  }, [open])

  // Allow any element on the page to open the panel by dispatching
  // window.dispatchEvent(new CustomEvent('floating-cta-form:open')).
  useEffect(() => {
    const onOpenRequest = () => setOpen(true)
    window.addEventListener('floating-cta-form:open', onOpenRequest)
    return () => window.removeEventListener('floating-cta-form:open', onOpenRequest)
  }, [])

  useEffect(() => {
    if (!open && status === 'success') {
      const t = setTimeout(() => setStatus('idle'), 200)
      return () => clearTimeout(t)
    }
    return undefined
  }, [open, status])

  const handleClose = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Veuillez indiquer votre nom.'
    if (!form.email.trim()) {
      next.email = 'Veuillez indiquer votre email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Adresse email invalide.'
    }
    if (!form.phone.trim()) next.phone = 'Veuillez indiquer un telephone.'
    if (!form.message.trim()) next.message = 'Decrivez votre besoin en quelques mots.'
    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setStatus('submitting')
    try {
      await submitLead({
        ...form,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        submittedAt: new Date().toISOString(),
      })
      setStatus('success')
      setForm({ ...INITIAL_FORM, interest: defaultInterest })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <style>{`
        .fcf-launcher {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 10040;
          display: inline-block;
          isolation: isolate;
        }
        .fcf-glow {
          position: absolute;
          inset: -22px;
          border-radius: 999px;
          background: radial-gradient(
            closest-side,
            var(--fcf-accent, #c8d72d) 0%,
            color-mix(in srgb, var(--fcf-accent, #c8d72d) 55%, transparent) 35%,
            transparent 75%
          );
          filter: blur(14px);
          opacity: 0.75;
          z-index: -1;
          pointer-events: none;
          animation: fcf-pulse 2.6s ease-in-out infinite;
        }
        .fcf-glow::after {
          content: "";
          position: absolute;
          inset: 18px;
          border-radius: 999px;
          border: 2px solid var(--fcf-accent, #c8d72d);
          opacity: 0;
          animation: fcf-ring 2.6s ease-out infinite;
        }
        @keyframes fcf-pulse {
          0%, 100% { opacity: 0.55; transform: scale(0.92); }
          50% { opacity: 0.95; transform: scale(1.08); }
        }
        @keyframes fcf-ring {
          0% { opacity: 0.6; transform: scale(0.9); }
          80% { opacity: 0; transform: scale(1.35); }
          100% { opacity: 0; transform: scale(1.35); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fcf-glow,
          .fcf-glow::after {
            animation: none;
          }
        }

        .fcf-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 22px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(
            135deg,
            var(--brand-color-primary, #123d33) 0%,
            var(--brand-color-text, #163e4c) 100%
          );
          color: var(--brand-color-secondary, #f2f5c4);
          font-family: var(--brand-font-body, sans-serif);
          font-weight: 600;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          box-shadow:
            0 16px 36px rgba(9, 74, 45, 0.32),
            0 0 0 1px color-mix(in srgb, var(--fcf-accent, #c8d72d) 60%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .fcf-button:hover,
        .fcf-button:focus-visible {
          transform: translateY(-3px);
          box-shadow:
            0 22px 44px rgba(9, 74, 45, 0.45),
            0 0 0 2px var(--fcf-accent, #c8d72d),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          outline: none;
        }
        .fcf-button .fcf-button-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--fcf-accent, #c8d72d);
          color: var(--brand-color-primary, #123d33);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 0 12px color-mix(in srgb, var(--fcf-accent, #c8d72d) 70%, transparent);
        }
        @media (max-width: 540px) {
          .fcf-launcher { right: 16px; bottom: 16px; }
          .fcf-button { padding: 12px 18px; font-size: 14px; }
          .fcf-button .fcf-button-label-long { display: none; }
          .fcf-glow { inset: -16px; }
        }

        .fcf-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8, 32, 24, 0.5);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.24s ease;
          z-index: 10050;
        }
        .fcf-backdrop.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .fcf-panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: min(440px, 100%);
          max-width: 100%;
          background: var(--brand-color-page, #f7f7f5);
          box-shadow: -24px 0 48px rgba(9, 74, 45, 0.18);
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10060;
          display: flex;
          flex-direction: column;
          font-family: var(--brand-font-body, sans-serif);
          color: var(--brand-color-text, #163e4c);
        }
        .fcf-panel.is-open { transform: translateX(0); }

        .fcf-panel-header {
          position: relative;
          padding: 28px 28px 20px;
          background: var(--brand-color-primary, #123d33);
          color: var(--brand-color-secondary, #f2f5c4);
        }
        .fcf-panel-header h2 {
          font-family: var(--brand-font-heading, sans-serif);
          font-size: 28px;
          line-height: 1.15;
          margin: 0 0 8px;
          color: var(--brand-color-accent, #c8d72d);
        }
        .fcf-panel-header p {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          opacity: 0.92;
        }
        .fcf-panel-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          color: inherit;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s ease;
        }
        .fcf-panel-close:hover,
        .fcf-panel-close:focus-visible {
          background: rgba(255, 255, 255, 0.24);
          outline: none;
        }

        .fcf-form {
          flex: 1;
          overflow-y: auto;
          padding: 24px 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .fcf-field { display: flex; flex-direction: column; gap: 6px; }
        .fcf-field label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .fcf-field input,
        .fcf-field select,
        .fcf-field textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1px solid #d7d4cb;
          border-radius: 10px;
          background: #fff;
          color: var(--brand-color-text, #163e4c);
          font: inherit;
          font-size: 15px;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .fcf-field textarea { min-height: 110px; resize: vertical; }
        .fcf-field input:focus,
        .fcf-field select:focus,
        .fcf-field textarea:focus {
          outline: none;
          border-color: var(--brand-color-primary, #123d33);
          box-shadow: 0 0 0 3px rgba(18, 61, 51, 0.16);
        }
        .fcf-field.has-error input,
        .fcf-field.has-error select,
        .fcf-field.has-error textarea {
          border-color: #c0392b;
          box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.14);
        }
        .fcf-error {
          font-size: 12px;
          color: #c0392b;
        }

        .fcf-submit {
          margin-top: 4px;
          padding: 13px 18px;
          border-radius: 999px;
          border: none;
          background: var(--brand-color-primary, #123d33);
          color: var(--brand-color-secondary, #f2f5c4);
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.18s ease, transform 0.18s ease;
        }
        .fcf-submit:hover:not(:disabled),
        .fcf-submit:focus-visible:not(:disabled) {
          background: var(--brand-color-text, #163e4c);
          outline: none;
        }
        .fcf-submit:disabled { opacity: 0.7; cursor: progress; }

        .fcf-success {
          background: #e9f5ee;
          border: 1px solid #b6d8c1;
          color: #1c5b3a;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          line-height: 1.5;
        }
        .fcf-status-error {
          background: #fdecea;
          border: 1px solid #f5c2bd;
          color: #a32a1f;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
        }
        .fcf-foot {
          margin: 0;
          font-size: 12px;
          color: #6b6b6b;
        }
      `}</style>

      <div className="fcf-launcher" style={{ '--fcf-accent': accentColor }}>
        <span className="fcf-glow" aria-hidden="true" />
        <button
          ref={triggerRef}
          type="button"
          className="fcf-button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="floating-cta-form-panel"
          onClick={() => setOpen(true)}
        >
          <span className="fcf-button-icon" aria-hidden="true">{icon || '→'}</span>
          <span className="fcf-button-label-long">{buttonLabel}</span>
        </button>
      </div>

      <div
        className={`fcf-backdrop ${open ? 'is-open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <aside
        id="floating-cta-form-panel"
        ref={panelRef}
        className={`fcf-panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fcf-title"
        aria-hidden={!open}
      >
        <div className="fcf-panel-header">
          <button type="button" className="fcf-panel-close" onClick={handleClose} aria-label="Fermer">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <h2 id="fcf-title">{title}</h2>
          <p>{subtitle}</p>
        </div>

        {status === 'success' ? (
          <div className="fcf-form" aria-live="polite">
            <div className="fcf-success">
              <strong>Merci, votre demande est bien envoyee.</strong>
              <br />
              Un conseiller EVplug vous recontacte sous 24h ouvrees.
            </div>
            <button type="button" className="fcf-submit" onClick={handleClose}>
              Fermer
            </button>
          </div>
        ) : (
          <form className="fcf-form" onSubmit={handleSubmit} noValidate>
            <div className={`fcf-field ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="fcf-name">Nom complet</label>
              <input
                ref={firstFieldRef}
                id="fcf-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              {errors.name && <span className="fcf-error">{errors.name}</span>}
            </div>

            <div className={`fcf-field ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="fcf-email">Email</label>
              <input
                id="fcf-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="fcf-error">{errors.email}</span>}
            </div>

            <div className={`fcf-field ${errors.phone ? 'has-error' : ''}`}>
              <label htmlFor="fcf-phone">Telephone</label>
              <input
                id="fcf-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <span className="fcf-error">{errors.phone}</span>}
            </div>

            <div className="fcf-field">
              <label htmlFor="fcf-interest">Sujet</label>
              <select
                id="fcf-interest"
                name="interest"
                value={form.interest}
                onChange={handleChange}
              >
                <option value="">Choisir un sujet</option>
                {interestOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className={`fcf-field ${errors.message ? 'has-error' : ''}`}>
              <label htmlFor="fcf-message">Votre message</label>
              <textarea
                id="fcf-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Decrivez brievement votre besoin (type de vehicule, lieu, delais...)"
                required
              />
              {errors.message && <span className="fcf-error">{errors.message}</span>}
            </div>

            {status === 'error' && (
              <div className="fcf-status-error" role="alert">
                Une erreur est survenue. Veuillez reessayer.
              </div>
            )}

            <button type="submit" className="fcf-submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer ma demande'}
            </button>

            <p className="fcf-foot">
              En soumettant ce formulaire, vous acceptez d'etre recontacte par les equipes EVplug.
            </p>
          </form>
        )}
      </aside>
    </>
  )
}
