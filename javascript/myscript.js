// Portfolio Website JavaScript
// Author: Abdalrhem Salah
// Description: Interactive functionality for portfolio website

(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const downloadCV = document.getElementById('download-cv');
    const navLinks = document.querySelectorAll('.nav-link');

    // Theme Management
    class ThemeManager {
        constructor() {
            this.currentTheme = localStorage.getItem('portfolio-theme') || 'light';
            this.init();
        }

        init() {
            this.setTheme(this.currentTheme);
            this.bindEvents();
        }

        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            this.currentTheme = theme;
            localStorage.setItem('portfolio-theme', theme);
            this.updateThemeIcon();
        }

        updateThemeIcon() {
            themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }

        toggleTheme() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        }

        bindEvents() {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    // Navigation Manager
    class NavigationManager {
        constructor() {
            this.init();
        }

        init() {
            this.bindEvents();
            this.handleScroll();
        }

        bindEvents() {
            // Mobile menu toggle
            hamburger.addEventListener('click', () => this.toggleMobileMenu());

            // Smooth scrolling for navigation links
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavClick(e));
            });

            // Close mobile menu when clicking on a link
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    this.closeMobileMenu();
                }
            });

            // Handle scroll events
            window.addEventListener('scroll', () => this.handleScroll());

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }

        toggleMobileMenu() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        }

        closeMobileMenu() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }

        handleNavClick(e) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                this.scrollToSection(targetSection);
                this.setActiveNavLink(e.target);
            }
        }

        scrollToSection(section) {
            const navbarHeight = navbar.offsetHeight;
            const sectionTop = section.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }

        setActiveNavLink(activeLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
        }

        handleScroll() {
            const scrollPosition = window.scrollY;
            const navbarHeight = navbar.offsetHeight;

            // Add background to navbar on scroll
            if (scrollPosition > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                }
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                }
            }

            // Update active navigation link based on scroll position
            this.updateActiveNavLink(scrollPosition, navbarHeight);
        }

        updateActiveNavLink(scrollPosition, navbarHeight) {
            const sections = document.querySelectorAll('section[id]');
            let currentSection = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - navbarHeight - 100;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Animation Manager
    class AnimationManager {
        constructor() {
            this.init();
        }

        init() {
            this.observeElements();
            this.addHoverEffects();
        }

        observeElements() {
            // Create intersection observer for fade-in animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe sections and cards
            const elementsToAnimate = document.querySelectorAll(
                'section, .feature-card, .skills-card, .education-item, .project-card, .contact-card, .course-item'
            );

            elementsToAnimate.forEach(element => {
                observer.observe(element);
            });
        }

        addHoverEffects() {
            // Add dynamic hover effects to project cards
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Add hover effects to skill tags
            const skillTags = document.querySelectorAll('.skill-tag');
            skillTags.forEach(tag => {
                tag.addEventListener('mouseenter', () => {
                    tag.style.transform = 'scale(1.1)';
                });
                
                tag.addEventListener('mouseleave', () => {
                    tag.style.transform = 'scale(1)';
                });
            });

            // Add hover effects to buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', () => {
                    button.style.transform = 'translateY(-2px)';
                });
                
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translateY(0)';
                });
            });
        }
    }

    // CV Download Manager
    class CVManager {
        constructor() {
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            if (downloadCV) {
                downloadCV.addEventListener('click', () => this.handleDownload());
            }
        }

        handleDownload() {
            // Show download message
            this.showDownloadMessage();
            
            // In a real implementation, you would:
            // 1. Have an actual PDF file in your project
            // 2. Create a download link
            // 3. Trigger the download
            
            // Example implementation:
               const link = document.createElement('a');
               link.href = 'files/Abdalrheem_salah_cv.pdf';
               link.download = 'Abdalrhem_salah_cv.pdf';
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
        }

        showDownloadMessage() {
            // Create and show a message to the user
            const message = this.createMessage(
                'CV Download',
                'CV download functionality would be implemented here. Please add your CV PDF file to enable downloads.',
                'info'
            );
            
            this.showMessage(message);
        }

        createMessage(title, text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message message-${type}`;
            messageDiv.innerHTML = `
                <div class="message-content">
                    <h4 class="message-title">${title}</h4>
                    <p class="message-text">${text}</p>
                    <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;
            
            // Add message styles
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--card-background);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                padding: 1rem;
                max-width: 300px;
                box-shadow: var(--shadow-hover);
                z-index: 1001;
                animation: slideInRight 0.3s ease-out;
            `;
            
            return messageDiv;
        }

        showMessage(messageElement) {
            document.body.appendChild(messageElement);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }

    // Contact Manager
    class ContactManager {
        constructor() {
            this.init();
        }

        init() {
            this.addContactAnimations();
        }

        addContactAnimations() {
            const contactCards = document.querySelectorAll('.contact-card');
            
            contactCards.forEach((card, index) => {
                // Stagger animation delays
                card.style.animationDelay = `${index * 0.1}s`;
                
                // Add pulse effect on hover for contact links
                const contactLink = card.querySelector('.contact-link');
                if (contactLink) {
                    contactLink.addEventListener('mouseenter', () => {
                        card.style.transform = 'translateY(-8px) scale(1.02)';
                    });
                    
                    contactLink.addEventListener('mouseleave', () => {
                        card.style.transform = 'translateY(0) scale(1)';
                    });
                }
            });
        }
    }

    // Utility Functions
    const Utils = {
        // Debounce function for performance optimization
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function for scroll events
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Check if element is in viewport
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    };

    // Performance Monitoring
    class PerformanceMonitor {
        constructor() {
            this.init();
        }

        init() {
            this.monitorPageLoad();
            this.optimizeScrollEvents();
        }

        monitorPageLoad() {
            window.addEventListener('load', () => {
                // Page load time
                const loadTime = performance.now();
                console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
                
                // Add loaded class to body for CSS animations
                document.body.classList.add('page-loaded');
            });
        }

        optimizeScrollEvents() {
            // Use throttled scroll events for better performance
            const throttledScroll = Utils.throttle(() => {
                // Any scroll-related functionality can be added here
            }, 16); // ~60fps
            
            window.addEventListener('scroll', throttledScroll, { passive: true });
        }
    }

    // Initialize Application
    class PortfolioApp {
        constructor() {
            this.init();
        }

        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
        }

        initializeComponents() {
            // Initialize all managers
            this.themeManager = new ThemeManager();
            this.navigationManager = new NavigationManager();
            this.animationManager = new AnimationManager();
            this.cvManager = new CVManager();
            this.contactManager = new ContactManager();
            this.performanceMonitor = new PerformanceMonitor();

            // Add custom styles for animations
            this.addCustomStyles();
            
            // Add global event listeners
            this.addGlobalEventListeners();
            
            console.log('Portfolio website initialized successfully!');
        }

        addCustomStyles() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .message-content {
                    position: relative;
                }
                
                .message-close {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 25px;
                    height: 25px;
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .message-title {
                    margin: 0 0 0.5rem 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .message-text {
                    margin: 0;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    line-height: 1.4;
                }
                
                .page-loaded .hero-text {
                    animation: fadeInUp 1s ease-out;
                }
                
                .page-loaded .hero-image {
                    animation: fadeInUp 1s ease-out 0.2s both;
                }
            `;
            document.head.appendChild(style);
        }

        addGlobalEventListeners() {
            // Handle keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.navigationManager.closeMobileMenu();
                }
            });

            // Handle window resize
            window.addEventListener('resize', Utils.debounce(() => {
                this.navigationManager.closeMobileMenu();
            }, 250));
        }
    }

    // Initialize the application
    const app = new PortfolioApp();

})();