Editorial templates (React)

This folder contains React-first templates that closely mirror the look and structure of the original Drupal-rendered pages (guides.html and news.html) without importing or routing to those HTML files.

Components
- GuidesTemplate.jsx — Guides listing with featured + all sections and filters
- NewsTemplate.jsx — News listing with featured + all sections and filters

Supporting UI
- ../../components/editorial/ArticleCard.jsx — Single article card
- ../../components/editorial/ArticleGrid.jsx — Grid renderer
- ../../components/editorial/FiltersBar.jsx — Search/category filters
- ../../lib/api/editorialApi.js — Minimal API client (configure via VITE_API_BASE_URL)

Usage
Import and mount these templates anywhere in your router. They do NOT depend on the mirrored HTML pages.

Example (routes):

import { Routes, Route } from 'react-router-dom'
import { GuidesTemplate, NewsTemplate } from './pages/editorial'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/guides" element={<GuidesTemplate />} />
      <Route path="/news" element={<NewsTemplate />} />
    </Routes>
  )
}

API shape
Expected JSON from /api/guides and /api/news:
{
  "items": [
    {
      "id": "123",
      "slug": "how-to-charge-faster",
      "title": "How to charge faster",
      "excerpt": "Tips to improve your charging experience…",
      "imageUrl": "https://…/image.jpg",
      "category": "Charging",
      "tags": ["beginner", "how-to"],
      "publishedAt": "2025-06-15T10:00:00Z",
      "featured": true,
      "url": "/guides/how-to-charge-faster"
    }
  ],
  "total": 120,
  "page": 1,
  "pageSize": 12
}

Environment
- Set VITE_API_BASE_URL to point to your backend (optional). If not set, relative paths like /api/guides are used.

Notes
- Markup/classnames intentionally mirror the originals to maximize CSS reuse. No inline scripts or static HTML from the mirrored pages are used.
