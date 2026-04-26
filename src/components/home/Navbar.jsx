import { createPortal } from 'react-dom'
import HtmlBlock from '../common/HtmlBlock'

export default function Navbar({ html }) {
  if (!html) return null
  return createPortal(
    <div className="evplug-navbar-portal" dangerouslySetInnerHTML={{ __html: html }} />,
    document.body,
  )
}
