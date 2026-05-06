import { useLayoutEffect, useMemo } from 'react'
import HtmlBlock from '../../components/common/HtmlBlock'
import Footer from '../../components/home/Footer'
import Navbar from '../../components/home/Navbar'
import homeBodyRaw from '../../migrated/home-body.html?raw'
import { adaptCopyForEvplugMorocco, migrateBodyMarkup } from '../../lib/mirrorMarkup'
import { splitShellBlocks } from '../../lib/mirrorSplit'
import useInternalRouteNavigation from '../../lib/useInternalRouteNavigation'
import useNavbarInteractions from '../../lib/useNavbarInteractions'
import usePageInteractions from '../../lib/usePageInteractions'

function toClassList(value) {
  return value.filter(Boolean).join(' ')
}

export default function EditorialLayout({ pageKey, title, bodyClassNames = [], children }) {
  useInternalRouteNavigation()

  const shell = useMemo(() => {
    const migratedShell = migrateBodyMarkup(homeBodyRaw, 'index.html')
    return splitShellBlocks(migratedShell.html)
  }, [])

  useLayoutEffect(() => {
    const body = document.body
    const previousTitle = document.title
    const bodyClasses = ['editorial-page', ...bodyClassNames]

    body.classList.add(...bodyClasses)
    if (title) {
      document.title = adaptCopyForEvplugMorocco(title)
    }

    return () => {
      body.classList.remove(...bodyClasses)
      document.title = previousTitle
    }
  }, [bodyClassNames, title])

  usePageInteractions(pageKey)
  useNavbarInteractions(pageKey)

  return (
    <>
      <HtmlBlock html={shell.preRoot} />
      <div className={toClassList([shell.rootClassName, 'editorial-shell', 'dialog-off-canvas-main-canvas'])} data-off-canvas-main-canvas>
        <Navbar html={shell.navbar} />
        <main className="editorial-main flex-grow">{children}</main>
        <Footer html={shell.footer} />
      </div>
    </>
  )
}
