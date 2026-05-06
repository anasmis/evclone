// A card that mirrors the Drupal "views" article card structure for CSS compatibility.
// Accepts: { article, variant }
// - variant: 'feature' | 'grid'
export default function ArticleCard({ article, variant = 'grid' }) {
  const {
    id,
    title,
    excerpt,
    imageUrl,
    category,
    tags = [],
    publishedAt,
    url = '#',
  } = article || {}

  const date = publishedAt ? new Date(publishedAt) : null

  const wrapperClasses = [
    'views-row',
    variant === 'feature' ? 'views-row--featured' : 'views-row--grid',
  ]

  return (
    <div className={wrapperClasses.join(' ')}>
      <article className="node node--type-article node--view-mode-teaser">
        <div className="article-card">
          {imageUrl && (
            <a href={url} className="article-card__image link-cover">
              <img src={imageUrl} alt={title} loading="lazy" />
            </a>
          )}
          <div className="article-card__content">
            <div className="article-card__meta">
              {category && <span className="badge category">{category}</span>}
              {date && (
                <time dateTime={date.toISOString()} className="published">
                  {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              )}
            </div>
            <h3 className="article-card__title">
              <a href={url} className="link-cover__title">{title}</a>
            </h3>
            {excerpt && <p className="article-card__excerpt">{excerpt}</p>}
            {Array.isArray(tags) && tags.length > 0 && (
              <ul className="tags list-inline">
                {tags.map((t) => (
                  <li key={`${id}-${t}`} className="tag">{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
