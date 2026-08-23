// ===== ClearSky — persistence layer (localStorage) =====
const Store = {
  KEYS: {
    THEME: "clearsky:theme",
    RECENT: "clearsky:recent",
    SAVED: "clearsky:saved",
    LAST: "clearsky:last",
  },

  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable (private mode, quota) — fail silently */
    }
  },

  getTheme() { return this.get(this.KEYS.THEME, "dark"); },
  setTheme(t) { this.set(this.KEYS.THEME, t); },

  getRecent() { return this.get(this.KEYS.RECENT, []); },
  addRecent(place) {
    let list = this.getRecent().filter(p => p.id !== place.id);
    list.unshift(place);
    list = list.slice(0, CONFIG.MAX_RECENT);
    this.set(this.KEYS.RECENT, list);
  },

  getSaved() { return this.get(this.KEYS.SAVED, []); },
  isSaved(id) { return this.getSaved().some(p => p.id === id); },
  toggleSaved(place) {
    let list = this.getSaved();
    if (list.some(p => p.id === place.id)) {
      list = list.filter(p => p.id !== place.id);
    } else if (list.length < CONFIG.MAX_SAVED_CITIES) {
      list.push(place);
    }
    this.set(this.KEYS.SAVED, list);
    return list;
  },
  removeSaved(id) {
    const list = this.getSaved().filter(p => p.id !== id);
    this.set(this.KEYS.SAVED, list);
    return list;
  },

  getLastPlace() { return this.get(this.KEYS.LAST, null); },
  setLastPlace(place) { this.set(this.KEYS.LAST, place); },
};
