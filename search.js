const MEILISEARCH_HOST = 'https://ms-909f535664f8-173.lon.meilisearch.io'
const MEILISEARCH_KEY = '776dc6a11c118bd1640c3a9ff9679f920bc384238534fc4861fcde0152e7fd68' // Public search-only API key

// Production docs (meilisearch.com/docs) use the production index and hybrid search.
// Mintlify PR previews (*.mintlify.site), local dev, and other hosts use staging (no embedders).
const isProductionDocsSite = () => {
  const { hostname } = window.location
  return hostname === 'www.meilisearch.com' || hostname === 'meilisearch.com'
}
const MEILISEARCH_INDEX = isProductionDocsSite() ? 'mintlify-production' : 'mintlify-staging'
const HYBRID_OPTIONS = isProductionDocsSite()
  ? { hybrid: { semanticRatio: 0.5, embedder: 'default' } }
  : {}

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
const isAnchorHit = hit => Boolean(hit.anchor) || Boolean(hit.hierarchy_lvl2)

// Docs sections, in navigation order. These are the only values of the `section` field:
// scripts/search/post-scrape-edit.sh sets it from the URL and must list the same sections.
const SECTION_LABELS = {
  getting_started: 'Getting started',
  capabilities: 'Capabilities',
  reference: 'Reference',
  resources: 'Resources',
  changelog: 'Changelog'
}
const SECTION_ORDER = Object.keys(SECTION_LABELS)

// Sections that have hits, from the `section` facet distribution of a response
const sectionsIn = distribution =>
  new Set(SECTION_ORDER.filter(key => distribution?.section?.[key] > 0))

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
  // The modal and the document listeners are created once per visit
  if (document.getElementById('meilisearch-modal-overlay')) {
    return
  }

  // No section is selected until the user clicks a facet. Facets stay hidden
  // until a search returns sections that have hits.
  let selectedSection = null
  let renderSectionFacets = () => {}
  let clearSectionFacets = () => {}
  let cancelSearch = () => {}
  let openSearchModal = () => {}

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
  // Mintlify can replace the whole header during client-side navigation, which removes
  // the bar. This runs again after each navigation and does nothing while the bar is in place.
  const mountSearchBar = () => {
    if (document.getElementById('meilisearch-bar-container')) {
      handleResponsiveVisibility()
      return
    }

    const originalSearchButton = document.getElementById('search-bar-entry')

    // Find the header where we'll add our search input
    const header = document.getElementById('navbar') || document.querySelector('header')
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

    searchBar.addEventListener('click', () => openSearchModal())
    handleResponsiveVisibility()
  }

  const setupSearchModal = () => {
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

    // Create the faceted filter container. Hidden until a search has sections to offer.
    const filterContainer = document.createElement('div')
    filterContainer.id = 'meilisearch-filter-container'
    filterContainer.className = 'meilisearch-filter-container'
    filterContainer.hidden = true

    // Create filter title
    const filterTitle = document.createElement('div')
    filterTitle.className = 'meilisearch-filter-title'
    filterTitle.textContent = 'Narrow down by section'

    // Create filter tags container
    const filterTagsContainer = document.createElement('div')
    filterTagsContainer.className = 'meilisearch-filter-tags'
    filterTagsContainer.setAttribute('role', 'group')
    filterTagsContainer.setAttribute('aria-label', 'Section')

    // One chip per docs section that has hits for the current query, in navigation order
    let filterTags = []

    const syncFacetSelection = () => {
      filterTags.forEach(tag => {
        const on = tag.dataset.section === selectedSection
        tag.classList.toggle('active', on)
        tag.setAttribute('aria-pressed', String(on))
      })
    }

    // Select a section and rerun the search. Clicking the active facet clears it.
    const applySection = (sectionKey, { toggle = false } = {}) => {
      const next = toggle && selectedSection === sectionKey ? null : sectionKey
      if (next === selectedSection) return
      selectedSection = next
      syncFacetSelection()

      if (searchInput.value.trim().length >= 2) {
        searchInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }

    // Tab and Shift+Tab move between "no section" and the facets that are shown.
    // Position 0 clears the filter so keyboard users can return to every result.
    const cycleSection = (step) => {
      if (filterTags.length === 0) return
      const total = filterTags.length + 1
      const current = filterTags.findIndex(tag => tag.dataset.section === selectedSection) + 1
      const next = (current + step + total) % total
      applySection(next === 0 ? null : filterTags[next - 1].dataset.section)
    }

    clearSectionFacets = () => {
      selectedSection = null
      filterTags = []
      filterTagsContainer.replaceChildren()
      filterContainer.hidden = true
    }

    renderSectionFacets = (sections) => {
      filterTags = []
      filterTagsContainer.replaceChildren()

      if (sections.size === 0) {
        filterContainer.hidden = true
        return
      }

      SECTION_ORDER.filter(section => sections.has(section)).forEach(section => {
        const tag = document.createElement('button')
        tag.type = 'button'
        tag.className = 'meilisearch-filter-tag'
        tag.textContent = SECTION_LABELS[section]
        tag.dataset.section = section
        tag.tabIndex = -1
        tag.addEventListener('click', () => {
          applySection(section, { toggle: true })
          searchInput.focus()
        })
        filterTagsContainer.appendChild(tag)
        filterTags.push(tag)
      })
      syncFacetSelection()
      filterContainer.hidden = false
    }

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
    openSearchModal = () => {
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
      cancelSearch()
      clearSectionFacets()
    }

    // Open our modal instead of Mintlify's from its search buttons. A capture listener on the
    // document keeps working when Mintlify renders new buttons, and runs before React's handlers.
    document.addEventListener('click', (e) => {
      if (e.target instanceof Element && e.target.closest('#search-bar-entry, #search-bar-entry-mobile')) {
        e.preventDefault()
        e.stopPropagation()
        openSearchModal()
      }
    }, true)

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

      // The active facet, if the user has picked one. Nothing is selected by default.
      const getActiveFilters = () => selectedSection ? [selectedSection] : []

      // Function to perform search with filters
      let latestRequestId = 0
      let debounceTimer
      cancelSearch = () => {
        clearTimeout(debounceTimer)
        latestRequestId++
      }

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
          ...HYBRID_OPTIONS
        }

        const sectionFilter = activeFilters.length > 0
          ? `(${activeFilters.map(section => `section = "${section}"`).join(' OR ')})`
          : null
        const withSection = condition => sectionFilter ? `${sectionFilter} AND ${condition}` : condition

        // Create federated multi-search queries. `is_error` is set by scripts/search/post-scrape-edit.sh.
        // Documents without the field are not errors, so they stay in the main results.
        const multiSearchQueries = [
          {
            indexUid: MEILISEARCH_INDEX,
            q: query,
            // Lower weight for error code results
            filter: withSection('is_error = 1'),
            federationOptions: {
              weight: 0.7
            },
            ...baseSearchOptions
          },
          {
            indexUid: MEILISEARCH_INDEX,
            q: query,
            // Higher weight for non-error code results
            filter: withSection('NOT is_error = 1'),
            federationOptions: {
              weight: 1.0
            },
            ...baseSearchOptions
          }
        ]

        // Perform federated multi-search. The response also lists the sections of
        // every matching document, not only of the hits returned.
        const multiSearchRequest = {
          federation: {
            limit: 25,
            facetsByIndex: { [MEILISEARCH_INDEX]: ['section'] }
          },
          queries: multiSearchQueries
        }

        // With a section selected, the facets above only list that section.
        // Count the sections again without the filter so the other chips stay available.
        // `limit: 1`, not 0, so sections are counted like in the federated response above.
        // A search with `limit: 0` counts a larger set of candidates.
        const unfilteredFacetsRequest = sectionFilter
          ? index.search(query, { facets: ['section'], limit: 1, ...HYBRID_OPTIONS })
          : null

        Promise.all([client.multiSearch(multiSearchRequest), unfilteredFacetsRequest])
          .then(([response, unfilteredFacets]) => {
            // Ignore responses to outdated queries
            if (requestId !== latestRequestId) return

            const allHits = response.hits || []
            const sections = sectionsIn(unfilteredFacets
              ? unfilteredFacets.facetDistribution
              : response.facetsByIndex?.[MEILISEARCH_INDEX]?.distribution)

            // The selected section no longer matches this query. Search again without it.
            if (selectedSection && !sections.has(selectedSection)) {
              selectedSection = null
              performSearch(query, [])
              return
            }

            renderSectionFacets(sections)
            resultsContainer.innerHTML = ''

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
            clearSectionFacets()
            resultsContainer.innerHTML = ''
            const errorEl = document.createElement('div')
            errorEl.className = 'meilisearch-modal__error'
            errorEl.innerHTML = 'Search error. Please try again.'

            resultsContainer.appendChild(errorEl)
          })
      }

      // Add search event listener
      searchInput.addEventListener('input', (e) => {
        // Drop any in-flight search before waiting to start the next one.
        cancelSearch()

        const query = e.target.value.trim()
        const activeFilters = getActiveFilters()

        if (query.length < 2) {
          resultsContainer.innerHTML = ''
          clearSectionFacets()
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

  setupSearchModal()
  mountSearchBar()

  let mountScheduled = false
  const scheduleMount = () => {
    if (mountScheduled) return
    mountScheduled = true
    requestAnimationFrame(() => {
      mountScheduled = false
      mountSearchBar()
    })
  }

  // `mintlify:navigate` fires a few milliseconds before Mintlify inserts the new header,
  // so mount on the next frame and check again once the page has settled.
  window.addEventListener('mintlify:navigate', () => {
    scheduleMount()
    setTimeout(mountSearchBar, 250)
  })

  // Backup for headers that render later, and for clients without `mintlify:navigate`
  // such as the local preview. Each callback does two ID lookups at most.
  new MutationObserver(() => {
    if (!document.getElementById('meilisearch-bar-container') &&
      (document.getElementById('navbar') || document.querySelector('header'))) {
      scheduleMount()
    }
  }).observe(document.body, { childList: true, subtree: true })
}

// Initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') { //document ready, initialize
  initializeMeilisearchIntegration()
} else { //waiting for DOMContentLoaded, initialize
  document.addEventListener('DOMContentLoaded', initializeMeilisearchIntegration)
}
