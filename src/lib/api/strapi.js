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

async function listAllEntries(plural, query = {}) {
  const pageSize = 100
  const normalizePage = (entries) => (entries ?? []).map((entry) =>
    entry?.attributes ? { id: entry.id, ...entry.attributes } : entry,
  )
  const firstPage = await request(`/api/${plural}`, {
    method: 'GET',
    query: {
      ...query,
      'pagination[page]': 1,
      'pagination[pageSize]': pageSize,
    },
  })
  const items = normalizePage(firstPage?.data)
  const pageCount = Math.max(1, Number(firstPage?.meta?.pagination?.pageCount) || 1)

  for (let page = 2; page <= pageCount; page += 1) {
    const response = await request(`/api/${plural}`, {
      method: 'GET',
      query: {
        ...query,
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      },
    })
    items.push(...normalizePage(response?.data))
  }

  return items
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

// Common fields every "request" collection shares. The simple FloatingCtaForm
// only collects name/email/phone/interest/message; each page routes to its own
// dedicated collection (the generic `evplug-leads` bucket was removed).
function commonRequestFields(values, defaultSource) {
  return {
    name: values.name ?? values.fullName ?? '',
    email: values.email ?? '',
    phone: values.phone ?? '',
    interest: values.interest ?? '',
    message: values.message ?? '',
    pageUrl:
      values.pageUrl ??
      (typeof window !== 'undefined' ? window.location.href : ''),
    submittedAt: values.submittedAt ?? new Date().toISOString(),
    source: values.source ?? defaultSource,
  }
}

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

// Sector-specific request collections. Each solution/training/home page submits
// to its own collection so leads land in clearly-labelled buckets in Strapi.
export function submitCoproprieteRequest(values) {
  return createEntry('copropriete-requests', commonRequestFields(values, 'EvCopropriete Page'))
}

export function submitEnterpriseRequest(values) {
  return createEntry('enterprise-requests', commonRequestFields(values, 'EvEntreprise Page'))
}

export function submitParkingRequest(values) {
  return createEntry('parking-requests', commonRequestFields(values, 'EvParking Page'))
}

export function submitHospitaliteRequest(values) {
  return createEntry('hospitalite-requests', commonRequestFields(values, 'Hospitalité Page'))
}

export function submitTrainingRequest(values) {
  return createEntry('training-requests', commonRequestFields(values, 'Certification Page'))
}

export function submitPlatformDemoRequest(values) {
  return createEntry('platform-demo-requests', commonRequestFields(values, 'Platform Page'))
}

export function submitStationServiceRequest(values) {
  return createEntry('station-service-requests', commonRequestFields(values, 'EvStationService Page'))
}

export function submitHomeChargingRequest(values) {
  return createEntry('home-charging-requests', commonRequestFields(values, 'HomeCharging Page'))
}

export function submitPartnerRequest(values) {
  return createEntry('partner-requests', commonRequestFields(values, 'Network Map Page'))
}

export function submitCarteRequest(values) {
  return createEntry('carte-evplug-requests', commonRequestFields(values, 'Carte EVplug Page'))
}

// -------------------------------------------------------------------
// Content reads — articles (News & Guides share one collection,
// distinguished by `kind`: "news" | "guide").
// -------------------------------------------------------------------

function resolveArticleImage(image) {
  if (!image) return ''
  if (typeof image === 'string') return image.trim()
  return strapiMediaUrl(image) || ''
}

// Normalize a Strapi blog-post entry into the shape the listing cards and
// ArticlePage block renderer expect.
export function normalizeArticle(entry) {
  if (!entry) return null
  return {
    id: entry.id,
    slug: entry.slug,
    kind: entry.kind ?? 'news',
    title: entry.title ?? '',
    description: entry.description ?? '',
    image: strapiMediaUrl(entry.image) || '',
    date: entry.date ?? '',
    readTime: entry.readTime ?? null,
    tag: entry.tag ?? '',
    categories: Array.isArray(entry.categories) ? entry.categories : [],
    body: Array.isArray(entry.body) ? entry.body : [],
    featured: entry.featured ?? false,
    author: entry.author ?? null,
  }
}

// Normalize the newer `articles` collection used by the editorial/news pages.
// This schema stores the cover image as text and the article body as rich text.
export function normalizeEditorialArticle(entry) {
  if (!entry) return null
  const publishedDate = entry.publishedDate ?? entry.publishedAt ?? ''
  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title ?? '',
    description: entry.excerpt ?? entry.description ?? '',
    excerpt: entry.excerpt ?? entry.description ?? '',
    image: resolveArticleImage(entry.image),
    date: publishedDate,
    publishedDate,
    readTime: entry.readTime ?? null,
    tag: entry.tag ?? '',
    content: typeof entry.content === 'string' ? entry.content : '',
    gallery: Array.isArray(entry.gallery) ? entry.gallery : [],
    featured: entry.isFeatured ?? false,
    breakingNews: entry.isBreakingNews ?? false,
    author: entry.author ?? null,
    category: entry.category ?? null,
    metaTitle: entry.metaTitle ?? '',
    metaDescription: entry.metaDescription ?? '',
    metaKeywords: entry.metaKeywords ?? '',
    ogImage: entry.ogImage ?? null,
    language: entry.language ?? 'fr',
    status: entry.status ?? 'draft',
  }
}

async function fetchArticlesByKind(kind, query = {}) {
  const items = await listEntries('evplug-blog-posts', {
    'filters[kind][$eq]': kind,
    // Strapi v5 rejects `populate[image]=*` for a media field with a 400
    // ("Invalid key related at image.related"); `=true` is the correct form.
    'populate[image]': 'true',
    'populate[author]': 'true',
    sort: 'createdAt:desc',
    'pagination[pageSize]': 100,
    ...query,
  })
  return items.map(normalizeArticle)
}

export function fetchNewsArticles(query = {}) {
  return fetchArticlesByKind('news', query)
}

export function fetchGuideArticles(query = {}) {
  return fetchArticlesByKind('guide', query)
}

export function fetchEditorialArticles(query = {}) {
  return listEntries('articles', {
    // Latest published editorial items first.
    sort: 'publishedAt:desc',
    'pagination[pageSize]': 100,
    ...query,
  }).then((items) => items.map(normalizeEditorialArticle))
}

// Find a single article by slug (Strapi's findOne expects an id/documentId,
// not a slug, so we filter instead).
export async function fetchArticleBySlug(kind, slug, query = {}) {
  const items = await listEntries('evplug-blog-posts', {
    'filters[slug][$eq]': slug,
    'filters[kind][$eq]': kind,
    'populate[image]': 'true',
    'populate[author]': 'true',
    'pagination[pageSize]': 1,
    ...query,
  })
  return items.length ? normalizeArticle(items[0]) : null
}

export async function fetchEditorialArticleBySlug(slug, query = {}) {
  const items = await listEntries('articles', {
    'filters[slug][$eq]': slug,
    'pagination[pageSize]': 1,
    ...query,
  })
  return items.length ? normalizeEditorialArticle(items[0]) : null
}

export function fetchServices(query = {}) {
  return listEntries('evplug-services', { 'populate[icon]': '*', ...query })
}

const firstValue = (entry, keys, fallback = '') => {
  for (const key of keys) {
    const value = entry?.[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return fallback
}

const numericValue = (entry, keys) => {
  const value = Number(firstValue(entry, keys, Number.NaN))
  return Number.isFinite(value) ? value : null
}

const decimalFromText = (value) => {
  const numeric = Number(String(value ?? '').replace(',', '.').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(numeric) ? numeric : null
}

const batteryCapacityFromText = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  const text = String(value ?? '').trim()
  if (!text) return null

  const usableBefore = text.match(/(\d+(?:[,.]\d+)?)\s*kWh[^0-9]{0,24}utilis/i)
  const usableAfter = text.match(/utilis[^0-9]{0,24}(\d+(?:[,.]\d+)?)\s*kWh/i)
  const firstCapacity = text.match(/(\d+(?:[,.]\d+)?)\s*kWh/i)
  return decimalFromText(usableBefore?.[1] || usableAfter?.[1] || firstCapacity?.[1] || (/^\d+(?:[,.]\d+)?$/.test(text) ? text : ''))
}

const chargingPowerFromText = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  const match = String(value ?? '').match(/(\d+(?:[,.]\d+)?)\s*kW(?!h)/i)
  const text = String(value ?? '').trim()
  return decimalFromText(match?.[1] || (/^\d+(?:[,.]\d+)?$/.test(text) ? text : ''))
}

export function normalizeComparatorProduct(entry) {
  if (!entry) return null
  return {
    id: entry.documentId || String(entry.id),
    name: firstValue(entry, ['Name', 'name', 'Nom']),
    brand: firstValue(entry, ['Brand', 'brand', 'Marque']),
    category: firstValue(entry, ['Type', 'subcategory', 'category', 'Categorie']),
    price: numericValue(entry, ['price', 'prix']),
    image: strapiMediaUrl(entry.Image) || strapiMediaUrl(entry.image) || '',
    description: firstValue(entry, ['Description', 'DescriptionAccessory', 'description']),
    power: firstValue(entry, ['Puissancedecharge', 'power', 'Puissance']),
    voltage: firstValue(entry, ['voltage', 'Tension']),
    current: firstValue(entry, ['current', 'Courant']),
    dimensions: firstValue(entry, ['Dimensionsduboitier', 'dimensions', 'Dimensions']),
    weight: firstValue(entry, ['Poids', 'weight']),
    warranty: firstValue(entry, ['Garantiefournisseur', 'warranty', 'Garantie']),
    connectivity: firstValue(entry, ['Connectivite', 'connectivity']),
    features: firstValue(entry, ['caracteristic_list', 'features'], []),
    specifications: entry.specifications && typeof entry.specifications === 'object' ? entry.specifications : {},
  }
}

export function normalizeComparatorVehicle(entry) {
  if (!entry) return null
  const brand = firstValue(entry, ['Brand', 'Marque', 'brand'])
  const model = firstValue(entry, ['Modele', 'model'])
  const battery = firstValue(entry, ['Capacitebatterie', 'Capacitedebatterie', 'batteryCapacity'])
  const acCharging = firstValue(entry, ['RechargeACmax', 'PuissancemaxAC', 'ChargeAC', 'ConnecteurAC'])
  return {
    id: entry.documentId || String(entry.id),
    name: firstValue(entry, ['FullName', 'name'], [brand, model].filter(Boolean).join(' ')),
    brand,
    model,
    category: firstValue(entry, ['Categorie', 'category']),
    price: numericValue(entry, ['prix', 'price']),
    image: strapiMediaUrl(entry.Images) || strapiMediaUrl(entry.image) || strapiMediaUrl(entry.Image) || '',
    range: firstValue(entry, ['Autonomieofficielle', 'range']),
    battery,
    batteryCapacity: batteryCapacityFromText(battery),
    consumption: firstValue(entry, ['ConsommationmixteWLTP', 'Consommation', 'consumption']),
    power: firstValue(entry, ['Puissance', 'Puissancemaxi', 'power']),
    acceleration: firstValue(entry, ['Accelerationde0a100kmh', 'acceleration']),
    topSpeed: firstValue(entry, ['Vitessemax', 'Vitessemaxi', 'topSpeed']),
    fastCharging: firstValue(entry, ['RechargeDCmax', 'PuissancemaxDC', 'Tempsderechargerapide', 'fastCharging']),
    acCharging,
    maxAcPower: chargingPowerFromText(acCharging),
    chargingType: [firstValue(entry, ['ConnecteurAC']), firstValue(entry, ['ConnecteurDC'])].filter(Boolean).join(' / ') || firstValue(entry, ['Typederecharge', 'chargingType']),
    seats: firstValue(entry, ['Places', 'Nombredeplace', 'seats']),
    trunkVolume: firstValue(entry, ['Volumeducoffre', 'Volumedecoffre', 'trunkVolume']),
    weight: firstValue(entry, ['Poids', 'weight']),
    dimensions: [
      firstValue(entry, ['Longueur', 'length']),
      firstValue(entry, ['Largeur', 'width']),
      firstValue(entry, ['Hauteur', 'height']),
    ].filter(Boolean).join(' × '),
    warranty: firstValue(entry, ['Garantie', 'warranty']),
  }
}

let comparatorProductsCache = null
let comparatorVehiclesCache = null

async function loadComparatorProducts(query = {}) {
  const items = await listAllEntries('products', {
    populate: '*',
    sort: 'Name:asc',
    ...query,
  })
  return items.map(normalizeComparatorProduct).filter((item) => item?.name)
}

async function loadComparatorVehicles(query = {}) {
  const items = await listAllEntries('vehicules', {
    populate: '*',
    sort: 'FullName:asc',
    ...query,
  })
  return items.map(normalizeComparatorVehicle).filter((item) => item?.name)
}

export function fetchComparatorProducts(query = {}) {
  if (Object.keys(query).length) return loadComparatorProducts(query)
  if (!comparatorProductsCache) {
    comparatorProductsCache = loadComparatorProducts().catch((error) => {
      comparatorProductsCache = null
      throw error
    })
  }
  return comparatorProductsCache
}

export function fetchComparatorVehicles(query = {}) {
  if (Object.keys(query).length) return loadComparatorVehicles(query)
  if (!comparatorVehiclesCache) {
    comparatorVehiclesCache = loadComparatorVehicles().catch((error) => {
      comparatorVehiclesCache = null
      throw error
    })
  }
  return comparatorVehiclesCache
}

// -------------------------------------------------------------------
// Content reads — charging stations
// -------------------------------------------------------------------

const STATION_STATUS_MAP = {
  Available: 'available',
  Occupied: 'busy',
  Maintenance: 'maintenance',
}

// Map the Strapi station shape (latitude/longitude/stationStatus/chargerType/
// connectorTypes) onto the shape NetworkMapPage renders.
export function normalizeStation(entry) {
  if (!entry) return null
  const lat = Number(entry.latitude)
  const lng = Number(entry.longitude)
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null
  return {
    id: entry.documentId || String(entry.id),
    name: entry.name ?? '',
    city: entry.city ?? '',
    address: entry.address ?? '',
    lat,
    lng,
    type: entry.chargerType === 'DC' ? 'DC' : 'AC',
    power: entry.power ?? null,
    connectors: Array.isArray(entry.connectorTypes) ? entry.connectorTypes : [],
    status: STATION_STATUS_MAP[entry.stationStatus] || 'available',
    hours: entry.hours ?? '',
    operator: entry.operator ?? '',
    points: entry.points ?? entry.nombrePoints ?? null,
  }
}

export async function fetchChargingStations(query = {}) {
  const items = await listEntries('evplug-charging-stations', {
    'pagination[pageSize]': 100,
    ...query,
  })
  return items.map(normalizeStation).filter(Boolean)
}

// -------------------------------------------------------------------
// Content reads — Google reviews (proxied server-side so the Google
// Places API key stays off the client). Returns null when the backend
// has no data configured yet, so callers can render nothing gracefully.
// -------------------------------------------------------------------
export async function fetchGoogleReviews() {
  const res = await request('/api/google-reviews', { method: 'GET' })
  return res?.data ?? null
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
  const rawNode = media.data?.attributes ?? media.data ?? media
  const firstNode = Array.isArray(rawNode) ? rawNode[0] : rawNode
  const node = firstNode?.attributes ?? firstNode
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
