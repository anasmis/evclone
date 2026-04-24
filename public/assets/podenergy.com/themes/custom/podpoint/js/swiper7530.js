const swiperTop = new Swiper('.swiper-top', {
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
    320: { slidesPerView: 4},
    640: { slidesPerView: 5},
    1024: { slidesPerView: 6},
    1200: { slidesPerView: 7},
  },
});

const swiperBottom = new Swiper('.swiper-bottom', {
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
    320: { slidesPerView: 4},
    640: { slidesPerView: 5},
    1024: { slidesPerView: 6},
    1200: { slidesPerView: 7},
  },
});
