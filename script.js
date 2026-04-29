/**
 * SlickLabs LLC — Website Interactions
 * Handles navigation, scroll effects, and micro-animations.
 */

(function () {
  'use strict';

  // ─── DOM References ───
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const sections = document.querySelectorAll('.section, .hero-section');

  // ─── Navbar Scroll Effect ───
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Add background after scrolling past hero
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show on scroll direction
    if (scrollY > lastScrollY && scrollY > 400) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // ─── Mobile Navigation Toggle ───
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ─── Smooth Scroll ───
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ─── Intersection Observer for Scroll Animations ───
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — allows re-triggering is optional
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe animatable elements
  document.querySelectorAll('.value-card, .service-card, .contact-wrapper, .section-header').forEach(function (el) {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // ─── Active Nav Link Highlighting ───
  const navSections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollY = window.scrollY + navbar.offsetHeight + 100;

    navSections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinksAll.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // ─── Parallax for Hero Orbs ───
  const orbs = document.querySelectorAll('.gradient-orb');

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      orbs.forEach(function (orb, i) {
        const speed = 0.15 + i * 0.08;
        orb.style.transform = 'translateY(' + scrollY * speed + 'px)';
      });
    }
  }, { passive: true });

  // ─── Initialize ───
  updateNavbar();
  highlightNavLink();
})();
