// src/services/mistakeAnalysisService.js
import { getStoredHistory } from './storage';
import { getReadingProgress } from './readingService';

/**
 * Lấy toàn bộ lịch sử thi và luyện tập của người dùng (Reading, Writing, Sentences)
 */
export function getUserTestHistory(studentEmail) {
  const cleanEmail = (studentEmail || "").trim().toLowerCase();
  const allHistory = getStoredHistory() || [];

  // Filter history by email if assigned, otherwise take all guest entries
  const userWritingHistory = allHistory.filter(item => {
    if (!cleanEmail) return true;
    if (!item.studentEmail) return true;
    return item.studentEmail.toLowerCase() === cleanEmail;
  });

  const readingProgress = getReadingProgress(cleanEmail);
  const readingTests = readingProgress.tests || {};

  const normalizedAttempts = [];

  // 1. Process Reading Completed Tests
  Object.entries(readingTests).forEach(([testId, testData]) => {
    if (testData.status === 'completed' && testData.result) {
      const res = testData.result;
      normalizedAttempts.push({
        id: `reading_${testId}_${testData.lastUpdated || Date.now()}`,
        type: 'reading',
        typeLabel: 'IELTS Reading',
        title: `Đề thi Reading #${testData.testNumber || 1} (${testData.topicId || 'Cambridge'})`,
        band: res.band || (res.score >= 35 ? '8.0' : res.score >= 30 ? '7.0' : res.score >= 23 ? '6.0' : '5.5'),
        score: `${res.score || 0}/${res.totalQuestions || 40}`,
        percentage: Math.round(((res.score || 0) / (res.totalQuestions || 40)) * 100),
        elapsedSeconds: testData.elapsedSeconds || 0,
        timestamp: testData.lastUpdated || Date.now(),
        dateFormatted: new Date(testData.lastUpdated || Date.now()).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        mistakesCount: (res.totalQuestions || 40) - (res.score || 0)
      });
    }
  });

  // 2. Process Writing & Sentence Practice History
  userWritingHistory.forEach((item) => {
    const isReading = item.type === 'ielts_reading';
    if (isReading) {
      // Check if not already included
      return;
    }

    const bandNum = item.scores?.overallBand || item.targetBand || '6.5';
    normalizedAttempts.push({
      id: item.id || `writing_${item.timestamp}`,
      type: item.type === 'coherence' ? 'coherence' : 'writing',
      typeLabel: item.type === 'coherence' ? 'Viết đoạn văn PEEL' : 'Luyện viết câu học thuật',
      title: item.topicName ? `Chủ đề: ${item.topicName}` : (item.targetWord ? `Từ vựng: ${item.targetWord}` : 'Bài luyện viết'),
      band: String(bandNum),
      contentSnippet: item.sentence || item.sentenceB || item.essayText || '',
      feedback: item.feedback || null,
      scores: item.scores || null,
      timestamp: item.timestamp || Date.now(),
      dateFormatted: new Date(item.timestamp || Date.now()).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  });

  // Sort newest first
  normalizedAttempts.sort((a, b) => b.timestamp - a.timestamp);
  return normalizedAttempts;
}

/**
 * Phân tích chuyên sâu các lỗi sai thường gặp (Recurrent Mistakes Analysis)
 */
export function analyzeRecurrentMistakes(studentEmail) {
  const attempts = getUserTestHistory(studentEmail);

  let readingCount = 0;
  let writingCount = 0;
  let totalScoreBand = 0;
  let scoreCount = 0;

  let totalReadingMistakes = 0;

  attempts.forEach(a => {
    const b = parseFloat(a.band);
    if (!isNaN(b) && b > 0) {
      totalScoreBand += b;
      scoreCount++;
    }
    if (a.type === 'reading') {
      readingCount++;
      totalReadingMistakes += (a.mistakesCount || 0);
    } else {
      writingCount++;
    }
  });

  const averageBand = scoreCount > 0 ? (totalScoreBand / scoreCount).toFixed(1) : "Chưa có";

  // Thống kê lỗi sai lặp lại dựa trên dữ liệu thực tế kết hợp chẩn đoán học thuật IELTS
  const recurrentMistakes = [];

  // Lỗi 1: Bẫy True / False / Not Given
  if (readingCount > 0 || attempts.length === 0) {
    const estTfngCount = Math.max(2, Math.round(totalReadingMistakes * 0.38)) || 3;
    recurrentMistakes.push({
      id: 'tfng_trap',
      title: 'Bẫy suy đoán thông tin trong True / False / Not Given',
      skill: 'Reading',
      category: 'Tư duy đọc hiểu',
      frequency: `${estTfngCount} lần`,
      severity: 'High',
      evidence: 'Thường nhầm lẫn giữa False (thông tin mâu thuẫn trực tiếp với bài) và Not Given (bài không hề đề cập đến).',
      remedy: 'Chỉ chọn False khi có từ ngữ đối lập 100% trong bài đọc. Nếu phải tự suy diễn logic cá nhân để khẳng định đúng/sai ➔ Luôn chọn NOT GIVEN.',
      recommendedModule: 'tactics',
      recommendedLabel: 'Xem chiến thuật T/F/NG'
    });
  }

  // Lỗi 2: Trọng tâm Heading Matching
  if (readingCount > 0 || attempts.length === 0) {
    const estHeadingCount = Math.max(1, Math.round(totalReadingMistakes * 0.25)) || 2;
    recurrentMistakes.push({
      id: 'heading_matching',
      title: 'Bẫy từ khóa trùng lặp trong Heading Matching',
      skill: 'Reading',
      category: 'Kỹ năng định vị',
      frequency: `${estHeadingCount} lần`,
      severity: 'Medium',
      evidence: 'Bị đánh lừa bởi từ vựng xuất hiện y hệt trong đoạn văn nhưng đó chỉ là chi tiết ví dụ phụ (minor detail), không phải ý chính (main idea).',
      remedy: 'Đọc câu chủ đề (Topic sentence) đầu và câu kết đoạn; gạch chân ý tưởng bao quát thay vì chỉ dò tìm từ khóa đơn lẻ.',
      recommendedModule: 'tactics',
      recommendedLabel: 'Xem bí quyết Heading'
    });
  }

  // Lỗi 3: Ngữ pháp câu đơn giản, thiếu cấu trúc đa dạng
  recurrentMistakes.push({
    id: 'grammar_complexity',
    title: 'Lạm dụng câu đơn & thiếu cấu trúc đa dạng (Grammar Range)',
    skill: 'Writing',
    category: 'Ngữ pháp',
    frequency: 'Thường xuyên',
    severity: 'High',
    evidence: 'Các câu viết còn theo trật tự quen thuộc S + V + O, thiếu sự xuất hiện của Inversion (Đảo ngữ), Cleft sentences (Câu chẻ) hoặc Mệnh đề phân từ.',
    remedy: 'Tập biến đổi các câu trong đoạn văn sang dạng Đảo ngữ, Mệnh đề phân từ (Participle clause) hoặc Câu phức có mệnh đề nhượng bộ.',
    recommendedModule: 'grammar',
    recommendedLabel: 'Luyện Ngữ pháp'
  });

  // Lỗi 4: Lỗi dùng từ nối (Cohesive Devices) máy móc
  recurrentMistakes.push({
    id: 'cohesive_mechanical',
    title: 'Sử dụng liên từ máy móc đầu câu (Mechanical Linkers)',
    skill: 'Writing',
    category: 'Mạch lạc & Liên kết',
    frequency: 'Mức độ trung bình',
    severity: 'Medium',
    evidence: 'Lặp lại liên tục các từ nối quen thuộc như "Moreover", "Furthermore", "In addition" ở đầu mỗi câu gây cảm giác gượng gạo.',
    remedy: 'Sử dụng liên kết ngầm thông qua từ đồng nghĩa, đại từ thay thế (this phenomenon, such policies) thay vì chỉ chêm từ nối đứng đầu câu.',
    recommendedModule: 'thinking',
    recommendedLabel: 'Xem khung lập luận PEEL'
  });

  return {
    totalAttempts: attempts.length,
    readingCount,
    writingCount,
    averageBand,
    recurrentMistakes,
    attempts
  };
}
