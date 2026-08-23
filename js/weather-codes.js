// ===== ClearSky — WMO weather code mapping =====
// Reference: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
const WEATHER_CODES = {
  0:  { label: "Clear sky",            icon: "sun",        grad: "#2c5364" },
  1:  { label: "Mainly clear",         icon: "sun-cloud",  grad: "#2c5364" },
  2:  { label: "Partly cloudy",        icon: "cloud-sun",  grad: "#37475a" },
  3:  { label: "Overcast",             icon: "cloud",      grad: "#3d4657" },
  45: { label: "Fog",                  icon: "fog",        grad: "#4a5568" },
  48: { label: "Depositing rime fog",  icon: "fog",        grad: "#4a5568" },
  51: { label: "Light drizzle",        icon: "drizzle",    grad: "#334455" },
  53: { label: "Moderate drizzle",     icon: "drizzle",    grad: "#334455" },
  55: { label: "Dense drizzle",        icon: "drizzle",    grad: "#2d3d4d" },
  56: { label: "Light freezing drizzle", icon: "drizzle",  grad: "#3a4b5c" },
  57: { label: "Dense freezing drizzle", icon: "drizzle",  grad: "#3a4b5c" },
  61: { label: "Slight rain",          icon: "rain",       grad: "#2b3a4a" },
  63: { label: "Moderate rain",        icon: "rain",       grad: "#28374a" },
  65: { label: "Heavy rain",           icon: "rain",       grad: "#1f2c3d" },
  66: { label: "Light freezing rain",  icon: "rain",       grad: "#324457" },
  67: { label: "Heavy freezing rain",  icon: "rain",       grad: "#2a3b4d" },
  71: { label: "Slight snow",          icon: "snow",       grad: "#4a5a6a" },
  73: { label: "Moderate snow",        icon: "snow",       grad: "#465666" },
  75: { label: "Heavy snow",           icon: "snow",       grad: "#3d4d5c" },
  77: { label: "Snow grains",          icon: "snow",       grad: "#4a5a6a" },
  80: { label: "Slight rain showers",  icon: "rain",       grad: "#2b3a4a" },
  81: { label: "Moderate rain showers",icon: "rain",       grad: "#28374a" },
  82: { label: "Violent rain showers", icon: "rain",       grad: "#1a2635" },
  85: { label: "Slight snow showers",  icon: "snow",       grad: "#4a5a6a" },
  86: { label: "Heavy snow showers",   icon: "snow",       grad: "#3d4d5c" },
  95: { label: "Thunderstorm",         icon: "storm",      grad: "#1a1f2b" },
  96: { label: "Thunderstorm, hail",   icon: "storm",      grad: "#161b25" },
  99: { label: "Thunderstorm, heavy hail", icon: "storm",  grad: "#12161f" },
};

function weatherInfo(code) {
  return WEATHER_CODES[code] || { label: "Unknown", icon: "cloud", grad: "#2c3e56" };
}

const WEATHER_ICONS = {
  sun: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="var(--accent)"/><g stroke="var(--accent)" stroke-width="3" stroke-linecap="round"><line x1="32" y1="4" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="60"/><line x1="4" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="60" y2="32"/><line x1="12" y1="12" x2="17" y2="17"/><line x1="47" y1="47" x2="52" y2="52"/><line x1="52" y1="12" x2="47" y2="17"/><line x1="17" y1="47" x2="12" y2="52"/></g></svg>`,
  "sun-cloud": `<svg viewBox="0 0 64 64"><circle cx="24" cy="26" r="11" fill="var(--accent)"/><ellipse cx="36" cy="42" rx="20" ry="13" fill="var(--accent-2)" opacity="0.85"/></svg>`,
  "cloud-sun": `<svg viewBox="0 0 64 64"><circle cx="40" cy="22" r="9" fill="var(--accent)"/><ellipse cx="28" cy="40" rx="22" ry="14" fill="var(--accent-2)"/></svg>`,
  cloud: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="24" ry="15" fill="var(--accent-2)"/></svg>`,
  fog: `<svg viewBox="0 0 64 64"><g stroke="var(--accent-2)" stroke-width="4" stroke-linecap="round"><line x1="8" y1="24" x2="56" y2="24"/><line x1="14" y1="34" x2="50" y2="34"/><line x1="8" y1="44" x2="56" y2="44"/></g></svg>`,
  drizzle: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="26" rx="20" ry="12" fill="var(--accent-2)"/><g stroke="var(--accent-2)" stroke-width="3" stroke-linecap="round"><line x1="24" y1="42" x2="21" y2="52"/><line x1="34" y1="42" x2="31" y2="52"/><line x1="44" y1="42" x2="41" y2="52"/></g></svg>`,
  rain: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="24" rx="22" ry="13" fill="var(--storm)"/><g stroke="var(--accent-2)" stroke-width="3.5" stroke-linecap="round"><line x1="20" y1="42" x2="16" y2="56"/><line x1="32" y1="42" x2="28" y2="56"/><line x1="44" y1="42" x2="40" y2="56"/></g></svg>`,
  snow: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="22" rx="20" ry="11" fill="var(--storm)"/><g stroke="#fff" stroke-width="3" stroke-linecap="round"><line x1="22" y1="44" x2="22" y2="56"/><line x1="17" y1="47" x2="27" y2="53"/><line x1="27" y1="47" x2="17" y2="53"/><line x1="42" y1="44" x2="42" y2="56"/><line x1="37" y1="47" x2="47" y2="53"/><line x1="47" y1="47" x2="37" y2="53"/></g></svg>`,
  storm: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="20" rx="20" ry="11" fill="var(--storm)"/><polygon points="34,32 24,48 32,48 28,60 44,40 34,40" fill="var(--accent)"/></svg>`,
};

function iconMarkup(code) {
  const info = weatherInfo(code);
  return WEATHER_ICONS[info.icon] || WEATHER_ICONS.cloud;
}
