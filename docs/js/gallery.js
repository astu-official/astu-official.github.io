      (function() {
            'use strict';
            
            // Select all gallery items
            const galleryItems = document.querySelectorAll('.gallery-item');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxCaption = document.getElementById('lightbox-caption');
            const lightboxClose = document.getElementById('lightbox-close');
            const lightboxPrev = document.getElementById('lightbox-prev');
            const lightboxNext = document.getElementById('lightbox-next');
            const lightboxLoading = document.getElementById('lightbox-loading');
            const preloadContainer = document.getElementById('preload-container');
            
            // State variables
            let currentIndex = 0;
            let itemsArray = Array.from(galleryItems);
            let preloadedImages = new Set();
            
            // Initialize the gallery
            function initGallery() {
                setupFiltering();
                setupLazyLoading();
                setupLightbox();
                setupParallax();
                setupKeyboardNavigation();
            }
            
            // Filter functionality
            function setupFiltering() {
                filterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        // Update active button
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        
                        const filter = button.getAttribute('data-filter');
                        
                        // Filter items
                        galleryItems.forEach(item => {
                            const category = item.getAttribute('data-category');
                            
                            if (filter === 'all' || filter === category) {
                                item.style.display = 'block';
                                // Re-trigger animation for filtered items
                                setTimeout(() => {
                                    item.classList.add('visible');
                                }, 50);
                            } else {
                                item.style.display = 'none';
                                item.classList.remove('visible');
                            }
                        });
                        
                        // Update items array for lightbox navigation
                        itemsArray = Array.from(galleryItems).filter(item => {
                            return filter === 'all' || item.getAttribute('data-category') === filter;
                        });
                    });
                });
            }
            
            // Enhanced lazy loading with Intersection Observer
            function setupLazyLoading() {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            const picture = img.parentElement;
                            
                            // Load the actual image
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                delete img.dataset.src;
                            }
                            
                            if (img.dataset.srcset) {
                                img.srcset = img.dataset.srcset;
                                delete img.dataset.srcset;
                            }
                            
                            // Load WebP sources if available
                            const sources = picture.querySelectorAll('source');
                            sources.forEach(source => {
                                if (source.dataset.srcset) {
                                    source.srcset = source.dataset.srcset;
                                    delete source.dataset.srcset;
                                }
                            });
                            
                            // Once image is loaded, hide the placeholder
                            img.addEventListener('load', function() {
                                img.classList.add('loaded');
                                const placeholder = img.closest('.image-container').querySelector('.blur-placeholder');
                                if (placeholder) {
                                    setTimeout(() => {
                                        placeholder.classList.add('hidden');
                                    }, 300);
                                }
                            });
                            
                            observer.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '200px 0px', // Start loading before in viewport
                    threshold: 0.01
                });
                
                // Observe all images
                document.querySelectorAll('.gallery-image').forEach(img => {
                    imageObserver.observe(img);
                });
            }
            
            // Lightbox functionality
            function setupLightbox() {
                // Add click event to gallery items
                galleryItems.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        openLightbox(index);
                    });
                });
                
                // Lightbox controls
                lightboxClose.addEventListener('click', closeLightbox);
                lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
                lightboxNext.addEventListener('click', () => navigateLightbox(1));
                
                // Close lightbox when clicking outside image
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        closeLightbox();
                    }
                });
            }
            
            function openLightbox(index) {
                currentIndex = index;
                const item = itemsArray[index];
                const imgElement = item.querySelector('.gallery-image');
                
                // Set ARIA attributes
                lightbox.setAttribute('aria-hidden', 'false');
                
                // Show loading indicator
                lightboxLoading.classList.add('visible');
                lightboxImg.classList.remove('loaded');
                lightboxCaption.classList.remove('visible');
                
                // Set image source
                lightboxImg.src = imgElement.src;
                lightboxImg.alt = imgElement.alt;
                
                // Set caption
                const title = item.querySelector('h3').textContent;
                const desc = item.querySelector('p').textContent;
                lightboxCaption.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
                
                // Show lightbox
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Preload adjacent images
                preloadLightboxImages(index);
                
                // Once image is loaded, update UI
                lightboxImg.onload = function() {
                    lightboxLoading.classList.remove('visible');
                    lightboxImg.classList.add('loaded');
                    setTimeout(() => {
                        lightboxCaption.classList.add('visible');
                    }, 100);
                    
                    // Remove event handler
                    lightboxImg.onload = null;
                };
            }
            
            function closeLightbox() {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
                lightbox.setAttribute('aria-hidden', 'true');
                
                // Reset lightbox image
                setTimeout(() => {
                    lightboxImg.classList.remove('loaded');
                    lightboxCaption.classList.remove('visible');
                }, 300);
            }
            
            function navigateLightbox(direction) {
                currentIndex += direction;
                
                if (currentIndex < 0) {
                    currentIndex = itemsArray.length - 1;
                } else if (currentIndex >= itemsArray.length) {
                    currentIndex = 0;
                }
                
                // Show loading indicator
                lightboxLoading.classList.add('visible');
                lightboxImg.classList.remove('loaded');
                lightboxCaption.classList.remove('visible');
                
                const item = itemsArray[currentIndex];
                const imgElement = item.querySelector('.gallery-image');
                
                // Set image source
                lightboxImg.src = imgElement.src;
                lightboxImg.alt = imgElement.alt;
                
                // Set caption
                const title = item.querySelector('h3').textContent;
                const desc = item.querySelector('p').textContent;
                lightboxCaption.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
                
                // Preload adjacent images
                preloadLightboxImages(currentIndex);
                
                // Once image is loaded, update UI
                lightboxImg.onload = function() {
                    lightboxLoading.classList.remove('visible');
                    lightboxImg.classList.add('loaded');
                    setTimeout(() => {
                        lightboxCaption.classList.add('visible');
                    }, 100);
                    
                    // Remove event handler
                    lightboxImg.onload = null;
                };
            }
            
            function preloadLightboxImages(index) {
                // Preload next image
                const nextIndex = (index + 1) % itemsArray.length;
                if (!preloadedImages.has(nextIndex)) {
                    preloadImage(itemsArray[nextIndex], nextIndex);
                }
                
                // Preload previous image
                const prevIndex = (index - 1 + itemsArray.length) % itemsArray.length;
                if (!preloadedImages.has(prevIndex)) {
                    preloadImage(itemsArray[prevIndex], prevIndex);
                }
            }
            
            function preloadImage(item, index) {
                const imgElement = item.querySelector('.gallery-image');
                const img = new Image();
                img.src = imgElement.src;
                img.onload = function() {
                    preloadedImages.add(index);
                };
                
                // Add to preload container
                preloadContainer.appendChild(img);
            }
            
            // Enhanced parallax effect with RAF optimization
            function setupParallax() {
                let ticking = false;
                let lastScrollY = window.scrollY;
                
                function updateParallax() {
                    const scrolled = window.scrollY;
                    const parallaxElements = document.querySelectorAll('.gallery-item.visible');
                    
                    parallaxElements.forEach(element => {
                        const elementTop = element.getBoundingClientRect().top + scrolled;
                        const elementHeight = element.offsetHeight;
                        const elementDistance = scrolled - elementTop;
                        const speed = 0.3;
                        
                        // Only apply parallax when element is in viewport
                        if (element.getBoundingClientRect().top < window.innerHeight && 
                            element.getBoundingClientRect().bottom > 0) {
                            const yPos = -(elementDistance * speed);
                            element.style.transform = `translate3d(0, ${yPos}px, 0) scale(1)`;
                        }
                    });
                    
                    ticking = false;
                }
                
                function onScroll() {
                    lastScrollY = window.scrollY;
                    
                    if (!ticking) {
                        requestAnimationFrame(updateParallax);
                        ticking = true;
                    }
                }
                
                window.addEventListener('scroll', onScroll, { passive: true });
            }
            
            // Keyboard navigation
            function setupKeyboardNavigation() {
                document.addEventListener('keydown', (e) => {
                    if (lightbox.classList.contains('active')) {
                        if (e.key === 'Escape') {
                            closeLightbox();
                        } else if (e.key === 'ArrowLeft') {
                            navigateLightbox(-1);
                        } else if (e.key === 'ArrowRight') {
                            navigateLightbox(1);
                        }
                    }
                });
            }
            
            // Set up Intersection Observer for gallery items with staggered animation
            function setupItemAnimations() {
                const observerOptions = {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.1
                };
                
                const observer = new IntersectionObserver(function(entries, observer) {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            // Add visible class when item enters viewport with staggered delay
                            setTimeout(() => {
                                entry.target.classList.add('visible');
                            }, index * 100); // Stagger animation by 100ms per item
                            
                            // Stop observing after animation triggers
                            observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);
                
                // Observe each gallery item
                galleryItems.forEach(item => {
                    observer.observe(item);
                });
                
                // Handle reduced motion preference
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (reduceMotion) {
                    // Immediately show all items if reduced motion is preferred
                    galleryItems.forEach(item => {
                        item.classList.add('visible');
                    });
                }
            }
            
            // Initialize everything when DOM is loaded
            document.addEventListener('DOMContentLoaded', function() {
                initGallery();
                setupItemAnimations();
            });
        })();
