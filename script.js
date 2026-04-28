/* ── NAVBAR ── */
const navbar  = document.getElementById('navbar');
const toggle  = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');
const navLinks = navMenu.querySelectorAll('a');

function updateNavScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}

function updateActiveLink() {
  const scrollMid = window.scrollY + window.innerHeight * 0.35;
  let active = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (sec.offsetTop <= scrollMid) active = sec.id;
  });
  navLinks.forEach(a => {
    const href = a.getAttribute('href').replace('#', '');
    a.classList.toggle('active', href === active);
  });
}

window.addEventListener('scroll', () => {
  updateNavScroll();
  updateActiveLink();
}, { passive: true });

updateNavScroll();
updateActiveLink();

/* Mobile menu */
toggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
});

navLinks.forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

/* Close menu on outside click */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navMenu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

/* ── SCROLL ANIMATIONS ── */

/* 1. Auto-stagger direct children of .stagger-children grids */
document.querySelectorAll('.stagger-children').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.setAttribute('data-animate', 'fade-up');
    child.style.setProperty('--delay', `${i * 90}ms`);
  });
});

/* 2. IntersectionObserver adds .in-view to reveal elements */
const revealObs = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-animate]').forEach(el => revealObs.observe(el));

/* ── GALERIA LIGHTBOX ── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox) {
  document.querySelectorAll('.galeria-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const img = cell.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  lightboxClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

/* ── SMOOTH SCROLL OFFSET (accounts for fixed navbar) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
