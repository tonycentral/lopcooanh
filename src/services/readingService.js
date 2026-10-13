// src/services/readingService.js
/**
 * IELTS Academic Reading Progress & Persistence Service
 * Manages test status (completed, in_progress, not_started), user answers drafts,
 * results history, and smart recommended test selection.
 */

const READING_STORAGE_KEY_PREFIX = "lopcooanh_reading_progress_";

function getStorageKey(studentEmail) {
  const cleanEmail = (studentEmail || "guest").trim().toLowerCase();
  return `${READING_STORAGE_KEY_PREFIX}${cleanEmail}`;
}

/**
 * Retrieves the full reading progress object for the user
 */
export function getReadingProgress(studentEmail) {
  try {
    const key = getStorageKey(studentEmail);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        tests: parsed.tests || {},
        lastActiveByTopic: parsed.lastActiveByTopic || {}
      };
    }
  } catch (e) {
    console.error("Failed to load reading progress:", e);
  }
  return { tests: {}, lastActiveByTopic: {} };
}

/**
 * Saves reading progress to localStorage
 */
export function saveReadingProgress(studentEmail, progress) {
  try {
    const key = getStorageKey(studentEmail);
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save reading progress:", e);
  }
}

/**
 * Generates standard testId: e.g. "environment-test-1"
 */
export function getReadingTestId(topicId, testNumber) {
  return `${topicId}-test-${testNumber}`;
}

/**
 * Saves or updates in-progress user answers draft for a test
 */
export function saveReadingTestDraft(studentEmail, topicId, testNumber, userAnswers, elapsedSeconds = 0) {
  const progress = getReadingProgress(studentEmail);
  const testId = getReadingTestId(topicId, testNumber);
  const existing = progress.tests[testId];

  // Do not overwrite completed test with a draft
  if (existing && existing.status === 'completed') {
    return progress;
  }

  const answeredCount = Object.keys(userAnswers || {}).filter(k => (userAnswers[k] || '').trim()).length;

  if (answeredCount > 0) {
    progress.tests[testId] = {
      status: 'in_progress',
      topicId,
      testNumber,
      userAnswers: { ...userAnswers },
      elapsedSeconds,
      lastUpdated: Date.now()
    };
  } else if (existing && existing.status === 'in_progress') {
    // If all answers were cleared, remove in_progress entry
    delete progress.tests[testId];
  }

  progress.lastActiveByTopic[topicId] = testNumber;
  saveReadingProgress(studentEmail, progress);
  return progress;
}

/**
 * Marks a test as completed with full results
 */
export function saveReadingTestCompletion(studentEmail, topicId, testNumber, userAnswers, result, elapsedSeconds = 0) {
  const progress = getReadingProgress(studentEmail);
  const testId = getReadingTestId(topicId, testNumber);

  progress.tests[testId] = {
    status: 'completed',
    topicId,
    testNumber,
    userAnswers: { ...userAnswers },
    result,
    elapsedSeconds,
    lastUpdated: Date.now()
  };

  progress.lastActiveByTopic[topicId] = testNumber;
  saveReadingProgress(studentEmail, progress);
  return progress;
}

/**
 * Resets a single test so student can retake it from scratch
 */
export function resetReadingTestProgress(studentEmail, topicId, testNumber) {
  const progress = getReadingProgress(studentEmail);
  const testId = getReadingTestId(topicId, testNumber);

  delete progress.tests[testId];
  saveReadingProgress(studentEmail, progress);
  return progress;
}

/**
 * Returns the status of a specific test: 'completed' | 'in_progress' | 'not_started'
 */
export function getReadingTestStatus(progress, topicId, testNumber) {
  if (!progress || !progress.tests) return 'not_started';
  const testId = getReadingTestId(topicId, testNumber);
  const item = progress.tests[testId];
  if (!item) return 'not_started';
  return item.status || 'not_started';
}

/**
 * Finds the best recommended test number to show when a session/topic appears:
 * 1. An 'in_progress' test if one exists (so student can continue their unfinished test)
 * 2. The first 'not_started' test (đề mới chưa làm)
 * 3. The last active test if all tests are completed, fallback to 1
 */
export function findRecommendedTestNumber(progress, topicId, totalTests = 50) {
  if (!progress || !progress.tests) return 1;

  // 1. Look for an in-progress test in this topic
  for (let n = 1; n <= totalTests; n++) {
    const testId = getReadingTestId(topicId, n);
    if (progress.tests[testId]?.status === 'in_progress') {
      return n;
    }
  }

  // 2. Look for the first unattempted test ('not_started')
  for (let n = 1; n <= totalTests; n++) {
    const testId = getReadingTestId(topicId, n);
    if (!progress.tests[testId]) {
      return n;
    }
  }

  // 3. Fallback: last active test in this topic
  if (progress.lastActiveByTopic && progress.lastActiveByTopic[topicId]) {
    return progress.lastActiveByTopic[topicId];
  }

  return 1;
}
