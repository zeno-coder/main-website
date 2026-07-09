document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation & Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.getElementById('navbar');
    const navItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.querySelector('.stat-number')) {
                    startCounters(entry.target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.scroll-reveal, .fade-in-up').forEach(el => {
        observer.observe(el);
    });

    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);


    function startCounters(section) {
        const counters = section.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); 
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    }


    const form = document.getElementById('booking-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Processing...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.innerText = 'Booked Successfully!';
                btn.style.backgroundColor = '#10B981'; 
                btn.style.borderColor = '#10B981';
                formStatus.innerText = "Thank you! We'll call to confirm your appointment shortly.";
                formStatus.style.color = '#10B981';
                form.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    formStatus.innerText = '';
                }, 3000);
            }, 1500);
        });
    }

});
