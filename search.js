const MEILISEARCH_HOST = 'https://edge.meilisearch.com/'
const MEILISEARCH_API_KEY = '776dc6a11c118bd1640c3a9ff9679f920bc384238534fc4861fcde0152e7fd68'; // Public search-only API key
const MEILISEARCH_INDEX = 'mintlify-production';

function initializeMeilisearchIntegration() {
  // Add a check at the start of the function to prevent multiple initializations
  if (document.getElementById('meilisearch-bar-container')) {
    return;
  }
  
  // Modify the responsive visibility handler
  const handleResponsiveVisibility = () => {
    // Check for both possible IDs
    const searchBarContainer = document.getElementById('meilisearch-bar-container');
    const originalSearchButton = document.getElementById('search-bar-entry');
    const originalMobileSearchButton = document.getElementById('search-bar-entry-mobile');
    
    if (!searchBarContainer) return;
    
    const isMobileView = window.innerWidth < 1024;
    
    if (isMobileView) {
      // Hide our search bar
      searchBarContainer.style.display = 'none';

      if (originalSearchButton) {
        originalSearchButton.style.display = 'none';
      }
      // Show Mintlify's search buttons
      if (originalMobileSearchButton) {
        originalMobileSearchButton.style.display = 'flex';
      }
    } else {
      // Show our search bar
      searchBarContainer.style.display = 'block';
      
      // Hide Mintlify's search buttons
      if (originalSearchButton) {
        originalSearchButton.style.display = 'none';
      }
      if (originalMobileSearchButton) {
        originalMobileSearchButton.style.display = 'none';
      }
    }
  };

  // ========= Step 1: Create and inject the visible search bar in the header =========
  const initSearchBar = () => {
    
    // When finding the original search button, also look for mobile version icon
    const originalSearchButton = document.getElementById('search-bar-entry');
    const originalMobileSearchButton = document.getElementById('search-bar-entry-mobile');
    
    // Find the header where we'll add our search input
    const header = document.querySelector('header');
    if (!header) { //header not found, cannot add search bar
      return;
    }
    
    // Log header properties to help with debugging
    // console.log('Header found, dimensions:', {
    //   width: header.offsetWidth,
    //   height: header.offsetHeight,
    //   position: window.getComputedStyle(header).position
    // });
    
    // Try to find a proper container within the header for the search
    let headerContainer = null;
    
    // Option 1: Look for navigation in the header
    const navElement = header.querySelector('nav');
    if (navElement) {
      headerContainer = navElement;
    } 
    // Option 2: Look for a flex container in the header
    else {
      const potentialContainers = Array.from(header.children).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display === 'flex' || style.display === 'inline-flex';
      });
      
      if (potentialContainers.length > 0) {
        // Use the widest container
        headerContainer = potentialContainers.reduce((prev, current) => {
          return (prev.offsetWidth > current.offsetWidth) ? prev : current;
        });
      } else {
        // Use the header itself as a last resort
        headerContainer = header;
      }
    }
    
    // If we found the original search button, use its positioning and parent
    if (originalSearchButton) {
      // Get the parent element of the search button
      const searchParent = originalSearchButton.parentElement;
      
      if (searchParent) {
        headerContainer = searchParent;
      }
    }
    
    // Create our search input container
    const searchBarContainer = document.createElement('div');
    searchBarContainer.id = 'meilisearch-bar-container';
    searchBarContainer.className = 'meilisearch-bar-container';
    
    // Create the search input that looks like Meilisearch's
    const searchBar = document.createElement('div');
    searchBar.id = 'meilisearch-search-bar';
    searchBar.className = 'meilisearch-search-bar';
    searchBar.role = 'button';
    searchBar.tabIndex = 0;
    
    // Add the search icon and placeholder text
    searchBar.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
      <span class="meilisearch-search-bar__text">Search…</span>
      <span class="meilisearch-search-bar__shortcut">⌘K</span>
    `;
    
    // Append the search bar to the container
    searchBarContainer.appendChild(searchBar);
    
    // Check if the header container is a flex container
    const containerStyle = window.getComputedStyle(headerContainer);
    const isFlexContainer = containerStyle.display === 'flex' || containerStyle.display === 'inline-flex';
    
    // If the header isn't a flex container, we need to make it one for proper centering
    if (!isFlexContainer) {
      // Create a wrapper to center the search bar
      const flexWrapper = document.createElement('div');
      flexWrapper.className = 'meilisearch-flexwrapper';
      flexWrapper.appendChild(searchBarContainer);
      headerContainer.appendChild(flexWrapper);
    } else {
      // Insert the search container into the flex container
      // Find the right position - ideally in the middle
      const childCount = headerContainer.children.length;
      
      if (childCount > 2) {
        // If there are more than 2 children, insert it in the middle
        const middleIndex = Math.floor(childCount / 2);
        const referenceNode = headerContainer.children[middleIndex];
        headerContainer.insertBefore(searchBarContainer, referenceNode);
      } else {
        // Otherwise just append it
        headerContainer.appendChild(searchBarContainer);
        
        // If this is a flex container, we need to adjust styles for centering
        searchBarContainer.style.flex = '1';
        searchBarContainer.style.margin = '0 auto';
      }
    }
    
    // ========= Step 2: Create the modal search overlay =========
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'meilisearch-modal-overlay';
    modalOverlay.className = 'meilisearch-modal-overlay';
    
    // Create the search modal container
    const searchModal = document.createElement('div');
    searchModal.id = 'meilisearch-modal';
    searchModal.className = 'meilisearch-modal';
    
    // Create the search input container
    const searchInputContainer = document.createElement('div');
    searchInputContainer.className = 'meilisearch-modal__input-container'
    
    // Create the search input
    const searchInput = document.createElement('input');
    searchInput.id = 'meilisearch-search-input';
    searchInput.className = 'meilisearch-modal__input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search…';
    
    // Create the ESC key indicator
    const escIndicator = document.createElement('span');
    escIndicator.textContent = 'ESC';
    escIndicator.className = 'meilisearch-modal__escape';
    
    // Create the search icon
    const searchIcon = document.createElement('div');
    searchIcon.className = 'meilisearch-modal__icon';
    searchIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
    `;
    
    // Add elements to the search input container
    searchInputContainer.appendChild(searchIcon);
    searchInputContainer.appendChild(searchInput);
    searchInputContainer.appendChild(escIndicator);
    
    // Create the results container
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'meilisearch-results';
    resultsContainer.className = 'meilisearch-modal__results';
    resultsContainer.style.cssText = `
    `;
    
    // Append everything to the modal
    searchModal.appendChild(searchInputContainer);
    searchModal.appendChild(resultsContainer);
    
    // Add the modal to the overlay
    modalOverlay.appendChild(searchModal);
    
    // Add the overlay to the body
    document.body.appendChild(modalOverlay);
    
    // ========= Step 3: Set up event listeners =========
    
    // Function to open the search modal
    const openSearchModal = () => {
      // Always place the modal at the top, regardless of scroll position
      modalOverlay.style.display = 'flex';
      
      // Focus the input
      setTimeout(() => {
        searchInput.focus();
      }, 10);
    };
    
    // Function to close the search modal
    const closeSearchModal = () => {
      modalOverlay.style.display = 'none';
      searchInput.value = '';
      resultsContainer.innerHTML = '';
    };

    // Function to handle clicks on Mintlify search buttons
    const handleMintlifySearchClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSearchModal();
    };
    
    // Open modal when clicking the search bar
    searchBar.addEventListener('click', openSearchModal);

    // Add click handlers to Mintlify search buttons
    if (originalSearchButton) {
      originalSearchButton.addEventListener('click', handleMintlifySearchClick);
    }
    if (originalMobileSearchButton) {
      originalMobileSearchButton.addEventListener('click', handleMintlifySearchClick);
    }

    // Add handlers for any search buttons that might be added later
    const searchButtonObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.id === 'search-bar-entry' || node.id === 'search-bar-entry-mobile') {
              node.addEventListener('click', handleMintlifySearchClick);
            }
          });
        }
      });
    });

    searchButtonObserver.observe(document.body, { childList: true, subtree: true });
    
    // Close modal when clicking outside the search modal
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeSearchModal();
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Open with Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openSearchModal();
        return false;
      }
      
      // Close with Escape
      if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeSearchModal();
        return false;
      }
    }, true);
    
    // ========= Step 4: Set up Meilisearch for searching =========
    // Load Meilisearch client
    if (!window.meilisearch) {
      const meilisearchScript = document.createElement('script');
      meilisearchScript.src = 'https://cdn.jsdelivr.net/npm/meilisearch@latest/dist/bundles/meilisearch.umd.js';
      meilisearchScript.onload = () => {
        // The UMD bundle exposes MeiliSearch directly, no need to access .default
        window.meilisearch = window.MeiliSearch;
        setupMeilisearchHandlers(searchInput, resultsContainer);
      };
      document.head.appendChild(meilisearchScript);
    } else {
      setupMeilisearchHandlers(searchInput, resultsContainer);
    }

    // Make sure we call handleResponsiveVisibility immediately after creating the search bar
    handleResponsiveVisibility();

    // Add a debounced resize listener to prevent too many calls
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(handleResponsiveVisibility, 100);
    });
  };
  
  // Set up the search functionality
  const setupMeilisearchHandlers = (searchInput, resultsContainer) => {
    try {
      const client = new window.meilisearch({
        host: MEILISEARCH_HOST,
        apiKey: MEILISEARCH_API_KEY
      });

      const index = client.index(MEILISEARCH_INDEX);
      
      // Add search event listener
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        
        const query = e.target.value.trim();
        
        if (query.length < 2) {
          resultsContainer.innerHTML = '';
          return;
        }
        
        debounceTimer = setTimeout(() => {
          // Show loading indicator
          const indicatorEl = document.createElement('div');
          indicatorEl.className = 'meilisearch-modal__indicator';
          indicatorEl.innerHTML = 'Searching…';
          resultsContainer.appendChild(indicatorEl);
          
          // Perform search
          index.search(query, {
            limit: 25,
            attributesToHighlight: ['hierarchy_lvl1', 'hierarchy_lvl2', 'hierarchy_lvl3', 'hierarchy_lvl4', 'hierarchy_lvl5', 'content'],
            attributesToCrop: ['content'],
            cropLength: 100,
            hybrid: {
              semanticRatio: 0.5,
              embedder: "default"
            }
          })
          .then(response => {
            resultsContainer.innerHTML = '';
            
            if (response.hits.length === 0) {
              const noResultsEl = document.createElement('div');
              noResultsEl.className = 'meilisearch-modal__indicator';
              noResultsEl.innerHTML = 'No results found';
              resultsContainer.appendChild(noResultsEl);

              return;
            }
            
            // Group results by category if available
            const grouped = {};
            response.hits.forEach(hit => {
              const category = hit.hierarchy_lvl0 || 'General';
              if (!grouped[category]) {
                grouped[category] = [];
              }
              grouped[category].push(hit);
            });
            
            // Create result items
            Object.keys(grouped).forEach(category => {
              const results = grouped[category];
              
              // Only add category header if there are multiple categories
              if (Object.keys(grouped).length > 1) {
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'meilisearch-modal__category-header';
                categoryHeader.textContent = category;
                resultsContainer.appendChild(categoryHeader);
              }
              
              results.forEach(hit => {
                const resultItem = document.createElement('a');
                resultItem.href = hit.url || `/${hit.path}`;
                resultItem.className = 'meilisearch-modal__result';
                
                // Format content nicely
                // Build title from hierarchy levels
                const hierarchy_lvl1 = hit._formatted?.hierarchy_lvl1 
                  ? hit._formatted.hierarchy_lvl1.replace(/<em>/g, '<em class="meilisearch-modal__category-em">')
                  : '';
                const hierarchy_lvl2 = hit._formatted?.hierarchy_lvl2 
                  ? hit._formatted.hierarchy_lvl2.replace(/<em>/g, '<em class="meilisearch-modal__category-em">')
                  : '';
                const hierarchy_lvl3 = hit._formatted?.hierarchy_lvl3 
                  ? hit._formatted.hierarchy_lvl3.replace(/<em>/g, '<em class="meilisearch-modal__category-em">')
                  : '';
                const hierarchy_lvl4 = hit._formatted?.hierarchy_lvl4 
                  ? hit._formatted.hierarchy_lvl4.replace(/<em>/g, '<em class="meilisearch-modal__category-em">')
                  : '';
                const hierarchy_lvl5 = hit._formatted?.hierarchy_lvl5 
                  ? hit._formatted.hierarchy_lvl5.replace(/<em>/g, '<em class="meilisearch-modal__category-em">')
                  : '';
                const content = hit._formatted?.content 
                  ? hit._formatted.content.replace(/<em>/g, '<em class="meilisearch-modal__category-em">')
                  : '';

                let title = '';
                if (hierarchy_lvl1) {
                  title = hierarchy_lvl1;
                  if (hierarchy_lvl2) {
                    title += ' > ' + hierarchy_lvl2;
                    if (hierarchy_lvl3) {
                      title += ' > ' + hierarchy_lvl3;
                      if (hierarchy_lvl4) {
                        title += ' > ' + hierarchy_lvl4;
                        if (hierarchy_lvl5) {
                          title += ' > ' + hierarchy_lvl5;
                        }
                      }
                    }
                  }
                }
                
                resultItem.innerHTML = `
                  <div class="meilisearch-modal__result-heading">${title}</div>
                  ${content ? `<div class="meilisearch-modal__result-content">${content}</div>` : ''}
                `;
                
                // Make clicking the result close the modal
                resultItem.addEventListener('click', () => {
                  document.getElementById('meilisearch-modal-overlay').style.display = 'none';
                });
                
                resultsContainer.appendChild(resultItem);
              });
            });
            
          })
          .catch(error => {
            console.error('Meilisearch error:', error);
            const errorEl = document.createElement('div');
            errorEl.className = 'meilisearch-modal__error';
            errorEl.innerHTML = 'Search error. Please try again.';

            resultsContainer.appendChild(errorEl);
          });
        }, 300);
      });
    } catch (error) {
      console.error('Error setting up Meilisearch handlers:', error);
    }
  };
  
  // Initialize the search bar
  initSearchBar();
  
  // Update the MutationObserver logic
  const observer = new MutationObserver(mutations => {
    if (observer.processing) return;
    observer.processing = true;

    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        const header = document.querySelector('header');
        if (mutation.target === header || header?.contains(mutation.target)) {
          if (window.innerWidth >= 1024) {
            // Check for both possible IDs
            const searchBar = document.getElementById('meilisearch-search-bar') || 
                            document.getElementById('search-bar-entry');
            const searchBarContainer = document.getElementById('meilisearch-bar-container') || 
                                     document.getElementById('search-bar-entry');
            
            if (!searchBar && !searchBarContainer) { //searchbar missing in desktop view, reinitialize
              initSearchBar();
            }
          }
        }
      }
    });

    observer.processing = false;
  });

  // Update observer configuration to be more specific
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
}

// Initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') { //document ready, initialize
  initializeMeilisearchIntegration();
} else { //waiting for DOMContentLoaded, initialize
  document.addEventListener('DOMContentLoaded', initializeMeilisearchIntegration);
}