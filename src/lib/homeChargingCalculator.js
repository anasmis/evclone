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
  { value: 2.3, label: 'Prise', detail: '2,3 kW' },
  { value: 3.7, label: 'Renforcée', detail: '3,7 kW' },
  { value: 7.4, label: 'Wallbox', detail: '7,4 kW' },
  { value: 11, label: 'Wallbox', detail: '11 kW' },
  { value: 22, label: 'Wallbox', detail: '22 kW' },
]

export const ELECTRICAL_SUPPLIES = [
  { id: 'mono-220', label: '220 V', detail: 'Monophasé', voltage: 220, phases: 1, icon: 'fa-house' },
  { id: 'mono-230', label: '230 V', detail: 'Monophasé', voltage: 230, phases: 1, icon: 'fa-house' },
  { id: 'tri-380', label: '380 V', detail: 'Triphasé', voltage: 380, phases: 3, icon: 'fa-industry' },
  { id: 'tri-400', label: '400 V', detail: 'Triphasé', voltage: 400, phases: 3, icon: 'fa-industry' },
  { id: 'custom', label: 'Autre', detail: 'À préciser', voltage: null, phases: null, icon: 'fa-pen' },
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

export function calculateSupplyPower({ voltage, amperage, phases }) {
  const safeVoltage = clamp(Number(voltage) || 220, 100, 500)
  const safeAmperage = clamp(Number(amperage) || 16, 1, 100)
  const safePhases = Number(phases) === 3 ? 3 : 1

  const power = safePhases === 3
    ? (Math.sqrt(3) * safeVoltage * safeAmperage) / 1000
    : (safeVoltage * safeAmperage) / 1000

  return {
    voltage: safeVoltage,
    amperage: safeAmperage,
    phases: safePhases,
    power,
  }
}

export function calculateHomeChargingScenario({
  batteryCapacity,
  startLevel,
  targetLevel,
  chargerPower,
  supplyId,
  customVoltage,
  customPhases,
  amperage,
  chargingWindow,
  energyRate,
}) {
  const supplyPreset = ELECTRICAL_SUPPLIES.find((item) => item.id === supplyId) || ELECTRICAL_SUPPLIES[0]
  const phases = supplyPreset.id === 'custom' ? (Number(customPhases) === 3 ? 3 : 1) : supplyPreset.phases
  const voltage = supplyPreset.id === 'custom' ? customVoltage : supplyPreset.voltage
  const supply = calculateSupplyPower({ voltage, amperage, phases })

  const safeBatteryCapacity = clamp(Number(batteryCapacity) || 60, 10, 200)
  const safeStartLevel = clamp(Number(startLevel) || 0, 0, 99)
  const safeTargetLevel = clamp(Number(targetLevel) || 100, safeStartLevel + 1, 100)
  const safeChargerPower = clamp(Number(chargerPower) || 7.4, 1.4, 22)
  const safeChargingWindow = clamp(Number(chargingWindow) || 0, 1, 24)
  const safeEnergyRate = clamp(Number(energyRate) || HOME_ENERGY_RATE, 0.01, 20)

  const batteryEnergy = safeBatteryCapacity * ((safeTargetLevel - safeStartLevel) / 100)
  const effectiveGridPower = Math.min(safeChargerPower, supply.power)
  const batteryChargingPower = effectiveGridPower * AC_CHARGING_EFFICIENCY
  const gridEnergy = batteryEnergy / AC_CHARGING_EFFICIENCY
  const chargingTime = batteryEnergy / batteryChargingPower
  const cost = gridEnergy * safeEnergyRate
  const supplyLimited = supply.power + 0.05 < safeChargerPower
  const fitsWindow = chargingTime <= safeChargingWindow
  const requiredGridPower = batteryEnergy / (AC_CHARGING_EFFICIENCY * safeChargingWindow)
  const suggestedChargerPower = clamp(Math.ceil(requiredGridPower * 10) / 10, 1.4, 22)

  return {
    batteryCapacity: safeBatteryCapacity,
    startLevel: safeStartLevel,
    targetLevel: safeTargetLevel,
    chargerPower: safeChargerPower,
    chargingWindow: safeChargingWindow,
    energyRate: safeEnergyRate,
    supply,
    batteryEnergy,
    gridEnergy,
    effectiveGridPower,
    batteryChargingPower,
    chargingTime,
    cost,
    supplyLimited,
    fitsWindow,
    requiredGridPower,
    suggestedChargerPower,
    wattHourRate: safeEnergyRate / 1000,
  }
}
