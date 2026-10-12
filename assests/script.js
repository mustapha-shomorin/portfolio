document.addEventListener('DOMContentLoaded', function () {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('ms-theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  }

  const themeBtn = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');

  function syncThemeIcon() {
    if (!themeIcon) return;
    const currentTheme = root.getAttribute('data-theme');
    themeIcon.textContent = currentTheme === 'light' ? '☾' : '☀';
  }

  syncThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('ms-theme', next);
      syncThemeIcon();
    });
  }

  const typingWords = [
    'Data Engineer',
    'ETL/ELT Pipeline Builder',
    'Data Quality & Monitoring',
    'Cloud Data Platforms'
  ];

  const typingEl = document.getElementById('typingText');
  if (typingEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeLoop = () => {
      const currentWord = typingWords[wordIndex];
      if (!deleting) {
        charIndex += 1;
      } else {
        charIndex -= 1;
      }

      typingEl.textContent = currentWord.slice(0, charIndex);

      if (!deleting && charIndex === currentWord.length) {
        deleting = true;
        setTimeout(typeLoop, 1100);
        return;
      }

      if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % typingWords.length;
      }

      const speed = deleting ? 45 : 90;
      setTimeout(typeLoop, speed);
    };

    typeLoop();
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(function (element) {
      observer.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add('visible');
    });
  }

  const counterEls = document.querySelectorAll('.counter');
  const formatCounter = function (value, suffix) {
    if (suffix === '%') return value + '%';
    if (suffix === '%+') return value + '%+';
    return value + suffix;
  };

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target || 0);
      const suffix = counter.dataset.suffix || '';
      let val = 0;
      const inc = target > 0 ? Math.ceil(target / 30) : 1;

      const tick = function () {
        val += inc;
        if (val >= target) {
          val = target;
          counter.textContent = formatCounter(val, suffix);
          counterObserver.unobserve(counter);
          return;
        }
        counter.textContent = formatCounter(val, suffix);
        requestAnimationFrame(tick);
      };

      if (target === 0) {
        counter.textContent = suffix || '0';
        counterObserver.unobserve(counter);
      } else {
        tick();
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main section[id]');
  const setActiveNav = function () {
    const scrollPosition = window.scrollY + 160;
    let currentId = sections[0]?.id || '';

    sections.forEach(function (section) {
      if (scrollPosition >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      const matches = href && href.startsWith('#') && href.slice(1) === currentId;
      link.classList.toggle('active', matches);
    });
  };

  setActiveNav();
  window.addEventListener('scroll', setActiveNav, { passive: true });

  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const toggleBackToTop = function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const button = contactForm.querySelector('button[type="submit"]');
      if (button) {
        const prevText = button.textContent;
        button.textContent = 'Message sent';
        button.disabled = true;
        setTimeout(function () {
          button.textContent = prevText;
          button.disabled = false;
          contactForm.reset();
        }, 1800);
      }
    });
  }
});

