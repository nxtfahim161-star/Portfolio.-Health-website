// Preloader Logic, Lenis Smooth Scroll Engine & GSAP Animations
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 1200); // 1.2s smooth tissue loading experience
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: 'vertical'
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Synchronize Lenis with GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);

  // Hero Section Stagger Reveal
  const heroTl = gsap.timeline();
  heroTl.from('.badge', { opacity: 0, y: 20, duration: 0.8, delay: 1.4 })
        .from('.hero-title', { opacity: 0, y: 30, duration: 0.9 }, "-=0.5")
        .from('.hero-description', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
        .from('.hero-cta', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
        .from('.hero-stats', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6");

  // Number Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    gsap.to(stat, {
      innerText: target,
      duration: 2,
      ease: "power2.out",
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: stat,
        start: "top 85%"
      }
    });
  });

  // Insights Card Stagger Scroll Animation
  gsap.from('.insight-card', {
    scrollTrigger: {
      trigger: '.insights-grid',
      start: 'top 80%'
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // Sequence Step Reveal
  gsap.from('.step-card', {
    scrollTrigger: {
      trigger: '.sequence-steps',
      start: 'top 80%'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.25,
    ease: 'power2.out'
  });

  // Doctor Cards Grid Reveal
  gsap.from('.doctor-card', {
    scrollTrigger: {
      trigger: '.doctors-grid',
      start: 'top 80%'
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // 3D DNA Model Scroll Parallax Transition
  if (typeof dnaGroup !== 'undefined') {
    gsap.to(dnaGroup.position, {
      scrollTrigger: {
        trigger: '.sequence-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -8,
      z: -10
    });
  }
});
