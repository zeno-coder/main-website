document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const stats = document.querySelectorAll('.stat-number');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    let started = false; 
    function startCount(el) {
        const goal = parseInt(el.dataset.target);
        let count = 0;
        const speed = 2000 / goal;
        const timer = setInterval(() => {
            count += 1 + Math.floor(goal / 100); 
            if (count >= goal) {
                el.innerText = goal + "+";
                clearInterval(timer);
            } else {
                el.innerText = count;
            }
        }, 20); 
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add simple fade in for sections if needed
                entry.target.classList.add('visible');

                // Trigger stats only once
                if (entry.target.classList.contains('stats-section') && !started) {
                    stats.forEach(stat => startCount(stat));
                    started = true;
                }
            }
        });
    }, observerOptions);

    // Observe stats section
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) sectionObserver.observe(statsSection);

    // Simple reveal on scroll for generic elements
    const revealElements = document.querySelectorAll('.service-card, .about-card, .gallery-item');

    // Add initial style for JS reveal
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .service-card, .about-card, .gallery-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        .reveal-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
});
