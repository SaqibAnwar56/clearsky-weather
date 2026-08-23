# ClearSky — Live Weather Forecast

A full-featured weather website built with plain HTML, CSS and JavaScript (no build step, no framework required). Vivid glassmorphism design over a deep twilight gradient. **All temperatures are shown in Celsius only.**

## Features

- **Always your real current location** — every time the app opens, it detects your actual current location (falls back to your last-viewed city only if location access is denied or unavailable)
- **About the Developer section** and footer credit with GitHub/LinkedIn links, plus Person structured data for better Google visibility
- **Real photo backgrounds** — a real photo of the searched city (via Wikipedia's free image API) fades in behind the app, tinted to match the current weather and time of day; reliability hardened with multi-title lookup (city name, "city, country", "city, region"), a 4.5s timeout, a persistent 30-day localStorage cache, and a rotating pool of weather-mood fallback photos for places without a Wikipedia image
- **Real favicons** — `.ico` + PNG icons (16/32/48/192/512px + Apple touch icon) matching the brand mark, not a data-URI placeholder
- **Print-friendly forecast** — a "Print forecast" button produces a clean, black-and-white printable version (no background photo, buttons, or map)
- **Smart country search** — search a country name (e.g. "Pakistan", "Australia") and get its capital city's weather, tagged with a "Capital" badge
- **Country flag** shown next to the city name
- **Quick capital shortcuts** — one-tap chips for popular capitals (Islamabad, London, Tokyo, Dubai, etc.)
- **Real local time zone clock** — shows the searched city's actual local time (via its IANA time zone), ticking live, not your browser's time
- **Graceful error handling** — if a background refresh fails, the last good reading stays on screen with a small dismissible toast, instead of a full-page error hiding your data
- Offline detection banner
- Wind speed unit toggle — km/h ↔ mph
- "Best day this week" highlight, scored from temperature comfort and rain chance
- Hourly temperature chart for the next 24 hours, alongside the 7-day trend chart
- Downloadable weather card — exports current conditions as a PNG image
- Keyboard shortcuts — `/` focus search, `L` use my location, `Esc` close suggestions
- City search with live autocomplete (Open‑Meteo geocoding)
- Voice search (Web Speech API, where supported)
- Geolocation on load with reverse geocoding
- Current conditions: temperature (°C), feels-like, description, icon
- Auto-generated plain-language daily summary sentence
- Wind compass (speed, gusts, and direction needle)
- Humidity, dew point, cloud cover, visibility
- UV index with guidance, air quality index with guidance
- Sunrise / sunset with a visual sun-arc indicator, plus moon phase
- Dynamic ambient background that shifts with weather condition and day/night
- 7-day forecast grid
- Interactive map of the searched location (Leaflet + OpenStreetMap)
- Dark / light theme toggle, persisted
- Save / remove favorite cities, compared side-by-side with live temperatures
- Recent search history (localStorage)
- Outfit/activity suggestion based on current conditions
- Share or copy a weather reading
- Loading skeletons
- Installable PWA with offline app-shell caching (service worker)
- SEO-ready: meta description/keywords, Open Graph + Twitter cards, JSON-LD structured data, `robots.txt`, `sitemap.xml`
- Fully responsive, keyboard-accessible, respects reduced-motion

## Project structure

```
weather-app/
├── index.html               Main page markup + SEO meta tags + structured data
├── manifest.json             PWA manifest
├── robots.txt                  Search engine crawl rules
├── sitemap.xml                  Search engine sitemap
├── sw.js                          Service worker (offline app-shell cache)
├── vercel.json                     Vercel deployment config
├── assets/
│   └── og-cover.png                 Social share preview image (1200×630)
├── css/
│   └── style.css                     All styling (design tokens + components + print styles)
├── js/
│   ├── config.js                      API endpoint configuration
│   ├── storage.js                      localStorage persistence helpers
│   ├── weather-codes.js                 WMO weather code → label/icon/gradient map
│   ├── country-capitals.js               Country name → capital city smart lookup
│   ├── moon.js                            Moon phase calculator (no API needed)
│   ├── background.js                       Real city photo fetcher (Wikipedia, no key)
│   ├── api.js                               Fetch wrappers (geocoding, forecast, air quality)
│   ├── charts.js                             Chart.js trend + hourly temperature charts
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
- **Reverse geocoding (lat/lon → city name):** [BigDataCloud](https://www.bigdatacloud.com/) client-side API — `api.bigdatacloud.net`
- **City photos:** Wikipedia REST API (`en.wikipedia.org/api/rest_v1`) and Wikimedia Commons for weather-mood fallback photos
- **Map tiles:** OpenStreetMap via Leaflet

No `.env` file or secret key is needed anywhere in this project.

## Before you deploy — update these for real SEO

`index.html`, `robots.txt`, and `sitemap.xml` currently use the placeholder domain `https://clearsky.example.com/`. Once you have your real Vercel domain:

1. Replace every `clearsky.example.com` in `index.html`, `robots.txt`, and `sitemap.xml` with your actual domain (e.g. `https://your-app.vercel.app` or your custom domain).
2. Add a real `og-cover.png` (1200×630px) social preview image somewhere in the project and update the `og:image` / `twitter:image` tags to point to it.
3. Once live, submit `sitemap.xml` to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters) so Google can index it.

## Running locally

Any static file server works. From the project folder:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080`.

## Deploying to Vercel

1. Install the CLI once: `npm i -g vercel`
2. From inside this folder, run:
   ```bash
   vercel --prod
   ```
3. Follow the prompts (link or create a project) — `vercel.json` is already included and configures security headers and clean URLs.
4. Once deployed, update the domain placeholders as described above and resubmit the sitemap.

Alternatively, push this folder to a GitHub repo and import it in the [Vercel dashboard](https://vercel.com/new) — it will auto-detect it as a static site, no build command needed.

## Notes & known limitations

- Voice search requires a browser that implements the Web Speech API (Chrome, Edge). It fails gracefully (button disabled) elsewhere.
- The service worker caches the app shell only; weather data itself is always fetched fresh when online (network-first), and falls back to the last cached response when offline.
- Air quality, UV index, visibility, and reverse geocoding calls fail gracefully — the UI shows `--` rather than breaking if any one of them is unavailable.
- Country → capital search covers ~190 countries and common short names (USA, UK, UAE). If a country isn't recognized, it still falls back to a normal city search.
- Moon phase is computed locally with a standard synodic-month formula — no API call needed.
- If a fetch fails while data is already showing (e.g. a flaky connection), the app keeps the last successful reading visible and shows a toast rather than a blocking error — a full-page error only appears on the very first load for a place.

## Customizing

- Colors, type, and spacing are defined as CSS custom properties at the top of `css/style.css` — change the `:root` block to re-theme the whole app.
- Weather icons are inline SVG in `js/weather-codes.js` — swap in your own icon set there if preferred.
- Popular capital chips are set in `js/country-capitals.js` (`POPULAR_CAPITALS` array).
