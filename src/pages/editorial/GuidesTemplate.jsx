import { useEffect, useMemo, useState } from 'react'
import EditorialLayout from './EditorialLayout'
import FiltersBar from '../../components/editorial/FiltersBar'
import ArticleGrid from '../../components/editorial/ArticleGrid'
import { fetchGuides, fetchGuideCategories } from '../../lib/api/editorialApi'
import { adaptCopyForEvplugMorocco } from '../../lib/mirrorMarkup'

function Hero() {
  return (
    <div className="block block-layout-builder block-inline-blockh3-reduced-hero">
      <div className="reduced-hero container mx-auto px-4 text-center">
        <h1 className="h3">Knowledge is power.</h1>
        <div className="clearfix text-formatted field field--name-field-description field--type-text-with-summary field--label-hidden field__item max-w-3xl mx-auto">
          <p>Everything you need to know about EV charging, in one place.</p>
        </div>
      </div>
    </div>
  )
}

export default function GuidesTemplate() {
  const [featured, setFeatured] = useState([])
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ search: '', category: '' })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    const controller = new AbortController()

    Promise.all([
      fetchGuides({ page: 1, pageSize: 6, featured: true, search: filters.search, category: filters.category }, { signal: controller.signal }),
      fetchGuides({ page: 1, pageSize: 12, featured: false, search: filters.search, category: filters.category }, { signal: controller.signal }),
      fetchGuideCategories({ signal: controller.signal }).catch(() => []),
    ])
      .then(([feat, all, cats]) => {
        if (cancelled) return
        setFeatured(feat.items || [])
        setItems(all.items || [])
        setCategories(Array.isArray(cats) ? cats : (cats.items || []))
      })
      .catch((e) => {
        if (cancelled) return
        // Log internally but do not show noisy parse errors in UI
        console.warn('[GuidesTemplate] load error:', e)
        setError(e.message || 'Failed to load guides')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [filters])

  return (
    <EditorialLayout pageKey="guides" title={adaptCopyForEvplugMorocco('Guides | EVplug')} bodyClassNames={["path-node", "page-node-type-page", "d-flex", "flex-column"]}>
      <main role="main" className="flex-grow">
        <div id="block-podpoint-content" className="block block-system block-system-main-block">
          <article className="node node--type-page node--view-mode-full">
            <Hero />

            {/* Unified filters controlling both sections */}
            <div className="container mx-auto px-4 my-6">
              <FiltersBar
                categories={categories}
                onChange={setFilters}
                placeholder="Search guides…"
              />
            </div>

            <div className="views-element-container block block-views block-views-blockarticle-grid-feature-guide" id="block-podpoint-views-block-article-grid-feature-guide">
              <div data-block="content">
                <div className="view view-article-grid view-id-article_grid view-display-id-feature_guide">
                  {/* Keep UI quiet if API not ready */}
                  {loading ? (
                    <p>Loading…</p>
                  ) : (
                    <ArticleGrid items={featured} variant="feature" emptyText="No featured guides yet." />
                  )}
                </div>
              </div>
            </div>

            <div className="views-element-container block block-views block-views-blockarticle-grid-all-guide" id="block-podpoint-views-block-article-grid-all-guide">
              <div data-block="content">
                <div className="view view-article-grid view-id-article_grid view-display-id-all_guide">
                  {/* Keep UI quiet if API not ready */}
                  {loading ? (
                    <p>Loading…</p>
                  ) : (
                    <ArticleGrid items={items} variant="grid" emptyText="No guides match your filters." />
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </EditorialLayout>
  )
}
