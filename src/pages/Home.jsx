import { useEffect, useLayoutEffect, useMemo } from 'react'
import Footer from '../components/home/Footer'
import Hero from '../components/home/Hero'
import Navbar from '../components/home/Navbar'
import Sections from '../components/home/Sections'
import homeBodyRaw from '../migrated/home-body.html?raw'
import HtmlBlock from '../components/common/HtmlBlock'
import { migrateBodyMarkup } from '../lib/mirrorMarkup'
import useInternalRouteNavigation from '../lib/useInternalRouteNavigation'

const PODENERGY_PAGE_CLASSES = 'path-frontpage page-node-type-page d-flex flex-column'

function normalizeText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function dedupeLayoutRangeBySectionClasses(layouts, startClassName, endClassName) {
  const startIndexes = []
  const endIndexes = []

  layouts.forEach((layout, index) => {
    if (layout.querySelector(`.${startClassName}`)) {
      startIndexes.push(index)
    }
    if (layout.querySelector(`.${endClassName}`)) {
      endIndexes.push(index)
    }
  })

  if (startIndexes.length < 2 || endIndexes.length < 2) {
    return layouts
  }

  const firstStart = startIndexes[0]
  const firstEnd = endIndexes.find((index) => index >= firstStart)
  const secondStart = startIndexes.find((index) => index > firstEnd)
  const secondEnd = endIndexes.find((index) => index >= secondStart)

  if ([firstEnd, secondStart, secondEnd].some((value) => value === undefined)) {
    return layouts
  }

  const firstLayouts = layouts.slice(firstStart, firstEnd + 1)
  const secondLayouts = layouts.slice(secondStart, secondEnd + 1)
  const firstSlice = firstLayouts.map((layout) => layout.outerHTML).join('')
  const secondSlice = secondLayouts.map((layout) => layout.outerHTML).join('')
  const firstTextSignature = firstLayouts.map((layout) => normalizeText(layout.textContent || '')).join('|')
  const secondTextSignature = secondLayouts.map((layout) => normalizeText(layout.textContent || '')).join('|')

  if (firstSlice !== secondSlice && firstTextSignature !== secondTextSignature) {
    return layouts
  }

  return layouts.filter((_, index) => index < secondStart || index > secondEnd)
}

function splitHomeBlocks(markup) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${markup}</body>`, 'text/html')
  const body = doc.body
  const root = body.querySelector('.dialog-off-canvas-main-canvas')

  if (!root) {
    return {
      preRoot: markup,
      rootClassName: 'dialog-off-canvas-main-canvas d-flex flex-column h-100',
      navbar: '',
      hero: '',
      sections: '',
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

  const header = root.querySelector('header')
  const footer = root.querySelector('footer')
  const layoutContainer = root.querySelector('.node__content')
  const layouts = layoutContainer
    ? Array.from(layoutContainer.children).filter((element) => {
        return element.matches?.('.layout.layout--onecol')
      })
    : Array.from(root.querySelectorAll('.layout.layout--onecol'))
  const uniqueLayouts = layouts.filter((layout, index, allLayouts) => {
    return allLayouts.findIndex((candidate) => candidate.outerHTML === layout.outerHTML) === index
  })
  const dedupedLayouts = dedupeLayoutRangeBySectionClasses(uniqueLayouts, 'benefits-vertical', 'cta-banner')

  return {
    preRoot: preRootContainer.innerHTML,
    rootClassName: root.className,
    navbar: header ? header.outerHTML : '',
    hero: dedupedLayouts[0] ? dedupedLayouts[0].outerHTML : '',
    sections: dedupedLayouts.slice(1).map((layout) => layout.outerHTML).join(''),
    footer: footer ? footer.outerHTML : '',
  }
}

export default function Home() {
  useInternalRouteNavigation()

  const migratedData = useMemo(() => {
    const migrated = migrateBodyMarkup(homeBodyRaw, 'index.html')
    return {
      markup: migrated.html,
      blocks: splitHomeBlocks(migrated.html),
    }
  }, [])

  const migratedMarkup = migratedData.markup
  const blocks = migratedData.blocks

  useLayoutEffect(() => {
    const htmlElement = document.documentElement
    const bodyElement = document.body
    const previousHtmlClassName = htmlElement.className
    const previousBodyClassName = bodyElement.className

    htmlElement.className = PODENERGY_PAGE_CLASSES
    bodyElement.className = PODENERGY_PAGE_CLASSES

    return () => {
      htmlElement.className = previousHtmlClassName
      bodyElement.className = previousBodyClassName
    }
  }, [])

  useEffect(() => {
    const $ = window.jQuery || window.$

    const initSwiper = (selector, options) => {
      const Swiper = window.Swiper
      const elements = Array.from(document.querySelectorAll(selector))

      if (typeof Swiper !== 'function' || !elements.length) {
        return
      }

      elements.forEach((element) => {
        if (element.swiper && typeof element.swiper.destroy === 'function') {
          element.swiper.destroy(true, true)
        }

        element.swiper = new Swiper(element, options)
      })
    }

    if ($ && typeof $.fn?.owlCarousel === 'function') {
      const initOwl = (selector, options) => {
        const $elements = $(selector)

        if (!$elements.length) {
          return
        }

        $elements.each(function () {
          const $carousel = $(this)

          if ($carousel.hasClass('owl-loaded')) {
            return
          }

          $carousel.owlCarousel(options)
        })
      }

      initOwl('.brands-slider', {
        loop: true,
        margin: 25,
        autoplay: true,
        dots: false,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        responsive: {
          0: { items: 3 },
          600: { items: 5 },
          1000: { items: 7 },
          1300: { items: 6 },
        },
      })

      initOwl('.brands-inner-slider', {
        loop: true,
        margin: 25,
        autoplay: true,
        dots: false,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        responsive: {
          0: { items: 3 },
          500: { items: 4 },
          767: { items: 6 },
          1000: { items: 9 },
          1300: { items: 11 },
        },
      })
    }

    initSwiper('.swiper-top', {
      slidesPerView: 'auto',
      loop: true,
      speed: 10000,
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
      },
      freeMode: true,
      freeModeMomentum: false,
      grabCursor: false,
      allowTouchMove: false,
      spaceBetween: 0,
      breakpoints: {
        320: { slidesPerView: 4 },
        640: { slidesPerView: 5 },
        1024: { slidesPerView: 6 },
        1200: { slidesPerView: 7 },
      },
    })

    initSwiper('.swiper-bottom', {
      slidesPerView: 'auto',
      loop: true,
      speed: 10000,
      autoplay: {
        delay: 1,
        reverseDirection: true,
        disableOnInteraction: false,
      },
      freeMode: true,
      freeModeMomentum: false,
      grabCursor: false,
      allowTouchMove: false,
      spaceBetween: 0,
      breakpoints: {
        320: { slidesPerView: 4 },
        640: { slidesPerView: 5 },
        1024: { slidesPerView: 6 },
        1200: { slidesPerView: 7 },
      },
    })

    const getModalElements = (device) => {
      if (device) {
        return {
          modal: document.querySelector(`.video-modal-${device}`),
          iframe: document.getElementById(`video-iframe-${device}`),
          video: document.getElementById(`video-player-${device}`),
        }
      }

      return {
        modal: document.getElementById('video-modal'),
        iframe: document.getElementById('video-iframe'),
        video: document.getElementById('video-player'),
      }
    }

    const openVideoModal = (type, embedUrl, videoSrc, device) => {
      const { modal, iframe, video } = getModalElements(device)
      if (!modal || !iframe || !video) {
        return
      }

      if (type === 'remote' && embedUrl) {
        const autoplayParam = embedUrl.includes('?') ? '&autoplay=1' : '?autoplay=1'
        iframe.src = `${embedUrl}${autoplayParam}`
        iframe.style.display = 'block'
        video.style.display = 'none'
      } else if (type === 'local' && videoSrc) {
        video.src = videoSrc
        video.load()
        video.addEventListener(
          'loadedmetadata',
          function playVideo() {
            video.play().catch(() => {})
            video.removeEventListener('loadedmetadata', playVideo)
          },
          { once: true },
        )
        video.style.display = 'block'
        iframe.style.display = 'none'
      }

      modal.style.display = 'flex'
    }

    const closeVideoModal = (device) => {
      const { modal, iframe, video } = getModalElements(device)
      if (!modal || !iframe || !video) {
        return
      }

      modal.style.display = 'none'
      iframe.src = ''
      video.pause()
      video.removeAttribute('src')
      video.load()
    }

    const watchVideoButtons = Array.from(document.querySelectorAll('.watch-video-btn'))
    const playButtons = Array.from(document.querySelectorAll('.play-button1'))

    const onWatchVideoClick = (event) => {
      event.preventDefault()
      const { videoType, embedUrl, videoSrc } = event.currentTarget.dataset
      openVideoModal(videoType, embedUrl, videoSrc, 'desktop')
    }

    const onPlayButtonClick = (event) => {
      event.preventDefault()
      event.stopPropagation()
      const { videoType, embedUrl, videoSrc } = event.currentTarget.dataset

      if (videoType && (embedUrl || videoSrc)) {
        openVideoModal(videoType, embedUrl, videoSrc)
      }
    }

    const onWindowClick = (event) => {
      if (event.target.classList.contains('video-modal-desktop')) {
        closeVideoModal('desktop')
      }

      const genericModal = document.getElementById('video-modal')
      if (genericModal && event.target === genericModal) {
        closeVideoModal()
      }
    }

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        closeVideoModal('desktop')
        closeVideoModal()
      }
    }

    watchVideoButtons.forEach((button) => {
      button.addEventListener('click', onWatchVideoClick)
    })

    playButtons.forEach((button) => {
      button.addEventListener('click', onPlayButtonClick)
    })

    window.addEventListener('click', onWindowClick)
    document.addEventListener('keydown', onEscape)

    window.openVideoModal = openVideoModal
    window.closeVideoModal = closeVideoModal

    return () => {
      watchVideoButtons.forEach((button) => {
        button.removeEventListener('click', onWatchVideoClick)
      })

      playButtons.forEach((button) => {
        button.removeEventListener('click', onPlayButtonClick)
      })

      window.removeEventListener('click', onWindowClick)
      document.removeEventListener('keydown', onEscape)

      delete window.openVideoModal
      delete window.closeVideoModal
    }
  }, [migratedMarkup])

  return (
    <>
      <HtmlBlock html={blocks.preRoot} />
      <div className={blocks.rootClassName} data-off-canvas-main-canvas>
        <Navbar html={blocks.navbar} />
        <Hero html={blocks.hero} />
        <Sections html={blocks.sections} />
        <Footer html={blocks.footer} />
      </div>
    </>
  )
}
