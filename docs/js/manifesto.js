  document.addEventListener('DOMContentLoaded', function() {
            const shareBtn = document.getElementById('share-btn');
            const closeShare = document.getElementById('close-share');
            const shareOptions = document.getElementById('share-options');
            
            // Share functionality
            if (shareBtn && closeShare && shareOptions) {
                shareBtn.addEventListener('click', function() {
                    shareOptions.classList.add('active');
                });
                
                closeShare.addEventListener('click', function() {
                    shareOptions.classList.remove('active');
                });
            }
            
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
            highlights.forEach(highlight => {
                highlight.addEventListener('mouseenter', function() {
                    this.style.background = 'linear-gradient(120deg, rgba(142, 110, 99, 0.4) 0%, rgba(46, 125, 50, 0.4) 100%)';
                });
                
                highlight.addEventListener('mouseleave', function() {
                    this.style.background = 'linear-gradient(120deg, rgba(142, 110, 99, 0.3) 0%, rgba(46, 125, 50, 0.3) 100%)';
                });
            });

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Calculate the scroll position considering the header height
                        const headerHeight = 100; // Adjust based on your actual header height
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });
