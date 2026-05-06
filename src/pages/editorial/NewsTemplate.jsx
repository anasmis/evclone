import { useEffect, useMemo, useState } from 'react'
import EditorialLayout from './EditorialLayout'
import FiltersBar from '../../components/editorial/FiltersBar'
import ArticleGrid from '../../components/editorial/ArticleGrid'
import { fetchNews, fetchNewsCategories } from '../../lib/api/editorialApi'
import { adaptCopyForEvplugMorocco } from '../../lib/mirrorMarkup'

function Hero() {
  return (
    <div className="block block-layout-builder block-inline-blockh3-reduced-hero">
      <div className="reduced-hero container mx-auto px-4 text-center">
        <h1 className="h3">Actualites</h1>
        <div className="clearfix text-formatted field field--name-field-description field--type-text-with-summary field--label-hidden field__item max-w-3xl mx-auto">
          <p>Le guide pratique de la recharge electrique au Maroc.</p>
        </div>
      </div>
    </div>
  )
}

export default function NewsTemplate() {
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
      fetchNews({ page: 1, pageSize: 6, featured: true, search: filters.search, category: filters.category }, { signal: controller.signal }),
      fetchNews({ page: 1, pageSize: 12, featured: false, search: filters.search, category: filters.category }, { signal: controller.signal }),
      fetchNewsCategories({ signal: controller.signal }).catch(() => []),
    ])
      .then(([feat, all, cats]) => {
        if (cancelled) return
        setFeatured(feat.items || [])
        setItems(all.items || [])
        setCategories(Array.isArray(cats) ? cats : (cats.items || []))
      })
      .catch((e) => {
        if (cancelled) return
        console.warn('[NewsTemplate] load error:', e)
        setError(e.message || 'Failed to load news')
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
    <EditorialLayout pageKey="news" title={adaptCopyForEvplugMorocco('Actualites | EVplug')} bodyClassNames={["path-node", "page-node-type-page", "d-flex", "flex-column"]}>
      <main role="main" className="flex-grow">
        <div id="block-podpoint-content" className="block block-system block-system-main-block">
          <article className="node node--type-page node--promoted node--view-mode-full">
            <Hero />

            {/* Unified filters controlling both sections */}
            <div className="container mx-auto px-4 my-6">
              <FiltersBar
                categories={categories}
                onChange={setFilters}
                placeholder="Rechercher dans les actualites…"
              />
            </div>

            <div className="views-element-container block block-views block-views-blocknews-article-featured-news" id="block-podpoint-views-block-news-article-featured-news">
              <div data-block="content">
                <div className="view view-news-article view-id-news_article view-display-id-featured_news">
                  {/* Quiet error UI */}
                  {loading ? (
                    <p>Loading…</p>
                  ) : (
                    <ArticleGrid items={featured} variant="feature" emptyText="Aucune actualite en vedette." />
                  )}
                </div>
              </div>
            </div>

            <div className="views-element-container block block-views block-views-blocknews-article-all-news" id="block-podpoint-views-block-news-article-all-news">
              <div data-block="content">
                <div className="view view-news-article view-id-news_article view-display-id-all_news">
                  {/* Quiet error UI */}
                  {loading ? (
                    <p>Loading…</p>
                  ) : (
                    <ArticleGrid items={items} variant="grid" emptyText="Aucun resultat pour vos filtres." />
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
