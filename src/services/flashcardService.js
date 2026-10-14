// src/services/flashcardService.js
// Flashcard state, Spaced Repetition persistence and gamification storage for interactive learning

const FLASHCARD_STORAGE_KEY = 'lopcooanh_flashcard_progress';

export function getFlashcardProgress() {
  try {
    const raw = localStorage.getItem(FLASHCARD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        xp: parsed.xp || 0,
        streak: parsed.streak || 1,
        lastActiveDate: parsed.lastActiveDate || new Date().toISOString().slice(0, 10),
        masteredWordIds: Array.isArray(parsed.masteredWordIds) ? parsed.masteredWordIds : [],
        needsReviewWordIds: Array.isArray(parsed.needsReviewWordIds) ? parsed.needsReviewWordIds : [],
        totalCompletedSessions: parsed.totalCompletedSessions || 0
      };
    }
  } catch (e) {
    console.error("Error reading flashcard progress:", e);
  }
  return {
    xp: 0,
    streak: 1,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    masteredWordIds: [],
    needsReviewWordIds: [],
    totalCompletedSessions: 0
  };
}

export function saveFlashcardProgress(progress) {
  try {
    localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Error saving flashcard progress:", e);
  }
}

/**
 * Checks whether a card or word has been marked as mastered (Đã thuộc)
 */
export function isWordMastered(wordOrCard, progress) {
  if (!wordOrCard) return false;
  const p = progress || getFlashcardProgress();
  const mastered = p.masteredWordIds || [];

  const id = typeof wordOrCard === 'string' ? wordOrCard : wordOrCard?.id;
  const word = (typeof wordOrCard === 'string' ? wordOrCard : wordOrCard?.word || '').toLowerCase().trim();

  if (id && mastered.includes(id)) return true;
  if (word && mastered.includes(word)) return true;
  return false;
}

/**
 * Checks whether a card or word needs review (Cần ôn lại)
 */
export function isWordNeedsReview(wordOrCard, progress) {
  if (!wordOrCard) return false;
  const p = progress || getFlashcardProgress();
  const needsReview = p.needsReviewWordIds || [];

  const id = typeof wordOrCard === 'string' ? wordOrCard : wordOrCard?.id;
  const word = (typeof wordOrCard === 'string' ? wordOrCard : wordOrCard?.word || '').toLowerCase().trim();

  if (id && needsReview.includes(id)) return true;
  if (word && needsReview.includes(word)) return true;
  return false;
}

/**
 * Records learning result for a card.
 * Tracks BOTH the card ID and normalized word text for 100% reliable persistence.
 */
export function recordCardResult(wordOrCard, isMastered) {
  if (!wordOrCard) return getFlashcardProgress();
  
  const progress = getFlashcardProgress();
  const today = new Date().toISOString().slice(0, 10);

  // Update streak if active on a new consecutive day
  if (progress.lastActiveDate !== today) {
    const lastDate = new Date(progress.lastActiveDate);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      progress.streak += 1;
    } else if (diffDays > 1) {
      progress.streak = 1;
    }
    progress.lastActiveDate = today;
  }

  const id = typeof wordOrCard === 'string' ? wordOrCard : wordOrCard?.id;
  const cleanWord = (typeof wordOrCard === 'string' ? wordOrCard : wordOrCard?.word || '').toLowerCase().trim();

  const keysToTrack = [];
  if (id) keysToTrack.push(id);
  if (cleanWord && !keysToTrack.includes(cleanWord)) keysToTrack.push(cleanWord);

  if (isMastered) {
    // Add to mastered
    keysToTrack.forEach(k => {
      if (!progress.masteredWordIds.includes(k)) {
        progress.masteredWordIds.push(k);
      }
    });
    // Remove from needs review
    progress.needsReviewWordIds = progress.needsReviewWordIds.filter(k => !keysToTrack.includes(k));
    progress.xp += 10;
  } else {
    // Add to needs review
    keysToTrack.forEach(k => {
      if (!progress.needsReviewWordIds.includes(k)) {
        progress.needsReviewWordIds.push(k);
      }
    });
    // Remove from mastered
    progress.masteredWordIds = progress.masteredWordIds.filter(k => !keysToTrack.includes(k));
    progress.xp = Math.max(0, progress.xp + 2); // Consolation XP
  }

  saveFlashcardProgress(progress);

  // Sync to Supabase Cloud if signed in
  import('./supabaseClient').then(({ supabase, isSupabaseConfigured }) => {
    if (isSupabaseConfigured && supabase) {
      import('./authService').then(({ getCurrentUser }) => {
        getCurrentUser().then(user => {
          if (user) {
            supabase.from('flashcard_progress').upsert({
              user_id: user.id,
              mastered_word_ids: progress.masteredWordIds,
              needs_review_word_ids: progress.needsReviewWordIds,
              xp: progress.xp,
              streak: progress.streak,
              last_active_date: progress.lastActiveDate,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' }).then(() => {}).catch(() => {});
          }
        });
      });
    }
  }).catch(() => {});

  return progress;
}

export function addXP(amount) {
  const progress = getFlashcardProgress();
  progress.xp += amount;
  saveFlashcardProgress(progress);
  return progress.xp;
}

/**
 * Fisher-Yates array shuffle algorithm for unbiased random card ordering
 */
export function shuffleArray(arr) {
  if (!Array.isArray(arr)) return [];
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Flatten all vocabularies from topics with topic metadata
export function extractAllVocabularies(task1Topics = [], task2Topics = []) {
  const all = [];
  const seenWords = new Set();

  const processList = (topics, taskType) => {
    topics.forEach(topic => {
      if (topic.vocabularies && Array.isArray(topic.vocabularies)) {
        topic.vocabularies.forEach(vocab => {
          const clean = (vocab.word || '').toLowerCase().trim();
          if (clean && !seenWords.has(clean)) {
            seenWords.add(clean);
            all.push({
              ...vocab,
              id: vocab.id || `vocab-${clean.replace(/[^a-z0-9]/g, '-')}`,
              topicId: topic.id,
              topicName: topic.name,
              topicVietnameseName: topic.vietnameseName,
              taskType: taskType,
              icon: topic.icon
            });
          }
        });
      }
    });
  };

  processList(task2Topics, 'task2');
  processList(task1Topics, 'task1');

  // Also include custom flashcards saved by user
  const customWords = getSavedCustomWords();
  customWords.forEach(cw => {
    const clean = (cw.word || '').toLowerCase().trim();
    if (clean && !seenWords.has(clean)) {
      seenWords.add(clean);
      all.push({
        id: cw.id || `custom-${clean}`,
        word: cw.word,
        ipa: cw.ipa || "",
        partOfSpeech: cw.partOfSpeech || "noun",
        meaning: cw.meaning || "",
        topicId: "custom",
        topicName: cw.topicName || "Tự lưu",
        topicVietnameseName: cw.topicName || "Từ vựng của tôi",
        taskType: "custom",
        modelSentence: cw.exampleSentence || "",
        synonyms: cw.synonyms || []
      });
    }
  });

  return all;
}

const CUSTOM_FLASHCARDS_KEY = 'lopcooanh_custom_flashcards';

export function getSavedCustomWords() {
  try {
    const raw = localStorage.getItem(CUSTOM_FLASHCARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveFlashcardWord(wordData) {
  try {
    const existing = getSavedCustomWords();
    const cleanWord = (wordData.word || '').toLowerCase().trim();
    if (!cleanWord) return;
    
    const idx = existing.findIndex(w => (w.word || '').toLowerCase().trim() === cleanWord);
    const newWord = {
      id: `custom-word-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      word: wordData.word,
      ipa: wordData.ipa || "",
      partOfSpeech: wordData.pos || "noun",
      meaning: wordData.meaning || "",
      topicName: wordData.topicName || "IELTS Reading",
      exampleSentence: wordData.exampleSentence || "",
      synonyms: wordData.synonyms || [],
      savedAt: new Date().toISOString()
    };

    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...newWord };
    } else {
      existing.unshift(newWord);
    }
    localStorage.setItem(CUSTOM_FLASHCARDS_KEY, JSON.stringify(existing));
    return newWord;
  } catch (e) {
    console.error("Error saving flashcard word:", e);
  }
}
