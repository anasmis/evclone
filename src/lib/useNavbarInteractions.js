import { useEffect } from 'react'

function hasJqueryClickHandler(element) {
  const jq = window.jQuery || window.$

  if (!element || !jq || typeof jq._data !== 'function') {
    return false
  }

  const events = jq._data(element, 'events')
  return Boolean(events?.click?.length)
}

function closeMobileSubmenus(mobileMenu) {
  const navItems = Array.from(mobileMenu.querySelectorAll('li.nav-item.open-sidebar'))
  const navLists = Array.from(mobileMenu.querySelectorAll('.navbar-nav.sidebar-open'))
  const backButtons = Array.from(mobileMenu.querySelectorAll('.mobile-back-btn'))

  navItems.forEach((item) => item.classList.remove('open-sidebar'))
  navLists.forEach((list) => list.classList.remove('sidebar-open'))
  backButtons.forEach((button) => {
    button.style.display = 'none'
  })
}

export default function useNavbarInteractions(dependency) {
  useEffect(() => {
    const body = document.body
    const navbarRoot = document.getElementById('mobile-menu-main')
    const menuToggle = document.getElementById('menu-toggle')
    const menuClose = document.getElementById('menu-close')
    const mobileMenu = document.getElementById('mobile-menu')
    const desktopNavItems = Array.from(document.querySelectorAll('.header-section #navbarSupportedContent li.nav-item'))

    const hasLegacyMenuToggleHandlers = hasJqueryClickHandler(menuToggle) || hasJqueryClickHandler(menuClose)
    const firstMobileDropdown = mobileMenu?.querySelector('.nav-link.dropdown-toggle')
    const hasLegacyMobileDropdownHandlers = hasJqueryClickHandler(firstMobileDropdown)

    const cleanupFns = []

    if (!hasLegacyMenuToggleHandlers && navbarRoot && menuToggle && menuClose) {
      const onOpen = () => {
        navbarRoot.classList.add('open')
        body.classList.add('overflow-hidden')
      }

      const onClose = () => {
        navbarRoot.classList.remove('open')
        body.classList.remove('overflow-hidden')
      }

      menuToggle.addEventListener('click', onOpen)
      menuClose.addEventListener('click', onClose)

      cleanupFns.push(() => {
        menuToggle.removeEventListener('click', onOpen)
        menuClose.removeEventListener('click', onClose)
      })
    }

    desktopNavItems.forEach((item) => {
      const onEnter = () => {
        item.classList.add('megamenu-open')
        body.classList.add('megamenu-active')
      }

      const onLeave = () => {
        item.classList.remove('megamenu-open')
        const stillOpen = document.querySelector('.header-section #navbarSupportedContent li.nav-item.megamenu-open')

        if (!stillOpen) {
          body.classList.remove('megamenu-active')
        }
      }

      item.addEventListener('mouseenter', onEnter)
      item.addEventListener('mouseleave', onLeave)

      cleanupFns.push(() => {
        item.removeEventListener('mouseenter', onEnter)
        item.removeEventListener('mouseleave', onLeave)
      })
    })

    if (!hasLegacyMobileDropdownHandlers && mobileMenu) {
      let teardownMobileBindings = () => {}

      const bindMobileHandlers = () => {
        teardownMobileBindings()

        const dropdownToggles = Array.from(mobileMenu.querySelectorAll('.nav-link.dropdown-toggle'))
        const backButtons = Array.from(mobileMenu.querySelectorAll('.mobile-back-btn'))
        const localCleanups = []

        if (window.matchMedia('(max-width: 768px)').matches) {
          dropdownToggles.forEach((toggle) => {
            const onClick = (event) => {
              event.preventDefault()
              const navItem = toggle.closest('li.nav-item')
              const wasOpen = navItem?.classList.contains('open-sidebar')

              closeMobileSubmenus(mobileMenu)

              if (!wasOpen && navItem) {
                navItem.classList.add('open-sidebar')
                const navLists = Array.from(mobileMenu.querySelectorAll('.navbar-nav'))
                navLists.forEach((list) => list.classList.add('sidebar-open'))
                backButtons.forEach((button) => {
                  button.style.display = 'block'
                })
              }
            }

            toggle.addEventListener('click', onClick)
            localCleanups.push(() => {
              toggle.removeEventListener('click', onClick)
            })
          })

          backButtons.forEach((button) => {
            const onBack = () => {
              closeMobileSubmenus(mobileMenu)
            }

            button.addEventListener('click', onBack)
            localCleanups.push(() => {
              button.removeEventListener('click', onBack)
            })
          })
        } else {
          closeMobileSubmenus(mobileMenu)

          dropdownToggles.forEach((toggle) => {
            const onClick = () => {
              const isActive = toggle.classList.contains('active')

              dropdownToggles.forEach((otherToggle) => {
                otherToggle.classList.remove('active')
                const otherMenu = otherToggle.nextElementSibling
                if (otherMenu && otherMenu.classList.contains('megamenu')) {
                  otherMenu.style.display = 'none'
                }
              })

              const menu = toggle.nextElementSibling
              if (isActive) {
                toggle.classList.remove('active')
                if (menu && menu.classList.contains('megamenu')) {
                  menu.style.display = 'none'
                }
              } else {
                toggle.classList.add('active')
                if (menu && menu.classList.contains('megamenu')) {
                  menu.style.display = 'block'
                }
              }
            }

            toggle.addEventListener('click', onClick)
            localCleanups.push(() => {
              toggle.removeEventListener('click', onClick)
            })
          })
        }

        teardownMobileBindings = () => {
          localCleanups.forEach((cleanup) => cleanup())
        }
      }

      bindMobileHandlers()

      let resizeTimer = null
      const onResize = () => {
        if (resizeTimer) {
          clearTimeout(resizeTimer)
        }

        resizeTimer = setTimeout(() => {
          bindMobileHandlers()
        }, 150)
      }

      window.addEventListener('resize', onResize)
      cleanupFns.push(() => {
        window.removeEventListener('resize', onResize)
        if (resizeTimer) {
          clearTimeout(resizeTimer)
        }
        teardownMobileBindings()
      })
    }

    const headerWrapper = document.querySelector('.evplug-navbar-portal')
    if (headerWrapper) {
      const onScroll = () => {
        headerWrapper.classList.toggle('nav-scrolled', window.scrollY > 10)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      cleanupFns.push(() => window.removeEventListener('scroll', onScroll))

      const updateNavHeight = () => {
        const h = headerWrapper.offsetHeight
        if (h > 0) {
          document.documentElement.style.setProperty('--evplug-nav-h', `${h}px`)
        }
      }
      updateNavHeight()
      const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(updateNavHeight) : null
      ro?.observe(headerWrapper)
      window.addEventListener('resize', updateNavHeight)
      cleanupFns.push(() => {
        ro?.disconnect()
        window.removeEventListener('resize', updateNavHeight)
      })
    }

    return () => {
      cleanupFns.forEach((cleanup) => {
        cleanup()
      })

      body.classList.remove('megamenu-active')
    }
  }, [dependency])
}