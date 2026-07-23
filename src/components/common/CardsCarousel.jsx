import { useCallback, useEffect, useRef, useState } from 'react'

// Multi-item horizontal slider. Children render one slide each. Drag/scroll to navigate
// or use the prev/next arrows + dot indicators below.
export default function CardsCarousel({
  children,
  ariaLabel = 'Carousel',
  slideClassName = 'w-full',
  autoPlay = false,
  interval = 5000,
}) {
  const scrollerRef = useRef(null)
  const [active, setActive] = useState(0)
  const pausedRef = useRef(false)
  const resumeTimerRef = useRef(null)
  const slides = Array.isArray(children) ? children : [children]

  const getSlideWidth = () => scrollerRef.current?.firstElementChild?.getBoundingClientRect().width || 1

  const goTo = useCallback((idx) => {
    const el = scrollerRef.current
    if (!el) return
    const slideWidth = getSlideWidth()
    el.scrollTo({ left: slideWidth * idx, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return undefined
    const onScroll = () => {
      const slideWidth = getSlideWidth()
      const idx = Math.round(el.scrollLeft / slideWidth)
      setActive(Math.min(slides.length - 1, Math.max(0, idx)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [slides.length])

  const pause = useCallback((resumeAfter = 0) => {
    pausedRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    if (resumeAfter > 0) {
      resumeTimerRef.current = setTimeout(() => {
        pausedRef.current = false
      }, resumeAfter)
    }
  }, [])

  const resume = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    pausedRef.current = false
  }, [])

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return undefined
    const id = setInterval(() => {
      if (pausedRef.current) return
      const el = scrollerRef.current
      if (!el) return
      const slideWidth = getSlideWidth()
      const maxScroll = el.scrollWidth - el.clientWidth - 1
      const next = el.scrollLeft >= maxScroll ? 0 : Math.round(el.scrollLeft / slideWidth) + 1
      el.scrollTo({ left: slideWidth * next, behavior: 'smooth' })
    }, interval)
    return () => {
      clearInterval(id)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [autoPlay, interval, slides.length])

  return (
    <div
      className="cards-carousel relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={autoPlay ? () => pause() : undefined}
      onMouseLeave={autoPlay ? resume : undefined}
      onFocus={autoPlay ? () => pause() : undefined}
      onBlur={autoPlay ? resume : undefined}
    >
      <div
        ref={scrollerRef}
        className="cards-carousel-scroller flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-spacing-4xl"
        style={{ scrollbarWidth: 'none' }}
        onPointerDown={autoPlay ? () => pause(4000) : undefined}
        onTouchStart={autoPlay ? () => pause(4000) : undefined}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`snap-start shrink-0 ${slideClassName}`}
            aria-roledescription="slide"
            aria-label={`${idx + 1} sur ${slides.length}`}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-spacing-md mt-spacing-3xl">
        <button
          type="button"
          onClick={() => { if (autoPlay) pause(6000); goTo(Math.max(0, active - 1)) }}
          aria-label="Précédent"
          disabled={active === 0}
          className="cards-carousel-arrow w-10 h-10 rounded-full border border-blue-dianne/20 bg-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface transition"
        >
          <i className="fa-solid fa-angle-left" />
        </button>
        <div className="flex gap-2 mx-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { if (autoPlay) pause(6000); goTo(idx) }}
              aria-label={`Aller au slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                idx === active ? 'w-6 bg-blue-dianne' : 'w-2 bg-blue-dianne/30 hover:bg-blue-dianne/60'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => { if (autoPlay) pause(6000); goTo(Math.min(slides.length - 1, active + 1)) }}
          aria-label="Suivant"
          disabled={active === slides.length - 1}
          className="cards-carousel-arrow w-10 h-10 rounded-full border border-blue-dianne/20 bg-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface transition"
        >
          <i className="fa-solid fa-angle-right" />
        </button>
      </div>

      <style>{`
        .cards-carousel-scroller::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
