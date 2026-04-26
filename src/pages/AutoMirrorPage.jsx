import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { generatedPages } from '../generatedPages'
import { normalizeRoutePath } from '../lib/normalizeRoutePath'
import NotFoundPage from './NotFoundPage'
import MirroredPageLayout from './MirroredPageLayout'
import Copropriete from './solutions/Copropriete'
import Entreprise from './solutions/Entreprise'
import Hotels from './solutions/Hotels'
import Parkings from './solutions/Parkings'
import StationsService from './solutions/StationsService'

// ---------------------------------------------------------------------------
// Custom (non-captured) React pages registered by route
// ---------------------------------------------------------------------------
const CUSTOM_PAGES = {
  '/solutions/hotels': Hotels,
  '/solutions/parkings': Parkings,
  '/solutions/entreprise': Entreprise,
  '/solutions/copropriete': Copropriete,
  '/solutions/stations-service': StationsService,
}

// ---------------------------------------------------------------------------
// Glob-based lazy loaders — one chunk per HTML page
// Build a Map keyed by the relative htmlPath, resilient to Vite key formats
// ---------------------------------------------------------------------------
const globLoaders = import.meta.glob('../migrated/pages/**/*.html', {
  query: '?raw',
  import: 'default',
})

const loaderByHtmlPath = new Map()
for (const [key, fn] of Object.entries(globLoaders)) {
  const m = key.match(/migrated\/pages\/(.+)$/)
  if (m) loaderByHtmlPath.set(m[1], fn)
}

// ---------------------------------------------------------------------------
// Route index for generated (captured) pages
// ---------------------------------------------------------------------------
const routeIndex = new Map(generatedPages.map((e) => [e.route, e]))

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
function Loading() {
  return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Chargement…</div>
}

function extractBodyFromFullHtml(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return doc.body?.innerHTML || ''
}

// ---------------------------------------------------------------------------
// Inner component for captured (generated) pages — all hooks unconditional
// ---------------------------------------------------------------------------
function CapturedPage({ entry }) {
  const [loaded, setLoaded] = useState({ route: null, bodyRaw: null })
  const abortRef = useRef(null)

  useEffect(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    async function load() {
      let bodyRaw = null

      const loader = loaderByHtmlPath.get(entry.htmlPath)
      if (loader) {
        try {
          const result = await loader()
          bodyRaw = typeof result === 'string' ? result : (result?.default ?? null)
        } catch {
          bodyRaw = null
        }
      }

      if (!bodyRaw) {
        try {
          const response = await fetch(`/assets/podenergy.com/${entry.htmlPath}`, {
            signal: controller.signal,
          })
          if (response.ok) {
            const html = await response.text()
            bodyRaw = extractBodyFromFullHtml(html)
          }
        } catch {
          bodyRaw = null
        }
      }

      if (!controller.signal.aborted && bodyRaw !== null) {
        setLoaded({ route: entry.route, bodyRaw })
      }
    }

    load()

    return () => {
      controller.abort()
    }
  }, [entry])

  if (loaded.route !== entry.route) {
    return <Loading />
  }

  return (
    <MirroredPageLayout
      bodyRaw={loaded.bodyRaw}
      htmlPath={entry.htmlPath}
      documentTitle={entry.title}
    />
  )
}

// ---------------------------------------------------------------------------
// Main router component
// ---------------------------------------------------------------------------
export default function AutoMirrorPage() {
  const { pathname, search, hash } = useLocation()
  const normalizedPathname = normalizeRoutePath(pathname)

  if (normalizedPathname !== pathname) {
    return <Navigate replace to={`${normalizedPathname}${search}${hash}`} />
  }

  const CustomPage = CUSTOM_PAGES[normalizedPathname]
  if (CustomPage) {
    return <CustomPage />
  }

  const entry = routeIndex.get(normalizedPathname)
  if (!entry) {
    return <NotFoundPage />
  }

  return <CapturedPage entry={entry} />
}
