// Version 18 enhancements: consistent in-page navigation and Tanzania shopping checklist.
(function () {
  'use strict';

  const STORAGE_KEY = 'tanzania-companion-shopping-v18';
  const pageMenus = {
    'index.html': [['Dashboard', '#dashboard'], ['Weather', '#weather'], ['Trip checklist', '#tripcheck']],
    'trip.html': [['Trip overview', '#trip'], ['Flights', '#flights'], ['Itinerary', '#itinerary'], ['Tipping', '#tipping']],
    'shoot.html': [['Shoot Now', '#shootnow'], ['Photo banks', '#photo'], ['Video banks', '#video'], ['Field setup', '#setup']],
    'wildlife.html': [['Wildlife', '#wildlife'], ['Species', '#species'], ['Zanzibar', '#zanzibar'], ['Activities', '#activities']],
    'more.html': [['Shopping', '#shopping'], ['Protection', '#travelprotection'], ['Documents', '#documents'], ['To-dos', '#todos'], ['Contacts', '#contacts'], ['Library', '#library']]
  };

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function safeRead(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn('Could not read local data:', key, error);
      return fallback;
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Could not save local data:', key, error);
      return false;
    }
  }

  function installPageMenu() {
    if (document.querySelector('.page-subnav')) return;
    const items = (pageMenus[currentPage()] || []).filter(([, href]) => document.querySelector(href));
    if (!items.length) return;
    const nav = document.createElement('nav');
    nav.className = 'page-subnav';
    nav.setAttribute('aria-label', 'On this page');
    nav.innerHTML = items.map(([label, href]) => `<a href="${href}">${label}</a>`).join('');
    const topnav = document.querySelector('.topnav');
    (topnav || document.querySelector('header') || document.body).insertAdjacentElement('afterend', nav);
  }

  const shoppingHTML = `
  <section class="section searchable shopping-section" id="shopping">
    <div class="head">
      <div class="eyebrow">Arusha &amp; Zanzibar</div>
      <h2>🇹🇿 Tanzania Shopping Checklist</h2>
      <p class="muted"><b>Primary goal:</b> Buy quality over quantity. Look for museum-quality gemstones and authentic Tanzanian craftsmanship.</p>
    </div>

    <div class="shopping-rule"><b>Final buying rule:</b> If the color does not immediately impress me, I will not buy it. A single exceptional gemstone is far better than several average ones.</div>

    <details><summary>🥇 Priority 1 — AAA Tanzanite</summary><div class="body">
      <p><b>Target budget:</b> $2,500–5,000 &nbsp; <b>Target size:</b> 3–4 carats</p>
      <div class="shop-checks">
        <label><input type="checkbox" data-shopcheck="tanzanite-aaa"> AAA color</label>
        <label><input type="checkbox" data-shopcheck="tanzanite-blue"> Deep royal blue with violet flashes</label>
        <label><input type="checkbox" data-shopcheck="tanzanite-clean"> Eye-clean, with no visible inclusions</label>
        <label><input type="checkbox" data-shopcheck="tanzanite-cut"> Excellent cut</label>
        <label><input type="checkbox" data-shopcheck="tanzanite-natural"> Natural Tanzanite</label>
        <label><input type="checkbox" data-shopcheck="tanzanite-heat"> Heat treated, which is normal</label>
        <label><input type="checkbox" data-shopcheck="tanzanite-cert"> Laboratory certificate</label>
        <label><input type="checkbox" data-shopcheck="tanzanite-receipt"> Official receipt</label>
      </div>
      <p><b>Target price:</b> 3–4 ct AAA: $2,500–5,000. Typical savings versus the U.S.: 20–50%.</p>
    </div></details>

    <details><summary>🥈 Priority 2 — Vivid Red Spinel</summary><div class="body">
      <p><b>Target budget:</b> $4,000–8,000 &nbsp; <b>Target size:</b> 1–2 carats</p>
      <div class="shop-checks">
        <label><input type="checkbox" data-shopcheck="red-natural"> Natural</label>
        <label><input type="checkbox" data-shopcheck="red-untreated"> Prefer untreated</label>
        <label><input type="checkbox" data-shopcheck="red-color"> Vivid pure red</label>
        <label><input type="checkbox" data-shopcheck="red-clean"> Eye-clean</label>
        <label><input type="checkbox" data-shopcheck="red-brilliance"> Excellent brilliance</label>
        <label><input type="checkbox" data-shopcheck="red-certified"> Certified</label>
      </div>
      <p><b>Target price:</b> 1 ct AAA: $2,500–8,000+; 2 ct AAA: $5,000–15,000+. Rare—do not settle for average quality.</p>
    </div></details>

    <details><summary>🥉 Priority 3 — Mahenge Pink Spinel</summary><div class="body">
      <p><b>Target budget:</b> $2,000–4,000 &nbsp; <b>Target size:</b> 1.5–2.5 carats</p>
      <div class="shop-checks">
        <label><input type="checkbox" data-shopcheck="pink-neon"> Neon pink</label>
        <label><input type="checkbox" data-shopcheck="pink-sparkle"> Bright sparkle</label>
        <label><input type="checkbox" data-shopcheck="pink-clean"> Eye-clean</label>
        <label><input type="checkbox" data-shopcheck="pink-cut"> Excellent cut</label>
        <label><input type="checkbox" data-shopcheck="pink-certified"> Certified</label>
      </div>
      <p><b>Target price:</b> $1,500–6,000+ per carat. Typical savings versus the U.S.: 20–40%.</p>
    </div></details>

    <details><summary>⭐ Priority 4 — Tsavorite Garnet</summary><div class="body">
      <p><b>Target budget:</b> $1,000–2,500 &nbsp; <b>Target size:</b> 2–3 carats</p>
      <div class="shop-checks">
        <label><input type="checkbox" data-shopcheck="tsavorite-green"> Rich emerald-green</label>
        <label><input type="checkbox" data-shopcheck="tsavorite-no-tint"> No yellow or brown tint</label>
        <label><input type="checkbox" data-shopcheck="tsavorite-clean"> Eye-clean</label>
        <label><input type="checkbox" data-shopcheck="tsavorite-sparkle"> Bright sparkle</label>
        <label><input type="checkbox" data-shopcheck="tsavorite-certified"> Certified</label>
      </div>
      <p><b>Target price:</b> $500–2,000 per carat. Typical savings versus the U.S.: 20–40%.</p>
    </div></details>

    <details><summary>⭐ Priority 5 — Tanzanian Sapphire</summary><div class="body">
      <p><b>Target budget:</b> $1,000–3,000 &nbsp; <b>Target size:</b> 1.5–3 carats</p>
      <div class="shop-checks">
        <label><input type="checkbox" data-shopcheck="sapphire-color"> Cornflower blue or rich royal blue</label>
        <label><input type="checkbox" data-shopcheck="sapphire-clean"> Eye-clean</label>
        <label><input type="checkbox" data-shopcheck="sapphire-cut"> Excellent cut</label>
        <label><input type="checkbox" data-shopcheck="sapphire-certified"> Certified</label>
      </div>
      <p><b>Target price:</b> $800–3,000 per carat.</p>
    </div></details>

    <details><summary>⭐ Priority 6 — Blue Spinel</summary><div class="body">
      <p><b>Target budget:</b> $800–2,500 &nbsp; <b>Target size:</b> 2–3 carats</p>
      <div class="shop-checks">
        <label><input type="checkbox" data-shopcheck="blue-pure"> Pure blue</label>
        <label><input type="checkbox" data-shopcheck="blue-sparkle"> Bright sparkle</label>
        <label><input type="checkbox" data-shopcheck="blue-even"> Even color</label>
        <label><input type="checkbox" data-shopcheck="blue-clean"> Eye-clean</label>
        <label><input type="checkbox" data-shopcheck="blue-certified"> Certified</label>
      </div>
      <p><b>Target price:</b> $700–3,000 per carat.</p>
    </div></details>

    <details><summary>🛍️ Authentic Tanzanian Souvenirs</summary><div class="body">
      <h3>Arusha</h3>
      <div class="shop-checks">
        <label><input type="checkbox" data-shopcheck="makonde"> Makonde ebony wood carving ($100–500)</label>
        <label><input type="checkbox" data-shopcheck="tingatinga"> Tinga Tinga painting ($50–300)</label>
        <label><input type="checkbox" data-shopcheck="maasai"> Maasai handmade bead jewelry ($20–100)</label>
      </div>
      <h3>Zanzibar / Stone Town</h3>
      <div class="shop-checks">
        <label><input type="checkbox" data-shopcheck="spices"> Premium spice gift set ($20–60): cinnamon, cardamom, vanilla, cloves, black pepper and nutmeg</label>
        <label><input type="checkbox" data-shopcheck="wood-box"> Hand-carved wooden box ($30–150)</label>
        <label><input type="checkbox" data-shopcheck="fabric"> Kikoy or Kanga fabric ($15–60)</label>
        <label><input type="checkbox" data-shopcheck="leather"> Handmade leather goods—inspect quality carefully</label>
      </div>
    </div></details>

    <details><summary>❌ Do Not Buy</summary><div class="body"><div class="shop-checks danger-list">
      <label><input type="checkbox" data-shopcheck="avoid-ivory"> Ivory</label>
      <label><input type="checkbox" data-shopcheck="avoid-turtle"> Sea turtle shell</label>
      <label><input type="checkbox" data-shopcheck="avoid-coral"> Coral</label>
      <label><input type="checkbox" data-shopcheck="avoid-uncertified"> Uncertified gemstones</label>
      <label><input type="checkbox" data-shopcheck="avoid-street"> Stones from street vendors</label>
      <label><input type="checkbox" data-shopcheck="avoid-pressure"> “Today only” deals</label>
    </div></div></details>

    <details><summary>Questions to Ask Every Jeweler</summary><div class="body"><ol>
      <li>Is this natural?</li><li>Where was it mined?</li><li>Is it untreated or heat treated?</li><li>Is it eye-clean?</li><li>Can I view it in daylight?</li><li>Can I inspect it with a 10× loupe?</li><li>Is there a laboratory certificate?</li><li>Do you provide an official receipt?</li><li>What is your return policy?</li>
    </ol></div></details>

    <details><summary>Negotiation Script</summary><div class="body">
      <p>“We are comparing a few reputable jewelers before making our decision.”</p>
      <p>“If we purchase today, what is your best price?”</p>
      <p>“Is there a discount for cash or if we buy multiple items?”</p>
      <p><b>Expected negotiation range:</b> approximately 5–15% on quality certified gemstones.</p>
    </div></details>

    <details><summary>Best Countries to Buy</summary><div class="body country-grid">
      <div><h3>Tanzania 🇹🇿 ★★★★★</h3><p>Tanzanite, vivid red and Mahenge pink spinel, tsavorite, blue spinel, Tanzanian sapphire, Makonde carvings, Tinga Tinga paintings, Maasai beadwork and Zanzibar spices.</p></div>
      <div><h3>India 🇮🇳 ★★★★★</h3><p>Diamonds, rubies, fine gold jewelry, custom jewelry and many sapphires.</p></div>
      <div><h3>USA 🇺🇸 ★★★★★</h3><p>Independent appraisals, high-end designer jewelry, consumer protections, insurance and after-sales support.</p></div>
    </div></details>

    <details><summary>Planned Budget — $15,000</summary><div class="body"><div class="budget-table">
      <div><b>AAA Tanzanite</b><span>$5,000</span></div>
      <div><b>Vivid Red Spinel</b><span>$4,000</span></div>
      <div><b>Mahenge Pink Spinel</b><span>$2,500</span></div>
      <div><b>Tsavorite Garnet</b><span>$2,000</span></div>
      <div><b>Tanzanian Sapphire or Blue Spinel</b><span>$1,500</span></div>
    </div></div></details>
  </section>`;

  function installShopping() {
    if (currentPage() !== 'more.html' || document.getElementById('shopping')) return;
    const main = document.querySelector('main');
    if (!main) return;
    main.insertAdjacentHTML('afterbegin', shoppingHTML);
    const saved = safeRead(STORAGE_KEY, {});
    document.querySelectorAll('[data-shopcheck]').forEach((checkbox) => {
      checkbox.checked = Boolean(saved[checkbox.dataset.shopcheck]);
      checkbox.addEventListener('change', () => {
        saved[checkbox.dataset.shopcheck] = checkbox.checked;
        safeWrite(STORAGE_KEY, saved);
      });
    });
  }

  installShopping();
})();
