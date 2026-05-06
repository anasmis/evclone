import { useEffect, useMemo, useRef, useState } from 'react'
import SolutionPageLayout from './solutions/SolutionPageLayout'

const DEFAULT_CENTER = [51.5072, -0.1276]
const DEFAULT_ZOOM = 6
const GEOAPIFY_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEOAPIFY_KEY) || '10afff50f87440f59b8ce2ae17e093cf'

function createStationPopup(station) {
  const operatorText = station.operator ? `<p><strong>Operator:</strong> ${station.operator}</p>` : ''
  const socketsText = station.socket ? `<p><strong>Socket:</strong> ${station.socket}</p>` : ''

  return `
    <div style="font-family: Arial, sans-serif; min-width: 180px;">
      <h3 style="margin: 0 0 6px; font-size: 14px;">${station.name}</h3>
      ${operatorText}
      ${socketsText}
      <p style="margin: 0; color: #374151;">Lat: ${station.lat.toFixed(5)}, Lng: ${station.lng.toFixed(5)}</p>
    </div>
  `
}

function normalizeGeoapifyFeature(feature) {
  if (!feature || !feature.geometry || !feature.properties) return null
  const [lng, lat] = feature.geometry.coordinates || []
  if (typeof lat !== 'number' || typeof lng !== 'number') return null

  const props = feature.properties || {}
  return {
    id: feature.id || props.place_id || `${lng.toFixed(5)}_${lat.toFixed(5)}`,
    lat,
    lng,
    name: props.name || 'Charging station',
    operator: props.operator || props.brand || props.datasource?.raw?.operator || '',
    socket: props.datasource?.raw?.socket || props.datasource?.raw?.['socket:type2'] || props.datasource?.raw?.['socket:ccs'] || '',
  }
}

export default function PublicChargingZapmapPage() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const stationsLayerRef = useRef(null)
  const leafletRef = useRef(null)
  const fetchControllerRef = useRef(null)
  const watchIdRef = useRef(null)
  const resizeObserverRef = useRef(null)

  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [stations, setStations] = useState([])
  const [locating, setLocating] = useState(false)

  const statusText = useMemo(() => {
    if (isLoading) return 'Loading stations...'
    if (errorText) return errorText
    return `${stations.length} stations shown in current view`
  }, [errorText, isLoading, stations.length])

  useEffect(() => {
    let isMounted = true

    async function initializeMap() {
      if (!mapContainerRef.current || mapRef.current) return

      const leafletModule = await import('leaflet')
      if (!isMounted) return

      const L = leafletModule.default
      leafletRef.current = L

      const map = L.map(mapContainerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
      })

      const tilesUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`
      L.tileLayer(tilesUrl, {
        attribution: 'Powered by Geoapify | © OpenMapTiles © OpenStreetMap contributors',
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 0,
      }).addTo(map)

      const stationLayer = L.layerGroup().addTo(map)

      mapRef.current = map
      stationsLayerRef.current = stationLayer

      // Ensure the map correctly sizes itself when the container/layout settles
      setTimeout(() => {
        try {
          map.invalidateSize()
        } catch {}
      }, 0)

      if (mapContainerRef.current && 'ResizeObserver' in window) {
        const ro = new ResizeObserver(() => {
          try {
            map.invalidateSize()
          } catch {}
        })
        ro.observe(mapContainerRef.current)
        resizeObserverRef.current = ro
      }

      const loadStations = async () => {
        const currentMap = mapRef.current
        const currentLayer = stationsLayerRef.current
        if (!currentMap || !currentLayer) return

        const bounds = currentMap.getBounds()
        const south = bounds.getSouth()
        const west = bounds.getWest()
        const north = bounds.getNorth()
        const east = bounds.getEast()

        const url = new URL('https://api.geoapify.com/v2/places')
        url.searchParams.set('categories', 'service.vehicle.charging_station')
        url.searchParams.set('limit', '200')
        url.searchParams.set('filter', `rect:${west},${south},${east},${north}`)
        url.searchParams.set('apiKey', GEOAPIFY_KEY)

        fetchControllerRef.current?.abort()
        const controller = new AbortController()
        fetchControllerRef.current = controller

        try {
          setIsLoading(true)
          setErrorText('')

          const response = await fetch(url.toString(), { signal: controller.signal })

          if (!response.ok) {
            throw new Error(`Unable to load stations (HTTP ${response.status})`)
          }

          const data = await response.json()
          const normalized = (data.features || [])
            .map(normalizeGeoapifyFeature)
            .filter(Boolean)

          currentLayer.clearLayers()

          for (const station of normalized) {
            const marker = L.circleMarker([station.lat, station.lng], {
              radius: 7,
              color: '#0f766e',
              weight: 2,
              fillColor: '#14b8a6',
              fillOpacity: 0.85,
            })
            marker.bindPopup(createStationPopup(station))
            marker.addTo(currentLayer)
          }

          setStations(normalized)
        } catch (error) {
          if (error?.name === 'AbortError') return
          setErrorText('Could not load stations right now. Pan or zoom and try again.')
        } finally {
          setIsLoading(false)
        }
      }

      const debouncedLoad = () => {
        window.clearTimeout(map._evplugTimer)
        map._evplugTimer = window.setTimeout(loadStations, 350)
      }

      map.on('moveend', debouncedLoad)
      loadStations()
    }

    initializeMap()

    return () => {
      isMounted = false
      fetchControllerRef.current?.abort()

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      if (resizeObserverRef.current) {
        try {
          resizeObserverRef.current.disconnect()
        } catch {}
        resizeObserverRef.current = null
      }
    }
  }, [])

  return (
    <SolutionPageLayout documentTitle="Public Charging Stations | Pod Point">
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 md:px-8">
        <h1 className="m-0 text-center text-4xl leading-tight text-slate-900 md:text-5xl">
          Public Charging Stations
        </h1>
        <p className="mt-3 text-center text-sm text-slate-600">{statusText}</p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.99]"
            onClick={() => {
              const map = mapRef.current
              if (!map) return
              if (!('geolocation' in navigator)) return
              setLocating(true)
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const { latitude, longitude } = pos.coords
                  map.setView([latitude, longitude], 13, { animate: true })
                  setLocating(false)
                },
                () => setLocating(false),
                { enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
              )
            }}
          >
            {locating ? 'Locating…' : 'Use my location'}
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.99]"
            onClick={() => {
              const map = mapRef.current
              if (!map) return
              map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true })
            }}
          >
            Reset view
          </button>
        </div>

        <div className="mt-6 w-full overflow-hidden rounded-2xl border border-slate-300 shadow-sm">
          <div
            ref={mapContainerRef}
            className="evplug-zapmap-map w-full"
            aria-label="Charging stations map"
          />
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-center text-[11px] text-slate-500">
            Map data © OpenStreetMap contributors, tiles by Geoapify
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="m-0 text-xl font-semibold text-slate-800">Stations in view</h2>
          {errorText ? <p className="mt-2 text-sm text-red-700">{errorText}</p> : null}
          {!isLoading && stations.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No stations found in this area. Pan or zoom the map.</p>
          ) : null}
          <ul className="mt-3 divide-y divide-slate-200">
            {stations.map((s) => (
              <li key={s.id} className="py-3">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="m-0 text-sm font-semibold text-slate-900">{s.name}</p>
                    <p className="m-0 mt-1 text-xs text-slate-600">
                      {s.operator ? `Operator: ${s.operator} · ` : ''}
                      {s.socket ? `Socket: ${s.socket} · ` : ''}
                      Lat {s.lat.toFixed(5)}, Lng {s.lng.toFixed(5)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SolutionPageLayout>
  )
}