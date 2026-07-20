// Turn a possibly-relative image/URL into an absolute one for OG/Twitter/canonical.
// Kept in its own module (not Seo.jsx) so that component file only exports a
// component — a requirement of eslint-plugin-react-refresh / Fast Refresh.

const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '')

export function absoluteUrl(value) {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  if (!SITE_URL) return '' // never emit a wrong-origin absolute URL
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}
