const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

const updateHeaderState = () => {
  if (!header) return;
  const scrolled = window.scrollY > 16;
  header.classList.toggle('is-scrolled', scrolled);
};

const toggleMenu = () => {
  if (!navToggle || !mobileMenu) return;
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.style.display = isOpen ? 'none' : 'block';
};

if (navToggle) {
  navToggle.addEventListener('click', toggleMenu);
}

if (mobileLinks.length) {
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
      }
      if (mobileMenu) {
        mobileMenu.style.display = 'none';
      }
    });
  });
}

updateHeaderState();
window.addEventListener('scroll', () => {
  window.requestAnimationFrame(updateHeaderState);
}, { passive: true });

const revealItems = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const statItems = document.querySelectorAll('.stat-value');

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  const duration = 1400;
  const startTime = performance.now();

  const update = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  };

  requestAnimationFrame(update);
};

if ('IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  statItems.forEach((item) => statsObserver.observe(item));
} else {
  statItems.forEach((item) => {
    item.textContent = item.dataset.target || '0';
  });
}
