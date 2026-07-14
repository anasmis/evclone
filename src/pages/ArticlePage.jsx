import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { marked } from 'marked'
import MirrorShell from './MirrorShell'
import NotFoundPage from './NotFoundPage'
import Seo, { absoluteUrl } from '../components/seo/Seo'
import Breadcrumb from '../components/sections/Breadcrumb'
import {
  getGuideArticle,
  getNewsArticle,
  guideArticles,
  newsArticles,
} from '../data/editorial'
import {
  fetchArticleBySlug,
  fetchEditorialArticles,
  fetchEditorialArticleBySlug,
  fetchGuideArticles,
} from '../lib/api/strapi'

marked.setOptions({ gfm: true, breaks: false })

const FAMILIES = {
  news: {
    key: 'news',
    kind: 'news',
    label: 'Actualites',
    rootRoute: '/news',
    docTitleSuffix: 'Actualites | EVplug',
    getArticle: getNewsArticle,
    fetchList: fetchEditorialArticles,
    fetchArticle: fetchEditorialArticleBySlug,
    fallbackList: newsArticles,
  },
  guides: {
    key: 'guides',
    kind: 'guide',
    label: 'Guides',
    rootRoute: '/guides',
    docTitleSuffix: 'Guides | EVplug',
    getArticle: getGuideArticle,
    fetchList: fetchGuideArticles,
    fallbackList: guideArticles,
  },
}

function Block({ block }) {
  switch (block.type) {
    case 'heading': {
      const Tag = block.level === 3 ? 'h3' : 'h2'
      return <Tag className="font-TTCommons mt-spacing-4xl mb-spacing-xl">{block.text}</Tag>
    }
    case 'image':
      return (
        <figure className="my-spacing-4xl">
          <img src={block.src} alt={block.alt || ''} className="rounded-lg w-full object-cover" loading="lazy" />
          {block.caption && (
            <figcaption className="font-sm text-abbey mt-spacing-sm text-center">{block.caption}</figcaption>
          )}
        </figure>
      )
    case 'quote':
      return (
        <blockquote className="border-l-4 pl-spacing-xl my-spacing-4xl italic">
          <p>{block.text}</p>
          {block.author && <footer className="font-sm text-abbey mt-spacing-sm">— {block.author}</footer>}
        </blockquote>
      )
    case 'list': {
      const Tag = block.style === 'number' ? 'ol' : 'ul'
      return (
        <Tag className={`my-spacing-xl ${block.style === 'number' ? 'list-decimal' : 'list-disc'} pl-spacing-3xl`}>
          {block.items.map((it, i) => (
            <li key={i} className="mb-spacing-sm">
              {it}
            </li>
          ))}
        </Tag>
      )
    }
    case 'paragraph':
    default:
      return <p className="font-base mb-spacing-xl">{block.text}</p>
  }
}

function renderArticleMarkup(content) {
  if (!content) return ''
  return marked.parse(content)
}

function RelatedArticles({ family, articles, currentSlug }) {
  const related = articles.filter((a) => a.slug !== currentSlug).slice(0, 3)
  if (related.length === 0) return null

  return (
    <section className="all-guides relative">
      <div className="container-max-width-desktop container-max-width-tablet mx-auto sm:pt-spacing-4xl pb-spacing-7xl container-padding-desktop container-padding-tablet container-padding-mobile">
        <div className="view-header">
          <div className="heading-block py-spacing-xl grid gap-spacing-sm">
            <h4>{family.key === 'news' ? 'Autres actualites' : 'Autres guides'}</h4>
          </div>
        </div>
        <div className="view-content">
          <div className="grid xl:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-spacing-4xl pt-spacing-xl">
            {related.map((a) => (
              <div key={a.slug}>
                <Link to={`${family.rootRoute}/${a.slug}`}>
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
                      <div className="font-sm text-abbey font-medium">
                        {a.date}, {a.readTime} min read
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ArticlePage({ familyKey }) {
  const family = FAMILIES[familyKey]
  const { slug } = useParams()

  // Bundled editorial data gives an instant first paint; Strapi then refreshes
  // it. `remote` is tagged with the slug it was fetched for, so a slug change
  // immediately stops showing the previous article without a sync setState.
  const fallback = family ? family.getArticle(slug) : null
  const [remote, setRemote] = useState({ slug: null, article: null, resolved: false })
  const [related, setRelated] = useState(() => family?.fallbackList ?? [])

  useEffect(() => {
    if (!family) return undefined
    let cancelled = false

    const fetchSingle = family.fetchArticle ?? ((value) => fetchArticleBySlug(family.kind, value))

    fetchSingle(slug)
      .then((found) => {
        if (!cancelled) setRemote({ slug, article: found ?? null, resolved: true })
      })
      .catch(() => {
        if (!cancelled) setRemote({ slug, article: null, resolved: true })
      })

    family
      .fetchList()
      .then((rows) => {
        if (!cancelled && Array.isArray(rows) && rows.length) setRelated(rows)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [family, slug])

  if (!family) return <NotFoundPage />

  const resolved = remote.slug === slug ? remote : null
  const article = resolved?.article ?? fallback

  if (!article) {
    // No bundled fallback and the fetch hasn't resolved for this slug yet.
    if (!resolved) {
      return (
        <MirrorShell documentTitle="Chargement… | EVplug">
          <div className="region region-content">
            <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile py-spacing-9xl text-center opacity-70">
              Chargement de l&rsquo;article…
            </div>
          </div>
        </MirrorShell>
      )
    }
    return <NotFoundPage />
  }

  const articlePath = `${family.rootRoute}/${article.slug}`
  const articleDescription = article.description || article.excerpt || ''
  const articleImage = absoluteUrl(article.image)
  const authorName =
    (typeof article.author === 'string' && article.author) ||
    article.author?.name ||
    'EVplug'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': family.key === 'news' ? 'NewsArticle' : 'Article',
    headline: article.title,
    description: articleDescription,
    ...(articleImage ? { image: [articleImage] } : {}),
    ...(article.date || article.publishedDate
      ? { datePublished: article.date || article.publishedDate }
      : {}),
    author: { '@type': authorName === 'EVplug' ? 'Organization' : 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: 'EVplug' },
    ...(absoluteUrl(articlePath) ? { mainEntityOfPage: absoluteUrl(articlePath) } : {}),
  }

  return (
    <MirrorShell documentTitle={`${article.title} | ${family.docTitleSuffix}`}>
      <Seo
        title={`${article.title} | ${family.docTitleSuffix}`}
        description={articleDescription}
        path={articlePath}
        image={article.image}
        type="article"
        jsonLd={jsonLd}
      />
      <div className="region region-content editorial-page">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb
              current={article.title}
              trail={[{ to: family.rootRoute, label: family.label }]}
            />

            {/* Hero: title on the left, cover image on the right */}
            <section className="article-hero">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-4xl pb-spacing-4xl">
                <div className="editorial-surface rounded-3xl overflow-hidden">
                  <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] gap-spacing-0 items-stretch">
                    <div className="grid gap-spacing-xl auto-rows-max p-spacing-4xl md:p-spacing-5xl lg:p-spacing-6xl min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {article.categories && article.categories.length > 0 &&
                          article.categories.map((c) => (
                            <span key={c} className="py-spacing-sm px-spacing-md tag">
                              {c}
                            </span>
                          ))}
                      </div>
                      <h1 className="font-TTCommons mb-0" style={{ maxWidth: '18ch', lineHeight: 1.02 }}>
                        {article.title}
                      </h1>
                      <p className="font-lg m-0" style={{ maxWidth: '62ch' }}>
                        {article.description || article.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-spacing-md text-abbey font-medium">
                        <span>{article.date || article.publishedDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.readTime} min read</span>
                        {article.language && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="uppercase tracking-[0.12em]">{article.language}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="min-h-full bg-blue-dianne p-spacing-md md:p-spacing-xl lg:p-spacing-4xl flex items-center justify-center">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="rounded-2xl w-full object-cover aspect-4/5 max-h-130"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="article-body">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto py-spacing-6xl">
                <div className="editorial-surface rounded-3xl p-spacing-4xl md:p-spacing-5xl lg:p-spacing-6xl w-full">
                  <div className="editorial-prose w-full">
                    {Array.isArray(article.body) && article.body.length > 0 ? (
                      article.body.map((block, i) => <Block key={i} block={block} />)
                    ) : article.content ? (
                      <div dangerouslySetInnerHTML={{ __html: renderArticleMarkup(article.content) }} />
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <RelatedArticles family={family} articles={related} currentSlug={article.slug} />
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}
