import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import MirrorShell from './MirrorShell'
import NotFoundPage from './NotFoundPage'
import Breadcrumb from '../components/sections/Breadcrumb'
import {
  getGuideArticle,
  getNewsArticle,
  guideArticles,
  newsArticles,
} from '../data/editorial'
import {
  fetchArticleBySlug,
  fetchGuideArticles,
  fetchNewsArticles,
} from '../lib/api/strapi'

const FAMILIES = {
  news: {
    key: 'news',
    kind: 'news',
    label: 'Actualites',
    rootRoute: '/news',
    docTitleSuffix: 'Actualites | EVplug',
    getArticle: getNewsArticle,
    fetchList: fetchNewsArticles,
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
                        className="rounded-lg w-full object-cover h-[284px]"
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

  // Seed from bundled editorial data for an instant first paint, then refresh
  // from Strapi. `status` distinguishes "still loading" from "definitely 404".
  const [article, setArticle] = useState(() => family?.getArticle(slug) ?? null)
  const [status, setStatus] = useState('loading')
  const [related, setRelated] = useState(() => family?.fallbackList ?? [])

  useEffect(() => {
    if (!family) {
      setStatus('notfound')
      return undefined
    }

    let cancelled = false
    const fallback = family.getArticle(slug)
    setArticle(fallback ?? null)
    setStatus('loading')

    fetchArticleBySlug(family.kind, slug)
      .then((found) => {
        if (cancelled) return
        if (found) {
          setArticle(found)
          setStatus('ready')
        } else {
          setStatus(fallback ? 'ready' : 'notfound')
        }
      })
      .catch(() => {
        if (cancelled) return
        setStatus(fallback ? 'ready' : 'notfound')
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
  if (!article) {
    if (status === 'notfound') return <NotFoundPage />
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

  return (
    <MirrorShell documentTitle={`${article.title} | ${family.docTitleSuffix}`}>
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb
              current={article.title}
              trail={[{ to: family.rootRoute, label: family.label }]}
            />

            {/* Hero: title on the left, cover image on the right */}
            <section className="article-hero">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto pt-spacing-4xl pb-spacing-4xl">
                <div className="grid md:grid-cols-2 gap-spacing-4xl items-center">
                  <div className="grid gap-spacing-xl auto-rows-max">
                    {article.categories && article.categories.length > 0 && (
                      <div>
                        {article.categories.map((c) => (
                          <span key={c} className="py-spacing-sm px-spacing-md tag mr-2 mb-1">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                    <h1 className="font-TTCommons mb-0">{article.title}</h1>
                    <p className="font-lg m-0">{article.description}</p>
                    <div className="font-sm text-abbey font-medium">
                      {article.date} · {article.readTime} min read
                    </div>
                  </div>
                  <div>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="rounded-2xl w-full object-cover aspect-[4/3]"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="article-body">
              <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto py-spacing-6xl">
                <div className="max-w-3xl mx-auto">
                  {article.body.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
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
