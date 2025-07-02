// Function to check if device is mobile
function isMobileDevice() {
    return window.innerWidth <= 1100 || (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

const handleClick = () => {
    if (isMobileDevice()) {
        // For mobile devices - scroll to enrollment section
        document.getElementById('enrollment_section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (typeof swiper !== 'undefined') {
        // For desktop - slide to slide 5
        swiper.slideTo(5);
    }
};

// Apply to all buttons
const buttons = [
    '.get_started',
    '.get_started_programs',
    '.get_started_disclaimer',
];

buttons.forEach(selector => {
    const button = document.querySelector(selector);
    if (button) {
        button.addEventListener('click', handleClick);
    }
});


// Initialize Swiper only for non-mobile devices
let swiper;
if (!isMobileDevice()) {
    swiper = new Swiper('.mySwiper', {
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
        touchRatio: 0, // Disable touch on desktop
        touchAngle: 45,
        grabCursor: false,
        effect: 'slide',
        allowTouchMove: false, // Disable touch move
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

    // For mobile devices, we'll add a class to enable normal scrolling
    document.querySelector('.swiper').classList.add('swiper-desktop-only');
} else {
    // Enable normal scrolling for mobile
    document.querySelector('.swiper')?.classList.add('swiper-mobile-scroll');
    document.querySelector('.swiper-wrapper')?.classList.add('mobile-scroll-wrapper');
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.classList.add('mobile-scroll-slide');
    });
}

// Improved content animation function (works for both desktop and mobile)
function animateContentOnSlideChange(currentIndex, previousIndex, isInit = false) {
    const currentSlide = document.querySelectorAll('.swiper-slide')[currentIndex];
    if (!currentSlide) return;

    const content = currentSlide.querySelector('.animated > div');
    if (!content) return;

    // Reset all content positions first
    document.querySelectorAll('.swiper-slide .animated > div').forEach(el => {
        el.style.transform = '';
        el.style.opacity = '';
        el.style.transition = 'none';
    });

    // Force reflow
    void currentSlide.offsetWidth;

    if (!isInit && previousIndex !== undefined) {
        const previousSlide = document.querySelectorAll('.swiper-slide')[previousIndex];
        const prevContent = previousSlide?.querySelector('.animated > div');

        if (prevContent) {
            // Animate out previous content
            const direction = currentIndex > previousIndex ? -50 : 50;
            prevContent.style.transition = 'transform 1.8s ease, opacity 1.8s ease';
            prevContent.style.transform = `translateY(${direction}px)`;
            prevContent.style.opacity = '0';
        }
    }

    // Set initial state for current content
    const initialY = isInit ? 0 : (previousIndex === undefined ? 0 : (currentIndex > previousIndex ? 50 : -50));
    content.style.transform = `translateY(${initialY}px)`;
    content.style.opacity = '0';

    // Force reflow before animating
    void content.offsetWidth;

    // Animate to final position
    content.style.transition = 'transform 1.8s ease, opacity 1.8s ease';
    content.style.transform = 'translateY(0)';
    content.style.opacity = '1';

    setTimeout(() => {
        content.style.transition = 'none';
    }, 2000);
}

// Initialize background sliders for all sections
function initBackgroundSliders() {
    const sliders = document.querySelectorAll('.background-slider');

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.bg-slide');
        let currentSlide = 0;

        // Set initial positions for slides
        slides.forEach((slide, index) => {
            slide.style.transform = `translateY(${index * 100}%)`;
        });

        // If this is the hero section, add arrow functionality
        if (slider.closest('.hero-section')) {
            const arrow = document.getElementById('scrollArrow');
            if (arrow) {
                arrow.addEventListener('click', () => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    slider.style.transform = `translateY(-${currentSlide * 100}%)`;
                });
            }
        }
    });
}

// Initialize all background sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initBackgroundSliders()
    // Video controls
    const video = document.querySelector('.video-background video');
const playBtn = document.getElementById('videoControlBtn');
const videoControls = document.getElementById('videoControls');
const videoOverlay = document.querySelector('.video-overlay');

if (video && playBtn && videoControls) {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const videoProgress = document.getElementById('videoProgress');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const skipBackward = document.getElementById('skipBackward');
    const skipForward = document.getElementById('skipForward');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');

    let isPlaying = false;
    let isMouseDown = false;
    let controlsTimeout;

    // Initialize video
    video.muted = true;
    
    // Initially hide controls after 3 seconds
    hideControlsAfterDelay();

    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Update time display
    function updateTimeDisplay() {
        currentTimeDisplay.textContent = formatTime(video.currentTime);
        durationDisplay.textContent = formatTime(video.duration);
    }

    // Update progress bar
    function updateProgress() {
        if (!isMouseDown) {
            videoProgress.value = (video.currentTime / video.duration) * 100;
        }
        updateTimeDisplay();
    }

    // Show controls
    function showControls() {
        videoControls.style.display = 'flex';
        playBtn.style.display = 'block';
    }

    // Hide controls
    function hideControls() {
        if (!video.paused) {
            videoControls.style.display = 'none';
            playBtn.style.display = 'none';
        }
    }

    // Hide controls after 3 seconds delay
    function hideControlsAfterDelay() {
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            hideControls();
        }, 3000);
    }

    // Show controls and reset hide timer
    function showControlsAndResetTimer() {
        showControls();
        hideControlsAfterDelay();
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (video.paused) {
            video.play();
            playPauseBtn.querySelector('path').setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
            playBtn.querySelector('path').setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
            isPlaying = true;
            showControlsAndResetTimer();
        } else {
            video.pause();
            playPauseBtn.querySelector('path').setAttribute('d', 'M8 5v14l11-7z');
            playBtn.querySelector('path').setAttribute('d', 'M8 5v14l11-7z');
            isPlaying = false;
            showControls(); // Keep controls visible when paused
            clearTimeout(controlsTimeout);
        }
    }

    // Event listeners
    playBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        togglePlayPause();
    });

    playPauseBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        togglePlayPause();
    });

    video.addEventListener('click', function () {
        togglePlayPause();
    });

    video.addEventListener('play', function () {
        playPauseBtn.querySelector('path').setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
        playBtn.querySelector('path').setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
        isPlaying = true;
        showControlsAndResetTimer();
    });

    video.addEventListener('pause', function () {
        playPauseBtn.querySelector('path').setAttribute('d', 'M8 5v14l11-7z');
        playBtn.querySelector('path').setAttribute('d', 'M8 5v14l11-7z');
        isPlaying = false;
        showControls(); // Keep controls visible when paused
        clearTimeout(controlsTimeout);
    });

    video.addEventListener('ended', function () {
        playPauseBtn.querySelector('path').setAttribute('d', 'M8 5v14l11-7z');
        playBtn.querySelector('path').setAttribute('d', 'M8 5v14l11-7z');
        isPlaying = false;
        showControls(); // Keep controls visible when ended
        clearTimeout(controlsTimeout);
    });

    video.addEventListener('timeupdate', updateProgress);

    video.addEventListener('loadedmetadata', function () {
        videoProgress.value = 0;
        updateTimeDisplay();
    });

    videoProgress.addEventListener('input', function () {
        const seekTime = (videoProgress.value / 100) * video.duration;
        video.currentTime = seekTime;
    });

    videoProgress.addEventListener('mousedown', function () {
        isMouseDown = true;
    });

    videoProgress.addEventListener('mouseup', function () {
        isMouseDown = false;
    });

    skipBackward.addEventListener('click', function () {
        video.currentTime = Math.max(0, video.currentTime - 5);
        showControlsAndResetTimer();
    });

    skipForward.addEventListener('click', function () {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
        showControlsAndResetTimer();
    });

    volumeBtn.addEventListener('click', function () {
        video.muted = !video.muted;
        if (video.muted) {
            volumeBtn.querySelector('path').setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
        } else {
            volumeBtn.querySelector('path').setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
            volumeSlider.value = video.volume;
        }
        showControlsAndResetTimer();
    });

    volumeSlider.addEventListener('input', function () {
        video.volume = volumeSlider.value;
        video.muted = false;
        if (video.volume > 0) {
            volumeBtn.querySelector('path').setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
        }
        showControlsAndResetTimer();
    });

    // Show controls when mouse moves in video area and reset timer
    video.addEventListener('mousemove', function () {
        showControlsAndResetTimer();
    });

    // Show controls when mouse enters video area
    video.addEventListener('mouseenter', function () {
        showControlsAndResetTimer();
    });

    // Show controls when mouse moves over video-overlay
    if (videoOverlay) {
        videoOverlay.addEventListener('mousemove', function () {
            showControlsAndResetTimer();
        });

        videoOverlay.addEventListener('mouseenter', function () {
            showControlsAndResetTimer();
        });
    }

    // Optional: Also show controls when mouse leaves and enters the controls area
    videoControls.addEventListener('mouseenter', function () {
        showControls();
        clearTimeout(controlsTimeout);
    });

    videoControls.addEventListener('mouseleave', function () {
        if (!video.paused) {
            hideControlsAfterDelay();
        }
    });
}
    
const exploreBtn = document.querySelector('.explore-btn');
if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        if (isMobileDevice()) {
            // Mobile - scroll to program section
            document.getElementById('program_sections')?.scrollIntoView({ behavior: 'smooth' });
        } else if (typeof swiper !== 'undefined') {
            // Desktop - go directly to slide 3 (zero-based index 2)
            swiper.slideTo(3); // Change to 3 if your swiper uses 1-based index
        }
    });
}

    const videoButton = document.querySelector('.video');
    if (videoButton && typeof swiper !== 'undefined') {
        videoButton.addEventListener('click', () => {
            swiper.slideTo(2); 
        });
    }

    const programsButton = document.querySelector('.programs');
    if (programsButton && typeof swiper !== 'undefined') {
        programsButton.addEventListener('click', () => {
            swiper.slideTo(3); 
        });
    }

    const enrollmentButton = document.querySelector('.enrollment');
    if (enrollmentButton && typeof swiper !== 'undefined') {
        enrollmentButton.addEventListener('click', () => {
            swiper.slideTo(5); 
        });
    }

    const contactButton = document.querySelector('.contact');
    if (contactButton && typeof swiper !== 'undefined') {
        contactButton.addEventListener('click', () => {
            swiper.slideTo(7); 
        });
    }

    const homeButton = document.querySelector('.footer_home');
    if (homeButton && typeof swiper !== 'undefined') {
        homeButton.addEventListener('click', () => {
            swiper.slideTo(0); 
        });
    }

    const footerAboutButton = document.querySelector('.footer_about');
    if (footerAboutButton && typeof swiper !== 'undefined') {
        footerAboutButton.addEventListener('click', () => {
            swiper.slideTo(2); 
        });
    }

    const footerProgramsButton = document.querySelector('.footer_programs');
    if (footerProgramsButton && typeof swiper !== 'undefined') {
        footerProgramsButton.addEventListener('click', () => {
            swiper.slideTo(3); 
        });
    }

    const footerEnrollmentButton = document.querySelector('.footer_enrollment');
    if (footerEnrollmentButton && typeof swiper !== 'undefined') {
        footerEnrollmentButton.addEventListener('click', () => {
            swiper.slideTo(5); 
        });
    }

    // const getStarted = document.querySelector('.get_started','.get_started_programs');
    // if (getStarted && typeof swiper !== 'undefined') {
    //     getStarted.addEventListener('click', () => {
    //         swiper.slideTo(5); 
    //     });
    // }
    // const getStartedPrograme = document.querySelector('.get_started_programs');
    // if (getStartedPrograme && typeof swiper !== 'undefined') {
    //     getStartedPrograme.addEventListener('click', () => {
    //         swiper.slideTo(5); 
    //     });
    // }
    // const getStartedDisclaimer = document.querySelector('.get_started_disclaimer');
    // if (getStartedDisclaimer && typeof swiper !== 'undefined') {
    //     getStartedDisclaimer.addEventListener('click', () => {
    //         swiper.slideTo(5); 
    //     });
    // }
});

function openPopup(index) {
    const popupContent = document.getElementById('popupContent');
    const popupOverlay = document.getElementById('popupOverlay');

    switch (index) {
        case 1:
            popupContent.innerHTML = `
            <form id="class-registration-form">
            <h1 class="popup_header">JOIN OUR CLASSES</h1>
                    <div class="form-group">
                        <label for="full-name">Full Name *</label>
                        <input type="text" id="full-name" placeholder="Full Name" name="full-name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" placeholder="Email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone *</label>
                        <input type="tel" id="phone" placeholder="Phone Number" name="phone" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Are you asthmatic?</label>
                        <div>
                            <div class="checkbox-group">
                                <input class="popup_checkbox" type="checkbox" id="asthmatic-yes" name="asthmatic" value="yes">
                                <label for="asthmatic-yes">Yes</label>
                            </div>
                            <div class="checkbox-group">
                                <input class="popup_checkbox" type="checkbox" id="asthmatic-no" name="asthmatic" value="no">
                                <label for="asthmatic-no">No</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Do you have any physical injury we should be mindful of?</label>
                        <div>
                            <div class="checkbox-group">
                                <input class="popup_checkbox" type="checkbox" id="injury-yes" name="injury" value="yes">
                                <label for="injury-yes">Yes</label>
                            </div>
                            <div class="checkbox-group">
                                <input class="popup_checkbox" type="checkbox" id="injury-no" name="injury" value="no">
                                <label for="injury-no">No</label>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" class="submit-btn">SUBMIT & BOOK YOUR GRILL</button>
                    
                    <p class="disclaimer">"By submitting this form, you acknowledge and accept the risks associated with martial training. The instructor and the foundation are not liable for any injuries sustained during practice. We do not share your information with third parties."</p>
                </form>
            `;

            // Call the checkbox function AFTER setting innerHTML
            handleCheckboxGroup('asthmatic-yes', 'asthmatic-no');
            handleCheckboxGroup('injury-yes', 'injury-no');
            break;

        case 2:
            popupContent.textContent = 'Second Popup';
            break;

        case 3:
            popupContent.textContent = 'Third Popup';
            break;
    }

    popupOverlay.style.display = 'flex';

    // Define the handleCheckboxGroup function outside the switch statement
    function handleCheckboxGroup(group1Id, group2Id) {
        const checkbox1 = document.getElementById(group1Id);
        const checkbox2 = document.getElementById(group2Id);

        if (checkbox1 && checkbox2) {
            checkbox1.addEventListener('change', function () {
                if (this.checked) {
                    checkbox2.checked = false;
                }
            });

            checkbox2.addEventListener('change', function () {
                if (this.checked) {
                    checkbox1.checked = false;
                }
            });
        }
    }
}

function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none';
}

// Mobile menu toggle functionality
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const closeMenu = document.querySelector('.close-menu');

if (mobileMenuToggle && mobileNav && closeMenu) {
    let isMenuOpen = false;

    // Function to open menu
    function openMenu() {
        isMenuOpen = true;
        mobileNav.classList.add('active'); // Add active class to show mobile nav
        mobileMenuToggle.innerHTML = '×'; // Change bar icon to X icon
        mobileMenuToggle.classList.add('menu-open'); // Optional: add class for styling
        // Hide the close button since we're using the toggle button now
        closeMenu.style.display = 'none';
    }

    // Function to close menu
    function closeMenuFunc() {
        isMenuOpen = false;
        mobileNav.classList.remove('active'); // Remove active class to hide mobile nav
        mobileMenuToggle.innerHTML = '☰'; // Change X icon back to bar icon
        mobileMenuToggle.classList.remove('menu-open'); // Optional: remove class
        // Show the close button back (if you want to keep both options)
        closeMenu.style.display = 'block';
    }

    // Toggle menu when clicking the main toggle button
    mobileMenuToggle.addEventListener('click', function() {
        if (isMenuOpen) {
            closeMenuFunc();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking the close button (×)
    closeMenu.addEventListener('click', function() {
        closeMenuFunc();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mobileNav.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && isMenuOpen) {
            closeMenuFunc();
        }
    });

    // Close menu when clicking on nav links
    const navLinks = mobileNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenuFunc();
        });
    });
}

// Optional: Add CSS for smooth transitions
const style = document.createElement('style');
style.textContent = `
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