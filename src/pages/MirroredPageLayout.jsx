import { useLayoutEffect, useMemo } from 'react'
import HtmlBlock from '../components/common/HtmlBlock'
import Footer from '../components/home/Footer'
import Navbar from '../components/home/Navbar'
import homeBodyRaw from '../migrated/home-body.html?raw'
import { adaptCopyForEvplugMorocco, migrateBodyMarkup } from '../lib/mirrorMarkup'
import { extractMainMarkup, splitShellBlocks } from '../lib/mirrorSplit'
import usePageInteractions from '../lib/usePageInteractions'
import useInternalRouteNavigation from '../lib/useInternalRouteNavigation'
import useNavbarInteractions from '../lib/useNavbarInteractions'

const DEFAULT_PAGE_CLASSES = 'path-node page-node-type-page d-flex flex-column'

export default function MirroredPageLayout({ bodyRaw, htmlPath, pageClasses = DEFAULT_PAGE_CLASSES, documentTitle }) {
  useInternalRouteNavigation()

  const shell = useMemo(() => {
    const migratedShell = migrateBodyMarkup(homeBodyRaw, 'index.html')
    return splitShellBlocks(migratedShell.html)
  }, [])

  const mainMarkup = useMemo(() => {
    const migrated = migrateBodyMarkup(bodyRaw, htmlPath)
    return extractMainMarkup(migrated.html)
  }, [bodyRaw, htmlPath])

  useLayoutEffect(() => {
    const htmlElement = document.documentElement
    const bodyElement = document.body
    const previousHtmlClassName = htmlElement.className
    const previousBodyClassName = bodyElement.className
    const previousTitle = document.title

    htmlElement.className = pageClasses
    bodyElement.className = pageClasses
    if (documentTitle) {
      document.title = adaptCopyForEvplugMorocco(documentTitle)
    }

    return () => {
      htmlElement.className = previousHtmlClassName
      bodyElement.className = previousBodyClassName
      if (documentTitle) {
        document.title = previousTitle
      }
    }
  }, [pageClasses, documentTitle])

  usePageInteractions(mainMarkup)
  useNavbarInteractions(mainMarkup)

  return (
    <>
      <HtmlBlock html={shell.preRoot} />
      <div className={shell.rootClassName} data-off-canvas-main-canvas>
        <Navbar html={shell.navbar} />
        <HtmlBlock tag="main" html={mainMarkup} role="main" className="flex-grow" />
        <Footer html={shell.footer} />
      </div>
    </>
  )
}
