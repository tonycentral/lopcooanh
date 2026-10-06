import topicsData from './topics.json';
import promptsData from './prompts.json';
import vocabulariesData from './vocabularies.json';

/**
 * Lấy toàn bộ danh sách chủ đề (Topics)
 */
export function getAllTopics() {
  return topicsData;
}

/**
 * Lấy toàn bộ ngân hàng đề thi (Prompts)
 */
export function getAllPrompts() {
  return promptsData;
}

/**
 * Lấy toàn bộ ngân hàng từ vựng (Vocabularies)
 */
export function getAllVocabularies() {
  return vocabulariesData;
}

/**
 * Lấy thống kê tổng quan Databank cho Admin Dashboard
 */
export function getDatabankStats() {
  const totalTopics = topicsData.length;
  const totalPrompts = promptsData.length;
  const task1Count = promptsData.filter(p => p.taskType === 'Task 1').length;
  const task2Count = promptsData.filter(p => p.taskType === 'Task 2').length;
  const totalVocabs = vocabulariesData.length;

  // Thống kê theo dạng câu hỏi
  const questionTypeStats = {};
  promptsData.forEach(p => {
    questionTypeStats[p.questionType] = (questionTypeStats[p.questionType] || 0) + 1;
  });

  // Thống kê theo band/độ khó
  const difficultyStats = {};
  promptsData.forEach(p => {
    difficultyStats[p.difficulty] = (difficultyStats[p.difficulty] || 0) + 1;
  });

  // Thống kê từ vựng theo band
  const vocabBandStats = {};
  vocabulariesData.forEach(v => {
    vocabBandStats[v.cefrBand] = (vocabBandStats[v.cefrBand] || 0) + 1;
  });

  return {
    totalTopics,
    totalPrompts,
    task1Count,
    task2Count,
    totalVocabs,
    questionTypeStats,
    difficultyStats,
    vocabBandStats
  };
}

/**
 * Xuất toàn bộ Databank ra file JSON để sao lưu dự phòng
 */
export function exportDatabankBackup() {
  const fullBackup = {
    exportDate: new Date().toISOString(),
    version: "1.0",
    topics: topicsData,
    prompts: promptsData,
    vocabularies: vocabulariesData
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `ielts_databank_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
