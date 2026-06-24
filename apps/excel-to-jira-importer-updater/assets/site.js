const lightbox = document.querySelector('#image-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const lightboxPrevious = lightbox?.querySelector('.lightbox-prev');
const lightboxNext = lightbox?.querySelector('.lightbox-next');
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('#main-menu');
const carousels = document.querySelectorAll('[data-carousel]');
const siteConfig = window.MEDERAK_PRODUCT_CONFIG || {};
let lightboxItems = [];
let activeLightboxIndex = -1;

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

function setLightboxImage(index) {
  if (!lightbox || !lightboxImage) return;
  const item = lightboxItems[index];
  if (!item) return;
  activeLightboxIndex = index;
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt || '';
}

function openLightbox(index) {
  if (!lightbox || !lightboxImage) return;
  setLightboxImage(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  activeLightboxIndex = -1;
  document.body.style.overflow = '';
}

function showAdjacentLightboxImage(direction) {
  if (!lightboxItems.length || activeLightboxIndex < 0) return;
  const nextIndex = (activeLightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
  setLightboxImage(nextIndex);
}

lightboxItems = [...document.querySelectorAll('[data-lightbox-src]')].map((trigger, index) => {
  const image = trigger.querySelector('img');
  trigger.addEventListener('click', () => {
    openLightbox(index);
  });
  return {
    src: trigger.dataset.lightboxSrc,
    alt: image?.alt || trigger.getAttribute('aria-label') || ''
  };
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrevious?.addEventListener('click', (event) => {
  event.stopPropagation();
  showAdjacentLightboxImage(-1);
});
lightboxNext?.addEventListener('click', (event) => {
  event.stopPropagation();
  showAdjacentLightboxImage(1);
});
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
  if (event.key === 'Escape') {
    closeLightbox();
    closeMenu();
  }
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'ArrowLeft') showAdjacentLightboxImage(-1);
  if (event.key === 'ArrowRight') showAdjacentLightboxImage(1);
});

document.querySelectorAll('[data-config-url]').forEach((link) => {
  const key = link.dataset.configUrl;
  if (key && siteConfig[key]) link.setAttribute('href', siteConfig[key]);
});

document.querySelectorAll('[data-config-label]').forEach((element) => {
  const key = element.dataset.configLabel;
  if (key && siteConfig[key]) element.textContent = siteConfig[key];
});

document.querySelectorAll('[data-copy-admin-message]').forEach((button) => {
  const textarea = document.querySelector('#admin-message');
  const status = document.querySelector('[data-copy-status]');
  if (!textarea) return;

  button.addEventListener('click', async () => {
    const message = textarea.value;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
      } else {
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
      }
      if (status) status.textContent = 'Message copied';
    } catch (error) {
      textarea.focus();
      textarea.select();
      if (status) status.textContent = 'Copy is unavailable. The message is selected.';
    }
  });
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

