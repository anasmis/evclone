import { useLayoutEffect } from 'react'
import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'
import Newsletter from '../../components/layout/Newsletter'
import FloatingCtaForm from '../../components/common/FloatingCtaForm'
import { adaptCopyForEvplugMorocco } from '../../lib/mirrorMarkup'
import useInternalRouteNavigation from '../../lib/useInternalRouteNavigation'

const PAGE_CLASSES = 'path-node page-node-type-page d-flex flex-column'

export default function SolutionPageLayout({
  children,
  documentTitle,
  ctaInterest,
  ctaButtonLabel,
  ctaTitle,
  ctaSubtitle,
  ctaAccentColor,
  ctaSubmitFn,
}) {
  useInternalRouteNavigation()

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
    <div className="dialog-off-canvas-main-canvas d-flex flex-column h-100" data-off-canvas-main-canvas>
      <Navbar />
      <main role="main" className="flex-grow">
        {children}
      </main>
      <Newsletter />
      <Footer />
      <FloatingCtaForm
        buttonLabel={ctaButtonLabel || 'Etre rappele'}
        title={ctaTitle || 'Etudions votre projet'}
        subtitle={ctaSubtitle || 'Decrivez votre besoin, un expert EVplug vous recontacte sous 24h ouvrees.'}
        defaultInterest={ctaInterest}
        accentColor={ctaAccentColor}
        submitFn={ctaSubmitFn}
      />
    </div>
  )
}
