// Canonical set of routes reachable from the navbar and footer.
// Any internal link in a mirrored page that resolves to a route outside
// this set is rewritten to '/' so users only navigate to vetted pages.

export const ALLOWED_EXACT_ROUTES = new Set([
  '/',
  // Particuliers
  '/home/home-charging',
  '/installation',
  '/products/pod-drive',
  '/products/carte-evplug',
  // Professionnels
  '/solutions/hotels',
  '/solutions/copropriete',
  '/solutions/entreprise',
  '/solutions/parkings',
  '/solutions/stations-service',
  '/solutions/evone-management-platform',
  // Conseils
  '/reseau',
  '/about',
  // Formation
  '/approved-installer-training',
  // Contact
  '/contact-us',
  // Footer
  '/offers/discounts',
  '/reports',
  '/technical/hardware',
  '/technical/installation',
  '/products/domestic-installer-guidance',
  '/sitemap',
  '/security',
  '/general-terms-and-conditions',
  '/legal/privacy-and-cookies-policy',
  '/legal/cookies-policy',
  '/legal/modern-slavery-statement',
  '/legal/policies',
  '/legal/returns-and-refunds',
])

// Articles under these prefixes are reachable through the editorial templates.
export const ALLOWED_ROUTE_PREFIXES = ['/guides', '/news', '/vehicle-guides']

// External hosts users can navigate to without rewriting.
export const ALLOWED_EXTERNAL_HOSTS = new Set([
  'maborneelectrique.ma',
  'www.maborneelectrique.ma',
  'myaccount.evplug.ma',
  'www.facebook.com',
  'www.linkedin.com',
  'www.youtube.com',
  'www.instagram.com',
  'twitter.com',
  'x.com',
])

// Known legacy hosts from the original Pod Point site that have no equivalent
// here. Map them onto the closest canonical local route instead of letting
// them produce a dead link.
export const EXTERNAL_HOST_REDIRECTS = new Map([
  ['careers.pod-point.com', '/about'],
  ['help.pod-point.com', '/contact-us'],
])

export function isCanonicalRoute(routePath) {
  if (!routePath || typeof routePath !== 'string') return false
  const baseMatch = routePath.match(/^([^?#]*)/)
  const base = (baseMatch ? baseMatch[1] : routePath).replace(/\/+$/, '') || '/'

  if (ALLOWED_EXACT_ROUTES.has(base)) return true
  for (const prefix of ALLOWED_ROUTE_PREFIXES) {
    if (base === prefix || base.startsWith(`${prefix}/`)) return true
  }
  return false
}

// Returns the canonical route for a given resolved internal path.
// If the path itself is canonical it is returned unchanged (preserving
// query/hash). Otherwise '/' is returned so the link is safe.
export function enforceCanonicalRoute(routePath) {
  if (!routePath || typeof routePath !== 'string') return '/'
  // Asset URLs pass through untouched (images, downloads, etc.).
  if (routePath.startsWith('/assets/')) return routePath

  const match = routePath.match(/^([^?#]*)([?#].*)?$/)
  const base = (match ? match[1] : routePath).replace(/\/+$/, '') || '/'
  const tail = match && match[2] ? match[2] : ''

  if (ALLOWED_EXACT_ROUTES.has(base)) return `${base}${tail}`
  for (const prefix of ALLOWED_ROUTE_PREFIXES) {
    if (base === prefix || base.startsWith(`${prefix}/`)) return `${base}${tail}`
  }
  return '/'
}
