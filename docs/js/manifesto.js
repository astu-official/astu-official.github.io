 document.addEventListener('DOMContentLoaded', function() {
            const shareBtn = document.getElementById('share-btn');
            const closeShare = document.getElementById('close-share');
            const shareOptions = document.getElementById('share-options');
            
            // Share functionality
            shareBtn.addEventListener('click', function() {
                shareOptions.classList.add('active');
            });
            
            closeShare.addEventListener('click', function() {
                shareOptions.classList.remove('active');
            });
            
            // Set up social sharing links
            const shareUrl = encodeURIComponent(window.location.href);
            const shareText = encodeURIComponent("Check out Roshan Adhikari's inspiring manifesto");
            
            document.querySelector('.share-button.facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
            document.querySelector('.share-button.twitter').href = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
            document.querySelector('.share-button.linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
            document.querySelector('.share-button.whatsapp').href = `https://wa.me/?text=${shareText}%20${shareUrl}`;
            
            // Highlight text animation
            const highlights = document.querySelectorAll('.highlight');
            highlights.forEach(highlight => {
                highlight.addEventListener('mouseenter', function() {
                    this.style.background = 'linear-gradient(120deg, rgba(142, 110, 99, 0.4) 0%, rgba(46, 125, 50, 0.4) 100%)';
                });
                
                highlight.addEventListener('mouseleave', function() {
                    this.style.background = 'linear-gradient(120deg, rgba(142, 110, 99, 0.2) 0%, rgba(46, 125, 50, 0.2) 100%)';
                });
            });
        });
