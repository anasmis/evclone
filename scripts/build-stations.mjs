#!/usr/bin/env node
// Normalises the raw OpenChargeMap export into the compact shape the app uses
// and writes the bundled fallback module that backs the map when the live
// Strapi feed is empty or unreachable. Normalisation is shared with the Strapi
// importer via stations-normalize.mjs so both paths describe stations alike.
//
//   node scripts/build-stations.mjs
//
// Source : openchargemap_ma_stations.json (OpenChargeMap, CC BY 4.0)
// Output : src/data/moroccoChargingStations.js
import { readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeAll } from './stations-normalize.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = resolve(ROOT, 'openchargemap_ma_stations.json')
const OUTPUT = resolve(ROOT, 'src/data/moroccoChargingStations.js')

const raw = JSON.parse(await readFile(SOURCE, 'utf8'))
const stations = normalizeAll(raw).sort(
  (a, b) => a.city.localeCompare(b.city, 'fr') || a.name.localeCompare(b.name, 'fr'),
)

const banner = `// AUTO-GENERATED — do not edit by hand.
// Source: OpenChargeMap export (openchargemap_ma_stations.json), licensed CC BY 4.0.
// Regenerate with: node scripts/build-stations.mjs
//
// These ${stations.length} real Moroccan charging points back the network map when the live
// Strapi feed is empty or unreachable.
`

const body = `export const MOROCCO_CHARGING_STATIONS = ${JSON.stringify(stations, null, 2)}\n`
await writeFile(OUTPUT, `${banner}\n${body}`, 'utf8')

console.log(`Wrote ${stations.length} stations -> ${OUTPUT}`)
console.log(`Cities: ${new Set(stations.map((s) => s.city)).size}`)
