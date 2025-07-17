// Simple client-side search implementation
// Can be upgraded to Algolia later for production

export const initSearch = () => {
  const searchInput = document.getElementById('search-input')
  const searchResults = document.getElementById('search-results')
  const searchOverlay = document.getElementById('search-overlay')
  
  if (!searchInput) return

  // Create search index from existing content
  const searchIndex = createSearchIndex()
  
  let searchTimeout
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim()
    
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      if (query.length > 2) {
        const results = performSearch(query, searchIndex)
        displayResults(results)
        showSearchOverlay()
      } else {
        hideSearchOverlay()
      }
    }, 300)
  })

  // Close search on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideSearchOverlay()
      searchInput.value = ''
    }
  })

  // Close search when clicking outside
  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      hideSearchOverlay()
    }
  })
}

const createSearchIndex = () => {
  const index = []
  
  // Index timeline items
  document.querySelectorAll('.timeline-item').forEach((item, idx) => {
    const title = item.querySelector('.chapter-title')?.textContent || ''
    const text = item.querySelector('.chapter-text')?.textContent || ''
    const year = item.querySelector('.timeline-year')?.textContent || ''
    
    index.push({
      id: `timeline-${idx}`,
      type: 'timeline',
      title: title,
      content: text,
      year: year,
      element: item
    })
  })

  // Index project cards
  document.querySelectorAll('.project-card').forEach((item, idx) => {
    const title = item.querySelector('.project-title')?.textContent || ''
    const desc = item.querySelector('.project-desc')?.textContent || ''
    
    index.push({
      id: `project-${idx}`,
      type: 'project',
      title: title,
      content: desc,
      element: item
    })
  })

  // Index value cards
  document.querySelectorAll('.value-card').forEach((item, idx) => {
    const title = item.querySelector('.value-title')?.textContent || ''
    const desc = item.querySelector('.value-desc')?.textContent || ''
    
    index.push({
      id: `value-${idx}`,
      type: 'value',
      title: title,
      content: desc,
      element: item
    })
  })

  return index
}

const performSearch = (query, index) => {
  const queryLower = query.toLowerCase()
  const results = []

  index.forEach(item => {
    let score = 0
    const titleLower = item.title.toLowerCase()
    const contentLower = item.content.toLowerCase()

    // Title matches get higher score
    if (titleLower.includes(queryLower)) {
      score += titleLower === queryLower ? 10 : 5
    }

    // Content matches
    if (contentLower.includes(queryLower)) {
      score += 2
    }

    // Year matches for timeline items
    if (item.year && item.year.includes(query)) {
      score += 3
    }

    if (score > 0) {
      results.push({
        ...item,
        score,
        snippet: createSnippet(item.content, query)
      })
    }
  })

  return results.sort((a, b) => b.score - a.score).slice(0, 10)
}

const createSnippet = (content, query) => {
  const queryLower = query.toLowerCase()
  const contentLower = content.toLowerCase()
  const index = contentLower.indexOf(queryLower)
  
  if (index === -1) return content.substring(0, 150) + '...'
  
  const start = Math.max(0, index - 50)
  const end = Math.min(content.length, index + query.length + 50)
  
  let snippet = content.substring(start, end)
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'
  
  // Highlight the search term
  const regex = new RegExp(`(${query})`, 'gi')
  snippet = snippet.replace(regex, '<mark>$1</mark>')
  
  return snippet
}

const displayResults = (results) => {
  const searchResults = document.getElementById('search-results')
  if (!searchResults) return

  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="no-results">
        <p>No results found. Try different keywords.</p>
      </div>
    `
    return
  }

  searchResults.innerHTML = results.map(result => `
    <div class="search-result" data-type="${result.type}">
      <div class="result-type">${result.type}</div>
      <h3 class="result-title">${result.title}</h3>
      <p class="result-snippet">${result.snippet}</p>
      <div class="result-meta">
        ${result.year ? `<span class="result-year">${result.year}</span>` : ''}
        <span class="result-score">Relevance: ${result.score}</span>
      </div>
    </div>
  `).join('')

  // Add click handlers to scroll to results
  searchResults.querySelectorAll('.search-result').forEach((resultEl, idx) => {
    resultEl.addEventListener('click', () => {
      const result = results[idx]
      scrollToElement(result.element)
      hideSearchOverlay()
    })
  })
}

const scrollToElement = (element) => {
  if (element && window.gsap) {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: element,
        offsetY: 100
      },
      ease: 'power2.inOut'
    })
  } else if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const showSearchOverlay = () => {
  const overlay = document.getElementById('search-overlay')
  if (overlay) {
    overlay.classList.add('active')
    document.body.style.overflow = 'hidden'
  }
}

const hideSearchOverlay = () => {
  const overlay = document.getElementById('search-overlay')
  if (overlay) {
    overlay.classList.remove('active')
    document.body.style.overflow = ''
  }
}

// Filter functionality
export const initFilters = () => {
  const filterButtons = document.querySelectorAll('[data-filter]')
  const filterableItems = document.querySelectorAll('[data-category]')

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'))
      button.classList.add('active')
      
      // Filter items
      filterableItems.forEach(item => {
        const category = item.dataset.category
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block'
          if (window.gsap) {
            gsap.from(item, { opacity: 0, y: 20, duration: 0.5 })
          }
        } else {
          item.style.display = 'none'
        }
      })
    })
  })
}
