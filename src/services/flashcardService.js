// Flashcard state and gamification storage for interactive learning

const FLASHCARD_STORAGE_KEY = 'lopcooanh_flashcard_progress';

export function getFlashcardProgress() {
  try {
    const raw = localStorage.getItem(FLASHCARD_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
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
    console.error(e);
  }
}

export function recordCardResult(wordId, isMastered) {
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

  if (isMastered) {
    if (!progress.masteredWordIds.includes(wordId)) {
      progress.masteredWordIds.push(wordId);
    }
    progress.needsReviewWordIds = progress.needsReviewWordIds.filter(id => id !== wordId);
    progress.xp += 10;
  } else {
    if (!progress.needsReviewWordIds.includes(wordId)) {
      progress.needsReviewWordIds.push(wordId);
    }
    progress.masteredWordIds = progress.masteredWordIds.filter(id => id !== wordId);
    progress.xp = Math.max(0, progress.xp + 2); // Consolation XP for practicing
  }

  saveFlashcardProgress(progress);

  // Đồng bộ lên Supabase Cloud nếu người dùng đã đăng nhập
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

// Flatten all vocabularies from topics with topic metadata
export function extractAllVocabularies(task1Topics = [], task2Topics = []) {
  const all = [];
  const seenWords = new Set();

  const processList = (topics, taskType) => {
    topics.forEach(topic => {
      if (topic.vocabularies && Array.isArray(topic.vocabularies)) {
        topic.vocabularies.forEach(vocab => {
          if (!seenWords.has(vocab.word.toLowerCase())) {
            seenWords.add(vocab.word.toLowerCase());
            all.push({
              ...vocab,
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

  return all;
}
