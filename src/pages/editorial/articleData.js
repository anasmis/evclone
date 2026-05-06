import { generatedPages } from '../../generatedPages'
import { adaptCopyForEvplugMorocco, migrateBodyMarkup } from '../../lib/mirrorMarkup'
import { extractMainMarkup } from '../../lib/mirrorSplit'

const articleLoaders = import.meta.glob('../../migrated/pages/**/*.html', {
  query: '?raw',
  import: 'default',
})

const loaderByHtmlPath = new Map()
for (const [key, loader] of Object.entries(articleLoaders)) {
  const match = key.match(/migrated\/pages\/(.+)$/)
  if (match) {
    loaderByHtmlPath.set(match[1], loader)
  }
}

const articleCache = new Map()

export const editorialFamilies = {
  guides: {
    key: 'guides',
    label: 'Guides',
    title: 'Guides | EVplug',
    rootRoute: '/guides',
  },
  news: {
    key: 'news',
    label: 'Actualites',
    title: 'Actualites | EVplug',
    rootRoute: '/news',
  },
}

export const guideEntries = generatedPages.filter((entry) => entry.route.startsWith('/guides/'))
export const newsEntries = generatedPages.filter((entry) => entry.route.startsWith('/news/'))

export function getEditorialEntries(familyKey) {
  return familyKey === 'news' ? newsEntries : guideEntries
}

export function getEditorialEntryByPath(pathname, familyKey) {
  const entries = getEditorialEntries(familyKey)
  return entries.find((entry) => entry.route === pathname) || null
}

export function getEditorialFamilyKey(pathname) {
  return pathname.startsWith('/news') ? 'news' : 'guides'
}

export async function loadEditorialDocument(entry, signal) {
  if (!entry) {
    return null
  }

  if (articleCache.has(entry.route)) {
    return articleCache.get(entry.route)
  }

  const loader = loaderByHtmlPath.get(entry.htmlPath)
  let rawHtml = ''

  if (loader) {
    const loaded = await loader()
    rawHtml = typeof loaded === 'string' ? loaded : loaded?.default || ''
  }

  if (!rawHtml) {
    try {
      const response = await fetch(`/assets/podenergy.com/${entry.htmlPath}`, {
        signal,
      })
      if (response.ok) {
        rawHtml = await response.text()
      }
    } catch {
      rawHtml = ''
    }
  }

  if (!rawHtml) {
    return null
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(rawHtml, 'text/html')
  const bodyHtml = doc.body?.innerHTML || ''
  const migrated = migrateBodyMarkup(bodyHtml, entry.htmlPath)

  const record = {
    entry,
    title: adaptCopyForEvplugMorocco(doc.title || entry.title),
    htmlClassName: doc.documentElement?.className || 'path-node page-node-type-page d-flex flex-column',
    bodyClassName: doc.body?.className || 'path-node page-node-type-page d-flex flex-column',
    bodyMarkup: migrated.html,
    mainMarkup: extractMainMarkup(migrated.html),
    inlineScripts: migrated.inlineScripts,
  }

  articleCache.set(entry.route, record)
  return record
}
