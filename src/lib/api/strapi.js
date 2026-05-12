// Strapi REST client for EVplug
//
// Reads configuration from Vite env vars:
//   VITE_STRAPI_URL    -> e.g. https://cms.evplug.ma
//   VITE_STRAPI_TOKEN  -> Strapi API token (read/write depending on the route)
//
// Strapi REST conventions used here:
//   - Create:  POST   {baseUrl}/api/{plural}     body: { data: {...} }
//   - List:    GET    {baseUrl}/api/{plural}?...
//   - Find:    GET    {baseUrl}/api/{plural}/:id
// All write helpers wrap the payload in `{ data }` automatically.

const RAW_URL = import.meta.env.VITE_STRAPI_URL || ''
const STRAPI_URL = RAW_URL.replace(/\/+$/, '')
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN || ''

export class StrapiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message)
    this.name = 'StrapiError'
    this.status = status
    this.body = body
  }
}

function ensureConfigured() {
  if (!STRAPI_URL) {
    throw new StrapiError(
      'Strapi URL is not configured. Set VITE_STRAPI_URL in your .env.',
    )
  }
}

function buildHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra }
  if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`
  return headers
}

function buildUrl(path, query) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${STRAPI_URL}${cleanPath}`)
  if (query && typeof query === 'object') {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue
      url.searchParams.append(key, String(value))
    }
  }
  return url.toString()
}

async function request(path, { method = 'GET', body, query, headers } = {}) {
  ensureConfigured()
  const init = {
    method,
    headers: buildHeaders(headers),
  }
  if (body !== undefined) init.body = JSON.stringify(body)

  let res
  try {
    res = await fetch(buildUrl(path, query), init)
  } catch (err) {
    throw new StrapiError(`Network error: ${err.message}`, { status: 0 })
  }

  const text = await res.text()
  const data = text ? safeParseJson(text) : null

  if (!res.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Strapi request failed with status ${res.status}`
    throw new StrapiError(message, { status: res.status, body: data })
  }

  return data
}

function safeParseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

// Generic create helper. Returns the entry attributes plus its id.
async function createEntry(plural, data) {
  const res = await request(`/api/${plural}`, {
    method: 'POST',
    body: { data },
  })
  const entry = res?.data
  if (!entry) return res
  // Strapi v4 returns { data: { id, attributes: {...} } }
  // Strapi v5 returns { data: { id, ...attributes } }
  if (entry.attributes) return { id: entry.id, ...entry.attributes }
  return entry
}

async function listEntries(plural, query) {
  const res = await request(`/api/${plural}`, { method: 'GET', query })
  const items = res?.data ?? []
  return items.map((entry) =>
    entry?.attributes ? { id: entry.id, ...entry.attributes } : entry,
  )
}

async function findEntry(plural, id, query) {
  const res = await request(`/api/${plural}/${id}`, { method: 'GET', query })
  const entry = res?.data
  if (!entry) return null
  return entry.attributes ? { id: entry.id, ...entry.attributes } : entry
}

// -------------------------------------------------------------------
// Form-submission endpoints (writes)
// -------------------------------------------------------------------

// ContactUs.jsx form
export function submitContactSubmission(values) {
  const payload = {
    name: values.fullName ?? values.name ?? '',
    email: values.email ?? '',
    phone: values.phone ?? '',
    topic: values.topic ?? 'autre',
    subject: values.subject ?? '',
    message: values.message ?? '',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    submitted_at: new Date().toISOString(),
    orderType: values.orderType ?? 'contact',
  }
  return createEntry('evplug-contact-submissions', payload)
}

// FloatingCtaForm.jsx (used on solutions/training/home pages)
export function submitLead(values) {
  const payload = {
    name: values.name ?? values.fullName ?? '',
    email: values.email ?? '',
    phone: values.phone ?? '',
    interest: values.interest ?? '',
    message: values.message ?? '',
    pageUrl:
      values.pageUrl ??
      (typeof window !== 'undefined' ? window.location.href : ''),
    submittedAt: values.submittedAt ?? new Date().toISOString(),
    source: values.source ?? 'FloatingCtaForm',
  }
  return createEntry('evplug-leads', payload)
}

// Newsletter.jsx
export function subscribeNewsletter(email) {
  return createEntry('evplug-newsletter-subscriptions', {
    email,
    subscribed_at: new Date().toISOString(),
  })
}

// Carte EVplug order (future order form)
export function submitChargeCardOrder(values) {
  return createEntry('evplug-charge-card-orders', {
    cardType: values.cardType ?? '',
    fullName: values.fullName ?? '',
    email: values.email ?? '',
    phone: values.phone ?? '',
    initialAmount: values.initialAmount ?? null,
    address: values.address ?? '',
    orderDate: new Date().toISOString(),
    orderNumber:
      values.orderNumber ??
      `EVP-${Date.now().toString(36).toUpperCase()}`,
  })
}

// Sector-specific detailed forms (schemas defined in /Strapi API; UI may evolve)
export function submitCoproprieteRequest(values) {
  return createEntry('copropriete-requests', values)
}

export function submitEnterpriseRequest(values) {
  return createEntry('enterprise-requests', values)
}

export function submitParkingRequest(values) {
  return createEntry('parking-requests', values)
}

export function submitHospitaliteRequest(values) {
  return createEntry('hospitalite-requests', values)
}

export function submitTrainingRequest(values) {
  return createEntry('training-requests', values)
}

export function submitPlatformDemoRequest(values) {
  return createEntry('platform-demo-requests', values)
}

// -------------------------------------------------------------------
// Content reads
// -------------------------------------------------------------------

export function fetchBlogPosts(query = {}) {
  return listEntries('evplug-blog-posts', {
    'populate[author]': '*',
    sort: 'createdAt:desc',
    ...query,
  })
}

export function fetchBlogPost(idOrSlug, query = {}) {
  return findEntry('evplug-blog-posts', idOrSlug, {
    'populate[author]': '*',
    ...query,
  })
}

export function fetchServices(query = {}) {
  return listEntries('evplug-services', { 'populate[icon]': '*', ...query })
}

export function fetchChargingStations(query = {}) {
  return listEntries('evplug-charging-stations', {
    'pagination[pageSize]': 100,
    ...query,
  })
}

// Single-type: CMS-managed copy for /solutions/evone-management-platform.
// Populates every component + media so the React page can render directly.
export async function fetchEvonePage(query = {}) {
  const res = await request('/api/evone-platform-page', {
    method: 'GET',
    query: {
      'populate[heroImage]': '*',
      'populate[featurePills][populate]': '*',
      'populate[detailRows][populate]': '*',
      'populate[operationsRows][populate]': '*',
      'populate[faqItems]': '*',
      'populate[midCtaDecorImage]': '*',
      ...query,
    },
  })
  const entry = res?.data
  if (!entry) return null
  return entry.attributes ? { id: entry.id, ...entry.attributes } : entry
}

// Resolve a Strapi media field to an absolute URL.
// Accepts the raw `{ data: { attributes: { url } } }` v4 shape, the flat v5
// shape `{ url }`, or null. Returns null when the field is unset.
export function strapiMediaUrl(media) {
  if (!media) return null
  const node = media.data?.attributes ?? media.data ?? media
  const url = node?.url
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return `${STRAPI_URL}${url.startsWith('/') ? url : `/${url}`}`
}

// Convenience: expose low-level helpers for ad-hoc calls
export const strapi = {
  request,
  createEntry,
  listEntries,
  findEntry,
  get url() {
    return STRAPI_URL
  },
  get hasToken() {
    return Boolean(STRAPI_TOKEN)
  },
}
