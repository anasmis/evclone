import { useEffect, useMemo, useState } from 'react'

// Placeholder booking calendar — UI only.
// Wire the backend by passing `endpoint` (e.g. /api/training/availability?formation=KEY)
// returning { slots: [{ id, start, end, capacity, remaining }] }.
const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTH_LABELS = [
  'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre',
]

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function buildMonthGrid(viewDate) {
  const first = startOfMonth(viewDate)
  // Monday-first offset (getDay: 0=Sun..6=Sat → Mon=0)
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < offset; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function sameDay(a, b) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatTime(date) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function BookingCalendar({
  formationKey,
  title = 'Reserver une session',
  subtitle = 'Choisissez une date dans le calendrier pour voir les sessions disponibles.',
  endpoint,
  accentColor = '#c8d72d',
  onSelectSlot,
}) {
  const today = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  }, [])
  const [viewDate, setViewDate] = useState(today)
  const [selectedDate, setSelectedDate] = useState(null)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cells = useMemo(() => buildMonthGrid(viewDate), [viewDate])
  const monthLabel = `${MONTH_LABELS[viewDate.getMonth()]} ${viewDate.getFullYear()}`

  // Backend hook — wire to real endpoint when ready.
  useEffect(() => {
    if (!selectedDate || !endpoint) {
      return undefined
    }
    const controller = new AbortController()
    const iso = selectedDate.toISOString().slice(0, 10)
    const url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}date=${iso}${
      formationKey ? `&formation=${encodeURIComponent(formationKey)}` : ''
    }`
    Promise.resolve()
      .then(() => fetch(url, { signal: controller.signal }))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        const parsed = (data?.slots || []).map((s) => ({
          ...s,
          start: new Date(s.start),
          end: new Date(s.end),
        }))
        setSlots(parsed)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Erreur de chargement')
        setSlots([])
        setLoading(false)
      })
    return () => controller.abort()
  }, [selectedDate, endpoint, formationKey])

  const handleSelectDate = (date) => {
    setSelectedDate(date)
    setSlots([])
    setError(null)
    setLoading(Boolean(endpoint))
  }

  const goPrev = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  const goNext = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))

  const isPast = (d) => d && d < today

  return (
    <section className="relative bg-white top-spacing" id="calendrier">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto xl:py-spacing-9xl py-spacing-7xl">
        <div className="grid gap-spacing-6xl">
          <div className="view-header text-center max-w-[720px] mx-auto">
            <div className="heading-block grid gap-spacing-3xl">
              <span
                className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full text-black text-sm font-semibold w-fit mx-auto"
                style={{ backgroundColor: accentColor }}
              >
                Calendrier
              </span>
              <h2 className="tracking-tight m-0">{title}</h2>
              <p>{subtitle}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-spacing-6xl bg-surface rounded-3xl border border-gray-200 p-spacing-6xl">
            <div>
              <div className="flex items-center justify-between mb-spacing-3xl">
                <button
                  type="button"
                  onClick={goPrev}
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  aria-label="Mois precedent"
                >
                  <i className="fa-solid fa-angle-left" />
                </button>
                <span className="font-semibold capitalize">{monthLabel}</span>
                <button
                  type="button"
                  onClick={goNext}
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  aria-label="Mois suivant"
                >
                  <i className="fa-solid fa-angle-right" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-spacing-xs text-center text-xs uppercase tracking-wider text-gray-500 mb-spacing-sm">
                {WEEKDAY_LABELS.map((d, i) => (
                  <span key={`${d}-${i}`}>{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-spacing-xs">
                {cells.map((cell, idx) => {
                  if (!cell) return <span key={`empty-${idx}`} aria-hidden="true" />
                  const disabled = isPast(cell)
                  const selected = sameDay(cell, selectedDate)
                  return (
                    <button
                      key={cell.toISOString()}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleSelectDate(cell)}
                      className={`aspect-square rounded-full text-sm transition border ${
                        selected
                          ? 'text-black font-semibold border-transparent'
                          : 'border-transparent hover:border-gray-300'
                      } ${disabled ? 'text-gray-300 cursor-not-allowed' : ''}`}
                      style={selected ? { backgroundColor: accentColor } : undefined}
                      aria-pressed={selected}
                    >
                      {cell.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-spacing-3xl content-start">
              <div className="grid gap-spacing-xs">
                <p className="uppercase tracking-[0.15em] text-xs font-semibold text-gray-500 m-0">
                  Sessions disponibles
                </p>
                <h3 className="m-0 tracking-tight text-2xl">
                  {selectedDate
                    ? selectedDate.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })
                    : 'Selectionnez une date'}
                </h3>
              </div>

              {!endpoint && (
                <div className="p-spacing-3xl rounded-2xl bg-white border border-dashed border-gray-300">
                  <p className="m-0 text-sm text-gray-600">
                    Le calendrier sera connecte au backend prochainement. Vous pourrez reserver
                    directement votre creneau ici.
                  </p>
                </div>
              )}

              {endpoint && loading && <p className="m-0 text-sm text-gray-500">Chargement...</p>}
              {endpoint && error && (
                <p className="m-0 text-sm text-red-600">Erreur : {error}</p>
              )}
              {endpoint && !loading && !error && selectedDate && slots.length === 0 && (
                <p className="m-0 text-sm text-gray-600">Aucune session disponible ce jour.</p>
              )}

              {slots.length > 0 && (
                <ul className="grid gap-spacing-sm m-0 p-0 list-none">
                  {slots.map((slot) => (
                    <li key={slot.id}>
                      <button
                        type="button"
                        onClick={() => onSelectSlot?.(slot)}
                        className="w-full flex items-center justify-between gap-spacing-xl p-spacing-3xl rounded-2xl bg-white border border-gray-200 hover:border-gray-400 transition text-left"
                      >
                        <span className="grid gap-spacing-xs">
                          <span className="font-semibold">
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </span>
                          {typeof slot.remaining === 'number' && (
                            <span className="text-xs text-gray-500">
                              {slot.remaining} place(s) restante(s)
                            </span>
                          )}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: '#005F41' }}>
                          Reserver
                          <i className="fa-solid fa-angle-right ml-2" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
