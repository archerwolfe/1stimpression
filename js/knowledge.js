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

    items.forEach(function (item) {
      var entity = item.result || {};
      var name = entity.name || 'Unnamed';
      var description = entity.description || '';
      var detailed = item.resultScore ? ('Score: ' + item.resultScore.toFixed(2)) : '';
      var imageUrl = entity.image && entity.image.contentUrl ? entity.image.contentUrl : null;
      var url = entity.detailedDescription && entity.detailedDescription.url ? entity.detailedDescription.url : (entity.url || null);

      var cardTop = document.createElement('div');
      cardTop.className = 'card-top';

      if (imageUrl) {
        var img = document.createElement('img');
        img.src = imageUrl;
        img.alt = name;
        img.className = 'card-img';
        cardTop.appendChild(img);
      }

      var bottom = document.createElement('div');
      bottom.className = 'card-bottom';

      var title = document.createElement('div');
      title.className = 'headings';
      title.textContent = name;
      bottom.appendChild(title);

      if (description) {
        var p = document.createElement('p');
        p.textContent = description;
        bottom.appendChild(p);
      }

      if (url) {
        var a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.className = 'button grey _2 w-button';
        a.textContent = 'Learn more';
        bottom.appendChild(a);
      }

      // Add Google Knowledge Graph search button if KGMID exists
      if (entity['@id']) {
        var kgButton = document.createElement('a');
        kgButton.href = 'https://www.google.com/search?kgmid=' + encodeURIComponent(entity['@id']);
        kgButton.target = '_blank';
        kgButton.className = 'button green-button w-button';
        kgButton.textContent = 'Google Search';
        kgButton.style.marginLeft = '8px';
        bottom.appendChild(kgButton);
      }

      if (detailed) {
        var small = document.createElement('div');
        small.className = 'text-block-4';
        small.textContent = detailed;
        bottom.appendChild(small);
      }

      cardTop.appendChild(bottom);
      resultsEl.appendChild(cardTop);
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
    form.addEventListener('submit', function () {
      var q = (queryInput.value || '').trim();
      if (q) {
        searchKG(q);
      }
    });
  }
})();


