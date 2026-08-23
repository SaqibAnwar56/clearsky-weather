// ===== ClearSky — moon phase calculator =====
// Pure-math approximation, no API required.
const Moon = {
  phase(date = new Date()) {
    const synodic = 29.530588853;
    const known = Date.UTC(2000, 0, 6, 18, 14); // known new moon
    const diffDays = (date.getTime() - known) / 86400000;
    let phase = (diffDays % synodic) / synodic;
    if (phase < 0) phase += 1;
    return phase; // 0 = new moon, 0.5 = full moon
  },

  label(phase) {
    if (phase < 0.03 || phase > 0.97) return "New Moon";
    if (phase < 0.22) return "Waxing Crescent";
    if (phase < 0.28) return "First Quarter";
    if (phase < 0.47) return "Waxing Gibbous";
    if (phase < 0.53) return "Full Moon";
    if (phase < 0.72) return "Waning Gibbous";
    if (phase < 0.78) return "Last Quarter";
    return "Waning Crescent";
  },

  emoji(phase) {
    if (phase < 0.03 || phase > 0.97) return "🌑";
    if (phase < 0.22) return "🌒";
    if (phase < 0.28) return "🌓";
    if (phase < 0.47) return "🌔";
    if (phase < 0.53) return "🌕";
    if (phase < 0.72) return "🌖";
    if (phase < 0.78) return "🌗";
    return "🌘";
  },

  describe(date = new Date()) {
    const p = this.phase(date);
    return `${this.emoji(p)} ${this.label(p)}`;
  },
};
