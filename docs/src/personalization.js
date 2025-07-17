export const initPersonalization = () => {
  const userPreferences = getUserPreferences()
  
  // Apply saved preferences
  applyThemePreference(userPreferences.theme)
  applyLanguagePreference(userPreferences.language)
  
  // Track user interactions
  initInteractionTracking()
  
  // Generate personalized content
  generateRecommendations(userPreferences.interests)
  
  // Initialize bookmark system
  initBookmarkSystem()
  
  // Show returning user content
  handleReturningUser(userPreferences)
}

const getUserPreferences = () => {
  const defaultPreferences = {
    theme: 'auto',
    language: 'en',
    interests: [],
    visitCount: 0,
    lastVisit: null,
    bookmarks: [],
    timeSpent: {},
    interactions: []
  }
  
  const saved = localStorage.getItem('userPreferences')
  const preferences = saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences
  
  // Update visit tracking
  preferences.visitCount += 1
  preferences.lastVisit = new Date().toISOString()
  
  saveUserPreferences(preferences)
  return preferences
}

const saveUserPreferences = (preferences) => {
  localStorage.setItem('userPreferences', JSON.stringify(preferences))
}

const applyThemePreference = (theme) => {
  const body = document.body
  
  if (theme === 'dark') {
    body.classList.add('dark-mode')
  } else if (theme === 'light') {
    body.classList.remove('dark-mode')
  } else if (theme === 'auto') {
    // Auto theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    body.classList.toggle('dark-mode', prefersDark)
  }
  
  // Update theme toggle button
  const themeToggle = document.querySelector('.theme-toggle')
  if (themeToggle) {
    const icon = body.classList.contains('dark-mode') ? 'fa-sun' : 'fa-moon'
    themeToggle.className = `theme-toggle fas ${icon}`
  }
}

const applyLanguagePreference = (language) => {
  document.documentElement.lang = language
  
  // Update active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === language)
  })
}

const initInteractionTracking = () => {
  // Track clicks on important elements
  document.querySelectorAll('[data-track]').forEach(element => {
    element.addEventListener('click', () => {
      const eventType = element.dataset.track
      trackInteraction(eventType, {
        element: element.tagName,
        text: element.textContent?.substring(0, 50),
        timestamp: new Date().toISOString()
      })
    })
  })
  
  // Track time spent on sections
  const sections = document.querySelectorAll('section[id]')
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startSectionTimer(entry.target.id)
      } else {
        endSectionTimer(entry.target.id)
      }
    })
  }, { threshold: 0.5 })
  
  sections.forEach(section => sectionObserver.observe(section))
  
  // Track scroll depth
  let maxScrollDepth = 0
  window.addEventListener('scroll', () => {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth
      if (scrollDepth % 25 === 0) {
        trackInteraction('scroll_depth', { depth: scrollDepth })
      }
    }
  })
}

let sectionTimers = {}

const startSectionTimer = (sectionId) => {
  sectionTimers[sectionId] = Date.now()
}

const endSectionTimer = (sectionId) => {
  if (sectionTimers[sectionId]) {
    const timeSpent = Date.now() - sectionTimers[sectionId]
    const preferences = getUserPreferences()
    
    if (!preferences.timeSpent[sectionId]) {
      preferences.timeSpent[sectionId] = 0
    }
    preferences.timeSpent[sectionId] += timeSpent
    
    saveUserPreferences(preferences)
    delete sectionTimers[sectionId]
  }
}

const trackInteraction = (eventType, data = {}) => {
  const preferences = getUserPreferences()
  
  // Add to interactions log
  preferences.interactions.push({
    type: eventType,
    data,
    timestamp: new Date().toISOString()
  })
  
  // Update interests based on interaction
  if (!preferences.interests.includes(eventType)) {
    preferences.interests.push(eventType)
  }
  
  // Keep only last 100 interactions
  if (preferences.interactions.length > 100) {
    preferences.interactions = preferences.interactions.slice(-100)
  }
  
  saveUserPreferences(preferences)
  
  // Send to analytics if available
  if (window.gtag) {
    gtag('event', 'user_interaction', {
      event_category: 'Engagement',
      event_label: eventType,
      custom_parameter_1: JSON.stringify(data)
    })
  }
}

const generateRecommendations = (interests) => {
  if (interests.length === 0) return
  
  const recommendationsContainer = document.getElementById('recommendations')
  if (!recommendationsContainer) return
  
  const recommendations = getRecommendationsForInterests(interests)
  
  if (recommendations.length > 0) {
    recommendationsContainer.innerHTML = `
      <div class="recommendations-section">
        <h3>Based on your interests</h3>
        <div class="recommendations-grid">
          ${recommendations.map(rec => `
            <div class="recommendation-card" data-track="recommendation_click">
              <div class="rec-icon">${rec.icon}</div>
              <h4>${rec.title}</h4>
              <p>${rec.description}</p>
              <a href="${rec.link}" class="rec-link">Explore</a>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }
}

const getRecommendationsForInterests = (interests) => {
  const recommendations = []
  
  if (interests.includes('timeline') || interests.includes('journey')) {
    recommendations.push({
      icon: '🌱',
      title: 'Personal Growth Journey',
      description: 'Explore more about the conscious evolution and mindfulness practices.',
      link: '#journey'
    })
  }
  
  if (interests.includes('projects') || interests.includes('work')) {
    recommendations.push({
      icon: '💼',
      title: 'Professional Projects',
      description: 'Discover collaborative opportunities and professional work.',
      link: '#projects'
    })
  }
  
  if (interests.includes('values') || interests.includes('philosophy')) {
    recommendations.push({
      icon: '🧘',
      title: 'Core Values & Philosophy',
      description: 'Deep dive into the philosophical foundations and life principles.',
      link: '#values'
    })
  }
  
  return recommendations.slice(0, 3) // Limit to 3 recommendations
}

const initBookmarkSystem = () => {
  // Add bookmark buttons to content items
  document.querySelectorAll('.timeline-item, .project-card, .value-card').forEach((item, index) => {
    const bookmarkBtn = document.createElement('button')
    bookmarkBtn.className = 'bookmark-btn'
    bookmarkBtn.innerHTML = '🔖'
    bookmarkBtn.title = 'Bookmark this item'
    
    const itemId = item.id || `item-${index}`
    item.id = itemId
    
    const preferences = getUserPreferences()
    if (preferences.bookmarks.includes(itemId)) {
      bookmarkBtn.classList.add('bookmarked')
      bookmarkBtn.innerHTML = '📌'
    }
    
    bookmarkBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      toggleBookmark(itemId, bookmarkBtn)
    })
    
    item.style.position = 'relative'
    item.appendChild(bookmarkBtn)
  })
  
  // Create bookmarks section if user has bookmarks
  const preferences = getUserPreferences()
  if (preferences.bookmarks.length > 0) {
    createBookmarksSection(preferences.bookmarks)
  }
}

const toggleBookmark = (itemId, button) => {
  const preferences = getUserPreferences()
  const isBookmarked = preferences.bookmarks.includes(itemId)
  
  if (isBookmarked) {
    preferences.bookmarks = preferences.bookmarks.filter(id => id !== itemId)
    button.classList.remove('bookmarked')
    button.innerHTML = '🔖'
  } else {
    preferences.bookmarks.push(itemId)
    button.classList.add('bookmarked')
    button.innerHTML = '📌'
  }
  
  saveUserPreferences(preferences)
  trackInteraction('bookmark_toggle', { itemId, action: isBookmarked ? 'remove' : 'add' })
}

const createBookmarksSection = (bookmarks) => {
  const bookmarksSection = document.createElement('section')
  bookmarksSection.id = 'bookmarks'
  bookmarksSection.className = 'bookmarks-section'
  bookmarksSection.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Your Bookmarks</h2>
        <p class="section-subtitle">Items you've saved for later</p>
      </div>
      <div class="bookmarks-grid" id="bookmarks-grid">
        ${bookmarks.map(bookmarkId => {
          const element = document.getElementById(bookmarkId)
          if (element) {
            const title = element.querySelector('.chapter-title, .project-title, .value-title')?.textContent || 'Bookmarked Item'
            const desc = element.querySelector('.chapter-text, .project-desc, .value-desc')?.textContent?.substring(0, 100) || ''
            return `
              <div class="bookmark-item" data-target="${bookmarkId}">
                <h4>${title}</h4>
                <p>${desc}...</p>
                <button class="goto-bookmark">View</button>
              </div>
            `
          }
          return ''
        }).join('')}
      </div>
    </div>
  `
  
  // Insert before contact section
  const contactSection = document.querySelector('.contact')
  if (contactSection) {
    contactSection.parentNode.insertBefore(bookmarksSection, contactSection)
  }
  
  // Add click handlers
  bookmarksSection.querySelectorAll('.goto-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bookmarkItem = e.target.closest('.bookmark-item')
      const targetId = bookmarkItem.dataset.target
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        trackInteraction('bookmark_navigate', { targetId })
      }
    })
  })
}

const handleReturningUser = (preferences) => {
  if (preferences.visitCount > 1) {
    // Show welcome back message
    const welcomeMessage = document.createElement('div')
    welcomeMessage.className = 'welcome-back-message'
    welcomeMessage.innerHTML = `
      <div class="welcome-content">
        <span class="welcome-icon">👋</span>
        <span class="welcome-text">Welcome back! This is visit #${preferences.visitCount}</span>
        <button class="welcome-close">×</button>
      </div>
    `
    
    document.body.appendChild(welcomeMessage)
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      welcomeMessage.remove()
    }, 5000)
    
    // Manual close
    welcomeMessage.querySelector('.welcome-close').addEventListener('click', () => {
      welcomeMessage.remove()
    })
    
    trackInteraction('returning_user', { visitCount: preferences.visitCount })
  }
}
