import ArticleCard from './ArticleCard'

export default function ArticleGrid({ items = [], variant = 'grid', emptyText = 'No articles found.' }) {
  if (!items.length) {
    return <p className="view-empty text-muted text-center my-8">{emptyText}</p>
  }

  return (
    <div className={`view-content ${variant === 'feature' ? 'view-feature' : 'view-grid'}`}>
      <div className="views-row-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((article) => (
          <ArticleCard key={article.id || article.slug} article={article} variant={variant} />
        ))}
      </div>
    </div>
  )
}
