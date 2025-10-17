     document.addEventListener('DOMContentLoaded', function() {
            // Project modal functionality
            const projectCards = document.querySelectorAll('.project-card');
            const projectButtons = document.querySelectorAll('.project-cta');
            const projectModals = document.querySelectorAll('.project-modal');
            const closeButtons = document.querySelectorAll('.modal-close');
            const collaborateButtons = document.querySelectorAll('.modal-action-btn');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const searchInput = document.getElementById('projectSearch');
            const noResults = document.getElementById('noResults');
            const projectsScroll = document.getElementById('projectsScroll');
            
            // Function to open modal
            function openModal(projectId) {
                const modal = document.getElementById(`modal-${projectId}`);
                
                if (modal) {
                    // Close any open modals first
                    closeAllModals();
                    
                    // Open the requested modal
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Animate progress bars and counters when modal opens
                    setTimeout(() => {
                        animateProgressBars();
                        animateCounters();
                    }, 300);
                }
            }
            
            // Function to close all modals
            function closeAllModals() {
                projectModals.forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = 'auto';
            }
            
            // Open modal when project card is clicked
            projectCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    // Don't open if the click was on the CTA button (handled separately)
                    if (!e.target.closest('.project-cta')) {
                        const projectId = this.getAttribute('data-project');
                        openModal(projectId);
                    }
                });
            });
            
            // Open modal when Explore Project button is clicked
            projectButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent triggering the card click event
                    const projectId = this.getAttribute('data-project');
                    openModal(projectId);
                });
            });
            
            // Close modal when close button is clicked
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    closeAllModals();
                });
            });
            
            // Close modal when clicking outside content
            projectModals.forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeAllModals();
                    }
                });
            });
            
            // Collaborate button functionality
            collaborateButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Close modal
                    closeAllModals();
                    
                    // Smooth scroll to contact section after a short delay
                    setTimeout(() => {
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 300);
                });
            });
            
            // Keyboard navigation for modals
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeAllModals();
                }
            });
            
            // Horizontal scroll functionality
            const scrollLeft = document.getElementById('scrollLeft');
            const scrollRight = document.getElementById('scrollRight');
            
            if (scrollLeft && scrollRight && projectsScroll) {
                scrollLeft.addEventListener('click', function() {
                    projectsScroll.scrollBy({ left: -380, behavior: 'smooth' });
                });
                
                scrollRight.addEventListener('click', function() {
                    projectsScroll.scrollBy({ left: 380, behavior: 'smooth' });
                });
            }
            
            // Add tilt effect to project cards
            projectCards.forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    const cardInner = this;
                    const cardWidth = cardInner.offsetWidth;
                    const cardHeight = cardInner.offsetHeight;
                    const centerX = cardInner.offsetLeft + cardWidth/2;
                    const centerY = cardInner.offsetTop + cardHeight/2;
                    const mouseX = e.clientX - centerX;
                    const mouseY = e.clientY - centerY;
                    const rotateX = (mouseY / cardHeight * 5).toFixed(2);
                    const rotateY = -(mouseX / cardWidth * 5).toFixed(2);
                    
                    cardInner.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });
            });
            
            // Filter functionality
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-filter');
                    filterProjects(filter);
                });
            });
            
            // Search functionality
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    filterProjects();
                });
            }
            
            // Filter projects based on selected filter and search term
            function filterProjects(filter = 'all') {
                const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
                let visibleCount = 0;
                
                projectCards.forEach(card => {
                    const status = card.getAttribute('data-status');
                    const categories = card.getAttribute('data-categories');
                    const title = card.querySelector('.project-title').textContent.toLowerCase();
                    const description = card.querySelector('.project-desc').textContent.toLowerCase();
                    
                    const matchesFilter = filter === 'all' || status === filter;
                    const matchesSearch = searchTerm === '' || 
                                         title.includes(searchTerm) || 
                                         description.includes(searchTerm) ||
                                         (categories && categories.includes(searchTerm));
                    
                    if (matchesFilter && matchesSearch) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Show no results message if no projects are visible
                if (noResults) {
                    if (visibleCount === 0) {
                        noResults.style.display = 'block';
                        projectsScroll.style.display = 'none';
                    } else {
                        noResults.style.display = 'none';
                        projectsScroll.style.display = 'flex';
                    }
                }
            }
            
            // Swipe functionality for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            
            if (projectsScroll) {
                projectsScroll.addEventListener('touchstart', e => {
                    touchStartX = e.changedTouches[0].screenX;
                }, false);
                
                projectsScroll.addEventListener('touchend', e => {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                }, false);
            }
            
            function handleSwipe() {
                const swipeThreshold = 50;
                
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left
                    projectsScroll.scrollBy({ left: 380, behavior: 'smooth' });
                }
                
                if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right
                    projectsScroll.scrollBy({ left: -380, behavior: 'smooth' });
                }
            }
            
            // Animated counters
            function animateCounters() {
                const counters = document.querySelectorAll('.modal-metric-value');
                
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    if (isNaN(target)) return;
                    
                    let count = 0;
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    
                    const updateCounter = () => {
                        if (count < target) {
                            count += increment;
                            if (count > target) count = target;
                            counter.textContent = Math.round(count) + (counter.textContent.includes('%') ? '%' : '');
                            requestAnimationFrame(updateCounter);
                        }
                    };
                    
                    updateCounter();
                });
            }
            
            // Animated progress bars
            function animateProgressBars() {
                const progressBars = document.querySelectorAll('.modal-progress-fill');
                
                progressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = '0%';
                    
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 300);
                });
            }
        });
