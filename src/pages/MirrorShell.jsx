import { useLayoutEffect } from 'react'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import Newsletter from '../components/layout/Newsletter'
import { adaptCopyForEvplugMorocco } from '../lib/mirrorMarkup'
import useInternalRouteNavigation from '../lib/useInternalRouteNavigation'

const DEFAULT_PAGE_CLASSES = 'path-node page-node-type-page d-flex flex-column'

export default function MirrorShell({ children, pageClasses = DEFAULT_PAGE_CLASSES, documentTitle }) {
  useInternalRouteNavigation()

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

  return (
    <div className="dialog-off-canvas-main-canvas d-flex flex-column h-100" data-off-canvas-main-canvas>
      <Navbar />
      <main role="main" className="flex-grow">
        {children}
      </main>
      <Newsletter />
      <Footer />
    </div>
  )
}
