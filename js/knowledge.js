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

    var qHeader = document.getElementById('results-header');
    if (qHeader) { qHeader.style.display = 'block'; }
    var qSpan = document.getElementById('results-query');
    if (qSpan && queryInput && queryInput.value) { qSpan.textContent = '“' + queryInput.value + '”'; }

    items.forEach(function (item) {
      var entity = item.result || {};
      var name = entity.name || 'Unnamed';
      var description = entity.description || '';
      var detailed = item.resultScore ? ('Score: ' + item.resultScore.toFixed(2)) : '';
      var imageUrl = entity.image && entity.image.contentUrl ? entity.image.contentUrl : null;
      var url = entity.detailedDescription && entity.detailedDescription.url ? entity.detailedDescription.url : null;
      var googleSearchUrl = entity.url || null; // This is the Google search URL for the entity
      
      // Debug logging
      console.log('Entity URLs:', {
        detailedDescriptionUrl: entity.detailedDescription && entity.detailedDescription.url,
        entityUrl: entity.url,
        finalUrl: url,
        googleSearchUrl: googleSearchUrl
      });
      var types = Array.isArray(entity['@type']) ? entity['@type'] : (entity['@type'] ? [entity['@type']] : []);

      var card = document.createElement('div');
      card.style.border = '1px solid #e5e7eb';
      card.style.borderRadius = '12px';
      card.style.padding = '20px';
      card.style.background = '#fff';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'space-between';
      card.style.gap = '16px';

      if (imageUrl) {
        var img = document.createElement('img');
        img.src = imageUrl;
        img.alt = name;
        img.style.height = '120px';
        img.style.width = '120px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        card.appendChild(img);
      }

      var content = document.createElement('div');
      content.style.flex = '1';

      var title = document.createElement('div');
      title.className = 'headings';
      title.textContent = name;
      content.appendChild(title);

      if (types.length) {
        var badgesWrap = document.createElement('div');
        badgesWrap.style.display = 'flex';
        badgesWrap.style.gap = '8px';
        badgesWrap.style.flexWrap = 'wrap';
        types.slice(0,3).forEach(function(t){
          var b = document.createElement('span');
          b.textContent = t;
          b.style.background = '#e8f5e9';
          b.style.color = '#1b5e20';
          b.style.fontSize = '12px';
          b.style.padding = '4px 8px';
          b.style.borderRadius = '999px';
          badgesWrap.appendChild(b);
        });
        content.appendChild(badgesWrap);
      }

      if (description) {
        var p = document.createElement('p');
        p.textContent = description;
        content.appendChild(p);
      }

      var meta = document.createElement('div');
      meta.style.display = 'flex';
      meta.style.alignItems = 'center';
      meta.style.gap = '12px';
      meta.style.marginTop = '8px';

      var idText = document.createElement('div');
      idText.className = 'text-block-4';
      idText.textContent = 'Knowledge Graph ID: ' + (entity['@id'] || 'N/A');
      meta.appendChild(idText);
      content.appendChild(meta);

      if (url) {
        var a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.className = 'button grey _2 w-button';
        a.textContent = 'Learn more';
        a.style.marginTop = '12px';
        content.appendChild(a);
      }

      // Prefer KGMID deep-link if available, else use API's entity.url, else fallback to name query
      // KGMID from API can be in form "kg:/g/xxxx"; strip leading "kg:" so Google accepts it
      var kgmidRaw = entity['@id'] || null;
      var kgmid = kgmidRaw ? kgmidRaw.replace(/^kg:/, '') : null;
      var finalGoogleUrl = kgmid
        ? ('https://www.google.com/search?kgmid=' + encodeURIComponent(kgmid))
        : (googleSearchUrl || ('https://www.google.com/search?q=' + encodeURIComponent(name)));
      var kgButton = document.createElement('a');
      kgButton.href = finalGoogleUrl;
      kgButton.target = '_blank';
      kgButton.className = 'button green-button w-button';
      kgButton.textContent = 'View Knowledge Panel on Google';
      kgButton.style.marginLeft = '8px';
      kgButton.style.marginTop = '12px';
      content.appendChild(kgButton);

      if (detailed) {
        var small = document.createElement('div');
        small.className = 'text-block-4';
        small.textContent = detailed;
        small.style.marginTop = '8px';
        content.appendChild(small);
      }

      var confidence = document.createElement('div');
      confidence.style.minWidth = '200px';
      confidence.style.textAlign = 'center';
      confidence.style.border = '1px solid #e5e7eb';
      confidence.style.borderRadius = '8px';
      confidence.style.padding = '12px';
      var confTitle = document.createElement('div');
      confTitle.className = 'text-block-4';
      confTitle.textContent = "Google's confidence";
      var confVal = document.createElement('div');
      confVal.className = 'headings';
      confVal.textContent = '100%';
      var confSub = document.createElement('div');
      confSub.className = 'text-block-4';
      confSub.textContent = 'Very high confidence';
      confidence.appendChild(confTitle);
      confidence.appendChild(confVal);
      confidence.appendChild(confSub);

      card.appendChild(content);
      card.appendChild(confidence);
      resultsEl.appendChild(card);
    });
  }

  function setLoading(isLoading) {
    if (isLoading) {
      resultsEl.innerHTML = '<div class="headings">Loading...</div>';
    }
  }

  function searchKG(query) {
    setLoading(true);
    var apiKey = (window.KG_CONFIG && window.KG_CONFIG.API_KEY) || '';
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
        renderResults(data && data.itemListElement ? data.itemListElement : []);
      })
      .catch(function () {
        renderResults([]);
        var err = document.createElement('div');
        err.className = 'headings';
        err.textContent = 'Error fetching results.';
        resultsEl.appendChild(err);
      });
  }

  if (form && queryInput) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default form submission
      var q = (queryInput.value || '').trim();
      console.log('Searching for:', q); // Debug log
      if (q) {
        searchKG(q);
      }
    });
  }
})();


