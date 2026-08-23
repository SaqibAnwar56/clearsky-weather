// ===== ClearSky — voice search (Web Speech API) =====
const Voice = {
  recognition: null,
  supported: !!(window.SpeechRecognition || window.webkitSpeechRecognition),

  init(onResult, onEnd) {
    if (!this.supported) return false;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SR();
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.onresult = (e) => onResult(e.results[0][0].transcript);
    this.recognition.onend = onEnd;
    this.recognition.onerror = onEnd;
    return true;
  },

  start() {
    if (this.recognition) {
      try { this.recognition.start(); } catch { /* already started */ }
    }
  },
};
