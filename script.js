// ================================
// ALMOUED TRAVEL - FEME INSPIRED JAVASCRIPT
// ================================

(function () {
    'use strict';

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        console.log('🚀 Initializing Almoued Travel website...');

        // Clean up any problematic content first
        cleanupContent();

        // Initialize core features
        initializeNavigation();
        initializeMobileMenu();
        initializeContactForm();
        initializeAnimations();
        initializeCounters();
        hideLoadingScreen();
        initializeBackToTop();
        initializeBackToTop();
        initializeScrollEffects();
        initializeParallax();
        initializeScrollProgressBar();

        // Initialize AOS if available
        setTimeout(initializeAOS, 100);

        console.log('✅ Almoued Travel website ready!');
    });

    // ================================
    // CLEANUP PROBLEMATIC CONTENT
    // ================================

    function cleanupContent() {
        // Remove any text nodes that contain CSS-like content
        const textNodes = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('style=') ||
                node.textContent.includes('opacity:1;transform:') ||
                node.textContent.includes('transition:0.6s')) {
                textNodes.push(node);
            }
        }

        // Remove problematic text nodes
        textNodes.forEach(node => {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });

        // Remove any elements with problematic inline styles
        document.querySelectorAll('[style*="opacity:1;transform:translateY"]').forEach(el => {
            el.removeAttribute('style');
        });

        console.log('🧹 Content cleanup complete');
    }

    // ================================
    // SCROLL PROGRESS BAR
    // ================================
    function initializeScrollProgressBar() {
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // ================================
    // PAGE SCROLL CONTROL
    // ================================

    // Ensure page starts from top after loading (Modified to allow hash navigation)
    document.addEventListener('DOMContentLoaded', function () {
        // Only scroll to top if there's no hash in the URL
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }

        // Ensure we start from top when page loads if no hash
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        }
    });

    // Enhanced loading screen control (Modified to allow hash navigation)
    window.addEventListener('load', function () {
        // Only scroll to top if there's no hash in the URL
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }

        // Hide loading screen after a short delay
        setTimeout(function () {
            const loading = document.getElementById('loading');
            if (loading) {
                loading.classList.add('hidden');
                // Remove loading screen from DOM after animation
                setTimeout(function () {
                    loading.style.display = 'none';
                }, 800);
            }
        }, 400); // Reduced delay for faster UX
    });

    // Prevent scroll restoration
    window.addEventListener('beforeunload', function () {
        window.scrollTo(0, 0);
    });

    // ================================
    // AOS INITIALIZATION
    // ================================

    function initializeAOS() {
        if (typeof AOS !== 'undefined') {
            try {
                AOS.init({
                    duration: 800,
                    delay: 100,
                    once: true,
                    offset: 50,
                    easing: 'ease-out-cubic',
                    disable: function () {
                        return window.innerWidth < 768;
                    }
                });

                // Refresh AOS
                AOS.refresh();
                console.log('✨ AOS animations initialized');
            } catch (error) {
                console.warn('⚠️ AOS failed, using fallback animations');
                initializeFallbackAnimations();
            }
        } else {
            console.warn('⚠️ AOS not found, using fallback animations');
            initializeFallbackAnimations();
        }
    }

    function initializeFallbackAnimations() {
        const elements = document.querySelectorAll('[data-aos]');

        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'all 0.8s ease-out';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s ease-out';
            observer.observe(element);
        });
    }

    // ================================
    // NAVIGATION
    // ================================

    function initializeNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-menu a');
        const logo = document.querySelector('.logo-container');

        if (!navbar) return;

        // Throttle function for scroll events
        let scrollTimeout;

        // Navbar scroll effect - remains solid white
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            scrollTimeout = setTimeout(() => {
                const scrolled = window.scrollY > 50;
                navbar.classList.toggle('scrolled', scrolled);
            }, 10);
        });

        // Active link highlighting
        let activeTimeout;
        window.addEventListener('scroll', () => {
            if (activeTimeout) {
                clearTimeout(activeTimeout);
            }

            activeTimeout = setTimeout(() => {
                updateActiveLink();
            }, 50);
        });

        function updateActiveLink() {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.remove('active');

                if (href === currentPath) {
                    link.classList.add('active');
                }
            });
        }

        // Smooth scroll navigation for same-page hash links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Check if it's a hash link for the current page
                const isPureHash = href.startsWith('#');
                const isCurrentPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
                const isIndexHash = href.startsWith('index.html#');

                if (isPureHash || (isIndexHash && isCurrentPage)) {
                    const targetId = isPureHash ? href.substring(1) : href.split('#')[1];
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        e.preventDefault();
                        const offsetTop = targetElement.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });

                        // Update active state manually on click
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
                // Allow normal navigation for .html links that are not current page hashes
            });
        });

        // Logo click
        if (logo) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', () => {
                if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    window.location.href = 'index.html';
                }
            });
        }

        console.log('🧭 Navigation initialized');
    }

    // ================================
    // MOBILE MENU
    // ================================

    function initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const navContainer = document.querySelector('.nav-container');

        if (!mobileMenuBtn || !navContainer) return;

        let mobileMenu = null;
        let isOpen = false;

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        function toggleMobileMenu() {
            isOpen = !isOpen;

            if (isOpen) {
                createMobileMenu();
                showMobileMenu();
            } else {
                hideMobileMenu();
            }

            animateHamburger(isOpen);
        }

        function createMobileMenu() {
            if (mobileMenu) return;

            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-nav-menu';
            mobileMenu.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                padding: 2rem;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border-radius: 0 0 20px 20px;
                z-index: 1000;
                display: none;
                flex-direction: column;
                animation: slideDown 0.3s ease;
            `;

            const navLinks = document.querySelectorAll('.nav-menu a');
            navLinks.forEach((link, index) => {
                const mobileLink = document.createElement('a');
                mobileLink.href = link.getAttribute('href');
                mobileLink.textContent = link.textContent;
                mobileLink.style.cssText = `
                    padding: 1rem 0;
                    text-decoration: none;
                    color: #1F2937;
                    border-bottom: 1px solid #E5E7EB;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    opacity: 0;
                    animation: fadeInUp 0.3s ease ${index * 0.1}s forwards;
                `;

                mobileLink.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');

                    if (href.startsWith('#')) {
                        e.preventDefault();
                        toggleMobileMenu();

                        setTimeout(() => {
                            const targetElement = document.querySelector(href);
                            if (targetElement) {
                                const offsetTop = targetElement.offsetTop - 80;
                                window.scrollTo({
                                    top: offsetTop,
                                    behavior: 'smooth'
                                });
                            }
                        }, 300);
                    } else {
                        // Allow normal navigation for .html links
                        toggleMobileMenu();
                    }
                });

                mobileMenu.appendChild(mobileLink);
            });

            navContainer.appendChild(mobileMenu);

            // Add CSS animations
            if (!document.getElementById('mobile-menu-styles')) {
                const style = document.createElement('style');
                style.id = 'mobile-menu-styles';
                style.textContent = `
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        function showMobileMenu() {
            if (mobileMenu) {
                mobileMenu.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }

        function hideMobileMenu() {
            if (mobileMenu) {
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
            }
        }

        function animateHamburger(isActive) {
            const lines = mobileMenuBtn.querySelectorAll('.hamburger');
            if (lines.length < 3) return;

            if (isActive) {
                lines[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (isOpen && !navContainer.contains(e.target)) {
                toggleMobileMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleMobileMenu();
            }
        });

        console.log('📱 Mobile menu initialized');
    }

    // ================================
    // CONTACT FORM WITH EMAILJS
    // ================================

    function initializeContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        // Initialize EmailJS (replace with your actual keys)
        // Get your keys from https://www.emailjs.com/
        const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace this
        const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace this
        const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace this

        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        form.addEventListener('submit', handleFormSubmit);

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));

            // Enhanced focus effects with highlight animation
            input.addEventListener('focus', function () {
                this.parentElement.classList.add('focused');
                const highlight = this.parentElement.querySelector('.input-highlight');
                if (highlight) {
                    highlight.style.width = '100%';
                }
            });

            input.addEventListener('blur', function () {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
                const highlight = this.parentElement.querySelector('.input-highlight');
                if (highlight && !this.value) {
                    highlight.style.width = '0';
                }
            });
        });

        function handleFormSubmit(e) {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.querySelector('span').textContent;

            // Validate form
            if (!validateForm()) {
                showMessage('Please fill in all required fields correctly.', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.querySelector('span').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            // Prepare email data
            const templateParams = {
                from_name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
                from_email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                to_email: 'info@almouedtravel.com' // Your Gmail address
            };

            // Send email using EmailJS
            if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                    .then(function (response) {
                        console.log('Email sent successfully!', response.status, response.text);
                        showMessage('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                        form.reset();

                        // Reset button
                        submitBtn.disabled = false;
                        submitBtn.querySelector('span').innerHTML = originalText;

                        // Reset form states
                        inputs.forEach(input => {
                            input.parentElement.classList.remove('focused');
                            const highlight = input.parentElement.querySelector('.input-highlight');
                            if (highlight) {
                                highlight.style.width = '0';
                            }
                        });
                    })
                    .catch(function (error) {
                        console.error('Email send failed:', error);
                        showMessage('Oops! Something went wrong. Please try again or contact us directly.', 'error');

                        // Reset button
                        submitBtn.disabled = false;
                        submitBtn.querySelector('span').innerHTML = originalText;
                    });
            } else {
                // Fallback if EmailJS is not configured
                console.warn('EmailJS not configured. Please set up your EmailJS keys.');
                showMessage('Email service not configured. Please contact us at info@almouedtravel.com', 'error');

                // Reset button
                submitBtn.disabled = false;
                submitBtn.querySelector('span').innerHTML = originalText;
            }
        }

        function validateForm() {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        function validateField(field) {
            const value = field.value.trim();
            const fieldType = field.type;
            let isValid = true;
            let errorMessage = '';

            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required.';
            } else if (fieldType === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
            } else if (fieldType === 'tel' && value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number.';
                }
            }

            if (!isValid) {
                showFieldError(field, errorMessage);
            } else {
                clearFieldError(field);
            }

            return isValid;
        }

        function showFieldError(field, message) {
            clearFieldError(field);

            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1)';

            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            `;
            errorDiv.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
                animation: slideInUp 0.3s ease;
            `;

            field.parentNode.appendChild(errorDiv);
        }

        function clearFieldError(field) {
            field.style.borderColor = '';
            field.style.boxShadow = '';

            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.style.animation = 'slideOutUp 0.3s ease';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }

        function showMessage(text, type) {
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = 'form-message';
            messageDiv.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${text}</span>
            `;
            messageDiv.style.cssText = `
                padding: 1rem 1.5rem;
                margin-top: 1.5rem;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 500;
                font-size: 14px;
                animation: slideInUp 0.3s ease;
                ${type === 'success' ?
                    'background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0;' :
                    'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
                }
            `;

            form.appendChild(messageDiv);

            // Auto remove after 8 seconds
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.style.animation = 'slideOutDown 0.3s ease';
                    setTimeout(() => messageDiv.remove(), 300);
                }
            }, 8000);
        }

        console.log('📝 Enhanced contact form initialized');
    }

    // ================================
    // ANIMATIONS
    // ================================

    function initializeAnimations() {
        // Enhanced intersection observer for different card types
        initializeServiceCardAnimations();
        initializeDestinationCardAnimations();
        initializePackageCardAnimations();
        initializeTeamCardAnimations();
        initializeContactCardAnimations();

        console.log('✨ Enhanced animations initialized');
    }

    function initializeServiceCardAnimations() {
        const serviceCards = document.querySelectorAll('.services .service-card, .service-card-premium');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        serviceCards.forEach((card) => {
            observer.observe(card);
        });
    }

    function initializeDestinationCardAnimations() {
        const destinationCards = document.querySelectorAll('.destinations .service-card, .service-card-premium');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        destinationCards.forEach((card) => {
            observer.observe(card);
        });
    }

    function initializePackageCardAnimations() {
        const packageCards = document.querySelectorAll('.packages .service-card, .service-card-premium');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        packageCards.forEach((card) => {
            observer.observe(card);
        });
    }

    function initializeTeamCardAnimations() {
        const teamCards = document.querySelectorAll('.step-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        teamCards.forEach((card) => {
            observer.observe(card);
        });
    }

    function initializeContactCardAnimations() {
        const contactCards = document.querySelectorAll('.contact-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0) scale(1)';
                        entry.target.classList.add('animated');

                        // Add ripple hover effect
                        entry.target.addEventListener('mouseenter', function () {
                            this.style.transform = 'translateY(-5px) scale(1.02)';
                            const ripple = this.querySelector('.contact-ripple');
                            if (ripple) ripple.style.left = '100%';
                        });

                        entry.target.addEventListener('mouseleave', function () {
                            this.style.transform = 'translateY(0) scale(1)';
                            const ripple = this.querySelector('.contact-ripple');
                            if (ripple) {
                                setTimeout(() => ripple.style.left = '-100%', 300);
                            }
                        });
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        contactCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-30px) scale(0.9)';
            card.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1)`;
            observer.observe(card);
        });
    }

    // ================================
    // COUNTERS
    // ================================

    function initializeCounters() {
        const counters = document.querySelectorAll('.counter[data-target]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const steps = 60;
            const stepValue = target / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
                step++;
                current = Math.min(stepValue * step, target);

                let displayValue = Math.floor(current);

                // Add formatting for large numbers
                if (displayValue >= 1000) {
                    displayValue = (displayValue / 1000).toFixed(displayValue % 1000 === 0 ? 0 : 1) + 'K';
                }

                element.textContent = displayValue + '+';

                if (current >= target) {
                    clearInterval(timer);
                    element.textContent = target >= 1000 ?
                        (target / 1000).toFixed(target % 1000 === 0 ? 0 : 1) + 'K+' :
                        target + '+';
                }
            }, duration / steps);
        }

        console.log('🔢 Counter animations initialized');
    }

    // ================================
    // LOADING SCREEN
    // ================================

    function hideLoadingScreen() {
        const loading = document.getElementById('loading');
        if (!loading) return;

        // Enhanced loading screen with particle animation
        const particles = loading.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            particle.style.animationDelay = `${index * 0.2}s`;
        });

        setTimeout(() => {
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.8s ease';

            setTimeout(() => {
                loading.style.display = 'none';

                // Trigger AOS refresh if available
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }

                // Trigger welcome animation
                triggerWelcomeAnimation();
            }, 800);
        }, 3500);

        console.log('🎬 Loading screen hidden');
    }

    function triggerWelcomeAnimation() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'fadeInUp 1s ease-out';
        }
    }

    // ================================
    // BACK TO TOP BUTTON
    // ================================

    function initializeBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i><div class="back-to-top-ripple"></div>';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);

        // Show/hide based on scroll with smooth transition
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            scrollTimeout = setTimeout(() => {
                const show = window.scrollY > 800;
                backToTop.classList.toggle('visible', show);
            }, 10);
        });

        // Enhanced click handler with ripple effect
        backToTop.addEventListener('click', (e) => {
            // Trigger ripple effect
            const ripple = backToTop.querySelector('.back-to-top-ripple');
            ripple.style.transform = 'scale(1)';

            setTimeout(() => {
                ripple.style.transform = 'scale(0)';
            }, 300);

            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Enhanced hover effects
        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.transform = 'translateY(-5px) scale(1.1)';
        });

        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.transform = 'translateY(0) scale(1)';
        });

        console.log('⬆️ Back to top button initialized');
    }

    // ================================
    // SCROLL EFFECTS
    // ================================

    function initializeScrollEffects() {
        let ticking = false;

        function updateScrollEffects() {
            const scrolled = window.pageYOffset;

            // Parallax effect for floating elements
            const floatingElements = document.querySelectorAll('.floating-element');
            floatingElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const y = scrolled * speed * -1;
                element.style.transform = `translate(-50%, -50%) translateY(${y}px)`;
            });

            // Video parallax effect
            const heroVideo = document.querySelector('.hero-video video');
            if (heroVideo) {
                const speed = scrolled * 0.5;
                heroVideo.style.transform = `translateY(${speed}px)`;
            }

            ticking = false;
        }

        function requestScrollUpdate() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestScrollUpdate);
        console.log('🎯 Scroll effects initialized');
    }

    // ================================
    // PARALLAX EFFECTS
    // ================================

    function initializeParallax() {
        const parallaxElements = document.querySelectorAll('[data-speed]');

        if (parallaxElements.length === 0) return;

        let ticking = false;

        function updateParallax() {
            const scrollTop = window.pageYOffset;

            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                const y = scrollTop * speed;
                element.style.transform = `translateY(${y}px)`;
            });

            ticking = false;
        }

        function requestParallaxUpdate() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestParallaxUpdate);
        console.log('🌌 Parallax effects initialized');
    }

    // ================================
    // UTILITY FUNCTIONS
    // ================================

    // Debounce function for performance
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;

            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // ================================
    // PERFORMANCE OPTIMIZATION
    // ================================

    const debouncedResize = debounce(function () {
        // Handle resize events
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        // Recalculate positions
        console.log('📐 Window resized, recalculating positions');
    }, 250);

    window.addEventListener('resize', debouncedResize);

    // ================================
    // KEYBOARD NAVIGATION
    // ================================

    document.addEventListener('keydown', function (e) {
        // ESC key to close mobile menu
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-nav-menu');
            if (mobileMenu && mobileMenu.style.display === 'flex') {
                const mobileMenuBtn = document.getElementById('mobile-menu');
                if (mobileMenuBtn) {
                    mobileMenuBtn.click();
                }
            }
        }

        // Arrow keys for navigation (when appropriate)
        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }

        // Space bar for smooth scroll down
        if (e.key === ' ' && e.ctrlKey) {
            e.preventDefault();
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        }
    });

    // ================================
    // SOCIAL MEDIA SHARING
    // ================================

    function shareOnFacebook(url = window.location.href, title = 'Almoued Travel - The Destination Expertz') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
    }

    function shareOnTwitter(text = 'Check out Almoued Travel - Your trusted travel partner!', url = window.location.href) {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=AlmouedTravel,Travel,Vacation`, '_blank', 'width=600,height=400');
    }

    function shareOnLinkedIn(url = window.location.href, title = 'Almoued Travel - The Destination Expertz') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
    }

    function shareOnWhatsApp(text = 'Check out Almoued Travel for amazing travel experiences!', url = window.location.href) {
        const message = `${text} ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }

    // Make sharing functions available globally
    window.shareOnFacebook = shareOnFacebook;
    window.shareOnTwitter = shareOnTwitter;
    window.shareOnLinkedIn = shareOnLinkedIn;
    window.shareOnWhatsApp = shareOnWhatsApp;

    // ================================
    // ENHANCED USER INTERACTIONS
    // ================================

    function initializeEnhancedInteractions() {
        // Service card click interactions
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', function () {
                const serviceName = this.querySelector('h3').textContent;
                // showServiceModal(serviceName); // Not using modal for services currently
            });

            // Add cursor pointer
            card.style.cursor = 'pointer';
        });

        // Team member interactions
        document.querySelectorAll('.step-item').forEach(member => {
            member.addEventListener('click', function () {
                // Optional: interactivity for team members
            });

            member.style.cursor = 'pointer';
        });

        // Package card interactions
        document.querySelectorAll('.service-arrow').forEach(arrow => {
            arrow.addEventListener('click', function (e) {
                e.stopPropagation();
                // Scroll to contact section
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Contact Form Handling (Toast)
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Simulate sending (would be AJAX normally)
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;

                // Loading state
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                btn.disabled = true;

                setTimeout(() => {
                    // Success State
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    contactForm.reset();

                    // Show Toast
                    const toast = document.getElementById('successToast');
                    if (toast) {
                        toast.classList.add('active');
                        setTimeout(() => {
                            toast.classList.remove('active');
                        }, 4000);
                    }
                }, 1500);
            });
        }

        console.log('🎪 Enhanced interactions initialized');
    }

    function showServiceModal(serviceName) {
        // Create and show service info modal
        const modal = createModal('Service Information', `
            <div style="text-align: center; padding: 1rem;">
                <i class="fas fa-plane" style="font-size: 3rem; color: var(--orange); margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 1rem; color: var(--dark);">${serviceName}</h3>
                <p style="color: var(--gray); margin-bottom: 2rem;">
                    Contact us to learn more about our ${serviceName.toLowerCase()} service. 
                    Our travel experts are ready to help you plan your perfect journey.
                </p>
                <button onclick="closeModal(); document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });" 
                        style="background: linear-gradient(135deg, var(--orange), var(--blue)); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-weight: 600;">
                    Get Quote Now
                </button>
            </div>
        `);

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function showTeamMemberInfo(name, role) {
        const modal = createModal('Team Member', `
            <div style="text-align: center; padding: 1rem;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--orange), var(--blue)); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                    <i class="fas fa-user-tie"></i>
                </div>
                <h3 style="margin-bottom: 0.5rem; color: var(--dark);">${name}</h3>
                <p style="color: var(--orange); font-weight: 600; margin-bottom: 1rem;">${role}</p>
                <p style="color: var(--gray); margin-bottom: 2rem;">
                    With years of experience in the travel industry, ${name} is dedicated to providing 
                    exceptional service and creating unforgettable travel experiences for our clients.
                </p>
                <button onclick="closeModal(); document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });" 
                        style="background: linear-gradient(135deg, var(--orange), var(--blue)); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-weight: 600;">
                    Contact ${name}
                </button>
            </div>
        `);

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                <div style="padding: 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="margin: 0; color: var(--dark); font-size: 1.5rem;">${title}</h2>
                    <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--gray); padding: 0.5rem;">×</button>
                </div>
                <div>${content}</div>
            </div>
        `;

        // Close on outside click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        return modal;
    }

    function closeModal() {
        const modal = document.querySelector('.custom-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Make closeModal available globally
    window.closeModal = closeModal;

    // ================================
    // ERROR HANDLING & RECOVERY
    // ================================

    function initializeErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.warn('⚠️ Error handled:', e.message);

            // Attempt to recover from common errors
            if (e.message.includes('AOS')) {
                console.log('🔄 Attempting AOS recovery');
                initializeFallbackAnimations();
            }
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.warn('⚠️ Promise rejection handled:', e.reason);
            e.preventDefault();
        });

        // Network error recovery
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored');
        });

        window.addEventListener('offline', () => {
            console.warn('📵 Connection lost');
        });

        console.log('🛡️ Error handling initialized');
    }

    // ================================
    // FINAL INITIALIZATION
    // ================================

    // Initialize enhanced features after DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(() => {
            initializeEnhancedInteractions();
            initializeErrorHandling();
        }, 500);
    });

    // ================================
    // EXPORT FUNCTIONS FOR TESTING
    // ================================

    // Make key functions available for testing/debugging
    if (typeof window !== 'undefined') {
        window.almouedTravel = {
            initializeAOS,
            initializeNavigation,
            initializeMobileMenu,
            initializeContactForm,
            initializeAnimations,
            initializeCounters,
            shareOnFacebook,
            shareOnTwitter,
            shareOnLinkedIn,
            shareOnWhatsApp,
            closeModal
        };
    }

    console.log('🎉 Almoued Travel website fully initialized with all enhancements!');

})();