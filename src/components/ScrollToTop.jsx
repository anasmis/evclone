import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// On every navigation (new pathname), scroll back to the top of the page.
// Skips when the URL has a hash so in-page anchor links still work.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
