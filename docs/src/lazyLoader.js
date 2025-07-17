export const initLazyLoading = () => {
  const lazyImages = [].slice.call(document.querySelectorAll("img[data-src]"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let lazyImage = entry.target;

            // Create a new image to preload
            const img = new Image();
            img.onload = () => {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.remove("lazy");
              lazyImage.classList.add("loaded");
            };
            img.src = lazyImage.dataset.src;

            lazyImageObserver.unobserve(lazyImage);
          }
        });
      },
      {
        rootMargin: "0px 0px 100px 0px",
      }
    );

    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Fallback for older browsers
    lazyImages.forEach((lazyImage) => {
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove("lazy");
    });
  }
};

// WebP support detection and optimization
export const optimizeImages = () => {
  const supportsWebP = () => {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });
  };

  supportsWebP().then((supported) => {
    if (supported) {
      document.documentElement.classList.add("webp-support");
    }
  });
};

// Progressive image loading with blur effect
export const addProgressiveLoading = () => {
  const style = document.createElement("style");
  style.textContent = `
    img[data-src] {
      filter: blur(5px);
      transition: filter 0.3s;
    }
    
    img.loaded {
      filter: blur(0);
    }
    
    .lazy-placeholder {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
};
