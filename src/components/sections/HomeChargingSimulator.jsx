import { useMemo, useState } from 'react'
import {
  CHARGER_POWER_PRESETS,
  ELECTRICAL_SUPPLIES,
  HOME_ENERGY_RATE,
  ONEE_RESIDENTIAL_RATES,
  calculateHomeChargingScenario,
  formatChargingTime,
} from '../../lib/homeChargingCalculator'

const batteryPresets = [
  { value: 27, label: 'Citadine' },
  { value: 40, label: 'Compacte' },
  { value: 60, label: 'Berline' },
  { value: 77, label: 'SUV' },
  { value: 100, label: 'Grande batterie' },
]

const amperagePresets = [10, 16, 20, 25, 32, 40, 63]
const openCtaForm = () => window.dispatchEvent(new CustomEvent('floating-cta-form:open'))

const normalizeRangeValue = (value, min, max, step) => {
  const numeric = Number(value)
  const safe = Number.isFinite(numeric) ? numeric : min
  const snapped = min + Math.round((safe - min) / step) * step
  return Math.min(max, Math.max(min, Number(snapped.toFixed(4))))
}

const formatNumber = (value, maximumFractionDigits = 1) => new Intl.NumberFormat('fr-MA', {
  minimumFractionDigits: 0,
  maximumFractionDigits,
}).format(value)

const formatMoney = (value) => new Intl.NumberFormat('fr-MA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(value)

function SectionHeading({ id, number, title, description }) {
  return (
    <div className="flex items-start gap-spacing-md">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-dianne text-xs font-bold text-white">{number}</span>
      <div className="grid gap-1">
        <h3 id={id} className="m-0 text-lg text-blue-dianne">{title}</h3>
        {description && <p className="m-0 text-sm text-blue-dianne/60">{description}</p>}
      </div>
    </div>
  )
}

function ChoiceGroup({ label, options, value, onChange, compact = false }) {
  return (
    <fieldset className="grid gap-spacing-md">
      {label && <legend className="sr-only">{label}</legend>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-spacing-sm">
        {options.map((option) => {
          const active = option.id === value
          return (
            <button
              type="button"
              key={option.id}
              onClick={() => onChange(option.id)}
              aria-pressed={active}
              className={`${compact ? 'min-h-16' : 'min-h-20'} rounded-2xl border px-spacing-md py-spacing-md text-left transition-all duration-200 ${
                active
                  ? 'border-blue-dianne bg-blue-dianne text-white shadow-[0_12px_24px_-17px_rgba(22,62,76,.9)] -translate-y-0.5'
                  : 'border-black/10 bg-white text-blue-dianne hover:border-blue-dianne/35 hover:-translate-y-0.5'
              }`}
            >
              <span className="flex items-center gap-spacing-sm font-bold">
                {option.icon && <i className={`fa-solid ${option.icon} ${active ? 'text-pear' : 'text-lime'}`} aria-hidden="true" />}
                {option.label}
              </span>
              {option.detail && <span className={`mt-1 block text-xs ${active ? 'text-white/65' : 'text-blue-dianne/50'}`}>{option.detail}</span>}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function RangeControl({ id, label, value, min, max, step, unit, onChange, hint }) {
  const safeValue = normalizeRangeValue(value, min, max, step)
  const progress = max === min ? 100 : ((safeValue - min) / (max - min)) * 100
  const update = (event) => onChange(normalizeRangeValue(event.target.value, min, max, step))

  return (
    <div className="grid gap-spacing-md">
      <div className="flex items-center justify-between gap-spacing-md">
        <label htmlFor={id} className="text-sm font-semibold text-blue-dianne">{label}</label>
        <output htmlFor={id} className="rounded-full bg-white px-spacing-md py-spacing-xs font-bold text-blue-dianne tabular-nums shadow-sm">
          {String(safeValue).replace('.', ',')} <span className="text-sm font-semibold text-blue-dianne/55">{unit}</span>
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
        <span>{String(min).replace('.', ',')} {unit}</span>
        <span>{String(max).replace('.', ',')} {unit}</span>
      </div>
      {hint && <span className="text-xs leading-relaxed text-blue-dianne/55">{hint}</span>}
    </div>
  )
}

function PresetButtons({ options, value, onChange, valueKey = 'value' }) {
  return (
    <div className="flex flex-wrap gap-spacing-sm">
      {options.map((option) => {
        const optionValue = option[valueKey]
        const active = Math.abs(Number(value) - Number(optionValue)) < 0.001
        return (
          <button
            type="button"
            key={optionValue}
            onClick={() => onChange(optionValue)}
            aria-pressed={active}
            className={`rounded-full border px-spacing-md py-spacing-xs text-xs font-semibold transition-all ${
              active
                ? 'border-blue-dianne bg-blue-dianne text-white'
                : 'border-black/10 bg-white text-blue-dianne hover:border-blue-dianne/35'
            }`}
          >
            {option.label || `${optionValue} A`}
            {option.detail && <span className={active ? 'text-white/60' : 'text-blue-dianne/45'}> · {option.detail}</span>}
          </button>
        )
      })}
    </div>
  )
}

export default function HomeChargingSimulator() {
  const [battery, setBattery] = useState(60)
  const [startLevel, setStartLevel] = useState(20)
  const [targetLevel, setTargetLevel] = useState(80)
  const [chargerPower, setChargerPower] = useState(7.4)
  const [supplyId, setSupplyId] = useState('mono-220')
  const [customVoltage, setCustomVoltage] = useState(220)
  const [customPhases, setCustomPhases] = useState(1)
  const [amperage, setAmperage] = useState(32)
  const [windowH, setWindowH] = useState(8)
  const [energyRate, setEnergyRate] = useState(HOME_ENERGY_RATE)

  const result = useMemo(() => calculateHomeChargingScenario({
    batteryCapacity: battery,
    startLevel,
    targetLevel,
    chargerPower,
    supplyId,
    customVoltage,
    customPhases,
    amperage,
    chargingWindow: windowH,
    energyRate,
  }), [
    battery,
    startLevel,
    targetLevel,
    chargerPower,
    supplyId,
    customVoltage,
    customPhases,
    amperage,
    windowH,
    energyRate,
  ])

  const recommendations = useMemo(() => {
    const items = []
    const supplyLabel = result.supply.phases === 3 ? 'triphasé' : 'monophasé'

    if (result.supplyLimited) {
      items.push({
        icon: 'fa-gauge-high',
        title: 'Le réseau limite la borne',
        text: `Votre configuration ${supplyLabel} fournit environ ${formatNumber(result.supply.power, 2)} kW. La borne de ${formatNumber(result.chargerPower)} kW fonctionnera donc au maximum à cette puissance.`,
      })
    }

    if (result.chargerPower >= 11 && result.supply.phases === 1) {
      items.push({
        icon: 'fa-arrows-rotate',
        title: 'Triphasé conseillé',
        text: 'Pour exploiter réellement 11 ou 22 kW en AC, une alimentation triphasée et un véhicule compatible sont généralement nécessaires.',
      })
    }

    if (!result.fitsWindow) {
      const possibleWithCurrentSupply = result.requiredGridPower <= result.supply.power && result.requiredGridPower <= 22
      items.push({
        icon: 'fa-clock',
        title: `Plus de ${windowH} h nécessaires`,
        text: possibleWithCurrentSupply
          ? `Une puissance d’au moins ${formatNumber(result.suggestedChargerPower)} kW permettrait de tenir cette fenêtre, sous réserve de la puissance acceptée par le véhicule.`
          : `Cette recharge demande environ ${formatNumber(result.requiredGridPower)} kW au compteur. Réduisez l’objectif, rechargez plus longtemps ou faites vérifier une évolution de l’installation.`,
      })
    } else {
      items.push({
        icon: 'fa-moon',
        title: 'Recharge compatible avec votre nuit',
        text: `La session se termine avec environ ${formatChargingTime(result.chargingWindow - result.chargingTime)} de marge sur votre fenêtre de ${windowH} h.`,
      })
    }

    if (result.energyRate >= 1.59) {
      items.push({
        icon: 'fa-coins',
        title: 'Vérifiez le tarif bi-horaire',
        text: 'Au-delà de 500 kWh/mois, l’ONEE indique qu’un compteur bi-horaire peut être proposé. Décaler la recharge hors pointe peut réduire le coût.',
      })
    }

    return items.slice(0, 3)
  }, [result, windowH])

  const selectedRate = ONEE_RESIDENTIAL_RATES.find((tier) => Math.abs(Number(energyRate) - tier.rate) < 0.00005)?.id
  const maxComparisonPower = Math.max(result.chargerPower, result.supply.power, 1)
  const comparisonRows = [
    { label: 'Puissance de la borne', value: result.chargerPower, color: 'bg-blue-dianne/45' },
    { label: 'Capacité électrique calculée', value: result.supply.power, color: 'bg-lime' },
    { label: 'Puissance réellement utilisée', value: result.effectiveGridPower, color: 'bg-pear' },
  ]

  return (
    <section className="bg-white py-spacing-6xl xl:py-spacing-8xl">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto grid gap-spacing-5xl">
        <div className="max-w-[820px] mx-auto text-center grid gap-spacing-lg">
          <span className="inline-flex w-fit mx-auto items-center gap-spacing-sm rounded-full bg-lime px-spacing-md py-spacing-sm text-sm font-semibold text-black">
            <i className="fa-solid fa-bolt" aria-hidden="true" /> Estimation instantanée
          </span>
          <h2 className="tracking-tight m-0">Combien coûtera votre recharge à domicile&nbsp;?</h2>
          <p className="m-0 text-blue-dianne/70">Configurez la batterie, la borne et votre compteur. Le simulateur tient compte de la limite électrique de l’installation et des pertes de recharge.</p>
        </div>

        <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(420px,.92fr)] gap-spacing-4xl items-start">
          <div className="rounded-3xl bg-surface p-spacing-3xl md:p-spacing-5xl grid gap-spacing-5xl">
            <section className="grid gap-spacing-3xl" aria-labelledby="battery-section-title">
              <SectionHeading id="battery-section-title" number="1" title="Votre batterie" description="Indiquez sa capacité et le niveau de charge souhaité." />
              <div className="grid gap-spacing-2xl">
                <RangeControl id="simulator-battery" label="Capacité utile" value={battery} min={20} max={120} step={1} unit="kWh" onChange={setBattery} />
                <PresetButtons options={batteryPresets} value={battery} onChange={setBattery} />
                <div className="grid sm:grid-cols-2 gap-spacing-2xl">
                  <RangeControl
                    id="simulator-start-level"
                    label="Départ"
                    value={startLevel}
                    min={0}
                    max={Math.max(0, targetLevel - 5)}
                    step={5}
                    unit="%"
                    onChange={setStartLevel}
                  />
                  <RangeControl
                    id="simulator-target-level"
                    label="Objectif"
                    value={targetLevel}
                    min={Math.min(100, startLevel + 5)}
                    max={100}
                    step={5}
                    unit="%"
                    onChange={setTargetLevel}
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-blue-dianne/10" />

            <section className="grid gap-spacing-3xl" aria-labelledby="charger-section-title">
              <SectionHeading id="charger-section-title" number="2" title="Votre borne" description="Choisissez sa puissance nominale, jusqu’à 22 kW." />
              <RangeControl
                id="simulator-charger-power"
                label="Puissance de la borne"
                value={chargerPower}
                min={1.4}
                max={22}
                step={0.1}
                unit="kW"
                onChange={setChargerPower}
                hint="La puissance réellement obtenue peut être plus basse selon le compteur et le chargeur embarqué du véhicule."
              />
              <PresetButtons options={CHARGER_POWER_PRESETS} value={chargerPower} onChange={setChargerPower} />
            </section>

            <div className="h-px bg-blue-dianne/10" />

            <section className="grid gap-spacing-3xl" aria-labelledby="supply-section-title">
              <SectionHeading id="supply-section-title" number="3" title="Votre compteur électrique" description="Sélectionnez la tension, le nombre de phases et l’ampérage disponible." />
              <ChoiceGroup
                label="Configuration du compteur"
                value={supplyId}
                onChange={setSupplyId}
                compact
                options={ELECTRICAL_SUPPLIES}
              />

              {supplyId === 'custom' && (
                <div className="grid sm:grid-cols-2 gap-spacing-md rounded-2xl border border-blue-dianne/10 bg-white p-spacing-lg">
                  <label className="grid gap-spacing-xs text-sm font-semibold text-blue-dianne" htmlFor="simulator-custom-voltage">
                    Tension personnalisée
                    <span className="relative">
                      <input
                        id="simulator-custom-voltage"
                        type="number"
                        min="100"
                        max="500"
                        step="1"
                        value={customVoltage}
                        onChange={(event) => setCustomVoltage(event.target.value)}
                        className="simulator-number-input"
                      />
                      <span className="simulator-input-suffix">V</span>
                    </span>
                  </label>
                  <fieldset className="grid gap-spacing-xs">
                    <legend className="text-sm font-semibold text-blue-dianne">Raccordement</legend>
                    <div className="grid grid-cols-2 gap-spacing-sm">
                      {[{ value: 1, label: 'Monophasé' }, { value: 3, label: 'Triphasé' }].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={customPhases === option.value}
                          onClick={() => setCustomPhases(option.value)}
                          className={`min-h-12 rounded-xl border px-spacing-sm text-xs font-bold ${
                            customPhases === option.value
                              ? 'border-blue-dianne bg-blue-dianne text-white'
                              : 'border-black/10 bg-surface text-blue-dianne'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <p className="m-0 text-xs text-blue-dianne/50 sm:col-span-2">En triphasé, renseignez la tension entre phases indiquée sur l’installation.</p>
                </div>
              )}

              <RangeControl
                id="simulator-amperage"
                label="Ampérage disponible"
                value={amperage}
                min={6}
                max={63}
                step={1}
                unit="A"
                onChange={setAmperage}
                hint="Utilisez l’ampérage réellement disponible pour la recharge, après les autres usages du logement."
              />
              <PresetButtons
                options={amperagePresets.map((value) => ({ value }))}
                value={amperage}
                onChange={setAmperage}
              />
              <div className="rounded-2xl bg-white p-spacing-lg flex items-center justify-between gap-spacing-lg">
                <span className="text-sm text-blue-dianne/65">Capacité théorique calculée</span>
                <strong className="text-blue-dianne tabular-nums">{formatNumber(result.supply.power, 2)} kW</strong>
              </div>
            </section>

            <div className="h-px bg-blue-dianne/10" />

            <section className="grid gap-spacing-3xl" aria-labelledby="tariff-section-title">
              <SectionHeading id="tariff-section-title" number="4" title="Votre tarif et votre temps disponible" description="Le prix est personnalisable selon votre facture." />
              <div className="grid gap-spacing-md">
                <span className="text-sm font-semibold text-blue-dianne">Tranches résidentielles ONEE · DH/kWh TTC</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-spacing-sm">
                  {ONEE_RESIDENTIAL_RATES.map((tier) => {
                    const active = selectedRate === tier.id
                    return (
                      <button
                        type="button"
                        key={tier.id}
                        onClick={() => setEnergyRate(tier.rate)}
                        aria-pressed={active}
                        className={`relative min-h-16 rounded-2xl border px-spacing-sm py-spacing-sm text-left transition-all ${
                          active
                            ? 'border-blue-dianne bg-blue-dianne text-white'
                            : 'border-black/10 bg-white text-blue-dianne hover:border-blue-dianne/35'
                        }`}
                      >
                        {tier.recommended && (
                          <span className="absolute -top-2 right-2 rounded-full bg-lime px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">Défaut</span>
                        )}
                        <span className="block text-[11px] opacity-65">{tier.label}</span>
                        <strong className="text-sm tabular-nums">{String(tier.rate.toFixed(4)).replace('.', ',')}</strong>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-spacing-2xl">
                <label className="grid gap-spacing-xs text-sm font-semibold text-blue-dianne" htmlFor="simulator-energy-rate">
                  Prix personnalisé
                  <span className="relative">
                    <input
                      id="simulator-energy-rate"
                      type="number"
                      inputMode="decimal"
                      min="0.01"
                      max="20"
                      step="0.0001"
                      value={energyRate}
                      onChange={(event) => setEnergyRate(event.target.value)}
                      className="simulator-number-input"
                    />
                    <span className="simulator-input-suffix">DH/kWh</span>
                  </span>
                </label>
                <div className="rounded-2xl border border-blue-dianne/10 bg-white p-spacing-lg grid content-center gap-1">
                  <span className="text-xs text-blue-dianne/50">Équivalent par watt-heure</span>
                  <strong className="text-sm text-blue-dianne tabular-nums">{formatNumber(result.wattHourRate, 6)} DH/Wh</strong>
                </div>
              </div>

              <RangeControl
                id="simulator-window"
                label="Temps disponible"
                value={windowH}
                min={2}
                max={14}
                step={1}
                unit="h"
                onChange={setWindowH}
                hint="Par exemple, de 22 h à 6 h correspond à 8 heures."
              />

              <p className="m-0 text-xs leading-relaxed text-blue-dianne/55">
                L’ONEE applique une facturation progressive jusqu’à 150 kWh/mois, puis sélective au-delà. Le coût réel dépend donc de la consommation totale du foyer.{' '}
                <a
                  href="https://www.one.ma/FR/pages/interne.asp?esp=1&id1=3&id2=113&t2=1"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-dianne underline decoration-lime decoration-2 underline-offset-2"
                >
                  Consulter les tarifs ONEE
                </a>
              </p>
            </section>
          </div>

          <aside className="grid gap-spacing-3xl content-start xl:sticky xl:top-32" aria-live="polite">
            <div className="relative overflow-hidden rounded-3xl bg-blue-dianne p-spacing-4xl md:p-spacing-5xl text-white">
              <span aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pear/20 blur-3xl" />
              <div className="relative grid gap-spacing-3xl">
                <div className="flex flex-wrap items-center justify-between gap-spacing-md">
                  <span className="text-sm font-semibold uppercase tracking-wide text-pear">Votre estimation</span>
                  <span className={`rounded-full px-spacing-md py-spacing-xs text-xs font-bold ${
                    result.fitsWindow ? 'bg-pear text-blue-dianne' : 'bg-orange text-white'
                  }`}>
                    {result.fitsWindow ? `Dans votre fenêtre de ${windowH} h` : `Dépasse ${windowH} h`}
                  </span>
                </div>

                <div>
                  <span className="block text-sm text-white/60">Temps de recharge estimé</span>
                  <strong className="mt-spacing-xs block text-4xl md:text-5xl leading-none tracking-tight tabular-nums">{formatChargingTime(result.chargingTime)}</strong>
                  <span className="mt-spacing-sm block text-sm text-white/65">pour passer de {result.startLevel} à {result.targetLevel} %</span>
                </div>

                <div className="h-px bg-white/15" />

                <div className="flex items-end justify-between gap-spacing-lg">
                  <div>
                    <span className="block text-sm text-white/60">Coût de la session</span>
                    <strong className="mt-spacing-xs block text-3xl text-pear tabular-nums">{formatMoney(result.cost)} DH</strong>
                  </div>
                  <i className="fa-solid fa-wallet text-3xl text-white/20" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-spacing-sm">
              {[
                { icon: 'fa-gauge-high', value: `${formatNumber(result.effectiveGridPower, 2)} kW`, label: 'Puissance utile' },
                { icon: 'fa-battery-three-quarters', value: `${formatNumber(result.batteryEnergy)} kWh`, label: 'Dans la batterie' },
                { icon: 'fa-plug-circle-bolt', value: `${formatNumber(result.gridEnergy)} kWh`, label: 'Au compteur' },
              ].map((item) => (
                <div key={item.label} className="min-w-0 rounded-2xl bg-surface p-spacing-lg text-center grid gap-spacing-xs">
                  <i className={`fa-solid ${item.icon} text-lime text-lg`} aria-hidden="true" />
                  <strong className="truncate text-base text-blue-dianne tabular-nums">{item.value}</strong>
                  <span className="text-[11px] leading-tight text-blue-dianne/55">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-surface p-spacing-3xl grid gap-spacing-lg">
              <div>
                <h3 className="m-0 text-lg text-blue-dianne">Ce qui détermine la vitesse</h3>
                <p className="m-0 mt-1 text-xs text-blue-dianne/55">La valeur la plus faible entre la borne et l’installation fixe la puissance disponible.</p>
              </div>
              <div className="grid gap-spacing-md">
                {comparisonRows.map((row) => (
                  <div key={row.label} className="grid gap-spacing-xs">
                    <div className="flex items-center justify-between gap-spacing-md text-xs">
                      <span className="text-blue-dianne/70">{row.label}</span>
                      <strong className="text-blue-dianne tabular-nums">{formatNumber(row.value, 2)} kW</strong>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white">
                      <div className={`h-full rounded-full transition-[width] duration-300 ${row.color}`} style={{ width: `${Math.max(4, (row.value / maxComparisonPower) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-dianne/10 bg-white p-spacing-3xl grid gap-spacing-lg">
              <div className="flex items-center gap-spacing-sm">
                <i className="fa-solid fa-lightbulb text-lime" aria-hidden="true" />
                <h3 className="m-0 text-lg text-blue-dianne">Conseils pour votre configuration</h3>
              </div>
              <div className="grid gap-spacing-lg">
                {recommendations.map((item) => (
                  <div key={item.title} className="flex items-start gap-spacing-md">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-blue-dianne">
                      <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                    </span>
                    <div>
                      <strong className="block text-sm text-blue-dianne">{item.title}</strong>
                      <p className="m-0 mt-1 text-xs leading-relaxed text-blue-dianne/60">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-surface p-spacing-3xl grid gap-spacing-md text-sm">
              <div className="flex justify-between gap-spacing-lg">
                <span className="text-blue-dianne/60">Énergie facturée</span>
                <strong className="text-blue-dianne">{formatNumber(result.gridEnergy, 2)} kWh</strong>
              </div>
              <div className="flex justify-between gap-spacing-lg">
                <span className="text-blue-dianne/60">Tarif appliqué</span>
                <strong className="text-blue-dianne">{formatNumber(result.energyRate, 4)} DH/kWh</strong>
              </div>
              <div className="h-px bg-blue-dianne/10" />
              <div className="flex justify-between gap-spacing-lg">
                <span className="font-semibold text-blue-dianne">Total estimé</span>
                <strong className="text-lg text-blue-dianne">{formatMoney(result.cost)} DH</strong>
              </div>
            </div>

            <div className="grid gap-spacing-md">
              <button type="button" className="btn btn-primary w-full justify-center" onClick={openCtaForm}>Valider mon installation avec un expert</button>
              <p className="m-0 text-center text-[11px] leading-relaxed text-blue-dianne/50">
                Estimation indicative avec 90 % de rendement AC. Hors frais fixes, autres consommations et éventuelle évolution de tranche. Faites valider le circuit, les protections et la puissance disponible par un électricien qualifié.
              </p>
            </div>
          </aside>
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
        .simulator-number-input {
          width: 100%;
          min-height: 48px;
          border: 1px solid rgba(22, 62, 76, .16);
          border-radius: 14px;
          background: white;
          padding: 10px 86px 10px 14px;
          color: #163e4c;
          font-weight: 700;
          outline: none;
        }
        .simulator-number-input:focus {
          border-color: #163e4c;
          box-shadow: 0 0 0 3px rgba(200, 215, 45, .45);
        }
        .simulator-input-suffix {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          color: rgba(22, 62, 76, .5);
          font-size: 12px;
          pointer-events: none;
        }
      `}</style>
    </section>
  )
}
