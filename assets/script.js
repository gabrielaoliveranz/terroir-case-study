// Terroir Case Study — progressive enhancement only.
//
// Every number and every section is already in the HTML source and
// fully visible without this file (see index.html and CLAUDE.md,
// "Hand-written, semantic HTML — never a bundled export"). This script
// only adds the stat count-up and the back-to-top button that the
// original bundled export had; neither hides or delays any content —
// the count-up starts from the real number already in the HTML.

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
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
