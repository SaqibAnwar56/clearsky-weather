// ===== ClearSky — Leaflet map =====
const MapView = {
  map: null,
  marker: null,

  render(lat, lon, name) {
    if (typeof L === "undefined") return;
    if (!this.map) {
      this.map = L.map("map", { zoomControl: true, attributionControl: true }).setView([lat, lon], 9);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(this.map);
      this.marker = L.marker([lat, lon]).addTo(this.map);
    } else {
      this.map.setView([lat, lon], 9);
      this.marker.setLatLng([lat, lon]);
    }
    this.marker.bindPopup(name).openPopup();
    setTimeout(() => this.map && this.map.invalidateSize(), 200);
  },
};
