const STORAGE_KEYS = {
  TARGET_BAND: "ielts_target_band",
  GEMINI_API_KEY: "ielts_gemini_api_key",
  HISTORY: "ielts_writing_history",
  STATS: "ielts_writing_stats",
};

export function getStoredTargetBand() {
  try {
    return localStorage.getItem(STORAGE_KEYS.TARGET_BAND) || "7.0";
  } catch {
    return "7.0";
  }
}

export function saveTargetBand(band) {
  try {
    localStorage.setItem(STORAGE_KEYS.TARGET_BAND, band);
  } catch (e) {
    console.error("Failed to save target band", e);
  }
}

export function getStoredApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || "";
  } catch {
    return "";
  }
}

export function saveApiKey(key) {
  try {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
  } catch (e) {
    console.error("Failed to save API key", e);
  }
}

export function getStoredHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistoryEntry(entry) {
  try {
    const history = getStoredHistory();
    const newEntry = {
      id: "hist_" + Date.now(),
      timestamp: new Date().toISOString(),
      ...entry
    };
    const updated = [newEntry, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    updateStats(newEntry);
    return newEntry;
  } catch (e) {
    console.error("Failed to save history", e);
    return null;
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.STATS);
  } catch (e) {
    console.error("Failed to clear history", e);
  }
}

export function getStoredStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    return raw ? JSON.parse(raw) : { totalSentences: 0, targetMetCount: 0, highestBand: 0 };
  } catch {
    return { totalSentences: 0, targetMetCount: 0, highestBand: 0 };
  }
}

function updateStats(newEntry) {
  try {
    const stats = getStoredStats();
    const overall = parseFloat(newEntry.scores?.overallBand) || 6.0;
    const target = parseFloat(newEntry.targetBand) || 7.0;

    stats.totalSentences += 1;
    if (overall >= target) {
      stats.targetMetCount += 1;
    }
    if (overall > stats.highestBand) {
      stats.highestBand = overall;
    }
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to update stats", e);
  }
}
