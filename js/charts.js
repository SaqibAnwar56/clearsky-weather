// ===== ClearSky — charts (Chart.js) =====
const Charts = {
  trendInstance: null,
  hourlyInstance: null,

  _palette() {
    const styles = getComputedStyle(document.body);
    return {
      accent: styles.getPropertyValue("--accent").trim() || "#FFB627",
      accent2: styles.getPropertyValue("--accent-2").trim() || "#38BDF8",
      text: styles.getPropertyValue("--text-dim").trim() || "#9AA5B8",
      line: styles.getPropertyValue("--line").trim() || "rgba(255,255,255,0.1)",
    };
  },

  render(daily) {
    const canvas = document.getElementById("trendChart");
    if (!canvas || typeof Chart === "undefined") return;

    const labels = daily.time.map(d => new Date(d).toLocaleDateString(undefined, { weekday: "short" }));
    const highs = daily.temperature_2m_max.map(t => Units.temp(t));
    const lows = daily.temperature_2m_min.map(t => Units.temp(t));

    if (this.trendInstance) this.trendInstance.destroy();
    const { accent, accent2, text, line } = this._palette();

    this.trendInstance = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "High (°C)", data: highs, borderColor: accent, backgroundColor: "transparent", tension: 0.35, pointRadius: 3 },
          { label: "Low (°C)", data: lows, borderColor: accent2, backgroundColor: "transparent", tension: 0.35, pointRadius: 3 },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: text, font: { family: "IBM Plex Mono", size: 11 } } } },
        scales: {
          x: { ticks: { color: text, font: { family: "IBM Plex Mono", size: 11 } }, grid: { color: line } },
          y: { ticks: { color: text, font: { family: "IBM Plex Mono", size: 11 } }, grid: { color: line } },
        },
      },
    });
  },

  renderHourly(hourly) {
    const canvas = document.getElementById("hourlyTempChart");
    if (!canvas || typeof Chart === "undefined") return;

    const now = Date.now();
    let idx0 = hourly.time.findIndex(t => new Date(t).getTime() >= now);
    if (idx0 === -1) idx0 = 0;
    const end = Math.min(idx0 + 24, hourly.time.length);

    const labels = hourly.time.slice(idx0, end).map(t =>
      new Date(t).toLocaleTimeString(undefined, { hour: "2-digit" })
    );
    const temps = hourly.temperature_2m.slice(idx0, end).map(t => Units.temp(t));

    if (this.hourlyInstance) this.hourlyInstance.destroy();
    const { accent2, text, line } = this._palette();

    this.hourlyInstance = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Temperature (°C)", data: temps, borderColor: accent2,
            backgroundColor: "rgba(56,189,248,0.12)", fill: true, tension: 0.4, pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: text, font: { family: "IBM Plex Mono", size: 10 }, maxRotation: 0 }, grid: { color: line } },
          y: { ticks: { color: text, font: { family: "IBM Plex Mono", size: 11 } }, grid: { color: line } },
        },
      },
    });
  },
};
