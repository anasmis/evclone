import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import HtmlBlock from '../components/common/HtmlBlock'
import Footer from '../components/home/Footer'
import Navbar from '../components/home/Navbar'
import homeBodyRaw from '../migrated/home-body.html?raw'
import { adaptCopyForEvplugMorocco, executeInlineScripts, migrateBodyMarkup, routePathToHtmlPath } from '../lib/mirrorMarkup'
import useInternalRouteNavigation from '../lib/useInternalRouteNavigation'

const DEFAULT_CLASSES = 'd-flex flex-column'
const DEFAULT_ROOT_CLASSES = 'dialog-off-canvas-main-canvas d-flex flex-column h-100'

function extractShellBlocks(markup) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${markup}</body>`, 'text/html')
  const body = doc.body
  const root = body.querySelector('.dialog-off-canvas-main-canvas')

  if (!root) {
    return {
      preRoot: '',
      rootClassName: DEFAULT_ROOT_CLASSES,
      navbar: '',
      footer: '',
    }
  }

  const preRootNodes = []
  let sibling = body.firstChild
  while (sibling && sibling !== root) {
    preRootNodes.push(sibling.cloneNode(true))
    sibling = sibling.nextSibling
  }

  const preRootContainer = document.createElement('div')
  preRootNodes.forEach((node) => preRootContainer.appendChild(node))

  return {
    preRoot: preRootContainer.innerHTML,
    rootClassName: root.className || DEFAULT_ROOT_CLASSES,
    navbar: root.querySelector('header')?.outerHTML || '',
    footer: root.querySelector('footer')?.outerHTML || '',
  }
}

function extractMainMarkup(markup) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${markup}</body>`, 'text/html')
  const body = doc.body
  const root = body.querySelector('.dialog-off-canvas-main-canvas')
  const mainElement = root?.querySelector('main') || body.querySelector('main')

  if (mainElement) {
    return mainElement.outerHTML
  }

  return markup
}

function toPageData(sourceHtml, htmlPath) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(sourceHtml, 'text/html')
  const bodyHtml = doc.body?.innerHTML || ''
  const migrated = migrateBodyMarkup(bodyHtml, htmlPath)

  return {
    htmlClassName: doc.documentElement?.className || DEFAULT_CLASSES,
    bodyClassName: doc.body?.className || DEFAULT_CLASSES,
    title: adaptCopyForEvplugMorocco(doc.title || 'EVplug Maroc'),
    mainMarkup: extractMainMarkup(migrated.html),
    inlineScripts: migrated.inlineScripts,
  }
}

export default function MirrorPage() {
  useInternalRouteNavigation()

  const location = useLocation()
  const [pageData, setPageData] = useState(null)
  const shellBlocks = useMemo(() => {
    const migratedShell = migrateBodyMarkup(homeBodyRaw, 'index.html')
    return extractShellBlocks(migratedShell.html)
  }, [])

  const htmlPath = useMemo(() => routePathToHtmlPath(location.pathname), [location.pathname])

  useEffect(() => {
    let cancelled = false

    async function loadPage() {
      const response = await fetch(`/assets/podenergy.com/${htmlPath}`)
      if (!response.ok) {
        throw new Error(`Failed to load /assets/podenergy.com/${htmlPath}`)
      }

      const html = await response.text()
      if (!cancelled) {
        setPageData(toPageData(html, htmlPath))
      }
    }

    loadPage().catch(() => {
      if (!cancelled) {
        setPageData({
          htmlClassName: DEFAULT_CLASSES,
          bodyClassName: DEFAULT_CLASSES,
          title: 'Page non disponible',
          mainMarkup:
            '<main style="padding: 2rem;"><h1>Page non disponible</h1><p>Cette page n\'est pas presente dans la capture locale.</p></main>',
          inlineScripts: [],
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [htmlPath])

  useLayoutEffect(() => {
    if (!pageData) {
      return undefined
    }

    const htmlElement = document.documentElement
    const bodyElement = document.body
    const previousHtmlClassName = htmlElement.className
    const previousBodyClassName = bodyElement.className
    const previousTitle = document.title

    htmlElement.className = pageData.htmlClassName
    bodyElement.className = pageData.bodyClassName
    document.title = pageData.title

    return () => {
      htmlElement.className = previousHtmlClassName
      bodyElement.className = previousBodyClassName
      document.title = previousTitle
    }
  }, [pageData])

  useEffect(() => {
    if (!pageData || !pageData.inlineScripts.length) {
      return undefined
    }

    return executeInlineScripts(pageData.inlineScripts, htmlPath)
  }, [pageData, htmlPath])

  return (
    <>
      <HtmlBlock html={shellBlocks.preRoot} />
      <div className={shellBlocks.rootClassName} data-off-canvas-main-canvas>
        <Navbar html={shellBlocks.navbar} />
        <HtmlBlock html={pageData?.mainMarkup || ''} />
        <Footer html={shellBlocks.footer} />
      </div>
    </>
  )
}
