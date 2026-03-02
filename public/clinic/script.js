/**
 * Firstvision Eye Care Clinic — script.js
 * Features: sticky nav, mobile menu, counter animation,
 *           scroll reveal, appointment form, back to top,
 *           testimonial dots, newsletter.
 */

/* ── DOM References ───────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const backToTop = document.getElementById('back-to-top');
const regForm = document.getElementById('register-form');
const formSuccess = document.getElementById('form-success');
const formReset = document.getElementById('form-reset');
const yearSpan = document.getElementById('current-year');

/* ── Year ─────────────────────────────────────────── */
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

/* ── Sticky Navbar ────────────────────────────────── */
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Toggle scrolled class
    if (scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show / hide back-to-top
    if (scrollY > 400) {
        backToTop.removeAttribute('hidden');
    } else {
        backToTop.setAttribute('hidden', '');
    }

    lastScrollY = scrollY;
}, { passive: true });

/* ── Mobile Menu ──────────────────────────────────── */
hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

/* ── Back To Top ──────────────────────────────────── */
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ── Smooth scroll for anchor links ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ── Counter Animation ────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
    let start = null;
    const startVal = 0;

    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * (target - startVal) + startVal);
        el.textContent = value.toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const target = parseInt(entry.target.dataset.target, 10);
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.4 });

// Observe both sets of counters (hero + stats banner)
document.querySelectorAll('[data-target]').forEach(el => {
    counterObserver.observe(el);
});

/* ── Scroll Reveal ────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Staggered delay for grid children
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

// Add reveal class to elements we want to animate
const revealSelectors = [
    '.service-card',
    '.step-item',
    '.why-card',
    '.testimonial-card',
    '.schedule-item',
    '.about-content',
    '.about-visual',
    '.section-header',
    '.checkups-content',
    '.checkups-visual',
    '.register-content',
    '.register-form-wrap',
    '.contact-info',
    '.contact-map',
    '.testing-cta',
];

revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal');
        el.dataset.delay = (i % 4) * 100; // stagger by column
        revealObserver.observe(el);
    });
});

/* ── Appointment Form ─────────────────────────────── */
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic client-side validation
        const required = regForm.querySelectorAll('[required]');
        let valid = true;

        required.forEach(field => {
            field.style.borderColor = '';
            if (!field.value.trim()) {
                field.style.borderColor = '#EF4444';
                valid = false;
            }
        });

        if (!valid) {
            const firstInvalid = regForm.querySelector('[required]:placeholder-shown, [required][value=""]');
            const firstBad = [...required].find(f => !f.value.trim());
            if (firstBad) firstBad.focus();
            return;
        }

        // Email format check
        const emailField = document.getElementById('email');
        if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
            emailField.style.borderColor = '#EF4444';
            emailField.focus();
            return;
        }

        // Simulate async submission
        const submitBtn = document.getElementById('form-submit');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1800));

        // Show success
        regForm.setAttribute('hidden', '');
        formSuccess.removeAttribute('hidden');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    });
}

if (formReset) {
    formReset.addEventListener('click', () => {
        regForm.reset();
        regForm.removeAttribute('hidden');
        formSuccess.setAttribute('hidden', '');
        // Remove any error highlights
        regForm.querySelectorAll('input, select, textarea').forEach(f => {
            f.style.borderColor = '';
        });
    });
}

/* ── Active nav link highlight on scroll ──────────── */
const navSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

navSections.forEach(section => navObserver.observe(section));

// Add active link style dynamically
const style = document.createElement('style');
style.textContent = `
  .nav-link.active { color: var(--orange) !important; background: rgba(255,107,0,.08); }
  .navbar.scrolled .nav-link.active { color: var(--orange) !important; }
`;
document.head.appendChild(style);

/* ── Testimonial Dots (decorative) ────────────────── */
const dots = document.querySelectorAll('.dot');
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        dots.forEach(d => { d.classList.remove('active'); d.setAttribute('aria-selected', 'false'); });
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
    });
});

/* ── Newsletter Form ──────────────────────────────── */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const btn = newsletterForm.querySelector('button');
            btn.textContent = '✓ Subscribed!';
            btn.style.background = '#22C55E';
            emailInput.value = '';
            setTimeout(() => {
                btn.textContent = 'Subscribe';
                btn.style.background = '';
            }, 3000);
        }
    });
}

/* ── Parallax effect on hero orbs ─────────────────── */
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const orbs = document.querySelectorAll('.hero-orb');
    orbs.forEach((orb, i) => {
        const speed = 0.08 + i * 0.04;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, { passive: true });

/* ── Service card hover tilt ──────────────────────── */
document.querySelectorAll('.service-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * 5;
        const tiltY = -(x / rect.width) * 5;
        card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
});

/* ── Prefers-reduced-motion respect ───────────────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition', '0s');
    document.querySelectorAll('.hero-orb, .about-card-secondary, .hero-eye-wrap').forEach(el => {
        el.style.animation = 'none';
    });
}

/* ── Keyboard focus visibility ─────────────────────  */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-focus');
    }
});
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-focus');
});

const focusStyle = document.createElement('style');
focusStyle.textContent = `
  .keyboard-focus *:focus {
    outline: 3px solid var(--orange) !important;
    outline-offset: 3px !important;
  }
`;
document.head.appendChild(focusStyle);
