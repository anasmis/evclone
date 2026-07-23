import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let gsapRegistered = false

function initializeAos() {
  if (typeof window === 'undefined') {
    return
  }

  if (!window.AOS) {
    window.AOS = AOS
  }

  AOS.init({
    easing: 'ease-out-back',
    duration: 1000,
    once: false,
  })

  setTimeout(() => {
    AOS.refreshHard()
  }, 0)
}

function initializeGsapPinning() {
  if (typeof window === 'undefined') {
    return
  }

  if (!gsapRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    gsapRegistered = true
  }

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

  const verticalSection = document.querySelector('.vertical-carousel-section')
  if (verticalSection) {
    ScrollTrigger.create({
      trigger: verticalSection,
      start: 'top top',
      end: 'bottom bottom',
      pin: true,
      pinSpacing: false,
    })
  }
}

export default function useAnimationHandling() {
  const location = useLocation()

  useEffect(() => {
    initializeAos()
    initializeGsapPinning()

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [location.pathname])
}
