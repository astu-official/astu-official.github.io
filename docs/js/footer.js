       document.addEventListener('DOMContentLoaded', function() {
            // Scroll progress indicator
            const scrollProgress = document.querySelector('.scroll-progress');
            const scrollToTop = document.querySelector('.scroll-to-top');
            
            window.addEventListener('scroll', () => {
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
                
                scrollProgress.style.width = scrollPercent + '%';
                
                // Show/hide scroll to top button
                if (scrollTop > 300) {
                    scrollToTop.classList.add('visible');
                } else {
                    scrollToTop.classList.remove('visible');
                }
            });
            
            // Scroll to top functionality
            scrollToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Newsletter form submission
            const newsletterForm = document.querySelector('.newsletter-form');
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = this.querySelector('input[type="email"]');
                
                // Simple validation
                if (emailInput.value && isValidEmail(emailInput.value)) {
                    // Show success message (in a real implementation, you would send this to a server)
                    alert('Thank you for subscribing to our newsletter!');
                    emailInput.value = '';
                } else {
                    alert('Please enter a valid email address.');
                }
            });
            
            // Email validation function
            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            // Add subtle animation to social links when they come into view
            const socialLinks = document.querySelectorAll('.social-link');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = 1;
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
            }, { threshold: 0.1 });
            
            socialLinks.forEach(link => {
                link.style.opacity = 0;
                link.style.transform = 'translateY(20px)';
                link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(link);
            });
        });
