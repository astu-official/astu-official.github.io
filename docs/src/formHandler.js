export const initFormHandler = () => {
  const contactForm = document.getElementById('contact-form')
  const newsletterForms = document.querySelectorAll('.newsletter-form')
  
  if (contactForm) {
    initContactForm(contactForm)
  }
  
  newsletterForms.forEach(form => {
    initNewsletterForm(form)
  })
}

const initContactForm = (form) => {
  // Add real-time validation
  const inputs = form.querySelectorAll('input, textarea, select')
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input))
    input.addEventListener('input', () => clearFieldError(input))
  })
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    // Validate all fields
    let isValid = true
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false
      }
    })
    
    if (!isValid) {
      showFormMessage('Please correct the errors above.', 'error')
      return
    }
    
    const submitButton = form.querySelector('button[type="submit"]')
    const originalText = submitButton.textContent
    
    // Show loading state
    submitButton.disabled = true
    submitButton.innerHTML = `
      <span class="loading-spinner"></span>
      Sending...
    `
    
    try {
      const formData = new FormData(form)
      
      // Add additional tracking data
      formData.append('timestamp', new Date().toISOString())
      formData.append('user_agent', navigator.userAgent)
      formData.append('referrer', document.referrer)
      
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        form.reset()
        showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success')
        
        // Track successful submission
        trackFormSubmission('contact', 'success')
        
        // Show thank you animation
        showThankYouAnimation()
        
      } else {
        const errorData = await response.json()
        showFormMessage('There was an issue sending your message. Please try again.', 'error')
        trackFormSubmission('contact', 'error', errorData)
      }
      
    } catch (error) {
      console.error('Form submission error:', error)
      showFormMessage('Network error. Please check your connection and try again.', 'error')
      trackFormSubmission('contact', 'network_error', error.message)
    } finally {
      submitButton.disabled = false
      submitButton.textContent = originalText
    }
  })
}

const initNewsletterForm = (form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const emailInput = form.querySelector('input[type="email"]')
    const submitButton = form.querySelector('button[type="submit"]')
    
    if (!validateEmail(emailInput.value)) {
      showFieldError(emailInput, 'Please enter a valid email address')
      return
    }
    
    const originalText = submitButton.textContent
    submitButton.disabled = true
    submitButton.textContent = 'Subscribing...'
    
    try {
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput.value,
          timestamp: new Date().toISOString(),
          source: 'website'
        })
      })
      
      if (response.ok) {
        form.reset()
        showFormMessage('Successfully subscribed! Check your email for confirmation.', 'success')
        trackFormSubmission('newsletter', 'success')
      } else {
        showFormMessage('Subscription failed. Please try again.', 'error')
        trackFormSubmission('newsletter', 'error')
      }
      
    } catch (error) {
      showFormMessage('Network error. Please try again later.', 'error')
      trackFormSubmission('newsletter', 'network_error')
    } finally {
      submitButton.disabled = false
      submitButton.textContent = originalText
    }
  })
}

const validateField = (field) => {
  const value = field.value.trim()
  let isValid = true
  let errorMessage = ''
  
  // Required field validation
  if (field.hasAttribute('required') && !value) {
    errorMessage = 'This field is required'
    isValid = false
  }
  
  // Email validation
  else if (field.type === 'email' && value && !validateEmail(value)) {
    errorMessage = 'Please enter a valid email address'
    isValid = false
  }
  
  // Name validation
  else if (field.name === 'name' && value && value.length < 2) {
    errorMessage = 'Name must be at least 2 characters'
    isValid = false
  }
  
  // Message validation
  else if (field.name === 'message' && value && value.length < 10) {
    errorMessage = 'Message must be at least 10 characters'
    isValid = false
  }
  
  if (!isValid) {
    showFieldError(field, errorMessage)
  } else {
    clearFieldError(field)
  }
  
  return isValid
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const showFieldError = (field, message) => {
  clearFieldError(field)
  
  field.classList.add('error')
  
  const errorElement = document.createElement('div')
  errorElement.className = 'field-error'
  errorElement.textContent = message
  
  field.parentNode.appendChild(errorElement)
}

const clearFieldError = (field) => {
  field.classList.remove('error')
  
  const existingError = field.parentNode.querySelector('.field-error')
  if (existingError) {
    existingError.remove()
  }
}

const showFormMessage = (message, type) => {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.form-message')
  existingMessages.forEach(msg => msg.remove())
  
  const messageElement = document.createElement('div')
  messageElement.className = `form-message form-message-${type}`
  messageElement.innerHTML = `
    <div class="message-content">
      <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="message-text">${message}</span>
    </div>
  `
  
  // Insert after form
  const form = document.querySelector('form')
  form.parentNode.insertBefore(messageElement, form.nextSibling)
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageElement.remove()
  }, 5000)
  
  // Scroll to message
  messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

const showThankYouAnimation = () => {
  const animation = document.createElement('div')
  animation.className = 'thank-you-animation'
  animation.innerHTML = `
    <div class="thank-you-content">
      <div class="thank-you-icon">🙏</div>
      <h3>Thank You!</h3>
      <p>Your message means a lot. I'll respond soon.</p>
    </div>
  `
  
  document.body.appendChild(animation)
  
  // Animate in
  if (window.gsap) {
    gsap.from(animation, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'back.out(1.7)'
    })
  }
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (window.gsap) {
      gsap.to(animation, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        onComplete: () => animation.remove()
      })
    } else {
      animation.remove()
    }
  }, 3000)
}

const trackFormSubmission = (formType, status, errorData = null) => {
  // Track in analytics
  if (window.gtag) {
    gtag('event', 'form_submission', {
      event_category: 'Forms',
      event_label: formType,
      custom_parameter_1: status,
      custom_parameter_2: errorData ? JSON.stringify(errorData) : null
    })
  }
  
  // Track in personalization system
  if (window.trackInteraction) {
    trackInteraction('form_submission', {
      type: formType,
      status: status,
      error: errorData
    })
  }
}

// Auto-save form data to prevent loss
export const initFormAutoSave = () => {
  const forms = document.querySelectorAll('form')
  
  forms.forEach(form => {
    const formId = form.id || 'default-form'
    
    // Load saved data
    const savedData = localStorage.getItem(`form-data-${formId}`)
    if (savedData) {
      const data = JSON.parse(savedData)
      Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`)
        if (field && field.type !== 'password') {
          field.value = data[key]
        }
      })
    }
    
    // Save data on input
    form.addEventListener('input', () => {
      const formData = new FormData(form)
      const data = {}
      
      for (let [key, value] of formData.entries()) {
        if (key !== 'password') { // Don't save passwords
          data[key] = value
        }
      }
      
      localStorage.setItem(`form-data-${formId}`, JSON.stringify(data))
    })
    
    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
      setTimeout(() => {
        localStorage.removeItem(`form-data-${formId}`)
      }, 1000)
    })
  })
}
