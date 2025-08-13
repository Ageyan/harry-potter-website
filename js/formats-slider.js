document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('my-slider');
  if (!slider) return;

  const viewport = slider.querySelector('.all-char-section__viewport');
  const track = slider.querySelector('.all-char-section__track');
  let slides = Array.from(track.querySelectorAll('.all-char-section__slide'));
  const prevBtn = slider.querySelector('.all-char-section__scroll-button.prev');
  const nextBtn = slider.querySelector('.all-char-section__scroll-button.next');
  const paginationContainer = document.querySelector('.all-char-section__pagination');

  let slidesPerView = 1;
  let currentIndex = 0;
  let slideWidth = 0;
  let realSlidesCount = slides.length;

  const getSlidesPerView = () => {
    const w = window.innerWidth;
    // if (w <= 480) return 1;  
    if (w <= 768) return 1;
    if (w <= 1280) return 2;
    return 3;                 
  };

  function cloneSlidesForLoop() {
    track.innerHTML = '';
    const clonesBefore = slides.map(s => s.cloneNode(true));
    const clonesAfter = slides.map(s => s.cloneNode(true));
    track.append(...clonesBefore, ...slides, ...clonesAfter);
    slides = Array.from(track.querySelectorAll('.all-char-section__slide'));
  }

  function setSizes() {
    slidesPerView = getSlidesPerView();
    slideWidth = Math.floor(viewport.clientWidth / slidesPerView);
    slides.forEach(s => {
      s.style.flex = `0 0 ${slideWidth}px`;
      s.style.maxWidth = `${slideWidth}px`;
    });
    createPagination();
    goTo(currentIndex, false);
  }

  function goTo(index, animate = true) {
    currentIndex = index;
    const offset = -(index * slideWidth);
    track.style.transition = animate ? 'transform 300ms ease' : 'none';
    track.style.transform = `translate3d(${offset}px,0,0)`;

    updatePagination();

    // Таким чином робимо бескінечний слайдер 
    if (index <= slidesPerView - 1) {
      setTimeout(() => {
        track.style.transition = 'none';
        currentIndex = realSlidesCount + index;
        track.style.transform = `translate3d(${-(currentIndex * slideWidth)}px,0,0)`;
        updatePagination();
      }, 300);
    }
    if (index >= slides.length - slidesPerView) {
      setTimeout(() => {
        track.style.transition = 'none';
        currentIndex = realSlidesCount - slidesPerView + (index - (slides.length - slidesPerView));
        track.style.transform = `translate3d(${-(currentIndex * slideWidth)}px,0,0)`;
        updatePagination();
      }, 300);
    }
  }
  
  // Кнопки по боках тільки для планшетів
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Робимо свайп для мобільних
  let startX = 0;
  let isDragging = false;
  let prevTranslate = 0;

  function onTouchStart(e) {
    if (slidesPerView !== 1) return;
    isDragging = true;
    startX = e.touches[0].clientX;
    prevTranslate = -currentIndex * slideWidth;
    track.style.transition = 'none';
  }

  function onTouchMove(e) {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - startX;
    track.style.transform = `translate3d(${prevTranslate + delta}px,0,0)`;
  }

  function onTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const moved = e.changedTouches[0].clientX - startX;
    const threshold = slideWidth * 0.2;
    if (moved < -threshold) goTo(currentIndex + 1);
    else if (moved > threshold) goTo(currentIndex - 1);
    else goTo(currentIndex);
  }

  viewport.addEventListener('touchstart', onTouchStart, { passive: true });
  viewport.addEventListener('touchmove', onTouchMove, { passive: false });
  viewport.addEventListener('touchend', onTouchEnd);


  function createPagination() {
  paginationContainer.innerHTML = '';
  
  if (slidesPerView !== 1) return; // робимо пагінацію тільки для мобільної версії

  let dotsCount = realSlidesCount;
  for (let i = 0; i < dotsCount; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goTo(i + realSlidesCount);
    });
    paginationContainer.appendChild(dot);
  }
}

  function updatePagination() {
    const dots = paginationContainer.querySelectorAll('button');
    let pageIndex = slidesPerView === 1 
      ? (currentIndex - realSlidesCount) % realSlidesCount
      : Math.floor((currentIndex - realSlidesCount) / slidesPerView) % Math.ceil(realSlidesCount / slidesPerView);
    if (pageIndex < 0) pageIndex += dots.length;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === pageIndex);
    });
  }

  window.addEventListener('resize', () => setSizes()); // ініціалізація 
  cloneSlidesForLoop();
  setSizes();

  
  window.reInitSlider = () => { // метод для перерахунку 
    cloneSlidesForLoop();
    setSizes();
  };
});








