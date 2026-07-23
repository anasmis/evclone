import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { normalizeRoutePath } from './normalizeRoutePath'

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

export default function useInternalRouteNavigation() {
  const navigate = useNavigate()

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) {
        return
      }

      const link = event.target.closest('a[href]')
      if (!link) {
        return
      }

      const rawHref = link.getAttribute('href')
      if (!rawHref) {
        return
      }

      if (
        rawHref.startsWith('#') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('javascript:')
      ) {
        return
      }

      if (link.target && link.target !== '_self') {
        return
      }

      let url
      try {
        url = new URL(rawHref, window.location.href)
      } catch {
        return
      }

      if (!['http:', 'https:'].includes(url.protocol) || url.origin !== window.location.origin) {
        return
      }

      const nextPathname = normalizeRoutePath(url.pathname)
      const nextUrl = `${nextPathname}${url.search}${url.hash}`
      const currentUrl = `${normalizeRoutePath(window.location.pathname)}${window.location.search}${window.location.hash}`

      if (nextUrl === currentUrl) {
        return
      }

      event.preventDefault()
      navigate(nextUrl)
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [navigate])
}
