// Simple API client for editorial content (guides, news)
// Configure base URL via VITE_API_BASE_URL or pass absolute URLs in callers

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

function buildUrl(path, params) {
  const url = new URL(path, BASE_URL || window.location.origin)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') {
        if (Array.isArray(v)) {
          v.forEach((item) => url.searchParams.append(k, String(item)))
        } else {
          url.searchParams.set(k, String(v))
        }
      }
    }
  }
  return url.toString()
}

async function getJson(path, params, { signal } = {}) {
  const url = buildUrl(path, params)
  const res = await fetch(url, { signal })
  const ct = res.headers.get('content-type') || ''
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed ${res.status}: ${text}`)
  }
  if (!ct.includes('application/json')) {
    const text = await res.text().catch(() => '')
    throw new Error(`Expected JSON but received '${ct || 'unknown'}'. URL: ${url}. Body head: ${text.slice(0, 120)}`)
  }
  return res.json()
}

// Expected server response shape suggestions (you can adapt server side):
// {
//   items: [
//     {
//       id: string|number,
//       slug: string,
//       title: string,
//       excerpt: string,
//       imageUrl: string,
//       category: string,
//       tags: string[],
//       publishedAt: ISODateString,
//       featured: boolean
//     }
//   ],
//   total: number,
//   page: number,
//   pageSize: number
// }

export function fetchGuides(params = {}, options = {}) {
  // Example: GET /api/guides?search=&category=&page=1&pageSize=12
  return getJson(params.url || '/api/guides', params, options)
}

export function fetchNews(params = {}, options = {}) {
  // Example: GET /api/news?search=&category=&page=1&pageSize=12
  return getJson(params.url || '/api/news', params, options)
}

export function fetchGuideCategories(options = {}) {
  // Example: GET /api/guides/categories -> ["Charging", "Vehicles", ...]
  return getJson('/api/guides/categories', undefined, options)
}

export function fetchNewsCategories(options = {}) {
  // Example: GET /api/news/categories
  return getJson('/api/news/categories', undefined, options)
}
