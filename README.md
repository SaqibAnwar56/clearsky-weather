# ClearSky — Live Weather Forecast

**🔗 Live site: [clearsky-weather-sepia.vercel.app](https://clearsky-weather-sepia.vercel.app/)**

A full-featured weather website built with plain HTML, CSS and JavaScript — no build step, no framework, no API keys required. Vivid glassmorphism design over a deep twilight gradient, with a real photo of the searched city fading in behind it. **All temperatures are shown in Celsius only.**

## Features

- **Always your real current location** — every time the app opens, it detects your actual current location (falls back to your last-viewed city only if location access is denied or unavailable)
- **Smart country search** — search a country name (e.g. "Pakistan", "Australia") and get its capital city's weather, tagged with a "Capital" badge
- **Real photo backgrounds** — a real photo of the searched city (via Wikipedia's free image API) fades in behind the app, tinted to match the current weather and time of day; hardened with multi-title lookup, a 4.5s timeout, a persistent 30-day cache, and rotating weather-mood fallback photos
- **Real local time zone clock** — shows the searched city's actual local time (via its IANA time zone), ticking live — not your browser's time
- **Country flag** shown next to the city name, plus one-tap chips for popular capitals (Islamabad, London, Tokyo, Dubai, etc.)
- **Graceful error handling** — if a background refresh fails, the last good reading stays on screen with a small dismissible toast instead of a full-page error
- **Print-friendly forecast** — a "Print forecast" button produces a clean, black-and-white printable version
- **Downloadable weather card** — exports current conditions as a PNG image
- Offline detection banner · Wind speed unit toggle (km/h ↔ mph) · "Best day this week" highlight
- Hourly temperature chart + 7-day trend chart (Chart.js)
- Keyboard shortcuts — `/` focus search, `L` use my location, `Esc` close suggestions
- City search with live autocomplete, voice search (Web Speech API), geolocation with reverse geocoding
- Current conditions, feels-like, wind compass with gusts, humidity, dew point, cloud cover, visibility
- UV index and air quality index, each with plain-language guidance
- Sunrise/sunset with a visual sun-arc indicator, plus moon phase
- 7-day forecast grid and an interactive map (Leaflet + OpenStreetMap)
- Dark/light theme toggle, save/compare favorite cities, recent search history — all persisted locally
- Outfit/activity suggestion, auto-generated daily summary sentence
- Installable PWA with offline app-shell caching
- SEO-ready: meta tags, Open Graph + Twitter cards, JSON-LD structured data, `robots.txt`, `sitemap.xml`
- Fully responsive, keyboard-accessible, respects reduced-motion

## Project structure

```
clearsky-weather/
├── index.html                SEO meta tags + structured data + markup
├── manifest.json              PWA manifest
├── robots.txt                  Search engine crawl rules
├── sitemap.xml                  Search engine sitemap
├── sw.js                          Service worker (offline app-shell cache)
├── vercel.json                     Vercel deployment config
├── favicon.ico
├── assets/
│   ├── og-cover.png                 Social share preview image (1200×630)
│   └── icons/                        Favicon set (16/32/48/192/512px + Apple touch icon)
├── css/
│   └── style.css                     Design tokens + components + print styles
├── js/
│   ├── config.js                      API endpoint configuration
│   ├── storage.js                      localStorage persistence helpers
│   ├── weather-codes.js                 WMO weather code → label/icon/gradient map
│   ├── country-capitals.js               Country name → capital city smart lookup
│   ├── moon.js                            Moon phase calculator (no API needed)
│   ├── background.js                       Real city photo fetcher (Wikipedia, no key)
│   ├── api.js                               Fetch wrappers (geocoding, forecast, air quality)
│   ├── charts.js                             Trend + hourly temperature charts
│   ├── map.js                                 Leaflet map wrapper
│   ├── voice.js                                Web Speech API wrapper
│   ├── ui.js                                    DOM rendering functions
│   └── app.js                                    App state + event wiring (entry point)
└── README.md
```

## APIs used (all free, no signup or API key required)

- **Weather & forecast:** [Open-Meteo](https://open-meteo.com) — `api.open-meteo.com`
- **City search:** Open-Meteo Geocoding — `geocoding-api.open-meteo.com`
- **Air quality:** Open-Meteo Air Quality — `air-quality-api.open-meteo.com`
- **Reverse geocoding:** [BigDataCloud](https://www.bigdatacloud.com/) client-side API
- **City photos:** Wikipedia REST API and Wikimedia Commons (fallback photos)
- **Map tiles:** OpenStreetMap via Leaflet

No `.env` file or secret key is needed anywhere in this project.

## Running locally

```bash
python3 -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080`.

## Deploying to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new) — it auto-detects as a static site, no build command needed. `vercel.json` is already included with security headers and clean URLs.

If you move to a custom domain later, replace every occurrence of `clearsky-weather-sepia.vercel.app` in `index.html`, `robots.txt`, `sitemap.xml`, and `css/style.css` with the new domain, then resubmit `sitemap.xml` to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters).

## Notes & known limitations

- Voice search requires a browser with the Web Speech API (Chrome, Edge) — fails gracefully elsewhere.
- The service worker caches the app shell only; weather data is always fetched fresh when online, falling back to the last cached response offline.
- Air quality, UV index, visibility, and reverse geocoding calls fail gracefully, showing `--` instead of breaking.
- Country → capital search covers ~190 countries and common short names (USA, UK, UAE); unrecognized ones fall back to a normal city search.
- If a fetch fails while data is already showing, the app keeps the last successful reading visible and shows a toast instead of a blocking error.

## Customizing

- Colors, type, and spacing are CSS custom properties at the top of `css/style.css` — edit the `:root` block to re-theme the app.
- Weather icons are inline SVG in `js/weather-codes.js`.
- Popular capital chips are set in `js/country-capitals.js` (`POPULAR_CAPITALS` array).

## Author

**Saqib Anwar**
[GitHub](https://github.com/SaqibAnwar56) · [LinkedIn](https://pk.linkedin.com/in/saqib-anwar-673097351)
