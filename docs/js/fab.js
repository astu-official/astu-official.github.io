     document.addEventListener('DOMContentLoaded', () => {
            const fabWrapper = document.querySelector('.liquid-fab-wrapper');
            const fabBtn = document.querySelector('.liquid-fab');
            const fabMenuItems = document.querySelectorAll('.fab-item');
            const themeToggle = document.getElementById('themeToggle');

            // Toggle FAB
            fabBtn.addEventListener('click', e => {
                fabWrapper.classList.toggle('active');
                fabBtn.setAttribute('aria-expanded', fabWrapper.classList.contains('active'));

                // Create ripple effect
                createRipple(e);
            });

            // Create ripple effect
            function createRipple(e) {
                // Remove existing ripples
                const existingRipples = fabBtn.querySelectorAll('.ripple-effect');
                existingRipples.forEach(ripple => ripple.remove());

                // Create new ripple
                const newRipple = document.createElement('span');
                newRipple.classList.add('fab-ripple', 'ripple-effect');
                
                const rect = fabBtn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size/2;
                const y = e.clientY - rect.top - size/2;
                
                newRipple.style.width = size + 'px';
                newRipple.style.height = size + 'px';
                newRipple.style.left = x + 'px';
                newRipple.style.top = y + 'px';
                
                fabBtn.appendChild(newRipple);

                // Remove ripple after animation completes
                setTimeout(() => {
                    if (newRipple.parentNode === fabBtn) {
                        fabBtn.removeChild(newRipple);
                    }
                }, 600);
            }

            // Click outside to close
            document.addEventListener('click', e => {
                if (!fabWrapper.contains(e.target)) {
                    fabWrapper.classList.remove('active');
                    fabBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // FAB Menu Actions
            fabMenuItems.forEach((item, i) => {
                item.addEventListener('click', () => {
                    const target = item.dataset.target;
                    
                    // Add click effect
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.transform = '';
                    }, 150);
                    
                    if (target === "scrollTop") {
                        window.scrollTo({top: 0, behavior: 'smooth'});
                    } else {
                        const section = document.getElementById(target);
                        if (section) {
                            section.scrollIntoView({behavior: 'smooth'});
                        }
                    }
                    
                    fabWrapper.classList.remove('active');
                    fabBtn.setAttribute('aria-expanded', 'false');
                });
            });

            // Keyboard accessibility
            fabBtn.addEventListener('keydown', e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fabBtn.click();
                }
            });

            // Theme toggle for demo
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? 
                    '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            });

            // Add touch support for mobile devices
            fabBtn.addEventListener('touchstart', function(e) {
                // Prevent double-tap zoom
                if (e.touches.length > 1) e.preventDefault();
            }, { passive: false });

            // Add subtle pulse animation to attract attention
            setInterval(() => {
                if (!fabWrapper.classList.contains('active')) {
                    fabBtn.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        fabBtn.style.transform = '';
                    }, 600);
                }
            }, 8000);
        });
        // FAB click handler
document.querySelectorAll('.fab-item').forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        const section = document.getElementById(targetId);
        if(section){
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// "Begin Your Journey" button scroll to main journey section
document.getElementById('beginJourneyBtn').addEventListener('click', () => {
    const journeySection = document.getElementById('journey');
    if(journeySection){
        journeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
