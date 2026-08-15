// Terroir Case Study — progressive enhancement only.
//
// Every number and every section is already in the HTML source and
// fully visible without this file (see index.html and CLAUDE.md,
// "Hand-written, semantic HTML — never a bundled export"). This script
// adds the stat count-up, the scroll-reveal fade-ins, the chart-grow
// animations, and the back-to-top button that the original bundled
// export had. None of it hides or delays content by default: the
// count-up starts from the real number already in the HTML, and the
// reveal/grow CSS only takes effect once .motion-ready is added below
// (IntersectionObserver support + motion allowed) — a no-JS visitor,
// an older browser, or a reduced-motion visitor all see the finished
// page immediately, never a hidden one.

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  var motionEnabled = 'IntersectionObserver' in window && !prefersReducedMotion;

  if (motionEnabled) {
    document.documentElement.classList.add('motion-ready');

    // threshold is a fraction of the TARGET's own height, not the
    // viewport's — on narrow mobile widths, sections stack to a single
    // column and can run several viewport-heights tall, so a fraction
    // that high (or even close to it) is never reached and the section
    // stays permanently invisible. rootMargin, by contrast, shrinks the
    // root (viewport) by a fixed percentage regardless of target size, so
    // threshold: 0 (any overlap at all) combined with it fires reliably
    // no matter how tall the section is, while still waiting until the
    // section is meaningfully scrolled into view before revealing it.
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -15% 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      revealObserver.observe(el);
    });

    var statsEl = document.querySelector('.stats');
    if (statsEl) {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            countObserver.disconnect();
            entry.target
              .querySelectorAll('[data-count-target]')
              .forEach(animateCount);
          });
        },
        { threshold: 0.4 }
      );
      countObserver.observe(statsEl);
    }
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count-target'), 10);
    var duration = 1400;
    var start = performance.now();

    function step(t) {
      var p = Math.min(1, (t - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-NZ');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-NZ');
    }
    requestAnimationFrame(step);
  }

  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener(
      'scroll',
      function () {
        backToTop.classList.toggle('is-visible', window.scrollY > 700);
      },
      { passive: true }
    );
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
