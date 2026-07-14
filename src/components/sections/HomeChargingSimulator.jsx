import { useMemo, useState } from 'react'

// Interactive "decide your needs" configurator for the home-charging page.
// The homeowner picks their car profile, daily driving, electrical install and
// overnight charging window; the tool recommends the right charging solution
// (domestic plug → 22 kW wallbox) and shows nightly time, range recovered and
// cost. Self-contained: no chart library, pure SVG/CSS in the brand language.

const HOME_RATE = 1.6 // MAD / kWh — tarif résidentiel ONEE (estimation)
const AC_EFFICIENCY = 0.9 // pertes de charge AC

const vehicleTypes = [
  { id: 'citadine', label: 'Citadine', conso: 14, icon: 'fa-car-side' },
  { id: 'berline', label: 'Berline', conso: 17, icon: 'fa-car' },
  { id: 'suv', label: 'SUV / Familiale', conso: 20, icon: 'fa-truck' },
]

// Home charging options, ordered by power. `phase` gates them by the user's
// electrical installation (a triphasé install can also drive mono chargers).
const chargers = [
  { id: 'prise', label: 'Prise domestique', power: 2.3, phase: 'mono', amp: '10 A', icon: 'fa-plug' },
  { id: 'renforcee', label: 'Prise renforcée', power: 3.7, phase: 'mono', amp: '16 A', icon: 'fa-plug-circle-bolt' },
  { id: 'wb7', label: 'Wallbox 7,4 kW', power: 7.4, phase: 'mono', amp: '32 A', icon: 'fa-charging-station' },
  { id: 'wb11', label: 'Wallbox 11 kW', power: 11, phase: 'tri', amp: '3× 16 A', icon: 'fa-charging-station' },
  { id: 'wb22', label: 'Wallbox 22 kW', power: 22, phase: 'tri', amp: '3× 32 A', icon: 'fa-bolt' },
]

const batteryChips = [
  { kwh: 27, name: 'Dacia Spring' },
  { kwh: 40, name: 'Renault Zoe' },
  { kwh: 60, name: 'Tesla Model 3' },
  { kwh: 77, name: 'VW ID.4' },
  { kwh: 100, name: 'Grande batterie' },
]

const fmtHM = (h) => {
  if (!isFinite(h) || h <= 0) return '0 min'
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  if (hrs <= 0) return `${mins} min`
  if (mins === 0) return `${hrs} h`
  return `${hrs} h ${String(mins).padStart(2, '0')}`
}

// Fill the track up to the current value with the brand green; rest stays sand.
const rangeStyle = (value, min, max) => {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  return {
    background: `linear-gradient(to right, #163E4C 0%, #163E4C ${pct}%, #e6e1d6 ${pct}%, #e6e1d6 100%)`,
  }
}

const openCtaForm = () => window.dispatchEvent(new CustomEvent('floating-cta-form:open'))

function Segmented({ label, options, value, onChange }) {
  return (
    <div className="grid gap-spacing-md">
      <span className="text-sm font-semibold text-blue-dianne/70 uppercase tracking-wide">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-spacing-sm">
        {options.map((opt) => {
          const on = opt.id === value
          return (
            <button
              type="button"
              key={opt.id}
              role="radio"
              aria-checked={on}
              onClick={() => onChange(opt.id)}
              className={`flex-1 min-w-[92px] flex items-center justify-center gap-spacing-sm rounded-full px-spacing-xl py-spacing-md text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                on
                  ? 'bg-blue-dianne text-white border-blue-dianne shadow-[0_10px_24px_-12px_rgba(22,62,76,0.7)]'
                  : 'bg-white text-blue-dianne/70 border-black/10 hover:border-blue-dianne/40 hover:text-blue-dianne'
              }`}
            >
              {opt.icon && <i className={`fa-solid ${opt.icon}`} aria-hidden="true" />}
              <span>{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Slider({ label, value, min, max, step, unit, onChange, hint }) {
  return (
    <div className="grid gap-spacing-md">
      <div className="flex items-end justify-between gap-spacing-md">
        <span className="text-sm font-semibold text-blue-dianne/70 uppercase tracking-wide">{label}</span>
        <span className="text-blue-dianne font-bold text-lg leading-none">
          {value}
          <span className="text-sm font-semibold text-blue-dianne/60"> {unit}</span>
        </span>
      </div>
      <input
        type="range"
        className="hcs-range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={rangeStyle(value, min, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} : ${value} ${unit}`}
      />
      {hint && <span className="text-sm text-blue-dianne/55">{hint}</span>}
    </div>
  )
}

export default function HomeChargingSimulator() {
  const [vehicle, setVehicle] = useState('berline')
  const [battery, setBattery] = useState(60)
  const [dailyKm, setDailyKm] = useState(40)
  const [phase, setPhase] = useState('mono')
  const [windowH, setWindowH] = useState(8)
  const [winter, setWinter] = useState(false)

  const result = useMemo(() => {
    const vt = vehicleTypes.find((v) => v.id === vehicle)
    const conso = vt.conso * (winter ? 1.2 : 1) // kWh / 100 km
    const kmPerKwh = 100 / conso
    const dailyEnergy = (dailyKm * conso) / 100 // kWh needed per day

    const available = chargers.filter((c) => phase === 'tri' || c.phase === 'mono')

    const rows = available.map((c) => {
      const effP = c.power * AC_EFFICIENCY
      const dailyTime = dailyEnergy / effP // h to recover the day's driving
      const fullTime = (battery * 0.6) / effP // h for a healthy 20→80 % charge
      return {
        ...c,
        effP,
        dailyTime,
        fullTime,
        kmPerHour: effP * kmPerKwh,
        fitsWindow: dailyTime <= windowH,
      }
    })

    // Recommend a real wallbox (≥ 7.4 kW) — a bare socket is never the advised
    // daily solution. Pick the smallest wallbox that comfortably recovers the
    // day's driving inside the window (15 % margin); otherwise the most powerful
    // wallbox the installation supports. Plugs still appear in the comparison.
    const wallboxes = rows.filter((r) => r.power >= 7.4)
    const comfy = wallboxes.find((r) => r.dailyTime <= windowH * 0.85)
    const recommended = comfy || wallboxes[wallboxes.length - 1]

    const batteryUse = Math.min(100, (dailyEnergy / battery) * 100)
    const dailyCost = dailyEnergy * HOME_RATE
    const maxTime = Math.max(...rows.map((r) => r.dailyTime))

    return { rows, recommended, dailyEnergy, batteryUse, dailyCost, maxTime, conso, kmPerKwh }
  }, [vehicle, battery, dailyKm, phase, windowH, winter])

  const { recommended: rec } = result
  const fits = rec.fitsWindow
  const phaseLabel = phase === 'tri' ? 'triphasée' : 'monophasée'

  const verdict = fits
    ? `Recharge vos ${dailyKm} km quotidiens en ${fmtHM(rec.dailyTime)} — largement dans votre fenêtre de ${windowH} h.`
    : `Vos ${dailyKm} km/jour demandent ${fmtHM(rec.dailyTime)} de recharge, au-delà de votre fenêtre de ${windowH} h. Voici l'option la plus rapide compatible avec une installation ${phaseLabel}.`

  return (
    <section className="bg-white relative xl:py-spacing-9xl py-spacing-7xl">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto">
        <div className="grid gap-spacing-6xl">
          {/* Heading */}
          <div className="grid gap-spacing-3xl text-center max-w-[820px] mx-auto">
            <span className="inline-flex items-center gap-spacing-sm px-spacing-md py-spacing-sm rounded-full bg-lime text-black text-sm font-semibold w-fit mx-auto">
              <i className="fa-solid fa-sliders" aria-hidden="true" /> Simulateur de besoins
            </span>
            <h2 className="tracking-tight m-0">Quelle borne de recharge vous faut-il&nbsp;?</h2>
            <div className="m-0">
              <p>
                Décrivez votre véhicule et vos habitudes : nous estimons la solution de recharge idéale pour votre
                domicile, le temps de charge chaque nuit et le coût de l'énergie.
              </p>
            </div>
          </div>

          <div className="grid gap-spacing-4xl xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-start">
            {/* ── Configuration ─────────────────────────────── */}
            <div className="bg-surface rounded-3xl p-spacing-5xl md:p-spacing-6xl grid gap-spacing-5xl">
              <Segmented
                label="Type de véhicule"
                value={vehicle}
                onChange={setVehicle}
                options={vehicleTypes.map((v) => ({ id: v.id, label: v.label, icon: v.icon }))}
              />

              <div className="grid gap-spacing-md">
                <Slider
                  label="Capacité de la batterie"
                  value={battery}
                  min={20}
                  max={120}
                  step={1}
                  unit="kWh"
                  onChange={setBattery}
                />
                <div className="flex flex-wrap gap-spacing-sm">
                  {batteryChips.map((chip) => {
                    const on = battery === chip.kwh
                    return (
                      <button
                        type="button"
                        key={chip.kwh}
                        onClick={() => setBattery(chip.kwh)}
                        title={`${chip.name} · ${chip.kwh} kWh`}
                        className={`rounded-full px-spacing-md py-spacing-xs text-xs font-semibold border transition-colors duration-150 cursor-pointer ${
                          on
                            ? 'bg-blue-dianne text-white border-blue-dianne'
                            : 'bg-white text-blue-dianne/70 border-black/10 hover:border-blue-dianne/40'
                        }`}
                      >
                        {chip.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Slider
                label="Trajet quotidien"
                value={dailyKm}
                min={10}
                max={200}
                step={5}
                unit="km / jour"
                onChange={setDailyKm}
                hint={`Soit ~${result.dailyEnergy.toFixed(1)} kWh à recharger chaque jour`}
              />

              <Segmented
                label="Installation électrique"
                value={phase}
                onChange={setPhase}
                options={[
                  { id: 'mono', label: 'Monophasé' },
                  { id: 'tri', label: 'Triphasé' },
                ]}
              />

              <Slider
                label="Fenêtre de recharge la nuit"
                value={windowH}
                min={3}
                max={14}
                step={1}
                unit="h"
                onChange={setWindowH}
                hint="Heures pendant lesquelles la voiture est branchée (ex. 22 h → 6 h)"
              />

              <Segmented
                label="Conditions"
                value={winter ? 'winter' : 'normal'}
                onChange={(id) => setWinter(id === 'winter')}
                options={[
                  { id: 'normal', label: 'Tempéré', icon: 'fa-sun' },
                  { id: 'winter', label: 'Hiver', icon: 'fa-snowflake' },
                ]}
              />
            </div>

            {/* ── Results ────────────────────────────────────── */}
            <div className="grid gap-spacing-3xl content-start">
              {/* Recommended solution */}
              <div className="relative bg-blue-dianne rounded-3xl p-spacing-5xl md:p-spacing-6xl text-white overflow-hidden">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-pear/20 blur-3xl"
                />
                <div className="relative grid gap-spacing-2xl">
                  <span className="text-sm font-semibold uppercase tracking-wide text-pear">
                    Notre recommandation
                  </span>
                  <div className="flex items-center gap-spacing-xl">
                    <span className="shrink-0 w-16 h-16 rounded-2xl bg-pear flex items-center justify-center">
                      <i className={`fa-solid ${rec.icon} text-3xl text-blue-dianne`} aria-hidden="true" />
                    </span>
                    <div className="grid gap-spacing-xs">
                      <span className="text-2xl font-bold leading-tight">{rec.label}</span>
                      <span className="text-white/70 text-sm">
                        {rec.power.toString().replace('.', ',')} kW · {rec.amp} · {rec.phase === 'tri' ? 'Triphasé' : 'Monophasé'}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/85 m-0">{verdict}</p>
                </div>
              </div>

              {/* Stat tiles */}
              <div className="grid grid-cols-3 gap-spacing-md">
                {[
                  { icon: 'fa-clock', value: fmtHM(rec.dailyTime), label: 'Recharge / nuit' },
                  { icon: 'fa-road', value: `${Math.round(rec.kmPerHour)} km/h`, label: 'Récupérés' },
                  { icon: 'fa-wallet', value: `${result.dailyCost.toFixed(1)} DH`, label: 'Coût / jour' },
                ].map((t) => (
                  <div key={t.label} className="bg-surface rounded-2xl p-spacing-2xl grid gap-spacing-xs text-center">
                    <i className={`fa-solid ${t.icon} text-lime text-lg`} aria-hidden="true" />
                    <span className="font-bold text-blue-dianne leading-tight text-base md:text-lg">{t.value}</span>
                    <span className="text-xs text-blue-dianne/60 leading-tight">{t.label}</span>
                  </div>
                ))}
              </div>

              {/* Daily battery usage meter */}
              <div className="bg-surface rounded-2xl p-spacing-3xl grid gap-spacing-md">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-blue-dianne">Batterie utilisée par jour</span>
                  <span className="font-bold text-blue-dianne">{Math.round(result.batteryUse)}%</span>
                </div>
                <div className="flex items-center gap-spacing-xs" aria-hidden="true">
                  <div className="relative flex-1 h-6 rounded-lg bg-white border-2 border-blue-dianne/15 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-md transition-[width] duration-500 ease-out"
                      style={{
                        width: `${Math.max(3, result.batteryUse)}%`,
                        background: 'linear-gradient(90deg, #163E4C, #C8D72D)',
                      }}
                    />
                  </div>
                  <span className="w-1.5 h-3 rounded-r bg-blue-dianne/25" />
                </div>
                <span className="text-xs text-blue-dianne/55">
                  Une charge complète (20 → 80 %) prend {fmtHM(rec.fullTime)} avec la {rec.label.toLowerCase()}.
                </span>
              </div>

              {/* Comparison of all compatible options */}
              <div className="bg-surface rounded-2xl p-spacing-3xl grid gap-spacing-lg">
                <span className="font-semibold text-blue-dianne text-sm">
                  Temps pour recharger votre trajet quotidien
                </span>
                <div className="grid gap-spacing-md">
                  {result.rows.map((r) => {
                    const isRec = r.id === rec.id
                    const width = Math.max(6, (r.dailyTime / result.maxTime) * 100)
                    const barColor = !r.fitsWindow ? '#fe5716' : isRec ? '#C8D72D' : 'rgba(22,62,76,0.55)'
                    return (
                      <div key={r.id} className="grid gap-spacing-xs">
                        <div className="flex items-center justify-between gap-spacing-md text-sm">
                          <span className={`flex items-center gap-spacing-sm ${isRec ? 'font-bold text-blue-dianne' : 'text-blue-dianne/75'}`}>
                            <i className={`fa-solid ${r.icon} w-4 text-center`} aria-hidden="true" />
                            {r.label}
                            {isRec && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-lime text-black text-[11px] font-bold px-2 py-0.5">
                                <i className="fa-solid fa-check" aria-hidden="true" /> Conseillé
                              </span>
                            )}
                          </span>
                          <span className={`shrink-0 font-semibold ${r.fitsWindow ? 'text-blue-dianne' : 'text-orange'}`}>
                            {fmtHM(r.dailyTime)}
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-white overflow-hidden">
                          <div
                            className="h-full rounded-full transition-[width] duration-500 ease-out"
                            style={{ width: `${width}%`, background: barColor }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <span className="text-xs text-blue-dianne/55">
                  <i className="fa-solid fa-circle text-orange text-[7px] align-middle mr-1" aria-hidden="true" />
                  En orange : au-delà de votre fenêtre de recharge de {windowH} h.
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-spacing-md pt-spacing-xs">
                <button type="button" className="btn btn-primary" onClick={openCtaForm}>
                  Demander mon étude technique gratuite
                </button>
                <span className="text-xs text-blue-dianne/55 max-w-[240px]">
                  Estimations indicatives · tarif énergie ~{HOME_RATE.toString().replace('.', ',')} DH/kWh.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hcs-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
        }
        .hcs-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #163E4C;
          border: 4px solid #C8D72D;
          box-shadow: 0 2px 8px rgba(18, 61, 51, 0.35);
          cursor: grab;
          transition: transform 0.15s ease;
        }
        .hcs-range::-webkit-slider-thumb:active { transform: scale(1.12); cursor: grabbing; }
        .hcs-range::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #163E4C;
          border: 4px solid #C8D72D;
          box-shadow: 0 2px 8px rgba(18, 61, 51, 0.35);
          cursor: grab;
        }
        .hcs-range:focus-visible::-webkit-slider-thumb { outline: 2px solid #163E4C; outline-offset: 2px; }
        .hcs-range:focus-visible::-moz-range-thumb { outline: 2px solid #163E4C; outline-offset: 2px; }
      `}</style>
    </section>
  )
}
