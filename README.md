# 🌌 ClearSky

### ✦ Live Weather · Real Cities · Beautifully Presented

<div align="center">

<a href="https://clearsky-weather-sepia.vercel.app/">
  <img src="https://img.shields.io/badge/🌤️%20LIVE%20DEMO-Visit%20ClearSky-7c3aed?style=for-the-badge" />
</a>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />

<br><br>

**A modern, glassmorphism weather dashboard built with pure HTML, CSS & JavaScript.**

Real-time weather · Local time · City photography · Forecasts · Maps · Charts

</div>

---

## ✨ Experience the Weather Differently

ClearSky turns ordinary weather data into a **beautiful visual experience**.

🌤️ Dynamic weather UI
📍 Automatic location detection
🏙️ Real city photography
🕐 Live local timezone
📊 Interactive forecasts
🗺️ Interactive maps
🌙 Dark / Light themes
📱 Fully responsive

---

## 🎨 Design

<div align="center">

### Glassmorphism × Twilight Gradients × Real Cities

</div>

ClearSky uses a cinematic interface with:

```text
╭──────────────────────────────────────────────╮
│                                              │
│        🌙  ISLAMABAD                         │
│                                              │
│             28°C                             │
│        Partly Cloudy                         │
│                                              │
│   💧 72%     🌬️ 14 km/h     ☀️ UV 6         │
│                                              │
╰──────────────────────────────────────────────╯
```

The background dynamically changes according to:

**Weather + Time of Day + City**

---

## ⚡ Features

|     | Feature             |                                    |
| --- | ------------------- | ---------------------------------- |
| 📍  | **Live Location**   | Detects your actual location       |
| 🔎  | **Smart Search**    | Search cities or countries         |
| 🏛️ | **Capital Search**  | Country → capital automatically    |
| 🏙️ | **Real Photos**     | Dynamic city backgrounds           |
| 🕐  | **Local Clock**     | Actual city timezone               |
| 🌡️ | **Live Conditions** | Temperature, feels-like & humidity |
| 🌬️ | **Wind System**     | Speed, gusts & compass             |
| 🌫️ | **Air Quality**     | AQI & plain-language guidance      |
| ☀️  | **UV Index**        | UV level + safety guidance         |
| 🌅  | **Sun & Moon**      | Sunrise, sunset & moon phase       |
| 📊  | **Charts**          | Hourly + 7-day trends              |
| 🗺️ | **Weather Map**     | Leaflet + OpenStreetMap            |
| ⭐   | **Favorites**       | Save & compare cities              |
| 🎙️ | **Voice Search**    | Web Speech API                     |
| 🖼️ | **Weather Card**    | Download as PNG                    |
| 🖨️ | **Print Mode**      | Clean printable forecast           |
| 📱  | **PWA**             | Installable + offline shell        |
| 🌓  | **Themes**          | Dark / light mode                  |

---

## 🌦️ Weather Dashboard

ClearSky gives you everything important at a glance.

### Current

**Temperature · Feels Like · Humidity · Dew Point · Wind · Gusts · Cloud Cover · Visibility**

### Forecast

**Hourly temperature → 7-day forecast → Weekly trend → Best day**

### Environment

**AQI · UV Index · Sunrise · Sunset · Moon Phase**

All temperatures are displayed in **°C**.

---

## 🏙️ Real City Backgrounds

No boring generic weather backgrounds.

ClearSky searches for **real photographs of the selected city** through Wikipedia and Wikimedia.

The background engine includes:

* Multi-title image lookup
* 4.5s timeout protection
* 30-day persistent cache
* Weather-mood fallbacks
* Day/night adaptation
* Dynamic weather tinting

If an image fails, the weather experience **keeps working**.

---

## 🌍 Smart Search

Search a city:

```text
Islamabad
Tokyo
London
Dubai
Sydney
New York
```

Or simply search:

```text
Pakistan
Australia
Japan
United Kingdom
UAE
```

ClearSky automatically resolves the country to its capital and displays:

> 🏛️ **Capital**

---

## 🧠 Smart UX

### Keyboard

| Key   | Action            |
| ----- | ----------------- |
| `/`   | Search            |
| `L`   | My Location       |
| `Esc` | Close suggestions |

### Units

```text
🌬️ km/h  ⇄  mph
```

### Suggestions

ClearSky can generate contextual:

**👕 Outfit suggestions**
**🏃 Activity suggestions**
**☀️ UV guidance**
**🌫️ Air-quality guidance**
**📝 Daily weather summary**

---

## 🛠️ Built With

<div align="center">

| Technology         | Purpose           |
| ------------------ | ----------------- |
| **HTML5**          | Structure         |
| **CSS3**           | Glassmorphism UI  |
| **JavaScript**     | Application logic |
| **Open-Meteo**     | Weather data      |
| **Wikipedia API**  | City photography  |
| **Chart.js**       | Weather charts    |
| **Leaflet**        | Interactive maps  |
| **OpenStreetMap**  | Map tiles         |
| **BigDataCloud**   | Reverse geocoding |
| **Web Speech API** | Voice search      |
| **Service Worker** | Offline support   |

</div>

### 🚫 No Framework

```text
No React
No Vue
No Angular
No build step
No API keys
No backend
No .env
```

Just **HTML + CSS + JavaScript**.

---

## 📂 Project Structure

```text
clearsky-weather/
│
├── index.html
├── manifest.json
├── sw.js
├── vercel.json
├── robots.txt
├── sitemap.xml
│
├── assets/
│   ├── og-cover.png
│   └── icons/
│
├── css/
│   └── style.css
│
└── js/
    ├── app.js
    ├── api.js
    ├── ui.js
    ├── charts.js
    ├── map.js
    ├── background.js
    ├── weather-codes.js
    ├── country-capitals.js
    ├── storage.js
    ├── moon.js
    ├── voice.js
    └── config.js
```

---

## 🚀 Run

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

Or:

```bash
npx serve .
```

---

## ☁️ Deploy

### Vercel

```bash
npm i -g vercel
vercel --prod
```

Or simply import the repository into Vercel.

**No build command required.**

---

## 📱 PWA

ClearSky can be installed directly from supported browsers.

```text
⚡ Fast App Shell
📴 Offline UI
🔄 Fresh Weather Online
📲 Installable
```

Weather data is refreshed whenever the connection is available.

---

## 🎯 Lightweight. Fast. Beautiful.

ClearSky was designed around one idea:

> **Weather information should be useful — but it should also feel beautiful.**

No complicated setup.

No API keys.

No framework overhead.

Just a polished weather experience running directly in the browser.

---

## 👨‍💻 Created By

<div align="center">

### Saqib Anwar

<a href="https://github.com/SaqibAnwar56">
<img src="https://img.shields.io/badge/GitHub-SaqibAnwar56-181717?style=for-the-badge&logo=github" />
</a>

<a href="https://pk.linkedin.com/in/saqib-anwar-673097351">
<img src="https://img.shields.io/badge/LinkedIn-Saqib%20Anwar-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>

<br><br>

**Made with ❤️ and JavaScript**

<br>

<a href="https://clearsky-weather-sepia.vercel.app/">
<img src="https://img.shields.io/badge/🌌%20OPEN%20CLEARSKY-7c3aed?style=for-the-badge" />
</a>

</div>

---

<div align="center">

### ⭐ If you like ClearSky, give the repository a star!

**🌤️ Real Weather · 🌍 Real Cities · ✨ Beautiful UI**

</div>
