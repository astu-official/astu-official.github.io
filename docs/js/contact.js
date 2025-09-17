      document.addEventListener('DOMContentLoaded', function() {
            const contactForm = document.getElementById('contact-form');
            const submitBtn = contactForm.querySelector('.submit-btn');
            const confirmation = document.getElementById('form-confirmation');
            const themeToggle = document.getElementById('theme-toggle');
            
            // Theme toggle functionality
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                
                // Save theme preference to localStorage
                const isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkMode);
            });
            
            // Check for saved theme preference
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('dark-mode');
            }
            
            // Form validation
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate form
                let isValid = true;
                
                // Name validation
                const nameInput = document.getElementById('name');
                const nameError = document.getElementById('name-error');
                if (!nameInput.value.trim()) {
                    nameError.textContent = 'Please enter your name';
                    isValid = false;
                } else {
                    nameError.textContent = '';
                }
                
                // Email validation
                const emailInput = document.getElementById('email');
                const emailError = document.getElementById('email-error');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailInput.value.trim()) {
                    emailError.textContent = 'Please enter your email';
                    isValid = false;
                } else if (!emailRegex.test(emailInput.value)) {
                    emailError.textContent = 'Please enter a valid email';
                    isValid = false;
                } else {
                    emailError.textContent = '';
                }
                
                // Subject validation
                const subjectInput = document.getElementById('subject');
                const subjectError = document.getElementById('subject-error');
                if (!subjectInput.value) {
                    subjectError.textContent = 'Please select a subject';
                    isValid = false;
                } else {
                    subjectError.textContent = '';
                }
                
                // Message validation
                const messageInput = document.getElementById('message');
                const messageError = document.getElementById('message-error');
                if (!messageInput.value.trim()) {
                    messageError.textContent = 'Please enter a message';
                    isValid = false;
                } else {
                    messageError.textContent = '';
                }
                
                if (isValid) {
                    // Show loading state
                    submitBtn.classList.add('loading');
                    
                    // Simulate form submission
                    setTimeout(() => {
                        submitBtn.classList.remove('loading');
                        submitBtn.classList.add('success');
                        
                        setTimeout(() => {
                            // Show confirmation
                            confirmation.classList.add('active');
                            
                            // Reset form after success
                            setTimeout(() => {
                                contactForm.reset();
                                submitBtn.classList.remove('success');
                            }, 500);
                        }, 1000);
                    }, 2000);
                }
            });
            
            // Clear error messages on input
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    const errorElement = document.getElementById(`${this.id}-error`);
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                });
            });
            
            // Add subtle animation to form elements when they come into view
            const formElements = document.querySelectorAll('.form-group, .submit-btn');
            
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
            
            formElements.forEach(el => {
                el.style.opacity = 0;
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(el);
            });
        });
