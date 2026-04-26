const DEFAULT_ROOT_CLASSES = 'dialog-off-canvas-main-canvas d-flex flex-column h-100'

export function splitShellBlocks(markup) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${markup}</body>`, 'text/html')
  const body = doc.body
  const root = body.querySelector('.dialog-off-canvas-main-canvas')

  if (!root) {
    return {
      preRoot: '',
      rootClassName: DEFAULT_ROOT_CLASSES,
      navbar: '',
      footer: '',
    }
  }

  const preRootNodes = []
  let sibling = body.firstChild
  while (sibling && sibling !== root) {
    preRootNodes.push(sibling.cloneNode(true))
    sibling = sibling.nextSibling
  }

  const preRootContainer = document.createElement('div')
  preRootNodes.forEach((node) => preRootContainer.appendChild(node))

  return {
    preRoot: preRootContainer.innerHTML,
    rootClassName: root.className || DEFAULT_ROOT_CLASSES,
    navbar: root.querySelector('header')?.outerHTML || '',
    footer: root.querySelector('footer')?.outerHTML || '',
  }
}

export function extractMainMarkup(markup) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${markup}</body>`, 'text/html')
  const body = doc.body
  const root = body.querySelector('.dialog-off-canvas-main-canvas')
  const mainElement = root?.querySelector('main') || body.querySelector('main')

  if (mainElement) {
    return mainElement.innerHTML
  }

  return markup
}
