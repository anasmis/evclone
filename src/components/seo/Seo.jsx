import { useEffect } from 'react'
import { absoluteUrl } from './absoluteUrl'

// Dependency-free document-head manager.
//
// Why not react-helmet? This app is prerendered by driving the real built SPA
// in a headless browser (see scripts/prerender.mjs). Whatever this component
// writes into <head> at runtime is captured verbatim in the static snapshot,
// so a tiny imperative manager is all we need — and it sidesteps react-helmet's
// shaky React 19 support.
//
// The component renders nothing. It sets the title + meta/link/JSON-LD tags on
// mount, restores/removes them on unmount so client-side navigation between
// pages never leaves stale tags behind, and flips a `data-seo-ready` flag on
// <html> that the prerender script waits for before snapshotting.

export default function Seo({
  title,
  description,
  // Path (e.g. "/news/my-slug"). Defaults to the current location.
  path,
  image,
  type = 'website',
  siteName = 'EVplug',
  locale = 'fr_FR',
  // Any JSON-LD structured-data object (or array). Rendered as its own script.
  jsonLd,
  // Set to true on pages that should not be indexed (e.g. thank-you pages).
  noindex = false,
}) {
  useEffect(() => {
    const created = []
    const restores = []
    const head = document.head

    const setMeta = (attr, key, content) => {
      if (!content) return
      let el = head.querySelector(`meta[${attr}="${key}"]`)
      if (el) {
        restores.push([el, el.getAttribute('content')])
      } else {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        head.appendChild(el)
        created.push(el)
      }
      el.setAttribute('content', content)
    }

    const setLink = (rel, href) => {
      if (!href) return
      let el = head.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        head.appendChild(el)
        created.push(el)
      } else {
        restores.push([el, el.getAttribute('href'), 'href'])
      }
      el.setAttribute('href', href)
    }

    // --- Title ---
    const prevTitle = document.title
    if (title) document.title = title

    // --- Canonical + OG url ---
    const pagePath = path || (typeof window !== 'undefined' ? window.location.pathname : '')
    const canonical = absoluteUrl(pagePath)
    const ogImage = absoluteUrl(image)

    // --- Standard meta ---
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    if (canonical) setLink('canonical', canonical)

    // --- Open Graph ---
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:site_name', siteName)
    setMeta('property', 'og:locale', locale)
    if (canonical) setMeta('property', 'og:url', canonical)
    if (ogImage) setMeta('property', 'og:image', ogImage)

    // --- Twitter ---
    setMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    if (ogImage) setMeta('name', 'twitter:image', ogImage)

    // --- JSON-LD structured data ---
    let jsonLdEl = null
    if (jsonLd) {
      jsonLdEl = document.createElement('script')
      jsonLdEl.type = 'application/ld+json'
      jsonLdEl.text = JSON.stringify(jsonLd)
      head.appendChild(jsonLdEl)
    }

    // Signal the prerenderer that head + content are settled.
    document.documentElement.setAttribute('data-seo-ready', '')

    return () => {
      document.title = prevTitle
      for (const el of created) el.remove()
      for (const [el, value, attr = 'content'] of restores) {
        if (value == null) el.removeAttribute(attr)
        else el.setAttribute(attr, value)
      }
      if (jsonLdEl) jsonLdEl.remove()
      document.documentElement.removeAttribute('data-seo-ready')
    }
  }, [title, description, path, image, type, siteName, locale, jsonLd, noindex])

  return null
}
