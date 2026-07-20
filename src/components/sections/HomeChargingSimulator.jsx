import { useMemo, useState } from 'react'
import {
  HOME_CHARGING_VEHICLES,
  HOME_ENERGY_RATE,
  calculateHomeChargingScenario,
  formatChargingTime,
} from '../../lib/homeChargingCalculator'

const batteryPresets = [
  { value: 27, label: 'Dacia Spring' },
  { value: 40, label: 'Renault Zoe' },
  { value: 60, label: 'Tesla Model 3' },
  { value: 77, label: 'VW ID.4' },
  { value: 100, label: 'Grande batterie' },
]

const openCtaForm = () => window.dispatchEvent(new CustomEvent('floating-cta-form:open'))

const normalizeRangeValue = (value, min, max, step) => {
  const numeric = Number(value)
  const safe = Number.isFinite(numeric) ? numeric : min
  const snapped = min + Math.round((safe - min) / step) * step
  return Math.min(max, Math.max(min, snapped))
}

function ChoiceGroup({ label, options, value, onChange }) {
  return (
    <fieldset className="grid gap-spacing-md">
      <legend className="text-sm font-semibold text-blue-dianne/65 uppercase tracking-wide mb-spacing-md">{label}</legend>
      <div className="flex flex-wrap gap-spacing-sm">
        {options.map((option) => {
          const active = option.id === value
          return (
            <button
              type="button"
              key={option.id}
              onClick={() => onChange(option.id)}
              aria-pressed={active}
              className={`min-h-12 flex-1 min-w-[105px] rounded-2xl border px-spacing-md py-spacing-md text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'border-blue-dianne bg-blue-dianne text-white shadow-[0_12px_24px_-17px_rgba(22,62,76,.9)] -translate-y-0.5'
                  : 'border-black/10 bg-white text-blue-dianne hover:border-blue-dianne/35 hover:-translate-y-0.5'
              }`}
            >
              {option.icon && <i className={`fa-solid ${option.icon} mr-spacing-xs ${active ? 'text-pear' : 'text-lime'}`} aria-hidden="true" />}
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function RangeControl({ id, label, value, min, max, step, unit, onChange, hint }) {
  const safeValue = normalizeRangeValue(value, min, max, step)
  const progress = ((safeValue - min) / (max - min)) * 100
  const update = (event) => onChange(normalizeRangeValue(event.target.value, min, max, step))

  return (
    <div className="grid gap-spacing-md">
      <div className="flex items-center justify-between gap-spacing-md">
        <label htmlFor={id} className="text-sm font-semibold text-blue-dianne/65 uppercase tracking-wide">{label}</label>
        <output htmlFor={id} className="rounded-full bg-white px-spacing-md py-spacing-xs font-bold text-blue-dianne tabular-nums shadow-sm">
          {safeValue} <span className="text-sm font-semibold text-blue-dianne/55">{unit}</span>
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onInput={update}
        onChange={update}
        style={{ '--range-progress': `${progress}%` }}
        className="simulator-range"
      />
      <div className="flex justify-between text-xs text-blue-dianne/45" aria-hidden="true">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
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

  const result = useMemo(() => calculateHomeChargingScenario({
    vehicleId: vehicle,
    batteryCapacity: battery,
    dailyDistance: dailyKm,
    phase,
    chargingWindow: windowH,
    winter,
  }), [vehicle, battery, dailyKm, phase, windowH, winter])

  const rec = result.recommended
  const phaseLabel = phase === 'tri' ? 'triphasée' : 'monophasée'
  const verdict = result.exceedsBatteryRange
    ? `Ce trajet dépasse l’autonomie théorique estimée de ${Math.round(result.estimatedRangeKm)} km. Une recharge intermédiaire sera nécessaire.`
    : rec.fitsWindow
      ? `Recharge vos ${dailyKm} km quotidiens en ${formatChargingTime(rec.dailyTime)}, dans votre fenêtre de ${windowH} h.`
      : `Le trajet demande plus de ${windowH} h. Voici l’option la plus rapide compatible avec une installation ${phaseLabel}.`

  return (
    <section className="bg-white py-spacing-6xl xl:py-spacing-8xl">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto grid gap-spacing-5xl">
        <div className="max-w-[800px] mx-auto text-center grid gap-spacing-lg">
          <span className="inline-flex w-fit mx-auto items-center gap-spacing-sm rounded-full bg-lime px-spacing-md py-spacing-sm text-sm font-semibold text-black">
            <i className="fa-solid fa-sliders" aria-hidden="true" /> Simulateur de besoins
          </span>
          <h2 className="tracking-tight m-0">Quelle borne de recharge vous faut-il ?</h2>
          <p className="m-0 text-blue-dianne/70">Ajustez votre véhicule et vos habitudes. Les résultats se recalculent instantanément pendant vos changements.</p>
        </div>

        <div className="grid xl:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] gap-spacing-4xl items-start">
          <div className="rounded-3xl bg-surface p-spacing-4xl md:p-spacing-5xl grid gap-spacing-4xl">
            <ChoiceGroup
              label="Type de véhicule"
              value={vehicle}
              onChange={setVehicle}
              options={HOME_CHARGING_VEHICLES.map((item) => ({ id: item.id, label: item.label, icon: item.icon }))}
            />

            <div className="grid gap-spacing-md">
              <RangeControl id="simulator-battery" label="Capacité de la batterie" value={battery} min={20} max={120} step={1} unit="kWh" onChange={setBattery} />
              <div className="flex flex-wrap gap-spacing-sm">
                {batteryPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.value}
                    onClick={() => setBattery(preset.value)}
                    aria-pressed={battery === preset.value}
                    title={`${preset.label} · ${preset.value} kWh`}
                    className={`rounded-full border px-spacing-md py-spacing-xs text-xs font-semibold transition-all ${
                      battery === preset.value
                        ? 'border-blue-dianne bg-blue-dianne text-white'
                        : 'border-black/10 bg-white text-blue-dianne hover:border-blue-dianne/35'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <RangeControl
              id="simulator-distance"
              label="Trajet quotidien"
              value={dailyKm}
              min={10}
              max={250}
              step={5}
              unit="km / jour"
              onChange={setDailyKm}
              hint={`Environ ${result.dailyBatteryEnergy.toFixed(1).replace('.', ',')} kWh à restituer chaque jour`}
            />

            <ChoiceGroup
              label="Installation électrique"
              value={phase}
              onChange={setPhase}
              options={[
                { id: 'mono', label: 'Monophasé', icon: 'fa-house' },
                { id: 'tri', label: 'Triphasé', icon: 'fa-industry' },
              ]}
            />

            <RangeControl
              id="simulator-window"
              label="Fenêtre de recharge la nuit"
              value={windowH}
              min={3}
              max={14}
              step={1}
              unit="h"
              onChange={setWindowH}
              hint="Par exemple, de 22 h à 6 h correspond à une fenêtre de 8 h."
            />

            <ChoiceGroup
              label="Conditions"
              value={winter ? 'winter' : 'normal'}
              onChange={(id) => setWinter(id === 'winter')}
              options={[
                { id: 'normal', label: 'Tempéré', icon: 'fa-sun' },
                { id: 'winter', label: 'Hiver', icon: 'fa-snowflake' },
              ]}
            />
          </div>

          <div className="grid gap-spacing-3xl content-start" aria-live="polite">
            <div className="relative overflow-hidden rounded-3xl bg-blue-dianne p-spacing-5xl md:p-spacing-6xl text-white">
              <span aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-pear/20 blur-3xl" />
              <div className="relative grid gap-spacing-2xl">
                <span className="text-sm font-semibold uppercase tracking-wide text-pear">Notre recommandation</span>
                <div className="flex items-center gap-spacing-xl">
                  <span className="w-16 h-16 shrink-0 rounded-2xl bg-pear text-blue-dianne flex items-center justify-center">
                    <i className={`fa-solid ${rec.icon} text-3xl`} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="m-0 text-white text-2xl">{rec.label}</h3>
                    <span className="text-white/65">{String(rec.power).replace('.', ',')} kW · {rec.amp} · {rec.phase === 'tri' ? 'Triphasé' : 'Monophasé'}</span>
                  </div>
                </div>
                <p className="m-0 text-white/85">{verdict}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-spacing-md">
              {[
                { icon: 'fa-clock', value: formatChargingTime(rec.dailyTime), label: 'Recharge / nuit' },
                { icon: 'fa-road', value: `${Math.round(rec.kmPerHour)} km/h`, label: 'Récupérés' },
                { icon: 'fa-wallet', value: `${result.dailyCost.toFixed(1)} DH`, label: 'Coût / jour' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-surface p-spacing-2xl text-center grid gap-spacing-xs transition-transform hover:-translate-y-1">
                  <i className={`fa-solid ${item.icon} text-lime text-lg`} aria-hidden="true" />
                  <strong className="text-lg text-blue-dianne tabular-nums">{item.value}</strong>
                  <span className="text-xs text-blue-dianne/60">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-surface p-spacing-3xl grid gap-spacing-md">
              <div className="flex justify-between gap-spacing-md text-sm">
                <span className="font-semibold text-blue-dianne">Batterie utilisée par jour</span>
                <strong className={result.exceedsBatteryRange ? 'text-orange' : 'text-blue-dianne'}>{Math.round(result.batteryUsePercent)} %</strong>
              </div>
              <div className="flex items-center gap-spacing-xs">
                <div className="relative h-6 flex-1 overflow-hidden rounded-lg border-2 border-blue-dianne/15 bg-white">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-md transition-[width] duration-300 ${result.exceedsBatteryRange ? 'bg-orange' : 'bg-gradient-to-r from-blue-dianne to-lime'}`}
                    style={{ width: `${Math.max(3, result.batteryMeterPercent)}%` }}
                  />
                </div>
                <span className="h-3 w-1.5 rounded-r bg-blue-dianne/25" />
              </div>
              <span className={`text-xs ${result.exceedsBatteryRange ? 'font-semibold text-orange' : 'text-blue-dianne/55'}`}>
                {result.exceedsBatteryRange
                  ? 'Le trajet dépasse la capacité sélectionnée : prévoyez une recharge en cours de route.'
                  : `Une recharge de 20 à 80 % prend ${formatChargingTime(rec.fullTime)} avec cette solution.`}
              </span>
            </div>

            <div className="rounded-2xl bg-surface p-spacing-3xl grid gap-spacing-lg">
              <span className="font-semibold text-blue-dianne text-sm">Temps pour recharger votre trajet quotidien</span>
              <div className="grid gap-spacing-md">
                {result.rows.map((row) => {
                  const recommended = row.id === rec.id
                  const width = Math.max(6, (row.dailyTime / result.maxTime) * 100)
                  return (
                    <div key={row.id} className="grid gap-spacing-xs">
                      <div className="flex items-center justify-between gap-spacing-md text-sm">
                        <span className={`flex items-center gap-spacing-sm ${recommended ? 'font-bold text-blue-dianne' : 'text-blue-dianne/75'}`}>
                          <i className={`fa-solid ${row.icon} w-4 text-center`} aria-hidden="true" />
                          {row.label}
                          {recommended && <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-bold text-black">Conseillé</span>}
                        </span>
                        <strong className={row.fitsWindow ? 'text-blue-dianne' : 'text-orange'}>{formatChargingTime(row.dailyTime)}</strong>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-white">
                        <div
                          className={`h-full rounded-full transition-[width] duration-300 ${!row.fitsWindow ? 'bg-orange' : recommended ? 'bg-lime' : 'bg-blue-dianne/55'}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <span className="text-xs text-blue-dianne/55"><i className="fa-solid fa-circle text-orange text-[7px] mr-1" aria-hidden="true" /> En orange : au-delà de votre fenêtre de {windowH} h.</span>
            </div>

            <div className="flex flex-wrap items-center gap-spacing-md">
              <button type="button" className="btn btn-primary" onClick={openCtaForm}>Demander mon étude technique gratuite</button>
              <span className="max-w-[250px] text-xs text-blue-dianne/55">Estimations indicatives · pertes AC de 10 % incluses · tarif moyen de {String(HOME_ENERGY_RATE).replace('.', ',')} DH/kWh.</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .simulator-range {
          --range-progress: 0%;
          appearance: none;
          -webkit-appearance: none;
          width: 100%;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(to right, #163e4c var(--range-progress), #dedbd1 var(--range-progress));
          cursor: pointer;
          outline: none;
        }
        .simulator-range::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
          border: 4px solid #c8d72d;
          border-radius: 50%;
          background: #163e4c;
          box-shadow: 0 3px 10px rgba(22, 62, 76, .3);
          transition: transform .15s ease;
        }
        .simulator-range:active::-webkit-slider-thumb { transform: scale(1.12); }
        .simulator-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border: 4px solid #c8d72d;
          border-radius: 50%;
          background: #163e4c;
          box-shadow: 0 3px 10px rgba(22, 62, 76, .3);
        }
        .simulator-range:focus-visible::-webkit-slider-thumb { outline: 3px solid white; box-shadow: 0 0 0 5px #163e4c; }
        .simulator-range:focus-visible::-moz-range-thumb { outline: 3px solid white; box-shadow: 0 0 0 5px #163e4c; }
      `}</style>
    </section>
  )
}
