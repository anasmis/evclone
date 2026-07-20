export const HOME_ENERGY_RATE = 1.6
export const AC_CHARGING_EFFICIENCY = 0.9

export const HOME_CHARGING_VEHICLES = [
  { id: 'citadine', label: 'Citadine', consumption: 14, icon: 'fa-car-side' },
  { id: 'berline', label: 'Berline', consumption: 17, icon: 'fa-car' },
  { id: 'suv', label: 'SUV / Familiale', consumption: 20, icon: 'fa-truck' },
]

export const HOME_CHARGERS = [
  { id: 'prise', label: 'Prise domestique', power: 2.3, phase: 'mono', amp: '10 A', icon: 'fa-plug' },
  { id: 'renforcee', label: 'Prise renforcée', power: 3.7, phase: 'mono', amp: '16 A', icon: 'fa-plug-circle-bolt' },
  { id: 'wb7', label: 'Wallbox 7,4 kW', power: 7.4, phase: 'mono', amp: '32 A', icon: 'fa-charging-station' },
  { id: 'wb11', label: 'Wallbox 11 kW', power: 11, phase: 'tri', amp: '3× 16 A', icon: 'fa-charging-station' },
  { id: 'wb22', label: 'Wallbox 22 kW', power: 22, phase: 'tri', amp: '3× 32 A', icon: 'fa-bolt' },
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
  vehicleId,
  batteryCapacity,
  dailyDistance,
  phase,
  chargingWindow,
  winter,
}) {
  const vehicle = HOME_CHARGING_VEHICLES.find((item) => item.id === vehicleId) || HOME_CHARGING_VEHICLES[1]
  const safeBatteryCapacity = clamp(Number(batteryCapacity) || 60, 1, 200)
  const safeDailyDistance = clamp(Number(dailyDistance) || 0, 0, 1000)
  const safeChargingWindow = clamp(Number(chargingWindow) || 0, 0, 24)
  const consumption = vehicle.consumption * (winter ? 1.2 : 1)
  const kmPerKwh = 100 / consumption

  // Energy stored in the battery to replace the day's driving.
  const dailyBatteryEnergy = (safeDailyDistance * consumption) / 100
  // Energy billed at the meter, including estimated AC conversion losses.
  const dailyGridEnergy = dailyBatteryEnergy / AC_CHARGING_EFFICIENCY
  const batteryUsePercent = (dailyBatteryEnergy / safeBatteryCapacity) * 100
  const estimatedRangeKm = safeBatteryCapacity * kmPerKwh
  const exceedsBatteryRange = dailyBatteryEnergy > safeBatteryCapacity

  const compatibleChargers = HOME_CHARGERS.filter((charger) => phase === 'tri' || charger.phase === 'mono')
  const rows = compatibleChargers.map((charger) => {
    const batteryPower = charger.power * AC_CHARGING_EFFICIENCY
    const dailyTime = dailyBatteryEnergy / batteryPower

    return {
      ...charger,
      batteryPower,
      dailyTime,
      fullTime: (safeBatteryCapacity * 0.6) / batteryPower,
      kmPerHour: batteryPower * kmPerKwh,
      fitsWindow: dailyTime <= safeChargingWindow,
    }
  })

  const wallboxes = rows.filter((row) => row.power >= 7.4)
  const recommended = wallboxes.find((row) => row.fitsWindow) || wallboxes[wallboxes.length - 1]

  return {
    vehicle,
    rows,
    recommended,
    consumption,
    dailyBatteryEnergy,
    dailyGridEnergy,
    dailyCost: dailyGridEnergy * HOME_ENERGY_RATE,
    batteryUsePercent,
    batteryMeterPercent: clamp(batteryUsePercent, 0, 100),
    estimatedRangeKm,
    exceedsBatteryRange,
    maxTime: Math.max(...rows.map((row) => row.dailyTime), 0),
  }
}
