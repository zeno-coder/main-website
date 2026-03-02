/* ═══════════════════════════════════════════════════════════
   APOORVA GRANDHA – script.js
   Handles: navbar scroll/active, mobile menu, scroll reveal,
            back-to-top button, contact form, year stamp
═══════════════════════════════════════════════════════════ */

'use strict';

// ── DOM REFERENCES ─────────────────────────────────────
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const yearEl = document.getElementById('year');

// ── YEAR STAMP ─────────────────────────────────────────
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── SCROLL EVENTS ──────────────────────────────────────
function onScroll() {
    const scrollY = window.scrollY;

    // Sticky header shadow
    if (scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back-to-top visibility
    if (scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link highlighting
    let current = '';
    document.querySelectorAll('section[id], div[id="home"]').forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (scrollY >= sectionTop) current = section.id;
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + current) link.classList.add('active');
    });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

// ── MOBILE NAV TOGGLE ──────────────────────────────────
navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu after clicking a link (mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// ── SCROLL REVEAL ──────────────────────────────────────
const revealElements = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // Stagger cards within the same parent grid
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-reveal]'));
                const delay = siblings.indexOf(entry.target) * 80;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// ── LAZY LOAD IMAGES ───────────────────────────────────
if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.dataset.src) img.src = img.dataset.src;
    });
} else {
    // Fallback: load lazily via IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imgObserver.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => imgObserver.observe(img));
}

// ── CONTACT FORM ───────────────────────────────────────
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = this.querySelector('#name').value.trim();
        const email = this.querySelector('#email').value.trim();
        const message = this.querySelector('#message').value.trim();

        // Basic validation
        if (!name || !email || !message) {
            setFeedback('Please fill in all required fields.', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFeedback('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate successful submission
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Dispatching…';
        submitBtn.disabled = true;

        setTimeout(() => {
            setFeedback(
                `✦ Your scroll has been dispatched, ${name}! We shall respond with haste. ✦`,
                'success'
            );
            contactForm.reset();
            submitBtn.textContent = 'Dispatch the Scroll';
            submitBtn.disabled = false;
        }, 1500);
    });
}

function setFeedback(msg, type) {
    formFeedback.textContent = msg;
    formFeedback.style.color = type === 'success'
        ? 'var(--clr-gold-light)'
        : 'var(--clr-red-ancient)';
}

// ── DECORATIVE DUST PARTICLES ──────────────────────────
(function createDustParticles() {
    const container = document.querySelector('.dust-overlay');
    if (!container) return;

    const count = 35;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(201,151,58,${(Math.random() * 0.25 + 0.05).toFixed(2)});
      width:  ${(Math.random() * 3 + 1).toFixed(1)}px;
      height: ${(Math.random() * 3 + 1).toFixed(1)}px;
      left:   ${(Math.random() * 100).toFixed(2)}%;
      top:    ${(Math.random() * 100).toFixed(2)}%;
      animation: dustFloat ${(Math.random() * 20 + 15).toFixed(1)}s
                 ${(Math.random() * 10).toFixed(1)}s
                 ease-in-out infinite alternate;
      pointer-events: none;
    `;
        container.appendChild(p);
    }

    const style = document.createElement('style');
    style.textContent = `
    @keyframes dustFloat {
      0%   { transform: translate(0, 0) scale(1);   opacity: 0.4; }
      33%  { transform: translate(${rand(8)}px, ${rand(12)}px) scale(1.2); }
      66%  { transform: translate(${rand(6)}px, ${rand(8)}px) scale(0.9); }
      100% { transform: translate(${rand(10)}px, ${rand(14)}px) scale(1.1); opacity: 0.15; }
    }
  `;
    document.head.appendChild(style);

    function rand(n) {
        return (Math.random() * n * 2 - n).toFixed(1);
    }
})();

// ── SMOOTH ANCHOR CLICKS ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
