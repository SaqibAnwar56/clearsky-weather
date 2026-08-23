// ===== ClearSky — UI rendering =====
const Units = {
  // Celsius only — rounded for display.
  temp(celsius) {
    return Math.round(celsius);
  },
  wind(kmh, unit) {
    const v = unit === "mph" ? kmh * 0.621371 : kmh;
    return Math.round(v);
  },
};

// Converts an ISO 3166-1 alpha-2 country code (e.g. "PK") into its flag emoji.
function flagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = [...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const UI = {
  els: {},

  cacheEls() {
    const ids = [
      "placeName","placeTime","placeDesc","placeFlag","currentIcon","currentTemp","currentDesc","feelsLike",
      "windSpeed","windDir","windNeedle","windGust","humidity","dewPoint","uvIndex","uvLabel",
      "aqiValue","aqiLabel","visibility","cloudCover","sunriseTime","sunsetTime","sunDot",
      "moonPhase","hourlyScroll","forecastGrid","savedGrid","savedSection","favBtn",
      "suggestText","summaryText","loadingState","errorState","errorMessage","mainContent",
      "themeToggle","sky","sunMoon","windUnitLabel","windUnitToggle","bestDay","bestDayIcon",
      "bestDayText","offlineBanner","toast","toastMessage","toastClose","downloadBtn",
    ];
    ids.forEach(id => { this.els[id] = document.getElementById(id); });
  },

  showLoading() {
    this.els.loadingState.hidden = false;
    this.els.errorState.hidden = true;
    this.els.mainContent.hidden = true;
  },

  showError(message) {
    this.els.loadingState.hidden = true;
    this.els.errorState.hidden = false;
    this.els.mainContent.hidden = true;
    this.els.errorMessage.textContent = message;
  },

  showContent() {
    this.els.loadingState.hidden = true;
    this.els.errorState.hidden = true;
    this.els.mainContent.hidden = false;
  },

  aqiLabel(aqi) {
    if (aqi == null) return "—";
    if (aqi <= 20) return "Good";
    if (aqi <= 40) return "Fair";
    if (aqi <= 60) return "Moderate";
    if (aqi <= 80) return "Poor";
    if (aqi <= 100) return "Very poor";
    return "Extremely poor";
  },

  uvLabel(uv) {
    if (uv == null) return "—";
    if (uv < 3) return "Low — minimal protection";
    if (uv < 6) return "Moderate — wear sunscreen";
    if (uv < 8) return "High — seek shade midday";
    if (uv < 11) return "Very high — limit exposure";
    return "Extreme — avoid midday sun";
  },

  outfitSuggestion(tempC, code, windKmh) {
    const info = weatherInfo(code);
    let msg = "";
    if (tempC <= 0) msg = "Freezing — heavy coat, gloves, and a hat.";
    else if (tempC <= 10) msg = "Cold — a warm jacket and layers.";
    else if (tempC <= 18) msg = "Cool — a light jacket or sweater.";
    else if (tempC <= 26) msg = "Mild — a t-shirt is fine.";
    else msg = "Hot — light clothing and sun protection.";
    if (["rain","drizzle","storm"].includes(info.icon)) msg += " Bring an umbrella.";
    if (["snow"].includes(info.icon)) msg += " Wear waterproof boots.";
    if (windKmh >= 30) msg += " It's windy — a windbreaker helps.";
    return msg;
  },

  dailySummary(place, forecast) {
    const c = forecast.current;
    const info = weatherInfo(c.weather_code);
    const hi = Math.round(forecast.daily.temperature_2m_max[0]);
    const lo = Math.round(forecast.daily.temperature_2m_min[0]);
    const rainChance = forecast.daily.precipitation_probability_max[0];
    let rainPart = rainChance >= 40 ? ` There's a ${rainChance}% chance of precipitation today.` : "";
    return `${info.label} in ${place.name} right now, with a high of ${hi}°C and a low of ${lo}°C.${rainPart}`;
  },

  windDirection(deg) {
    const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
  },

  formatTime(iso) {
    return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  },

  _clockTimer: null,
  _clockTz: null,
  _clockOffsetSeconds: null,

  // Ticks the header clock using the searched city's real IANA time zone
  // (returned by the weather API), not the visitor's own browser time zone.
  startClock(timezone, utcOffsetSeconds) {
    clearInterval(this._clockTimer);
    this._clockTz = timezone || null;
    this._clockOffsetSeconds = typeof utcOffsetSeconds === "number" ? utcOffsetSeconds : null;

    this.tickClock();
    this._clockTimer = setInterval(() => this.tickClock(), 1000);
  },

  tickClock() {
    let text;
    if (this._clockTz) {
      try {
        text = new Date().toLocaleTimeString(undefined, {
          hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: this._clockTz,
        });
      } catch {
        text = null;
      }
    }
    if (!text && this._clockOffsetSeconds != null) {
      // Fallback: manual UTC + offset calculation if the IANA zone name is unavailable.
      const nowUtcMs = Date.now() + new Date().getTimezoneOffset() * 60000;
      const cityDate = new Date(nowUtcMs + this._clockOffsetSeconds * 1000);
      text = cityDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
    if (this.els.placeTime) this.els.placeTime.textContent = text || "--:--";
  },

  renderCurrent(place, forecast, aqi, windUnit = "kmh") {
    const c = forecast.current;
    const info = weatherInfo(c.weather_code);

    this.els.placeName.textContent = [place.name, place.admin1, place.country].filter(Boolean).join(", ");
    if (this.els.placeFlag) this.els.placeFlag.textContent = flagEmoji(place.countryCode);
    this.els.placeDesc.textContent = info.label;
    this.startClock(forecast.timezone, forecast.utc_offset_seconds);

    this.els.currentIcon.innerHTML = iconMarkup(c.weather_code);
    this.els.currentTemp.textContent = Units.temp(c.temperature_2m);
    this.els.currentDesc.textContent = info.label;
    this.els.feelsLike.textContent = `Feels like ${Units.temp(c.apparent_temperature)}°C`;
    this.els.summaryText.textContent = this.dailySummary(place, forecast);

    // wind
    const unitLabel = windUnit === "mph" ? "mph" : "km/h";
    this.els.windSpeed.textContent = Units.wind(c.wind_speed_10m, windUnit);
    this.els.windUnitLabel.textContent = unitLabel;
    this.els.windDir.textContent = this.windDirection(c.wind_direction_10m);
    this.els.windNeedle.style.transform = `translate(-50%, -100%) rotate(${c.wind_direction_10m}deg)`;
    this.els.windGust.textContent = `${Units.wind(c.wind_gusts_10m ?? c.wind_speed_10m, windUnit)} ${unitLabel}`;
    this.els.windUnitToggle.textContent = windUnit === "mph" ? "Switch to km/h" : "Switch to mph";

    this.els.humidity.textContent = `${Math.round(c.relative_humidity_2m)}%`;
    this.els.dewPoint.textContent = `${Units.temp(c.dew_point_2m)}°C`;
    this.els.cloudCover.textContent = `${Math.round(c.cloud_cover ?? 0)}%`;

    const visKm = forecast.hourly && forecast.hourly.visibility
      ? Math.round((this._currentHourValue(forecast.hourly, "visibility") ?? 0) / 1000)
      : null;
    this.els.visibility.textContent = visKm != null ? `${visKm} km` : "-- km";

    const uv = forecast.daily.uv_index_max ? forecast.daily.uv_index_max[0] : null;
    this.els.uvIndex.textContent = uv != null ? uv.toFixed(1) : "--";
    this.els.uvLabel.textContent = this.uvLabel(uv);

    const aqiVal = aqi && aqi.current ? Math.round(aqi.current.european_aqi) : null;
    this.els.aqiValue.textContent = aqiVal != null ? aqiVal : "--";
    this.els.aqiLabel.textContent = this.aqiLabel(aqiVal);

    const sunrise = forecast.daily.sunrise[0];
    const sunset = forecast.daily.sunset[0];
    this.els.sunriseTime.textContent = this.formatTime(sunrise);
    this.els.sunsetTime.textContent = this.formatTime(sunset);
    this.els.moonPhase.textContent = Moon.describe();
    this.updateSunArc(sunrise, sunset);
    this.updateAmbientSky(c.is_day, info);

    this.els.favBtn.textContent = Store.isSaved(place.id) ? "★ Saved" : "☆ Save city";
    this.els.favBtn.classList.toggle("is-active", Store.isSaved(place.id));
    this.els.suggestText.hidden = true;
    this.els.suggestText.dataset.text = this.outfitSuggestion(c.temperature_2m, c.weather_code, c.wind_speed_10m);
  },

  _currentHourValue(hourly, field) {
    const now = Date.now();
    let idx = hourly.time.findIndex(t => new Date(t).getTime() >= now);
    if (idx === -1) idx = 0;
    return hourly[field] ? hourly[field][idx] : null;
  },

  updateSunArc(sunriseIso, sunsetIso) {
    const now = Date.now();
    const sunrise = new Date(sunriseIso).getTime();
    const sunset = new Date(sunsetIso).getTime();
    let pct = (now - sunrise) / (sunset - sunrise);
    pct = Math.max(0, Math.min(1, pct));
    const angle = Math.PI * (1 - pct);
    const cx = 60, cy = 60, r = 50;
    const x = cx - r * Math.cos(angle);
    const y = cy - r * Math.sin(angle);
    const dot = this.els.sunDot;
    if (dot) { dot.setAttribute("cx", x.toFixed(1)); dot.setAttribute("cy", y.toFixed(1)); }
  },

  updateAmbientSky(isDay, info) {
    document.documentElement.style.setProperty("--sky-grad-a", info.grad);
    if (this.els.sunMoon) {
      this.els.sunMoon.style.opacity = isDay ? 0.5 : 0.15;
      this.els.sunMoon.style.background = isDay
        ? "radial-gradient(circle at 35% 35%, #fff6d8, var(--accent) 70%)"
        : "radial-gradient(circle at 35% 35%, #dbe6f2, #8ea3b8 70%)";
    }
  },

  setBackgroundPhoto(url) {
    const photoEl = document.getElementById("skyPhoto");
    if (!photoEl || !url) return;
    photoEl.classList.remove("is-loaded");
    const img = new Image();
    img.onload = () => {
      photoEl.style.backgroundImage = `url("${url}")`;
      requestAnimationFrame(() => photoEl.classList.add("is-loaded"));
    };
    img.src = url;
  },

  renderHourly(hourly) {
    const now = Date.now();
    const wrap = this.els.hourlyScroll;
    wrap.innerHTML = "";
    const startIdx = hourly.time.findIndex(t => new Date(t).getTime() >= now);
    const idx0 = startIdx === -1 ? 0 : startIdx;
    for (let i = idx0; i < Math.min(idx0 + 24, hourly.time.length); i++) {
      const div = document.createElement("div");
      div.className = "hour-card";
      div.innerHTML = `
        <p class="h-time">${this.formatTime(hourly.time[i])}</p>
        <div class="h-icon">${iconMarkup(hourly.weather_code[i])}</div>
        <p class="h-temp">${Units.temp(hourly.temperature_2m[i])}°</p>
        <p class="h-precip">${hourly.precipitation_probability[i]}% rain</p>
      `;
      wrap.appendChild(div);
    }
  },

  renderForecast(daily) {
    const grid = this.els.forecastGrid;
    grid.innerHTML = "";
    daily.time.forEach((date, i) => {
      const info = weatherInfo(daily.weather_code[i]);
      const day = document.createElement("button");
      day.type = "button";
      day.className = "forecast-day";
      const name = i === 0 ? "Today" : new Date(date).toLocaleDateString(undefined, { weekday: "short" });
      day.innerHTML = `
        <p class="f-name">${name}</p>
        <div class="f-icon">${iconMarkup(daily.weather_code[i])}</div>
        <p class="f-hi">${Units.temp(daily.temperature_2m_max[i])}°</p>
        <p class="f-lo">${Units.temp(daily.temperature_2m_min[i])}°</p>
      `;
      day.title = info.label;
      grid.appendChild(day);
    });
  },

  renderSaved(savedList, weatherByCityId, onSelect, onRemove) {
    this.els.savedSection.hidden = savedList.length === 0;
    const grid = this.els.savedGrid;
    grid.innerHTML = "";
    savedList.forEach(place => {
      const card = document.createElement("div");
      card.className = "saved-card";
      const w = weatherByCityId[place.id];
      const tempStr = w ? `${Units.temp(w.current.temperature_2m)}°C` : "--°C";
      card.innerHTML = `
        <button class="s-remove" aria-label="Remove ${place.name}">✕</button>
        <p class="s-name">${place.name}</p>
        <p class="s-temp">${tempStr}</p>
      `;
      card.addEventListener("click", (e) => {
        if (e.target.closest(".s-remove")) return;
        onSelect(place);
      });
      card.querySelector(".s-remove").addEventListener("click", () => onRemove(place.id));
      grid.appendChild(card);
    });
  },

  renderSuggestions(list, onPick) {
    const ul = document.getElementById("suggestions");
    ul.innerHTML = "";
    if (!list.length) { ul.hidden = true; return; }
    list.forEach(place => {
      const li = document.createElement("li");
      const left = document.createElement("span");
      left.className = "suggestion-left";
      if (place.isCapital) {
        const badge = document.createElement("span");
        badge.className = "capital-badge";
        badge.textContent = "Capital";
        left.appendChild(badge);
      }
      const nameSpan = document.createElement("span");
      nameSpan.textContent = `${flagEmoji(place.countryCode)} ${place.name}`.trim();
      left.appendChild(nameSpan);
      li.appendChild(left);
      const meta = document.createElement("span");
      meta.textContent = [place.admin1, place.country].filter(Boolean).join(", ");
      li.appendChild(meta);
      li.addEventListener("click", () => onPick(place));
      ul.appendChild(li);
    });
    ul.hidden = false;
  },

  renderQuickChips(names, onPick) {
    const wrap = document.getElementById("quickChips");
    if (!wrap) return;
    wrap.innerHTML = "";
    names.forEach(name => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quick-chip";
      btn.textContent = name;
      btn.addEventListener("click", () => onPick(name));
      wrap.appendChild(btn);
    });
  },

  hideSuggestions() {
    const ul = document.getElementById("suggestions");
    ul.hidden = true;
    ul.innerHTML = "";
  },

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.els.themeToggle.textContent = theme === "dark" ? "☾" : "☀";
  },

  renderBestDay(daily) {
    // Score each of the next 7 days: lower precipitation chance + milder temperature = better.
    let bestIdx = 0;
    let bestScore = -Infinity;
    daily.time.forEach((_, i) => {
      const rain = daily.precipitation_probability_max[i] ?? 0;
      const hi = daily.temperature_2m_max[i];
      const comfort = 25 - Math.abs(hi - 24); // peak comfort near 24°C
      const score = comfort - rain * 0.4;
      if (score > bestScore) { bestScore = score; bestIdx = i; }
    });
    const name = bestIdx === 0 ? "Today" : new Date(daily.time[bestIdx]).toLocaleDateString(undefined, { weekday: "long" });
    const info = weatherInfo(daily.weather_code[bestIdx]);
    const hi = Units.temp(daily.temperature_2m_max[bestIdx]);
    const rain = daily.precipitation_probability_max[bestIdx] ?? 0;
    this.els.bestDayIcon.innerHTML = iconMarkup(daily.weather_code[bestIdx]);
    this.els.bestDayText.innerHTML = `Best day this week: <strong>${name}</strong> — ${info.label.toLowerCase()}, ${hi}°C high, ${rain}% rain chance.`;
  },

  showToast(message) {
    this.els.toastMessage.textContent = message;
    this.els.toast.hidden = false;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { this.els.toast.hidden = true; }, 6000);
  },

  hideToast() {
    this.els.toast.hidden = true;
    clearTimeout(this._toastTimer);
  },

  setOffline(isOffline) {
    this.els.offlineBanner.hidden = !isOffline;
  },

  downloadCard(place, forecast, windUnit) {
    const c = forecast.current;
    const info = weatherInfo(c.weather_code);
    const canvas = document.createElement("canvas");
    canvas.width = 640; canvas.height = 360;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 640, 360);
    grad.addColorStop(0, "#0A1128");
    grad.addColorStop(1, "#16213E");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 360);

    ctx.fillStyle = "#38BDF8";
    ctx.font = "600 16px sans-serif";
    ctx.fillText("CLEARSKY — LIVE WEATHER", 32, 44);

    ctx.fillStyle = "#F5F7FA";
    ctx.font = "700 30px sans-serif";
    ctx.fillText([place.name, place.country].filter(Boolean).join(", "), 32, 90);

    ctx.font = "800 110px sans-serif";
    ctx.fillStyle = "#FFB627";
    ctx.fillText(`${Units.temp(c.temperature_2m)}°C`, 32, 210);

    ctx.font = "500 22px sans-serif";
    ctx.fillStyle = "#9AA5B8";
    ctx.fillText(info.label, 32, 245);
    ctx.fillText(`Feels like ${Units.temp(c.apparent_temperature)}°C`, 32, 275);
    ctx.fillText(`Wind ${Units.wind(c.wind_speed_10m, windUnit)} ${windUnit === "mph" ? "mph" : "km/h"} · Humidity ${Math.round(c.relative_humidity_2m)}%`, 32, 305);

    ctx.font = "400 13px monospace";
    ctx.fillStyle = "#5B6B85";
    ctx.fillText(new Date().toLocaleString(), 32, 340);

    const link = document.createElement("a");
    link.download = `clearsky-${place.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  },
};
