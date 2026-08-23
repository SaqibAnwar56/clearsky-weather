// ===== ClearSky — API layer =====
const Api = {
  async searchCities(query) {
    if (!query || query.trim().length < 2) return [];
    const url = `${CONFIG.GEOCODE_URL}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geocoding request failed");
    const data = await res.json();
    return (data.results || []).map(r => ({
      id: `${r.latitude},${r.longitude}`,
      name: r.name,
      admin1: r.admin1 || "",
      country: r.country || "",
      countryCode: r.country_code || "",
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone,
    }));
  },

  async reverseGeocode(lat, lon) {
    try {
      const url = `${CONFIG.REVERSE_GEOCODE_URL}?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Reverse geocode failed");
      const data = await res.json();
      return {
        id: `${lat},${lon}`,
        name: data.city || data.locality || data.principalSubdivision || "Current location",
        admin1: data.principalSubdivision || "",
        country: data.countryName || "",
        countryCode: data.countryCode || "",
        latitude: lat,
        longitude: lon,
      };
    } catch {
      return { id: `${lat},${lon}`, name: "Current location", admin1: "", country: "", latitude: lat, longitude: lon };
    }
  },

  async getForecast(lat, lon) {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,dew_point_2m,cloud_cover",
      hourly: "temperature_2m,precipitation_probability,weather_code,visibility",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max",
      timezone: "auto",
      forecast_days: "7",
    });
    const res = await fetch(`${CONFIG.FORECAST_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("Forecast request failed");
    return res.json();
  },

  async getAirQuality(lat, lon) {
    try {
      const params = new URLSearchParams({
        latitude: lat, longitude: lon,
        current: "european_aqi,pm10,pm2_5",
        timezone: "auto",
      });
      const res = await fetch(`${CONFIG.AIR_QUALITY_URL}?${params.toString()}`);
      if (!res.ok) throw new Error("AQI request failed");
      return res.json();
    } catch {
      return null;
    }
  },
};
