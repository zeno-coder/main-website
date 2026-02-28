document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const zenoxTitle = document.getElementById('zenox-animation');

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ZenoX Title Hover/Interactive Effect
    zenoxTitle.addEventListener('mouseover', () => {
        zenoxTitle.style.color = 'var(--text-primary)';
        zenoxTitle.style.webkitTextStroke = '0px';
        zenoxTitle.style.textShadow = '0 0 30px rgba(255, 255, 255, 0.5)';
    });

    zenoxTitle.addEventListener('mouseout', () => {
        zenoxTitle.style.color = 'transparent';
        zenoxTitle.style.webkitTextStroke = '1px var(--text-primary)';
        zenoxTitle.style.textShadow = 'none';
    });

    // Smooth Scroll Reveal
    const revealElements = document.querySelectorAll('.feature-card, .template-item, .portfolio-item');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for reveal animation
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // 3D Tilt Effect
    const tiltElements = document.querySelectorAll('.feature-card, .template-item');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
            el.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(255, 255, 255, 0.1)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
            el.style.boxShadow = 'none';
        });
    });
});
