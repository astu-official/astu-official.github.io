    document.addEventListener('DOMContentLoaded', function() {
            const header = document.getElementById('header');
            const themeToggle = document.getElementById('theme-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileNav = document.getElementById('mobile-nav');
            const navLinks = document.querySelectorAll('.nav-link');
            
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
            
            // Mobile menu toggle
            mobileMenu.addEventListener('click', function() {
                mobileNav.classList.toggle('active');
                
                // Update icon
                const icon = mobileMenu.querySelector('i');
                if (mobileNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
            
            // Close mobile nav when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileNav.classList.remove('active');
                    const icon = mobileMenu.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                });
            });
            
            // Header scroll effect
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Update active nav link
                const sections = document.querySelectorAll('.section');
                let currentSection = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    
                    if (window.scrollY >= sectionTop - 100) {
                        currentSection = section.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === currentSection) {
                        link.classList.add('active');
                    }
                });
            });
            
            // Smooth scrolling for navigation links
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });
     document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved theme on page load
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    // Toggle dark/light mode
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');

        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        // Save preference
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });
});
   
