const MEILISEARCH_HOST = 'https://ms-909f535664f8-173.lon.meilisearch.io'
const MEILISEARCH_KEY = '776dc6a11c118bd1640c3a9ff9679f920bc384238534fc4861fcde0152e7fd68' // Public search-only API key

// Production docs (meilisearch.com/docs) use the production index and hybrid search.
// Mintlify PR previews (*.mintlify.site), local dev, and other hosts use staging (no embedders).
const isProductionDocsSite = () => {
  const { hostname } = window.location
  return hostname === 'www.meilisearch.com' || hostname === 'meilisearch.com'
}
const MEILISEARCH_INDEX = isProductionDocsSite() ? 'mintlify-production' : 'mintlify-staging'

// Lucide-style icons (24 viewBox, stroke 2), same as the search icon
const svgIcon = (size, paths) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`
const SVG_PAGE = svgIcon(16, '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>')
const SVG_HASH = svgIcon(16, '<line x1="4" x2="20" y1="9" y2="9"></line><line x1="4" x2="20" y1="15" y2="15"></line><line x1="10" x2="8" y1="3" y2="21"></line><line x1="16" x2="14" y1="3" y2="21"></line>')
const SVG_ARROW_UP = svgIcon(12, '<path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path>')
const SVG_ARROW_DOWN = svgIcon(12, '<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>')
const SVG_ENTER = svgIcon(12, '<polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path>')

// Highlight markers (sent to Meilisearch as highlight tags)
const HL_PRE = '\u0001'
const HL_POST = '\u0002'

// Anchor hits point to a heading. Page hits describe the whole page.
// Anchors like "_R_..." are React ids generated for card titles, not headings.
const isGeneratedAnchor = hit => /^_R_/.test(hit.anchor || '')
const isAnchorHit = hit => Boolean(hit.anchor) || Boolean(hit.hierarchy_lvl2)

// Strip zero-width spaces and decode HTML entities left by the scraper (for example &gt;)
const decodeEntities = value => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = value
  return textarea.value
}
const cleanText = value => decodeEntities(String(value || '')).replace(/\u200b/g, '').replace(/\s+/g, ' ').trim()

// Append text to `el`, wrapping highlighted parts in <em>. Uses text nodes only, so no HTML injection.
const appendHighlighted = (el, value) => {
  cleanText(value).split(new RegExp(`(${HL_PRE}.*?${HL_POST})`, 'g')).forEach(part => {
    if (!part) return
    if (part.startsWith(HL_PRE)) {
      const em = document.createElement('em')
      em.className = 'meilisearch-modal__category-em'
      em.textContent = part.slice(1, -1)
      el.appendChild(em)
    } else {
      el.appendChild(document.createTextNode(part))
    }
  })
}

const setActiveResult = (container, row) => {
  container.querySelectorAll('.meilisearch-modal__result.is-active').forEach(el => {
    el.classList.remove('is-active')
    el.setAttribute('aria-selected', 'false')
  })
  if (row) {
    row.classList.add('is-active')
    row.setAttribute('aria-selected', 'true')
  }
}

// Build one result row. Pages get a file icon, anchors get a "#" and a breadcrumb.
const renderHit = hit => {
  const formatted = hit._formatted || {}
  const isAnchor = isAnchorHit(hit)

  const row = document.createElement('a')
  row.href = hit.url || `/${hit.path}`
  row.className = `meilisearch-modal__result meilisearch-modal__result--${isAnchor ? 'anchor' : 'page'}`
  row.setAttribute('role', 'option')
  row.setAttribute('aria-selected', 'false')

  const icon = document.createElement('span')
  icon.className = 'meilisearch-modal__result-icon'
  icon.innerHTML = isAnchor ? SVG_HASH : SVG_PAGE

  const body = document.createElement('span')
  body.className = 'meilisearch-modal__result-body'

  const title = document.createElement('span')
  title.className = 'meilisearch-modal__result-title'

  const crumb = document.createElement('span')
  crumb.className = 'meilisearch-modal__result-crumb'

  if (isAnchor) {
    // Heading levels below the page title, for example Conditions > Examples
    const headings = [2, 3, 4, 5]
      .map(level => formatted[`hierarchy_lvl${level}`])
      .filter(value => cleanText(value))
    appendHighlighted(title, headings[headings.length - 1] || formatted.hierarchy_lvl1)

    // Page title > parent headings > heading
    const trail = [formatted.hierarchy_lvl1, ...headings].filter(value => cleanText(value))
    trail.forEach((value, index) => {
      if (index > 0) {
        const separator = document.createElement('span')
        separator.className = 'meilisearch-modal__result-separator'
        separator.textContent = '›'
        crumb.appendChild(separator)
      }
      appendHighlighted(crumb, value)
    })
  } else {
    appendHighlighted(title, formatted.hierarchy_lvl1)
    appendHighlighted(crumb, formatted.hierarchy_lvl0)
  }

  body.appendChild(title)
  if (crumb.childNodes.length > 0) body.appendChild(crumb)

  if (formatted.content) {
    const snippet = document.createElement('span')
    snippet.className = 'meilisearch-modal__result-snippet'
    appendHighlighted(snippet, formatted.content)
    body.appendChild(snippet)
  }

  row.appendChild(icon)
  row.appendChild(body)

  // Close the modal once a result is chosen
  row.addEventListener('click', () => {
    document.getElementById('meilisearch-modal-overlay').style.display = 'none'
  })
  row.addEventListener('mousemove', () => {
    if (!row.classList.contains('is-active')) setActiveResult(row.parentElement, row)
  })

  return row
}

function initializeMeilisearchIntegration() {
  // Add a check at the start of the function to prevent multiple initializations
  if (document.getElementById('meilisearch-bar-container')) {
    return
  }

  // Modify the responsive visibility handler
  const handleResponsiveVisibility = () => {
    // Check for both possible IDs
    const searchBarContainer = document.getElementById('meilisearch-bar-container')
    const originalSearchButton = document.getElementById('search-bar-entry')
    const originalMobileSearchButton = document.getElementById('search-bar-entry-mobile')

    if (!searchBarContainer) return

    const isMobileView = window.innerWidth < 1024

    if (isMobileView) {
      // Hide our search bar
      searchBarContainer.style.display = 'none'

      if (originalSearchButton) {
        originalSearchButton.style.display = 'none'
      }
      // Show Mintlify's search buttons
      if (originalMobileSearchButton) {
        originalMobileSearchButton.style.display = 'flex'
      }
    } else {
      // Show our search bar
      searchBarContainer.style.display = 'block'

      // Hide Mintlify's search buttons
      if (originalSearchButton) {
        originalSearchButton.style.display = 'none'
      }
      if (originalMobileSearchButton) {
        originalMobileSearchButton.style.display = 'none'
      }
    }
  }

  // ========= Step 1: Create and inject the visible search bar in the header =========
  const initSearchBar = () => {

    // When finding the original search button, also look for mobile version icon
    const originalSearchButton = document.getElementById('search-bar-entry')
    const originalMobileSearchButton = document.getElementById('search-bar-entry-mobile')

    // Find the header where we'll add our search input
    const header = document.querySelector('header')
    if (!header) { //header not found, cannot add search bar
      return
    }

    // Log header properties to help with debugging
    // console.log('Header found, dimensions:', {
    //   width: header.offsetWidth,
    //   height: header.offsetHeight,
    //   position: window.getComputedStyle(header).position
    // });

    // Try to find a proper container within the header for the search
    let headerContainer = null

    // Option 1: Look for navigation in the header
    const navElement = header.querySelector('nav')
    if (navElement) {
      headerContainer = navElement
    }
    // Option 2: Look for a flex container in the header
    else {
      const potentialContainers = Array.from(header.children).filter(el => {
        const style = window.getComputedStyle(el)
        return style.display === 'flex' || style.display === 'inline-flex'
      })

      if (potentialContainers.length > 0) {
        // Use the widest container
        headerContainer = potentialContainers.reduce((prev, current) => {
          return (prev.offsetWidth > current.offsetWidth) ? prev : current
        })
      } else {
        // Use the header itself as a last resort
        headerContainer = header
      }
    }

    // If we found the original search button, use its positioning and parent
    if (originalSearchButton) {
      // Get the parent element of the search button
      const searchParent = originalSearchButton.parentElement

      if (searchParent) {
        headerContainer = searchParent
      }
    }

    // Create our search input container
    const searchBarContainer = document.createElement('div')
    searchBarContainer.id = 'meilisearch-bar-container'
    searchBarContainer.className = 'meilisearch-bar-container'

    // Create the search input that looks like Meilisearch's
    const searchBar = document.createElement('div')
    searchBar.id = 'meilisearch-search-bar'
    searchBar.className = 'meilisearch-search-bar'
    searchBar.role = 'button'
    searchBar.tabIndex = 0

    // Add the search icon and placeholder text
    searchBar.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
      <span class="meilisearch-search-bar__text">Search…</span>
      <span class="meilisearch-search-bar__shortcut">⌘K</span>
    `

    // Append the search bar to the container
    searchBarContainer.appendChild(searchBar)

    // Check if the header container is a flex container
    const containerStyle = window.getComputedStyle(headerContainer)
    const isFlexContainer = containerStyle.display === 'flex' || containerStyle.display === 'inline-flex'

    // If the header isn't a flex container, we need to make it one for proper centering
    if (!isFlexContainer) {
      // Create a wrapper to center the search bar
      const flexWrapper = document.createElement('div')
      flexWrapper.className = 'meilisearch-flexwrapper'
      flexWrapper.appendChild(searchBarContainer)
      headerContainer.appendChild(flexWrapper)
    } else {
      // Insert the search container into the flex container
      // Find the right position - ideally in the middle
      const childCount = headerContainer.children.length

      if (childCount > 2) {
        // If there are more than 2 children, insert it in the middle
        const middleIndex = Math.floor(childCount / 2)
        const referenceNode = headerContainer.children[middleIndex]
        headerContainer.insertBefore(searchBarContainer, referenceNode)
      } else {
        // Otherwise just append it
        headerContainer.appendChild(searchBarContainer)

        // If this is a flex container, we need to adjust styles for centering
        searchBarContainer.style.flex = '1'
        searchBarContainer.style.margin = '0 auto'
      }
    }

    // ========= Step 2: Create the modal search overlay =========
    const modalOverlay = document.createElement('div')
    modalOverlay.id = 'meilisearch-modal-overlay'
    modalOverlay.className = 'meilisearch-modal-overlay'

    // Create the search modal container
    const searchModal = document.createElement('div')
    searchModal.id = 'meilisearch-modal'
    searchModal.className = 'meilisearch-modal'

    // Create the search input container
    const searchInputContainer = document.createElement('div')
    searchInputContainer.className = 'meilisearch-modal__input-container'

    // Create the search input
    const searchInput = document.createElement('input')
    searchInput.id = 'meilisearch-search-input'
    searchInput.className = 'meilisearch-modal__input'
    searchInput.type = 'text'
    searchInput.placeholder = 'Search…'

    // Create the ESC key indicator
    const escIndicator = document.createElement('span')
    escIndicator.textContent = 'ESC'
    escIndicator.className = 'meilisearch-modal__escape'

    // Create the search icon
    const searchIcon = document.createElement('div')
    searchIcon.className = 'meilisearch-modal__icon'
    searchIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
    `

    // Add elements to the search input container
    searchInputContainer.appendChild(searchIcon)
    searchInputContainer.appendChild(searchInput)
    searchInputContainer.appendChild(escIndicator)

    // Create the results container
    const resultsContainer = document.createElement('div')
    resultsContainer.id = 'meilisearch-results'
    resultsContainer.className = 'meilisearch-modal__results'
    resultsContainer.setAttribute('role', 'listbox')
    resultsContainer.setAttribute('aria-label', 'Search results')

    // Create the faceted filter container
    const filterContainer = document.createElement('div')
    filterContainer.id = 'meilisearch-filter-container'
    filterContainer.className = 'meilisearch-filter-container'

    // Create filter title
    const filterTitle = document.createElement('div')
    filterTitle.className = 'meilisearch-filter-title'
    filterTitle.textContent = 'Narrow down by section'

    // Create filter tags container
    const filterTagsContainer = document.createElement('div')
    filterTagsContainer.className = 'meilisearch-filter-tags'
    filterTagsContainer.setAttribute('role', 'tablist')
    filterTagsContainer.setAttribute('aria-label', 'Section')

    // Sections work as tabs: "All" plus one tab per docs section. The `section`
    // field is set on each record by scripts/search/post-scrape-edit.sh
    const sections = [
      { key: null, label: 'All' },
      { key: 'getting_started', label: 'Getting started' },
      { key: 'capabilities', label: 'Capabilities' },
      { key: 'reference', label: 'Reference' },
      { key: 'resources', label: 'Resources' }
    ]
    const filterTags = []

    // Select a section and rerun the search if there is a query
    const selectSection = (index) => {
      filterTags.forEach((tag, i) => {
        tag.classList.toggle('active', i === index)
        tag.setAttribute('aria-selected', String(i === index))
      })

      if (searchInput.value.trim().length >= 2) {
        searchInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }

    // Tab and Shift+Tab move between sections, wrapping around
    const cycleSection = (step) => {
      const current = filterTags.findIndex(tag => tag.classList.contains('active'))
      selectSection((current + step + filterTags.length) % filterTags.length)
    }

    sections.forEach(({ key: section, label }, index) => {
      const tag = document.createElement('button')
      tag.className = 'meilisearch-filter-tag'
      tag.textContent = label
      tag.setAttribute('role', 'tab')
      tag.tabIndex = -1
      if (section) tag.dataset.section = section
      tag.addEventListener('click', () => {
        selectSection(index)
        searchInput.focus()
      })
      filterTagsContainer.appendChild(tag)
      filterTags.push(tag)
    })
    selectSection(0)

    // Add filter elements to container
    filterContainer.appendChild(filterTitle)
    filterContainer.appendChild(filterTagsContainer)

    // Append everything to the modal
    searchModal.appendChild(searchInputContainer)
    searchModal.appendChild(filterContainer)
    searchModal.appendChild(resultsContainer)

    // Footer with keyboard hints
    const footer = document.createElement('div')
    footer.className = 'meilisearch-modal__footer'
    footer.innerHTML = `
      <span class="meilisearch-modal__hint">
        <kbd>${SVG_ARROW_UP}</kbd><kbd>${SVG_ARROW_DOWN}</kbd>
        <span class="meilisearch-modal__hint-label">Navigate</span>
      </span>
      <span class="meilisearch-modal__hint">
        <kbd>${SVG_ENTER}</kbd>
        <span class="meilisearch-modal__hint-label">Open</span>
      </span>
      <span class="meilisearch-modal__hint">
        <kbd>tab</kbd>
        <span class="meilisearch-modal__hint-label">Switch section</span>
      </span>
      <span class="meilisearch-modal__hint meilisearch-modal__hint--end">
        <kbd>esc</kbd>
        <span class="meilisearch-modal__hint-label">Close</span>
      </span>
    `
    searchModal.appendChild(footer)

    // Add the modal to the overlay
    modalOverlay.appendChild(searchModal)

    // Add the overlay to the body
    document.body.appendChild(modalOverlay)

    // ========= Step 3: Set up event listeners =========

    // Function to open the search modal
    const openSearchModal = () => {
      // Always place the modal at the top, regardless of scroll position
      modalOverlay.style.display = 'flex'

      // Focus the input
      setTimeout(() => {
        searchInput.focus()
      }, 10)
    }

    // Function to close the search modal
    const closeSearchModal = () => {
      modalOverlay.style.display = 'none'
      searchInput.value = ''
      resultsContainer.innerHTML = ''
    }

    // Function to handle clicks on Mintlify search buttons
    const handleMintlifySearchClick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      openSearchModal()
    }

    // Open modal when clicking the search bar
    searchBar.addEventListener('click', openSearchModal)

    // Add click handlers to Mintlify search buttons
    if (originalSearchButton) {
      originalSearchButton.addEventListener('click', handleMintlifySearchClick)
    }
    if (originalMobileSearchButton) {
      originalMobileSearchButton.addEventListener('click', handleMintlifySearchClick)
    }

    // Add handlers for any search buttons that might be added later
    const searchButtonObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.id === 'search-bar-entry' || node.id === 'search-bar-entry-mobile') {
              node.addEventListener('click', handleMintlifySearchClick)
            }
          })
        }
      })
    })

    searchButtonObserver.observe(document.body, { childList: true, subtree: true })

    // Close modal when clicking outside the search modal
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeSearchModal()
      }
    })

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Open with Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        openSearchModal()
        return false
      }

      // Close with Escape
      if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        closeSearchModal()
        return false
      }

      // Same keyboard behavior as the cmd+K search on meilisearch.com:
      // Tab switches section, Up/Down move through results, Enter opens the selected result
      if (modalOverlay.style.display === 'flex') {
        if (e.key === 'Tab') {
          e.preventDefault()
          cycleSection(e.shiftKey ? -1 : 1)
          return
        }

        const rows = Array.from(resultsContainer.querySelectorAll('.meilisearch-modal__result'))
        if (rows.length === 0) return

        const currentIndex = rows.findIndex(row => row.classList.contains('is-active'))

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          // No wrapping: Down stops on the last result, Up from the first result clears the selection
          const nextIndex = e.key === 'ArrowDown'
            ? Math.min(currentIndex + 1, rows.length - 1)
            : Math.max(currentIndex - 1, -1)
          setActiveResult(resultsContainer, rows[nextIndex] || null)
          rows[nextIndex]?.scrollIntoView({ block: 'nearest' })
        } else if (e.key === 'Enter' && currentIndex >= 0) {
          e.preventDefault()
          rows[currentIndex].click()
        }
      }
    }, true)

    // ========= Step 4: Set up Meilisearch for searching =========
    // Load Meilisearch client
    if (!window.meilisearch) {
      import("https://cdn.jsdelivr.net/npm/meilisearch/dist/index.min.js")
        .then((v) => {
          window.meilisearch = v.Meilisearch
          setupMeilisearchHandlers(searchInput, resultsContainer)
        })
        .catch(console.error)
    } else {
      setupMeilisearchHandlers(searchInput, resultsContainer)
    }

    // Make sure we call handleResponsiveVisibility immediately after creating the search bar
    handleResponsiveVisibility()

    // Add a debounced resize listener to prevent too many calls
    let resizeTimeout
    window.addEventListener('resize', () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      resizeTimeout = setTimeout(handleResponsiveVisibility, 100)
    })
  }

  // Set up the search functionality
  const setupMeilisearchHandlers = (searchInput, resultsContainer) => {
    try {
      const client = new window.meilisearch({
        host: MEILISEARCH_HOST,
        apiKey: MEILISEARCH_KEY
      })

      const index = client.index(MEILISEARCH_INDEX)

      // Function to get active filters
      const getActiveFilters = () => {
        const filterContainer = document.getElementById('meilisearch-filter-container')
        if (!filterContainer) return []
        const activeTags = filterContainer.querySelectorAll('.meilisearch-filter-tag.active')
        // The "All" tab has no section
        return Array.from(activeTags).map(tag => tag.dataset.section).filter(Boolean)
      }

      // Function to perform search with filters
      let latestRequestId = 0

      const performSearch = (query, activeFilters = []) => {
        const requestId = ++latestRequestId

        // Show loading indicator, replacing any stale status message
        resultsContainer.querySelectorAll('.meilisearch-modal__indicator, .meilisearch-modal__error').forEach(el => el.remove())
        const indicatorEl = document.createElement('div')
        indicatorEl.className = 'meilisearch-modal__indicator'
        indicatorEl.innerHTML = 'Searching…'
        resultsContainer.appendChild(indicatorEl)

        // Build base search options
        const baseSearchOptions = {
          attributesToHighlight: ['hierarchy_lvl1', 'hierarchy_lvl2', 'hierarchy_lvl3', 'hierarchy_lvl4', 'hierarchy_lvl5', 'content'],
          attributesToCrop: ['content'],
          cropLength: 100,
          highlightPreTag: HL_PRE,
          highlightPostTag: HL_POST,
          ...(isProductionDocsSite()
            ? { hybrid: { semanticRatio: 0.5, embedder: 'default' } }
            : {})
        }

        // Create federated multi-search queries
        const multiSearchQueries = [
          {
            indexUid: MEILISEARCH_INDEX,
            q: query,
            // Lower  weight for error code results
            filter: activeFilters.length > 0
              ? `(${activeFilters.map(section => `section = "${section}"`).join(' OR ')}) AND (hierarchy_lvl0 = "Errors" OR hierarchy_lvl1 = "Error codes")`
              : `hierarchy_lvl0 = "Errors" OR hierarchy_lvl1 = "Error codes"`,
            federationOptions: {
              weight: 0.7
            },
            ...baseSearchOptions
          },
          {
            indexUid: MEILISEARCH_INDEX,
            q: query,
            // Higher weight for non-error code results
            filter: activeFilters.length > 0
              ? `(${activeFilters.map(section => `section = "${section}"`).join(' OR ')}) AND NOT (hierarchy_lvl0 = "Errors" OR hierarchy_lvl1 = "Error codes")`
              : `NOT (hierarchy_lvl0 = "Errors" OR hierarchy_lvl1 = "Error codes")`,
            federationOptions: {
              weight: 1.0
            },
            ...baseSearchOptions
          }
        ]

        // Perform federated multi-search
        const multiSearchRequest = {
          federation: {
            limit: 25
          },
          queries: multiSearchQueries
        }

        client.multiSearch(multiSearchRequest)
          .then(response => {
            // Ignore responses to outdated queries
            if (requestId !== latestRequestId) return

            resultsContainer.innerHTML = ''

            // Handle federated multi-search response, hiding generated card anchors
            const allHits = (response.hits || []).filter(hit => !isGeneratedAnchor(hit))

            if (allHits.length === 0) {
              const noResultsEl = document.createElement('div')
              noResultsEl.className = 'meilisearch-modal__indicator'
              noResultsEl.innerHTML = 'No results found'
              resultsContainer.appendChild(noResultsEl)
              return
            }

            // Flat list in relevance order: page and anchor rows look different.
            // No result is selected until the user presses Down or hovers a row
            allHits.forEach(hit => {
              resultsContainer.appendChild(renderHit(hit))
            })
            resultsContainer.scrollTop = 0

          })
          .catch(error => {
            if (requestId !== latestRequestId) return
            console.error('Meilisearch error:', error)
            resultsContainer.innerHTML = ''
            const errorEl = document.createElement('div')
            errorEl.className = 'meilisearch-modal__error'
            errorEl.innerHTML = 'Search error. Please try again.'

            resultsContainer.appendChild(errorEl)
          })
      }

      // Add search event listener
      let debounceTimer
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer)

        const query = e.target.value.trim()
        const activeFilters = getActiveFilters()

        if (query.length < 2) {
          latestRequestId++
          resultsContainer.innerHTML = ''
          return
        }

        debounceTimer = setTimeout(() => {
          performSearch(query, activeFilters)
        }, 300)
      })
    } catch (error) {
      console.error('Error setting up Meilisearch handlers:', error)
    }
  }

  // Initialize the search bar
  initSearchBar()

  // Update the MutationObserver logic
  const observer = new MutationObserver(mutations => {
    if (observer.processing) return
    observer.processing = true

    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        const header = document.querySelector('header')
        if (mutation.target === header || header?.contains(mutation.target)) {
          if (window.innerWidth >= 1024) {
            // Check for both possible IDs
            const searchBar = document.getElementById('meilisearch-search-bar') ||
              document.getElementById('search-bar-entry')
            const searchBarContainer = document.getElementById('meilisearch-bar-container') ||
              document.getElementById('search-bar-entry')

            if (!searchBar && !searchBarContainer) { //searchbar missing in desktop view, reinitialize
              initSearchBar()
            }
          }
        }
      }
    })

    observer.processing = false
  })

  // Update observer configuration to be more specific
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  })
}

// Initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') { //document ready, initialize
  initializeMeilisearchIntegration()
} else { //waiting for DOMContentLoaded, initialize
  document.addEventListener('DOMContentLoaded', initializeMeilisearchIntegration)
}
