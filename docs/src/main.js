import { initAnimations } from './animations.js'
import { initLazyLoading, optimizeImages, addProgressiveLoading } from './lazyLoader.js'
import { initSearch, initFilters } from './search.js'
import { initPersonalization } from './personalization.js'
import { initFormHandler, initFormAutoSave } from './formHandler.js'

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Conscious Journey enhancements...')
  
  try {
    // Core performance optimizations
    addProgressiveLoading()
    optimizeImages()
    initLazyLoading()
    
    // Animation system
    initAnimations()
    
    // User experience enhancements
    initPersonalization()
    initFormHandler()
    initFormAutoSave()
    
    // Search and filtering
    if (document.getElementById('search-input')) {
      initSearch()
    }
    initFilters()
    
    // Enhanced theme switching
    initEnhancedThemeToggle()
    
    // Enhanced navigation
    initSmoothNavigation()
    
    // Performance monitoring
    initPerformanceMonitoring()
    
    // Service Worker registration
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/service-worker.js')
        console.log('✅ Service Worker registered successfully')
      } catch (error) {
        console.log('❌ Service Worker registration failed:', error)
      }
    }
    
    console.log('✅ All enhancements initialized successfully!')
    
  } catch (error) {
    console.error('❌ Error initializing enhancements:', error)
  }
})

// Enhanced theme toggle with smooth transitions
const initEnhancedThemeToggle = () => {
  const themeToggle = document.querySelector('.theme-toggle')
  if (!themeToggle) return
  
  themeToggle.addEventListener('click', () => {
    const body = document.body
    const isDark = body.classList.contains('dark-mode')
    
    // Add transition class
    body.classList.add('theme-transitioning')
    
    // Toggle theme
    body.classList.toggle('dark-mode')
    
    // Update icon with animation
    if (window.gsap) {
      gsap.to(themeToggle, {
        rotation: 360,
        duration: 0.5,
        ease: 'power2.out'
      })
    }
    
    // Save preference
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {}
    preferences.theme = body.classList.contains('dark-mode') ? 'dark' : 'light'
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
    
    // Remove transition class after animation
    setTimeout(() => {
      body.classList.remove('theme-transitioning')
    }, 500)
    
    // Track theme change
    if (window.gtag) {
      gtag('event', 'theme_change', {
        event_category: 'UI',
        event_label: body.classList.contains('dark-mode') ? 'dark' : 'light'
      })
    }
  })
}

// Enhanced smooth navigation
const initSmoothNavigation = () => {
  // Mobile menu toggle
  const mobileMenu = document.querySelector('.mobile-menu')
  const nav = document.querySelector('nav')
  
  if (mobileMenu && nav) {
    mobileMenu.addEventListener('click', () => {
      nav.classList.toggle('mobile-active')
      mobileMenu.classList.toggle('active')
      
      // Animate hamburger to X
      if (window.gsap) {
        const isActive = mobileMenu.classList.contains('active')
        gsap.to(mobileMenu, {
          rotation: isActive ? 90 : 0,
          duration: 0.3
        })
      }
    })
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav && nav.classList.contains('mobile-active')) {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        nav.classList.remove('mobile-active')
        mobileMenu.classList.remove('active')
      }
    }
  })
  
  // Enhanced scroll spy for navigation
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('nav a[href^="#"]')
  
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-100px 0px -100px 0px'
  }
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const navLink = document.querySelector(`nav a[href="#${entry.target.id}"]`)
      if (navLink) {
        navLink.classList.toggle('active', entry.isIntersecting)
      }
    })
  }, observerOptions)
  
  sections.forEach(section => sectionObserver.observe(section))
}

// Performance monitoring
const initPerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('web-vital' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(sendToAnalytics)
      getFID(sendToAnalytics)
      getFCP(sendToAnalytics)
      getLCP(sendToAnalytics)
      getTTFB(sendToAnalytics)
    })
  }
  
  // Monitor page load performance
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0]
    
    if (window.gtag && perfData) {
      gtag('event', 'page_load_performance', {
        event_category: 'Performance',
        custom_parameter_1: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
        custom_parameter_2: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)
      })
    }
  })
  
  // Monitor JavaScript errors
  window.addEventListener('error', (e) => {
    if (window.gtag) {
      gtag('event', 'javascript_error', {
        event_category: 'Error',
        event_label: e.message,
        custom_parameter_1: e.filename,
        custom_parameter_2: e.lineno
      })
    }
  })
}

const sendToAnalytics = (metric) => {
  if (window.gtag) {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      custom_parameter_1: metric.id
    })
  }
}

// Utility functions for global use
window.scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    if (window.gsap) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: {
          y: section,
          offsetY: 100
        },
        ease: 'power2.inOut'
      })
    } else {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// Global error handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason)
  if (window.gtag) {
    gtag('event', 'unhandled_promise_rejection', {
      event_category: 'Error',
      event_label: e.reason?.message || 'Unknown error'
    })
  }
})

// Export for use in other modules
export { initEnhancedThemeToggle, initSmoothNavigation }
