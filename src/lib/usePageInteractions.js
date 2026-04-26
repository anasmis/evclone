import { useEffect } from 'react'

export default function usePageInteractions(dependency) {
  useEffect(() => {
    if (typeof window.__podLegacyInit === 'function') {
      window.__podLegacyInit()
    }

    const $ = window.jQuery || window.$
    const cleanupCallbacks = []
    const REVEAL_DURATION_MS = 1800

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
      autoplay: { delay: 1, disableOnInteraction: false },
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
      autoplay: { delay: 1, reverseDirection: true, disableOnInteraction: false },
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
      if (event.target.classList?.contains('video-modal-desktop')) {
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

    watchVideoButtons.forEach((button) => button.addEventListener('click', onWatchVideoClick))
    playButtons.forEach((button) => button.addEventListener('click', onPlayButtonClick))
    window.addEventListener('click', onWindowClick)
    document.addEventListener('keydown', onEscape)

    window.openVideoModal = openVideoModal
    window.closeVideoModal = closeVideoModal

    const animateAccordionPanel = (panel, shouldOpen) => {
      if (!panel) {
        return
      }

      if ($ && typeof $.fn?.slideDown === 'function') {
        const $panel = $(panel)
        $panel.stop(true, true)

        if (shouldOpen) {
          $panel.slideDown(REVEAL_DURATION_MS)
        } else {
          $panel.slideUp(REVEAL_DURATION_MS)
        }

        return
      }

      panel.style.display = shouldOpen ? 'block' : 'none'
    }

    const setExclusiveAccordionState = (items, activeItem, contentSelector) => {
      items.forEach((item) => {
        const panel = item.querySelector(contentSelector)
        const isActive = item === activeItem

        item.classList.toggle('active', isActive)
        animateAccordionPanel(panel, isActive)
      })
    }

    const initScrollRevealAccordion = ({
      itemSelector,
      contentSelector,
      groupResolver,
      minIntersection = 0.6,
    }) => {
      const observedItems = Array.from(document.querySelectorAll(itemSelector))
      if (!observedItems.length) {
        return
      }

      const activeByGroup = new WeakMap()
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || entry.intersectionRatio < minIntersection) {
              return
            }

            const item = entry.target
            const groupRoot = groupResolver(item)
            if (!groupRoot) {
              return
            }

            const allGroupItems = Array.from(groupRoot.querySelectorAll(itemSelector))
            if (!allGroupItems.length || activeByGroup.get(groupRoot) === item) {
              return
            }

            setExclusiveAccordionState(allGroupItems, item, contentSelector)
            activeByGroup.set(groupRoot, item)
          })
        },
        {
          threshold: [0.35, minIntersection, 0.85],
          rootMargin: '0px 0px -10% 0px',
        },
      )

      observedItems.forEach((item) => observer.observe(item))
      cleanupCallbacks.push(() => observer.disconnect())
    }

    initScrollRevealAccordion({
      itemSelector: '.oip_step',
      contentSelector: '.step_content_dec',
      groupResolver: (item) => item.closest('.oip_steps'),
      minIntersection: 0.55,
    })

    initScrollRevealAccordion({
      itemSelector: '.accordion-wrapper .common_accordion',
      contentSelector: '.common_accordion_dec',
      groupResolver: (item) => item.closest('.accordion-wrapper'),
      minIntersection: 0.65,
    })

    const getAccordionTarget = (eventTarget) => {
      const oipItem = eventTarget.closest('.oip_step')
      if (oipItem) {
        return {
          activeItem: oipItem,
          groupRoot: oipItem.closest('.oip_steps'),
          itemSelector: '.oip_step',
          contentSelector: '.step_content_dec',
        }
      }

      const commonItem = eventTarget.closest('.accordion-wrapper .common_accordion')
      if (commonItem) {
        return {
          activeItem: commonItem,
          groupRoot: commonItem.closest('.accordion-wrapper'),
          itemSelector: '.common_accordion',
          contentSelector: '.common_accordion_dec',
        }
      }

      return null
    }

    const onAccordionTextClick = (event) => {
      const interactiveChild = event.target.closest('a, input, select, textarea')
      if (interactiveChild) {
        return
      }

      const target = getAccordionTarget(event.target)
      if (!target?.groupRoot) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const items = Array.from(target.groupRoot.querySelectorAll(target.itemSelector))
      if (!items.length) {
        return
      }

      setExclusiveAccordionState(items, target.activeItem, target.contentSelector)
    }

    // Capture phase ensures text clicks always reveal the related block consistently.
    document.addEventListener('click', onAccordionTextClick, true)
    cleanupCallbacks.push(() => document.removeEventListener('click', onAccordionTextClick, true))

    return () => {
      watchVideoButtons.forEach((button) => button.removeEventListener('click', onWatchVideoClick))
      playButtons.forEach((button) => button.removeEventListener('click', onPlayButtonClick))
      window.removeEventListener('click', onWindowClick)
      document.removeEventListener('keydown', onEscape)
      cleanupCallbacks.forEach((cleanup) => cleanup())

      delete window.openVideoModal
      delete window.closeVideoModal
    }
  }, [dependency])
}
