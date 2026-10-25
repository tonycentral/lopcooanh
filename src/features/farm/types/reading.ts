// src/features/farm/types/reading.ts
// Reading Comprehension Challenge & BBQ Stand Types

export interface ReadingChallenge {
  id: string;
  title: string;
  passage: string; // Đoạn văn ngắn 3-5 câu (chủ đề ẩm thực, văn hóa BBQ, nông sản, thiên nhiên)
  question: string;
  options: [string, string, string, string]; // 4 đáp án lựa chọn
  correctIndex: number;
  explanation: string; // Giải thích ngữ pháp/từ vựng ngắn gọn
  xpReward: number; // Mặc định +40 XP
  energyReward: number; // Mặc định +50 Energy
}

export interface BBQFoodItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
  requiredIngredients?: { id: string; name: string; count: number }[];
  costGold?: number;
}
