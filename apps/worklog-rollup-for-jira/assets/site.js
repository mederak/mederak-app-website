const lightbox = document.querySelector('#image-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('#main-menu');

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
