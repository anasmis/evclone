const SKIP_URL_PATTERN = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i
const PODENERGY_ROOT = '/assets/podenergy.com/'
const LOCAL_BASE_ORIGIN = 'https://local.mirror'

const COPY_REPLACEMENTS = [
  [/Registered in England, no 06851754\s*&nbsp;\|&nbsp;\s*222 Gray's Inn Road, London WC1X 8HB/g, 'Siege : Casablanca, Maroc &nbsp;|&nbsp; Interventions : Casablanca, Rabat, Marrakech, Tanger'],
  [/6th Floor<br>222 Gray's Inn Road<br>London<br>WC1X 8HB/g, 'Parc Casa Nearshore<br>Casablanca, Maroc'],
  [/Compatible with all plug-in vehicle brands/g, 'Compatible avec les principales marques de vehicules electriques'],
  [/What it's like to be part of the Pod community/g, 'Ce que disent nos clients au Maroc'],
  [/Powering people\. One journey at a time\./g, "L'electromobilite au service du Maroc."],
  [/Power of the People\.?/g, "L'electromobilite pour tous."],
  [/A simpler way to power your fleet/g, 'Une facon simple d\'alimenter votre flotte'],
  [/Pod Home Fleet/g, 'EVplug Flotte'],
  [/Discover how we(?:&rsquo;|')re making electrification simpler for everyone/g, 'Comment nous simplifions l\'electromobilite pour tous'],
  [/With 15 years of experience, we(?:&rsquo;|')re shaping a future where living with an EV is easy, affordable and accessible for everyone\./g, 'Plus de 15 ans d\'expertise pour batir une mobilite electrique simple, accessible et fiable au Maroc.'],
  [/Voted 'Best Value Home Charger' by WhatCar\?/g, 'Solutions fiables plebiscitees par nos clients au Maroc'],
  [/Living with an EV should be accessible for everyone\. That(?:&rsquo;|')s why we(?:&rsquo;|')ve made it our mission to make charging simple\. At home, at work and on the road\./g, 'La mobilite electrique doit etre accessible a tous. Notre mission : simplifier la recharge a domicile, au bureau et sur la route.'],
  [/Our qualifiee EVplug installation makes setup effortless, and with 90% of customers qualifying for standard installation, you can start charging with zero surprises\./g, 'Nos techniciens qualifies EVplug realisent une installation soignee. La majorite des projets s\'integre dans notre forfait standard, sans mauvaise surprise.'],
  [/Our qualified EVplug installation makes setup effortless, and with 90% of customers qualifying for standard installation, you can start charging with zero surprises\./g, 'Nos techniciens qualifies EVplug realisent une installation soignee. La majorite des projets s\'integre dans notre forfait standard, sans mauvaise surprise.'],
  [/A 3-year subscription, low upfront cost, cash rewards for smart charging, enhanced warranty &amp; service\. And the charger is yours to keep\./g, 'Un abonnement sur 3 ans avec un engagement initial reduit, des recompenses pour la recharge intelligente, une garantie etendue et un service dedie. La borne vous appartient.'],
  [/Purchase your award-winning EVplug charger today, and enjoy hassle-free, effortless charging\./g, 'Commandez votre borne EVplug aujourd\'hui et profitez d\'une recharge simple et sans soucis.'],
  [/The home charger trusted by thousands of EV drivers\./g, 'La borne de recharge choisie par de nombreux conducteurs au Maroc.'],
  [/Get your home charger today and unlock exclusive access to 7 hours of low-cost electricity for your car and home, every night\./g, 'Equipez-vous d\'une borne et profitez d\'une recharge optimisee pendant les plages les plus avantageuses.'],
  [/Save Â£450\+ a year on charging with EVplug Energie tariff/g, 'Economisez jusqu\'a 5 000 DH par an avec le tarif EVplug Energie'],
  [/Save &pound;450\+ a year on charging with EVplug Energie tariff/g, 'Economisez jusqu\'a 5 000 DH par an avec le tarif EVplug Energie'],
  [/Earn up to &pound;172\.50 a year\s*(?:Ã¢â‚¬Â¨)?\s*in cashback\./g, 'Jusqu\'a 2 000 DH par an de recompenses.'],
  [/Earn up to Â£172\.50 a year\s*(?:Ã¢â‚¬Â¨)?\s*in cashback\./g, 'Jusqu\'a 2 000 DH par an de recompenses.'],
  [/Comprehensive warranty on all chargers/g, 'Garantie complete sur toutes les bornes'],
  [/Guaranteed compatibility with all plug-in vehicle brands/g, 'Compatibilite garantie avec toutes les marques de vehicules rechargeables'],
  [/Compatible with all energy suppliers/g, 'Compatible avec tous les fournisseurs d\'energie'],
  [/Peace of mind with 24\/7 support/g, "Tranquillite d'esprit avec un support 24h/24 et 7j/7"],
  [/We(?:&rsquo;|')re as good as our word\. Here(?:&rsquo;|')s our commitment to you\./g, 'Nous tenons parole. Voici nos engagements envers vous.'],
  [/Two simple ways\s*(?:Ã¢â‚¬Â¨)?\s*to get started/g, 'Deux facons simples de demarrer'],
  [/Trusted EV charging technology for your home\. Enjoy peace of mind with a 5-year warranty, included as standard\./g, 'Une technologie de recharge fiable pour votre domicile, avec une garantie de 5 ans incluse.'],
  [/Home EV charging from &pound;999\./g, 'Recharge a domicile a partir de 11 990 DH.'],
  [/Home EV charging from Â£999\./g, 'Recharge a domicile a partir de 11 990 DH.'],
  [/Home EV charging for &pound;40\/month/g, 'Recharge a domicile a 490 DH/mois'],
  [/Home EV charging for Â£40\/month/g, 'Recharge a domicile a 490 DH/mois'],
  [/Spread the cost with a simple, fixed monthly fee\./g, 'Etalez le cout avec un abonnement mensuel simple et fixe.'],
  [/Smart charging that pays/g, 'Une recharge intelligente qui rapporte'],
  [/No big upfront fee/g, 'Pas de frais initiaux eleves'],
  [/Buy it once\. Count on it daily\./g, 'Un achat unique. Une fiabilite au quotidien.'],
  [/Save &pound;1,000 on upfront costs/g, 'Economisez jusqu\'a 12 000 DH a l\'achat'],
  [/Save Â£1,000 on upfront costs/g, 'Economisez jusqu\'a 12 000 DH a l\'achat'],
  [/Save &pound;1,000 upfront/g, 'Economisez 12 000 DH a l\'achat'],
  [/Save Â£1,000 upfront/g, 'Economisez 12 000 DH a l\'achat'],
  [/From &pound;999/g, 'A partir de 11 990 DH'],
  [/From Â£999/g, 'A partir de 11 990 DH'],
  [/Buy from &pound;999/g, 'A partir de 11 990 DH'],
  [/Buy from Â£999/g, 'A partir de 11 990 DH'],
  [/Subscribe from &pound;40\/month/g, 'Abonnement a partir de 490 DH/mois'],
  [/Subscribe from Â£40\/month/g, 'Abonnement a partir de 490 DH/mois'],
  [/EV charging you can trust\./g, 'La recharge electrique qui inspire confiance.'],
  [/Compare our EV charging solutions/g, 'Comparer nos solutions de recharge'],
  [/Meet our smart EV charger/g, 'Decouvrir notre borne intelligente'],
  [/Discover our award-winning charger/g, 'Decouvrez nos bornes EVplug'],
  [/Let(?:&rsquo;|')s get you charging/g, 'A vous de recharger'],
  [/Getting installed/g, 'Service d\'installation'],
  [/Tariff made for EV drivers/g, 'Un tarif pense pour les utilisateurs VE'],
  [/All-inclusive EV smart charging/g, 'Recharge intelligente tout-en-un'],
  [/Workplace charging/g, 'Recharge en entreprise'],
  [/Here to help your business get charging/g, 'Votre partenaire pour electrifier vos locaux'],
  [/Home builders/g, 'Promoteurs immobiliers'],
  [/Charge your next development/g, 'Equipez vos prochains programmes immobiliers'],
  [/Manage my chargers/g, 'Gestion des bornes'],
  [/Login to our Site Management Service/g, 'Acceder a notre plateforme de supervision'],
  [/Fleet charging/g, 'Recharge de flottes'],
  [/Power your home fleet\./g, 'Alimentez vos vehicules de flotte.'],
  [/Tips, tricks and how-tos/g, 'Conseils, astuces et guides pratiques'],
  [/Vehicle guides/g, 'Guides vehicules'],
  [/From range to recharge, all in one place/g, 'De l\'autonomie a la recharge, tout au meme endroit'],
  [/Help [Cc]entre/g, 'Centre d\'aide'],
  [/Our mission/g, 'Notre mission'],
  [/En savoir plus sur us/g, 'En savoir plus sur nous'],
  [/Join us, you won(?:&rsquo;|')t regret it/g, 'Rejoignez-nous, vous ne le regretterez pas'],
  [/See our latest press releases/g, 'Consultez nos dernieres communications'],
  [/Skip to main content/g, 'Aller au contenu principal'],
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
  [/Buy a Pod Point/g, 'Installer une borne EVplug'],
  [/Join Pod Drive/g, 'Etudier votre projet'],
  [/Discover Pod Drive/g, 'Decouvrir nos solutions'],
  [/What our customers say/g, 'Ce que nos clients disent'],
  [/Pod offers/g, 'Offres EVplug'],
  [/>Careers</g, '>Carrieres<'],
  [/>News</g, '>Actualites<'],
  [/Gender pay gap/g, 'Egalite professionnelle'],
  [/Public charging/g, 'Recharge publique'],
  [/Technical documents/g, 'Documents techniques'],
  [/Installation documents/g, 'Documents d\'installation'],
  [/Domestic Installer guidance/g, 'Guide installateur'],
  [/>Sitemap</g, '>Plan du site<'],
  [/>Security</g, '>Securite<'],
  [/Terms &amp; conditions/g, 'Conditions generales'],
  [/Privacy notice/g, 'Politique de confidentialite'],
  [/Modern slavery statement/g, 'Engagement ethique et conformite'],
  [/>Policies</g, '>Politiques<'],
  [/Refund policy/g, 'Politique de remboursement'],
  [/>Back</g, '>Retour<'],
  [/020 7247 4114/g, '+212 5 22 00 00 00'],
  [/Which\?/g, 'EVplug'],
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
  [/Pod Drive/g, 'EVplug Card'],
  [/Pod Power/g, 'EVplug Energie'],
  [/alt="Tariff">(\s+)Tariff/g, 'alt="Tarif">$1Tarif'],
  [/alt="Home">(\s+)Home(\s+<\/span>)/g, 'alt="Domicile">$1Domicile$2'],
  [/alt="Installation">(\s+)Installation/g, 'alt="Installation">$1Installation'],
  [/Tony and Ann(?:&rsquo;|')s story/g, 'Le temoignage de Youssef et Salma'],
  [/The Scott(?:&rsquo;|')s story/g, 'Le temoignage de la famille Benali'],
  [/Trevor and Tessa(?:&rsquo;|')s story/g, 'Le temoignage de Karim et Nadia'],
  [/Gareth(?:&rsquo;|')s story/g, 'Le temoignage de Mohamed'],
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

