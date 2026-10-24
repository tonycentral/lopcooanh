// src/services/speechService.js
// Speech Recognition & Pronunciation Scoring Service inspired by OpenQuiz.ai
// Uses 100% native Web Speech API (zero external costs, runs on client browser)

export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.speechSynthesis);
}

// Speak text using native speech synthesis with controllable playback speed
export function speakSentence(text, rate = 0.9, lang = 'en-US') {
  if (!isSpeechSynthesisSupported()) return;

  try {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\/\[\]]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = rate; // 0.8 for slow, 1.0 for normal, 0.9 for standard IELTS clear
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('English'))
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

// Initialize speech recognizer
export function createSpeechRecognizer({ lang = 'en-US', onResult, onError, onEnd }) {
  if (!isSpeechRecognitionSupported()) {
    if (onError) onError('Trình duyệt của bạn chưa hỗ trợ Web Speech API. Vui lòng sử dụng Google Chrome, Edge hoặc Safari.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = lang;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const currentText = (finalTranscript || interimTranscript).trim();
    const isFinal = Boolean(finalTranscript);

    if (onResult) {
      onResult({
        transcript: currentText,
        isFinal,
        confidence: event.results[0]?.[0]?.confidence || 0.9
      });
    }
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
}

// Clean string for word-level comparison
function cleanWord(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Calculate Levenshtein similarity between two words (0.0 to 1.0)
function wordSimilarity(w1, w2) {
  const s1 = cleanWord(w1);
  const s2 = cleanWord(w2);
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const len1 = s1.length;
  const len2 = s2.length;
  const matrix = Array.from({ length: len1 + 1 }, () => new Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return Math.max(0, 1 - distance / maxLen);
}

/**
 * OpenQuiz-style Pronunciation Assessment Algorithm
 * Calculates: PronScore, Accuracy, Fluency, Completeness, Prosody + Word-level breakdown
 */
export function evaluatePronunciation(targetSentence, spokenSentence, durationMs = 3000) {
  if (!targetSentence) {
    return {
      pronScore: 0,
      accuracy: 0,
      fluency: 0,
      completeness: 0,
      prosody: 0,
      words: []
    };
  }

  const targetWords = targetSentence.trim().split(/\s+/).filter(Boolean);
  const spokenWords = (spokenSentence || '').trim().split(/\s+/).filter(Boolean);

  let totalWordScore = 0;
  let matchedCount = 0;

  const wordBreakdown = targetWords.map((tWord, tIdx) => {
    const cleanT = cleanWord(tWord);
    
    // Find best match in spoken words within a local window
    let bestSim = 0;
    const windowStart = Math.max(0, tIdx - 2);
    const windowEnd = Math.min(spokenWords.length, tIdx + 3);

    for (let sIdx = windowStart; sIdx < windowEnd; sIdx++) {
      const sim = wordSimilarity(cleanT, spokenWords[sIdx]);
      if (sim > bestSim) bestSim = sim;
    }

    // Also check globally if local window missed (e.g. user stuttered)
    if (bestSim < 0.6) {
      for (const sWord of spokenWords) {
        const sim = wordSimilarity(cleanT, sWord);
        if (sim > bestSim) bestSim = sim;
      }
    }

    const wordScore = Math.round(bestSim * 100);
    totalWordScore += wordScore;

    let status = 'poor';
    if (wordScore >= 85) {
      status = 'excellent';
      matchedCount++;
    } else if (wordScore >= 65) {
      status = 'good';
      matchedCount++;
    } else if (wordScore >= 45) {
      status = 'fair';
    }

    return {
      word: tWord,
      score: wordScore,
      status // 'excellent' | 'good' | 'fair' | 'poor'
    };
  });

  // 1. Accuracy (Độ chính xác từng từ)
  const accuracy = targetWords.length > 0 
    ? Math.round(totalWordScore / targetWords.length) 
    : 0;

  // 2. Completeness (Độ hoàn chỉnh: đã đọc hết bao nhiêu % câu)
  const completeness = targetWords.length > 0 
    ? Math.min(100, Math.round((matchedCount / targetWords.length) * 100)) 
    : 0;

  // 3. Fluency (Độ trôi chảy: tốc độ nói wpm)
  // Target rate is ~110-150 words per minute
  const spokenCount = spokenWords.length;
  const durationMinutes = Math.max(0.02, (durationMs || 3000) / 60000);
  const wpm = spokenCount / durationMinutes;
  let fluency = 85;
  if (wpm < 50) fluency = Math.max(40, Math.round(wpm * 1.2));
  else if (wpm > 200) fluency = Math.max(60, 100 - Math.round((wpm - 200) * 0.4));
  else fluency = Math.min(98, Math.round(75 + (completeness * 0.2)));

  // 4. Prosody (Nhịp điệu ngữ điệu)
  const prosody = Math.min(96, Math.max(50, Math.round(accuracy * 0.6 + fluency * 0.4)));

  // Total OpenQuiz-style PronScore
  const pronScore = Math.round(accuracy * 0.45 + completeness * 0.3 + fluency * 0.15 + prosody * 0.1);

  return {
    pronScore: Math.min(100, Math.max(0, pronScore)),
    accuracy: Math.min(100, Math.max(0, accuracy)),
    fluency: Math.min(100, Math.max(0, fluency)),
    completeness: Math.min(100, Math.max(0, completeness)),
    prosody: Math.min(100, Math.max(0, prosody)),
    words: wordBreakdown
  };
}
