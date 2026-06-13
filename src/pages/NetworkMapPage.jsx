import { useEffect, useMemo, useRef, useState } from 'react'
import SolutionPageLayout from './solutions/SolutionPageLayout'
import { fetchChargingStations, submitPartnerRequest } from '../lib/api/strapi'

const MOROCCO_CENTER = [32.4279, -6.0]
const DEFAULT_ZOOM = 6

const FALLBACK_STATIONS = [
  {
    id: 'evp-cas-marina',
    name: 'EVplug Casablanca Marina',
    city: 'Casablanca',
    address: 'Casablanca Marina, Boulevard des Almohades',
    lat: 33.6028,
    lng: -7.6178,
    type: 'DC',
    power: 150,
    connectors: ['CCS2', 'CHAdeMO', 'Type 2'],
    status: 'available',
    hours: '24/7',
  },
  {
    id: 'evp-cas-anfaplace',
    name: 'EVplug Anfa Place',
    city: 'Casablanca',
    address: 'Anfa Place Living Resort, Boulevard de la Corniche',
    lat: 33.5849,
    lng: -7.6708,
    type: 'AC',
    power: 22,
    connectors: ['Type 2'],
    status: 'available',
    hours: '08:00 - 23:00',
  },
  {
    id: 'evp-cas-moroccomall',
    name: 'EVplug Morocco Mall',
    city: 'Casablanca',
    address: 'Morocco Mall, Boulevard de la Corniche',
    lat: 33.5731,
    lng: -7.7012,
    type: 'DC',
    power: 120,
    connectors: ['CCS2', 'CHAdeMO'],
    status: 'busy',
    hours: '10:00 - 22:00',
  },
  {
    id: 'evp-cas-sidimaarouf',
    name: 'EVplug Sidi Maarouf',
    city: 'Casablanca',
    address: 'Parc Casa Nearshore, Sidi Maarouf',
    lat: 33.5345,
    lng: -7.6334,
    type: 'AC',
    power: 22,
    connectors: ['Type 2'],
    status: 'available',
    hours: '24/7',
  },
  {
    id: 'evp-rab-megamall',
    name: 'EVplug Mega Mall Rabat',
    city: 'Rabat',
    address: 'Mega Mall, Avenue Imam Malik',
    lat: 33.9595,
    lng: -6.8498,
    type: 'DC',
    power: 150,
    connectors: ['CCS2', 'CHAdeMO', 'Type 2'],
    status: 'available',
    hours: '24/7',
  },
  {
    id: 'evp-rab-hayriad',
    name: 'EVplug Hay Riad',
    city: 'Rabat',
    address: 'Avenue Annakhil, Hay Riad',
    lat: 33.9716,
    lng: -6.8498,
    type: 'AC',
    power: 22,
    connectors: ['Type 2'],
    status: 'available',
    hours: '07:00 - 23:00',
  },
  {
    id: 'evp-rab-agdal',
    name: 'EVplug Agdal',
    city: 'Rabat',
    address: 'Avenue Fal Ould Oumeir, Agdal',
    lat: 34.0042,
    lng: -6.8489,
    type: 'AC',
    power: 11,
    connectors: ['Type 2'],
    status: 'maintenance',
    hours: '08:00 - 22:00',
  },
  {
    id: 'evp-mar-menaramall',
    name: 'EVplug Menara Mall',
    city: 'Marrakech',
    address: 'Menara Mall, Avenue Mohammed VI',
    lat: 31.6261,
    lng: -8.0265,
    type: 'DC',
    power: 120,
    connectors: ['CCS2', 'CHAdeMO'],
    status: 'available',
    hours: '10:00 - 23:00',
  },
  {
    id: 'evp-mar-gueliz',
    name: 'EVplug Gueliz',
    city: 'Marrakech',
    address: 'Avenue Mohammed V, Gueliz',
    lat: 31.6378,
    lng: -8.0103,
    type: 'AC',
    power: 22,
    connectors: ['Type 2'],
    status: 'busy',
    hours: '24/7',
  },
  {
    id: 'evp-mar-hivernage',
    name: 'EVplug Hivernage',
    city: 'Marrakech',
    address: 'Avenue Echouhada, Hivernage',
    lat: 31.6244,
    lng: -8.0167,
    type: 'AC',
    power: 22,
    connectors: ['Type 2'],
    status: 'available',
    hours: '06:00 - 00:00',
  },
  {
    id: 'evp-tng-citymall',
    name: 'EVplug Tanger City Mall',
    city: 'Tanger',
    address: 'Tanger City Mall, Avenue Mohammed VI',
    lat: 35.7421,
    lng: -5.8338,
    type: 'DC',
    power: 150,
    connectors: ['CCS2', 'CHAdeMO', 'Type 2'],
    status: 'available',
    hours: '24/7',
  },
  {
    id: 'evp-tng-marinabay',
    name: 'EVplug Tanger Marina Bay',
    city: 'Tanger',
    address: 'Marina Bay, Port de Tanger',
    lat: 35.7813,
    lng: -5.8047,
    type: 'AC',
    power: 22,
    connectors: ['Type 2'],
    status: 'available',
    hours: '08:00 - 23:00',
  },
  {
    id: 'evp-aga-marinaplaza',
    name: 'EVplug Agadir Marina',
    city: 'Agadir',
    address: 'Marina d\'Agadir, Boulevard Mohammed V',
    lat: 30.4194,
    lng: -9.6079,
    type: 'AC',
    power: 22,
    connectors: ['Type 2'],
    status: 'available',
    hours: '24/7',
  },
  {
    id: 'evp-fes-borjfez',
    name: 'EVplug Fes Borj Fez',
    city: 'Fes',
    address: 'Borj Fez Mall, Avenue Allal Ben Abdellah',
    lat: 34.0331,
    lng: -5.0003,
    type: 'DC',
    power: 120,
    connectors: ['CCS2', 'CHAdeMO'],
    status: 'available',
    hours: '10:00 - 23:00',
  },
  {
    id: 'evp-mek-meknescity',
    name: 'EVplug Meknes',
    city: 'Meknes',
    address: 'Avenue des FAR, Hamria',
    lat: 33.8946,
    lng: -5.5473,
    type: 'AC',
    power: 22,
    connectors: ['Type 2'],
    status: 'available',
    hours: '07:00 - 22:00',
  },
  {
    id: 'evp-eljadida-mazagan',
    name: 'EVplug Mazagan El Jadida',
    city: 'El Jadida',
    address: 'Mazagan Beach Resort',
    lat: 33.1958,
    lng: -8.4934,
    type: 'DC',
    power: 150,
    connectors: ['CCS2', 'CHAdeMO', 'Type 2'],
    status: 'available',
    hours: '24/7',
  },
]

const STATUS_META = {
  available: { label: 'Disponible', dot: '#16a34a' },
  busy: { label: 'Occupee', dot: '#fe5716' },
  maintenance: { label: 'Maintenance', dot: '#94a3b8' },
}

function buildMarkerIconHtml(station) {
  const isFast = station.type === 'DC'
  const fill = isFast ? '#fe5716' : '#123d33'
  const stroke = '#ffffff'
  return `
    <div style="
      width: 34px; height: 40px;
      transform: translate(-50%, -100%);
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
  return `
    <div style="font-family: 'TT Commons Pro', sans-serif; min-width: 220px; color: #163e4c;">
      <h3 style="margin: 0 0 6px; font-size: 15px; font-family: 'Poster Cut Neue', sans-serif; color: #123d33; text-transform: uppercase;">${station.name}</h3>
      <p style="margin: 0 0 8px; font-size: 12px; color: #4b6470;">${station.address}</p>
      <div style="display:flex; gap:6px; flex-wrap:wrap; margin: 0 0 8px;">
        <span style="display:inline-flex; align-items:center; gap:6px; background:rgba(18,61,51,0.08); color:#123d33; font-size:11px; font-weight:600; padding:3px 8px; border-radius:9999px;">
          <span style="width:7px; height:7px; border-radius:9999px; background:${meta.dot};"></span>${meta.label}
        </span>
        <span style="background:#c8d72d; color:#123d33; font-size:11px; font-weight:700; padding:3px 8px; border-radius:9999px;">${station.power ? `${station.type} &middot; ${station.power} kW` : station.type}</span>
      </div>
      ${station.connectors && station.connectors.length ? `<p style="margin: 0; font-size: 12px;"><strong>Connecteurs :</strong> ${station.connectors.join(', ')}</p>` : ''}
      ${station.hours ? `<p style="margin: 4px 0 0; font-size: 12px;"><strong>Horaires :</strong> ${station.hours}</p>` : ''}
    </div>
  `
}

function FilterChip({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'group inline-flex items-center gap-spacing-sm rounded-full border px-spacing-lg py-spacing-sm font-base transition',
        active
          ? 'bg-blue-dianne text-white border-blue-dianne shadow-[0_12px_24px_rgba(18,61,51,0.22)]'
          : 'bg-white text-blue-dianne border-blue-dianne/15 hover:border-blue-dianne/45 hover:-translate-y-0.5',
      ].join(' ')}
    >
      <span className="font-semibold whitespace-nowrap">{label}</span>
      <span
        className={[
          'inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1 rounded-full font-xs font-bold',
          active ? 'bg-white/20 text-white' : 'bg-blue-dianne/10 text-blue-dianne/70',
        ].join(' ')}
      >
        {count}
      </span>
    </button>
  )
}

function CityCombobox({ cities, counts, value, onSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const matches = cities.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="relative w-full" style={{ maxWidth: '22rem' }}>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-spacing-md top-1/2 -translate-y-1/2 text-blue-dianne/40"
          width="16"
          height="16"
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
          type="text"
          value={query}
          placeholder="Rechercher une ville…"
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          className="w-full rounded-full border border-blue-dianne/15 bg-white pl-9 pr-spacing-lg py-spacing-sm font-base text-blue-dianne placeholder:text-blue-dianne/40 focus:border-blue-dianne focus:outline-none"
        />
      </div>
      {open && matches.length > 0 && (
        <ul
          className="absolute left-0 right-0 mt-spacing-xs rounded-2xl border border-blue-dianne/10 bg-white overflow-hidden overflow-y-auto"
          style={{ zIndex: 1000, maxHeight: '16rem', boxShadow: '0 18px 40px rgba(18,61,51,0.18)' }}
        >
          {matches.map((city) => (
            <li key={city}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(city)
                  setQuery('')
                  setOpen(false)
                }}
                className={[
                  'flex w-full items-center justify-between gap-spacing-md px-spacing-lg py-spacing-sm text-left font-base transition',
                  value === city ? 'bg-blue-dianne text-white' : 'text-blue-dianne hover:bg-blue-dianne/5',
                ].join(' ')}
              >
                <span className="font-semibold">{city}</span>
                <span className={value === city ? 'font-sm text-white/70' : 'font-sm text-blue-dianne/50'}>
                  {counts[city]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StationCard({ station, isActive, onSelect }) {
  const meta = STATUS_META[station.status] || STATUS_META.available
  return (
    <button
      type="button"
      onClick={() => onSelect(station)}
      className={[
        'text-left w-full bg-surface rounded-2xl p-spacing-2xl grid gap-spacing-md transition overflow-hidden',
        isActive
          ? 'ring-2 ring-blue-dianne shadow-[0_18px_32px_rgba(18,61,51,0.18)]'
          : 'hover:ring-2 hover:ring-blue-dianne/40',
      ].join(' ')}
    >
      <div className="min-w-0">
        <p className="m-0 font-PosterCutNeue uppercase font-xl text-blue-dianne truncate">
          {station.name}
        </p>
        <p className="m-0 mt-1 font-sm text-blue-dianne/70 truncate">{station.address}</p>
      </div>

      <div className="flex flex-wrap items-center gap-spacing-sm">
        <span className="pill-custom inline-flex items-center cursor-auto whitespace-nowrap font-sm py-spacing-xs px-spacing-md">
          {station.power ? `${station.type} · ${station.power} kW` : station.type}
        </span>
        <span className="inline-flex items-center gap-2 font-sm font-semibold text-blue-dianne">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: meta.dot }} />
          {meta.label}
        </span>
      </div>

      <p className="m-0 font-sm text-blue-dianne/75 truncate">
        {station.connectors.join(' · ')}
      </p>
    </button>
  )
}

export default function NetworkMapPage() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(new Map())
  const leafletRef = useRef(null)

  const [stations, setStations] = useState(FALLBACK_STATIONS)
  const [mapReady, setMapReady] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [cityFilter, setCityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Load live stations from Strapi; keep the bundled fallback if empty/unreachable.
  useEffect(() => {
    let cancelled = false
    fetchChargingStations()
      .then((rows) => {
        if (!cancelled && Array.isArray(rows) && rows.length) setStations(rows)
      })
      .catch(() => {
        // Strapi unreachable / not configured — keep fallback stations.
      })
    return () => {
      cancelled = true
    }
  }, [])

  const cities = useMemo(() => Array.from(new Set(stations.map((s) => s.city))).sort(), [stations])

  const cityCounts = useMemo(() => {
    return stations.reduce((acc, s) => {
      acc[s.city] = (acc[s.city] || 0) + 1
      return acc
    }, {})
  }, [stations])

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      if (cityFilter !== 'all' && station.city !== cityFilter) return false
      if (typeFilter !== 'all' && station.type !== typeFilter) return false
      return true
    })
  }, [stations, cityFilter, typeFilter])

  // Initialise Leaflet (map only). Markers are built in a separate effect so
  // they can rebuild when stations arrive from Strapi.
  useEffect(() => {
    let cancelled = false

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
      markersRef.current.clear()
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
              Trouvez la station EVplug la plus proche.
            </h2>
          </div>

          {/* Filters */}
          <div className="bg-surface rounded-2xl p-spacing-2xl mb-spacing-4xl grid gap-spacing-4xl xl:grid-cols-[1fr_auto] xl:items-start">
            <div className="grid gap-spacing-md">
              <span className="font-sm font-bold uppercase tracking-wide text-blue-dianne/70">
                Choisissez votre ville
              </span>
              <CityCombobox
                cities={cities}
                counts={cityCounts}
                value={cityFilter}
                onSelect={(city) => setCityFilter(city === cityFilter ? 'all' : city)}
              />
              <div className="flex flex-wrap gap-spacing-sm">
                <FilterChip
                  label="Toutes"
                  count={stations.length}
                  active={cityFilter === 'all'}
                  onClick={() => setCityFilter('all')}
                />
                {cities.map((city) => (
                  <FilterChip
                    key={city}
                    label={city}
                    count={cityCounts[city]}
                    active={cityFilter === city}
                    onClick={() => setCityFilter(city === cityFilter ? 'all' : city)}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-spacing-md">
              <span className="font-sm font-bold uppercase tracking-wide text-blue-dianne/70">Type</span>
              <div className="flex flex-wrap gap-spacing-sm">
                {[
                  { value: 'all', label: 'Tous', count: stations.length },
                  { value: 'DC', label: 'Rapide DC', count: stations.filter((s) => s.type === 'DC').length },
                  { value: 'AC', label: 'Standard AC', count: stations.filter((s) => s.type === 'AC').length },
                ].map((opt) => (
                  <FilterChip
                    key={opt.value}
                    label={opt.label}
                    count={opt.count}
                    active={typeFilter === opt.value}
                    onClick={() => setTypeFilter(opt.value)}
                  />
                ))}
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
                  Donnees: OpenStreetMap | Reseau de demonstration EVplug
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
                      style={{ background: '#c8d72d' }}
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
                {(cityFilter !== 'all' || typeFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setCityFilter('all')
                      setTypeFilter('all')
                    }}
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
