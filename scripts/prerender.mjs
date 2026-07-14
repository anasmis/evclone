// Build-time prerendering for the EVplug SPA.
//
// The site is a client-rendered Vite + React app (React Router in browser
// mode). Crawlers that don't run JS — Bing, social/LLM scrapers — and even
// Googlebot's deferred render see an empty <div id="root">, which is bad for
// SEO. This script fixes that WITHOUT migrating to SSR:
//
//   1. `vite build` has already produced the static SPA in dist/.
//   2. We serve dist/ with Vite's preview server.
//   3. We drive the REAL app in headless Chromium, so useEffect runs, Strapi
//      is fetched, `marked` renders the article markdown, Leaflet/GSAP/AOS all
//      work — then we snapshot the fully-rendered HTML per URL back into dist/.
//   4. We also emit sitemap.xml + robots.txt.
//
// Article/guide slugs are discovered from Strapi at build time. If Strapi is
// unreachable or Chromium isn't installed, the script degrades gracefully:
// it logs a warning and leaves the plain SPA build in place (exit 0) so CI
// never breaks.
//
// Run automatically as part of `npm run build`, or on its own with
// `npm run prerender` after a `vite build`.

import { preview, loadEnv } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const DIST = path.resolve('dist')

const env = loadEnv('production', process.cwd(), '')
const STRAPI_URL = (process.env.VITE_STRAPI_URL || env.VITE_STRAPI_URL || '').replace(/\/+$/, '')
const STRAPI_TOKEN = process.env.VITE_STRAPI_TOKEN || env.VITE_STRAPI_TOKEN || ''
const SITE_URL = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || '').replace(/\/+$/, '')

// Content routes to prerender. Scoped to the editorial/network pages that
// carry the SEO-critical, Strapi-fetched content. The article pages linked
// from /news and /guides (/news/:slug, /guides/:slug) are appended from
// Strapi below. Every other route stays client-rendered only.
const STATIC_ROUTES = [
  '/guides',
  '/news',
  '/reseau',
]

// Bundled fallback article slugs (mirror src/data/editorial.js). Ensures these
// still prerender if Strapi is unreachable at build time.
const FALLBACK_NEWS_SLUGS = ['pod-launches-pod-power-edf-7-hour-peak-ev-tariff']
const FALLBACK_GUIDE_SLUGS = ['are-evs-heavier-traditional-ice-vehicles']

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const uniq = (arr) => [...new Set(arr.filter(Boolean))]

function xmlEscape(value) {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]
  ))
}

// Strapi v4 returns { attributes: { slug } }; v5 returns a flat { slug }.
async function fetchSlugs(collectionPath) {
  if (!STRAPI_URL) return []
  const headers = STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}
  try {
    const res = await fetch(`${STRAPI_URL}${collectionPath}`, { headers })
    if (!res.ok) return []
    const json = await res.json()
    return (json?.data ?? []).map((e) => e?.attributes?.slug ?? e?.slug).filter(Boolean)
  } catch {
    return []
  }
}

async function discoverRoutes() {
  const [newsSlugs, guideSlugs] = await Promise.all([
    fetchSlugs('/api/articles?fields[0]=slug&pagination[pageSize]=500'),
    fetchSlugs('/api/evplug-blog-posts?filters[kind][$eq]=guide&fields[0]=slug&pagination[pageSize]=500'),
  ])

  const news = uniq([...newsSlugs, ...FALLBACK_NEWS_SLUGS]).map((s) => `/news/${s}`)
  const guides = uniq([...guideSlugs, ...FALLBACK_GUIDE_SLUGS]).map((s) => `/guides/${s}`)

  if (STRAPI_URL && newsSlugs.length === 0 && guideSlugs.length === 0) {
    console.warn('  ⚠ Strapi returned no article slugs (unreachable or empty). Prerendering fallbacks only.')
  }
  return uniq([...STATIC_ROUTES, ...news, ...guides])
}

function outFileFor(route) {
  const rel = route === '/' ? 'index.html' : path.join(route.replace(/^\/+/, ''), 'index.html')
  return path.join(DIST, rel)
}

async function writeSnapshot(route, html) {
  // Drop the internal readiness marker from the frozen HTML.
  const clean = html.replace(/ data-seo-ready=""/g, '')
  const file = outFileFor(route)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, `<!doctype html>\n${clean}`, 'utf8')
}

async function writeSitemapAndRobots(routes) {
  if (SITE_URL) {
    const urls = routes
      .map((r) => `  <url><loc>${xmlEscape(`${SITE_URL}${r === '/' ? '' : r}`)}</loc></url>`)
      .join('\n')
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
    await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8')
    console.log(`  ✓ sitemap.xml (${routes.length} urls)`)
  } else {
    console.warn('  ⚠ VITE_SITE_URL not set — skipping sitemap.xml and canonical URLs. Set it for production.')
  }

  const robots = SITE_URL
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    : `User-agent: *\nAllow: /\n`
  await fs.writeFile(path.join(DIST, 'robots.txt'), robots, 'utf8')
  console.log('  ✓ robots.txt')
}

async function main() {
  // dist/ must exist (run after `vite build`).
  try {
    await fs.access(path.join(DIST, 'index.html'))
  } catch {
    console.error('✗ dist/index.html not found. Run `vite build` before prerendering.')
    process.exit(1)
  }

  console.log('▶ Discovering routes…')
  const routes = await discoverRoutes()
  console.log(`  ${routes.length} routes to prerender`)

  // Sitemap/robots don't need a browser — emit them first so they exist even
  // if Chromium is unavailable.
  await writeSitemapAndRobots(routes)

  console.log('▶ Starting preview server…')
  const server = await preview({ preview: { port: 0 }, logLevel: 'silent' })
  const base = server.resolvedUrls?.local?.[0]?.replace(/\/+$/, '')
  if (!base) {
    await closeServer(server)
    console.error('✗ Could not resolve preview server URL.')
    process.exit(1)
  }

  let puppeteer
  let browser
  try {
    puppeteer = (await import('puppeteer')).default
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  } catch (err) {
    await closeServer(server)
    console.warn(`  ⚠ Headless Chromium unavailable (${err.message}).`)
    console.warn('    Skipping HTML snapshots — plain SPA build is left in place.')
    console.warn('    Install it with:  npx puppeteer browsers install chrome')
    return
  }

  console.log('▶ Snapshotting pages…')
  let ok = 0
  let failed = 0
  for (const route of routes) {
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(30000)
    try {
      await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' })
      // <Seo> flips this once title/meta/content are settled. Non-Seo pages
      // simply hit the timeout and snapshot after the settle below.
      await page.waitForSelector('html[data-seo-ready]', { timeout: 10000 }).catch(() => {})
      await sleep(800) // let a late Strapi refresh / images land
      const html = await page.content()
      await writeSnapshot(route, html)
      ok += 1
      console.log(`  ✓ ${route}`)
    } catch (err) {
      failed += 1
      console.warn(`  ✗ ${route} — ${err.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  await closeServer(server)
  console.log(`\n✔ Prerendered ${ok} page(s)${failed ? `, ${failed} failed` : ''}.`)
}

function closeServer(server) {
  return new Promise((resolve) => {
    if (server?.httpServer) server.httpServer.close(() => resolve())
    else resolve()
  })
}

main().catch((err) => {
  console.error('✗ Prerender failed:', err)
  process.exit(1)
})
