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

const OBFUSCATION_PREFIX = "sec_v1_";
const SALT_KEY = "lopcooanh_shield_storage";

function obfuscateSecret(plain) {
  if (!plain) return "";
  try {
    const xor = plain
      .split("")
      .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ SALT_KEY.charCodeAt(i % SALT_KEY.length)))
      .join("");
    return OBFUSCATION_PREFIX + btoa(unescape(encodeURIComponent(xor)));
  } catch {
    return plain;
  }
}

function deobfuscateSecret(encoded) {
  if (!encoded) return "";
  // Tương thích ngược với các key lưu dạng plain text trước đó
  if (!encoded.startsWith(OBFUSCATION_PREFIX)) return encoded;
  try {
    const raw = encoded.slice(OBFUSCATION_PREFIX.length);
    const decodedStr = decodeURIComponent(escape(atob(raw)));
    return decodedStr
      .split("")
      .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ SALT_KEY.charCodeAt(i % SALT_KEY.length)))
      .join("");
  } catch {
    return "";
  }
}

export function getStoredApiKey() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
    return raw ? deobfuscateSecret(raw) : "";
  } catch {
    return "";
  }
}

export function saveApiKey(key) {
  try {
    const clean = (key || "").trim();
    if (!clean) {
      localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, obfuscateSecret(clean));
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

/**
 * Tính điểm trung bình của các bài viết trong 7 ngày gần nhất
 * @param {string|null} studentEmail Email học viên (nếu có để lọc)
 * @returns {number|null} Điểm số trung bình (ví dụ: 6.5, 7.2) hoặc null nếu chưa có bài nào
 */
export function getAverageScoreLast7Days(studentEmail = null) {
  try {
    const history = getStoredHistory();
    if (!history || history.length === 0) return null;

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const recentEntries = history.filter(item => {
      const itemTime = new Date(item.timestamp).getTime();
      const isWithin7Days = itemTime >= sevenDaysAgo;
      const isEmailMatch = !studentEmail || !item.studentEmail || item.studentEmail.toLowerCase() === studentEmail.toLowerCase();
      return isWithin7Days && isEmailMatch;
    });

    if (recentEntries.length === 0) return null;

    let totalScore = 0;
    let count = 0;

    for (const item of recentEntries) {
      const score = parseFloat(item.scores?.overallBand) || parseFloat(item.scores?.overall);
      if (!isNaN(score) && score > 0) {
        totalScore += score;
        count += 1;
      }
    }

    if (count === 0) return null;
    const avg = totalScore / count;
    return Math.round(avg * 10) / 10;
  } catch (e) {
    console.error("Failed to calculate average score last 7 days", e);
    return null;
  }
}

