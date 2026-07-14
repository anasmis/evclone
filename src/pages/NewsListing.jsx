import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MirrorShell from './MirrorShell'
import Seo from '../components/seo/Seo'
import Breadcrumb from '../components/sections/Breadcrumb'
import heroIcon from '../migrated/assets/news/hero.svg'
import { newsArticles } from '../data/editorial'
import { fetchEditorialArticles } from '../lib/api/strapi'

const PAGE_SIZE = 6

function parseArticleTimestamp(article) {
  const value = article?.publishedDate || article?.date || article?.publishedAt || ''
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

function sortLatestFirst(items) {
  return [...items].sort((a, b) => {
    const delta = parseArticleTimestamp(b) - parseArticleTimestamp(a)
    if (delta !== 0) return delta
    return String(b.id ?? b.slug ?? '').localeCompare(String(a.id ?? a.slug ?? ''))
  })
}

function ArticleCard({ a }) {
  const description = a.description || a.excerpt || ''
  const date = a.date || a.publishedDate || ''
  return (
    <div className="news-article">
      <Link to={`/news/${a.slug}`}>
        <div className="article-block grid grid-flow-row auto-rows-max gap-spacing-xl">
          <div className="article">
            <img
              className="rounded-lg w-full object-cover h-71"
              src={a.image}
              alt={a.title}
              loading="lazy"
            />
          </div>
          <div className="article-content grid gap-spacing-xl">
            <h6 className="font-2xl m-0">{a.title}</h6>
            <div className="font-base m-0 line-clamp-2">
              <p>{description}</p>
            </div>
            <div className="font-sm text-abbey font-medium">
              {date}, {a.readTime} min read
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

function ArticleCardSkeleton() {
  return (
    <div className="news-article animate-pulse">
      <div className="article-block grid grid-flow-row auto-rows-max gap-spacing-xl">
        <div className="article">
          <div className="rounded-lg w-full h-71 bg-[#dce2df]" />
        </div>
        <div className="article-content grid gap-spacing-xl">
          <div className="h-8 rounded-full bg-[#dce2df] w-5/6" />
          <div className="grid gap-3">
            <div className="h-4 rounded-full bg-[#dce2df] w-full" />
            <div className="h-4 rounded-full bg-[#dce2df] w-11/12" />
          </div>
          <div className="h-4 rounded-full bg-[#dce2df] w-1/2" />
        </div>
      </div>
    </div>
  )
}

function PaginationButton({ children, active, disabled, onClick, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex min-w-11 items-center justify-center rounded-full px-4 py-2 font-semibold transition-colors ${
        active
          ? 'bg-[#163E4C] text-white'
          : 'bg-white text-[#163E4C] border border-[#163E4C]/10 hover:bg-[#eef3f1]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

export default function NewsListing() {
  const [articles, setArticles] = useState(newsArticles)
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    let cancelled = false
    fetchEditorialArticles()
      .then((rows) => {
        if (!cancelled && Array.isArray(rows) && rows.length) setArticles(rows)
      })
      .catch(() => {
        // Strapi unreachable / empty — keep the bundled fallback articles.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const normalizedArticles = useMemo(() => sortLatestFirst(articles), [articles])

  const filteredArticles = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase()
    if (!search) return normalizedArticles

    return normalizedArticles.filter((article) => {
      const haystack = [
        article.title,
        article.description,
        article.excerpt,
        article.tag,
        article.category?.name,
        article.publishedDate,
        article.date,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(search)
    })
  }, [deferredQuery, normalizedArticles])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const visibleArticles = filteredArticles.slice(pageStart, pageStart + PAGE_SIZE)

  const loadingCards = isLoading ? Array.from({ length: 6 }, (_, index) => index) : []

  return (
    <MirrorShell documentTitle="Actualités | EVplug">
      <Seo
        title="Actualités | EVplug"
        description="Découvrez les dernières actualités d'EVplug : mobilité électrique, recharge et infrastructure au Maroc."
        path="/news"
      />
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Actualités" />

            {/* Hero */}
            <section className="two-card-layout">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto md:py-spacing-7xl pt-spacing-7xl pb-spacing-4xl">
                <div className="grid xl:grid-flow-col gap-spacing-3xl items-stretch xl:grid-cols-3">
                  <div
                    className="m-0 xl:col-span-2 rounded-2xl md:p-spacing-6xl py-spacing-6xl px-spacing-4xl grid gap-spacing-4xl items-center"
                    style={{ backgroundColor: '#F5F1EB' }}
                  >
                    <div className="grid gap-spacing-xl auto-rows-max">
                      <h1 className="font-TTCommons mb-0" style={{ color: '#000000' }}>
                        Actualités
                      </h1>
                      <h4 className="m-0" style={{ color: '#000000' }}>
                        Découvrez les dernières actualités d&rsquo;EVplug
                      </h4>
                    </div>
                  </div>

                  <div
                    className="hidden md:grid! rounded-2xl md:py-spacing-4xl md:px-spacing-6xl p-spacing-2xl items-center justify-center"
                    style={{ backgroundColor: '#163E4C' }}
                  >
                    <img src={heroIcon} alt="car" className="max-w-full h-auto object-contain" />
                  </div>
                </div>
              </div>
            </section>

            {/* All news */}
            <section className="all-guides relative">
              <div className="container-max-width-desktop container-max-width-tablet mx-auto sm:pt-spacing-4xl pb-spacing-4xl container-padding-desktop container-padding-tablet container-padding-mobile">
                <div className="view-header grid gap-spacing-4xl">
                  <div className="heading-block py-spacing-xl grid gap-spacing-sm" />
                  <div className="editorial-surface rounded-2xl p-spacing-4xl grid gap-spacing-4xl">
                    <div className="grid gap-spacing-md md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                      <div className="grid gap-spacing-sm">
                        <h4 className="m-0" style={{ color: '#163E4C' }}>
                          Parcourir les articles
                        </h4>
                        <p className="m-0 text-[#4d6b73]">
                          Recherchez un sujet, puis naviguez dans les dernières publications.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="sr-only" htmlFor="article-search">
                          Rechercher un article
                        </label>
                        <input
                          id="article-search"
                          type="search"
                          value={query}
                          onChange={(event) => {
                            setQuery(event.target.value)
                            setCurrentPage(1)
                          }}
                          placeholder="Rechercher un article..."
                          className="w-full md:w-80 rounded-full border border-blue-dianne/12 bg-white px-4 py-3 text-blue-dianne outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(200,215,45,0.18)]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#5b767d]">
                      <span>
                        {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'} trouvé
                        {filteredArticles.length === 1 ? '' : 's'}
                      </span>
                      <span>
                        Page {safePage} / {totalPages}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="view-content">
                  <div className="grid xl:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-spacing-4xl">
                    {isLoading
                      ? loadingCards.map((index) => <ArticleCardSkeleton key={index} />)
                      : visibleArticles.map((a) => <ArticleCard key={a.slug} a={a} />)}
                  </div>

                  {!isLoading && filteredArticles.length === 0 && (
                    <div className="editorial-surface rounded-2xl p-spacing-4xl mt-spacing-4xl text-center text-[#4d6b73]">
                      Aucun article ne correspond à votre recherche.
                    </div>
                  )}

                  {!isLoading && totalPages > 1 && (
                    <div className="mt-spacing-4xl flex flex-col gap-spacing-xl items-center justify-center">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <PaginationButton
                          disabled={safePage === 1}
                          onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
                          ariaLabel="Page précédente"
                        >
                          Précédent
                        </PaginationButton>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                          <PaginationButton
                            key={page}
                            active={page === safePage}
                            onClick={() => setCurrentPage(page)}
                            ariaLabel={`Aller à la page ${page}`}
                          >
                            {page}
                          </PaginationButton>
                        ))}

                        <PaginationButton
                          disabled={safePage === totalPages}
                          onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
                          ariaLabel="Page suivante"
                        >
                          Suivant
                        </PaginationButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}
