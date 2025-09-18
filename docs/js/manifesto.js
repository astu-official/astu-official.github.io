document.addEventListener('DOMContentLoaded', function() {
      const shareBtn = document.getElementById('share-btn');
      const closeShare = document.getElementById('close-share');
      const shareOptions = document.getElementById('share-options');

      shareBtn.addEventListener('click', function() {
        shareOptions.classList.add('active');
      });

      closeShare.addEventListener('click', function() {
        shareOptions.classList.remove('active');
      });

      // Setup social share links
      const shareUrl = encodeURIComponent(window.location.href);
      const shareText = encodeURIComponent("Check out Roshan Adhikari's inspiring manifesto");

      document.querySelector('.share-button.facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
      document.querySelector('.share-button.twitter').href = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
      document.querySelector('.share-button.linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
      document.querySelector('.share-button.whatsapp').href = `https://wa.me/?text=${shareText}%20${shareUrl}`;
    });
