import { useLayoutEffect, useMemo } from 'react'
import HtmlBlock from '../../components/common/HtmlBlock'
import Footer from '../../components/home/Footer'
import Navbar from '../../components/home/Navbar'
import homeBodyRaw from '../../migrated/home-body.html?raw'
import { adaptCopyForEvplugMorocco, migrateBodyMarkup } from '../../lib/mirrorMarkup'
import { splitShellBlocks } from '../../lib/mirrorSplit'
import useInternalRouteNavigation from '../../lib/useInternalRouteNavigation'
import useNavbarInteractions from '../../lib/useNavbarInteractions'

const PAGE_CLASSES = 'path-node page-node-type-page d-flex flex-column'

export default function SolutionPageLayout({ children, documentTitle }) {
  useInternalRouteNavigation()

  const shell = useMemo(() => {
    const migratedShell = migrateBodyMarkup(homeBodyRaw, 'index.html')
    return splitShellBlocks(migratedShell.html)
  }, [])

  useNavbarInteractions(shell.navbar)

  useLayoutEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.className
    const prevBody = body.className
    const prevTitle = document.title

    html.className = PAGE_CLASSES
    body.className = PAGE_CLASSES
    if (documentTitle) {
      document.title = adaptCopyForEvplugMorocco(documentTitle)
    }

    return () => {
      html.className = prevHtml
      body.className = prevBody
      if (documentTitle) document.title = prevTitle
    }
  }, [documentTitle])

  return (
    <>
      <HtmlBlock html={shell.preRoot} />
      <div className={shell.rootClassName} data-off-canvas-main-canvas>
        <Navbar html={shell.navbar} />
        <main role="main" className="flex-grow">
          {children}
        </main>
        <Footer html={shell.footer} />
      </div>
    </>
  )
}
