// ===== ClearSky — real city photo background =====
// Uses Wikipedia's free REST API (no key, CORS-enabled) to fetch a real
// photo of the searched place. Falls back to a curated set of Wikimedia
// Commons weather-mood photos if no specific city photo is found.
// Results are cached in localStorage so repeat visits don't re-fetch.
const CityPhoto = {
  memoryCache: {},
  CACHE_KEY: "clearsky:photoCache",
  CACHE_MAX_AGE_MS: 30 * 24 * 60 * 60 * 1000, // 30 days — photos rarely change
  FETCH_TIMEOUT_MS: 4500,

  // A small pool per condition so the same weather doesn't always show
  // the exact same fallback photo.
  FALLBACKS: {
    sun: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Clear_blue_sky.jpg/1280px-Clear_blue_sky.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Blue_Sky_with_sun.JPG/1280px-Blue_Sky_with_sun.JPG",
    ],
    "sun-cloud": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Cumulus_clouds_in_fair_weather.jpeg/1280px-Cumulus_clouds_in_fair_weather.jpeg",
    ],
    "cloud-sun": [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Cumulus_clouds_in_fair_weather.jpeg/1280px-Cumulus_clouds_in_fair_weather.jpeg",
    ],
    cloud: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Altocumulus_clouds_panorama.jpg/1280px-Altocumulus_clouds_panorama.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Cloudy_sky.jpg/1280px-Cloudy_sky.jpg",
    ],
    fog: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Morning_fog_in_a_forest.jpg/1280px-Morning_fog_in_a_forest.jpg",
    ],
    drizzle: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Raindrops_on_a_window.jpg/1280px-Raindrops_on_a_window.jpg",
    ],
    rain: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Raindrops_on_a_window.jpg/1280px-Raindrops_on_a_window.jpg",
    ],
    snow: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Snow-covered_trees.jpg/1280px-Snow-covered_trees.jpg",
    ],
    storm: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Lightning_over_Oradea_Romania_3.jpg/1280px-Lightning_over_Oradea_Romania_3.jpg",
    ],
  },

  pickFallback(weatherIcon) {
    const pool = this.FALLBACKS[weatherIcon] || this.FALLBACKS.cloud;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  _readCache() {
    try {
      return JSON.parse(localStorage.getItem(this.CACHE_KEY)) || {};
    } catch {
      return {};
    }
  },

  _writeCache(cache) {
    try { localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache)); } catch { /* quota/private mode — skip */ }
  },

  _getCached(cacheKey) {
    if (this.memoryCache[cacheKey]) return this.memoryCache[cacheKey];
    const persisted = this._readCache();
    const entry = persisted[cacheKey];
    if (entry && Date.now() - entry.ts < this.CACHE_MAX_AGE_MS) {
      this.memoryCache[cacheKey] = entry.url;
      return entry.url;
    }
    return null;
  },

  _setCached(cacheKey, url) {
    this.memoryCache[cacheKey] = url;
    const persisted = this._readCache();
    persisted[cacheKey] = { url, ts: Date.now() };
    this._writeCache(persisted);
  },

  async _fetchWithTimeout(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal });
      return res;
    } finally {
      clearTimeout(timer);
    }
  },

  async _fetchWikipediaImage(title) {
    try {
      const res = await this._fetchWithTimeout(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
      if (!res.ok) return null;
      const data = await res.json();
      // Skip disambiguation pages, redirects to unrelated topics, and pages with no real image.
      if (data.type === "disambiguation") return null;
      const url = (data.originalimage && data.originalimage.source) || (data.thumbnail && data.thumbnail.source) || null;
      if (!url) return null;
      // Wikipedia's default "no photo" placeholder / very small icons aren't useful as a backdrop.
      if (/Wiki_letter|Question_book|Ambox|Padlock|Commons-logo/i.test(url)) return null;
      return url;
    } catch {
      return null; // network error, timeout, or abort — treated as "not found"
    }
  },

  // Tries several title variants, most specific first, since Wikipedia
  // article titles for smaller towns are inconsistent (plain name vs
  // "Name, Country" vs "Name (city)" disambiguation suffix).
  async _resolvePhoto(place) {
    const attempts = [
      place.name,
      place.country ? `${place.name}, ${place.country}` : null,
      place.admin1 ? `${place.name}, ${place.admin1}` : null,
      `${place.name} (city)`,
    ].filter(Boolean);

    for (const title of attempts) {
      const url = await this._fetchWikipediaImage(title);
      if (url) return url;
    }
    return null;
  },

  async getForPlace(place, weatherIcon) {
    const cacheKey = place.id;
    const cached = this._getCached(cacheKey);
    if (cached) return cached;

    let url = await this._resolvePhoto(place);
    let isFallback = false;
    if (!url) {
      url = this.pickFallback(weatherIcon);
      isFallback = true;
    }

    // Only persist real city matches long-term; fallback photos are cheap to
    // re-roll next time so a future retry can still find the real photo.
    if (!isFallback) this._setCached(cacheKey, url);
    return url;
  },
};
