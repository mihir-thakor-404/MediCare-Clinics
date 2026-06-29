/**
 * MediCare Plus Clinic - Main JavaScript
 * Handles animations, interactions, and UI features
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initAOS();
  initSwiper();
  initNavbar();
  initScrollProgress();
  initDarkMode();
  initMobileMenu();
  initSmoothScroll();
  initActiveNav();
  initCounters();
  initParallax();
  initLazyLoad();
  initRipple();
  initModal();
  initForms();
  initBackToTop();
});

/* ---- Loading Screen ---- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
  });

  document.body.style.overflow = 'hidden';
}

/* ---- AOS Initialization ---- */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'phone' : false,
    });
  }
}

/* ---- Swiper Testimonial Slider ---- */
function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    speed: 700,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: { slidesPerView: 1 },
      1024: { slidesPerView: 1 },
    },
  });
}

/* ---- Sticky Navbar ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ---- Scroll Progress Bar ---- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(progress));
  }, { passive: true });
}

/* ---- Dark Mode Toggle ---- */
function initDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('medicare-theme');
  if (savedTheme === 'dark') {
    html.classList.add('dark');
  }

  toggle?.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('medicare-theme', isDark ? 'dark' : 'light');
  });
}

/* ---- Mobile Menu ---- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    btn.querySelector('i').className = isOpen ? 'fas fa-times text-text dark:text-white' : 'fas fa-bars text-text dark:text-white';
  });

  menu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelector('i').className = 'fas fa-bars text-text dark:text-white';
    });
  });
}

/* ---- Smooth Scroll ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

/* ---- Active Navigation Highlight ---- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
}

/* ---- Animated Counters ---- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const start = performance.now();
    const isStatNumber = el.classList.contains('stat-number');

    const update = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (isStatNumber) {
        el.textContent = target >= 1000 ? formatNumber(current) : `${current}${target === 24 ? '/7' : '+'}`;
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isStatNumber) {
          el.textContent = target >= 1000 ? formatNumber(target) : `${target}${target === 24 ? '/7' : '+'}`;
        } else {
          el.textContent = target;
        }
      }
    };

    requestAnimationFrame(update);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}${num >= 1000 ? 'K+' : '+'}`;
    }
    return `${num}+`;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

/* ---- Parallax Effect ---- */
function initParallax() {
  const parallaxImg = document.querySelector('.parallax-img');
  if (!parallaxImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.15;
    parallaxImg.style.transform = `translateY(${rate}px)`;
  }, { passive: true });
}

/* ---- Lazy Loading Images ---- */
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('.lazy-img');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    lazyImages.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
        imageObserver.observe(img);
      }
    });
  } else {
    lazyImages.forEach(img => img.classList.add('loaded'));
  }
}

/* ---- Button Ripple Effect ---- */
function initRipple() {
  document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.classList.add('ripple');
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ---- Appointment Modal ---- */
// function initModal() {
//   const modal = document.getElementById('appointment-modal');
//   if (!modal) return;

//   const overlay = modal.querySelector('.modal-overlay');
//   const closeBtn = modal.querySelector('.modal-close');

//   const openModal = () => {
//     modal.classList.add('open');
//     modal.setAttribute('aria-hidden', 'false');
//     document.body.style.overflow = 'hidden';
//     modal.querySelector('input, select, textarea')?.focus();
//   };

//   const closeModal = () => {
//     modal.classList.remove('open');
//     modal.setAttribute('aria-hidden', 'true');
//     document.body.style.overflow = '';
//   };

//   document.querySelectorAll('[data-modal="appointment"]').forEach(btn => {
//     btn.addEventListener('click', (e) => {
//       e.preventDefault();
//       openModal();
//     });
//   });

//   closeBtn?.addEventListener('click', closeModal);
//   overlay?.addEventListener('click', closeModal);

//   document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape' && modal.classList.contains('open')) {
//       closeModal();
//     }
//   });
// }

/* ---- Form Handling ---- */
function initForms() {
  const contactForm = document.getElementById('contact-form');
  const appointmentForm = document.getElementById('appointment-form');
  const newsletterForm = document.getElementById('newsletter-form');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(contactForm)) {
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      contactForm.reset();
    }
  });

  appointmentForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(appointmentForm)) {
      showToast('Appointment request submitted! We\'ll confirm shortly.', 'success');
      appointmentForm.reset();
      document.getElementById('appointment-modal')?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]');
    if (email?.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showToast('Thank you for subscribing to our newsletter!', 'success');
      newsletterForm.reset();
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  });

  const dateInput = document.getElementById('appt-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}

function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

  fields.forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      field.classList.add('error');
      isValid = false;
    }
  });

  if (!isValid) {
    showToast('Please fill in all required fields correctly.', 'error');
  }

  return isValid;
}

/* ---- Toast Notifications ---- */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ---- Back to Top ---- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
