// src/features/farm/types/vocab.ts
// Vocabulary Fill-in-the-Blank Quiz interfaces for Farm Sanctuary

export interface VocabQuiz {
  id: string;
  sentence: string;      // Câu có chứa chỗ trống, ví dụ: "The farmer used a _____ to dig up the rocky soil."
  targetWord: string;    // Từ chính xác (e.g. "pickaxe")
  options: string[];     // 4 lựa chọn trắc nghiệm (1 đúng + 3 từ nhiễu)
  definition: string;    // Giải nghĩa ngắn bằng tiếng Anh/Việt
  partOfSpeech?: string; // Từ loại: Danh từ (Noun), Động từ (Verb), Tính từ (Adj)...
  contextUsage?: string; // Ngữ cảnh ứng dụng thực tế
  xpReward: number;      // Mặc định +25 XP
  energyReward: number;  // Mặc định +35 Energy
}
