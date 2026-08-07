import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const CLIENT_DIST = path.resolve('dist/client')
const MIN_BLOG_PAGES = Math.max(2, Number(process.env.MIN_PRERENDERED_BLOGS) || 10)

async function collectIndexFiles(root) {
  const found = []
  let entries
  try {
    entries = await fs.readdir(root, { withFileTypes: true })
  } catch {
    return found
  }

  for (const entry of entries) {
    const target = path.join(root, entry.name)
    if (entry.isDirectory()) found.push(...await collectIndexFiles(target))
    if (entry.isFile() && entry.name === 'index.html') found.push(target)
  }
  return found
}

const articleFiles = [
  ...await collectIndexFiles(path.join(CLIENT_DIST, 'news')),
  ...await collectIndexFiles(path.join(CLIENT_DIST, 'guides')),
]

if (articleFiles.length < MIN_BLOG_PAGES) {
  console.error(`Prerender verification failed: expected at least ${MIN_BLOG_PAGES} blog pages, found ${articleFiles.length}.`)
  console.error('Check that the VPS build secret contains VITE_STRAPI_URL and, when required, VITE_STRAPI_TOKEN.')
  process.exit(1)
}

const invalidFiles = []
for (const file of articleFiles) {
  const html = await fs.readFile(file, 'utf8')
  const hasArticleHeading = /<h1\b[^>]*>[^<]+/i.test(html)
  const isLoadingShell = /Chargement(?:&hellip;|…| de l(?:&rsquo;|’)article)/i.test(html)
  if (!hasArticleHeading || isLoadingShell) invalidFiles.push(path.relative(CLIENT_DIST, file))
}

if (invalidFiles.length) {
  console.error(`Prerender verification failed: ${invalidFiles.length} page(s) still contain an incomplete article shell.`)
  console.error(invalidFiles.slice(0, 10).join('\n'))
  process.exit(1)
}

console.log(`Verified ${articleFiles.length} prerendered blog and guide pages.`)
