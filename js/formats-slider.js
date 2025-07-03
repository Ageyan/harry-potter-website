const originalWarn = console.warn;
console.warn = function (...args) {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Swiper Loop Warning')
  ) return;
  originalWarn.apply(console, args);
};

const swiper = new Swiper('.swiper-container', {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 16,

  breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1280: {
        slidesPerView: 3,
      }
  },
  pagination: {
      el: '.pagination',
      bulletClass: 'pagination__button',
      bulletActiveClass: 'pagination__button--active',
  },
  navigation: {
    nextEl: '.carousel-button.next',
    prevEl: '.carousel-button.prev',
  },
});