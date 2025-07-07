// Utility: Check if device is mobile
function isMobileDevice() {
  return window.innerWidth <= 1100 || typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1;
}

// Handle Get Started button clicks
const handleClick = () => {
  if (isMobileDevice()) {
    const target = document.getElementById('enrollment_section');
    if (target) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' }); // No smooth scroll
    }
  } else if (typeof swiper !== 'undefined') {
    swiper.slideTo(5); // Desktop slide
  }
};

// Assign buttons to handler
['.get_started', '.get_started_programs', '.get_started_disclaimer'].forEach(selector => {
  const button = document.querySelector(selector);
  if (button) button.addEventListener('click', handleClick);
});

// Random background image setup
document.addEventListener('DOMContentLoaded', function () {
  const backgroundSlider = document.querySelector('.background-slider');
  if (!backgroundSlider) return;

  const imagePaths = [
    './assets/images/20250619_011059.png',
    './assets/images/hero_image_3.png',
    './assets/images/hero_image_4.png',
    './assets/images/hero_image_5.png'
  ];
  const randomImage = imagePaths[Math.floor(Math.random() * imagePaths.length)];
  const bgSlide = backgroundSlider.querySelector('.bg-slide');
  if (bgSlide) {
    bgSlide.style.backgroundImage = `url('${randomImage}')`;
  }
});

// Animate content in slide (desktop only)
function animateContentOnSlideChange(currentIndex, previousIndex, isInit = false) {
  const slides = document.querySelectorAll('.swiper-slide');
  const currentSlide = slides[currentIndex];
  if (!currentSlide) return;

  const content = currentSlide.querySelector('.animated > div');
  if (!content) return;

  // Reset all animated elements
  document.querySelectorAll('.swiper-slide .animated > div').forEach(el => {
    el.style.transition = 'none';
    el.style.transform = '';
    el.style.opacity = '';
  });

  // Animate out previous content
  if (!isInit && previousIndex !== undefined) {
    const prevSlide = slides[previousIndex];
    const prevContent = prevSlide?.querySelector('.animated > div');
    if (prevContent) {
      const direction = currentIndex > previousIndex ? -50 : 50;
      prevContent.style.transition = 'transform 1.8s ease, opacity 1.8s ease';
      prevContent.style.transform = `translateY(${direction}px)`;
      prevContent.style.opacity = '0';
    }
  }

  // Animate current content
  const direction = previousIndex === undefined ? 0 : (currentIndex > previousIndex ? 50 : -50);
  content.style.transform = `translateY(${direction}px)`;
  content.style.opacity = '0';
  void content.offsetWidth; // reflow
  content.style.transition = 'transform 1.8s ease, opacity 1.8s ease';
  content.style.transform = 'translateY(0)';
  content.style.opacity = '1';

  setTimeout(() => {
    content.style.transition = 'none';
  }, 2000);
}

// Swiper or normal scroll setup
document.addEventListener('DOMContentLoaded', () => {
  const swiperContainer = document.querySelector('.mySwiper');

  if (!isMobileDevice()) {
    // Desktop: Initialize Swiper
    window.swiper = new Swiper('.mySwiper', {
      direction: 'vertical',
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 1000,
      mousewheel: {
        enabled: true,
        sensitivity: 1,
        thresholdDelta: 50,
        thresholdTime: 500,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      touchRatio: 0,
      grabCursor: false,
      effect: 'slide',
      allowTouchMove: false,
      preventInteractionOnTransition: true,
      on: {
        init: function () {
          animateContentOnSlideChange(this.activeIndex, null, true);
        },
        slideChangeTransitionStart: function () {
          animateContentOnSlideChange(this.activeIndex, this.previousIndex);
        }
      }
    });
  } else {
    // Mobile: Destroy swiper structure completely
    if (swiperContainer) {
      swiperContainer.classList.remove('swiper', 'mySwiper');
    }

    const wrapper = document.querySelector('.swiper-wrapper');
    if (wrapper) {
      wrapper.classList.remove('swiper-wrapper');
      wrapper.style.transform = 'none';
      wrapper.style.height = 'auto';
    }

    document.querySelectorAll('.swiper-slide').forEach(slide => {
      slide.classList.remove('swiper-slide');
      slide.style.height = 'auto';
    });

    // Force default scroll
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.overflowY = 'scroll';
    document.body.style.height = 'auto';
  }
});
