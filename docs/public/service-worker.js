const CACHE_NAME = 'conscious-journey-v1.0.0'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/style.css',
  '/src/enhanced-features.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
]

const DYNAMIC_ASSETS = [
  '/assets/',
  'https://images.unsplash.com/',
  'https://formspree.io/'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Handle static assets
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }
  
  // Handle dynamic assets (images, API calls)
  if (DYNAMIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
    return
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    )
    return
  }
  
  // Default: network first, cache fallback
  event.respondWith(networkFirst(request, DYNAMIC_CACHE))
})

// Cache first strategy (for static assets)
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Cache first strategy failed:', error)
    return new Response('Offline content not available', { status: 503 })
  }
}

// Network first strategy (for dynamic content)
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html')
    }
    
    return new Response('Content not available offline', { status: 503 })
  }
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm())
  }
  
  if (event.tag === 'newsletter-sync') {
    event.waitUntil(syncNewsletterSignup())
  }
})

async function syncContactForm() {
  try {
    const pendingForms = await getStoredData('pending-contact-forms')
    
    for (const formData of pendingForms) {
      try {
        const response = await fetch(formData.url, {
          method: 'POST',
          body: formData.data,
          headers: formData.headers
        })
        
        if (response.ok) {
          // Remove from pending list
          await removeStoredData('pending-contact-forms', formData.id)
          
          // Notify user of successful submission
          self.registration.showNotification('Message Sent!', {
            body: 'Your contact form was submitted successfully.',
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png'
          })
        }
      } catch (error) {
        console.error('Failed to sync contact form:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

async function syncNewsletterSignup() {
  try {
    const pendingSignups = await getStoredData('pending-newsletter-signups')
    
    for (const signup of pendingSignups) {
      try {
        const response = await fetch('/api/newsletter-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signup.data)
        })
        
        if (response.ok) {
          await removeStoredData('pending-newsletter-signups', signup.id)
          
          self.registration.showNotification('Newsletter Subscription Confirmed!', {
            body: 'You have been successfully subscribed to updates.',
            icon: '/pwa-192x192.png'
          })
        }
      } catch (error) {
        console.error('Failed to sync newsletter signup:', error)
      }
    }
  } catch (error) {
    console.error('Newsletter sync failed:', error)
  }
}

// Utility functions for IndexedDB storage
async function getStoredData(storeName) {
  // Simplified implementation - in production, use IndexedDB
  return []
}

async function removeStoredData(storeName, id) {
  // Simplified implementation - in production, use IndexedDB
  return true
}

// Push notification handling
self.addEventListener('push', event => {
  if (!event.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: [100, 50, 100],
    data: data.url ? { url: data.url } : undefined,
    actions: data.actions || []
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})


// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    )
  }
})

// Message handling from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then(cache => cache.addAll(event.data.urls))
    )
  }
})
