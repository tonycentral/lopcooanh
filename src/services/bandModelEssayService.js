import { PREDEFINED_BAND_ESSAYS } from '../data/bandModelEssaysData';

export const BAND_LEVELS = [
  { id: '6.5', label: 'Band 6.5', title: 'Đạt chuẩn cơ bản', color: 'blue', desc: 'Xét tuyển đại học & định cư' },
  { id: '7.5', label: 'Band 7.5', title: 'Mục tiêu khá giỏi', color: 'emerald', desc: 'Du học thạc sĩ & học bổng' },
  { id: '8.5', label: 'Band 8.5', title: 'Xuất sắc / Master', color: 'purple', desc: 'Điểm số tuyệt đối & giảng viên' }
];

export const AVAILABLE_BAND_KEYS = ['6.5', '7.5', '8.5'];

/**
 * Normalize any band input string (e.g. "6.0", "7.0", "8.0") to nearest calibrated band ('6.5', '7.5', '8.5')
 */
export function normalizeBand(band) {
  const num = parseFloat(band) || 7.5;
  if (num <= 6.5) return '6.5';
  if (num >= 8.0) return '8.5';
  return '7.5';
}

/**
 * Calculate the exact word count of an essay text or array of paragraphs
 */
export function countWords(input) {
  if (Array.isArray(input)) {
    return input.map(p => (typeof p === 'string' ? p : p.text || '')).join(' ').trim().split(/\s+/).filter(Boolean).length;
  }
  if (typeof input === 'string') {
    return input.trim().split(/\s+/).filter(Boolean).length;
  }
  return 0;
}

/**
 * Find matching predefined topic ID
 */
function resolveTopicId(topic, activeTask = 'task2') {
  if (!topic) {
    return activeTask === 'task1' ? 'task1-roche-01-kpb-shares' : 'environment';
  }

  // 1. Direct key check
  if (topic.id && PREDEFINED_BAND_ESSAYS[topic.id]) {
    return topic.id;
  }

  const topicName = (topic.name || topic.title || '').toLowerCase();
  const prompt = (topic.ieltsPrompt || topic.prompt || '').toLowerCase();
  const fullSearch = `${topicName} ${prompt}`;

  if (activeTask === 'task1' || topic.taskType === 'task1') {
    if (fullSearch.includes('share') || fullSearch.includes('stock') || fullSearch.includes('kpb') || fullSearch.includes('line')) {
      return 'task1-roche-01-kpb-shares';
    }
    if (fullSearch.includes('fertility') || fullSearch.includes('birth') || fullSearch.includes('gulf') || fullSearch.includes('bar')) {
      return 'task1-roche-02-gulf-fertility';
    }
    if (fullSearch.includes('spend') || fullSearch.includes('expenditure') || fullSearch.includes('pie') || fullSearch.includes('household')) {
      return 'task1-roche-04-uk-household-spending';
    }
    return 'task1-roche-01-kpb-shares';
  } else {
    if (fullSearch.includes('environ') || fullSearch.includes('climate') || fullSearch.includes('pollution') || fullSearch.includes('green')) {
      return 'environment';
    }
    if (fullSearch.includes('tech') || fullSearch.includes('ai') || fullSearch.includes('work') || fullSearch.includes('robot') || fullSearch.includes('computer')) {
      return 'technology';
    }
    if (fullSearch.includes('educat') || fullSearch.includes('degree') || fullSearch.includes('vocat') || fullSearch.includes('universit') || fullSearch.includes('school')) {
      return 'education';
    }
    return 'environment';
  }
}

/**
 * Retrieve calibrated model essay with examiner scoring & rationale
 */
export function getBandModelEssay(topic, activeTask = 'task2', requestedBand = '7.5') {
  const normBand = normalizeBand(requestedBand);
  const resolvedId = resolveTopicId(topic, activeTask);
  const topicEntry = PREDEFINED_BAND_ESSAYS[resolvedId] || PREDEFINED_BAND_ESSAYS['environment'];
  
  const rawModel = topicEntry.models[normBand] || topicEntry.models['7.5'];
  
  // Dynamic word count analysis
  const actualWordCount = countWords(rawModel.paragraphs);
  const isTask1 = (topicEntry.taskType === 'task1') || (activeTask === 'task1');

  const idealMin = isTask1 ? 165 : 260;
  const idealMax = isTask1 ? 185 : 285;
  const officialMin = isTask1 ? 150 : 250;

  let adherenceLabel = 'Đạt chuẩn vàng';
  let badgeColor = 'emerald';

  if (actualWordCount >= idealMin && actualWordCount <= idealMax) {
    adherenceLabel = isTask1 
      ? `${actualWordCount} từ • Chuẩn tuyệt đối Task 1 [${idealMin}-${idealMax} từ]`
      : `${actualWordCount} từ • Chuẩn tuyệt đối Task 2 [${idealMin}-${idealMax} từ]`;
    badgeColor = 'emerald';
  } else if (actualWordCount >= officialMin) {
    adherenceLabel = `${actualWordCount} từ • Đạt yêu cầu thi (>= ${officialMin} từ)`;
    badgeColor = 'blue';
  } else {
    adherenceLabel = `${actualWordCount} từ • Dưới số từ tối thiểu (< ${officialMin} từ)`;
    badgeColor = 'rose';
  }

  const fullEssayText = rawModel.paragraphs.map(p => p.text).join('\n\n');

  return {
    ...rawModel,
    topicId: resolvedId,
    topicTitle: topicEntry.title,
    taskType: topicEntry.taskType,
    chartType: topicEntry.chartType,
    prompt: topicEntry.prompt,
    actualWordCount,
    adherenceLabel,
    badgeColor,
    idealRange: isTask1 ? '165 – 185 từ (Task 1 chuẩn)' : '260 – 285 từ (Task 2 chuẩn)',
    fullEssayText
  };
}

/**
 * Retrieve all 3 calibrated bands (6.5, 7.5, 8.5) for a topic
 */
export function getAllBandModelEssays(topic, activeTask = 'task2') {
  return {
    '6.5': getBandModelEssay(topic, activeTask, '6.5'),
    '7.5': getBandModelEssay(topic, activeTask, '7.5'),
    '8.5': getBandModelEssay(topic, activeTask, '8.5')
  };
}
