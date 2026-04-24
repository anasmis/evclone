import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

      const href = link.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('/assets/')) {
        return
      }

      if (link.target && link.target !== '_self') {
        return
      }

      event.preventDefault()
      navigate(href)
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [navigate])
}
