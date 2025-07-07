// Function to check if device is mobile
function isMobileDevice() {
    return window.innerWidth <= 1100 || (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

// Scroll to target section smoothly
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Handle click buttons
const handleClick = () => scrollToSection('enrollment_section');

['.get_started', '.get_started_programs', '.get_started_disclaimer'].forEach(selector => {
    const btn = document.querySelector(selector);
    if (btn) btn.addEventListener('click', handleClick);
});

// Buttons for section scroll
const sectionScrollMap = {
    '.explore-btn': 'program_sections',
    '.video': 'video_section',
    '.programs': 'program_sections',
    '.enrollment': 'enrollment_section',
    '.contact': 'contact_section',
    '.footer_home': 'hero_section',
    '.footer_about': 'about_section',
    '.footer_programs': 'program_sections',
    '.footer_enrollment': 'enrollment_section'
};

for (const [btnSelector, targetId] of Object.entries(sectionScrollMap)) {
    const btn = document.querySelector(btnSelector);
    if (btn) {
        btn.addEventListener('click', () => scrollToSection(targetId));
    }
}

// Animate content on scroll into view
const animatedDivs = document.querySelectorAll('.swiper-slide .animated > div');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.transition = 'transform 1s ease, opacity 1s ease';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.opacity = '1';
        } else {
            entry.target.style.transition = 'none';
            entry.target.style.transform = 'translateY(50px)';
            entry.target.style.opacity = '0';
        }
    });
}, {
    threshold: 0.1
});

animatedDivs.forEach(el => observer.observe(el));

// Background image randomizer for hero section
window.addEventListener('DOMContentLoaded', () => {
    const backgroundSlider = document.querySelector('.background-slider');
    if (!backgroundSlider) return;

    const imagePaths = [
        './assets/images/20250619_011059.png',
        './assets/images/hero_image_3.png',
        './assets/images/hero_image_4.png',
        './assets/images/hero_image_5.png'
    ];

    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    const bgSlide = backgroundSlider.querySelector('.bg-slide');
    if (bgSlide) {
        bgSlide.style.backgroundImage = `url('${imagePaths[randomIndex]}')`;
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const closeMenu = document.querySelector('.close-menu');

if (mobileMenuToggle && mobileNav && closeMenu) {
    let isMenuOpen = false;

    function openMenu() {
        isMenuOpen = true;
        mobileNav.classList.add('active');
        mobileMenuToggle.innerHTML = '×';
        mobileMenuToggle.classList.add('menu-open');
        closeMenu.style.display = 'none';
    }

    function closeMenuFunc() {
        isMenuOpen = false;
        mobileNav.classList.remove('active');
        mobileMenuToggle.innerHTML = '☰';
        mobileMenuToggle.classList.remove('menu-open');
        closeMenu.style.display = 'block';
    }

    mobileMenuToggle.addEventListener('click', () => {
        isMenuOpen ? closeMenuFunc() : openMenu();
    });

    closeMenu.addEventListener('click', closeMenuFunc);

    document.addEventListener('click', function(event) {
        const isClickInside = mobileNav.contains(event.target) || mobileMenuToggle.contains(event.target);
        if (!isClickInside && isMenuOpen) closeMenuFunc();
    });

    const navLinks = mobileNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.addEventListener('click', closeMenuFunc));
}

// CSS injection for transitions
const style = document.createElement('style');
style.textContent = `
    html {
        scroll-behavior: smooth;
    }
    .mobile-menu-toggle {
        transition: transform 0.3s ease;
        font-size: 24px;
        background: none;
        border: none;
        cursor: pointer;
    }
    .mobile-menu-toggle.menu-open {
        transform: rotate(180deg);
    }
    .mobile-nav {
        transition: all 0.3s ease;
        transform: translateX(-100%);
        opacity: 0;
        visibility: hidden;
    }
    .mobile-nav.active {
        transform: translateX(0);
        opacity: 1;
        visibility: visible;
    }
`;
document.head.appendChild(style);
