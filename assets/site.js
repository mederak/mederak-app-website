const lightbox = document.querySelector('#image-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('#main-menu');
const carousels = document.querySelectorAll('[data-carousel]');
const siteConfig = window.MEDERAK_PRODUCT_CONFIG || {};

function closeMenu() {
  if (!menuToggle || !mainMenu) return;
  mainMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
  if (!menuToggle || !mainMenu) return;
  const isOpen = mainMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
}

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxImage.alt = alt || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-lightbox-src]').forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    openLightbox(button.dataset.lightboxSrc, image?.alt);
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

menuToggle?.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleMenu();
});

mainMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (event) => {
  if (!mainMenu || !menuToggle) return;
  if (mainMenu.contains(event.target) || menuToggle.contains(event.target)) return;
  closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeLightbox();
  closeMenu();
});

document.querySelectorAll('[data-config-url]').forEach((link) => {
  const key = link.dataset.configUrl;
  if (key && siteConfig[key]) link.setAttribute('href', siteConfig[key]);
});

document.querySelectorAll('[data-config-label]').forEach((element) => {
  const key = element.dataset.configLabel;
  if (key && siteConfig[key]) element.textContent = siteConfig[key];
});

document.querySelectorAll('[data-youtube-embed]').forEach((container) => {
  if (window.location.protocol === 'file:') return;

  const videoId = container.dataset.videoId;
  const title = container.dataset.videoTitle || 'YouTube video';
  if (!videoId) return;

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&origin=https%3A%2F%2Fmederak.app`;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;

  container.replaceChildren(iframe);
});

carousels.forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('[data-carousel-slide]')];
  const dots = [...carousel.querySelectorAll('[data-carousel-dot]')];
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('active')));

  function showSlide(index) {
    if (!slides.length) return;
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  }

  previous?.addEventListener('click', () => showSlide(activeIndex - 1));
  next?.addEventListener('click', () => showSlide(activeIndex + 1));
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => showSlide(dotIndex));
  });
  showSlide(activeIndex);
});
