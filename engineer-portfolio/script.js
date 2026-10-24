/* Portfolio configuration: update these values before publishing. */
const SITE = {
  email: 'lamadeku.kekeli45@gmail.com',
  projects: [
    {
      title: 'Fire & Gas / Earthing System Upgrade',
      images: [
        { src: 'assets/fire-gas-1.jpg', caption: 'Installation overview' },
        { src: 'assets/fire-gas-2.jpg', caption: 'Equipment and cable installation' },
        { src: 'assets/fire-gas-3.jpg', caption: 'Testing and inspection' }
      ]
    },
    {
      title: 'Substation Upgrade Engineering',
      images: [
        { src: 'assets/substation-1.jpg', caption: 'Site overview' },
        { src: 'assets/substation-2.jpg', caption: 'Layout or single-line drawing' },
        { src: 'assets/substation-3.jpg', caption: 'Installation interface' }
      ]
    },
    {
      title: 'Industrial Equipment Procurement',
      images: [
        { src: 'assets/procurement-1.jpg', caption: 'Equipment package' },
        { src: 'assets/procurement-2.jpg', caption: 'Technical inspection' },
        { src: 'assets/procurement-3.jpg', caption: 'Delivery and logistics' }
      ]
    }
  ]
};

const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');

function getStoredTheme() {
  try {
    return localStorage.getItem('portfolio-theme');
  } catch {
    return null;
  }
}

if (themeToggle) {
  const storedTheme = getStoredTheme();
  const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const preferredTheme = mediaQuery && mediaQuery.matches ? 'dark' : 'light';
  root.dataset.theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : preferredTheme;

  function refreshThemeButton() {
    const isDark = root.dataset.theme === 'dark';
    themeToggle.textContent = isDark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  refreshThemeButton();

  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;

    try {
      localStorage.setItem('portfolio-theme', nextTheme);
    } catch {
      // Ignore localStorage quota or privacy-mode issues.
    }

    refreshThemeButton();
  });
}

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  menu.querySelectorAll('a, button').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    });
  });
}

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
  if (!project || !Array.isArray(project.images) || project.images.length === 0) {
    galleryTitle.textContent = 'Project';
    galleryCaption.textContent = 'No gallery images available.';
    galleryCounter.textContent = '0 / 0';
    galleryImage.hidden = true;
    galleryPlaceholder.hidden = false;
    galleryPlaceholder.textContent = 'No gallery images available.';
    return;
  }

  const photo = project.images[imageIndex] || project.images[0];
  galleryTitle.textContent = project.title;
  galleryCaption.textContent = photo.caption || 'Project image';
  galleryCounter.textContent = `${Math.min(imageIndex + 1, project.images.length)} / ${project.images.length}`;
  galleryImage.hidden = true;
  galleryImage.removeAttribute('src');
  galleryPlaceholder.hidden = false;
  galleryPlaceholder.textContent = `Loading ${photo.caption || 'image'}…`;

  const currentProjectIndex = projectIndex;
  const currentImageIndex = imageIndex;
  const preloader = new Image();

  preloader.onload = () => {
    if (currentProjectIndex !== projectIndex || currentImageIndex !== imageIndex) return;

    galleryImage.src = photo.src;
    galleryImage.alt = `${project.title}: ${photo.caption || 'Project image'}`;
    galleryImage.hidden = false;
    galleryPlaceholder.hidden = true;
  };

  preloader.onerror = () => {
    if (currentProjectIndex !== projectIndex || currentImageIndex !== imageIndex) return;

    galleryImage.hidden = true;
    galleryPlaceholder.hidden = false;
    galleryPlaceholder.textContent = `${photo.caption || 'Project image'} — image unavailable`;
  };

  preloader.src = photo.src;
}

document.querySelectorAll('[data-gallery]').forEach((button) => {
  button.addEventListener('click', () => {
    projectIndex = Number(button.dataset.gallery);
    imageIndex = 0;
    showGalleryImage();

    if (dialog) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', 'open');
      }
    }
  });
});

if (closeGalleryButton && dialog) {
  closeGalleryButton.addEventListener('click', () => {
    if (typeof dialog.close === 'function' && dialog.hasAttribute('open')) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  });
}

if (dialog) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      if (typeof dialog.close === 'function' && dialog.hasAttribute('open')) {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    }
  });
}

function movePhoto(direction) {
  const total = SITE.projects[projectIndex]?.images?.length ?? 0;
  if (!total) return;

  imageIndex = (imageIndex + direction + total) % total;
  showGalleryImage();
}

if (galleryPrev) galleryPrev.addEventListener('click', () => movePhoto(-1));
if (galleryNext) galleryNext.addEventListener('click', () => movePhoto(1));

if (dialog) {
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') movePhoto(-1);
    if (event.key === 'ArrowRight') movePhoto(1);
    if (event.key === 'Escape') {
      if (typeof dialog.close === 'function' && dialog.hasAttribute('open')) {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    }
  });
}

const emailLink = document.querySelector('#email-link');
if (emailLink) {
  emailLink.href = `mailto:${SITE.email}`;
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const formNameInput = contactForm.querySelector('[name="name"]');
  const formEmailInput = contactForm.querySelector('[name="email"]');
  const formMessageInput = contactForm.querySelector('[name="message"]');

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!formNameInput || !formEmailInput || !formMessageInput) {
      return;
    }

    const name = formNameInput.value.trim();
    const email = formEmailInput.value.trim();
    const message = formMessageInput.value.trim();

    if (!contactForm.reportValidity()) return;
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

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  showGalleryImage();
}

window.addEventListener('DOMContentLoaded', () => {
  showGalleryImage();
});

