// Harvest Town IELTS State & Economy Engine for MochiFarm
// Based on "Farming Sim × English Acquisition: Core Mechanics"
// 100% retro 16-bit RPG architecture with authentic Learning Science Alignment:
// 1. Study is the energy source (Daily Almanac generates Focus Points)
// 2. Words as Seeds (SRS Vocabulary Engine with 6 growth stages & Heirlooms)
// 3. Wilting, Soil Quality & Pests (Error Tracking & targeted remediation)
// 4. Animals as Grammar (Livestock pattern acquisition: SVO Chickens, Tense Cows, Article Sheep, Conjunction Bees)
// 5. The Kitchen (Collocations & Chunks recipe engine)
// 6. Tiered Progression & Harvest Festival assessments
// 7. Human Streak safeguards (Scarecrow freeze, Rain Days, Comeback Quests)

import { supabase } from './supabaseClient';

const HARVEST_STORAGE_KEY = 'mochifarm_harvest_state_v3';
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export const CROPS_CONFIG = {
  wheat: {
    id: 'wheat',
    name: 'Lúa Mì Từ Vựng',
    englishName: 'Vocabulary Wheat',
    icon: '🌾',
    seedPrice: 10,
    baseSellPrice: 35,
    growthTimeStages: 5,
    skill: 'vocab',
    wordCategory: 'Academic Essentials',
    description: 'Lớn lên qua 5 giai đoạn giãn cách SRS từ Hạt mầm đến Bông lúa Hoàng kim.'
  },
  apple: {
    id: 'apple',
    name: 'Táo Cú Pháp Ngữ Pháp',
    englishName: 'Grammar Apple',
    icon: '🍎',
    seedPrice: 25,
    baseSellPrice: 80,
    growthTimeStages: 5,
    skill: 'grammar',
    wordCategory: 'Complex Structures',
    description: 'Chín rộ khi hoàn thành bài tập sửa câu và cấu trúc phức Band 7+.'
  },
  tomato: {
    id: 'tomato',
    name: 'Cà Chua Bi Task 1',
    englishName: 'Task 1 Tomatoes',
    icon: '🍅',
    seedPrice: 40,
    baseSellPrice: 130,
    growthTimeStages: 5,
    skill: 'task1',
    wordCategory: 'Trends & Data Verbs',
    description: 'Lớn lên từ các từ vựng miêu tả số liệu biểu đồ Line, Bar, Pie, Map.'
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Bí Ngô Hoàng Kim Task 2',
    englishName: 'Task 2 Golden Pumpkin',
    icon: '🎃',
    seedPrice: 80,
    baseSellPrice: 280,
    growthTimeStages: 5,
    skill: 'task2',
    wordCategory: 'Academic Discourse & Essay',
    description: 'Vua của các loại nông sản — đơm hoa kết trái khi lập luận mạch lạc.'
  },
  strawberry: {
    id: 'strawberry',
    name: 'Dâu Tây Nghe & Phát Âm',
    englishName: 'Phonics Strawberry',
    icon: '🍓',
    seedPrice: 30,
    baseSellPrice: 95,
    growthTimeStages: 5,
    skill: 'pronunciation',
    wordCategory: 'Phonology & Connected Speech',
    description: 'Quả dâu ngọt ngào nuôi dưỡng khả năng bắt âm IPA và nối âm chuẩn.'
  },
  sunflower: {
    id: 'sunflower',
    name: 'Hướng Dương Tư Duy Phản Biện',
    englishName: 'Critical Sunflower',
    icon: '🌻',
    seedPrice: 35,
    baseSellPrice: 110,
    growthTimeStages: 5,
    skill: 'reading',
    wordCategory: 'Critical Analysis',
    description: 'Bông hoa tri thức hướng về ánh mặt trời khi giải mã bài đọc IELTS.'
  }
};

export const SRS_STAGES = [
  { stage: 0, key: 'seed', name: 'Hạt Mầm', icon: '🌱', intervalDays: 0, desc: 'Lần đầu tiếp xúc trong Seed Round' },
  { stage: 1, key: 'sprout', name: 'Nảy Mầm', icon: '🌿', intervalDays: 1, desc: 'Vượt qua lần ôn tập đầu tiên (~1 ngày)' },
  { stage: 2, key: 'seedling', name: 'Cây Con', icon: '🪴', intervalDays: 3, desc: 'Gợi nhớ thành công lần 2 (~3 ngày)' },
  { stage: 3, key: 'growing', name: 'Đang Lớn', icon: '🌳', intervalDays: 7, desc: 'Gợi nhớ vững vàng lần 3 (~7 ngày)' },
  { stage: 4, key: 'flowering', name: 'Ra Hoa', icon: '🌸', intervalDays: 14, desc: 'Ứng dụng vào câu viết Task 1 / Task 2 (~14-21 ngày)' },
  { stage: 5, key: 'harvest_ready', name: 'Chín Rộ', icon: '✨', intervalDays: 30, desc: 'Gợi nhớ sau khoảng cách dài (>30 ngày)' },
  { stage: 6, key: 'heirloom', name: 'Bảo Vật Gia Truyền', icon: '👑', intervalDays: 60, desc: 'Đã làm chủ hoàn toàn! Lưu vào Hầm Hạt Giống sinh lãi mãi mãi.' }
];

export const QUALITY_TIERS = {
  normal: { name: 'Thường', stars: '★', multiplier: 1.0, color: 'text-amber-700' },
  silver: { name: 'Bạc', stars: '★★', multiplier: 1.25, color: 'text-slate-400' },
  gold: { name: 'Vàng', stars: '★★★', multiplier: 1.5, color: 'text-amber-400' },
  iridium: { name: 'Iridium Thần Thoại', stars: '★★★★', multiplier: 2.0, color: 'text-purple-400' }
};

export const FARM_TIERS = [
  { tier: 1, name: 'Backyard Plot (Mảnh Vườn Sân Sau)', cefr: 'A1 - A2', bandTarget: 'Band 4.5 - 5.5', maxPlots: 12, unlocks: '12 ô đất, Đàn Gà SVO, Nông cụ cơ bản' },
  { tier: 2, name: 'Homestead (Gia Trang Học Thuật)', cefr: 'B1', bandTarget: 'Band 6.0 - 6.5', maxPlots: 24, unlocks: '24 ô đất, Chuồng Bò Thời Gian, Nhà Bếp Collocations' },
  { tier: 3, name: 'Village Farm (Điền Trang Thị Trấn)', cefr: 'B2', bandTarget: 'Band 7.0 - 7.5', maxPlots: 36, unlocks: 'Khu Vườn Cừu Mạo Từ, Đàn Ong Liên Từ, Quầy Chợ' },
  { tier: 4, name: 'Estate (Lãnh Địa Học Giả)', cefr: 'C1 - C2', bandTarget: 'Band 8.0+', maxPlots: 48, unlocks: 'Ngựa Cấu Trúc Phức, Nhà Kính Nghiên Cứu, Hợp Đồng Xuất Khẩu' }
];

export const FARM_LEVELS_CONFIG = [
  { level: 1, title: 'Nông Dân Tập Sự', minXp: 0, maxXp: 250, badge: '🌱' },
  { level: 2, title: 'Thợ Vườn Chăm Chỉ', minXp: 250, maxXp: 700, badge: '🌾' },
  { level: 3, title: 'Chủ Điền Trang Band 6.5', minXp: 700, maxXp: 1600, badge: '🏡' },
  { level: 4, title: 'Đại Điền Chủ Band 7.5', minXp: 1600, maxXp: 3200, badge: '🚜' },
  { level: 5, title: 'Huyền Thoại MochiFarm Band 8.0+', minXp: 3200, maxXp: 99999, badge: '👑' }
];

export const LIVESTOCK_CONFIG = {
  chickens: {
    id: 'chickens',
    name: 'Đàn Gà SVO',
    icon: '🐔',
    level: 1,
    domain: 'Mô hình câu cơ bản (SVO & Câu hỏi)',
    careAction: 'Xếp thẻ từ tạo câu hoàn chỉnh để nhặt trứng vàng',
    productName: 'Trứng Ngữ Pháp Vàng',
    productPrice: 45
  },
  cows: {
    id: 'cows',
    name: 'Bò Sữa Dòng Thời Gian',
    icon: '🐄',
    level: 1,
    domain: 'Thì động từ & Trục thời gian (Tenses)',
    careAction: 'Vắt sữa = Sắp xếp sự kiện vào đúng thì quá khứ/hiện tại hoàn thành',
    productName: 'Sữa Bò Dòng Thời Gian',
    productPrice: 75
  },
  sheep: {
    id: 'sheep',
    name: 'Cừu Mạo Từ a/an/the',
    icon: '🐑',
    level: 1,
    domain: 'Mạo từ & Từ hạn định (Articles & Determiners)',
    careAction: 'Xén lông = Phân loại danh từ vào chuồng a, an, the hoặc zero article',
    productName: 'Len Mạo Từ Thượng Hạng',
    productPrice: 95
  },
  bees: {
    id: 'bees',
    name: 'Ong Mật Liên Từ',
    icon: '🐝',
    level: 1,
    domain: 'Liên từ & Từ nối Cohesion (Although, Whereas)',
    careAction: 'Nối 2 vế câu tương phản / nguyên nhân để tạo mật ong thơm lừng',
    productName: 'Hũ Mật Ong Liên Kết C1',
    productPrice: 120
  },
  horses: {
    id: 'horses',
    name: 'Ngựa Luyện Cấu Trúc Phức',
    icon: '🐎',
    level: 1,
    domain: 'Câu điều kiện, Bị động & Mệnh đề quan hệ',
    careAction: 'Huấn luyện = Viết lại câu nâng Band ngữ pháp 6.0 lên 8.0',
    productName: 'Móng Ngựa Học Giả',
    productPrice: 180
  }
};

export const KITCHEN_RECIPES = [
  {
    id: 'rec_profound_impact',
    name: 'Món Hầm Luận Điểm Sâu Sắc',
    english: 'Profound Impact Stew',
    pair: ['profound', 'impact'],
    icon: '🍲',
    fpRestore: 40,
    sellPrice: 180,
    quality: 'gold',
    desc: 'Collocation Band 8.0: profound (tính từ) kết hợp chuẩn mực với impact (danh từ).'
  },
  {
    id: 'rec_heavily_rely',
    name: 'Súp Dựa Dẫm Vững Chắc',
    english: 'Heavily Rely Broth',
    pair: ['heavily', 'rely'],
    icon: '🥣',
    fpRestore: 35,
    sellPrice: 150,
    quality: 'silver',
    desc: 'Collocation Band 7.5: heavily (phó từ) bổ nghĩa tự nhiên cho động từ rely (on).'
  },
  {
    id: 'rec_spark_controversy',
    name: 'Gỏi Tranh Luận Nảy Lửa',
    english: 'Spark Controversy Salad',
    pair: ['spark', 'controversy'],
    icon: '🥗',
    fpRestore: 35,
    sellPrice: 160,
    quality: 'silver',
    desc: 'Collocation Band 8.0: spark + controversy thay thế xuất sắc cho cause debate.'
  },
  {
    id: 'rec_sharp_upsurge',
    name: 'Nước Ép Tăng Trưởng Đột Biến',
    english: 'Sharp Upsurge Smoothie',
    pair: ['sharp', 'upsurge'],
    icon: '🥤',
    fpRestore: 30,
    sellPrice: 140,
    quality: 'normal',
    desc: 'Collocation Task 1: sharp upsurge mô tả cú nhảy vọt thẳng đứng trên biểu đồ.'
  },
  {
    id: 'rec_vital_role',
    name: 'Bánh Nướng Vai Trò Then Chốt',
    english: 'Play a Vital Role Tart',
    pair: ['vital', 'role'],
    icon: '🥧',
    fpRestore: 45,
    sellPrice: 200,
    quality: 'gold',
    desc: 'Collocation Band 7.5+: play a vital role in something.'
  }
];

export const GENERAL_STORE_CATALOG = [
  // Seeds
  { id: 'seed_wheat', type: 'seed', cropKey: 'wheat', name: 'Gói Hạt Giống Lúa Mì', price: 10, icon: '🌱' },
  { id: 'seed_apple', type: 'seed', cropKey: 'apple', name: 'Cây Giống Táo Cú Pháp', price: 25, icon: '🌳' },
  { id: 'seed_tomato', type: 'seed', cropKey: 'tomato', name: 'Gói Hạt Cà Chua Bi Task 1', price: 40, icon: '🍅' },
  { id: 'seed_pumpkin', type: 'seed', cropKey: 'pumpkin', name: 'Hạt Giống Bí Ngô Task 2', price: 80, icon: '🎃' },
  { id: 'seed_strawberry', type: 'seed', cropKey: 'strawberry', name: 'Cây Giống Dâu Tây Nghe', price: 30, icon: '🍓' },
  { id: 'seed_sunflower', type: 'seed', cropKey: 'sunflower', name: 'Hạt Hoa Hướng Dương', price: 35, icon: '🌻' },
  // Tools & Decor
  { id: 'tool_can_gold', type: 'tool', name: 'Bình Tưới Nước Hoàng Kim', price: 200, icon: '✨', description: 'Tưới được 3 ô đất cùng lúc khi hoàn thành 1 bài luyện.' },
  { id: 'decor_scarecrow', type: 'decor', name: 'Bù Nhìn Rơm Oxford (Bảo Vệ Chuỗi)', price: 150, icon: '🧙‍♂️', description: 'Đội mũ cử nhân, tự động bảo vệ chuỗi học tập nếu lỡ quên 1 ngày.' },
  { id: 'decor_cat_mochi', type: 'decor', name: 'Mèo Mochi Giữ Nông Trại', price: 300, icon: '🐱', description: 'Chú mèo siêu cấp đáng yêu giúp nhặt thêm 15 Gold mỗi sáng.' },
  { id: 'booster_speed_gro', type: 'booster', name: 'Phân Bón Siêu Tốc (Speed-Gro)', price: 120, icon: '🧪', description: 'Cây lớn nhanh gấp đôi trong 24 giờ.' }
];

export function getDefaultHarvestTownState() {
  return {
    farmerName: 'Học Viên Mochi',
    bandTarget: '7.0',
    level: 1,
    xp: 80,
    gold: 180, // 180 G starting capital
    gems: 3,   // 3 Mochi Gems
    focusPoints: 80, // FP: The core energy resource (0-100)
    maxFocusPoints: 100,
    stamina: 95,
    maxStamina: 100,
    season: 'spring', // spring, summer, fall, winter
    day: 14,
    year: 1,
    weather: 'sunny', // sunny, rainy, breeze
    streak: 3,
    longestStreak: 12,
    scarecrows: 1, // Streak Freezes stored (cap 2)
    rainDaysAvailable: 1, // Weekly rest day
    farmTier: 1, // 1: Backyard Plot (12 plots)
    lastActiveTimestamp: Date.now(),
    hasWeeds: false,
    doubleXpUntil: 0,
    bloomBonusActive: false,
    activeTool: 'hoe', // hoe, water, scythe, almanac, backpack, livestock, kitchen
    
    // 1. Morning Almanac (The Study Gate - Daily Study Session)
    almanac: {
      waterRoundDone: false,     // SRS Review (Flashcards) -> Minimum Viable Day (50% FP + keeps streak)
      sunlightRoundDone: false,  // Listening clip (2-3 min)
      seedRoundDone: false,      // 3-5 new vocab words
      fertilizerRoundDone: false,// Production writing / speaking
      bloomBonusMultiplier: 1.5,
      completedToday: false,
      lastAlmanacDay: 13
    },

    // 2. 12 Interactive Farm Plots (Words as Seeds SRS Grid)
    plots: [
      {
        id: 1,
        state: 'ripe',
        cropType: 'wheat',
        word: 'Ubiquitous',
        meaning: 'Có mặt ở khắp mọi nơi (Phổ biến)',
        ipa: '/juːˈbɪk.wə.təs/',
        srsStage: 5, // Harvest ready
        healthState: 'healthy',
        pest: null,
        soilQuality: 92,
        progress: 100,
        quality: 'silver',
        wateredToday: true
      },
      {
        id: 2,
        state: 'growing',
        cropType: 'apple',
        word: 'Substantiate',
        meaning: 'Chứng minh, củng cố luận điểm bằng bằng chứng',
        ipa: '/səbˈstæn.ʃi.eɪt/',
        srsStage: 3, // Growing
        healthState: 'healthy',
        pest: null,
        soilQuality: 88,
        progress: 68,
        quality: 'normal',
        wateredToday: true
      },
      {
        id: 3,
        state: 'growing',
        cropType: 'tomato',
        word: 'Plummet',
        meaning: 'Lao dốc, sụt giảm mạnh mẽ',
        ipa: '/ˈplʌm.ɪt/',
        srsStage: 2, // Seedling
        healthState: 'thirsty', // Drooping
        pest: { type: 'aphids', name: 'Rệp Mạo Từ (Article Aphids)', errorPattern: 'Lỗi thiếu mạo từ a/an/the' },
        soilQuality: 74,
        progress: 40,
        quality: 'gold',
        wateredToday: false
      },
      {
        id: 4,
        state: 'ripe',
        cropType: 'strawberry',
        word: 'Intonation',
        meaning: 'Ngữ điệu câu nói',
        ipa: '/ˌɪn.təˈneɪ.ʃən/',
        srsStage: 5,
        healthState: 'healthy',
        pest: null,
        soilQuality: 95,
        progress: 100,
        quality: 'gold',
        wateredToday: true
      },
      {
        id: 5,
        state: 'growing',
        cropType: 'pumpkin',
        word: 'Disproportionate',
        meaning: 'Không cân xứng, chênh lệch quá mức',
        ipa: '/ˌdɪs.prəˈpɔː.ʃən.ət/',
        srsStage: 1, // Sprout
        healthState: 'healthy',
        pest: null,
        soilQuality: 85,
        progress: 25,
        quality: 'iridium',
        wateredToday: false
      },
      {
        id: 6,
        state: 'empty_tilled',
        cropType: null,
        word: null,
        meaning: null,
        srsStage: 0,
        healthState: 'healthy',
        pest: null,
        soilQuality: 80,
        progress: 0,
        quality: 'normal',
        wateredToday: false
      },
      {
        id: 7,
        state: 'growing',
        cropType: 'sunflower',
        word: 'Paradigm',
        meaning: 'Mô hình mẫu, hệ tư tưởng chuẩn',
        ipa: '/ˈpær.ə.daɪm/',
        srsStage: 4, // Flowering
        healthState: 'healthy',
        pest: null,
        soilQuality: 90,
        progress: 85,
        quality: 'normal',
        wateredToday: true
      },
      {
        id: 8,
        state: 'empty_tilled',
        cropType: null,
        word: null,
        srsStage: 0,
        healthState: 'healthy',
        pest: null,
        soilQuality: 78,
        progress: 0,
        quality: 'normal',
        wateredToday: false
      },
      {
        id: 9,
        state: 'empty_tilled',
        cropType: null,
        word: null,
        srsStage: 0,
        healthState: 'healthy',
        pest: null,
        soilQuality: 82,
        progress: 0,
        quality: 'normal',
        wateredToday: false
      },
      {
        id: 10,
        state: 'empty_tilled',
        cropType: null,
        word: null,
        srsStage: 0,
        healthState: 'healthy',
        pest: null,
        soilQuality: 80,
        progress: 0,
        quality: 'normal',
        wateredToday: false
      },
      {
        id: 11,
        state: 'empty_tilled',
        cropType: null,
        word: null,
        srsStage: 0,
        healthState: 'healthy',
        pest: null,
        soilQuality: 85,
        progress: 0,
        quality: 'normal',
        wateredToday: false
      },
      {
        id: 12,
        state: 'empty_tilled',
        cropType: null,
        word: null,
        srsStage: 0,
        healthState: 'healthy',
        pest: null,
        soilQuality: 80,
        progress: 0,
        quality: 'normal',
        wateredToday: false
      }
    ],

    // 3. Permanent Seed Vault (Heirloom Mastered Words producing passive daily coins!)
    seedVault: [
      {
        id: 'heirloom_1',
        word: 'Comprehensive',
        meaning: 'Toàn diện, bao quát mọi mặt',
        dailyCoins: 12,
        masteredDate: 'Mùa Xuân, Ngày 8'
      },
      {
        id: 'heirloom_2',
        word: 'Mitigate',
        meaning: 'Làm giảm nhẹ, xoa dịu tác hại',
        dailyCoins: 15,
        masteredDate: 'Mùa Xuân, Ngày 11'
      }
    ],

    // 4. Animals as Grammar (Livestock System)
    livestock: {
      chickens: { happiness: 85, ready: true, lastCareDay: 13 },
      cows: { happiness: 75, ready: true, lastCareDay: 13 },
      sheep: { happiness: 90, ready: true, lastCareDay: 13 },
      bees: { happiness: 80, ready: true, lastCareDay: 14 },
      horses: { happiness: 65, ready: false, lastCareDay: 12 }
    },

    // 5. Kitchen Inventory (Words for Collocations)
    kitchenPantry: [
      { word: 'profound', category: 'adj', count: 3 },
      { word: 'impact', category: 'noun', count: 2 },
      { word: 'heavily', category: 'adv', count: 4 },
      { word: 'rely', category: 'verb', count: 3 },
      { word: 'spark', category: 'verb', count: 2 },
      { word: 'controversy', category: 'noun', count: 2 },
      { word: 'vital', category: 'adj', count: 3 },
      { word: 'role', category: 'noun', count: 3 },
      { word: 'sharp', category: 'adj', count: 4 },
      { word: 'upsurge', category: 'noun', count: 2 }
    ],

    // Backpack Inventory
    inventory: [
      { id: 'inv_1', key: 'wheat', name: 'Lúa Mì Từ Vựng (Ubiquitous)', icon: '🌾', qty: 12, quality: 'silver', price: 44 },
      { id: 'inv_2', key: 'strawberry', name: 'Dâu Tây Nghe (Intonation)', icon: '🍓', qty: 6, quality: 'gold', price: 142 },
      { id: 'inv_3', key: 'egg', name: 'Trứng Ngữ Pháp Vàng', icon: '🥚', qty: 4, quality: 'normal', price: 45 },
      { id: 'inv_4', key: 'seed_wheat', name: 'Hạt Giống Lúa Mì', icon: '🌱', qty: 4, isSeed: true, cropKey: 'wheat' },
      { id: 'inv_5', key: 'seed_pumpkin', name: 'Hạt Bí Ngô Task 2', icon: '🎃', qty: 2, isSeed: true, cropKey: 'pumpkin' }
    ],

    // Shipping Bin (Awaiting evening / manual settlement)
    shippingBin: [],

    // Historical Shipping Receipts
    shippingLedger: [
      {
        dateStr: 'Mùa Xuân, Ngày 13',
        totalGold: 340,
        itemsCount: 5
      }
    ],

    // Town Bulletin Board: 3 Daily Quests
    dailyCommissions: [
      {
        id: 'comm_1',
        title: 'Cung Cấp 10 Từ Vựng Chủ Đề Môi Trường (Environment)',
        skill: 'vocab',
        sender: 'Cô Oanh',
        target: 10,
        current: 6,
        rewardGold: 120,
        rewardXp: 50,
        rewardHearts: 25,
        done: false,
        claimed: false
      },
      {
        id: 'comm_2',
        title: 'Hoàn Thành 1 Đoạn Thân Bài Body Task 2 Đạt Điểm Coherence Cao',
        skill: 'task2',
        sender: 'Hội Đồng Giám Khảo Thị Trấn',
        target: 1,
        current: 0,
        rewardGold: 280,
        rewardXp: 120,
        rewardGems: 1,
        rewardHearts: 45,
        done: false,
        claimed: false
      },
      {
        id: 'comm_3',
        title: 'Luyện 5 Câu Ngữ Pháp Không Lỗi Thì Động Từ & Mệnh Đề Quan Hệ',
        skill: 'grammar',
        sender: 'Thư Ký MochiTown',
        target: 5,
        current: 3,
        rewardGold: 140,
        rewardXp: 60,
        rewardHearts: 30,
        done: false,
        claimed: false
      }
    ],

    // Cô Oanh NPC Relationship System
    coOanhFriendship: {
      hearts: 2, // 0 to 5
      points: 450, // 200 pts per heart
      talkedToday: false,
      giftedToday: false,
      unlockedPerks: [
        'Bí Kíp 5 Mở Bài Task 1 "Ăn Điểm Liền" của Cô Oanh (Band 7.5+)'
      ],
      currentDialogue: 'Chào em! Nông trại Mochi hôm nay tốt tươi quá. Cứ chăm chỉ hoàn thành Morning Almanac mỗi ngày, tiếng Anh của em sẽ đơm hoa kết trái như cánh đồng lúa mì vàng óng này!'
    },

    ownedDecor: ['scarecrow_oxford']
  };
}

// Lấy Farm State
export function getHarvestTownState(email = null) {
  const key = email ? `${HARVEST_STORAGE_KEY}_${email}` : HARVEST_STORAGE_KEY;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = getDefaultHarvestTownState();
      saveHarvestTownState(initial, email);
      return initial;
    }
    const state = JSON.parse(raw);
    
    // Check Inactivity (>3 days) => Weeds grow & crops wilt (never deletes progress!)
    const now = Date.now();
    if (state.lastActiveTimestamp && (now - state.lastActiveTimestamp > THREE_DAYS_MS)) {
      state.hasWeeds = true;
      state.plots = state.plots.map((p, idx) => {
        if (p.state === 'growing') {
          return { ...p, healthState: 'thirsty' };
        }
        if (p.state === 'empty_tilled' && idx % 3 === 0) {
          return { ...p, state: 'weeds' };
        }
        return p;
      });
    }

    return state;
  } catch (e) {
    console.error('Error reading harvest town state:', e);
    return getDefaultHarvestTownState();
  }
}

// Lưu Farm State
export function saveHarvestTownState(state, email = null) {
  const key = email ? `${HARVEST_STORAGE_KEY}_${email}` : HARVEST_STORAGE_KEY;
  try {
    state.lastActiveTimestamp = Date.now();
    localStorage.setItem(key, JSON.stringify(state));

    if (email) {
      syncToSupabase(email, state);
    }
  } catch (e) {
    console.error('Error saving harvest town state:', e);
  }
}

async function syncToSupabase(email, state) {
  try {
    if (!supabase) return;
    await supabase
      .from('user_profiles')
      .update({
        farm_state: state,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);
  } catch {
    // Non-blocking
  }
}

// =========================================================================
// MECHANIC 1: DAILY ALMANAC (THE STUDY GATE)
// =========================================================================

// Hoàn thành vòng trong Morning Almanac
export function completeAlmanacRound(roundKey, performanceScore = 80, email = null) {
  const state = getHarvestTownState(email);
  if (!state.almanac) {
    state.almanac = getDefaultHarvestTownState().almanac;
  }

  let fpAwarded = 25;
  let message = '';

  if (roundKey === 'water') {
    state.almanac.waterRoundDone = true;
    fpAwarded = 50; // Minimum viable day gives 50% FP!
    message = 'Hoàn thành Water Round! Đạt mức học tập tối thiểu trong ngày, bảo vệ chuỗi Streak thành công!';
  } else if (roundKey === 'sunlight') {
    state.almanac.sunlightRoundDone = true;
    fpAwarded = 20;
    message = 'Hoàn thành Sunlight Round (Luyện nghe)!';
  } else if (roundKey === 'seed') {
    state.almanac.seedRoundDone = true;
    fpAwarded = 20;
    message = 'Hoàn thành Seed Round (Nạp 3-5 từ vựng mới)!';
  } else if (roundKey === 'fertilizer') {
    state.almanac.fertilizerRoundDone = true;
    fpAwarded = 25;
    message = 'Hoàn thành Fertilizer Round (Ứng dụng viết câu)!';
  }

  // Focus Points calculation
  state.focusPoints = Math.min(state.maxFocusPoints, state.focusPoints + fpAwarded);
  state.stamina = Math.min(state.maxStamina, state.stamina + 25);
  state.xp += Math.round(performanceScore * 0.8);

  // Check if all 4 rounds are completed => BLOOM BONUS!
  const isAllDone = 
    state.almanac.waterRoundDone && 
    state.almanac.sunlightRoundDone && 
    state.almanac.seedRoundDone && 
    state.almanac.fertilizerRoundDone;

  let bloomBonusGranted = false;
  if (isAllDone && !state.almanac.completedToday) {
    state.almanac.completedToday = true;
    state.bloomBonusActive = true;
    state.focusPoints = state.maxFocusPoints; // 100% FP
    state.gold += 100; // Bonus gold
    state.gems += 1;
    bloomBonusGranted = true;
    message = '🌟 XUẤT SẮC! Hoàn thành trọn vẹn 4 Vòng Morning Almanac! Kích hoạt BLOOM BONUS: 100% FP, +100 Gold và x1.5 giá trị nông sản hôm nay!';
  }

  saveHarvestTownState(state, email);
  return {
    success: true,
    state,
    fpAwarded,
    bloomBonusGranted,
    message
  };
}

// =========================================================================
// MECHANIC 2: WORDS AS SEEDS (SRS VOCABULARY ENGINE)
// =========================================================================

// Gieo hạt (Plant Seed with real Vocab word)
export function plantSeed(plotId, cropKey, vocabObj = null, email = null) {
  const state = getHarvestTownState(email);
  const plotIndex = state.plots.findIndex(p => p.id === plotId);
  if (plotIndex === -1) return { success: false, message: 'Không tìm thấy ô đất!' };

  const plot = state.plots[plotIndex];
  if (plot.state !== 'empty_tilled') {
    return { success: false, message: 'Ô đất này đang có cây trồng hoặc cỏ!' };
  }

  // FP check: Planting costs 5 FP
  if (state.focusPoints < 5) {
    return { success: false, message: 'Bạn không đủ Điểm Tập Trung (Cần 5 FP). Hãy mở Cuốn Niên Giám (Almanac) ôn bài để hồi phục FP nhé!' };
  }

  // Deduct seed or buy with gold
  const seedItemIndex = state.inventory.findIndex(item => item.isSeed && item.cropKey === cropKey && item.qty > 0);
  if (seedItemIndex !== -1) {
    state.inventory[seedItemIndex].qty -= 1;
    if (state.inventory[seedItemIndex].qty <= 0) {
      state.inventory.splice(seedItemIndex, 1);
    }
  } else {
    const cropConf = CROPS_CONFIG[cropKey] || CROPS_CONFIG.wheat;
    if (state.gold < cropConf.seedPrice) {
      return { success: false, message: `Bạn không đủ Gold để mua hạt giống ${cropConf.name} (${cropConf.seedPrice} G)!` };
    }
    state.gold -= cropConf.seedPrice;
  }

  state.focusPoints = Math.max(0, state.focusPoints - 5);
  state.stamina = Math.max(0, state.stamina - 2);

  // Set Vocab info
  const word = vocabObj?.word || 'Articulate';
  const meaning = vocabObj?.meaning || 'Diễn đạt rành mạch, trôi chảy';
  const ipa = vocabObj?.ipa || '/ɑːˈtɪk.jə.lət/';

  state.plots[plotIndex] = {
    ...plot,
    state: 'growing',
    cropType: cropKey,
    word: word,
    meaning: meaning,
    ipa: ipa,
    srsStage: 0, // Seed
    healthState: 'healthy',
    pest: null,
    progress: 10,
    quality: 'normal',
    wateredToday: true
  };

  saveHarvestTownState(state, email);
  return { success: true, state, plot: state.plots[plotIndex] };
}

// Thu hoạch cây chín (Harvest Crop -> Add to backpack or Heirloom Vault)
export function harvestCrop(plotId, email = null) {
  const state = getHarvestTownState(email);
  const plotIndex = state.plots.findIndex(p => p.id === plotId);
  if (plotIndex === -1) return { success: false, message: 'Không tìm thấy ô đất!' };

  const plot = state.plots[plotIndex];
  if (plot.state !== 'ripe') {
    return { success: false, message: 'Cây chưa chín, hãy hoàn thành bài ôn tập để chăm bón thêm!' };
  }

  const crop = CROPS_CONFIG[plot.cropType] || CROPS_CONFIG.wheat;
  const quality = plot.quality || 'normal';
  const tier = QUALITY_TIERS[quality] || QUALITY_TIERS.normal;
  const bloomMultiplier = state.bloomBonusActive ? 1.5 : 1.0;

  const basePrice = crop.baseSellPrice;
  const finalPrice = Math.round(basePrice * tier.multiplier * bloomMultiplier);
  const xpGain = Math.round(45 * tier.multiplier * (state.doubleXpUntil > Date.now() ? 2 : 1));

  // Check if plant reaches HEIRLOOM (Mastered!)
  let isHeirloomMastered = false;
  if (plot.srsStage >= 5) {
    isHeirloomMastered = true;
    if (!state.seedVault) state.seedVault = [];
    state.seedVault.push({
      id: `heirloom_${Date.now()}`,
      word: plot.word,
      meaning: plot.meaning,
      dailyCoins: Math.round(15 * tier.multiplier),
      masteredDate: `Mùa ${state.season === 'spring' ? 'Xuân' : 'Hạ'}, Ngày ${state.day}`
    });
  }

  // Add harvested crop to inventory
  const existingInv = state.inventory.find(i => i.key === crop.id && i.quality === quality && !i.isSeed);
  if (existingInv) {
    existingInv.qty += 1;
  } else {
    state.inventory.push({
      id: `inv_${Date.now()}_${Math.random()}`,
      key: crop.id,
      name: `${crop.name} (${plot.word || 'IELTS'})`,
      icon: crop.icon,
      qty: 1,
      quality: quality,
      price: finalPrice
    });
  }

  // If word has collocation components, add to Kitchen pantry!
  if (plot.word && state.kitchenPantry) {
    const existingPantry = state.kitchenPantry.find(p => p.word.toLowerCase() === plot.word.toLowerCase());
    if (existingPantry) {
      existingPantry.count += 1;
    } else {
      state.kitchenPantry.push({
        word: plot.word.toLowerCase(),
        category: 'academic',
        count: 1
      });
    }
  }

  state.xp += xpGain;
  checkLevelUp(state);

  // Reset plot to empty_tilled
  state.plots[plotIndex] = {
    ...plot,
    state: 'empty_tilled',
    cropType: null,
    word: null,
    meaning: null,
    srsStage: 0,
    healthState: 'healthy',
    pest: null,
    progress: 0,
    quality: 'normal',
    wateredToday: false
  };

  saveHarvestTownState(state, email);
  return {
    success: true,
    state,
    crop,
    quality,
    xpGain,
    itemPrice: finalPrice,
    isHeirloomMastered
  };
}

// Diệt sâu bọ hại cây (Defeat Pest through targeted challenge)
export function defeatPlotPest(plotId, email = null) {
  const state = getHarvestTownState(email);
  const plot = state.plots.find(p => p.id === plotId);
  if (!plot || !plot.pest) return { success: false, message: 'Ô đất này không có sâu bệnh!' };

  plot.pest = null;
  plot.healthState = 'healthy';
  plot.soilQuality = Math.min(100, (plot.soilQuality || 80) + 10);
  state.xp += 30;
  state.gold += 20;

  saveHarvestTownState(state, email);
  return { success: true, state };
}

// =========================================================================
// MECHANIC 4: ANIMALS AS GRAMMAR (LIVESTOCK SYSTEM)
// =========================================================================

export function careForLivestock(animalKey, performanceScore = 80, email = null) {
  const state = getHarvestTownState(email);
  if (!state.livestock) state.livestock = getDefaultHarvestTownState().livestock;

  const animal = state.livestock[animalKey];
  const conf = LIVESTOCK_CONFIG[animalKey];
  if (!animal || !conf) return { success: false, message: 'Không tìm thấy vật nuôi!' };

  animal.ready = false;
  animal.happiness = Math.min(100, animal.happiness + 15);
  animal.lastCareDay = state.day;

  // Produce item into inventory
  const itemPrice = conf.productPrice;
  const existingInv = state.inventory.find(i => i.key === `prod_${animalKey}`);
  if (existingInv) {
    existingInv.qty += 1;
  } else {
    state.inventory.push({
      id: `prod_${Date.now()}`,
      key: `prod_${animalKey}`,
      name: conf.productName,
      icon: conf.icon === '🐔' ? '🥚' : conf.icon === '🐄' ? '🥛' : conf.icon === '🐑' ? '🧶' : conf.icon === '🐝' ? '🍯' : '🏅',
      qty: 1,
      quality: 'gold',
      price: itemPrice
    });
  }

  state.xp += 50;
  state.gold += 25;
  state.stamina = Math.min(state.maxStamina, state.stamina + 10);

  saveHarvestTownState(state, email);
  return {
    success: true,
    state,
    productName: conf.productName,
    productPrice: itemPrice
  };
}

// =========================================================================
// MECHANIC 5: THE KITCHEN (COLLOCATIONS & CHUNKS)
// =========================================================================

export function cookCollocationDish(wordA, wordB, email = null) {
  const state = getHarvestTownState(email);
  const cleanA = (wordA || '').trim().toLowerCase();
  const cleanB = (wordB || '').trim().toLowerCase();

  // Search recipes
  const matched = KITCHEN_RECIPES.find(r => 
    (r.pair[0] === cleanA && r.pair[1] === cleanB) ||
    (r.pair[0] === cleanB && r.pair[1] === cleanA)
  );

  if (matched) {
    // Deduct ingredients from pantry
    state.kitchenPantry = state.kitchenPantry.map(p => {
      if (p.word === cleanA || p.word === cleanB) {
        return { ...p, count: Math.max(0, p.count - 1) };
      }
      return p;
    }).filter(p => p.count > 0);

    // Add cooked dish to inventory
    state.inventory.push({
      id: `dish_${Date.now()}`,
      key: matched.id,
      name: matched.name,
      icon: matched.icon,
      qty: 1,
      quality: matched.quality,
      price: matched.sellPrice
    });

    // Restore FP from delicious collocation dish!
    state.focusPoints = Math.min(state.maxFocusPoints, state.focusPoints + matched.fpRestore);
    state.xp += 60;
    saveHarvestTownState(state, email);

    return {
      success: true,
      burned: false,
      dish: matched,
      state,
      message: `Nấu thành công món: ${matched.name} (${matched.english})! Hồi phục +${matched.fpRestore} FP và nhận 1 món ăn giá trị ${matched.sellPrice} Gold!`
    };
  } else {
    // Burned dish
    state.xp += 10;
    return {
      success: true,
      burned: true,
      state,
      message: `Món ăn bị cháy khét! Hai từ '${cleanA}' và '${cleanB}' không tạo thành một Collocation tự nhiên trong tiếng Anh học thuật. Hãy thử kết hợp 'profound' + 'impact' hoặc 'heavily' + 'rely' nhé!`
    };
  }
}

// =========================================================================
// SHIPPING & SETTLEMENT ENGINE
// =========================================================================

export function shipItemFromBackpack(inventoryId, qty = 1, email = null) {
  const state = getHarvestTownState(email);
  const invIndex = state.inventory.findIndex(i => i.id === inventoryId);
  if (invIndex === -1) return { success: false, message: 'Không tìm thấy vật phẩm!' };

  const invItem = state.inventory[invIndex];
  if (invItem.isSeed) return { success: false, message: 'Hạt giống không thể bán vào thùng xuất khẩu!' };

  const shipQty = Math.min(qty, invItem.qty);
  invItem.qty -= shipQty;
  if (invItem.qty <= 0) {
    state.inventory.splice(invIndex, 1);
  }

  const subtotal = shipQty * (invItem.price || 30);
  state.shippingBin.push({
    id: `ship_${Date.now()}_${Math.random()}`,
    key: invItem.key,
    name: invItem.name,
    icon: invItem.icon,
    qty: shipQty,
    quality: invItem.quality || 'normal',
    unitPrice: invItem.price || 30,
    subtotal: subtotal
  });

  saveHarvestTownState(state, email);
  return { success: true, state, subtotal };
}

export function settleShippingBin(email = null) {
  const state = getHarvestTownState(email);
  if (!state.shippingBin || state.shippingBin.length === 0) {
    return { success: false, message: 'Thùng xuất khẩu đang trống! Hãy gặt nông sản và bỏ vào thùng trước nhé.' };
  }

  const items = [...state.shippingBin];
  const totalGoldEarned = items.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
  
  // Passive Heirloom Coin Income from Seed Vault!
  const heirloomCoins = (state.seedVault || []).reduce((acc, h) => acc + (h.dailyCoins || 10), 0);
  const grandTotalGold = totalGoldEarned + heirloomCoins;
  const bonusXp = Math.round(grandTotalGold * 0.4);

  state.gold += grandTotalGold;
  state.xp += bonusXp;
  state.stamina = state.maxStamina; // Good night's sleep fully restores stamina
  state.focusPoints = Math.min(state.maxFocusPoints, state.focusPoints + 30);

  // Advance in-game day
  state.day = (state.day % 28) + 1;
  if (state.day === 1) {
    const seasons = ['spring', 'summer', 'fall', 'winter'];
    const currIdx = seasons.indexOf(state.season);
    state.season = seasons[(currIdx + 1) % seasons.length];
    if (state.season === 'spring') state.year += 1;
  }

  // Reset daily Almanac for new day
  if (state.almanac) {
    state.almanac.waterRoundDone = false;
    state.almanac.sunlightRoundDone = false;
    state.almanac.seedRoundDone = false;
    state.almanac.fertilizerRoundDone = false;
    state.almanac.completedToday = false;
  }
  state.bloomBonusActive = false;

  // Make livestock ready for new day
  if (state.livestock) {
    Object.keys(state.livestock).forEach(k => {
      state.livestock[k].ready = true;
    });
  }

  state.shippingBin = [];

  state.shippingLedger.unshift({
    dateStr: `Mùa ${state.season === 'spring' ? 'Xuân' : 'Hạ'}, Ngày ${state.day}`,
    totalGold: grandTotalGold,
    itemsCount: items.length,
    heirloomIncome: heirloomCoins
  });

  checkLevelUp(state);
  saveHarvestTownState(state, email);

  return {
    success: true,
    state,
    items,
    totalGoldEarned: grandTotalGold,
    heirloomCoins,
    bonusXp,
    newDay: state.day,
    newSeason: state.season
  };
}

// Học bài trực tiếp làm lớn cây trồng (Practice-Driven Growth)
export function recordLearningToFarm(skillType, performanceScore = 80, email = null) {
  const state = getHarvestTownState(email);
  const isExcellent = performanceScore >= 85;
  const isIridium = performanceScore >= 95;

  let wateredCount = 0;
  let ripeCount = 0;

  const determinedQuality = isIridium ? 'iridium' : isExcellent ? 'gold' : performanceScore >= 70 ? 'silver' : 'normal';

  state.plots = state.plots.map(plot => {
    if (plot.state === 'growing') {
      const crop = CROPS_CONFIG[plot.cropType];
      const matchSkill = crop && (crop.skill === skillType || skillType === 'all' || skillType === 'vocab');
      const boostAmount = matchSkill ? 40 : 25;

      const newProgress = Math.min(100, plot.progress + boostAmount);
      const isNowRipe = newProgress >= 100;
      if (isNowRipe) ripeCount++;
      wateredCount++;

      // Advance SRS stage when successfully practiced
      const nextSrsStage = isNowRipe ? Math.min(5, (plot.srsStage || 0) + 1) : plot.srsStage;

      return {
        ...plot,
        progress: newProgress,
        srsStage: nextSrsStage,
        state: isNowRipe ? 'ripe' : 'growing',
        healthState: 'healthy',
        quality: isNowRipe ? determinedQuality : plot.quality,
        wateredToday: true
      };
    }
    return plot;
  });

  const goldEarned = Math.round((performanceScore / 10) * 3);
  const xpEarned = Math.round(performanceScore * (state.doubleXpUntil > Date.now() ? 2 : 1));
  state.gold += goldEarned;
  state.xp += xpEarned;
  state.stamina = Math.min(state.maxStamina, state.stamina + 20);

  // Check commissions
  state.dailyCommissions = state.dailyCommissions.map(comm => {
    if (!comm.done && (comm.skill === skillType || comm.skill === 'all' || comm.skill === 'vocab')) {
      const nextCurr = comm.current + 1;
      return {
        ...comm,
        current: nextCurr,
        done: nextCurr >= comm.target
      };
    }
    return comm;
  });

  // Friendship points
  state.coOanhFriendship.points = Math.min(1000, state.coOanhFriendship.points + 15);
  state.coOanhFriendship.hearts = Math.floor(state.coOanhFriendship.points / 200);

  checkLevelUp(state);
  saveHarvestTownState(state, email);

  return {
    success: true,
    state,
    goldEarned,
    xpEarned,
    wateredCount,
    ripeCount,
    quality: determinedQuality
  };
}

export function claimCommissionReward(commissionId, email = null) {
  const state = getHarvestTownState(email);
  const comm = state.dailyCommissions.find(c => c.id === commissionId);
  if (!comm || !comm.done || comm.claimed) {
    return { success: false, message: 'Nhiệm vụ chưa hoàn thành hoặc đã nhận thưởng rồi!' };
  }

  comm.claimed = true;
  state.gold += comm.rewardGold;
  state.xp += comm.rewardXp;
  if (comm.rewardGems) state.gems += comm.rewardGems;
  if (comm.rewardHearts) {
    state.coOanhFriendship.points = Math.min(1000, state.coOanhFriendship.points + comm.rewardHearts);
    state.coOanhFriendship.hearts = Math.floor(state.coOanhFriendship.points / 200);
  }

  checkLevelUp(state);
  saveHarvestTownState(state, email);
  return { success: true, state, comm };
}

export function buyGeneralStoreItem(itemId, email = null) {
  const state = getHarvestTownState(email);
  const item = GENERAL_STORE_CATALOG.find(i => i.id === itemId);
  if (!item) return { success: false, message: 'Không tìm thấy vật phẩm!' };

  if (state.gold < item.price) {
    return { success: false, message: `Bạn cần ${item.price} Gold (Hiện có: ${state.gold} G)!` };
  }

  state.gold -= item.price;

  if (item.type === 'seed') {
    const existing = state.inventory.find(i => i.isSeed && i.cropKey === item.cropKey);
    if (existing) {
      existing.qty += 1;
    } else {
      state.inventory.push({
        id: `seed_${Date.now()}_${Math.random()}`,
        key: item.id,
        name: item.name,
        icon: item.icon,
        qty: 1,
        isSeed: true,
        cropKey: item.cropKey
      });
    }
  } else if (item.type === 'decor' || item.type === 'tool' || item.type === 'booster') {
    if (!state.ownedDecor.includes(item.id)) {
      state.ownedDecor.push(item.id);
    }
    if (item.id === 'decor_scarecrow') {
      state.scarecrows = Math.min(2, (state.scarecrows || 0) + 1);
    }
    if (item.id === 'booster_speed_gro') {
      state.doubleXpUntil = Date.now() + (24 * 60 * 60 * 1000);
    }
  }

  saveHarvestTownState(state, email);
  return { success: true, state, item };
}

export function clearWeedsWithRevival(email = null) {
  const state = getHarvestTownState(email);
  state.hasWeeds = false;
  state.doubleXpUntil = Date.now() + (3 * 24 * 60 * 60 * 1000);
  state.gold += 150;
  state.stamina = state.maxStamina;
  state.focusPoints = state.maxFocusPoints;

  state.plots = state.plots.map(p => {
    if (p.state === 'weeds') {
      return { ...p, state: 'empty_tilled' };
    }
    return { ...p, healthState: 'healthy' };
  });

  saveHarvestTownState(state, email);
  return { success: true, state };
}

function checkLevelUp(state) {
  const currLvl = FARM_LEVELS_CONFIG.find(l => l.level === state.level) || FARM_LEVELS_CONFIG[0];
  const nextLvl = FARM_LEVELS_CONFIG.find(l => l.level === state.level + 1);
  if (nextLvl && state.xp >= nextLvl.minXp) {
    state.level = nextLvl.level;
    state.gems += 1;
    state.stamina = state.maxStamina;
    state.focusPoints = state.maxFocusPoints;
    return true;
  }
  return false;
}
