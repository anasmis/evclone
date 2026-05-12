import { Link } from 'react-router-dom'
import MirrorShell from './MirrorShell'
import Breadcrumb from '../components/sections/Breadcrumb'
import heroIcon from '../migrated/assets/news/hero.svg'
import { newsArticles } from '../data/editorial'

function ArticleCard({ a }) {
  return (
    <div className="news-article">
      <Link to={`/news/${a.slug}`}>
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
            <div className="font-base m-0 line-clamp-2">
              <p>{a.description}</p>
            </div>
            <div className="font-sm text-abbey font-medium">
              {a.date}, {a.readTime} min read
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function NewsListing() {
  return (
    <MirrorShell documentTitle="Actualites | EVplug">
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Actualites" />

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
                        Actualites
                      </h1>
                      <h4 className="m-0" style={{ color: '#000000' }}>
                        Decouvrez les dernieres actualites d'EVplug
                      </h4>
                    </div>
                  </div>

                  <div
                    className="hidden md:!grid rounded-2xl md:py-spacing-4xl md:px-spacing-6xl p-spacing-2xl items-center justify-center"
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
                <div className="view-header">
                  <div className="heading-block py-spacing-xl grid gap-spacing-sm" />
                </div>

                <div className="view-content">
                  <div className="grid xl:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-spacing-4xl">
                    {newsArticles.map((a) => (
                      <ArticleCard key={a.slug} a={a} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </MirrorShell>
  )
}
