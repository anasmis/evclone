const ASSET_PREFIXES = ['/assets/podenergy.com/', '/podenergy.com/']

export function normalizeRoutePath(pathname) {
  if (!pathname || typeof pathname !== 'string') {
    return '/'
  }

  let normalized = pathname

  for (const prefix of ASSET_PREFIXES) {
    if (normalized.startsWith(prefix)) {
      normalized = `/${normalized.slice(prefix.length)}`
      break
    }
  }

  normalized = normalized.replace(/\/index\.html$/i, '/')
  normalized = normalized.replace(/\.html$/i, '')
  normalized = normalized.replace(/\/{2,}/g, '/')

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.replace(/\/+$/, '')
  }

  return normalized || '/'
}