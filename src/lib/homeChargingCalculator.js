export const HOME_ENERGY_RATE = 1.3817
export const AC_CHARGING_EFFICIENCY = 0.9

export const ONEE_RESIDENTIAL_RATES = [
  { id: 'tier-1', label: '0–100 kWh', rate: 0.9010 },
  { id: 'tier-2', label: '101–200 kWh', rate: 1.0732 },
  { id: 'tier-4', label: '201–300 kWh', rate: 1.1676 },
  { id: 'tier-5', label: '301–500 kWh', rate: 1.3817, recommended: true },
  { id: 'tier-6', label: 'Plus de 500 kWh', rate: 1.5958 },
]

export const CHARGER_POWER_PRESETS = [
  { id: 'socket', power: 2.3, label: 'Prise domestique', shortLabel: 'Prise', detail: '2,3 kW', icon: 'fa-plug' },
  { id: 'reinforced', power: 3.7, label: 'Prise renforcée', shortLabel: 'Renforcée', detail: '3,7 kW', icon: 'fa-shield-halved' },
  { id: 'wallbox-7', power: 7.4, label: 'Wallbox', shortLabel: 'Wallbox', detail: '7,4 kW', icon: 'fa-charging-station' },
  { id: 'wallbox-11', power: 11, label: 'Wallbox', shortLabel: 'Wallbox', detail: '11 kW', icon: 'fa-charging-station' },
  { id: 'wallbox-22', power: 22, label: 'Wallbox', shortLabel: 'Wallbox', detail: '22 kW', icon: 'fa-bolt' },
]

export const HOUSEHOLD_POWER_OPTIONS = [
  { id: 'home-3', power: 3.7, label: '3,7 kW', detail: 'Monophasé · 16 A' },
  { id: 'home-7', power: 7.4, label: '7,4 kW', detail: 'Monophasé · 32 A', recommended: true },
  { id: 'home-11', power: 11, label: '11 kW', detail: 'Triphasé · 16 A' },
  { id: 'home-22', power: 22, label: '22 kW', detail: 'Triphasé · 32 A' },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export function formatChargingTime(hours) {
  if (!Number.isFinite(hours) || hours <= 0) return '0 min'
  const totalMinutes = Math.max(1, Math.round(hours * 60))
  const wholeHours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (wholeHours === 0) return `${minutes} min`
  if (minutes === 0) return `${wholeHours} h`
  return `${wholeHours} h ${String(minutes).padStart(2, '0')}`
}

export function calculateHomeChargingScenario({
  batteryCapacity,
  startLevel,
  targetLevel,
  householdPower,
  vehicleMaxAcPower,
  chargingWindow,
  energyRate,
  sessionsPerWeek,
}) {
  const safeBatteryCapacity = clamp(Number(batteryCapacity) || 60, 10, 200)
  const safeStartLevel = clamp(Number(startLevel) || 0, 0, 99)
  const safeTargetLevel = clamp(Number(targetLevel) || 100, safeStartLevel + 1, 100)
  const safeHouseholdPower = clamp(Number(householdPower) || 7.4, 1.4, 22)
  const safeVehicleMaxAcPower = clamp(Number(vehicleMaxAcPower) || 11, 1.4, 22)
  const safeChargingWindow = clamp(Number(chargingWindow) || 8, 1, 24)
  const safeEnergyRate = clamp(Number(energyRate) || HOME_ENERGY_RATE, 0.01, 20)
  const safeSessionsPerWeek = clamp(Number(sessionsPerWeek) || 3, 1, 14)

  const batteryEnergy = safeBatteryCapacity * ((safeTargetLevel - safeStartLevel) / 100)
  const gridEnergy = batteryEnergy / AC_CHARGING_EFFICIENCY
  const sessionCost = gridEnergy * safeEnergyRate
  const sessionsPerMonth = safeSessionsPerWeek * (52 / 12)
  const monthlyEnergy = gridEnergy * sessionsPerMonth
  const monthlyCost = sessionCost * sessionsPerMonth
  const maximumUsefulPower = Math.min(safeHouseholdPower, safeVehicleMaxAcPower)

  const comparisons = CHARGER_POWER_PRESETS.map((charger) => {
    const effectivePower = Math.min(charger.power, safeHouseholdPower, safeVehicleMaxAcPower)
    const chargingTime = batteryEnergy / (effectivePower * AC_CHARGING_EFFICIENCY)

    return {
      ...charger,
      effectivePower,
      chargingTime,
      fitsWindow: chargingTime <= safeChargingWindow,
      limited: effectivePower + 0.05 < charger.power,
      sessionCost,
      monthlyCost,
    }
  })

  const recommendedIndex = comparisons.findIndex((item) => item.effectivePower + 0.05 >= maximumUsefulPower)
  const recommendedChargerId = comparisons[Math.max(0, recommendedIndex)]?.id

  return {
    batteryCapacity: safeBatteryCapacity,
    startLevel: safeStartLevel,
    targetLevel: safeTargetLevel,
    householdPower: safeHouseholdPower,
    vehicleMaxAcPower: safeVehicleMaxAcPower,
    chargingWindow: safeChargingWindow,
    energyRate: safeEnergyRate,
    sessionsPerWeek: safeSessionsPerWeek,
    sessionsPerMonth,
    batteryEnergy,
    gridEnergy,
    sessionCost,
    monthlyEnergy,
    monthlyCost,
    maximumUsefulPower,
    recommendedChargerId,
    comparisons,
    wattHourRate: safeEnergyRate / 1000,
  }
}
