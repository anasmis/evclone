import { useEffect, useMemo, useState } from 'react'

// A filter bar that mirrors the guides/news pages structure while remaining API-agnostic.
// Props: { categories, onChange, initial, placeholder }
export default function FiltersBar({
  categories = [],
  onChange,
  initial = {},
  placeholder = 'Search articles…',
  showCategory = true,
}) {
  const [search, setSearch] = useState(initial.search || '')
  const [category, setCategory] = useState(initial.category || '')

  useEffect(() => {
    const i = setTimeout(() => onChange && onChange({ search, category }), 250)
    return () => clearTimeout(i)
  }, [search, category, onChange])

  return (
    <section className="filter-sction">
      <form className="views-exposed-form bef-exposed-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="fieldset-wrapper">
          <div className="container mx-auto px-4">
            <div className="filters-grid grid grid-cols-1 md:grid-cols-3 gap-4 place-items-center">
            <div className="form-item form-item-search">
              <label htmlFor="filters-search" className="form-label sr-only">Search</label>
              <input
                id="filters-search"
                type="search"
                className="form-text form-control"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {showCategory && (
              <div className="form-item form-item-category">
                <label htmlFor="filters-category" className="form-label sr-only">Category</label>
                <select
                  id="filters-category"
                  className="form-select form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="button button--primary btn btn-primary">Filter</button>
            </div>
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  )
}
