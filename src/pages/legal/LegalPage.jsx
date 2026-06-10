import MirrorShell from '../MirrorShell'
import Breadcrumb from '../../components/sections/Breadcrumb'

// Shared shell for the footer legal/info pages: breadcrumb + cream card with a
// title, optional intro, and a stack of <LegalSection> children.
export default function LegalPage({ documentTitle, breadcrumb, title, intro, children }) {
  return (
    <MirrorShell documentTitle={documentTitle}>
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current={breadcrumb} />

            <section className="legal-page">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-4xl pb-spacing-7xl">
                <div
                  className="rounded-2xl md:p-spacing-6xl py-spacing-6xl px-spacing-4xl"
                  style={{ backgroundColor: '#F5F1EB', maxWidth: '900px' }}
                >
                  <header className="grid gap-spacing-2xl mb-spacing-4xl">
                    <h1 className="font-TTCommons m-0" style={{ color: '#000000' }}>
                      {title}
                    </h1>
                    {intro}
                  </header>

                  <div className="legal-page__sections grid gap-spacing-4xl">{children}</div>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}

export function LegalSection({ title, children }) {
  return (
    <section className="grid gap-spacing-md">
      <h2 className="font-TTCommons m-0" style={{ color: '#123d33', fontSize: '1.5rem' }}>
        {title}
      </h2>
      <div style={{ color: '#333333' }}>{children}</div>
    </section>
  )
}
