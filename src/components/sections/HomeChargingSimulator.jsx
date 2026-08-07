import { useEffect, useState } from 'react'
import {
  HOME_ENERGY_RATE,
  HOUSEHOLD_POWER_OPTIONS,
  ONEE_RESIDENTIAL_RATES,
  calculateHomeChargingScenario,
  formatChargingTime,
} from '../../lib/homeChargingCalculator'
import { fetchComparatorVehicles } from '../../lib/api/strapi'

const START_LEVELS = [10, 20, 30, 40, 50]
const TARGET_LEVELS = [80, 90, 100]
const CHARGING_WINDOWS = [6, 8, 10, 12]
const WEEKLY_FREQUENCIES = [1, 3, 5, 7]
const ONEE_RATE_SOURCE = 'https://www.one.org.ma/FR/pages/interne.asp?esp=1&id1=3&id2=113&t2=1'
const CUSTOM_VEHICLE_ID = 'custom'

const openCtaForm = () => window.dispatchEvent(new CustomEvent('floating-cta-form:open'))

const formatNumber = (value, maximumFractionDigits = 1) => new Intl.NumberFormat('fr-MA', {
  minimumFractionDigits: 0,
  maximumFractionDigits,
}).format(value)

const formatMoney = (value) => new Intl.NumberFormat('fr-MA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(value)

function StepHeading({ number, title, description, id }) {
  return (
    <div className="flex items-start gap-spacing-md">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-dianne text-sm font-bold text-white shadow-[0_8px_20px_-12px_rgba(22,62,76,.8)]">
        {number}
      </span>
      <div className="grid gap-1">
        <h3 id={id} className="m-0 text-lg text-blue-dianne">{title}</h3>
        <p className="m-0 text-sm leading-relaxed text-blue-dianne/60">{description}</p>
      </div>
    </div>
  )
}

function PillGroup({ label, options, value, onChange, suffix = '' }) {
  return (
    <fieldset className="grid gap-spacing-sm">
      <legend className="mb-spacing-sm text-xs font-bold uppercase tracking-wide text-blue-dianne/55">{label}</legend>
      <div className="flex flex-wrap gap-spacing-sm">
        {options.map((option) => {
          const active = Number(option) === Number(value)
          return (
            <button
              type="button"
              key={option}
              aria-pressed={active}
              onClick={() => onChange(option)}
              className={`min-h-11 rounded-full border px-spacing-lg py-spacing-sm text-sm font-bold tabular-nums transition-all ${
                active
                  ? 'border-blue-dianne bg-blue-dianne text-white shadow-[0_10px_20px_-16px_rgba(22,62,76,.9)]'
                  : 'border-blue-dianne/15 bg-white text-blue-dianne hover:border-blue-dianne/45'
              }`}
            >
              {option}{suffix}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function SummaryMetric({ icon, value, label, accent = false }) {
  return (
    <div className={`rounded-2xl p-spacing-lg ${accent ? 'bg-lime text-black' : 'bg-surface text-blue-dianne'}`}>
      <div className="flex items-center gap-spacing-sm">
        <i className={`fa-solid ${icon} text-sm ${accent ? 'text-black/60' : 'text-orange'}`} aria-hidden="true" />
        <strong className="text-xl tabular-nums">{value}</strong>
      </div>
      <span className={`mt-1 block text-xs ${accent ? 'text-black/60' : 'text-blue-dianne/55'}`}>{label}</span>
    </div>
  )
}

export default function HomeChargingSimulator() {
  const [vehicles, setVehicles] = useState([])
  const [vehicleId, setVehicleId] = useState(CUSTOM_VEHICLE_ID)
  const [vehicleQuery, setVehicleQuery] = useState('')
  const [vehiclePickerOpen, setVehiclePickerOpen] = useState(false)
  const [vehiclesLoading, setVehiclesLoading] = useState(true)
  const [vehiclesUnavailable, setVehiclesUnavailable] = useState(false)
  const [customBattery, setCustomBattery] = useState(60)
  const [customAcPower, setCustomAcPower] = useState(11)
  const [startLevel, setStartLevel] = useState(20)
  const [targetLevel, setTargetLevel] = useState(80)
  const [householdPower, setHouseholdPower] = useState(7.4)
  const [chargingWindow, setChargingWindow] = useState(8)
  const [energyRate, setEnergyRate] = useState(HOME_ENERGY_RATE)
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3)

  useEffect(() => {
    let active = true
    fetchComparatorVehicles()
      .then((entries) => {
        if (!active) return
        const eligible = entries
          .filter((vehicle) => Number.isFinite(vehicle.batteryCapacity))
          .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
        setVehicles(eligible)
        setVehiclesUnavailable(false)
        if (eligible.length) setVehicleId(eligible[0].id)
      })
      .catch(() => {
        if (!active) return
        setVehicles([])
        setVehiclesUnavailable(true)
      })
      .finally(() => { if (active) setVehiclesLoading(false) })
    return () => { active = false }
  }, [])

  const normalizedVehicleQuery = vehicleQuery.trim().toLocaleLowerCase('fr')
  const matchingVehicles = vehicles
    .filter((vehicle) => {
      if (!normalizedVehicleQuery) return true
      return [vehicle.name, vehicle.brand, vehicle.model, vehicle.category, vehicle.battery]
        .some((value) => String(value || '').toLocaleLowerCase('fr').includes(normalizedVehicleQuery))
    })
    .slice(0, 12)

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId)
  const batteryCapacity = selectedVehicle?.batteryCapacity ?? customBattery
  const vehicleMaxAcPower = selectedVehicle?.maxAcPower ?? customAcPower

  const result = calculateHomeChargingScenario({
    batteryCapacity,
    startLevel,
    targetLevel,
    householdPower,
    vehicleMaxAcPower,
    chargingWindow,
    energyRate,
    sessionsPerWeek,
  })

  const selectedRateId = ONEE_RESIDENTIAL_RATES.find(
    (tier) => Math.abs(Number(energyRate) - tier.rate) < 0.00005,
  )?.id
  const recommendedCharger = result.comparisons.find((charger) => charger.id === result.recommendedChargerId)
  const vehicleName = selectedVehicle?.name || 'Votre véhicule'

  const selectVehicle = (vehicle) => {
    setVehicleId(vehicle.id)
    setVehicleQuery('')
    setVehiclePickerOpen(false)
  }

  const chooseStartLevel = (level) => {
    setStartLevel(level)
    if (level >= targetLevel) setTargetLevel(level < 80 ? 80 : 100)
  }

  const chooseTargetLevel = (level) => {
    setTargetLevel(level)
    if (level <= startLevel) setStartLevel(Math.max(10, level - 20))
  }

  return (
    <section className="bg-white py-spacing-6xl xl:py-spacing-8xl">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto grid gap-spacing-5xl">
        <header className="mx-auto grid max-w-[860px] gap-spacing-lg text-center">
          <span className="mx-auto inline-flex w-fit items-center gap-spacing-sm rounded-full bg-lime px-spacing-md py-spacing-sm text-sm font-semibold text-black">
            <i className="fa-solid fa-house-chimney" aria-hidden="true" /> Comparatif à domicile
          </span>
          <h2 className="m-0 tracking-tight">Quelle borne est vraiment utile chez vous&nbsp;?</h2>
          <p className="m-0 text-blue-dianne/70">
            Choisissez votre voiture et votre installation. Comparez immédiatement le temps de recharge et l’impact sur la facture du foyer.
          </p>
        </header>

        <div className="grid items-start gap-spacing-4xl xl:grid-cols-[minmax(0,.82fr)_minmax(540px,1.18fr)]">
          <div className="grid gap-spacing-5xl rounded-3xl bg-surface p-spacing-3xl md:p-spacing-5xl">
            <section className="grid gap-spacing-3xl" aria-labelledby="vehicle-step-title">
              <StepHeading
                id="vehicle-step-title"
                number="1"
                title="Choisissez votre voiture"
                description="La capacité batterie constructeur est appliquée automatiquement."
              />

              <div
                className="relative grid gap-spacing-sm"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setVehiclePickerOpen(false)
                }}
              >
                <label className="text-sm font-bold text-blue-dianne" htmlFor="home-charging-vehicle-search">Marque, modèle ou capacité</label>
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-blue-dianne/40" aria-hidden="true" />
                  <input
                    id="home-charging-vehicle-search"
                    type="search"
                    role="combobox"
                    aria-expanded={vehiclePickerOpen}
                    aria-controls="home-charging-vehicle-results"
                    aria-autocomplete="list"
                    autoComplete="off"
                    value={vehicleQuery}
                    onFocus={() => setVehiclePickerOpen(true)}
                    onChange={(event) => {
                      setVehicleQuery(event.target.value)
                      setVehiclePickerOpen(true)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') setVehiclePickerOpen(false)
                      if (event.key === 'Enter' && matchingVehicles.length) {
                        event.preventDefault()
                        selectVehicle(matchingVehicles[0])
                      }
                    }}
                    placeholder={vehiclesLoading ? 'Chargement des véhicules…' : 'Ex. Ioniq 5, Tesla, 77 kWh…'}
                    className="simulator-field pl-11 pr-12"
                  />
                  {vehicleQuery && (
                    <button
                      type="button"
                      onClick={() => setVehicleQuery('')}
                      aria-label="Effacer la recherche"
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-blue-dianne/45 hover:bg-surface hover:text-blue-dianne"
                    >
                      <i className="fa-solid fa-xmark" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {vehiclePickerOpen && !vehiclesLoading && (
                  <div id="home-charging-vehicle-results" role="listbox" className="absolute left-0 right-0 top-full z-20 mt-spacing-xs max-h-80 overflow-y-auto rounded-2xl border border-blue-dianne/10 bg-white p-spacing-sm shadow-[0_24px_60px_-28px_rgba(22,62,76,.65)]">
                    {matchingVehicles.length ? matchingVehicles.map((vehicle) => (
                      <button
                        type="button"
                        role="option"
                        aria-selected={vehicle.id === vehicleId}
                        key={vehicle.id}
                        onClick={() => selectVehicle(vehicle)}
                        className={`grid w-full grid-cols-[44px_1fr_auto] items-center gap-spacing-md rounded-xl px-spacing-md py-spacing-sm text-left transition-colors ${vehicle.id === vehicleId ? 'bg-lime/25' : 'hover:bg-surface'}`}
                      >
                        <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-surface text-blue-dianne/35">
                          {vehicle.image ? <img src={vehicle.image} alt="" className="h-full w-full object-contain" /> : <i className="fa-solid fa-car-side" aria-hidden="true" />}
                        </span>
                        <span className="min-w-0">
                          <strong className="block truncate text-sm text-blue-dianne">{vehicle.name}</strong>
                          <span className="block truncate text-xs text-blue-dianne/50">{vehicle.brand || vehicle.category || 'Véhicule électrique'}</span>
                        </span>
                        <span className="text-right">
                          <strong className="block whitespace-nowrap text-sm text-blue-dianne tabular-nums">{formatNumber(vehicle.batteryCapacity, 2)} kWh</strong>
                          {vehicle.maxAcPower && <span className="text-[10px] text-blue-dianne/45">AC {formatNumber(vehicle.maxAcPower)} kW</span>}
                        </span>
                      </button>
                    )) : (
                      <div className="px-spacing-lg py-spacing-3xl text-center text-sm text-blue-dianne/55">Aucun véhicule avec cette recherche.</div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setVehicleId(CUSTOM_VEHICLE_ID)
                        setVehiclePickerOpen(false)
                        setVehicleQuery('')
                      }}
                      className="mt-spacing-xs flex w-full items-center gap-spacing-sm rounded-xl border border-dashed border-blue-dianne/20 px-spacing-md py-spacing-md text-left text-sm font-semibold text-blue-dianne hover:border-blue-dianne/45"
                    >
                      <i className="fa-solid fa-pen" aria-hidden="true" /> Mon véhicule n’est pas dans la base
                    </button>
                  </div>
                )}
                {vehiclesUnavailable && <p className="m-0 text-xs text-orange">La base véhicules est momentanément indisponible. La saisie manuelle reste disponible.</p>}
              </div>

              {selectedVehicle ? (
                <div className="grid gap-spacing-md rounded-2xl border border-blue-dianne/10 bg-white p-spacing-lg sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex min-w-0 items-center gap-spacing-md">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface text-blue-dianne/30">
                      {selectedVehicle.image ? <img src={selectedVehicle.image} alt="" className="h-full w-full object-contain" /> : <i className="fa-solid fa-car-side" aria-hidden="true" />}
                    </span>
                    <div className="min-w-0">
                      <strong className="block truncate text-blue-dianne">{vehicleName}</strong>
                      <span className="block truncate text-xs text-blue-dianne/55">{selectedVehicle.battery}</span>
                      <span className="text-xs text-blue-dianne/45">{selectedVehicle.acCharging || 'Puissance AC non renseignée'}</span>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <strong className="block text-2xl text-blue-dianne tabular-nums">{formatNumber(selectedVehicle.batteryCapacity, 2)} kWh</strong>
                    <span className="text-xs font-semibold text-blue-dianne/45">Capacité issue de la base EVplug</span>
                  </div>
                </div>
              ) : (
                <div className="grid gap-spacing-md rounded-2xl border border-blue-dianne/10 bg-white p-spacing-lg sm:grid-cols-2">
                  <label className="grid gap-spacing-xs text-sm font-semibold text-blue-dianne" htmlFor="custom-battery-capacity">
                    Capacité batterie
                    <span className="relative">
                      <input id="custom-battery-capacity" type="number" min="10" max="200" step="0.1" value={customBattery} onChange={(event) => setCustomBattery(event.target.value)} className="simulator-field pr-16" />
                      <span className="simulator-suffix">kWh</span>
                    </span>
                  </label>
                  <label className="grid gap-spacing-xs text-sm font-semibold text-blue-dianne" htmlFor="custom-ac-power">
                    Recharge AC maximale
                    <span className="relative">
                      <input id="custom-ac-power" type="number" min="1.4" max="22" step="0.1" value={customAcPower} onChange={(event) => setCustomAcPower(event.target.value)} className="simulator-field pr-14" />
                      <span className="simulator-suffix">kW</span>
                    </span>
                  </label>
                </div>
              )}

              {selectedVehicle && !selectedVehicle.maxAcPower && (
                <label className="grid max-w-60 gap-spacing-xs text-sm font-semibold text-blue-dianne" htmlFor="fallback-ac-power">
                  Recharge AC maximale
                  <span className="relative">
                    <input id="fallback-ac-power" type="number" min="1.4" max="22" step="0.1" value={customAcPower} onChange={(event) => setCustomAcPower(event.target.value)} className="simulator-field pr-14" />
                    <span className="simulator-suffix">kW</span>
                  </span>
                </label>
              )}

              <div className="grid gap-spacing-xl sm:grid-cols-2">
                <PillGroup label="Batterie au départ" options={START_LEVELS} value={startLevel} onChange={chooseStartLevel} suffix=" %" />
                <PillGroup label="Objectif de charge" options={TARGET_LEVELS} value={targetLevel} onChange={chooseTargetLevel} suffix=" %" />
              </div>
            </section>

            <div className="h-px bg-blue-dianne/10" />

            <section className="grid gap-spacing-3xl" aria-labelledby="home-step-title">
              <StepHeading
                id="home-step-title"
                number="2"
                title="Décrivez votre installation"
                description="Indiquez la puissance que le logement peut réellement réserver à la voiture."
              />
              <fieldset className="grid gap-spacing-md">
                <legend className="sr-only">Puissance disponible pour la recharge</legend>
                <div className="grid grid-cols-2 gap-spacing-sm">
                  {HOUSEHOLD_POWER_OPTIONS.map((option) => {
                    const active = option.power === householdPower
                    return (
                      <button
                        type="button"
                        key={option.id}
                        aria-pressed={active}
                        onClick={() => setHouseholdPower(option.power)}
                        className={`relative min-h-20 rounded-2xl border p-spacing-md text-left transition-all ${
                          active
                            ? 'border-blue-dianne bg-blue-dianne text-white shadow-[0_12px_26px_-18px_rgba(22,62,76,.9)]'
                            : 'border-blue-dianne/10 bg-white text-blue-dianne hover:border-blue-dianne/40'
                        }`}
                      >
                        {option.recommended && (
                          <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${active ? 'bg-pear text-black' : 'bg-lime text-black'}`}>
                            Courant
                          </span>
                        )}
                        <strong className="block text-lg tabular-nums">{option.label}</strong>
                        <span className={`text-xs ${active ? 'text-white/65' : 'text-blue-dianne/50'}`}>{option.detail}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
              <PillGroup label="Durée disponible la nuit" options={CHARGING_WINDOWS} value={chargingWindow} onChange={setChargingWindow} suffix=" h" />
              <p className="m-0 rounded-xl bg-white px-spacing-md py-spacing-sm text-xs leading-relaxed text-blue-dianne/55">
                En cas de doute, 7,4 kW représente une wallbox monophasée 32 A. Un installateur doit confirmer la puissance réellement disponible après les autres usages du logement.
              </p>
            </section>

            <div className="h-px bg-blue-dianne/10" />

            <section className="grid gap-spacing-3xl" aria-labelledby="tariff-step-title">
              <StepHeading
                id="tariff-step-title"
                number="3"
                title="Situez votre facture"
                description="Choisissez la tranche du foyer, puis la fréquence de recharge."
              />
              <fieldset className="grid gap-spacing-md">
                <legend className="text-xs font-bold uppercase tracking-wide text-blue-dianne/55">Tarif résidentiel · DH/kWh TTC</legend>
                <div className="grid grid-cols-2 gap-spacing-sm sm:grid-cols-3">
                  {ONEE_RESIDENTIAL_RATES.map((tier) => {
                    const active = selectedRateId === tier.id
                    return (
                      <button
                        type="button"
                        key={tier.id}
                        aria-pressed={active}
                        onClick={() => setEnergyRate(tier.rate)}
                        className={`relative min-h-16 rounded-2xl border px-spacing-sm py-spacing-sm text-left transition-all ${
                          active
                            ? 'border-blue-dianne bg-blue-dianne text-white'
                            : 'border-blue-dianne/10 bg-white text-blue-dianne hover:border-blue-dianne/40'
                        }`}
                      >
                        {tier.recommended && (
                          <span className="absolute -top-2 right-2 rounded-full bg-lime px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">Exemple</span>
                        )}
                        <span className="block text-[11px] opacity-60">{tier.label}</span>
                        <strong className="text-sm tabular-nums">{String(tier.rate.toFixed(4)).replace('.', ',')} DH</strong>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <div className="grid gap-spacing-lg sm:grid-cols-[1fr_1.2fr] sm:items-end">
                <label className="grid gap-spacing-xs text-sm font-semibold text-blue-dianne" htmlFor="custom-energy-rate">
                  Tarif exact de votre facture
                  <span className="relative">
                    <input
                      id="custom-energy-rate"
                      type="number"
                      inputMode="decimal"
                      min="0.01"
                      max="20"
                      step="0.0001"
                      value={energyRate}
                      onChange={(event) => setEnergyRate(event.target.value)}
                      className="simulator-field pr-24"
                    />
                    <span className="simulator-suffix">DH/kWh</span>
                  </span>
                </label>
                <PillGroup label="Recharges par semaine" options={WEEKLY_FREQUENCIES} value={sessionsPerWeek} onChange={setSessionsPerWeek} suffix="×" />
              </div>

              <a href={ONEE_RATE_SOURCE} target="_blank" rel="noreferrer" className="w-fit text-xs font-semibold text-blue-dianne/55 underline decoration-blue-dianne/25 underline-offset-2 hover:text-orange">
                Consulter le barème résidentiel ONEE <span className="sr-only">(nouvel onglet)</span>
              </a>
            </section>
          </div>

          <aside className="grid gap-spacing-3xl xl:sticky xl:top-28" aria-live="polite">
            <div className="overflow-hidden rounded-3xl bg-blue-dianne text-white shadow-[0_24px_64px_-40px_rgba(22,62,76,.85)]">
              <div className="grid gap-spacing-lg p-spacing-3xl md:p-spacing-4xl">
                <div className="flex flex-wrap items-start justify-between gap-spacing-md">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide text-white/50">Meilleur choix pour ce foyer</span>
                    <h3 className="m-0 mt-1 text-2xl text-white">{recommendedCharger?.label} {recommendedCharger?.detail}</h3>
                  </div>
                  <span className="rounded-full bg-pear px-spacing-md py-spacing-sm text-xs font-bold text-black">
                    Sans puissance inutile
                  </span>
                </div>
                <p className="m-0 text-sm leading-relaxed text-white/65">
                  Pour {vehicleName}, votre voiture ou votre installation plafonne la recharge à {formatNumber(result.maximumUsefulPower)} kW.
                </p>
                <div className="grid grid-cols-3 gap-spacing-sm">
                  <SummaryMetric
                    icon="fa-clock"
                    value={formatChargingTime(recommendedCharger?.chargingTime)}
                    label={`${startLevel} → ${targetLevel} %`}
                    accent
                  />
                  <SummaryMetric icon="fa-receipt" value={`${formatMoney(result.sessionCost)} DH`} label="par recharge" />
                  <SummaryMetric icon="fa-calendar" value={`${formatMoney(result.monthlyCost)} DH`} label="par mois" />
                </div>
              </div>

              <div className="bg-white p-spacing-3xl text-blue-dianne md:p-spacing-4xl">
                <div className="mb-spacing-lg flex items-end justify-between gap-spacing-md">
                  <div>
                    <h3 className="m-0 text-lg text-blue-dianne">Temps et coût par solution</h3>
                    <p className="m-0 mt-1 text-xs text-blue-dianne/55">Avec votre voiture, votre foyer et votre tarif.</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-blue-dianne/45">{formatNumber(result.gridEnergy)} kWh au compteur</span>
                </div>

                <div className="grid gap-spacing-md sm:grid-cols-2 2xl:grid-cols-3">
                  {result.comparisons.map((charger) => {
                    const recommended = charger.id === result.recommendedChargerId
                    return (
                      <article
                        key={charger.id}
                        className={`relative grid min-h-48 content-between gap-spacing-lg rounded-2xl border p-spacing-lg transition-colors ${
                          recommended
                            ? 'border-blue-dianne bg-lime/20 shadow-[0_16px_34px_-26px_rgba(22,62,76,.8)]'
                            : 'border-blue-dianne/10 bg-white'
                        }`}
                      >
                        {recommended && (
                          <span className="absolute right-3 top-3 rounded-full bg-blue-dianne px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">Meilleur choix</span>
                        )}
                        <div className="flex items-center gap-spacing-sm pr-20">
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${recommended ? 'bg-orange text-white' : 'bg-surface text-blue-dianne/45'}`}>
                            <i className={`fa-solid ${charger.icon}`} aria-hidden="true" />
                          </span>
                          <div>
                            <strong className="block text-sm text-blue-dianne">{charger.shortLabel}</strong>
                            <span className="text-xs text-blue-dianne/50">{charger.detail} nominal</span>
                          </div>
                        </div>

                        <div>
                          <strong className="block text-3xl tracking-tight text-blue-dianne tabular-nums">{formatChargingTime(charger.chargingTime)}</strong>
                          <span className="text-xs text-blue-dianne/50">pour passer de {startLevel} à {targetLevel} %</span>
                        </div>

                        <dl className="m-0 grid grid-cols-2 gap-spacing-sm border-t border-blue-dianne/10 pt-spacing-md text-xs">
                          <div>
                            <dt className="text-blue-dianne/45">Puissance réelle</dt>
                            <dd className="m-0 mt-0.5 font-bold text-blue-dianne tabular-nums">{formatNumber(charger.effectivePower)} kW</dd>
                          </div>
                          <div>
                            <dt className="text-blue-dianne/45">Coût / session</dt>
                            <dd className="m-0 mt-0.5 font-bold text-blue-dianne tabular-nums">{formatMoney(charger.sessionCost)} DH</dd>
                          </div>
                        </dl>

                        <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${charger.fitsWindow ? 'bg-pear/45 text-blue-dianne' : 'bg-orange/10 text-orange'}`}>
                          <i className={`fa-solid ${charger.fitsWindow ? 'fa-moon' : 'fa-hourglass-half'}`} aria-hidden="true" />
                          {charger.fitsWindow ? `Terminée en moins de ${chargingWindow} h` : `Dépasse votre fenêtre de ${chargingWindow} h`}
                        </span>
                        {charger.limited && <span className="text-[10px] leading-relaxed text-orange">Limitée par la voiture ou le logement — une borne plus puissante ne chargera pas plus vite.</span>}
                      </article>
                    )
                  })}
                </div>

                <div className="mt-spacing-lg flex items-start gap-spacing-md rounded-2xl bg-surface p-spacing-lg">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime text-blue-dianne">
                    <i className="fa-solid fa-equals" aria-hidden="true" />
                  </span>
                  <div>
                    <strong className="block text-sm text-blue-dianne">Une borne plus puissante réduit le temps, pas l’énergie.</strong>
                    <p className="m-0 mt-1 text-xs leading-relaxed text-blue-dianne/55">
                      À rendement identique, les cinq solutions livrent {formatNumber(result.batteryEnergy)} kWh à la batterie et coûtent donc environ {formatMoney(result.sessionCost)} DH par session.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-spacing-lg rounded-3xl border border-blue-dianne/10 bg-white p-spacing-3xl md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="m-0 text-lg text-blue-dianne">Impact mensuel sur le foyer</h3>
                <p className="m-0 mt-1 text-sm text-blue-dianne/60">
                  Environ <strong className="text-blue-dianne">{formatNumber(result.monthlyEnergy)} kWh/mois</strong> ajoutés à la consommation existante, pour {formatNumber(result.sessionsPerMonth)} sessions.
                </p>
              </div>
              <button type="button" className="btn btn-primary justify-center" onClick={openCtaForm}>Valider avec un expert</button>
              <p className="m-0 text-[11px] leading-relaxed text-blue-dianne/45 md:col-span-2">
                Estimation indicative avec 90 % de rendement AC. Hors frais fixes et autres consommations. L’ajout de la voiture peut faire passer le foyer dans une tranche ONEE supérieure.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .simulator-field {
          width: 100%;
          min-height: 50px;
          border: 1px solid rgba(22, 62, 76, .16);
          border-radius: 14px;
          background: white;
          padding: 11px 14px;
          color: #163e4c;
          font-weight: 700;
          outline: none;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .simulator-field:focus {
          border-color: #163e4c;
          box-shadow: 0 0 0 3px rgba(200, 215, 45, .45);
        }
        .simulator-suffix {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          color: rgba(22, 62, 76, .5);
          font-size: 12px;
          pointer-events: none;
        }
        @media (max-width: 540px) {
          .simulator-field { font-size: 14px; }
        }
      `}</style>
    </section>
  )
}
