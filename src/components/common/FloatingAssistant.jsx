import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { sendAssistantMessage } from '../../lib/api/assistant'

/* ---------------------------------------------------------------------------
   FloatingAssistant — a hovering chat widget that feels like talking to a real
   EVplug advisor. The advisor's identity (a Moroccan name + gender-correct
   role) is picked once per browser session and kept stable while the visitor
   chats, so the conversation stays believable; a fresh session gets a new
   person. Every message the visitor sends is relayed to an n8n webhook, which
   returns the advisor's reply.
   --------------------------------------------------------------------------- */

// Moroccan advisors — the gender drives the role wording so the persona reads
// as a genuine human every time.
const ADVISORS = [
  { name: 'Yasmine', gender: 'f' },
  { name: 'Salma', gender: 'f' },
  { name: 'Imane', gender: 'f' },
  { name: 'Meryem', gender: 'f' },
  { name: 'Ghita', gender: 'f' },
  { name: 'Chaimae', gender: 'f' },
  { name: 'Nada', gender: 'f' },
  { name: 'Hafsa', gender: 'f' },
  { name: 'Youssef', gender: 'm' },
  { name: 'Amine', gender: 'm' },
  { name: 'Reda', gender: 'm' },
  { name: 'Mehdi', gender: 'm' },
  { name: 'Othmane', gender: 'm' },
  { name: 'Anas', gender: 'm' },
  { name: 'Zakaria', gender: 'm' },
  { name: 'Ayoub', gender: 'm' },
]

// Subtle, brand-safe avatar gradient variants so each advisor looks slightly
// distinct without leaving the EVplug green family.
const AVATAR_GRADIENTS = [
  ['#0e5a3a', '#37a86a'],
  ['#0a5230', '#2f8f5b'],
  ['#12513f', '#4bb37a'],
  ['#0f4a34', '#5cbe83'],
  ['#134a3b', '#3fa268'],
]

const ADVISOR_KEY = 'evplug-assistant-advisor'
const SESSION_KEY = 'evplug-assistant-session'

function pickAdvisor() {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.sessionStorage.getItem(ADVISOR_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.name) return parsed
      }
    } catch {
      // sessionStorage unavailable (private mode) — fall through to a fresh pick
    }
  }
  const base = ADVISORS[Math.floor(Math.random() * ADVISORS.length)]
  const gradient = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)]
  const advisor = {
    ...base,
    role: base.gender === 'f' ? 'Conseillère EVplug' : 'Conseiller EVplug',
    roleLower: base.gender === 'f' ? 'conseillère' : 'conseiller',
    gradient,
    initial: base.name.charAt(0).toUpperCase(),
  }
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(ADVISOR_KEY, JSON.stringify(advisor))
    } catch {
      // ignore — persona simply won't persist across navigations
    }
  }
  return advisor
}

// Stable per-visitor id so the n8n workflow can keep conversation memory.
function getSessionId() {
  if (typeof window === 'undefined') return `sess-${Date.now()}`
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id =
        window.crypto?.randomUUID?.() ||
        `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`
      window.sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return `sess-${Date.now()}`
  }
}

const nowLabel = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let messageSeq = 0
const nextId = () => `m${++messageSeq}`

// Monogram avatar with an online dot — declared at module scope so it keeps a
// stable identity across renders (React lint: no components defined in render).
function Avatar({ advisor, size = 40, showStatus = true }) {
  return (
    <span
      className="eva-avatar"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${advisor.gradient[0]} 0%, ${advisor.gradient[1]} 100%)`,
        fontSize: size * 0.42,
      }}
      aria-hidden="true"
    >
      {advisor.initial}
      {showStatus && <span className="eva-avatar-dot" />}
    </span>
  )
}

export default function FloatingAssistant() {
  const advisor = useMemo(() => pickAdvisor(), [])
  const sessionId = useMemo(() => getSessionId(), [])
  const location = useLocation()

  const [ctaPresent, setCtaPresent] = useState(false)
  const [open, setOpen] = useState(false)
  const [greeted, setGreeted] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')

  const mounted = useRef(true)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  // Some pages mount a FloatingCtaForm in the bottom-right corner. Detect it
  // per route so we can lift the assistant above it (and sit in the corner on
  // pages without it). Re-checks shortly after navigation for late mounts.
  useEffect(() => {
    const check = () => {
      if (mounted.current) setCtaPresent(Boolean(document.querySelector('.fcf-launcher')))
    }
    check()
    const t = window.setTimeout(check, 350)
    return () => window.clearTimeout(t)
  }, [location.pathname])

  // Auto-scroll to the newest message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  // Show a friendly teaser bubble a few seconds after load — like a real
  // advisor noticing you're on the site.
  useEffect(() => {
    if (open || greeted) return undefined
    const t = setTimeout(() => {
      if (mounted.current && !open) setTeaser(true)
    }, 3200)
    return () => clearTimeout(t)
  }, [open, greeted])

  // Manage keyboard + focus while the panel is open.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => inputRef.current?.focus(), 320)
    return () => {
      document.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open])

  const addMessage = (from, text) =>
    setMessages((prev) => [...prev, { id: nextId(), from, text, time: nowLabel() }])

  // Warm local greeting the first time the panel opens — instant, no round-trip.
  const startConversation = async () => {
    if (greeted) return
    setGreeted(true)
    const lines = [
      `Bonjour 👋 Je suis ${advisor.name}, ${advisor.roleLower} chez EVplug.`,
      'Comment puis-je vous aider aujourd’hui ?',
    ]
    for (const line of lines) {
      setTyping(true)
      await sleep(Math.min(1400, 550 + line.length * 16))
      if (!mounted.current) return
      setTyping(false)
      addMessage('agent', line)
      await sleep(220)
    }
  }

  const handleOpen = () => {
    setOpen(true)
    setTeaser(false)
    if (!greeted) startConversation()
  }

  const handleSend = async (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || typing) return

    // Snapshot the conversation before appending the new turn, so the workflow
    // gets prior context even though state updates are async.
    const history = messages.map((m) => ({
      role: m.from === 'agent' ? 'assistant' : 'user',
      content: m.text,
    }))

    addMessage('user', text)
    setDraft('')
    setTyping(true)

    try {
      const reply = await sendAssistantMessage({ message: text, sessionId, advisor, history })
      if (!mounted.current) return
      setTyping(false)
      addMessage(
        'agent',
        reply ||
          'Merci ! Je transmets votre demande à l’équipe, on revient vers vous très vite 🌿',
      )
    } catch {
      if (!mounted.current) return
      setTyping(false)
      addMessage(
        'agent',
        'Désolé, je rencontre un petit souci technique 🙏 Réessayez dans un instant.',
      )
    }
  }

  return (
    <>
      <style>{`
        .eva-root { font-family: var(--brand-font-body, sans-serif); }

        /* ── Launcher ─────────────────────────────────────────────── */
        .eva-launcher {
          position: fixed;
          right: 24px;
          /* Bottom offset is driven from JS: when the FloatingCtaForm launcher
             is on the page we lift above it, otherwise we sit in the corner. */
          bottom: var(--eva-lb, 24px);
          z-index: 10035;
          isolation: isolate;
          transition: bottom 0.25s ease;
        }
        .eva-fab {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 62px;
          height: 62px;
          border: none;
          border-radius: 999px;
          padding: 0;
          cursor: pointer;
          background: linear-gradient(135deg, #0a5230 0%, #157c47 62%, #123d33 100%);
          box-shadow:
            0 16px 34px rgba(9, 74, 45, 0.34),
            0 0 0 1px color-mix(in srgb, var(--brand-color-accent, #c8d72d) 55%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .eva-fab:hover, .eva-fab:focus-visible {
          transform: translateY(-3px) scale(1.03);
          box-shadow:
            0 22px 44px rgba(9, 74, 45, 0.46),
            0 0 0 2px var(--brand-color-accent, #c8d72d),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          outline: none;
        }
        .eva-fab-glow {
          position: absolute;
          inset: -10px;
          border-radius: 999px;
          border: 2px solid var(--brand-color-accent, #c8d72d);
          opacity: 0;
          pointer-events: none;
          animation: eva-ring 2.8s ease-out infinite;
        }
        @keyframes eva-ring {
          0% { opacity: 0.55; transform: scale(0.88); }
          80%, 100% { opacity: 0; transform: scale(1.4); }
        }
        .eva-fab .eva-avatar { box-shadow: 0 2px 8px rgba(0,0,0,0.25); }

        /* ── Avatar ───────────────────────────────────────────────── */
        .eva-avatar {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #fff;
          font-family: var(--brand-font-heading, sans-serif);
          font-weight: 700;
          line-height: 1;
          flex-shrink: 0;
        }
        .eva-avatar-dot {
          position: absolute;
          right: -1px;
          bottom: -1px;
          width: 30%;
          height: 30%;
          min-width: 9px;
          min-height: 9px;
          border-radius: 999px;
          background: #35d07f;
          border: 2px solid #fff;
        }

        /* ── Teaser ───────────────────────────────────────────────── */
        .eva-teaser {
          position: absolute;
          right: 0;
          bottom: 74px;
          width: max-content;
          max-width: 250px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: #fff;
          color: var(--brand-color-text, #163e4c);
          border-radius: 16px 16px 4px 16px;
          box-shadow: 0 14px 30px rgba(9, 74, 45, 0.2);
          font-size: 13.5px;
          line-height: 1.4;
          animation: eva-pop 0.32s cubic-bezier(0.2, 0.8, 0.3, 1.2);
        }
        .eva-teaser strong { color: var(--brand-color-primary, #123d33); }
        .eva-teaser-close {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          border: none;
          background: var(--brand-color-primary, #123d33);
          color: #fff;
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        @keyframes eva-pop {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Panel ────────────────────────────────────────────────── */
        .eva-panel {
          position: fixed;
          right: 24px;
          bottom: 24px;
          /* Above the FloatingCtaForm launcher (10040) so the open panel is not
             overlapped by it, but below that form's modal backdrop. */
          z-index: 10045;
          width: 384px;
          max-width: calc(100vw - 32px);
          height: 588px;
          max-height: calc(100vh - 40px);
          display: flex;
          flex-direction: column;
          background: var(--brand-color-page, #f7f7f5);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(9, 74, 45, 0.32), 0 0 0 1px rgba(18, 61, 51, 0.06);
          transform-origin: bottom right;
          animation: eva-open 0.3s cubic-bezier(0.2, 0.8, 0.3, 1.05);
        }
        @keyframes eva-open {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .eva-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          background: linear-gradient(135deg, #0a5230 0%, #157c47 62%, #123d33 100%);
          color: var(--brand-color-secondary, #f2f5c4);
        }
        .eva-header-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .eva-header-name {
          font-family: var(--brand-font-heading, sans-serif);
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }
        .eva-header-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          opacity: 0.9;
        }
        .eva-header-status::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #35d07f;
          box-shadow: 0 0 0 3px rgba(53, 208, 127, 0.25);
        }
        .eva-header-close {
          margin-left: auto;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: none;
          background: rgba(255, 255, 255, 0.14);
          color: #fff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.16s ease;
          flex-shrink: 0;
        }
        .eva-header-close:hover, .eva-header-close:focus-visible {
          background: rgba(255, 255, 255, 0.26);
          outline: none;
        }

        /* ── Message stream ───────────────────────────────────────── */
        .eva-stream {
          flex: 1;
          overflow-y: auto;
          padding: 18px 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scroll-behavior: smooth;
        }
        .eva-day {
          align-self: center;
          font-size: 11px;
          color: rgba(22, 62, 76, 0.55);
          background: rgba(18, 61, 51, 0.06);
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 2px;
        }
        .eva-row { display: flex; align-items: flex-end; gap: 8px; max-width: 88%; }
        .eva-row.agent { align-self: flex-start; }
        .eva-row.user { align-self: flex-end; flex-direction: row-reverse; }
        .eva-row .eva-avatar { width: 26px; height: 26px; font-size: 11px; }
        .eva-row.user .eva-avatar-spacer { width: 0; }

        .eva-bubble {
          padding: 10px 13px;
          font-size: 14px;
          line-height: 1.45;
          border-radius: 16px;
          position: relative;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .eva-row.agent .eva-bubble {
          background: #fff;
          color: var(--brand-color-text, #163e4c);
          border-bottom-left-radius: 5px;
          box-shadow: 0 2px 8px rgba(18, 61, 51, 0.08);
        }
        .eva-row.user .eva-bubble {
          background: linear-gradient(135deg, var(--brand-color-primary, #123d33), #0f5132);
          color: var(--brand-color-secondary, #f2f5c4);
          border-bottom-right-radius: 5px;
        }
        .eva-time {
          display: block;
          margin-top: 4px;
          font-size: 10.5px;
          opacity: 0.55;
          text-align: right;
        }
        .eva-row.agent .eva-time { text-align: left; }

        .eva-typing {
          display: inline-flex;
          gap: 4px;
          padding: 12px 14px;
          background: #fff;
          border-radius: 16px;
          border-bottom-left-radius: 5px;
          box-shadow: 0 2px 8px rgba(18, 61, 51, 0.08);
        }
        .eva-typing span {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--brand-color-primary, #123d33);
          opacity: 0.4;
          animation: eva-bounce 1.1s infinite ease-in-out;
        }
        .eva-typing span:nth-child(2) { animation-delay: 0.15s; }
        .eva-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes eva-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-4px); opacity: 0.9; }
        }

        /* ── Composer ─────────────────────────────────────────────── */
        .eva-composer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #fff;
          border-top: 1px solid rgba(18, 61, 51, 0.1);
        }
        .eva-composer input {
          flex: 1;
          border: none;
          background: var(--brand-color-surface, #f5f1eb);
          border-radius: 999px;
          padding: 11px 15px;
          font: inherit;
          font-size: 14px;
          color: var(--brand-color-text, #163e4c);
        }
        .eva-composer input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(18, 61, 51, 0.16);
        }
        .eva-composer input::placeholder { color: rgba(22, 62, 76, 0.5); }
        .eva-send {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #0a5230, #157c47);
          color: var(--brand-color-secondary, #f2f5c4);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.16s ease, box-shadow 0.16s ease;
        }
        .eva-send:hover:not(:disabled), .eva-send:focus-visible:not(:disabled) {
          transform: scale(1.06);
          box-shadow: 0 6px 16px rgba(9, 74, 45, 0.35);
          outline: none;
        }
        .eva-send:disabled { opacity: 0.45; cursor: default; }

        .eva-footnote {
          text-align: center;
          font-size: 10.5px;
          color: rgba(22, 62, 76, 0.5);
          padding: 0 12px 8px;
          background: #fff;
        }
        .eva-footnote b { color: var(--brand-color-primary, #123d33); font-weight: 600; }

        @media (max-width: 480px) {
          .eva-launcher { right: 16px; bottom: var(--eva-lb-m, 16px); }
          .eva-panel {
            left: 10px;
            right: 10px;
            bottom: 10px;
            width: auto;
            max-width: none;
            height: min(78vh, 620px);
          }
          .eva-teaser { max-width: min(72vw, 250px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .eva-fab-glow, .eva-typing span, .eva-teaser, .eva-panel { animation: none; }
          .eva-fab:hover, .eva-fab:focus-visible { transform: none; }
        }
      `}</style>

      <div className="eva-root">
        {/* Launcher */}
        <div
          className="eva-launcher"
          style={{
            '--eva-lb': ctaPresent ? '104px' : '24px',
            '--eva-lb-m': ctaPresent ? '84px' : '16px',
          }}
        >
          {teaser && !open && (
            <div className="eva-teaser" role="status">
              <button
                type="button"
                className="eva-teaser-close"
                aria-label="Fermer"
                onClick={(e) => {
                  e.stopPropagation()
                  setTeaser(false)
                }}
              >
                ×
              </button>
              <Avatar advisor={advisor} size={30} />
              <span>
                <strong>{advisor.name}</strong> — une question sur la recharge ? Je suis en ligne 🌿
              </span>
            </div>
          )}

          {!open && (
            <button
              type="button"
              className="eva-fab"
              aria-label={`Ouvrir le chat avec ${advisor.name}, ${advisor.role}`}
              aria-haspopup="dialog"
              onClick={handleOpen}
            >
              <span className="eva-fab-glow" aria-hidden="true" />
              <Avatar advisor={advisor} size={44} />
            </button>
          )}
        </div>

        {/* Panel */}
        {open && (
          <section
            className="eva-panel"
            role="dialog"
            aria-modal="false"
            aria-label={`Discussion avec ${advisor.name}, ${advisor.role} EVplug`}
          >
            <header className="eva-header">
              <Avatar advisor={advisor} size={42} />
              <div className="eva-header-info">
                <span className="eva-header-name">{advisor.name}</span>
                <span className="eva-header-status">{advisor.role} · En ligne</span>
              </div>
              <button
                type="button"
                className="eva-header-close"
                aria-label="Fermer la discussion"
                onClick={() => setOpen(false)}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>

            <div className="eva-stream" ref={scrollRef} aria-live="polite">
              <span className="eva-day">Aujourd’hui</span>
              {messages.map((m) => (
                <div key={m.id} className={`eva-row ${m.from}`}>
                  {m.from === 'agent' ? (
                    <Avatar advisor={advisor} size={26} showStatus={false} />
                  ) : (
                    <span className="eva-avatar-spacer" aria-hidden="true" />
                  )}
                  <div className="eva-bubble">
                    {m.text}
                    <span className="eva-time">{m.time}</span>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="eva-row agent">
                  <Avatar advisor={advisor} size={26} showStatus={false} />
                  <div className="eva-typing" aria-label={`${advisor.name} est en train d’écrire`}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>

            <form className="eva-composer" onSubmit={handleSend}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Écrivez votre message…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                aria-label="Votre message"
              />
              <button
                type="submit"
                className="eva-send"
                disabled={!draft.trim() || typing}
                aria-label="Envoyer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 11l18-8-8 18-2-7-8-3z" fill="currentColor" />
                </svg>
              </button>
            </form>

            <p className="eva-footnote">
              Propulsé par <b>EVplug</b> · réponses en quelques minutes
            </p>
          </section>
        )}
      </div>
    </>
  )
}
