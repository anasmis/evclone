// News & Guides article data.
// Each entry powers both the listing card AND the dedicated article page
// rendered by src/pages/ArticlePage.jsx.
//
// Body content is structured as an ordered list of blocks. Supported block
// types are handled in ArticlePage.jsx:
//   { type: 'paragraph', text }
//   { type: 'heading',   level: 2|3, text }
//   { type: 'image',     src, alt, caption? }
//   { type: 'quote',     text, author? }
//   { type: 'list',      style: 'bullet'|'number', items: [string] }

import podPower from '../migrated/assets/news/pod-power.webp'
import evsHeavier from '../migrated/assets/guides/evs-heavier.webp'

export const GUIDE_CATEGORIES = ['Tous', 'Actualites', 'Vivre avec un VE', 'Couts', 'Entreprise', 'Recharge']

const placeholderBody = (title) => [
  {
    type: 'paragraph',
    text: `Cet article ("${title}") est en cours de redaction. Le contenu detaille sera publie prochainement.`,
  },
  {
    type: 'paragraph',
    text: "En attendant, n'hesitez pas a parcourir nos autres guides et actualites pour decouvrir tout ce qu'EVplug peut vous apporter au quotidien.",
  },
]

export const newsArticles = [
  {
    slug: 'pod-launches-pod-power-edf-7-hour-peak-ev-tariff',
    image: podPower,
    title: 'Pod launches EVplug Energie, a 7-hour off-peak EV tariff',
    description:
      "Pod's new EV tariff offers 7 hours of low-cost electricity every night to make home charging simpler and more affordable.",
    date: 'April 2026',
    readTime: 6,
    body: placeholderBody('Pod launches EVplug Energie, a 7-hour off-peak EV tariff'),
  },
]

export const guideArticles = [
  {
    slug: 'are-evs-heavier-traditional-ice-vehicles',
    image: evsHeavier,
    title: 'Les VE sont-ils plus lourds que les vehicules thermiques traditionnels ?',
    description: "Oui, ils le sont. Mais voici pourquoi c'est moins preoccupant qu'on pourrait le penser.",
    date: 'April 2026',
    readTime: 4,
    categories: ['Vivre avec un VE'],
    body: placeholderBody('Les VE sont-ils plus lourds'),
  },
]

export function getNewsArticle(slug) {
  return newsArticles.find((a) => a.slug === slug) || null
}

export function getGuideArticle(slug) {
  return guideArticles.find((a) => a.slug === slug) || null
}
