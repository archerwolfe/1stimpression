(function () {
  var form = document.getElementById('kg-form');
  var queryInput = document.getElementById('kg-query');
  var resultsEl = document.getElementById('results');

  function renderResults(items) {
    resultsEl.innerHTML = '';

    if (!items || !items.length) {
      var empty = document.createElement('div');
      empty.className = 'headings';
      empty.textContent = 'No results found.';
      resultsEl.appendChild(empty);
      return;
    }

    // Create results header
    var resultsHeader = document.createElement('div');
    resultsHeader.style.marginBottom = '40px';
    resultsHeader.style.textAlign = 'center';
    
    // Main title
    var headerTitle = document.createElement('h1');
    headerTitle.className = 'headings';
    headerTitle.style.fontSize = '3.5rem';
    headerTitle.style.fontWeight = '700';
    headerTitle.style.color = '#303135';
    headerTitle.style.margin = '0 0 10px 0';
    headerTitle.style.lineHeight = '1.2';
    headerTitle.textContent = 'Knowledge Panel Results for';
    resultsHeader.appendChild(headerTitle);
    
    // Query name (smaller) - NO "Knowledge Panel Results for" here!
    var queryName = document.createElement('div');
    queryName.style.fontSize = '3rem';
    queryName.style.fontWeight = '400';
    queryName.style.color = '#303135';
    queryName.style.margin = '0';
    queryName.style.lineHeight = '1.2';
    queryName.textContent = '"' + (queryInput ? queryInput.value : '') + '"';
    resultsHeader.appendChild(queryName);
    
    resultsEl.appendChild(resultsHeader);

    // Sort items by confidence score (highest first)
    items.sort(function(a, b) {
      var scoreA = a.resultScore || 0;
      var scoreB = b.resultScore || 0;
      return scoreB - scoreA;
    });

    // Find the highest score for normalization
    var maxScore = 0;
    items.forEach(function(item) {
      var score = item.resultScore || 0;
      if (score > maxScore) {
        maxScore = score;
      }
    });

    // Create results grid container
    var resultsGrid = document.createElement('div');
    resultsGrid.className = 'results-grid';

    items.forEach(function (item) {
      var entity = item.result || {};
      var name = entity.name || 'Unnamed';
      var description = entity.description || '';
      var detailed = item.resultScore ? ('Score: ' + item.resultScore.toFixed(2)) : '';
      var imageUrl = entity.image && entity.image.contentUrl ? entity.image.contentUrl : null;
      var url = entity.detailedDescription && entity.detailedDescription.url ? entity.detailedDescription.url : null;
      var googleSearchUrl = entity.url || null;
      
      var types = Array.isArray(entity['@type']) ? entity['@type'] : (entity['@type'] ? [entity['@type']] : []);

      // Create result card
      var card = document.createElement('div');
      card.className = 'result-card';

      // Card header with image and title
      var cardHeader = document.createElement('div');
      cardHeader.className = 'result-card-header';

      if (imageUrl) {
        var img = document.createElement('img');
        img.src = imageUrl;
        img.alt = name;
        img.className = 'result-card-image';
        cardHeader.appendChild(img);
      }

      var titleSection = document.createElement('div');
      titleSection.style.flex = '1';
      
      var title = document.createElement('h3');
      title.className = 'result-card-title';
      title.textContent = name;
      titleSection.appendChild(title);

      if (types.length) {
        var badgesWrap = document.createElement('div');
        badgesWrap.className = 'result-card-badges';
        types.slice(0, 3).forEach(function(t){
          var badge = document.createElement('span');
          badge.textContent = t;
          badge.className = 'result-card-badge';
          badgesWrap.appendChild(badge);
        });
        titleSection.appendChild(badgesWrap);
      }

      cardHeader.appendChild(titleSection);
      card.appendChild(cardHeader);

      // Description
      if (description) {
        var desc = document.createElement('p');
        desc.className = 'result-card-description';
        desc.textContent = description;
        card.appendChild(desc);
      }

      // Knowledge Graph ID
      var kgId = document.createElement('div');
      kgId.className = 'result-card-kgid';
      kgId.textContent = 'Knowledge Graph ID: ' + (entity['@id'] || 'N/A');
      card.appendChild(kgId);

      // Action buttons
      var buttonContainer = document.createElement('div');
      buttonContainer.className = 'result-card-buttons';

      if (url) {
        var learnMoreBtn = document.createElement('a');
        learnMoreBtn.href = url;
        learnMoreBtn.target = '_blank';
        learnMoreBtn.className = 'button grey _2 w-button result-card-button';
        learnMoreBtn.textContent = 'Learn more';
        buttonContainer.appendChild(learnMoreBtn);
      }

      // Google Knowledge Panel button
      var kgmidRaw = entity['@id'] || null;
      var kgmid = kgmidRaw ? kgmidRaw.replace(/^kg:/, '') : null;
      var finalGoogleUrl = kgmid
        ? ('https://www.google.com/search?kgmid=' + encodeURIComponent(kgmid))
        : (googleSearchUrl || ('https://www.google.com/search?q=' + encodeURIComponent(name)));
      
      var kgButton = document.createElement('a');
      kgButton.href = finalGoogleUrl;
      kgButton.target = '_blank';
      kgButton.className = 'button green-button w-button result-card-button';
      kgButton.textContent = 'View Knowledge Panel on Google';
      buttonContainer.appendChild(kgButton);

      card.appendChild(buttonContainer);

      // Dynamic confidence score based on Google's resultScore
      var resultScore = item.resultScore || 0;
      var confidence = document.createElement('div');
      confidence.className = 'result-card-confidence';
      
      var confTitle = document.createElement('div');
      confTitle.className = 'confidence-title';
      confTitle.textContent = "Google's Confidence";
      
      // Calculate confidence percentage and category
      // Normalize the score relative to the highest score in the results
      var confidencePercentage;
      
      if (maxScore > 0) {
        // Normalize to 0-100 scale based on the highest score
        confidencePercentage = Math.round((resultScore / maxScore) * 100);
      } else {
        // Fallback if no scores available
        confidencePercentage = 50;
      }
      
      // Ensure percentage is within 0-100 range
      confidencePercentage = Math.max(0, Math.min(100, confidencePercentage));
      
      var confidenceCategory = '';
      var confidenceColor = '';
      var confidenceClass = '';
      
      if (confidencePercentage >= 80) {
        confidenceCategory = 'Very high confidence';
        confidenceColor = '#10b981'; // Green
        confidenceClass = 'confidence-very-high';
      } else if (confidencePercentage >= 60) {
        confidenceCategory = 'High confidence';
        confidenceColor = '#3b82f6'; // Blue
        confidenceClass = 'confidence-high';
      } else if (confidencePercentage >= 40) {
        confidenceCategory = 'Medium confidence';
        confidenceColor = '#f59e0b'; // Orange
        confidenceClass = 'confidence-medium';
      } else {
        confidenceCategory = 'Low confidence';
        confidenceColor = '#ef4444'; // Red
        confidenceClass = 'confidence-low';
      }
      
      // Apply confidence level class
      confidence.className += ' ' + confidenceClass;
      
      var confValue = document.createElement('div');
      confValue.className = 'confidence-value';
      confValue.textContent = confidencePercentage + '%';
      confValue.style.color = confidenceColor;
      
      var confSub = document.createElement('div');
      confSub.className = 'confidence-sub';
      confSub.textContent = confidenceCategory;
      confSub.style.color = confidenceColor;
      
      confidence.appendChild(confTitle);
      confidence.appendChild(confValue);
      confidence.appendChild(confSub);
      card.appendChild(confidence);

      resultsGrid.appendChild(card);
    });

    resultsEl.appendChild(resultsGrid);
  }

  function setLoading(isLoading) {
    if (isLoading) {
      resultsEl.innerHTML = '<div class="headings">Loading...</div>';
    }
  }

  function searchKG(query) {
    setLoading(true);
    // API key for Google Knowledge Graph Search API
    var apiKey = (window.KG_CONFIG && window.KG_CONFIG.API_KEY) || 'AIzaSyAbJMCWHgcFH2t3J6Tww-wqVpY_y1Q7U7E';
    if (!apiKey) {
      renderResults([]);
      var warn = document.createElement('div');
      warn.className = 'headings';
      warn.textContent = 'Missing API key. Create js/config.js with window.KG_CONFIG.API_KEY';
      resultsEl.appendChild(warn);
      return;
    }

    var params = new URLSearchParams({
      query: query,
      key: apiKey,
      limit: '10',
      indent: 'true',
      languages: 'en'
    });

    fetch('https://kgsearch.googleapis.com/v1/entities:search?' + params.toString())
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var results = data && data.itemListElement ? data.itemListElement : [];
        renderResults(results);
        
        // Log search data to Google Sheets
        logSearchData(query, results);
      })
      .catch(function () {
        renderResults([]);
        var err = document.createElement('div');
        err.className = 'headings';
        err.textContent = 'Error fetching results.';
        resultsEl.appendChild(err);
      });
  }

  // Generate or retrieve session ID
  function getSessionId() {
    var sessionId = sessionStorage.getItem('kg_session_id');
    if (!sessionId) {
      sessionId = 'kg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('kg_session_id', sessionId);
    }
    return sessionId;
  }

  // Log search data to Google Sheets
  function logSearchData(query, results) {
    try {
      // Get screen resolution
      var screenResolution = screen.width + 'x' + screen.height;
      
      // Get language
      var language = navigator.language || navigator.userLanguage || '';
      
      // Prepare search data
      var searchData = {
        query: query,
        userAgent: navigator.userAgent,
        ipAddress: '', // Will be detected by server
        referrer: document.referrer || '',
        resultsCount: results.length,
        topResultName: results.length > 0 && results[0].result ? results[0].result.name : '',
        topResultScore: results.length > 0 ? (results[0].resultScore || 0) : 0,
        sessionId: getSessionId(),
        timestamp: new Date().toISOString(),
        language: language,
        screenResolution: screenResolution,
        searchDuration: performance.now() // Time since page load
      };

      // Send data to Google Apps Script
      var webAppUrl = (window.KG_CONFIG && window.KG_CONFIG.TRACKING_URL) || 'https://script.google.com/macros/s/AKfycbzvpoh5VvKen77gHAtZvYonAQtHCs5Gu4ehyt7dgPZpZbndZsudOxDmh2O0dsDiKPs/exec';
      
      if (webAppUrl && webAppUrl !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        fetch(webAppUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchData)
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log('Search data logged successfully:', data);
        })
        .catch(function(error) {
          console.log('Error logging search data:', error);
        });
      } else {
        console.log('Google Apps Script URL not configured. Search data:', searchData);
      }
    } catch (error) {
      console.log('Error preparing search data:', error);
    }
  }

  // Update results section visibility
  function showResults() {
    var resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.style.display = 'block';
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Handle search functionality
  function handleSearch() {
    var q = (queryInput.value || '').trim();
    console.log('Searching for:', q); // Debug log
    if (q) {
      searchKG(q);
      showResults();
    }
  }

  // Add event listeners for buttons
  if (queryInput) {
    // Search on Enter key
    queryInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });

    // Search GKPs button
    var searchGkpsBtn = document.getElementById('search-gkps-btn');
    if (searchGkpsBtn) {
      searchGkpsBtn.addEventListener('click', handleSearch);
    }

    // Only "Search GKPs" is kept per design
  }
})();

