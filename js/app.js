// ===== ClearSky — application entry point =====
const App = {
  state: {
    place: null,
    forecast: null,
    aqi: null,
    theme: Store.getTheme(),
    windUnit: Store.get("clearsky:windUnit", "kmh"),
  },

  init() {
    UI.cacheEls();
    UI.applyTheme(this.state.theme);

    this.wireEvents();
    this.wireOfflineDetection();
    this.registerServiceWorker();

    UI.renderQuickChips(POPULAR_CAPITALS, async (name) => {
      try {
        const results = await Api.searchCities(name);
        if (results[0]) this.loadPlace(results[0]);
      } catch { /* ignore */ }
    });

    // Always detect the visitor's actual current location on open —
    // we deliberately do NOT restore the last-viewed city here.
    // (Saved/favorite cities are unaffected and still work via the Saved Cities section.)
    if (navigator.geolocation) {
      UI.showLoading();
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const place = await Api.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          this.loadPlace(place);
        },
        () => {
          // Permission denied or unavailable — fall back to the last place viewed, if any.
          const last = Store.getLastPlace();
          this.loadPlace(last || { id: "48.8566,2.3522", name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 });
        },
        { timeout: 8000 }
      );
    } else {
      const last = Store.getLastPlace();
      this.loadPlace(last || { id: "48.8566,2.3522", name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 });
    }
  },

  wireEvents() {
    const input = document.getElementById("searchInput");
    const form = document.getElementById("searchForm");
    let debounceTimer = null;

    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      const q = input.value;
      debounceTimer = setTimeout(async () => {
        if (q.trim().length < 2) { UI.hideSuggestions(); return; }
        try {
          const countryMatch = CountryCapitals.lookup(q);
          let results = [];

          if (countryMatch) {
            const capitalResults = await Api.searchCities(countryMatch.capital);
            const best = capitalResults.find(r => (r.country || "").toLowerCase() === countryMatch.country.toLowerCase())
              || capitalResults[0];
            if (best) results.push({ ...best, isCapital: true });
          }

          const cityResults = await Api.searchCities(q);
          cityResults.forEach(r => {
            if (!results.some(existing => existing.id === r.id)) results.push(r);
          });

          UI.renderSuggestions(results, (place) => {
            input.value = "";
            UI.hideSuggestions();
            this.loadPlace(place);
          });
        } catch { UI.hideSuggestions(); }
      }, 350);
    });

    document.addEventListener("click", (e) => {
      if (!form.contains(e.target)) UI.hideSuggestions();
    });

    form.addEventListener("submit", (e) => e.preventDefault());

    document.getElementById("locateBtn").addEventListener("click", () => this.useMyLocation());

    const voiceBtn = document.getElementById("voiceBtn");
    if (Voice.supported) {
      Voice.init(
        (transcript) => {
          input.value = transcript;
          input.dispatchEvent(new Event("input"));
          voiceBtn.classList.remove("is-active");
        },
        () => voiceBtn.classList.remove("is-active")
      );
      voiceBtn.addEventListener("click", () => {
        voiceBtn.classList.add("is-active");
        Voice.start();
      });
    } else {
      voiceBtn.title = "Voice search not supported in this browser";
      voiceBtn.disabled = true;
    }

    document.getElementById("themeToggle").addEventListener("click", () => {
      this.state.theme = this.state.theme === "dark" ? "light" : "dark";
      Store.setTheme(this.state.theme);
      UI.applyTheme(this.state.theme);
    });

    document.getElementById("windUnitToggle").addEventListener("click", () => {
      this.state.windUnit = this.state.windUnit === "mph" ? "kmh" : "mph";
      Store.set("clearsky:windUnit", this.state.windUnit);
      if (this.state.forecast) UI.renderCurrent(this.state.place, this.state.forecast, this.state.aqi, this.state.windUnit);
    });

    document.getElementById("favBtn").addEventListener("click", () => {
      if (!this.state.place) return;
      Store.toggleSaved(this.state.place);
      UI.els.favBtn.textContent = Store.isSaved(this.state.place.id) ? "★ Saved" : "☆ Save city";
      UI.els.favBtn.classList.toggle("is-active", Store.isSaved(this.state.place.id));
      this.renderSaved();
    });

    document.getElementById("shareBtn").addEventListener("click", () => this.shareReading());
    document.getElementById("downloadBtn").addEventListener("click", () => {
      if (this.state.place && this.state.forecast) {
        UI.downloadCard(this.state.place, this.state.forecast, this.state.windUnit);
      }
    });
    document.getElementById("printBtn").addEventListener("click", () => {
      const panel = document.querySelector(".panel--current");
      if (panel) panel.setAttribute("data-print-date", new Date().toLocaleString());
      window.print();
    });

    document.getElementById("suggestBtn").addEventListener("click", () => {
      const p = document.getElementById("suggestText");
      p.textContent = p.dataset.text || "";
      p.hidden = !p.hidden;
    });

    document.getElementById("errorRetry").addEventListener("click", () => {
      if (this.state.place) this.loadPlace(this.state.place);
    });

    document.getElementById("toastClose").addEventListener("click", () => UI.hideToast());

    // Keyboard shortcuts: / focus search, L locate, Esc close suggestions.
    document.addEventListener("keydown", (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      const isTyping = tag === "input" || tag === "textarea";
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        input.focus();
      } else if ((e.key === "l" || e.key === "L") && !isTyping) {
        this.useMyLocation();
      } else if (e.key === "Escape") {
        UI.hideSuggestions();
        input.blur();
      }
    });
  },

  useMyLocation() {
    if (!navigator.geolocation) return;
    UI.showLoading();
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const place = await Api.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        this.loadPlace(place);
      },
      () => UI.showError("Couldn't access your location. Check browser permissions and try again.")
    );
  },

  wireOfflineDetection() {
    UI.setOffline(!navigator.onLine);
    window.addEventListener("offline", () => UI.setOffline(true));
    window.addEventListener("online", () => {
      UI.setOffline(false);
      if (this.state.place) this.loadPlace(this.state.place);
    });
  },

  async loadPlace(place) {
    const hasExistingData = !!(this.state.forecast && this.state.place);
    if (!hasExistingData) UI.showLoading();

    try {
      const [forecast, aqi] = await Promise.all([
        Api.getForecast(place.latitude, place.longitude),
        Api.getAirQuality(place.latitude, place.longitude),
      ]);
      this.state.place = place;
      this.state.forecast = forecast;
      this.state.aqi = aqi;

      Store.setLastPlace(place);
      Store.addRecent(place);

      this.renderAll();
      UI.showContent();
    } catch (err) {
      console.error(err);
      if (hasExistingData) {
        // Keep the last good reading visible; surface a non-blocking toast instead
        // of wiping the screen with a full error state.
        UI.showToast("Couldn't refresh weather data — showing the last saved reading.");
      } else {
        UI.showError("Couldn't load weather data. Check your connection and try again.");
      }
    }
  },

  renderAll() {
    if (!this.state.forecast) return;
    UI.renderCurrent(this.state.place, this.state.forecast, this.state.aqi, this.state.windUnit);
    UI.renderBestDay(this.state.forecast.daily);
    UI.renderHourly(this.state.forecast.hourly);
    UI.renderForecast(this.state.forecast.daily);
    Charts.render(this.state.forecast.daily);
    Charts.renderHourly(this.state.forecast.hourly);
    MapView.render(this.state.place.latitude, this.state.place.longitude, this.state.place.name);
    this.renderSaved();

    // Fetch and fade in a real photo of this place — non-blocking.
    const icon = weatherInfo(this.state.forecast.current.weather_code).icon;
    CityPhoto.getForPlace(this.state.place, icon).then(url => UI.setBackgroundPhoto(url));
  },

  async renderSaved() {
    const saved = Store.getSaved();
    const weatherByCityId = {};
    await Promise.all(saved.map(async (p) => {
      try { weatherByCityId[p.id] = await Api.getForecast(p.latitude, p.longitude); } catch { /* skip */ }
    }));
    UI.renderSaved(
      saved,
      weatherByCityId,
      (place) => this.loadPlace(place),
      (id) => { Store.removeSaved(id); this.renderSaved(); if (this.state.place) { UI.els.favBtn.textContent = Store.isSaved(this.state.place.id) ? "★ Saved" : "☆ Save city"; } }
    );
  },

  shareReading() {
    if (!this.state.place || !this.state.forecast) return;
    const c = this.state.forecast.current;
    const text = `${this.state.place.name}: ${Units.temp(c.temperature_2m)}°C, ${weatherInfo(c.weather_code).label}`;
    if (navigator.share) {
      navigator.share({ title: "ClearSky weather reading", text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById("shareBtn");
        const original = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = original; }, 1500);
      });
    }
  },

  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
