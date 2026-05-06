function stripLeadingSlash(value) {
  return value.replace(/^\/+/, '')
}

export function resolveAssetUrl(rawPath) {
  if (!rawPath) {
    return rawPath
  }

  return rawPath
}

export function resolvePodenergyAsset(relativePath) {
  if (!relativePath) {
    return relativePath
  }

  const cleaned = stripLeadingSlash(relativePath)
  return resolveAssetUrl(`/assets/podenergy.com/${cleaned}`)
}
