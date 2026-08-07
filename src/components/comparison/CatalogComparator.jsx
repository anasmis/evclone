import { useEffect, useMemo, useState } from 'react'
import { fetchComparatorProducts, fetchComparatorVehicles } from '../../lib/api/strapi'

const PAGE_SIZE = 18

const formatPrice = (value) =>
  Number.isFinite(value)
    ? new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value)
    : 'Sur demande'

const textValue = (value) => {
  if (Array.isArray(value)) return value.length ? value.join(' · ') : '—'
  if (value === undefined || value === null || value === '') return '—'
  return String(value)
}

const searchableText = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('fr')

const productRows = [
  { key: 'price', label: 'Prix', format: formatPrice },
  { key: 'brand', label: 'Marque' },
  { key: 'category', label: 'Catégorie' },
  { key: 'power', label: 'Puissance' },
  { key: 'voltage', label: 'Tension' },
  { key: 'current', label: 'Courant' },
  { key: 'connectivity', label: 'Connectivité' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'weight', label: 'Poids' },
  { key: 'warranty', label: 'Garantie' },
  { key: 'features', label: 'Fonctionnalités' },
]

const vehicleRows = [
  { key: 'price', label: 'Prix', format: formatPrice },
  { key: 'brand', label: 'Marque' },
  { key: 'category', label: 'Catégorie' },
  { key: 'range', label: 'Autonomie' },
  { key: 'battery', label: 'Batterie' },
  { key: 'consumption', label: 'Consommation' },
  { key: 'power', label: 'Puissance maximale' },
  { key: 'acceleration', label: '0 à 100 km/h' },
  { key: 'topSpeed', label: 'Vitesse maximale' },
  { key: 'fastCharging', label: 'Recharge rapide' },
  { key: 'chargingType', label: 'Type de recharge' },
  { key: 'seats', label: 'Places' },
  { key: 'trunkVolume', label: 'Volume du coffre' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'weight', label: 'Poids' },
  { key: 'warranty', label: 'Garantie' },
]

const configs = {
  products: {
    fetcher: fetchComparatorProducts,
    rows: productRows,
    eyebrow: 'Bornes & accessoires',
    title: 'Comparez les solutions de recharge',
    description: 'Recherchez dans le catalogue, puis sélectionnez jusqu’à trois solutions.',
    search: 'Nom, marque, puissance, connectivité…',
    empty: 'Aucun produit publié dans Strapi pour le moment.',
    icon: 'fa-charging-station',
    resultLabel: 'solutions',
  },
  vehicles: {
    fetcher: fetchComparatorVehicles,
    rows: vehicleRows,
    eyebrow: 'Véhicules électriques',
    title: 'Comparez les véhicules électriques',
    description: 'Recherchez un modèle, une marque, une capacité ou une autonomie, puis comparez.',
    search: 'Modèle, marque, batterie, autonomie…',
    empty: 'Aucun véhicule publié dans Strapi pour le moment.',
    icon: 'fa-car-side',
    resultLabel: 'véhicules',
  },
}

function ProductImage({ item, icon, compact = false }) {
  const sizeClass = compact ? 'h-20 w-24' : 'h-28 w-full'
  if (!item.image) {
    return (
      <span className={`${sizeClass} flex shrink-0 items-center justify-center rounded-xl bg-blue-dianne/5`} aria-hidden="true">
        <i className={`fa-solid ${icon} ${compact ? 'text-xl' : 'text-3xl'} text-blue-dianne/25`} />
      </span>
    )
  }
  return (
    <img
      src={item.image}
      alt=""
      className={`${sizeClass} shrink-0 rounded-xl bg-white object-contain`}
      onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
    />
  )
}

export default function CatalogComparator({ type }) {
  const config = configs[type] || configs.products
  const [items, setItems] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let active = true
    config.fetcher()
      .then((entries) => {
        if (!active) return
        setItems(entries)
        setUnavailable(false)
      })
      .catch(() => {
        if (!active) return
        setItems([])
        setUnavailable(true)
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [config])

  const brands = useMemo(
    () => [...new Set(items.map((item) => item.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')),
    [items],
  )

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')),
    [items],
  )

  const filtered = useMemo(() => {
    const needle = searchableText(search.trim())
    return items
      .filter((item) => {
        const haystack = [
          item.name,
          item.brand,
          item.model,
          item.category,
          item.description,
          item.power,
          item.battery,
          item.range,
          item.connectivity,
          item.features,
        ].map(searchableText)
        const matchesText = !needle || haystack.some((value) => value.includes(needle))
        return matchesText && (!brand || item.brand === brand) && (!category || item.category === category)
      })
      .sort((a, b) => {
        if (!needle) return a.name.localeCompare(b.name, 'fr')
        const aName = searchableText(a.name)
        const bName = searchableText(b.name)
        const aScore = aName === needle ? 0 : aName.startsWith(needle) ? 1 : searchableText(a.brand).startsWith(needle) ? 2 : 3
        const bScore = bName === needle ? 0 : bName.startsWith(needle) ? 1 : searchableText(b.brand).startsWith(needle) ? 2 : 3
        return aScore - bScore || a.name.localeCompare(b.name, 'fr')
      })
  }, [items, search, brand, category])

  const selected = selectedIds.map((id) => items.find((item) => item.id === id)).filter(Boolean)
  const visibleItems = filtered.slice(0, visibleCount)
  const filtersActive = Boolean(search || brand || category)

  const updateSearch = (value) => {
    setSearch(value)
    setVisibleCount(PAGE_SIZE)
  }

  const resetFilters = () => {
    setSearch('')
    setBrand('')
    setCategory('')
    setVisibleCount(PAGE_SIZE)
  }

  const toggle = (id) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id)
      if (current.length >= 3) return current
      return [...current, id]
    })
  }

  return (
    <section className="bg-white py-spacing-6xl xl:py-spacing-8xl">
      <div className="container-max-width-desktop container-max-width-tablet container-padding-desktop container-padding-tablet container-padding-mobile mx-auto grid gap-spacing-5xl">
        <header className="grid max-w-[780px] gap-spacing-lg">
          <span className="inline-flex w-fit items-center gap-spacing-sm rounded-full bg-lime px-spacing-md py-spacing-sm text-sm font-semibold text-black">
            <i className={`fa-solid ${config.icon}`} aria-hidden="true" /> {config.eyebrow}
          </span>
          <h2 className="m-0 tracking-tight">{config.title}</h2>
          <p className="m-0 text-blue-dianne/70">{config.description}</p>
        </header>

        <div className="grid gap-spacing-3xl rounded-3xl bg-surface p-spacing-3xl md:p-spacing-4xl">
          <div className="grid gap-spacing-md lg:grid-cols-[minmax(320px,1fr)_220px_220px]">
            <label className="relative">
              <span className="sr-only">{config.search}</span>
              <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-dianne/45" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder={config.search}
                className="w-full rounded-2xl border border-black/10 bg-white py-spacing-md pl-11 pr-12 text-blue-dianne outline-none transition focus:border-blue-dianne focus:ring-2 focus:ring-lime/40"
              />
              {search && (
                <button type="button" onClick={() => updateSearch('')} aria-label="Effacer la recherche" className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-blue-dianne/45 hover:bg-surface hover:text-blue-dianne">
                  <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
              )}
            </label>
            <label className="relative">
              <span className="sr-only">Filtrer par marque</span>
              <select value={brand} onChange={(event) => { setBrand(event.target.value); setVisibleCount(PAGE_SIZE) }} className="w-full appearance-none rounded-2xl border border-black/10 bg-white px-spacing-lg py-spacing-md pr-10 text-blue-dianne outline-none focus:border-blue-dianne focus:ring-2 focus:ring-lime/40">
                <option value="">Toutes les marques</option>
                {brands.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-blue-dianne/40" aria-hidden="true" />
            </label>
            <label className="relative">
              <span className="sr-only">Filtrer par catégorie</span>
              <select value={category} onChange={(event) => { setCategory(event.target.value); setVisibleCount(PAGE_SIZE) }} className="w-full appearance-none rounded-2xl border border-black/10 bg-white px-spacing-lg py-spacing-md pr-10 text-blue-dianne outline-none focus:border-blue-dianne focus:ring-2 focus:ring-lime/40">
                <option value="">Toutes les catégories</option>
                {categories.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-blue-dianne/40" aria-hidden="true" />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-spacing-md text-sm text-blue-dianne/60" aria-live="polite">
            <span><strong className="text-blue-dianne">{filtered.length}</strong> {config.resultLabel} · {selected.length}/3 sélectionnés</span>
            {filtersActive && <button type="button" onClick={resetFilters} className="inline-flex items-center gap-spacing-xs font-semibold text-blue-dianne underline decoration-blue-dianne/25 underline-offset-4 hover:text-orange"><i className="fa-solid fa-rotate-left" aria-hidden="true" /> Réinitialiser</button>}
          </div>

          {selected.length > 0 && (
            <div className="grid gap-spacing-sm rounded-2xl border border-blue-dianne/10 bg-white p-spacing-md sm:grid-cols-2 lg:grid-cols-3">
              {selected.map((item, index) => (
                <div key={item.id} className="flex min-w-0 items-center gap-spacing-md rounded-xl bg-surface px-spacing-md py-spacing-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-dianne text-xs font-bold text-white">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-blue-dianne">{item.name}</span>
                  <button type="button" onClick={() => toggle(item.id)} aria-label={`Retirer ${item.name}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-blue-dianne/45 hover:bg-white hover:text-orange"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
                </div>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-48 items-center justify-center text-blue-dianne/60">
              <i className="fa-solid fa-spinner fa-spin mr-spacing-sm" aria-hidden="true" /> Chargement du catalogue…
            </div>
          ) : visibleItems.length ? (
            <>
              <div className="grid gap-spacing-md md:grid-cols-2 xl:grid-cols-3">
                {visibleItems.map((item) => {
                  const active = selectedIds.includes(item.id)
                  const disabled = !active && selectedIds.length >= 3
                  return (
                    <article key={item.id} className={`grid grid-cols-[96px_1fr] gap-spacing-md rounded-2xl border bg-white p-spacing-md transition-all ${active ? 'border-blue-dianne shadow-[0_14px_30px_-24px_rgba(22,62,76,.9)]' : 'border-transparent hover:border-blue-dianne/25'}`}>
                      <ProductImage item={item} icon={config.icon} compact />
                      <div className="grid min-w-0 content-between gap-spacing-sm">
                        <div className="min-w-0">
                          <span className="block truncate text-[10px] font-bold uppercase tracking-wide text-blue-dianne/45">{item.brand || item.category || 'EVplug'}</span>
                          <h3 className="m-0 mt-1 line-clamp-2 text-base leading-tight text-blue-dianne">{item.name}</h3>
                          <span className="mt-1 block truncate text-xs text-blue-dianne/55">{type === 'vehicles' ? item.battery || item.range || formatPrice(item.price) : item.power || formatPrice(item.price)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggle(item.id)}
                          disabled={disabled}
                          aria-pressed={active}
                          className={`inline-flex w-fit items-center gap-spacing-xs rounded-full px-spacing-md py-spacing-xs text-xs font-bold transition-colors ${active ? 'bg-blue-dianne text-white' : 'bg-surface text-blue-dianne hover:bg-lime/40 disabled:cursor-not-allowed disabled:opacity-40'}`}
                        >
                          <i className={`fa-solid ${active ? 'fa-check' : 'fa-plus'}`} aria-hidden="true" /> {active ? 'Sélectionné' : 'Comparer'}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
              {visibleItems.length < filtered.length && (
                <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="mx-auto inline-flex items-center gap-spacing-sm rounded-full border border-blue-dianne/20 bg-white px-spacing-xl py-spacing-md text-sm font-bold text-blue-dianne hover:border-blue-dianne/50">
                  Afficher plus <span className="text-blue-dianne/45">({filtered.length - visibleItems.length})</span>
                </button>
              )}
            </>
          ) : (
            <div className="rounded-2xl bg-white px-spacing-3xl py-spacing-5xl text-center text-blue-dianne/65">
              <i className={`fa-solid ${unavailable ? 'fa-database' : 'fa-magnifying-glass'} mb-spacing-md block text-2xl`} aria-hidden="true" />
              {unavailable ? config.empty : 'Aucun résultat pour cette recherche.'}
              {filtersActive && <button type="button" onClick={resetFilters} className="mx-auto mt-spacing-md block font-semibold text-blue-dianne underline underline-offset-4">Effacer les filtres</button>}
            </div>
          )}
        </div>

        {selected.length > 0 ? (
          <div className="overflow-x-auto rounded-3xl border border-black/10 bg-white shadow-[0_20px_60px_-48px_rgba(22,62,76,.7)]">
            <table className="w-full min-w-[820px] table-fixed border-collapse text-left">
              <thead>
                <tr className="bg-blue-dianne text-white">
                  <th className="sticky left-0 z-10 w-[190px] bg-blue-dianne p-spacing-lg text-xs uppercase tracking-wide">Caractéristique</th>
                  {selected.map((item) => (
                    <th key={item.id} className="w-[280px] p-spacing-lg align-top">
                      <div className="flex items-start justify-between gap-spacing-md">
                        <span>
                          <span className="block text-[10px] font-semibold uppercase tracking-wide text-white/50">{item.brand || item.category}</span>
                          <strong className="mt-1 block text-base leading-tight">{item.name}</strong>
                        </span>
                        <button type="button" onClick={() => toggle(item.id)} aria-label={`Retirer ${item.name}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {config.rows.map((row, index) => (
                  <tr key={row.key} className={index % 2 ? 'bg-surface/55' : 'bg-white'}>
                    <th className={`sticky left-0 z-[1] p-spacing-lg text-xs font-bold uppercase tracking-wide text-blue-dianne/50 ${index % 2 ? 'bg-[#f4f2ec]' : 'bg-white'}`}>{row.label}</th>
                    {selected.map((item) => {
                      const raw = item[row.key]
                      const value = row.format ? row.format(raw) : textValue(raw)
                      return <td key={item.id} className="border-l border-blue-dianne/5 p-spacing-lg align-top text-sm font-medium leading-relaxed text-blue-dianne">{value}</td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-blue-dianne/20 bg-surface/45 px-spacing-3xl py-spacing-5xl text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-dianne/35"><i className="fa-solid fa-code-compare" aria-hidden="true" /></span>
            <h3 className="m-0 mt-spacing-md text-lg text-blue-dianne">Votre comparaison apparaîtra ici</h3>
            <p className="m-0 mt-spacing-xs text-sm text-blue-dianne/55">Utilisez la recherche pour sélectionner jusqu’à trois éléments.</p>
          </div>
        )}
      </div>
    </section>
  )
}
