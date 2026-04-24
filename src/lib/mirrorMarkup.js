const SKIP_URL_PATTERN = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i
const PODENERGY_ROOT = '/assets/podenergy.com/'
const LOCAL_BASE_ORIGIN = 'https://local.mirror'

const COPY_REPLACEMENTS = [
  [/Home charging/g, 'Recharge a domicile'],
  [/Commercial charging/g, 'Recharge professionnelle'],
  [/Help &amp; advice/g, 'Conseils'],
  [/Community/g, 'Entreprise'],
  [/Installer hub/g, 'Espace installateurs'],
  [/Order now/g, 'Demander un devis'],
  [/Find out more/g, 'En savoir plus'],
  [/Learn more/g, 'En savoir plus'],
  [/Learn about our mission/g, 'Decouvrir notre mission'],
  [/About Pod/g, "A propos d'EVplug"],
  [/Contact us/g, 'Contactez-nous'],
  [/Contact Us/g, 'Contactez-nous'],
  [/Follow us/g, 'Suivez-nous'],
  [/Our Pod promise/g, 'Notre engagement EVplug'],
  [/Power of the People\.?/g, "L'electromobilite pour tous."],
  [/Powering people\. One journey at a time\./g, "L'electromobilite au service du Maroc."],
  [/Compatible with all plug-in vehicle brands/g, 'Compatible avec les principales marques de vehicules electriques'],
  [/Buy a Pod Point/g, 'Installer une borne EVplug'],
  [/Join Pod Drive/g, 'Etudier votre projet'],
  [/Discover Pod Drive/g, 'Decouvrir nos solutions'],
  [/What our customers say/g, 'Ce que nos clients disent'],
  [/What it's like to be part of the Pod community/g, 'Ce que disent nos clients au Maroc'],
  [/Which\?/g, 'EVplug'],
  [/Registered in England, no 06851754\s*&nbsp;\|&nbsp;\s*222 Gray's Inn Road, London WC1X 8HB/g, 'Siege : Casablanca, Maroc &nbsp;|&nbsp; Interventions : Casablanca, Rabat, Marrakech, Tanger'],
  [/6th Floor<br>222 Gray's Inn Road<br>London<br>WC1X 8HB/g, 'Parc Casa Nearshore<br>Casablanca, Maroc'],
  [/Gray's Inn Road/g, "Boulevard d'Anfa"],
  [/London/g, 'Casablanca'],
  [/Russell Square/g, 'Casablanca'],
  [/Chancery Lane/g, 'Rabat'],
  [/UK/g, 'Maroc'],
  [/OZEV/g, 'programme de soutien local'],
  [/Klarna/g, 'partenaire financier local'],
  [/EDF/g, 'partenaire energie'],
  [/Pod Point/g, 'EVplug'],
  [/Podpoint/g, 'EVplug'],
  [/Pod Drive/g, 'EVplug Pro'],
  [/Pod Power/g, 'EVplug Energie'],
]

function ensureLeadingSlash(path) {
  return path.startsWith('/') ? path : `/${path}`
}

export function adaptCopyForEvplugMorocco(rawText) {
  if (!rawText) {
    return rawText
  }

  return COPY_REPLACEMENTS.reduce((current, [pattern, replacement]) => {
    return current.replace(pattern, replacement)
  }, rawText)
}

export function htmlPathToRoutePath(htmlPath) {
  if (!htmlPath) {
    return '/'
  }

  let normalized = htmlPath.replace(/^\/+/, '')
  if (!normalized.endsWith('.html')) {
    normalized = `${normalized}.html`
  }

  if (normalized === 'index.html') {
    return '/'
  }

  return ensureLeadingSlash(normalized.replace(/\.html$/i, ''))
}

export function routePathToHtmlPath(routePath) {
  const normalized = (routePath || '/').replace(/^\/+/, '').replace(/\/+$/, '')

  if (!normalized) {
    return 'index.html'
  }

  return `${normalized}.html`
}

function toCurrentHtmlDirectory(currentHtmlPath = 'index.html') {
  const normalized = currentHtmlPath.replace(/^\/+/, '')
  const slashIndex = normalized.lastIndexOf('/')

  if (slashIndex === -1) {
    return ''
  }

  return normalized.slice(0, slashIndex + 1)
}

function resolvePodenergyPath(rawPath, currentHtmlPath = 'index.html') {
  const htmlDirectory = toCurrentHtmlDirectory(currentHtmlPath)
  const basePath = `/assets/podenergy.com/${htmlDirectory}`
  const baseUrl = new URL(basePath, LOCAL_BASE_ORIGIN)
  const resolved = new URL(rawPath, baseUrl)

  return resolved.pathname
}

export function normalizeAssetUrl(url, currentHtmlPath = 'index.html') {
  if (!url) {
    return url
  }

  const trimmed = url.trim()
  if (!trimmed || SKIP_URL_PATTERN.test(trimmed)) {
    return trimmed
  }

  if (trimmed.startsWith('/assets/')) {
    return trimmed
  }

  if (trimmed.startsWith('/')) {
    return `/assets/podenergy.com${trimmed}`
  }

  return resolvePodenergyPath(trimmed, currentHtmlPath)
}

export function normalizeLinkUrl(url, currentHtmlPath = 'index.html') {
  if (!url) {
    return url
  }

  const trimmed = url.trim()
  if (!trimmed || SKIP_URL_PATTERN.test(trimmed)) {
    return trimmed
  }

  if (trimmed.startsWith('../') || trimmed.startsWith('./') || !trimmed.startsWith('/')) {
    const asAsset = resolvePodenergyPath(trimmed, currentHtmlPath)
    const htmlAssetMatch = asAsset.match(/^\/assets\/podenergy\.com\/(.*\.html)$/i)

    if (htmlAssetMatch) {
      return htmlPathToRoutePath(htmlAssetMatch[1])
    }
    return asAsset
  }

  if (trimmed.startsWith('/assets/')) {
    const htmlAssetMatch = trimmed.match(/^\/assets\/podenergy\.com\/(.*\.html)$/i)

    if (htmlAssetMatch) {
      return htmlPathToRoutePath(htmlAssetMatch[1])
    }

    return trimmed
  }

  if (trimmed.startsWith('/')) {
    if (trimmed.endsWith('.html')) {
      return htmlPathToRoutePath(trimmed.slice(1))
    }

    return `/assets/podenergy.com${trimmed}`
  }

  if (trimmed.endsWith('.html')) {
    return htmlPathToRoutePath(trimmed)
  }

  return resolvePodenergyPath(trimmed, currentHtmlPath)
}

export function normalizeSrcSet(srcSet, currentHtmlPath = 'index.html') {
  if (!srcSet) {
    return srcSet
  }

  return srcSet
    .split(',')
    .map((entry) => {
      const trimmedEntry = entry.trim()
      if (!trimmedEntry) {
        return trimmedEntry
      }

      const [url, descriptor] = trimmedEntry.split(/\s+/, 2)
      const normalizedUrl = normalizeAssetUrl(url, currentHtmlPath)

      return descriptor ? `${normalizedUrl} ${descriptor}` : normalizedUrl
    })
    .join(', ')
}

export function normalizeInlineStyle(styleText, currentHtmlPath = 'index.html') {
  if (!styleText) {
    return styleText
  }

  return styleText.replace(/url\((['"]?)(.*?)\1\)/gi, (_, quote, rawUrl) => {
    const normalizedUrl = normalizeAssetUrl(rawUrl, currentHtmlPath)
    return `url(${quote}${normalizedUrl}${quote})`
  })
}

export function migrateBodyMarkup(bodyMarkup, currentHtmlPath = 'index.html') {
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${bodyMarkup}</body>`, 'text/html')
  const inlineScripts = []

  doc.body.querySelectorAll('script').forEach((scriptTag) => {
    inlineScripts.push({
      src: scriptTag.getAttribute('src'),
      type: scriptTag.getAttribute('type') || 'text/javascript',
      async: scriptTag.hasAttribute('async'),
      defer: scriptTag.hasAttribute('defer'),
      id: scriptTag.getAttribute('id'),
      content: scriptTag.textContent || '',
    })

    scriptTag.remove()
  })

  doc.body.querySelectorAll('*').forEach((element) => {
    ;['src', 'poster', 'data-src'].forEach((attr) => {
      if (element.hasAttribute(attr)) {
        element.setAttribute(attr, normalizeAssetUrl(element.getAttribute(attr), currentHtmlPath))
      }
    })

    ;['href', 'action', 'data-href'].forEach((attr) => {
      if (element.hasAttribute(attr)) {
        element.setAttribute(attr, normalizeLinkUrl(element.getAttribute(attr), currentHtmlPath))
      }
    })

    if (element.hasAttribute('srcset')) {
      element.setAttribute('srcset', normalizeSrcSet(element.getAttribute('srcset'), currentHtmlPath))
    }

    if (element.hasAttribute('style')) {
      element.setAttribute('style', normalizeInlineStyle(element.getAttribute('style'), currentHtmlPath))
    }
  })

  return { html: adaptCopyForEvplugMorocco(doc.body.innerHTML), inlineScripts }
}

export function executeInlineScripts(scripts, currentHtmlPath = 'index.html') {
  const appendedNodes = []

  const isBlockedScriptSource = (src) => {
    if (!src) {
      return false
    }

    const normalized = src.toLowerCase()

    return (
      normalized.includes('/core/') ||
      normalized.includes('klaro.drupal') ||
      normalized.includes('gtag.ajax') ||
      normalized.includes('drupal.init') ||
      normalized.includes('drupalsettingsloader')
    )
  }

  scripts.forEach((script) => {
    if (script.src && isBlockedScriptSource(script.src)) {
      return
    }

    const node = document.createElement('script')
    node.type = script.type || 'text/javascript'

    if (script.id) {
      node.id = script.id
    }

    if (script.async) {
      node.async = true
    }

    if (script.defer) {
      node.defer = true
    }

    if (script.src) {
      node.src = normalizeAssetUrl(script.src, currentHtmlPath)
    } else if (script.content.trim()) {
      node.textContent = script.content
    }

    document.body.appendChild(node)
    appendedNodes.push(node)
  })

  return () => {
    appendedNodes.forEach((node) => {
      if (node.parentNode) {
        node.parentNode.removeChild(node)
      }
    })
  }
}
