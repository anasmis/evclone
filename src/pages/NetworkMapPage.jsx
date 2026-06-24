import { useEffect, useMemo, useRef, useState } from 'react'
import SolutionPageLayout from './solutions/SolutionPageLayout'
import { fetchChargingStations, submitPartnerRequest } from '../lib/api/strapi'
import { MOROCCO_CHARGING_STATIONS } from '../data/moroccoChargingStations'

const MOROCCO_CENTER = [32.4279, -6.0]
const DEFAULT_ZOOM = 6

// Real Moroccan charging points (OpenChargeMap, CC BY 4.0). Used when the live
// Strapi feed is empty or unreachable so the map always reflects real stations.
const FALLBACK_STATIONS = MOROCCO_CHARGING_STATIONS

const STATUS_META = {
  available: { label: 'Disponible', dot: '#16a34a' },
  busy: { label: 'Occupee', dot: '#fe5716' },
  maintenance: { label: 'Maintenance', dot: '#94a3b8' },
}

// External navigation deep-links so a driver can route straight to the station.
function googleMapsUrl(station) {
  return `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`
}

function powerLabel(station) {
  return station.power ? `${station.type} · ${station.power} kW` : station.type
}

// Guard against duplicate ids (e.g. a CMS that still holds re-imported rows):
// duplicate React keys / marker-map keys silently break list + pin updates.
function uniqueById(list) {
  return Array.from(new Map(list.map((s) => [s.id, s])).values())
}

// Free-text match across the fields a driver is likely to type.
function stationMatchesQuery(station, query) {
  if (!query) return true
  return `${station.name} ${station.city} ${station.address} ${station.operator || ''} ${(station.connectors || []).join(' ')}`
    .toLowerCase()
    .includes(query)
}

function buildMarkerIconHtml(station) {
  const isFast = station.type === 'DC'
  const fill = isFast ? '#fe5716' : '#123d33'
  const stroke = '#ffffff'
  return `
    <div style="
      width: 34px; height: 40px;
      filter: drop-shadow(0 6px 14px rgba(7,62,40,0.32));
      ">
      <svg viewBox="0 0 32 40" width="34" height="40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.16 0 0 7.16 0 16c0 11.5 13.5 22.5 15.07 23.74a1.5 1.5 0 0 0 1.86 0C18.5 38.5 32 27.5 32 16 32 7.16 24.84 0 16 0z"
              fill="${fill}" stroke="${stroke}" stroke-width="2"/>
        <text x="16" y="21" text-anchor="middle" font-family="Arial, sans-serif"
              font-size="11" font-weight="700" fill="${stroke}">${isFast ? 'DC' : 'AC'}</text>
      </svg>
    </div>
  `
}

function buildStationPopupHtml(station) {
  const meta = STATUS_META[station.status] || STATUS_META.available
  const operator = station.operator
    ? `<p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:#fe5716;">${station.operator}</p>`
    : ''
  const connectors =
    station.connectors && station.connectors.length
      ? `<p style="margin:6px 0 0;font-size:12px;"><strong>Connecteurs :</strong> ${station.connectors.join(', ')}</p>`
      : ''
  const points =
    station.points > 1
      ? `<p style="margin:4px 0 0;font-size:12px;"><strong>Points de charge :</strong> ${station.points}</p>`
      : ''
  const power = station.power ? `${station.type} &middot; ${station.power} kW` : station.type
  return `
    <div style="font-family: 'TT Commons Pro', sans-serif; min-width: 230px; max-width: 262px; color: #163e4c;">
      ${operator}
      <h3 style="margin: 0 0 4px; font-size: 15px; font-family: 'Poster Cut Neue', sans-serif; color: #123d33; text-transform: uppercase; line-height: 1.15;">${station.name}</h3>
      <p style="margin: 0 0 8px; font-size: 12px; color: #4b6470;">${station.address}</p>
      <div style="display:flex; gap:6px; flex-wrap:wrap; margin: 0 0 8px;">
        <span style="display:inline-flex; align-items:center; gap:6px; background:rgba(18,61,51,0.08); color:#123d33; font-size:11px; font-weight:600; padding:3px 8px; border-radius:9999px;">
          <span style="width:7px; height:7px; border-radius:9999px; background:${meta.dot};"></span>${meta.label}
        </span>
        <span style="background:#c8d72d; color:#123d33; font-size:11px; font-weight:700; padding:3px 8px; border-radius:9999px;">${power}</span>
      </div>
      ${connectors}
      ${points}
      <div style="margin-top:12px;">
        <a href="${googleMapsUrl(station)}" target="_blank" rel="noopener noreferrer" style="display:block; text-align:center; background:#fe5716; color:#fff; font-size:12px; font-weight:700; padding:8px 10px; border-radius:9999px; text-decoration:none;">Itinéraire Google Maps</a>
      </div>
    </div>
  `
}

function SearchField({ value, onChange }) {
  return (
    <div className="relative w-full">
      <svg
        className="pointer-events-none absolute left-spacing-lg top-1/2 -translate-y-1/2 text-blue-dianne/40"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher une station, une ville, un opérateur…"
        aria-label="Rechercher une station"
        className="w-full rounded-full border border-blue-dianne/15 bg-white pl-11 pr-11 py-spacing-md font-base text-blue-dianne placeholder:text-blue-dianne/40 focus:border-blue-dianne focus:outline-none focus:ring-2 focus:ring-blue-dianne/15"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Effacer la recherche"
          className="absolute right-spacing-md top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-dianne/10 text-blue-dianne hover:bg-blue-dianne/20"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

function CitySelect({ cities, counts, total, value, onSelect }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onDocMouseDown(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  const matches = cities.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()))
  const triggerLabel = value === 'all' ? 'Toutes les villes' : value

  function choose(next) {
    onSelect(next)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-spacing-md rounded-full border border-blue-dianne/15 bg-white px-spacing-lg py-spacing-md font-base text-blue-dianne transition hover:border-blue-dianne/45 focus:border-blue-dianne focus:outline-none focus:ring-2 focus:ring-blue-dianne/15"
      >
        <span className="flex min-w-0 items-center gap-spacing-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-orange" aria-hidden="true">
            <path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span className="truncate font-semibold">{triggerLabel}</span>
        </span>
        <span className="flex items-center gap-spacing-sm">
          <span className="inline-flex h-[1.4rem] min-w-[1.4rem] items-center justify-center rounded-full bg-blue-dianne/10 px-1 font-xs font-bold text-blue-dianne/70">
            {value === 'all' ? total : counts[value] || 0}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 mt-spacing-xs rounded-2xl border border-blue-dianne/10 bg-white p-spacing-sm"
          style={{ zIndex: 1000, boxShadow: '0 18px 40px rgba(18,61,51,0.18)' }}
        >
          <div className="relative mb-spacing-sm">
            <svg className="pointer-events-none absolute left-spacing-md top-1/2 -translate-y-1/2 text-blue-dianne/40" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              autoFocus
              value={query}
              placeholder="Filtrer les villes…"
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-blue-dianne/10 bg-surface pl-8 pr-spacing-md py-spacing-sm font-sm text-blue-dianne placeholder:text-blue-dianne/40 focus:border-blue-dianne focus:outline-none"
            />
          </div>
          <ul className="overflow-y-auto" style={{ maxHeight: '15rem' }} role="listbox">
            <li>
              <button
                type="button"
                onClick={() => choose('all')}
                className={[
                  'flex w-full items-center justify-between gap-spacing-md rounded-xl px-spacing-md py-spacing-sm text-left font-base transition',
                  value === 'all' ? 'bg-blue-dianne text-white' : 'text-blue-dianne hover:bg-blue-dianne/5',
                ].join(' ')}
              >
                <span className="font-semibold">Toutes les villes</span>
                <span className={value === 'all' ? 'font-sm text-white/70' : 'font-sm text-blue-dianne/50'}>{total}</span>
              </button>
            </li>
            {matches.length === 0 ? (
              <li className="px-spacing-md py-spacing-sm font-sm text-blue-dianne/50">Aucune ville</li>
            ) : (
              matches.map((city) => (
                <li key={city}>
                  <button
                    type="button"
                    onClick={() => choose(city)}
                    className={[
                      'flex w-full items-center justify-between gap-spacing-md rounded-xl px-spacing-md py-spacing-sm text-left font-base transition',
                      value === city ? 'bg-blue-dianne text-white' : 'text-blue-dianne hover:bg-blue-dianne/5',
                    ].join(' ')}
                  >
                    <span className="truncate font-semibold">{city}</span>
                    <span className={value === city ? 'font-sm text-white/70' : 'font-sm text-blue-dianne/50'}>{counts[city] || 0}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-blue-dianne/15 bg-white p-1" role="tablist">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={[
              'inline-flex items-center gap-spacing-sm rounded-full px-spacing-lg py-spacing-sm font-base font-semibold transition whitespace-nowrap',
              active ? 'bg-blue-dianne text-white shadow-[0_8px_18px_rgba(18,61,51,0.22)]' : 'text-blue-dianne hover:bg-blue-dianne/5',
            ].join(' ')}
          >
            {opt.label}
            <span
              className={[
                'inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1 rounded-full font-xs font-bold',
                active ? 'bg-white/20 text-white' : 'bg-blue-dianne/10 text-blue-dianne/70',
              ].join(' ')}
            >
              {opt.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function DirectionsLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex flex-1 items-center justify-center gap-spacing-sm rounded-full bg-orange py-spacing-sm font-sm font-bold text-white transition hover:brightness-95"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      {children}
    </a>
  )
}

function StationCard({ station, isActive, onSelect }) {
  const meta = STATUS_META[station.status] || STATUS_META.available
  return (
    <div
      id={`station-card-${station.id}`}
      className={[
        'w-full bg-surface rounded-2xl p-spacing-2xl grid gap-spacing-md transition overflow-hidden',
        isActive ? 'ring-2 ring-blue-dianne shadow-[0_18px_32px_rgba(18,61,51,0.18)]' : 'hover:ring-2 hover:ring-blue-dianne/40',
      ].join(' ')}
    >
      <button type="button" onClick={() => onSelect(station)} className="text-left grid gap-spacing-md min-w-0">
        <div className="min-w-0">
          {station.operator && (
            <p className="m-0 font-xs font-bold uppercase tracking-wide text-orange truncate">{station.operator}</p>
          )}
          <p className="m-0 font-PosterCutNeue uppercase font-xl text-blue-dianne truncate">{station.name}</p>
          <p className="m-0 mt-1 font-sm text-blue-dianne/70 truncate">{station.address}</p>
        </div>

        <div className="flex flex-wrap items-center gap-spacing-sm">
          <span className="pill-custom inline-flex items-center cursor-auto whitespace-nowrap font-sm py-spacing-xs px-spacing-md">
            {powerLabel(station)}
          </span>
          <span className="inline-flex items-center gap-2 font-sm font-semibold text-blue-dianne">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: meta.dot }} />
            {meta.label}
          </span>
          {station.points > 1 && <span className="font-sm text-blue-dianne/60">· {station.points} bornes</span>}
        </div>

        {station.connectors && station.connectors.length > 0 && (
          <p className="m-0 font-sm text-blue-dianne/75 truncate">{station.connectors.join(' · ')}</p>
        )}
      </button>

      <div className="flex">
        <DirectionsLink href={googleMapsUrl(station)}>Itinéraire Google Maps</DirectionsLink>
      </div>
    </div>
  )
}

export default function NetworkMapPage() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(new Map())
  const leafletRef = useRef(null)

  const [stations, setStations] = useState(() => uniqueById(FALLBACK_STATIONS))
  const [mapReady, setMapReady] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [cityFilter, setCityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Load live stations from Strapi; keep the bundled fallback if empty/unreachable.
  useEffect(() => {
    let cancelled = false
    fetchChargingStations()
      .then((rows) => {
        if (!cancelled && Array.isArray(rows) && rows.length) setStations(uniqueById(rows))
      })
      .catch(() => {
        // Strapi unreachable / not configured — keep fallback stations.
      })
    return () => {
      cancelled = true
    }
  }, [])

  const normalizedSearch = search.trim().toLowerCase()

  const cities = useMemo(
    () => Array.from(new Set(stations.map((s) => s.city).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'fr')),
    [stations],
  )

  // City counts reflect the active type + search so the dropdown shows how many
  // stations each city would yield under the current selection.
  const cityCounts = useMemo(() => {
    return stations.reduce((acc, s) => {
      if (typeFilter !== 'all' && s.type !== typeFilter) return acc
      if (!stationMatchesQuery(s, normalizedSearch)) return acc
      acc[s.city] = (acc[s.city] || 0) + 1
      return acc
    }, {})
  }, [stations, typeFilter, normalizedSearch])

  const cityTotal = useMemo(() => Object.values(cityCounts).reduce((sum, n) => sum + n, 0), [cityCounts])

  // Type counts reflect the active city + search.
  const typeCounts = useMemo(() => {
    const base = stations.filter(
      (s) => (cityFilter === 'all' || s.city === cityFilter) && stationMatchesQuery(s, normalizedSearch),
    )
    return {
      all: base.length,
      DC: base.filter((s) => s.type === 'DC').length,
      AC: base.filter((s) => s.type === 'AC').length,
    }
  }, [stations, cityFilter, normalizedSearch])

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      if (cityFilter !== 'all' && station.city !== cityFilter) return false
      if (typeFilter !== 'all' && station.type !== typeFilter) return false
      if (!stationMatchesQuery(station, normalizedSearch)) return false
      return true
    })
  }, [stations, cityFilter, typeFilter, normalizedSearch])

  const hasActiveFilters = cityFilter !== 'all' || typeFilter !== 'all' || search.trim() !== ''

  function resetFilters() {
    setCityFilter('all')
    setTypeFilter('all')
    setSearch('')
  }

  // Initialise Leaflet (map only). Markers are built in a separate effect so
  // they can rebuild when stations arrive from Strapi.
  useEffect(() => {
    let cancelled = false
    const markers = markersRef.current

    async function init() {
      if (!mapContainerRef.current || mapRef.current) return
      const leafletModule = await import('leaflet')
      if (cancelled) return

      const L = leafletModule.default
      leafletRef.current = L

      const map = L.map(mapContainerRef.current, {
        center: MOROCCO_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)

      mapRef.current = map
      setMapReady(true)

      setTimeout(() => {
        try {
          map.invalidateSize()
        } catch {
          // Ignore resize errors from Leaflet during early mount.
        }
      }, 50)
    }

    init()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markers.clear()
      setMapReady(false)
    }
  }, [])

  // (Re)build markers whenever the station list changes.
  useEffect(() => {
    const L = leafletRef.current
    const map = mapRef.current
    if (!L || !map || !mapReady) return

    const markers = markersRef.current
    markers.forEach((marker) => {
      if (map.hasLayer(marker)) map.removeLayer(marker)
    })
    markers.clear()

    stations.forEach((station) => {
      const icon = L.divIcon({
        html: buildMarkerIconHtml(station),
        className: 'evplug-leaflet-divicon',
        iconSize: [34, 40],
        iconAnchor: [17, 40],
        popupAnchor: [0, -38],
      })
      const marker = L.marker([station.lat, station.lng], { icon })
      marker.bindPopup(buildStationPopupHtml(station), { closeButton: true })
      marker.on('click', () => setActiveId(station.id))
      marker.addTo(map)
      markers.set(station.id, marker)
    })
  }, [stations, mapReady])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const visibleIds = new Set(filteredStations.map((s) => s.id))
    markersRef.current.forEach((marker, id) => {
      if (visibleIds.has(id)) {
        if (!map.hasLayer(marker)) marker.addTo(map)
      } else if (map.hasLayer(marker)) {
        map.removeLayer(marker)
      }
    })
  }, [filteredStations])

  useEffect(() => {
    if (!activeId) return
    const map = mapRef.current
    const marker = markersRef.current.get(activeId)
    if (!map || !marker) return
    const station = stations.find((s) => s.id === activeId)
    if (!station) return
    map.flyTo([station.lat, station.lng], Math.max(map.getZoom(), 11), { duration: 0.8 })
    marker.openPopup()
    // Keep the matching card in view in the side list.
    const card = document.getElementById(`station-card-${activeId}`)
    if (card) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeId, stations])

  return (
    <SolutionPageLayout
      documentTitle="Notre Reseau | EVplug"
      ctaInterest="Devenir partenaire"
      ctaButtonLabel="Devenir partenaire"
      ctaTitle="Accueillir une station EVplug"
      ctaSubtitle="Décrivez votre site : on étudie l'implantation d'une station EVplug chez vous."
      ctaSubmitFn={submitPartnerRequest}
    >
      {/* Map + list */}
      <section
        id="carte-reseau"
        className="relative bg-white pt-spacing-7xl md:pt-spacing-9xl"
        style={{ scrollMarginTop: 96 }}
      >
        <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto md:py-spacing-9xl py-spacing-7xl">
          <div className="mb-spacing-6xl">
            <span className="pill-custom inline-flex items-center gap-spacing-sm cursor-auto">
              Carte interactive
            </span>
            <h2
              className="m-0 mt-spacing-2xl font-PosterCutNeue uppercase font-4xl md:font-5xl xl:font-6xl text-blue-dianne tracking-tight leading-none"
              style={{ maxWidth: '60rem' }}
            >
              Trouvez la station la plus proche.
            </h2>
          </div>

          {/* Filters */}
          <div className="bg-surface rounded-2xl p-spacing-2xl mb-spacing-4xl grid gap-spacing-2xl">
            <SearchField value={search} onChange={setSearch} />
            <div className="grid gap-spacing-2xl lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-end">
              <div className="grid gap-spacing-sm">
                <span className="font-sm font-bold uppercase tracking-wide text-blue-dianne/70">Ville</span>
                <CitySelect
                  cities={cities}
                  counts={cityCounts}
                  total={cityTotal}
                  value={cityFilter}
                  onSelect={setCityFilter}
                />
              </div>
              <div className="grid gap-spacing-sm">
                <span className="font-sm font-bold uppercase tracking-wide text-blue-dianne/70">Type de recharge</span>
                <div className="overflow-x-auto -mx-1 px-1">
                  <Segmented
                    value={typeFilter}
                    onChange={setTypeFilter}
                    options={[
                      { value: 'all', label: 'Tous', count: typeCounts.all },
                      { value: 'DC', label: 'Rapide DC', count: typeCounts.DC },
                      { value: 'AC', label: 'Standard AC', count: typeCounts.AC },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-spacing-4xl lg:grid-cols-[2fr_1fr] lg:items-start">
            {/* Map */}
            <div className="bg-surface rounded-2xl overflow-hidden">
              <div
                ref={mapContainerRef}
                className="w-full"
                style={{ height: 'min(70vh, 620px)', minHeight: 420 }}
                aria-label="Carte des stations de recharge EVplug au Maroc"
              />
              <div className="bg-blue-dianne text-white px-spacing-2xl py-spacing-md flex items-center justify-between flex-wrap gap-spacing-sm">
                <span className="font-base">
                  Données : OpenStreetMap · OpenChargeMap (CC BY 4.0)
                </span>
                <span className="flex items-center gap-spacing-md font-base">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: '#fe5716' }}
                    />
                    Rapide DC
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: '#123d33' }}
                    />
                    Standard AC
                  </span>
                </span>
              </div>
            </div>

            {/* Side list */}
            <aside className="grid gap-spacing-md lg:max-h-[620px] lg:overflow-y-auto pr-1">
              <div className="flex items-baseline justify-between">
                <h3 className="m-0 font-PosterCutNeue uppercase font-2xl text-blue-dianne">
                  {filteredStations.length} station{filteredStations.length > 1 ? 's' : ''}
                </h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="font-base font-bold text-blue-dianne underline underline-offset-2 hover:text-orange"
                  >
                    Reinitialiser
                  </button>
                )}
              </div>
              {filteredStations.length === 0 ? (
                <div className="bg-surface rounded-2xl p-spacing-4xl text-center font-base text-blue-dianne/70">
                  Aucune station ne correspond a vos filtres.
                </div>
              ) : (
                filteredStations.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    isActive={station.id === activeId}
                    onSelect={(s) => setActiveId(s.id)}
                  />
                ))
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* CTA — partner programme banner */}
      <section className="relative bg-white">
        <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pb-spacing-9xl">
          <div className="grid gap-spacing-3xl md:grid-cols-2 items-stretch">
            <div className="bg-blue-dianne rounded-2xl grid gap-spacing-4xl text-white p-spacing-6xl auto-rows-max">
              <div className="grid gap-spacing-2xl">
                <div className="flex">
                  <span className="pill-custom flex items-center gap-spacing-sm cursor-auto">
                    Devenez partenaire
                  </span>
                </div>
                <h3 className="m-0 font-PosterCutNeue uppercase font-3xl xl:font-4xl">
                  Accueillir une station EVplug sur votre site
                </h3>
                <p className="m-0 font-lg font-semibold">
                  Hotels, parkings, centres commerciaux, coproprietes&nbsp;: nous etudions chaque
                  implantation et finanons les meilleurs emplacements.
                </p>
              </div>
              <div className="flex justify-start gap-spacing-xl flex-wrap">
                <a href="/contact-us" className="btn btn-secondary font-base">
                  Demander un devis
                </a>
                <a href="/contact-us" className="btn btn-secondary-outline font-base">
                  Nous contacter
                </a>
              </div>
            </div>

            <div
              className="relative w-full rounded-2xl overflow-hidden bg-surface"
              style={{ minHeight: 340 }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 30% 35%, rgba(200,215,45,0.55), transparent 30%), radial-gradient(circle at 70% 70%, rgba(254,87,22,0.4), transparent 32%), radial-gradient(circle at 50% 50%, rgba(18,61,51,0.18), transparent 35%)',
                }}
              />
              <div className="relative grid place-items-center h-full p-spacing-6xl text-center">
                <p className="m-0 font-PosterCutNeue uppercase font-4xl xl:font-6xl text-blue-dianne max-w-105">
                  Votre site, le prochain hub EV.
                </p>
              </div>
              <div className="absolute bottom-spacing-2xl left-spacing-2xl right-spacing-2xl bg-white/90 rounded-xl p-spacing-md flex items-center gap-spacing-md">
                <div className="w-10 h-10 bg-lime rounded-full flex items-center justify-center shrink-0">
                  <span className="font-PosterCutNeue text-blue-dianne font-xl">+</span>
                </div>
                <p className="font-base font-semibold text-blue-dianne m-0">
                  Implantation cle en main, supervision et maintenance incluses
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SolutionPageLayout>
  )
}
