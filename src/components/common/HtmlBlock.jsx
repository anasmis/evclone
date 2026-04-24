export default function HtmlBlock({ tag: Tag = 'div', html, ...props }) {
  if (!html) {
    return null
  }

  return <Tag {...props} dangerouslySetInnerHTML={{ __html: html }} />
}
