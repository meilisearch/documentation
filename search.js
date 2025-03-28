//todo
// [x] inject search bar
// [x] create search + results modal
// [x] handle responsive case
// [] handle light/dark mode

const MEILISEARCH_HOST = 'https://edge.meilisearch.com/'
const MEILISEARCH_API_KEY = '776dc6a11c118bd1640c3a9ff9679f920bc384238534fc4861fcde0152e7fd68'; // Public search-only API key
const MEILISEARCH_INDEX = 'mintlify-staging';

function initializeMeilisearchIntegration() {
  // Add a check at the start of the function to prevent multiple initializations
  if (document.getElementById('meilisearch-bar-container')) {
    console.log('Search bar already exists, skipping initialization');
    return;
  }
  
  console.log('Meilisearch integration initializing');
  
  // Modify the responsive visibility handler
  const handleResponsiveVisibility = () => {
    // Check for both possible IDs
    const searchBarContainer = document.getElementById('meilisearch-bar-container');
    const originalSearchButton = document.getElementById('search-bar-entry');
    const originalMobileSearchButton = document.getElementById('search-bar-entry-mobile');
    
    if (!searchBarContainer) return;
    
    const isMobileView = window.innerWidth < 1024;
    
    if (isMobileView) {
      console.log('hide search bar container')
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
      console.log('display search bar container')
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
    console.log('Initializing search bar');
    
    // When finding the original search button, also look for mobile version icon
    const originalSearchButton = document.getElementById('search-bar-entry');
    const originalMobileSearchButton = document.getElementById('search-bar-entry-mobile');
    
    if (!originalSearchButton && !originalMobileSearchButton) {
      console.log('Neither desktop nor mobile search buttons found');
    } else {
      console.log('Found search button(s)');
    }
    
    // Find the header where we'll add our search input
    const header = document.querySelector('header');
    if (!header) {
      console.log('Header not found, cannot add search bar');
      return;
    }
    
    // Log header properties to help with debugging
    console.log('Header found, dimensions:', {
      width: header.offsetWidth,
      height: header.offsetHeight,
      position: window.getComputedStyle(header).position
    });
    
    // Try to find a proper container within the header for the search
    let headerContainer = null;
    
    // Option 1: Look for navigation in the header
    const navElement = header.querySelector('nav');
    if (navElement) {
      headerContainer = navElement;
      console.log('Found nav element in header');
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
        console.log('Found flex container in header');
      } else {
        // Use the header itself as a last resort
        headerContainer = header;
        console.log('Using header itself as container');
      }
    }
    
    // If we found the original search button, use its positioning and parent
    if (originalSearchButton) {
      // Get the parent element of the search button
      const searchParent = originalSearchButton.parentElement;
      
      if (searchParent) {
        headerContainer = searchParent;
        console.log('Using original search button parent as container');
      }
    }
    
    // Create our search input container
    const searchBarContainer = document.createElement('div');
    searchBarContainer.id = 'meilisearch-bar-container';
    searchBarContainer.style.cssText = `
      max-width: 480px;
      width: 100%;
      margin: 0 auto;
      padding: 0 10px;
    `;
    
    // Create the search input that looks like Meilisearch's
    const searchBar = document.createElement('div');
    searchBar.id = 'meilisearch-search-bar';
    searchBar.role = 'button';
    searchBar.tabIndex = 0;
    searchBar.style.cssText = `
      display: flex;
      align-items: center;
      background-color: rgba(25, 17, 53, 0.5);
      border-radius: 12px;
      padding: 8px 16px;
      color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      width: 100%;
      transition: all 0.2s ease;
      backdrop-filter: blur(8px);
      font-size: 14px;
    `;
    
    // Add the search icon and placeholder text
    searchBar.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
      <span style="flex-grow: 1;">Search or ask...</span>
      <span style="opacity: 0.7; font-size: 12px;">⌘K</span>
    `;
    
    // Append the search bar to the container
    searchBarContainer.appendChild(searchBar);
    
    // Check if the header container is a flex container
    const containerStyle = window.getComputedStyle(headerContainer);
    const isFlexContainer = containerStyle.display === 'flex' || containerStyle.display === 'inline-flex';
    
    // If the header isn't a flex container, we need to make it one for proper centering
    if (!isFlexContainer) {
      console.log('Container is not flex, creating flex wrapper');
      // Create a wrapper to center the search bar
      const flexWrapper = document.createElement('div');
      flexWrapper.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      `;
      flexWrapper.appendChild(searchBarContainer);
      headerContainer.appendChild(flexWrapper);
    } else {
      console.log('Container is already flex, adding directly');
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
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(8px);
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 9999;
      display: none;
      align-items: flex-start; /* Align to top */
      justify-content: center;
      padding-top: 0;
      box-sizing: border-box;
    `;
    
    // Create the search modal container
    const searchModal = document.createElement('div');
    searchModal.id = 'meilisearch-modal';
    searchModal.style.cssText = `
      width: 600px;
      max-width: 90%;
      max-height: 80vh; 
      margin-top: 70px; /* Fixed distance from top */
      border-radius: 12px;
      background-color: #1a1033;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
    `;
    
    // Create the search input container
    const searchInputContainer = document.createElement('div');
    searchInputContainer.style.cssText = `
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // Create the search input
    const searchInput = document.createElement('input');
    searchInput.id = 'meilisearch-search-input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.style.cssText = `
      background: transparent;
      border: none;
      color: white;
      font-size: 16px;
      outline: none;
      width: 100%;
      margin-right: 10px;
    `;
    
    // Create the ESC key indicator
    const escIndicator = document.createElement('span');
    escIndicator.textContent = 'ESC';
    escIndicator.style.cssText = `
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.1);
      margin-left: auto;
    `;
    
    // Create the search icon
    const searchIcon = document.createElement('div');
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
    resultsContainer.style.cssText = `
      flex-grow: 1;
      overflow-y: auto;
      padding: 0;
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
      console.log('Loading Meilisearch client');
      const meilisearchScript = document.createElement('script');
      meilisearchScript.src = 'https://cdn.jsdelivr.net/npm/meilisearch@latest/dist/bundles/meilisearch.umd.js';
      meilisearchScript.onload = () => {
        console.log('Meilisearch client loaded');
        // The UMD bundle exposes MeiliSearch directly, no need to access .default
        window.meilisearch = window.MeiliSearch;
        setupMeilisearchHandlers(searchInput, resultsContainer);
      };
      document.head.appendChild(meilisearchScript);
    } else {
      console.log('Meilisearch client already loaded');
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
      console.log('Setting up Meilisearch handlers');
      const client = new window.meilisearch({
        host: MEILISEARCH_HOST,
        apiKey: MEILISEARCH_API_KEY
      });
      
      console.log(client);

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
          console.log('Searching for:', query);
          // Show loading indicator
          resultsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: rgba(255, 255, 255, 0.7);">Searching...</div>';
          
          // Perform search
          index.search(query, {
            limit: 25,
            attributesToHighlight: ['title', 'content'],
            attributesToCrop: ['content'],
            cropLength: 100,
            hybrid: {
              semanticRatio: 0.5,
              embedder: "default"
            }
          })
          .then(response => {
            console.log('Search results:', response.hits.length);
            resultsContainer.innerHTML = '';
            
            if (response.hits.length === 0) {
              resultsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: rgba(255, 255, 255, 0.5);">No results found</div>';
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
                categoryHeader.style.cssText = `
                  padding: 12px 20px 8px;
                  font-size: 14px;
                  font-weight: 600;
                  color: rgba(255, 255, 255, 0.5);
                  text-transform: uppercase;
                `;
                categoryHeader.textContent = category;
                resultsContainer.appendChild(categoryHeader);
              }
              
              results.forEach(hit => {
                const resultItem = document.createElement('a');
                resultItem.href = hit.url || `/${hit.path}`;
                resultItem.style.cssText = `
                  display: block;
                  padding: 12px 20px;
                  text-decoration: none;
                  color: white;
                  border-left: 3px solid transparent;
                  transition: background-color 0.2s, border-color 0.2s;
                `;
                
                // Format content nicely
                // Build title from hierarchy levels
                let title = '';
                if (hit.hierarchy_lvl1) {
                  title = hit.hierarchy_lvl1;
                  if (hit.hierarchy_lvl2) {
                    title += ' > ' + hit.hierarchy_lvl2;
                    if (hit.hierarchy_lvl3) {
                      title += ' > ' + hit.hierarchy_lvl3;
                      if (hit.hierarchy_lvl4) {
                        title += ' > ' + hit.hierarchy_lvl4;
                        if (hit.hierarchy_lvl5) {
                          title += ' > ' + hit.hierarchy_lvl5;
                        }
                      }
                    }
                  }
                }

                const content = hit._formatted?.content 
                  ? hit._formatted.content.replace(/<em>/g, '<em style="font-style: normal; color: #f472b6; font-weight: bold;">')
                  : '';
                
                resultItem.innerHTML = `
                  <div style="font-weight: 500; margin-bottom: 4px;">${title}</div>
                  ${content ? `<div style="font-size: 13px; color: rgba(255, 255, 255, 0.6);">${content}</div>` : ''}
                `;
                
                resultItem.addEventListener('mouseover', () => {
                  resultItem.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  resultItem.style.borderLeftColor = '#f472b6';
                });
                
                resultItem.addEventListener('mouseout', () => {
                  resultItem.style.backgroundColor = 'transparent';
                  resultItem.style.borderLeftColor = 'transparent';
                });
                
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
            resultsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #f87171;">Search error. Please try again.</div>';
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
            
            if (!searchBar && !searchBarContainer) {
              console.log('Search bar missing in desktop view, reinitializing');
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
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log('Document ready, initializing');
  initializeMeilisearchIntegration();
} else {
  console.log('Waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', initializeMeilisearchIntegration);
}

console.log('Meilisearch search script loaded');