// Check if device is mobile
function isMobileDevice() {
    return window.innerWidth <= 1100 || typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1;
}

// Animate content on scroll using IntersectionObserver
function animateContentOnScroll() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const animatedDiv = entry.target.querySelector('.animated > div');
            if (!animatedDiv) return;

            if (entry.isIntersecting) {
                animatedDiv.style.transition = 'transform 1s ease, opacity 1s ease';
                animatedDiv.style.transform = 'translateY(0)';
                animatedDiv.style.opacity = '1';
            } else {
                animatedDiv.style.transition = 'none';
                animatedDiv.style.transform = 'translateY(50px)';
                animatedDiv.style.opacity = '0';
            }
        });
    }, {
        threshold: 0.3
    });

    document.querySelectorAll('.swiper-slide').forEach(section => {
        observer.observe(section);
    });
}

// Scroll to section on button click
function setupScrollButtons() {
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const btnMap = {
        '.get_started': 'enrollment_section',
        '.get_started_programs': 'enrollment_section',
        '.get_started_disclaimer': 'enrollment_section',
        '.explore-btn': 'program_sections',
        '.enrollment': 'enrollment_section',
        '.footer_enrollment': 'enrollment_section',
        '.video': 'about_section', // adjust if needed
        '.programs': 'program_sections',
        '.footer_programs': 'program_sections',
        '.footer_about': 'about_section',
        '.contact': 'contact_section',
        '.footer_home': 'hero_section'
    };

    Object.entries(btnMap).forEach(([selector, targetId]) => {
        const el = document.querySelector(selector);
        if (el) el.addEventListener('click', () => scrollTo(targetId));
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.mobile-nav');
    const close = document.querySelector('.close-menu');

    if (!toggle || !nav || !close) return;

    const navLinks = nav.querySelectorAll('.nav-link');

    function openMenu() {
        nav.classList.add('active');
        toggle.classList.add('menu-open');
        toggle.innerHTML = '×';
    }

    function closeMenu() {
        nav.classList.remove('active');
        toggle.classList.remove('menu-open');
        toggle.innerHTML = '☰';
    }

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('active')) closeMenu();
        else openMenu();
    });

    close.addEventListener('click', closeMenu);

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            closeMenu();
        }
    });

    navLinks.forEach(link => link.addEventListener('click', closeMenu));
}

// Background image randomizer
function setupRandomBackground() {
    const backgroundSlider = document.querySelector('.background-slider');
    if (!backgroundSlider) return;

    const images = [
        './assets/images/20250619_011059.png',
        './assets/images/hero_image_3.png',
        './assets/images/hero_image_4.png',
        './assets/images/hero_image_5.png'
    ];
    const selected = images[Math.floor(Math.random() * images.length)];
    const bgSlide = backgroundSlider.querySelector('.bg-slide');
    if (bgSlide) {
        bgSlide.style.backgroundImage = `url('${selected}')`;
    }
}

// Add CSS dynamically for animated content
function injectScrollAnimationCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .animated > div {
            transform: translateY(50px);
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    setupScrollButtons();
    setupMobileMenu();
    setupRandomBackground();
    animateContentOnScroll();
    injectScrollAnimationCSS();
});

