// Shared normalisation: one raw OpenChargeMap record -> the canonical EVplug
// station shape. Used by both the bundle generator (build-stations.mjs) and the
// Strapi importer (import-openchargemap-stations.mjs) so the live CMS feed and
// the bundled fallback describe every station identically.

// Collapse non-Latin scripts (Arabic / Tifinagh) and stray whitespace so city
// labels and addresses read cleanly in the French UI.
export function clean(value) {
  return String(value ?? '')
    .replace(/[؀-ۿⴰ-⵿]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Fold spelling variants of the same city onto one canonical label so the city
// filter doesn't list "Marrakech" and "Marrakesh" as two places.
const CITY_CANON = {
  Marrakesh: 'Marrakech',
  Marachech: 'Marrakech',
  Kenitra: 'Kénitra',
  Lmintanout: 'Imintanoute',
  Tetouane: 'Tétouan',
  Meknes: 'Meknès',
}

export function resolveCity(source) {
  let city = clean(source.ville)
  // Tesla Superchargers ship with a blank city but name it ("Fes Supercharger").
  if (!city) {
    city = clean(source.nom)
      .replace(/superchargeur|supercharger/gi, '')
      .replace(/\d+\s*kw/gi, '')
      .trim()
  }
  return CITY_CANON[city] || city
}

export function parsePower(value) {
  const match = clean(value).match(/([\d.,]+)/)
  if (!match) return null
  const numeric = Number.parseFloat(match[1].replace(',', '.'))
  return Number.isFinite(numeric) ? numeric : null
}

export function cleanConnector(value) {
  const text = clean(value)
  if (/ccs/i.test(text)) return 'CCS'
  if (/chademo/i.test(text)) return 'CHAdeMO'
  if (/type\s*2/i.test(text)) return 'Type 2'
  return text
}

// Returns the canonical station, or null when the record can't be placed
// (missing coordinates or name).
export function normalizeSource(source) {
  // Pass coordinates through at full double precision — never round or truncate
  // (the Strapi columns are `float`, not `decimal`) so the marker lands exactly.
  const lat = Number(source.latitude)
  const lng = Number(source.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  const name = clean(source.nom)
  if (!name) return null

  const city = resolveCity(source)
  const power = parsePower(source.puissanceMax)
  const connectors = [...new Set((source.connecteurs || []).map(cleanConnector).filter(Boolean))]
  const connectorText = connectors.join(' ').toLowerCase()
  const type = /ccs|chademo/.test(connectorText) || (power !== null && power >= 40) ? 'DC' : 'AC'

  const addr1 = clean(source.adresse1)
  const addressParts = [addr1]
  if (city && !addr1.toLowerCase().includes(city.toLowerCase())) addressParts.push(city)

  const operator = /unknown/i.test(source.operateur || '') ? '' : clean(source.operateur)
  const raw = `${clean(source.statut)} ${clean(source.statutBrut)}`.toLowerCase()
  const status = /(occup|busy)/.test(raw)
    ? 'busy'
    : /(maint|fault|offline|indispon|out of service)/.test(raw)
      ? 'maintenance'
      : 'available'

  return {
    // uuid is unique per physical station; the numeric id repeats across the
    // export's duplicate rows, so it can't be the React key / marker key.
    id: `ocm-${source.uuid || source.id}`,
    name,
    city,
    address: addressParts.filter(Boolean).join(', '),
    lat,
    lng,
    type,
    power,
    connectors,
    status,
    operator,
    points: Number(source.nombrePoints) || 1,
  }
}

// Normalise a whole OpenChargeMap array and drop the exact duplicate rows the
// export ships (each station appears ~3×). Dedupes on the now-unique station
// id so the bundle and the importer both emit one entry per physical station.
export function normalizeAll(rawStations) {
  const seen = new Set()
  const stations = []
  for (const source of rawStations) {
    const station = normalizeSource(source)
    if (!station || seen.has(station.id)) continue
    seen.add(station.id)
    stations.push(station)
  }
  return stations
}
