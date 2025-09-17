     document.addEventListener('DOMContentLoaded', function() {
            const themeToggle = document.getElementById('theme-toggle');
            
            // Theme toggle functionality
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
            
            beginJourneyBtn.addEventListener('click', function() {
                // Hide intro section with animation
                document.querySelector('.journey-intro').style.opacity = '0';
                document.querySelector('.journey-intro').style.transition = 'opacity 0.8s ease';
                
                // Show journey section after a short delay
                setTimeout(() => {
                    document.querySelector('.journey-intro').style.display = 'none';
                    journeySection.classList.add('visible');
                    
                    // Animate timeline items in sequence
                    const timelineItems = document.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, 300 * index);
                    });
                }, 800);
            });
            
            // Expand/collapse functionality for timeline items
            const timelineItems = document.querySelectorAll('.timeline-item');
            
            timelineItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Close all other expanded items
                    timelineItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('expanded')) {
                            otherItem.classList.remove('expanded');
                        }
                    });
                    
                    // Toggle current item
                    this.classList.toggle('expanded');
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
        });
