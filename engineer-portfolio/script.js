/* Portfolio configuration: update these values before publishing. */
const SITE = {
  email: 'lamadeku.kekeli45@gmail.com',
  projects: [
    { title: 'Fire & Gas / Earthing System Upgrade', images: [
      { src: 'assets/fire-gas-1.jpg', caption: 'Installation overview' },
      { src: 'assets/fire-gas-2.jpg', caption: 'Equipment and cable installation' },
      { src: 'assets/fire-gas-3.jpg', caption: 'Testing and inspection' }
    ] },
    { title: 'Substation Upgrade Engineering', images: [
      { src: 'assets/substation-1.jpg', caption: 'Site overview' },
      { src: 'assets/substation-2.jpg', caption: 'Layout or single-line drawing' },
      { src: 'assets/substation-3.jpg', caption: 'Installation interface' }
    ] },
    { title: 'Industrial Equipment Procurement', images: [
      { src: 'assets/procurement-1.jpg', caption: 'Equipment package' },
      { src: 'assets/procurement-2.jpg', caption: 'Technical inspection' },
      { src: 'assets/procurement-3.jpg', caption: 'Delivery and logistics' }
    ] }
  ]
};

// Theme: respect saved selection, otherwise the operating system preference.
const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const savedTheme = (() => {
  try {
    return localStorage.getItem('portfolio-theme');
  } catch {
    return null;
  }
})();

if (themeToggle) {
  root.dataset.theme = savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function refreshThemeButton() {
    const isDark = root.dataset.theme === 'dark';
    themeToggle.textContent = isDark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  }

  refreshThemeButton();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('portfolio-theme', root.dataset.theme);
    } catch {
      // Ignore localStorage quota or privacy-mode issues.
    }
    refreshThemeButton();
  });
}

// Mobile menu: real expanded state and automatic close on navigation.
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }));
}

// Gallery: add up to 3 real images per project in the assets folder.
const dialog = document.querySelector('#gallery-dialog');
const galleryImage = document.querySelector('#gallery-image');
const galleryPlaceholder = document.querySelector('#gallery-placeholder');
const galleryTitle = document.querySelector('#gallery-title');
const galleryCaption = document.querySelector('#gallery-caption');
const galleryCounter = document.querySelector('#gallery-counter');
const closeGalleryButton = document.querySelector('#close-gallery');
const galleryPrev = document.querySelector('#gallery-prev');
const galleryNext = document.querySelector('#gallery-next');
let projectIndex = 0;
let imageIndex = 0;

function showGalleryImage() {
  if (!dialog || !galleryImage || !galleryPlaceholder || !galleryTitle || !galleryCaption || !galleryCounter) return;

  const project = SITE.projects[projectIndex];
  const photo = project.images[imageIndex];
  galleryTitle.textContent = project.title;
  galleryCaption.textContent = photo.caption;
  galleryCounter.textContent = `${imageIndex + 1} / ${project.images.length}`;
  galleryImage.hidden = true;
  galleryImage.removeAttribute('src');
  galleryPlaceholder.hidden = false;
  galleryPlaceholder.textContent = `${photo.caption} — add ${photo.src}`;

  const preloader = new Image();
  const currentSrc = photo.src;
  preloader.onload = () => {
    if (SITE.projects[projectIndex].images[imageIndex].src !== currentSrc) return;
    galleryImage.src = currentSrc;
    galleryImage.alt = `${project.title}: ${photo.caption}`;
    galleryImage.hidden = false;
    galleryPlaceholder.hidden = true;
  };
  preloader.src = currentSrc;
}

document.querySelectorAll('[data-gallery]').forEach(button => {
  button.addEventListener('click', () => {
    projectIndex = Number(button.dataset.gallery);
    imageIndex = 0;
    showGalleryImage();
    if (dialog) dialog.showModal();
  });
});

if (closeGalleryButton && dialog) {
  closeGalleryButton.addEventListener('click', () => dialog.close());
}

if (dialog) {
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}

function movePhoto(direction) {
  const total = SITE.projects[projectIndex].images.length;
  imageIndex = (imageIndex + direction + total) % total;
  showGalleryImage();
}

if (galleryPrev) galleryPrev.addEventListener('click', () => movePhoto(-1));
if (galleryNext) galleryNext.addEventListener('click', () => movePhoto(1));
if (dialog) {
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') movePhoto(-1);
    if (event.key === 'ArrowRight') movePhoto(1);
  });
}

// This static form opens an email draft; it does not submit to a server.
const emailLink = document.querySelector('#email-link');
if (emailLink) {
  emailLink.href = `mailto:${SITE.email}`;
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    if (!name || !email || !message) return;
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const note = document.querySelector('#form-note');
    if (note) {
      note.textContent = 'Opening your email app. Please press Send there to deliver the message.';
    }
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  });
}

const yearNode = document.querySelector('#year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
