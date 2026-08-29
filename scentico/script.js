// ---- Header scroll state ----
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

// ---- Mobile menu ----
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
  mobileMenu.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
}

function openMobileMenu() {
  menuToggle.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
  mobileMenu.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.classList.contains('open');
  isOpen ? closeMobileMenu() : openMobileMenu();
});

document.querySelectorAll('.mnav').forEach((a) => {
  a.addEventListener('click', closeMobileMenu);
});

// ---- Login modal ----
const loginOverlay = document.getElementById('loginOverlay');
const modalCard = loginOverlay.querySelector('.modal-card');

function openLogin() {
  loginOverlay.classList.remove('opacity-0', 'pointer-events-none');
  loginOverlay.classList.add('opacity-100', 'pointer-events-auto');
  modalCard.classList.remove('translate-y-4', 'scale-[.97]');
  modalCard.classList.add('translate-y-0', 'scale-100');
}

function closeLogin() {
  loginOverlay.classList.add('opacity-0', 'pointer-events-none');
  loginOverlay.classList.remove('opacity-100', 'pointer-events-auto');
  modalCard.classList.add('translate-y-4', 'scale-[.97]');
  modalCard.classList.remove('translate-y-0', 'scale-100');
}

document.querySelectorAll('[data-open-login]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileMenu();
    openLogin();
  });
});

document.getElementById('loginClose').addEventListener('click', closeLogin);
loginOverlay.addEventListener('click', (e) => {
  if (e.target === loginOverlay) closeLogin();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLogin();
});

document.getElementById('googleSignIn').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const label = btn.querySelector('span');
  label.textContent = 'Signed in';
  setTimeout(() => {
    closeLogin();
    label.textContent = 'Sign in with Google';
  }, 900);
});

// ---- Contact form fake-submit ----
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('formNote').classList.remove('hidden');
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sent ✓';
  setTimeout(() => {
    contactForm.reset();
    btn.textContent = 'Send Message';
  }, 1800);
});

// ---- Newsletter fake-submit ----
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Joined ✓';
  setTimeout(() => {
    btn.textContent = 'Join';
    e.target.reset();
  }, 1800);
});

// ---- Scroll reveal ----
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}
