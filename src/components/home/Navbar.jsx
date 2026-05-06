import { createPortal } from 'react-dom'

function normalize(text) {
  try {
    return (text || '')
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
  } catch {
    return (text || '').toString().toLowerCase().trim()
  }
}

function transformNavbarHtml(rawHtml) {
  if (!rawHtml) return ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${rawHtml}</body>`, 'text/html')
  const root = doc.querySelector('header') || doc.body

  const renameRules = [
    { test: /recharge a domicile|recharge a dom|a domicile|domicile/i, to: 'Particuliers' },
    { test: /recharge professionnelle|pro(\b|fessionnel)/i, to: 'Professionnels' },
    { test: /conseils?\s*&?\s*entreprise|conseils?(\b)/i, to: 'Conseils' },
    { test: /espace\s*installateur|installateur(s)?/i, to: 'Formation' },
    { test: /demander\s*un\s*devis|demande[r]?\s*devis|devis/i, to: 'Devis' },
  ]

  const elements = Array.from(
    root.querySelectorAll('a, button, .nav-link, .navbar-brand, .btn, .menu-item, .submenu-item-block .nav-link')
  )

  elements.forEach((el) => {
    const current = (el.textContent || '').trim()
    const norm = normalize(current)
    for (const rule of renameRules) {
      if (rule.test.test(current) || rule.test.test(norm)) {
        el.textContent = rule.to
        break
      }
    }
  })

  // Ensure "Installateurs" sits alongside "Conseils" (same list and right after it)
  const findByText = (re) =>
    Array.from(root.querySelectorAll('a.nav-link, .nav-link, a')).find((el) => re.test(normalize(el.textContent || '')))
  const conseilsLink = findByText(/conseils?/i)
  const installLink = findByText(/installateur|installateurs?|formation/i)
  if (conseilsLink && installLink) {
    const conseilsItem = conseilsLink.closest('li') || conseilsLink.parentElement
    let installItem = installLink.closest('li') || installLink.parentElement

    // Ensure the link uses nav-link styling and not button styles
    installLink.classList.remove('btn', 'btn-primary', 'btn-secondary', 'btn-outline', 'btn-secondary-outline')
    if (!installLink.classList.contains('nav-link')) {
      installLink.classList.add('nav-link')
    }

    // Ensure it's wrapped in an li.nav-item
    if (!installItem || installItem.tagName?.toLowerCase() !== 'li') {
      const li = doc.createElement('li')
      li.className = 'nav-item'
      if (installLink.parentNode) {
        installLink.parentNode.insertBefore(li, installLink)
        li.appendChild(installLink)
      } else {
        li.appendChild(installLink)
      }
      installItem = li
    } else {
      installItem.classList.add('nav-item')
    }
    const targetList = conseilsItem && (conseilsItem.closest('ul') || conseilsItem.parentElement)
    if (installItem && conseilsItem && targetList) {
      // Move Installateurs right after Conseils in its UL
      targetList.insertBefore(installItem, conseilsItem.nextSibling)
    }
  }

  // Remove any existing long-form Devis CTA to reduce cramping
  const existingCtas = Array.from(root.querySelectorAll('a.btn, button.btn')).filter((el) => {
    const t = (el.textContent || '').toLowerCase()
    return t.includes('devis') || t.includes('demander')
  })
  existingCtas.forEach((el) => el.remove())

  // Also remove any header link that points to order-now or has Devis text (outside our action group)
  const removeIfDevis = (el) => {
    if (!el) return
    if (el.closest('.evplug-nav-actions')) return
    el.remove()
  }
  const orderLinks = Array.from(
    root.querySelectorAll('a[href*="order-now"], a[href*="order%2Dnow"], a[href*="order-now33f6"]')
  )
  orderLinks.forEach(removeIfDevis)
  const devisTextLinks = Array.from(root.querySelectorAll('a, button')).filter((el) =>
    /devis/i.test((el.textContent || '').trim())
  )
  devisTextLinks.forEach(removeIfDevis)

  // Build compact action buttons group (My account, Contact, Devis)
  const headerInner = root.querySelector('.header-section-inner') || root
  const actions = doc.createElement('div')
  actions.className = 'evplug-nav-actions'

  const makeIconBtn = (href, label, svg) => {
    const a = doc.createElement('a')
    a.className = 'evplug-icon-btn'
    a.href = href
    a.setAttribute('aria-label', label)
    a.innerHTML = `${svg}<span class="sr-only">${label}</span>`
    return a
  }

  const makeMobileBtn = (href, label, svg) => {
    const a = doc.createElement('a')
    a.className = 'evplug-mobile-btn'
    a.href = href
    a.innerHTML = `${svg}<span class="label">${label}</span>`
    return a
  }

  const userSvg =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M20 20a8 8 0 1 0-16 0"/></svg>'
  const chatSvg =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-4 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z"/></svg>'
  const coinSvg =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/></svg>'

  actions.appendChild(makeIconBtn('https://myaccount.evplug.ma/authentication/login', 'My account', userSvg))
  actions.appendChild(makeIconBtn('/contact-us', 'Contact', chatSvg))
  actions.appendChild(makeIconBtn('/order-now', 'Devis', coinSvg))

  headerInner.appendChild(actions)

  // Add equivalents into the slide-out mobile menu
  const mobileRoot = root.querySelector('#mobile-menu .mobile-menu') || root.querySelector('#mobile-menu')
  if (mobileRoot) {
    const box = doc.createElement('div')
    box.className = 'evplug-mobile-actions'
    box.appendChild(makeMobileBtn('https://myaccount.evplug.ma/authentication/login', 'My account', userSvg))
    box.appendChild(makeMobileBtn('/contact-us', 'Contact', chatSvg))
    box.appendChild(makeMobileBtn('/order-now', 'Devis', coinSvg))
    mobileRoot.insertBefore(box, mobileRoot.firstChild)
  }

  return doc.body.innerHTML
}

export default function Navbar({ html }) {
  if (!html) return null

  const tweakedHtml = transformNavbarHtml(html)
  const css = `
    <style>
      /* Slightly tighter but readable navbar to avoid cramping */
      .evplug-navbar-portal nav.navbar .navbar-nav { gap: 8px; }
      .evplug-navbar-portal .header-section-inner { padding-top: 10px; padding-bottom: 10px; }
      /* Keep call-to-action compact */
      .evplug-navbar-portal .btn, .evplug-navbar-portal .navbar .btn-primary {
        padding: 0.55rem 0.9rem !important;
        font-size: 0.95rem !important;
        white-space: nowrap;
      }
      /* New compact action group in top-right */
      .evplug-navbar-portal .evplug-nav-actions {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .evplug-navbar-portal .evplug-icon-btn {
        width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center;
        border-radius: 9999px; text-decoration: none; font-weight: 700;
        color: #111 !important; /* force black icons via currentColor */
        border: 1px solid rgba(18, 61, 51, 0.18);
        background: #fff;
        box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        transition: box-shadow .15s ease, transform .1s ease, background .15s ease;
      }
      .evplug-navbar-portal .evplug-icon-btn:hover { box-shadow: 0 10px 22px rgba(0,0,0,0.18); color: #111 !important; }
      .evplug-navbar-portal .evplug-icon-btn svg { color: #111 !important; }
      .evplug-navbar-portal .evplug-icon-btn:active { transform: translateY(1px); }
      .evplug-navbar-portal .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
      /* Mobile slide-menu action buttons */
      .evplug-navbar-portal .evplug-mobile-actions { display: none; padding: 12px 14px; gap: 10px; }
      .evplug-navbar-portal .evplug-mobile-actions .evplug-mobile-btn {
        display: flex; align-items: center; gap: 10px;
        padding: 12px 14px; border-radius: 12px; text-decoration: none;
        background: #fff; color: #111 !important; border: 1px solid rgba(18,61,51,0.18);
        box-shadow: 0 6px 18px rgba(0,0,0,0.08);
      }
      .evplug-navbar-portal .evplug-mobile-actions .evplug-mobile-btn svg { flex: 0 0 18px; color: #111 !important; }
      /* Match theme's xl:hidden breakpoint for the burger (hide actions when burger shows) */
      @media (max-width: 1279px) {
        .evplug-navbar-portal .evplug-nav-actions { display: none; }
        .evplug-navbar-portal .evplug-mobile-actions { display: flex; flex-direction: column; }
      }
    </style>`

  return createPortal(
    <div className="evplug-navbar-portal" dangerouslySetInnerHTML={{ __html: css + tweakedHtml }} />,
    document.body,
  )
}
