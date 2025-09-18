        document.addEventListener('DOMContentLoaded', function() {
            // Check if IntersectionObserver is supported
            if (!('IntersectionObserver' in window)) {
                // Fallback for browsers that don't support IntersectionObserver
                var elements = document.querySelectorAll('.manifesto-content, .manifesto-title, .manifesto-text p, .manifesto-signature, .manifesto-controls');
                elements.forEach(function(el) {
                    el.classList.add('visible');
                });
                return;
            }
            
            const themeBtn = document.getElementById('theme-btn');
            const shareBtn = document.getElementById('share-btn');
            const closeShare = document.getElementById('close-share');
            const shareOptions = document.getElementById('share-options');
            const scrollProgressBar = document.querySelector('.scroll-progress-bar');
            const scrollIndicator = document.querySelector('.scroll-indicator');
            const manifestoContent = document.querySelector('.manifesto-content');
            const manifestoTitle = document.querySelector('.manifesto-title');
            const manifestoTextParagraphs = document.querySelectorAll('.manifesto-text p');
            const manifestoSignature = document.querySelector('.manifesto-signature');
            const manifestoControls = document.querySelector('.manifesto-controls');
            
            // Theme toggle functionality
            themeBtn.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                
                // Save theme preference to localStorage
                const isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkMode);
            });
            
            // Check for saved theme preference
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('dark-mode');
            }
            
            // Share functionality
            shareBtn.addEventListener('click', function() {
                shareOptions.classList.add('active');
            });
            
            closeShare.addEventListener('click', function() {
                shareOptions.classList.remove('active');
            });
            
            // Scroll to top functionality
            scrollIndicator.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Set up Intersection Observer for animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            // Observe elements for animation
            if (manifestoContent) observer.observe(manifestoContent);
            if (manifestoTitle) observer.observe(manifestoTitle);
            
            if (manifestoTextParagraphs.length > 0) {
                manifestoTextParagraphs.forEach(paragraph => {
                    observer.observe(paragraph);
                });
            }
            
            if (manifestoSignature) observer.observe(manifestoSignature);
            if (manifestoControls) observer.observe(manifestoControls);
            
            // Update scroll progress and show/hide scroll indicator
            window.addEventListener('scroll', () => {
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
                
                // Update progress bar
                if (scrollProgressBar) {
                    scrollProgressBar.style.width = scrollPercent + '%';
                }
                
                // Show/hide scroll to top button
                if (scrollIndicator) {
                    if (scrollTop > 300) {
                        scrollIndicator.classList.add('visible');
                    } else {
                        scrollIndicator.classList.remove('visible');
                    }
                }
            });
            
            // Set up social sharing links
            const shareUrl = encodeURIComponent(window.location.href);
            const shareText = encodeURIComponent("Check out Roshan Adhikari's inspiring manifesto");
            
            const facebookBtn = document.querySelector('.share-button.facebook');
            const twitterBtn = document.querySelector('.share-button.twitter');
            const linkedinBtn = document.querySelector('.share-button.linkedin');
            const whatsappBtn = document.querySelector('.share-button.whatsapp');
            
            if (facebookBtn) facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
            if (twitterBtn) twitterBtn.href = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
            if (linkedinBtn) linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
            if (whatsappBtn) whatsappBtn.href = `https://wa.me/?text=${shareText}%20${shareUrl}`;
            
            // Highlight text animation
            const highlights = document.querySelectorAll('.highlight');
            if (highlights.length > 0) {
                highlights.forEach(highlight => {
                    highlight.addEventListener('mouseenter', function() {
                        this.style.background = 'linear-gradient(120deg, rgba(142, 110, 99, 0.4) 0%, rgba(46, 125, 50, 0.4) 100%)';
                    });
                    
                    highlight.addEventListener('mouseleave', function() {
                        this.style.background = 'linear-gradient(120deg, rgba(142, 110, 99, 0.2) 0%, rgba(46, 125, 50, 0.2) 100%)';
                    });
                });
            }
            
            // Make sure all elements are visible by default (fallback)
            setTimeout(() => {
                const elements = document.querySelectorAll('.manifesto-content, .manifesto-title, .manifesto-text p, .manifesto-signature, .manifesto-controls');
                elements.forEach(el => {
                    if (el && !el.classList.contains('visible')) {
                        el.classList.add('visible');
                    }
                });
            }, 1000);
        });
