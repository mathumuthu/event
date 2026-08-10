/* ============================================
   STACKLY EVENT WEBSITE - JAVASCRIPT
   Interactive Components & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const scrollTop = document.getElementById('scrollTop');
    const particlesContainer = document.getElementById('particles');
    const counters = document.querySelectorAll('.counter');
    const heartBtns = document.querySelectorAll('.heart-btn');
    const dots = document.querySelectorAll('.dot');
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const newsletterForm = document.getElementById('newsletterForm');
    const footerForm = document.getElementById('footerForm');

    // ============================================
    // STICKY HEADER
    // ============================================
    function handleScroll() {
        const scrollY = window.scrollY;

        // Add/remove scrolled class for header styling
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/hide scroll-to-top button
        if (scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // ============================================
    // MOBILE HAMBURGER MENU
    // ============================================
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // SCROLL TO TOP
    // ============================================
    scrollTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // HERO PARTICLES EFFECT
    // ============================================
    function createParticles() {
        if (!particlesContainer) return;

        const particleCount = 25;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            // Random size
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            // Random animation delay and duration
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // ============================================
    // COUNTER ANIMATION (Stats Section)
    // ============================================
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            // Format number with K/M suffix
            if (target >= 100000) {
                counter.textContent = (current / 1000).toFixed(0) + 'K';
            } else if (target >= 1000) {
                counter.textContent = (current / 1000).toFixed(0) + 'K';
            } else {
                counter.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Final formatted value
                if (target >= 1000) {
                    counter.textContent = (target / 1000).toFixed(0) + 'K';
                } else {
                    counter.textContent = target;
                }
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ============================================
    // HEART BUTTON TOGGLE (Wishlist)
    // ============================================
    heartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const icon = this.querySelector('i');
            this.classList.toggle('active');

            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');

                // Pop animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================
    let currentSlide = 0;
    const totalSlides = dots.length;

    function goToSlide(index) {
        if (!testimonialsTrack) return;

        currentSlide = index;

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Calculate scroll position (for mobile swipe)
        // On desktop, we show multiple cards; on mobile, we scroll
        if (window.innerWidth <= 768) {
            const cardWidth = testimonialsTrack.children[0].offsetWidth + 24; // gap
            testimonialsTrack.style.transform = `translateX(-${index * cardWidth}px)`;
        }
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Auto-slide testimonials on mobile
    let autoSlideInterval;

    function startAutoSlide() {
        if (window.innerWidth <= 768) {
            autoSlideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                goToSlide(currentSlide);
            }, 4000);
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    startAutoSlide();

    // Pause on hover
    if (testimonialsTrack) {
        testimonialsTrack.addEventListener('mouseenter', stopAutoSlide);
        testimonialsTrack.addEventListener('mouseleave', startAutoSlide);
    }

    // Touch/swipe support for testimonials
    let touchStartX = 0;
    let touchEndX = 0;

    if (testimonialsTrack) {
        testimonialsTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialsTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
            } else if (diff < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        }
    }

    // ============================================
    // SCROLL REVEAL ANIMATION
    // ============================================
    const revealElements = document.querySelectorAll(
        '.event-card, .category-card, .feature-item, .blog-card, .stat-item, .brand-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay based on index
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ============================================
    // NEWSLETTER FORM HANDLING
    // ============================================
    function handleFormSubmit(form, message) {
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            if (email && email.includes('@')) {
                // Show success feedback
                const btn = this.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Subscribed!';
                btn.style.background = '#10B981';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    this.reset();
                }, 2000);
            } else {
                // Show error feedback
                const input = this.querySelector('input');
                input.style.borderColor = '#EF4444';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 2000);
            }
        });
    }

    handleFormSubmit(newsletterForm, 'Thank you for subscribing!');
    handleFormSubmit(footerForm, 'Thank you for subscribing!');

    // ============================================
    // SEARCH BAR INTERACTION
    // ============================================
    const searchBtn = document.getElementById('searchBtn');

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // Scroll to search bar
            const searchBar = document.querySelector('.search-bar');
            if (searchBar) {
                searchBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus first input
                setTimeout(() => {
                    const firstInput = searchBar.querySelector('input');
                    if (firstInput) firstInput.focus();
                }, 500);
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    function setActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNav);

    // ============================================
    // PARALLAX EFFECT (Hero)
    // ============================================
    const heroImage = document.querySelector('.hero-image img');

    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.15;
            if (rate < 100) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // ============================================
    // CATEGORY CARD HOVER SOUND EFFECT (Visual)
    // ============================================
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });

    // ============================================
    // PRELOADER (Optional enhancement)
    // ============================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    console.log('Stackly website initialized successfully!');
});