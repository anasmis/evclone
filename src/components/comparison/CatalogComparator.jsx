import { useEffect, useMemo, useState } from 'react'
import { fetchComparatorProducts, fetchComparatorVehicles } from '../../lib/api/strapi'

const formatPrice = (value) =>
  Number.isFinite(value)
    ? new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value)
    : 'Sur demande'

const textValue = (value) => {
  if (Array.isArray(value)) return value.length ? value.join(' · ') : '—'
  if (value === undefined || value === null || value === '') return '—'
  return String(value)
}

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
    description: 'Sélectionnez jusqu’à 3 produits pour comparer leurs caractéristiques essentielles.',
    search: 'Rechercher une borne ou une marque',
    empty: 'Aucun produit publié dans Strapi pour le moment.',
    icon: 'fa-charging-station',
  },
  vehicles: {
    fetcher: fetchComparatorVehicles,
    rows: vehicleRows,
    eyebrow: 'Véhicules électriques',
    title: 'Comparez les véhicules électriques',
    description: 'Mettez côte à côte autonomie, batterie, recharge et dimensions.',
    search: 'Rechercher un modèle ou une marque',
    empty: 'Aucun véhicule publié dans Strapi pour le moment.',
    icon: 'fa-car-side',
  },
}

function ProductImage({ item, icon }) {
  if (!item.image) {
    return (
      <div className="h-36 rounded-2xl bg-blue-dianne/5 flex items-center justify-center" aria-hidden="true">
        <i className={`fa-solid ${icon} text-4xl text-blue-dianne/25`} />
      </div>
    )
  }
  return (
    <img
      src={item.image}
      alt=""
      className="h-36 w-full object-contain rounded-2xl bg-white"
      onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
    />
  )
}

export default function CatalogComparator({ type }) {
  const config = configs[type] || configs.products
  const [items, setItems] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let active = true
    config.fetcher()
      .then((entries) => {
        if (!active) return
        setItems(entries)
        setSelectedIds(entries.slice(0, 2).map((item) => item.id))
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

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')),
    [items],
  )

  const filtered = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase('fr')
    return items.filter((item) => {
      const matchesText = !needle || [item.name, item.brand, item.category].some((value) =>
        String(value || '').toLocaleLowerCase('fr').includes(needle),
      )
      return matchesText && (!category || item.category === category)
    })
  }, [items, search, category])

  const selected = selectedIds.map((id) => items.find((item) => item.id === id)).filter(Boolean)

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
        <div className="max-w-[780px] grid gap-spacing-lg">
          <span className="inline-flex w-fit items-center gap-spacing-sm rounded-full bg-lime px-spacing-md py-spacing-sm text-sm font-semibold text-black">
            <i className={`fa-solid ${config.icon}`} aria-hidden="true" /> {config.eyebrow}
          </span>
          <h2 className="tracking-tight m-0">{config.title}</h2>
          <p className="m-0 text-blue-dianne/70">{config.description}</p>
        </div>

        <div className="rounded-3xl bg-surface p-spacing-3xl md:p-spacing-4xl grid gap-spacing-3xl">
          <div className="grid md:grid-cols-[1fr_240px] gap-spacing-md">
            <label className="relative">
              <span className="sr-only">{config.search}</span>
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-blue-dianne/45" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={config.search}
                className="w-full rounded-full border border-black/10 bg-white py-spacing-md pl-11 pr-spacing-xl text-blue-dianne outline-none focus:border-blue-dianne"
              />
            </label>
            <label>
              <span className="sr-only">Filtrer par catégorie</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-full border border-black/10 bg-white px-spacing-xl py-spacing-md text-blue-dianne outline-none focus:border-blue-dianne"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>

          <div className="flex items-center justify-between gap-spacing-md text-sm text-blue-dianne/65">
            <span>{selected.length}/3 sélectionnés</span>
            {selected.length === 3 && <span>Retirez un élément pour en choisir un autre.</span>}
          </div>

          {loading ? (
            <div className="min-h-48 flex items-center justify-center text-blue-dianne/60">
              <i className="fa-solid fa-spinner fa-spin mr-spacing-sm" aria-hidden="true" /> Chargement du catalogue…
            </div>
          ) : filtered.length ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-spacing-md max-h-[520px] overflow-y-auto pr-spacing-xs">
              {filtered.map((item) => {
                const active = selectedIds.includes(item.id)
                const disabled = !active && selectedIds.length >= 3
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    disabled={disabled}
                    aria-pressed={active}
                    className={`text-left rounded-2xl border p-spacing-md grid gap-spacing-md transition-all ${
                      active
                        ? 'border-blue-dianne bg-white shadow-[0_14px_30px_-22px_rgba(22,62,76,0.9)]'
                        : 'border-transparent bg-white/70 hover:border-blue-dianne/25 disabled:opacity-45 disabled:cursor-not-allowed'
                    }`}
                  >
                    <ProductImage item={item} icon={config.icon} />
                    <span className="grid gap-spacing-xs">
                      <span className="text-xs uppercase tracking-wide text-blue-dianne/50">{item.brand || item.category || 'EVplug'}</span>
                      <span className="font-bold text-blue-dianne leading-tight">{item.name}</span>
                      <span className="text-sm text-blue-dianne/65">{formatPrice(item.price)}</span>
                    </span>
                    <span className={`inline-flex items-center gap-spacing-xs text-sm font-semibold ${active ? 'text-blue-dianne' : 'text-blue-dianne/55'}`}>
                      <i className={`fa-solid ${active ? 'fa-circle-check' : 'fa-circle-plus'}`} aria-hidden="true" />
                      {active ? 'Sélectionné' : 'Ajouter'}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-white px-spacing-3xl py-spacing-5xl text-center text-blue-dianne/65">
              <i className={`fa-solid ${unavailable ? 'fa-database' : 'fa-magnifying-glass'} text-2xl mb-spacing-md block`} aria-hidden="true" />
              {unavailable ? config.empty : 'Aucun résultat pour ces filtres.'}
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <div className="overflow-x-auto rounded-3xl border border-black/10 bg-white">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="bg-blue-dianne text-white">
                  <th className="w-[220px] p-spacing-xl text-sm uppercase tracking-wide">Caractéristique</th>
                  {selected.map((item) => (
                    <th key={item.id} className="p-spacing-xl align-top">
                      <div className="flex items-start justify-between gap-spacing-md">
                        <span className="font-bold text-lg leading-tight">{item.name}</span>
                        <button type="button" onClick={() => toggle(item.id)} aria-label={`Retirer ${item.name}`} className="text-white/65 hover:text-white">
                          <i className="fa-solid fa-xmark" aria-hidden="true" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {config.rows.map((row, index) => (
                  <tr key={row.key} className={index % 2 ? 'bg-surface/55' : 'bg-white'}>
                    <th className="p-spacing-xl text-sm font-semibold text-blue-dianne/65">{row.label}</th>
                    {selected.map((item) => {
                      const raw = item[row.key]
                      const value = row.format ? row.format(raw) : `${textValue(raw)}${raw !== '' && raw !== null && raw !== undefined && row.suffix ? row.suffix : ''}`
                      return <td key={item.id} className="p-spacing-xl text-blue-dianne font-medium align-top">{value}</td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
