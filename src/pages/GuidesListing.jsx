import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MirrorShell from './MirrorShell'
import Seo from '../components/seo/Seo'
import Breadcrumb from '../components/sections/Breadcrumb'
import heroIcon from '../migrated/assets/guides/hero.svg'
import { GUIDE_CATEGORIES, guideArticles } from '../data/editorial'
import { fetchGuideArticles } from '../lib/api/strapi'

function articleHref(a) {
  return `/guides/${a.slug}`
}

function CategoryTag({ children, to }) {
  return (
    <Link to={to}>
      <span className="py-spacing-sm px-spacing-md tag mr-2 mb-1">{children}</span>
    </Link>
  )
}

function FeaturedTallCard({ a }) {
  const href = articleHref(a)
  return (
    <div className="article-block grid xl:row-span-2 gap-spacing-xl bg-chocolate-100 rounded-lg auto-rows-max grid-flow-row">
      <div className="grid md:grid-flow-col xl:grid-flow-row gap-spacing-xl px-spacing-xl py-spacing-3xl">
        <div className="article w-full md:w-[250px] xl:w-full xl:h-auto">
          <Link to={href}>
            <img
              className="rounded-lg object-cover aspect-2/1 md:aspect-square w-full md:h-full xl:h-[310px]"
              src={a.image}
              alt={a.title}
              loading="lazy"
            />
          </Link>
        </div>
        <div className="article-content grid gap-spacing-xl auto-rows-max">
          <div>
            {a.categories.map((c) => (
              <CategoryTag key={c} to={href}>
                {c}
              </CategoryTag>
            ))}
          </div>
          <h6 className="m-0">
            <Link to={href}>{a.title}</Link>
          </h6>
          <div className="font-base m-0 line-clamp-2 article-des">
            <p>{a.description}</p>
            <div className="font-sm text-abbey font-medium">
              {a.date}, {a.readTime} min read
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturedShortCard({ a }) {
  const href = articleHref(a)
  return (
    <div className="article-block grid xl:col-span-1 gap-spacing-xl bg-chocolate-100 rounded-lg auto-rows-max grid-flow-row">
      <div className="grid md:grid-flow-col gap-spacing-xl px-spacing-xl py-spacing-3xl">
        <div className="article w-full md:w-[250px] xl:w-[215px]">
          <Link to={href}>
            <img
              className="rounded-lg w-full object-cover aspect-3/2 md:aspect-square"
              src={a.image}
              alt={a.title}
              loading="lazy"
            />
          </Link>
        </div>
        <div className="article-content grid gap-spacing-xl auto-rows-max">
          <div className="grid-flow-col">
            {a.categories.map((c) => (
              <CategoryTag key={c} to={href}>
                {c}
              </CategoryTag>
            ))}
          </div>
          <h6 className="m-0">
            <Link to={href}>{a.title}</Link>
          </h6>
          <div className="font-base m-0 line-clamp-2 article-des">
            <p>{a.description}</p>
          </div>
          <div className="font-sm text-abbey font-medium">
            {a.date}, {a.readTime} min read
          </div>
        </div>
      </div>
    </div>
  )
}

function GridCard({ a }) {
  return (
    <div>
      <Link to={articleHref(a)}>
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
            <div>
              {a.categories.map((c) => (
                <span key={c} className="py-spacing-sm px-spacing-md tag mr-1 mb-1">
                  {c}
                </span>
              ))}
            </div>
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

function CategoryFilter({ value, onChange, idPrefix }) {
  return (
    <fieldset className="fieldgroup form-composite js-form-item form-item js-form-wrapper form-wrapper">
      <legend>
        <span className="fieldset-legend" />
      </legend>
      <div className="fieldset-wrapper">
        <div className="form-radios">
          <div className="form-radios form--inline">
            {GUIDE_CATEGORIES.map((cat) => (
              <div
                key={cat}
                className="form-check js-form-item form-item js-form-type-radio form-type-radio js-form-item-field-categories-target-id form-item-field-categories-target-id"
              >
                <input
                  type="radio"
                  id={`${idPrefix}-${cat}`}
                  name={`${idPrefix}-category`}
                  value={cat}
                  checked={value === cat}
                  onChange={() => onChange(cat)}
                  className="form-radio form-check-input"
                />
                <label className="form-check-label option" htmlFor={`${idPrefix}-${cat}`}>
                  {cat}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </fieldset>
  )
}

export default function GuidesListing() {
  const [articles, setArticles] = useState(guideArticles)
  const [featCategory, setFeatCategory] = useState('Tous')
  const [allCategory, setAllCategory] = useState('Tous')
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchGuideArticles()
      .then((rows) => {
        if (!cancelled && Array.isArray(rows) && rows.length) setArticles(rows)
      })
      .catch(() => {
        // Strapi unreachable / empty — keep the bundled fallback guides.
      })
    return () => {
      cancelled = true
    }
  }, [])

  const featured = useMemo(() => articles.filter((a) => a.featured), [articles])
  const allGuides = useMemo(() => articles.filter((a) => !a.featured), [articles])

  const filteredFeatured = useMemo(() => {
    if (featCategory === 'Tous') return featured
    return featured.filter((a) => (a.categories || []).includes(featCategory))
  }, [featured, featCategory])

  const filteredAll = useMemo(() => {
    if (allCategory === 'Tous') return allGuides
    return allGuides.filter((a) => (a.categories || []).includes(allCategory))
  }, [allGuides, allCategory])

  return (
    <MirrorShell documentTitle="Guides | EVplug">
      <Seo
        title="Guides | EVplug"
        description="Tout ce qu'il faut savoir sur la recharge de véhicules électriques : guides pratiques, coûts et conseils au quotidien."
        path="/guides"
      />
      <div className="region region-content">
        <article className="node node--type-page">
          <div className="node__content">
            <Breadcrumb current="Guides" />

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
                        Parcourir nos guides
                      </h1>
                      <div className="m-0" style={{ color: '#000000' }}>
                        <p>Tout ce qu'il faut savoir sur la recharge de VE, au meme endroit.</p>
                      </div>
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

            {/* Featured Guides */}
            <section className="filter-sction">
              <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile">
                <div className="custom-filter">
                  <div className="filter-show">
                    <div className="grid md:grid-flow-col xl:grid-cols-1 gap-spacing-xl filter-buttons filter-block">
                      <div className="filter-item-categories flex items-center gap-spacing-xl md:justify-start justify-between">
                        <CategoryFilter
                          idPrefix="feat-cat"
                          value={featCategory}
                          onChange={setFeatCategory}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="all-guides relative featured-guides-header">
              <div className="container-max-width-desktop container-max-width-tablet mx-auto py-spacing-4xl container-padding-desktop container-padding-tablet container-padding-mobile">
                <div className="view-header">
                  <div className="heading-block py-spacing-xl grid gap-spacing-sm">
                    <h4>Guides en avant</h4>
                    <p>Les bases pour bien demarrer.</p>
                  </div>
                </div>

                <div className="view-content">
                  <div className="featured-guides relative">
                    <div className="featured-guide-block">
                      <div className="grid xl:grid-flow-col xl:grid-cols-2 xl:grid-rows-2 gap-spacing-4xl pt-spacing-xl">
                        {filteredFeatured.map((a) =>
                          a.layout === 'tall' ? (
                            <FeaturedTallCard key={a.slug} a={a} />
                          ) : (
                            <FeaturedShortCard key={a.slug} a={a} />
                          ),
                        )}
                      </div>
                      {filteredFeatured.length === 0 && (
                        <div className="py-spacing-7xl text-center opacity-70">
                          Aucun guide en avant dans cette categorie.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* All Guides filter + grid */}
            <section className="filter-sction">
              <div className="container-max-width-desktop container-max-width-tablet mx-auto container-padding-desktop container-padding-tablet container-padding-mobile">
                <div className="custom-filter">
                  <div className="filter-show">
                    <div className="grid md:grid-flow-col xl:grid-cols-1 gap-spacing-xl filter-buttons filter-block">
                      <div className="filter-item-categories flex items-center gap-spacing-xl md:justify-start justify-between">
                        <div className="hidden xl:block">
                          <CategoryFilter
                            idPrefix="all-cat"
                            value={allCategory}
                            onChange={setAllCategory}
                          />
                        </div>
                        <div className="category-selected xl:hidden">{allCategory}</div>
                        <div
                          className="accordion-arrow cursor-pointer filter-arrow xl:hidden"
                          onClick={() => setShowMobileFilter(true)}
                        >
                          <i className="fa-solid fa-plus" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {showMobileFilter && (
              <div
                className="filter-item-categories xl:hidden"
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.6)',
                  zIndex: 50,
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '0',
                }}
                onClick={() => setShowMobileFilter(false)}
              >
                <div
                  className="sm:rounded-tr-2xl sm:rounded-br-2xl max-w-[400px] h-full w-full bg-surface filter-slide-menu px-spacing-4xl py-spacing-7xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-flow-col justify-between pb-spacing-4xl">
                    <h6 className="font-2xl m-0">Filtre</h6>
                    <div
                      className="cursor-pointer text-xl"
                      onClick={() => setShowMobileFilter(false)}
                    >
                      <i className="fa-solid fa-xmark" />
                    </div>
                  </div>
                  <CategoryFilter
                    idPrefix="all-cat-mobile"
                    value={allCategory}
                    onChange={(v) => {
                      setAllCategory(v)
                      setShowMobileFilter(false)
                    }}
                  />
                </div>
              </div>
            )}

            <section className="all-guides relative">
              <div className="container-max-width-desktop container-max-width-tablet mx-auto sm:pt-spacing-4xl pb-spacing-4xl container-padding-desktop container-padding-tablet container-padding-mobile">
                <div className="view-header">
                  <div className="heading-block py-spacing-xl grid gap-spacing-sm">
                    <h4>Tous les guides</h4>
                    <p>Pour toutes les autres questions.</p>
                  </div>
                </div>

                <div className="view-content">
                  <div className="grid xl:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-spacing-4xl pt-spacing-4xl">
                    {filteredAll.map((a) => (
                      <GridCard key={a.slug} a={a} />
                    ))}
                  </div>
                  {filteredAll.length === 0 && (
                    <div className="py-spacing-7xl text-center opacity-70">
                      Aucun guide dans cette categorie.
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
