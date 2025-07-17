// Enhanced Features for Conscious Journey Portfolio
// This file contains all the enhanced functionality in a single, compatible script

(function() {
    'use strict';

    // Wait for DOM and GSAP to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Initializing Enhanced Features...');
        
        // Initialize all features
        initAnimations();
        initLazyLoading();
        initSearch();
        initPersonalization();
        initFormEnhancements();
        initThemeToggle();
        initMobileMenu();
        
        // Register Service Worker
        registerServiceWorker();
        
        console.log('✅ All features initialized successfully!');
    });

    // Animation System using GSAP
    function initAnimations() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, skipping animations');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Scroll-triggered animations
        gsap.utils.toArray('.timeline-item, .value-card, .project-card, .gallery-item').forEach((element, index) => {
            gsap.from(element, {
                opacity: 0,
                y: 50,
                duration: 1,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Hero content animation
        gsap.from('.hero-content > *', {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            delay: 0.5,
            ease: 'power2.out'
        });

        // Micro-interactions
        document.querySelectorAll('.btn, .timeline-content, .value-card, .project-card, .gallery-item').forEach(element => {
            element.addEventListener('mouseenter', () => {
                gsap.to(element, { 
                    scale: 1.05, 
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, { 
                    scale: 1, 
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Smooth scroll for navigation
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: {
                            y: targetElement,
                            offsetY: 100
                        },
                        ease: 'power2.inOut'
                    });
                }
            });
        });
    }

    // Lazy Loading System
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazy');
                        lazyImage.classList.add('loaded');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            }, {
                rootMargin: '0px 0px 100px 0px'
            });

            lazyImages.forEach(lazyImage => {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // Fallback for older browsers
            lazyImages.forEach(lazyImage => {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove('lazy');
            });
        }

        // Add progressive loading styles
        const style = document.createElement('style');
        style.textContent = `
            img[data-src] {
                filter: blur(5px);
                transition: filter 0.3s;
            }
            img.loaded {
                filter: blur(0);
            }
        `;
        document.head.appendChild(style);
    }

    // Search Functionality
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const searchOverlay = document.getElementById('search-overlay');
        const searchResults = document.getElementById('search-results');
        
        if (!searchInput) return;

        let searchIndex = createSearchIndex();
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (query.length > 2) {
                    const results = performSearch(query, searchIndex);
                    displayResults(results);
                    showSearchOverlay();
                } else {
                    hideSearchOverlay();
                }
            }, 300);
        });

        // Close search on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideSearchOverlay();
                searchInput.value = '';
            }
        });

        // Close search when clicking outside
        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    hideSearchOverlay();
                }
            });
        }

        function createSearchIndex() {
            const index = [];
            
            // Index timeline items
            document.querySelectorAll('.timeline-item').forEach((item, idx) => {
                const title = item.querySelector('.chapter-title')?.textContent || '';
                const text = item.querySelector('.chapter-text')?.textContent || '';
                const year = item.querySelector('.timeline-year')?.textContent || '';
                
                index.push({
                    id: `timeline-${idx}`,
                    type: 'timeline',
                    title: title,
                    content: text,
                    year: year,
                    element: item
                });
            });

            // Index project cards
            document.querySelectorAll('.project-card').forEach((item, idx) => {
                const title = item.querySelector('.project-title')?.textContent || '';
                const desc = item.querySelector('.project-desc')?.textContent || '';
                
                index.push({
                    id: `project-${idx}`,
                    type: 'project',
                    title: title,
                    content: desc,
                    element: item
                });
            });

            // Index value cards
            document.querySelectorAll('.value-card').forEach((item, idx) => {
                const title = item.querySelector('.value-title')?.textContent || '';
                const desc = item.querySelector('.value-desc')?.textContent || '';
                
                index.push({
                    id: `value-${idx}`,
                    type: 'value',
                    title: title,
                    content: desc,
                    element: item
                });
            });

            return index;
        }

        function performSearch(query, index) {
            const queryLower = query.toLowerCase();
            const results = [];

            index.forEach(item => {
                let score = 0;
                const titleLower = item.title.toLowerCase();
                const contentLower = item.content.toLowerCase();

                if (titleLower.includes(queryLower)) {
                    score += titleLower === queryLower ? 10 : 5;
                }

                if (contentLower.includes(queryLower)) {
                    score += 2;
                }

                if (item.year && item.year.includes(query)) {
                    score += 3;
                }

                if (score > 0) {
                    results.push({
                        ...item,
                        score,
                        snippet: createSnippet(item.content, query)
                    });
                }
            });

            return results.sort((a, b) => b.score - a.score).slice(0, 10);
        }

        function createSnippet(content, query) {
            const queryLower = query.toLowerCase();
            const contentLower = content.toLowerCase();
            const index = contentLower.indexOf(queryLower);
            
            if (index === -1) return content.substring(0, 150) + '...';
            
            const start = Math.max(0, index - 50);
            const end = Math.min(content.length, index + query.length + 50);
            
            let snippet = content.substring(start, end);
            if (start > 0) snippet = '...' + snippet;
            if (end < content.length) snippet = snippet + '...';
            
            const regex = new RegExp(`(${query})`, 'gi');
            snippet = snippet.replace(regex, '<mark>$1</mark>');
            
            return snippet;
        }

        function displayResults(results) {
            if (!searchResults) return;

            if (results.length === 0) {
                searchResults.innerHTML = `
                    <div class="no-results">
                        <p>No results found. Try different keywords.</p>
                    </div>
                `;
                return;
            }

            searchResults.innerHTML = results.map(result => `
                <div class="search-result" data-type="${result.type}">
                    <div class="result-type">${result.type}</div>
                    <h3 class="result-title">${result.title}</h3>
                    <p class="result-snippet">${result.snippet}</p>
                </div>
            `).join('');

            // Add click handlers
            searchResults.querySelectorAll('.search-result').forEach((resultEl, idx) => {
                resultEl.addEventListener('click', () => {
                    const result = results[idx];
                    scrollToElement(result.element);
                    hideSearchOverlay();
                });
            });
        }

        function scrollToElement(element) {
            if (element && typeof gsap !== 'undefined') {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: element,
                        offsetY: 100
                    },
                    ease: 'power2.inOut'
                });
            } else if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        function showSearchOverlay() {
            if (searchOverlay) {
                searchOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        function hideSearchOverlay() {
            if (searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    // Personalization System
    function initPersonalization() {
        const userPreferences = getUserPreferences();
        
        // Apply saved theme
        applyThemePreference(userPreferences.theme);
        
        // Track interactions
        initInteractionTracking();
        
        // Show returning user message
        if (userPreferences.visitCount > 1) {
            showWelcomeBackMessage(userPreferences.visitCount);
        }

        function getUserPreferences() {
            const defaultPreferences = {
                theme: 'auto',
                visitCount: 0,
                lastVisit: null,
                interactions: []
            };
            
            const saved = localStorage.getItem('userPreferences');
            const preferences = saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
            
            preferences.visitCount += 1;
            preferences.lastVisit = new Date().toISOString();
            
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
            return preferences;
        }

        function applyThemePreference(theme) {
            const body = document.body;
            
            if (theme === 'dark') {
                body.classList.add('dark-mode');
            } else if (theme === 'light') {
                body.classList.remove('dark-mode');
            } else if (theme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                body.classList.toggle('dark-mode', prefersDark);
            }
        }

        function initInteractionTracking() {
            document.querySelectorAll('[data-track]').forEach(element => {
                element.addEventListener('click', () => {
                    const eventType = element.dataset.track;
                    trackInteraction(eventType);
                });
            });
        }

        function trackInteraction(eventType) {
            const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
            
            if (!preferences.interactions) preferences.interactions = [];
            preferences.interactions.push({
                type: eventType,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 50 interactions
            if (preferences.interactions.length > 50) {
                preferences.interactions = preferences.interactions.slice(-50);
            }
            
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
            
            // Send to analytics if available
            if (window.gtag) {
                gtag('event', 'user_interaction', {
                    event_category: 'Engagement',
                    event_label: eventType
                });
            }
        }

        function showWelcomeBackMessage(visitCount) {
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'welcome-back-message';
            welcomeMessage.innerHTML = `
                <div class="welcome-content">
                    <span class="welcome-icon">👋</span>
                    <span class="welcome-text">Welcome back! Visit #${visitCount}</span>
                    <button class="welcome-close">×</button>
                </div>
            `;
            
            document.body.appendChild(welcomeMessage);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                welcomeMessage.remove();
            }, 5000);
            
            // Manual close
            welcomeMessage.querySelector('.welcome-close').addEventListener('click', () => {
                welcomeMessage.remove();
            });
        }
    }

    // Enhanced Form Handling
    function initFormEnhancements() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearFieldError(input));
            });

            // Enhanced form submission
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Validate all fields
                let isValid = true;
                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });

                if (!isValid) {
                    showFormMessage('Please correct the errors above.', 'error');
                    return;
                }

                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <span class="loading-spinner"></span>
                    Sending...
                `;

                try {
                    // Simulate form submission (replace with actual endpoint)
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    form.reset();
                    showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                    
                    if (window.gtag) {
                        gtag('event', 'form_submission', {
                            event_category: 'Forms',
                            event_label: 'contact'
                        });
                    }
                    
                } catch (error) {
                    showFormMessage('There was an error sending your message. Please try again.', 'error');
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            });
        });

        function validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            if (field.hasAttribute('required') && !value) {
                errorMessage = 'This field is required';
                isValid = false;
            } else if (field.type === 'email' && value && !validateEmail(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }

            if (!isValid) {
                showFieldError(field, errorMessage);
            } else {
                clearFieldError(field);
            }

            return isValid;
        }

        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function showFieldError(field, message) {
            clearFieldError(field);
            
            field.classList.add('error');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            
            field.parentNode.appendChild(errorElement);
        }

        function clearFieldError(field) {
            field.classList.remove('error');
            
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
        }

        function showFormMessage(message, type) {
            const existingMessages = document.querySelectorAll('.form-message');
            existingMessages.forEach(msg => msg.remove());
            
            const messageElement = document.createElement('div');
            messageElement.className = `form-message form-message-${type}`;
            messageElement.innerHTML = `
                <div class="message-content">
                    <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
                    <span class="message-text">${message}</span>
                </div>
            `;
            
            const form = document.querySelector('form');
            if (form) {
                form.parentNode.insertBefore(messageElement, form.nextSibling);
                
                setTimeout(() => {
                    messageElement.remove();
                }, 5000);
            }
        }
    }

    // Enhanced Theme Toggle
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            const body = document.body;
            const isDark = body.classList.contains('dark-mode');
            
            body.classList.toggle('dark-mode');
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            // Save preference
            const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
            preferences.theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
            
            // Animate toggle
            if (typeof gsap !== 'undefined') {
                gsap.to(themeToggle, {
                    rotation: 360,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }

    // Mobile Menu
    function initMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const nav = document.querySelector('nav');
        
        if (mobileMenu && nav) {
            mobileMenu.addEventListener('click', () => {
                nav.classList.toggle('mobile-active');
                mobileMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (nav && nav.classList.contains('mobile-active')) {
                    if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
                        nav.classList.remove('mobile-active');
                        mobileMenu.classList.remove('active');
                    }
                }
            });
        }
    }

    // Service Worker Registration
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./public/service-worker.js')
                .then(registration => {
                    console.log('✅ Service Worker registered successfully:', registration);
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        }
    }

})();
