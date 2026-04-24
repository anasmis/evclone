"use strict";
// jQuery 4 removed $.camelCase, but Owl Carousel still relies on it.
// Provide a lightweight polyfill to keep the plugin working in modern setups.
if (typeof window !== 'undefined' && window.jQuery) {
    const jQuery = window.jQuery;

    if (typeof jQuery.camelCase !== 'function') {
        jQuery.camelCase = (string) => {
            if (typeof string !== 'string') {
                return string;
            }

            return string
                .replace(/^-ms-/, 'ms-')
                .replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase());
        };
    }

    if (typeof jQuery.type !== 'function') {
        const class2type = {};
        const toString = class2type.toString;
        const types = 'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ');

        types.forEach((name) => {
            class2type[`[object ${name}]`] = name.toLowerCase();
        });

        jQuery.type = (obj) => {
            if (obj == null) {
                return obj + '';
            }

            return typeof obj === 'object' || typeof obj === 'function'
                ? class2type[toString.call(obj)] || 'object'
                : typeof obj;
        };
    }
}
var $owl = jQuery.noConflict();
var $ = $owl;
$owl(document).ready(() => {
    // Reusable Owl Carousel initialization
    const initOwlCarousel = ($elements, options) => {
        if (!$elements.length) {
            return;
        }

        $elements.each(function () {
            const $carousel = $owl(this);

            if ($carousel.hasClass('owl-loaded')) {
                return;
            }

            $carousel.owlCarousel(options);
        });
    };

    // Banner Slider
    const $bannerSlider = $owl('.banner-slider');
    initOwlCarousel($bannerSlider, {
        items: 1,
        loop: true,
        margin: 0,
        autoplay: true,
        nav: true,
        dots: false,
        autoplayTimeout: 6000,
        smartSpeed: 2000,
        navText: ["<i class='fa fa-chevron-left fa-3x'></i>", "<i class='fa fa-chevron-right fa-3x'></i>"]
    });

    // Pause/resume autoplay on nav click
    const $owlNav = $owl('.owl-nav');
    $owlNav.on('click', () => {
        if ($bannerSlider.length) {
            $bannerSlider.trigger('stop.owl.autoplay');
            setTimeout(() => $bannerSlider.trigger('play.owl.autoplay'), 100);
        }
    });

    // Announcement bar dismiss (per page session)
    const $announcementBars = $owl('[data-announcement-bar]');

    if ($announcementBars.length) {
        $announcementBars.each(function () {
            const $bar = $owl(this);
            const storageKey = $bar.data('announcement-key');

            if (!storageKey) {
                return;
            }

            try {
                if (sessionStorage.getItem(storageKey) === '1') {
                    $bar.addClass('hidden');
                }
            } catch (error) {
                // Ignore storage errors.
            }
        });

        $announcementBars.on('click', '[data-announcement-close]', (event) => {
            event.preventDefault();
            const $bar = $owl(event.currentTarget).closest('[data-announcement-bar]');
            const storageKey = $bar.data('announcement-key');
            $bar.addClass('hidden');
            document.documentElement.classList.add('announcement-bar-disable');
            if (!storageKey) {
                return;
            }
            try {
                sessionStorage.setItem(storageKey, '1');
            } catch (error) {
                // Ignore storage errors.
            }
        });
    }

    // Menu Toggle
    const $body = $owl('body');
    $owl('button.menu-toggle').on('click', () => {
        $body.toggleClass('menu-sidebar-open');
    });

    // Animation scroll
    AOS.init({
		easing: 'ease-out-back',
		duration: 1000
	});
    
    // Testimonial Slider
    initOwlCarousel($owl('.testimonial-slider'), {
        loop: true,
        margin: 25,
        items: 1,
        autoplay: true,
        dots: true
    });

    // Brands Slider
    initOwlCarousel($owl('.brands-slider'), {
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
            1300: { items: 6 }
        }
    });

    // Brands Inner Slider
    initOwlCarousel($owl('.brands-inner-slider'), {
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
            1300: { items: 11 }
        }
    });

    // Category Slider
    initOwlCarousel($owl('.category-slider'), {
        loop: true,
        margin: 15,
        autoplay: true,
        autoWidth: true,
        dots: false,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        responsive: {
            0: { items: 3 },
            500: { items: 4 },
            767: { items: 6 },
            1000: { items: 9 },
            1300: { items: 11 }
        }
    });

    // Case Study Slider
    initOwlCarousel($owl('.caseStudy_slider'), {
        loop: false,
        margin: 5,
        items: 1,
        dots: true,
        nav: true,
        autoHeight: true,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ]
    });

    // logo-strip for mobile
    initOwlCarousel($owl('.logo-strip-mobile'), {
        loop: true,
        margin: 30,
        autoplay: true,
        dots: false,
        items: 2,
        center: true,
        stagePadding: 50,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        responsive: {
            0: { items: 4 },
            480: { items: 4 },
            767: { items: 4 }
        }
    });

    // logo-strip for mobile
    initOwlCarousel($owl('.logo-strip-mobile-solution'), {
        loop: true,
        margin: 70,
        autoplay: true,
        dots: false,
        items: 2,
        center: true,
        stagePadding: 50,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        responsive: {
            0: { items: 2 },
            480: { items: 3 },
            767: { items: 4 }
        }
    });

    // usp-section for mobile
    initOwlCarousel($owl('.usp-section-mobile'), {
        loop: true,
        margin: 30,
        autoplay: true,
        dots: true,
        nav: true,
        items: 1,
        center: false,
        stagePadding: 50,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ]
    });

    // benefit-vertical-mobile for mobile
    initOwlCarousel($owl('.benefit-vertical-mobile'), {
        loop: true,
        margin: 30,
        autoplay: true,
        dots: true,
        nav: true,
        items: 1,
        center: false,
        stagePadding: 70,
        autoplayTimeout: 4000,
        smartSpeed: 1000,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ]
    });

    // vertical-carousel-mobile for mobile
    initOwlCarousel($owl('.vertical-carousel-mobile'), {
        loop: true,
        autoplay: false,
        dots: true,
        nav: true,
        items: 1,
        autoplayTimeout: 6000,
        smartSpeed: 2000,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ]
    });

    // how-it-work-mobile for mobile
    initOwlCarousel($owl('.how-it-work-mobile'), {
        loop: true,
        margin: 30,
        autoplay: false,
        dots: true,
        nav: true,
        items: 1,
        center: false,
        stagePadding: 50,
        autoplayTimeout: 6000,
        smartSpeed: 2000,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ],
        responsive: {
            0: { items: 1 },
            768: { items: 2, stagePadding: 100, nav: false },
            1200: { items: 3, nav: false }
        },
    });

    // comparison-tariff-mobile-carousel for mobile
    initOwlCarousel($owl('.comparison-tariff-mobile-carousel'), {
        loop: false,
        margin: 30,
        autoplay: false,
        dots: true,
        nav: true,
        items: 1,
        center: false,
        stagePadding: 50,
        autoplayTimeout: 6000,
        smartSpeed: 2000,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ],
        responsive: {
            0: { items: 1, stagePadding: 59},
            768: { items: 2, stagePadding: 100, nav: false },
            1200: { items: 3, nav: false }
        },
    });

    // comparison-tariff-mobile-carousel for mobile
    initOwlCarousel($owl('.psl-tab-carousel'), {
        loop: true,
        margin: 30,
        autoplay: false,
        dots: true,
        nav: true,
        items: 1,
        center: false,
        stagePadding: 50,
        autoplayTimeout: 6000,
        smartSpeed: 2000,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ],
        responsive: {
            0: { items: 1},
            768: { items: 2, stagePadding: 100, nav: false },
            1200: { items: 3, nav: false }
        },
    });

    // content-cards-mobile for mobile
    initOwlCarousel($owl('.content-cards-mobile'), {
        loop: true,
        margin: 30,
        autoplay: false,
        dots: true,
        nav: true,
        items: 1,
        center: false,
        stagePadding: 50,
        autoplayTimeout: 6000,
        smartSpeed: 2000,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ],
        responsive: {
            0: { items: 1 },
            768: { items: 2, stagePadding: 100, nav: false },
            1200: { items: 3, nav: false }
        },
    });

    // product-cards-mobile for mobile
    initOwlCarousel($owl('.product-cards-mobile'), {
        loop: true,
        margin: 30,
        autoplay: false,
        dots: true,
        nav: true,
        items: 1,
        center: false,
        stagePadding: 50,
        autoplayTimeout: 6000,
        smartSpeed: 2000,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ],
        responsive: {
            0: { items: 1 },
            768: { items: 2, stagePadding: 100, nav: false },
            1200: { items: 3, nav: false }
        },
    });

    initOwlCarousel($owl('.audi_slider'), {
        items: 1,
        loop: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ],
    });

    const owl = initOwlCarousel($owl('.horizontal_slider'), {
        loop: true,
        center: true,
        margin: 30,
        autoplay: false,
        autoWidth: true,
        nav: false,
        dots: true,
        smartSpeed: 600,
        responsive: {
            0: {
                items: 1,
                margin: 20,
                loop: false,
                autoWidth: false,
                stagePadding: 16
            },
            768: {
                items: 1,
                loop: false,
                autoWidth: false,
                stagePadding: 125
            },
            1280: {
                items: 4
            }
        }
    });

    jQuery('.customer-stories-next').click(function () {
        jQuery('.horizontal_slider.owl-carousel').trigger('next.owl.carousel');
    });

    jQuery('.customer-stories-prev').click(function () {
        jQuery('.horizontal_slider.owl-carousel').trigger('prev.owl.carousel');
    });


    // Tooltip Block
    const $tooltipBtn = $owl('.tooltip-btn');
    const $tooltipBox = $owl('.tooltip-box');
    const $closeTooltip = $owl('.close-tooltip');

    $tooltipBtn.on('click', (e) => {
        e.stopPropagation();
        $tooltipBox.addClass('hidden');
        $owl(e.currentTarget).siblings('.tooltip-box').removeClass('hidden').addClass('block');
    });

    $closeTooltip.on('click', (e) => {
        e.stopPropagation();
        $owl(e.currentTarget).closest('.tooltip-box').addClass('hidden');
    });

    $owl(document).on('click', () => $tooltipBox.addClass('hidden'));

    // Toggle 'meganmenu open' class on nav-item hover
    $owl('.header-section #navbarSupportedContent li.nav-item').hover(
        function () {
            $owl(this).addClass('megamenu-open');
            $owl('body').addClass('megamenu-active');
        },
        function () {
            $owl(this).removeClass('megamenu-open');
            // Check if any nav-item is still open
            if ($owl('.header-section #navbarSupportedContent li.nav-item.megamenu-open').length === 0) {
                $owl('body').removeClass('megamenu-active');
            }
        }
    );


    $owl(".at-title").click(function () {
        $owl(".at-title").not(this).removeClass("active").next(".at-tab").slideUp();
        $owl(this).toggleClass("active").next(".at-tab").slideToggle();
    });


    // Mobile menu logic considering iPad (min-width: 769px) and Mobile (max-width: 768px) screens
    function initMobileMenuHandlers() {
        // Clean up any previous handlers to avoid stacking
        $owl("#mobile-menu .nav-link.dropdown-toggle").off("click.mobileMenu");
        $owl("#mobile-menu .mobile-back-btn").off("click.mobileMenu");

        if (window.matchMedia("(min-width: 769px)").matches) {
            // iPad and up: Only toggle dropdown in mobile menu
            $owl("#mobile-menu .nav-link.dropdown-toggle").on("click.mobileMenu", function () {
                $owl("#mobile-menu .nav-link.dropdown-toggle")
                    .not(this)
                    .removeClass("active")
                    .next(".megamenu")
                    .slideUp();

                $owl(this)
                    .toggleClass("active")
                    .next(".megamenu")
                    .slideToggle();
            });
        } else if (window.matchMedia("(max-width: 768px)").matches) {
            // Mobile: Sidebar logic with "back" button
            $owl("#mobile-menu .nav-link.dropdown-toggle").on("click.mobileMenu", function (e) {
                e.preventDefault();

                const navItem = $owl(this).closest("li.nav-item");
                navItem.toggleClass("open-sidebar");

                const hasOpenSidebar = $owl("#mobile-menu li.nav-item.open-sidebar").length > 0;

                // Toggle class on UL.navbar-nav
                if (hasOpenSidebar) {
                    $owl("#mobile-menu .navbar-nav").addClass("sidebar-open");
                    // Show back button
                    $owl("#mobile-menu .mobile-back-btn").show();
                } else {
                    $owl("#mobile-menu .navbar-nav").removeClass("sidebar-open");
                    // Hide back button
                    $owl("#mobile-menu .mobile-back-btn").hide();
                }
            });

            // BACK BUTTON â€” closes submenu
            $owl("#mobile-menu .mobile-back-btn").on("click.mobileMenu", function () {
                // Close all open dropdowns
                $owl("#mobile-menu li.nav-item").removeClass("open-sidebar");
                $owl("#mobile-menu .navbar-nav").removeClass("sidebar-open");
                // Hide back button
                $owl(this).hide();
            });
        }
    }

    // Initialize on load
    initMobileMenuHandlers();

    // Re-initialize on resize, but debounce to prevent rapid firing
    let resizeTimer;
    window.addEventListener("resize", function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initMobileMenuHandlers, 150);
    });


    function initializeAccordion() {
        $owl('.accordion').each(function () {
            const $accordion = $owl(this);

            // Only run this once per accordion container
            if (!$accordion.data('accordion-initialized')) {
                $accordion.find('.accordion-item.is-active')
                    .children('.accordion-panel')
                    .stop(true, true).slideDown(300); // Smooth initial open
                $accordion.data('accordion-initialized', true);
            }
        });
    }

    // Use event delegation for dynamic content
    $owl(document).on('click', '.accordion .accordion-item', function () {
        const $this = $owl(this);
        const $accordion = $this.closest('.accordion');

        if (!$this.hasClass('is-active')) {
            $accordion.find('.accordion-item.is-active')
                .removeClass('is-active')
                .children('.accordion-panel')
                .stop(true, true).slideUp(300); // Smooth close

            $this.addClass('is-active')
                .children('.accordion-panel')
                .stop(true, true).slideDown(300); // Smooth open
        } else {
            $this.removeClass('is-active')
                .children('.accordion-panel')
                .stop(true, true).slideUp(300); // Smooth toggle close
        }
    });

    // Call this function AFTER appending HTML
    initializeAccordion();


    // Back to Top
    const $backToTop = $owl('#back-to-top');
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    $owl(window).on('scroll', debounce(() => {
        if ($owl(window).scrollTop() > 300) {
            $backToTop.addClass('show');
        } else {
            $backToTop.removeClass('show');
        }
    }, 100));

    $backToTop.on('click', (e) => {
        e.preventDefault();
        $owl('html, body').animate({ scrollTop: 0 }, 300);
    });

    // Mobile Menu
    const $mobileMenu = $owl('#mobile-menu-main');
    $owl('#menu-toggle').on('click', () => $mobileMenu.addClass('open'));
    $owl('#menu-close').on('click', () => $mobileMenu.removeClass('open'));

    // Mobile Menu add class on body
    const $mobileMenuBody = $owl('body.page-node-type-page');
    $owl('#menu-toggle').on('click', () => $mobileMenuBody.addClass('overflow-hidden'));
    $owl('#menu-close').on('click', () => $mobileMenuBody.removeClass('overflow-hidden'));

    // Remove overflow-hidden from body when switching to desktop
    const removeOverflowOnResize = () => {
        if (window.innerWidth >= 1280) { // Adjust 1024 if your desktop breakpoint is different
            $mobileMenuBody.removeClass('overflow-hidden');
        }
    };
    $owl(window).on('resize', removeOverflowOnResize);
    // Also run on initial load in case page is refreshed on desktop
    removeOverflowOnResize();

    // Mobile Menu
    const $filterMenu = $owl('#filter-menu');
    $owl('#filter-toggle').on('click', () => $filterMenu.addClass('open'));
    $owl('#filter-close').on('click', () => $filterMenu.removeClass('open'));

    // Video Toggle
    $owl('.video-toggle').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $wrapper = $owl(this).closest('.video-thumbnail-wrapper');
        const video = $wrapper.find('video')[0];
        const $iconDiv = $owl(this).find('.video-icon');
        const $thumbnail = $wrapper.find('.video-thumbnail');

        if ($thumbnail.is(':visible')) {
            $thumbnail.hide();
            $owl(video).css('display', 'block');
            // Unmute on user interaction so audio plays
            video.muted = false;
            if (typeof video.removeAttribute === 'function') {
                video.removeAttribute('muted');
            }
            video.volume = 1;
            video.play();
            $iconDiv.removeClass('custom-play-icon').addClass('custom-pause-icon');
            $wrapper.addClass('active');
        } else {
            if (video.paused) {
                // Ensure unmuted before playing again
                video.muted = false;
                if (typeof video.removeAttribute === 'function') {
                    video.removeAttribute('muted');
                }
                video.volume = 1;
                video.play();
                $iconDiv.removeClass('custom-play-icon').addClass('custom-pause-icon');
                $wrapper.addClass('active');
            } else {
                video.pause();
                $iconDiv.removeClass('custom-pause-icon').addClass('custom-play-icon');
            }
        }
    });

    // Load Video Function - handles video thumbnail clicks
    window.loadVideo = function (element) {
        const $wrapper = $owl(element);
        const video = $wrapper.find('video')[0];
        const $iconDiv = $wrapper.find('.video-icon');
        const $thumbnail = $wrapper.find('img');

        if ($thumbnail.is(':visible')) {
            $thumbnail.hide();
            $owl(video).css('display', 'block');
            // Unmute on user interaction so audio plays
            video.muted = false;
            if (typeof video.removeAttribute === 'function') {
                video.removeAttribute('muted');
            }
            video.volume = 1;
            video.play();
            $iconDiv.removeClass('custom-play-icon').addClass('custom-pause-icon');
            $wrapper.addClass('active');
        } else {
            if (video.paused) {
                // Ensure unmuted before playing again
                video.muted = false;
                if (typeof video.removeAttribute === 'function') {
                    video.removeAttribute('muted');
                }
                video.volume = 1;
                video.play();
                $iconDiv.removeClass('custom-play-icon').addClass('custom-pause-icon');
                $wrapper.addClass('active');
            } else {
                video.pause();
                $iconDiv.removeClass('custom-pause-icon').addClass('custom-play-icon');
            }
        }
    };

    // header sticky
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header'); // Change 'header' to your actual header selector
        if (window.scrollY > 123) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // horizontal-slider-new
    initOwlCarousel($owl('.horizontal-slider-new'), {
        items: 1,
        loop: true,
        margin: 25,
        nav: true,
        dots: true,
        navText: [
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
            '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
        ],
        // Drag behaviour
        mouseDrag: true,   // desktop drag
        touchDrag: true,   // mobile swipe
        pullDrag: true,
        freeDrag: false,
        // smoother horizontal slide
        smartSpeed: 2200,   
        autoplaySpeed: 2200,
        // ðŸ”¥ Auto carousel with 10s delay
        autoplay: true,
        autoplayTimeout: 10000,      // 10 seconds
        autoplayHoverPause: true, // ðŸ‘ˆ important
        
        responsive: {
            0: { items: 1 },
            768: { items: 1, margin: 25 },
            900: { items: 1, margin: 25 },
            1280: { items: 1, stagePadding: 120, margin: 25 }
        },
        onInitialized: function(event) {
            wrapNavBtns(event);
            addAccessibilityLabels(event);
        },

        onRefreshed: function(event) {
            wrapNavBtns(event);
            addAccessibilityLabels(event);
        }

    });

    /* accessibilitycheck */
    function addAccessibilityLabels(event) {
        const $dots = $(event.target).find('.owl-dot');

        $dots.each(function(index) {
            const label = 'Go to slide ' + (index + 1);

            $(this)
                .removeAttr('role')
                .attr({
                    'aria-label': label,
                    'title': label,
                    'type': 'button'
                });

            // Replace any existing content with sr-only text
            $(this).html('<span class="sr-only">' + label + '</span>');
        });
    }


    // Prevent double slide skip
    $owl('.horizontal-slider-new').on('click', '.owl-prev, .owl-next', function () {
        $owl('.horizontal-slider-new').trigger('stop.owl.autoplay');
        
        setTimeout(function () {
            $owl('.horizontal-slider-new').trigger('play.owl.autoplay', [10000]);
        }, 10000); // restart timer
    });

    function wrapNavBtns(event) {
        const $nav = $(event.target).find('.owl-nav');

        // Prevent double-wrapping
        if ($nav.find('.inner-nav-wrapper').length === 0) {
            $nav.wrapInner('<div class="inner-nav-wrapper"></div>');
        }
    }
    
    // end horizontal-slider-new

    
    // horizontal video carousel
    initOwlCarousel($owl('.horizontal-video-carousel'), {
    items: 1,
    loop: true,
    nav: true,
    dots: true,
    autoplay: false,
    navText: [
        '<img src="/assets/podenergy.com/themes/custom/podpoint/images/prev-icon.svg" class="owl-prev-img" alt="prev">',
        '<img src="/assets/podenergy.com/themes/custom/podpoint/images/next-icon.svg" class="owl-next-img" alt="next">'
    ],
    responsive: {
        0: { items: 1 },
        768: { items: 1, stagePadding: 100, margin: 20 },
        900: { items: 2, stagePadding: 100, margin: 20 },
        1280: { items: 2, stagePadding: 120, margin: 25 }
    },
        onInitialized: function(event) {
            wrapNavButtons(event);
            addAccessibilityLabels(event);
        },
        onRefreshed: function(event) {
            wrapNavButtons(event);
            addAccessibilityLabels(event);
        }
    });

    function wrapNavButtons(event) {
        const $nav = $(event.target).find('.owl-nav');

        // Prevent double-wrapping
        if ($nav.find('.inner-nav-wrapper').length === 0) {
            $nav.wrapInner('<div class="inner-nav-wrapper"></div>');
        }
    }

    // end horizontal video carousel

    const parseOwlOptions = (optionsString) => {
        if (!optionsString) {
            return {};
        }

        try {
            return JSON.parse(optionsString);
        } catch (error) {
            console.warn('Invalid data-owl-options attribute:', optionsString, error);
            return {};
        }
    };

    $owl('.owl-carousel').each(function () {
        const $carousel = $owl(this);

        if ($carousel.hasClass('owl-loaded')) {
            return;
        }

        const dataOptionsRaw = $carousel.attr('data-owl-options');
        const dataOptions = parseOwlOptions(dataOptionsRaw);
        const options = $owl.extend(true, {}, defaultOwlOptions, dataOptions);
        const hasLoopOverride = typeof dataOptions.loop !== 'undefined';

        if (!hasLoopOverride) {
            const itemCount = $carousel.find('.item, .trustpilot-carousel__item').length;
            let maxItems = options.items || 1;

            if (options.responsive) {
                Object.keys(options.responsive).forEach((breakpoint) => {
                    const responsiveOptions = options.responsive[breakpoint];
                    if (responsiveOptions && responsiveOptions.items && responsiveOptions.items > maxItems) {
                        maxItems = responsiveOptions.items;
                    }
                });
            }

            options.loop = itemCount > maxItems;
        }

        initOwlCarousel($carousel, options);
    });


    window.onload = function () {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedFilter = urlParams.get('field_categories_target_id');

        if (selectedFilter) {
            const radioButton = document.querySelector(`input[type="radio"][value="${selectedFilter}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
        } else {
            // Set "All" as default when no filter is selected
            const allRadioButton = document.querySelector(`input[type="radio"][value="All"]`);
            if (allRadioButton) {
                allRadioButton.checked = true;
            }

            // Redirect to guides page with All filter if we're on guides page without filter
            if (
                window.location.pathname.includes('/guides') &&
                !window.location.pathname.includes('/vehicle-guides') &&
                !selectedFilter
            ) {
                const currentUrl = new URL(window.location);
                // currentUrl.searchParams.set('field_categories_target_id', 'All');
                window.history.replaceState({}, '', currentUrl.toString());
            }
        }
    };

    // Our installation process accordion
    $owl(document).ready(function () {
        const firstStep = $owl(".oip_step").first();
        firstStep.addClass("active");
        firstStep.find(".step_content_dec").show();

        $owl(".oip_step h6").click(function () {
            const parentStep = $owl(this).closest(".oip_step");

            $owl(".oip_step").not(parentStep).removeClass("active")
                .find(".step_content_dec").slideUp();

            parentStep.toggleClass("active");
            parentStep.find(".step_content_dec").stop(true, true).slideToggle();
        });
    });
    // Our installation process accordion


    // common accordion
    $owl(document).ready(function () {
        $owl(".accordion-wrapper").each(function () {
            const $accordion = $owl(this);
            const $faqGroups = $accordion.closest(".faq-accordion-groups");
            const isFaqGroup = $faqGroups.length > 0;
            const isFirstFaqGroup = isFaqGroup
                ? $faqGroups.find(".accordion-wrapper").first().is($accordion)
                : true;

            // First item open by default (only for first FAQ group)
            if (isFirstFaqGroup) {
                const firstStep = $accordion.find(".common_accordion").first();
                firstStep.addClass("active");
                firstStep.find(".common_accordion_dec").show();
            }

            // Click event for each accordion title inside this wrapper
            $accordion.find(".common_accordion_title").click(function () {
                const parentStep = $owl(this).closest(".common_accordion");

                // Close others within the same wrapper
                $accordion.find(".common_accordion").not(parentStep)
                    .removeClass("active")
                    .find(".common_accordion_dec").slideUp();

                // Toggle current one
                parentStep.toggleClass("active");
                parentStep.find(".common_accordion_dec").stop(true, true).slideToggle();
            });
        });
    });
    // common accordion


    // Drupal behavior for label overrides (handles dynamic form loads in admin)
    if (typeof Drupal !== 'undefined') {
        Drupal.behaviors.blockTitleOverride = {
            attach: function (context, settings) {
                const $context = $owl(context);

                // Change "Title" to "Block Title" for the main title field
                $context.find('.js-form-required.form-required').filter(function () {
                    return $owl(this).text().trim() === 'Title';
                }).text('Block Title');

                // Change "Display title" to "Display block title" for the checkbox label
                $context.find('.taxonomy-term-title').filter(function () {
                    return $owl(this).text().trim() === 'Display title';
                }).text('Check to display block title');

                // Change "Display title" to "Display block title" for the checkbox label
                $context.find('.form-item-settings-label-display label.option').filter(function () {
                    return $owl(this).text().trim() === 'Display title';
                }).text('');
            }
        };
    } else {
        // Fallback for non-Drupal environments
        $owl('.js-form-required.form-required').each(function () {
            if ($owl(this).text().trim() === 'Title') {
                $owl(this).text('Block Title');
            }
        });

        $owl('.taxonomy-term-title').each(function () {
            if ($owl(this).text().trim() === 'Display title') {
                $owl(this).text('Check to display block title');
            }
        });
        $owl('.form-item-settings-label-display label.option').each(function () {
            if ($owl(this).text().trim() === 'Display title') {
                $owl(this).text('');
            }
        });
    }

    const getFieldValue = ($form, names) => {
        for (let i = 0; i < names.length; i += 1) {
            const name = names[i];
            const $field = $form.find(`[name="${name}"]`);
            if (!$field.length) {
                continue;
            }

            if ($field.is(':radio')) {
                return $form.find(`[name="${name}"]:checked`).val() || '';
            }

            if ($field.is(':checkbox')) {
                return $field.is(':checked') ? ($field.val() || 'true') : '';
            }

            return $field.val() || '';
        }

        return '';
    };

    const isCommercialEnquiryForm = ($form) => {
        const formId = ($form.attr('id') || '').toLowerCase();
        if (formId && formId.includes('commercial') && formId.includes('enquiry')) {
            return true;
        }

        const fieldSignals = [
            'which_industry',
            'please_specify_industry',
            'why_are_you_interested',
            'please_specify_interest',
            'number_of_ev',
            'account_classification_c',
            'market_c',
            'lead_type_c',
            'recordtypeid'
        ];

        return fieldSignals.some((name) => $form.find(`[name="${name}"]`).length > 0);
    };

    const pushCommercialEnquiryEvent = ($form) => {
        if ($form.data('analytics-pushed')) {
            return;
        }

        if (!isCommercialEnquiryForm($form)) {
            return;
        }

        let eventName = getFieldValue($form, ['eventName', 'event_name']);
        if (!eventName) {
            eventName = 'generate_lead';
        }

        if (eventName !== 'generate_lead') {
            return;
        }

        const payload = {
            event: eventName,
            label: getFieldValue($form, ['event_label', 'label']) || 'Commercial',
            conversion: getFieldValue($form, ['conversion']) || 'Enquiry Form',
            parkingSpaces: getFieldValue($form, ['please_specify_industry', 'parkingSpaces']),
            interestReason: getFieldValue($form, ['why_are_you_interested', 'interestReason']),
            value: getFieldValue($form, ['value']),
            leadType: getFieldValue($form, ['lead_type', 'leadType']),
            currency: getFieldValue($form, ['currency']),
            leadStatus: getFieldValue($form, ['lead_status', 'leadStatus']),
            locale: getFieldValue($form, ['locale'])
        };

        // Backwards-compatible keys for existing GTM variables.
        payload.event_label = payload.label;
        payload.parking_spaces = payload.parkingSpaces;
        payload.interest_reason = payload.interestReason;
        payload.lead_type = payload.leadType;
        payload.lead_status = payload.leadStatus;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(payload);
        $form.data('analytics-pushed', true);
    };

    $owl(document).on('submit', 'form.webform-submission-form', function (event) {
        const form = this;
        if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
            return;
        }

        pushCommercialEnquiryEvent($owl(form));
    });

    $owl(document).on('click', 'form.webform-submission-form [type="submit"]', function () {
        const form = this.form;
        if (!form) {
            return;
        }

        if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
            return;
        }

        pushCommercialEnquiryEvent($owl(form));
    });

});
