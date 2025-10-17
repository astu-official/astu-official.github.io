      document.addEventListener('DOMContentLoaded', function() {
            // Theme toggle functionality (if you have a theme toggle elsewhere)
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', function() {
                    document.body.classList.toggle('dark-mode');
                    
                    // Update icon
                    const icon = themeToggle.querySelector('i');
                    if (document.body.classList.contains('dark-mode')) {
                        icon.classList.remove('fa-moon');
                        icon.classList.add('fa-sun');
                    } else {
                        icon.classList.remove('fa-sun');
                        icon.classList.add('fa-moon');
                    }
                    
                    // Save theme preference to localStorage
                    const isDarkMode = document.body.classList.contains('dark-mode');
                    localStorage.setItem('darkMode', isDarkMode);
                });
                
                // Check for saved theme preference
                if (localStorage.getItem('darkMode') === 'true') {
                    document.body.classList.add('dark-mode');
                    const icon = themeToggle.querySelector('i');
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }

            // Reveal intro elements on load
            const introHeading = document.querySelector('.intro-heading');
            const introSubheading = document.querySelector('.intro-subheading');
            const introCta = document.querySelector('.intro-cta');
            
            setTimeout(() => {
                introHeading.classList.add('reveal');
            }, 100);
            
            setTimeout(() => {
                introSubheading.classList.add('reveal');
            }, 500);
            
            setTimeout(() => {
                introCta.classList.add('reveal');
            }, 900);
            
            // Handle "Begin Your Journey" button click
            const beginJourneyBtn = document.getElementById('beginJourneyBtn');
            const journeySection = document.getElementById('journey');
            const backToIntroBtn = document.getElementById('backToIntro');
            
            beginJourneyBtn.addEventListener('click', function() {
                // Hide intro section with animation
                document.querySelector('.journey-intro').style.opacity = '0';
                document.querySelector('.journey-intro').style.transition = 'opacity 0.8s ease';
                
                // Show journey section after a short delay
                setTimeout(() => {
                    document.querySelector('.journey-intro').style.display = 'none';
                    journeySection.classList.add('visible');
                    backToIntroBtn.classList.add('visible');
                    
                    // Animate timeline items in sequence
                    const timelineItems = document.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, 300 * index);
                    });
                }, 800);
                
                // Update URL hash
                window.location.hash = 'journey';
            });
            
            // Handle back to intro button
            backToIntroBtn.addEventListener('click', function() {
                // Hide journey section with animation
                journeySection.style.opacity = '0';
                journeySection.style.transition = 'opacity 0.8s ease';
                backToIntroBtn.classList.remove('visible');
                
                // Show intro section after a short delay
                setTimeout(() => {
                    journeySection.classList.remove('visible');
                    document.querySelector('.journey-intro').style.display = 'flex';
                    
                    setTimeout(() => {
                        document.querySelector('.journey-intro').style.opacity = '1';
                    }, 50);
                }, 800);
                
                // Remove URL hash
                history.replaceState(null, null, ' ');
            });
            
            // Expand/collapse functionality for timeline items
            const timelineItems = document.querySelectorAll('.timeline-item');
            
            timelineItems.forEach(item => {
                const expandIndicator = item.querySelector('.expand-indicator');
                
                expandIndicator.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Close all other expanded items
                    timelineItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('expanded')) {
                            otherItem.classList.remove('expanded');
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('expanded');
                });
                
                // Also allow clicking anywhere on the item to expand (but not on the year badge)
                item.addEventListener('click', function(e) {
                    if (!e.target.closest('.timeline-year')) {
                        // Close all other expanded items
                        timelineItems.forEach(otherItem => {
                            if (otherItem !== item && otherItem.classList.contains('expanded')) {
                                otherItem.classList.remove('expanded');
                            }
                        });
                        
                        // Toggle current item
                        item.classList.toggle('expanded');
                    }
                });
            });
            
            // Animate floating elements on mouse move
            const journeyIntro = document.querySelector('.journey-intro');
            journeyIntro.addEventListener('mousemove', function(e) {
                const floaters = document.querySelectorAll('.floating-element');
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                
                floaters.forEach((floater, index) => {
                    const speed = 0.01 + (index * 0.01);
                    const xOffset = (x * 20 * speed) - (10 * speed);
                    const yOffset = (y * 20 * speed) - (10 * speed);
                    
                    floater.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
                });
            });
            
            // Handle hash navigation
            if (window.location.hash === '#journey') {
                beginJourneyBtn.click();
            }
        });
