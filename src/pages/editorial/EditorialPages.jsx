import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import HtmlBlock from '../../components/common/HtmlBlock'
import { normalizeRoutePath } from '../../lib/normalizeRoutePath'
import { splitShellBlocks, extractMainMarkup } from '../../lib/mirrorSplit'
import homeBodyRaw from '../../migrated/home-body.html?raw'
import Footer from '../../components/home/Footer'
import Navbar from '../../components/home/Navbar'
import { adaptCopyForEvplugMorocco, executeInlineScripts, migrateBodyMarkup } from '../../lib/mirrorMarkup'
import { getEditorialEntryByPath, getEditorialFamilyKey, loadEditorialDocument } from './articleData'

const DEFAULT_PAGE_CLASSES = 'path-node page-node-type-page d-flex flex-column'

function LoadingState() {
  return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Chargement…</div>
}

function useEditorialShell() {
  return useMemo(() => {
    const migratedShell = migrateBodyMarkup(homeBodyRaw, 'index.html')
    return splitShellBlocks(migratedShell.html)
  }, [])
}

function EditorialDocumentPage({ familyKey }) {
  const location = useLocation()
  const normalizedPath = normalizeRoutePath(location.pathname)
  const entry = useMemo(() => getEditorialEntryByPath(normalizedPath, familyKey), [familyKey, normalizedPath])
  const shell = useEditorialShell()
  const [pageData, setPageData] = useState(null)

  if (normalizedPath !== location.pathname) {
    return <Navigate replace to={`${normalizedPath}${location.search}${location.hash}`} />
  }

  useEffect(() => {
    let cancelled = false

    if (!entry) {
      setPageData(null)
      return undefined
    }

    const controller = new AbortController()

    loadEditorialDocument(entry, controller.signal)
      .then((documentData) => {
        if (!cancelled) {
          setPageData(documentData)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPageData(null)
        }
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [entry])

  useLayoutEffect(() => {
    if (!pageData) {
      return undefined
    }

    const htmlElement = document.documentElement
    const bodyElement = document.body
    const previousHtmlClassName = htmlElement.className
    const previousBodyClassName = bodyElement.className
    const previousTitle = document.title

    htmlElement.className = pageData.htmlClassName || DEFAULT_PAGE_CLASSES
    bodyElement.className = pageData.bodyClassName || DEFAULT_PAGE_CLASSES
    document.title = adaptCopyForEvplugMorocco(pageData.title || entry?.title || 'EVplug')

    return () => {
      htmlElement.className = previousHtmlClassName
      bodyElement.className = previousBodyClassName
      document.title = previousTitle
    }
  }, [entry, pageData])

  useEffect(() => {
    if (!pageData || !pageData.inlineScripts?.length) {
      return undefined
    }

    return executeInlineScripts(pageData.inlineScripts, entry.htmlPath)
  }, [entry?.htmlPath, pageData])

  if (!entry) {
    return <Navigate replace to={`/${getEditorialFamilyKey(normalizedPath)}`} />
  }

  if (!pageData) {
    return <LoadingState />
  }

  return (
    <>
      <HtmlBlock html={shell.preRoot} />
      <div className={shell.rootClassName} data-off-canvas-main-canvas>
        <Navbar html={shell.navbar} />
        <HtmlBlock tag="main" html={pageData.mainMarkup || extractMainMarkup(pageData.bodyMarkup)} role="main" className="grow" />
        <Footer html={shell.footer} />
      </div>
    </>
  )
}

export function GuidesIndexPage() {
  return <EditorialDocumentPage familyKey="guides" />
}

export function NewsIndexPage() {
  return <EditorialDocumentPage familyKey="news" />
}

export function GuidesArticlePage() {
  return <EditorialDocumentPage familyKey="guides" />
}

export function NewsArticlePage() {
  return <EditorialDocumentPage familyKey="news" />
}
