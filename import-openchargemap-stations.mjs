#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { normalizeAll } from './scripts/stations-normalize.mjs'

const DEFAULT_SOURCE_FILE = './openchargemap_ma_stations.json'
const DEFAULT_ENDPOINT = '/api/evplug-charging-stations'

function parseArgs(argv) {
  const result = {
    file: DEFAULT_SOURCE_FILE,
    url: process.env.STRAPI_URL || process.env.VITE_STRAPI_URL || '',
    token: process.env.STRAPI_TOKEN || process.env.VITE_STRAPI_TOKEN || '',
    endpoint: DEFAULT_ENDPOINT,
    dryRun: false,
    publish: false,
    limit: null,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index]
    const next = argv[index + 1]

    if (current === '--file' && next) {
      result.file = next
      index += 1
      continue
    }

    if (current === '--url' && next) {
      result.url = next
      index += 1
      continue
    }

    if (current === '--token' && next) {
      result.token = next
      index += 1
      continue
    }

    if (current === '--endpoint' && next) {
      result.endpoint = next
      index += 1
      continue
    }

    if (current === '--limit' && next) {
      const parsedLimit = Number(next)
      result.limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null
      index += 1
      continue
    }

    if (current === '--dry-run') {
      result.dryRun = true
      continue
    }

    if (current === '--publish') {
      result.publish = true
      continue
    }

    if (current === '--help' || current === '-h') {
      result.help = true
      continue
    }
  }

  return result
}

function usage() {
  return `Usage:
  node import-openchargemap-stations.mjs --url https://cms.example.com --token YOUR_TOKEN [options]

Options:
  --file <path>       Source JSON file. Default: ${DEFAULT_SOURCE_FILE}
  --endpoint <path>   Strapi collection endpoint. Default: ${DEFAULT_ENDPOINT}
  --limit <n>         Import only the first n stations
  --dry-run           Print payloads without posting them
  --publish           Set publishedAt so Strapi publishes the entry immediately
  --help, -h          Show this help text

Environment variables:
  STRAPI_URL, STRAPI_TOKEN
  VITE_STRAPI_URL, VITE_STRAPI_TOKEN (fallbacks)
`
}

// Map the shared canonical status onto the Strapi enumeration.
const STATUS_TO_STRAPI = {
  available: 'Available',
  busy: 'Occupied',
  maintenance: 'Maintenance',
}

// Convert a normalised station into the Strapi payload.
function buildPayload(station, publish) {
  const payload = {
    name: station.name,
    latitude: station.lat,
    longitude: station.lng,
    city: station.city,
    stationStatus: STATUS_TO_STRAPI[station.status] || 'Available',
    address: station.address,
    chargerType: station.type,
    connectorTypes: station.connectors,
    power: station.power,
    operator: station.operator,
    points: station.points,
  }

  if (publish) {
    payload.publishedAt = new Date().toISOString()
  }

  return payload
}

async function postStation({ baseUrl, token, endpoint, payload }) {
  const targetUrl = new URL(endpoint, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  })

  const responseText = await response.text()
  let responseBody = null
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText)
    } catch {
      responseBody = responseText
    }
  }

  if (!response.ok) {
    const error = new Error(
      `Strapi request failed with status ${response.status}${responseBody ? `: ${JSON.stringify(responseBody)}` : ''}`,
    )
    error.status = response.status
    error.body = responseBody
    throw error
  }

  return responseBody
}

function printSummary({ total, success, failed, dryRun }) {
  const mode = dryRun ? 'dry-run' : 'upload'
  console.log(`\nFinished ${mode}. Total: ${total}, succeeded: ${success}, failed: ${failed}`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    console.log(usage())
    return
  }

  if (!args.url || !args.token) {
    console.error(usage())
    throw new Error('Missing Strapi URL or token.')
  }

  const filePath = resolve(args.file)
  const rawFile = await readFile(filePath, 'utf8')
  const rawStations = JSON.parse(rawFile)

  if (!Array.isArray(rawStations)) {
    throw new Error('Source file must contain a JSON array of stations.')
  }

  // Normalise + drop the export's duplicate rows so Strapi gets one entry per
  // physical station.
  const normalized = normalizeAll(rawStations)
  const items = args.limit ? normalized.slice(0, args.limit) : normalized
  let successCount = 0
  let failureCount = 0

  for (let index = 0; index < items.length; index += 1) {
    const station = items[index]
    const payload = buildPayload(station, args.publish)
    const label = station.name || `station-${index + 1}`

    if (!payload.name || !Number.isFinite(payload.latitude) || !Number.isFinite(payload.longitude)) {
      failureCount += 1
      console.warn(`Skipping ${label}: missing required fields.`)
      continue
    }

    try {
      if (args.dryRun) {
        console.log(JSON.stringify({ index: index + 1, label, payload }, null, 2))
      } else {
        const response = await postStation({
          baseUrl: args.url,
          token: args.token,
          endpoint: args.endpoint,
          payload,
        })
        const id = response?.data?.id ?? response?.data?.documentId ?? 'created'
        console.log(`Posted ${label} -> ${id}`)
      }
      successCount += 1
    } catch (error) {
      failureCount += 1
      console.error(`Failed ${label}: ${error.message}`)
    }
  }

  printSummary({ total: items.length, success: successCount, failed: failureCount, dryRun: args.dryRun })
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error))
  process.exitCode = 1
})
