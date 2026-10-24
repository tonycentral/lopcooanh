// Harvest Town IELTS State & Economy Engine for MochiFarm
// Designed with authentic retro RPG mechanics (Stamina, Gold, Crops Quality, Shipping Bin, Town Bulletin, NPC Friendship)

import { supabase } from './supabaseClient';

const HARVEST_STORAGE_KEY = 'mochifarm_harvest_state_v2';
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export const CROPS_CONFIG = {
  wheat: {
    id: 'wheat',
    name: 'Lúa Mì Từ Vựng',
    englishName: 'Vocabulary Wheat',
    icon: '🌾',
    seedPrice: 10,
    baseSellPrice: 35,
    growthTimeStages: 3,
    skill: 'vocab',
    practiceName: 'Học 5 Từ vựng / Flashcard',
    growthPerAction: 34,
    description: 'Tưới nước khi học từ vựng mới hoặc ôn Flashcard phản xạ.'
  },
  apple: {
    id: 'apple',
    name: 'Táo Cú Pháp Ngữ Pháp',
    englishName: 'Grammar Apple',
    icon: '🍎',
    seedPrice: 25,
    baseSellPrice: 80,
    growthTimeStages: 3,
    skill: 'grammar',
    practiceName: 'Luyện 1 Điểm Ngữ Pháp',
    growthPerAction: 34,
    description: 'Chín rộ khi hoàn thành bài tập sửa câu và cấu trúc phức Band 7+.'
  },
  tomato: {
    id: 'tomato',
    name: 'Cà Chua Bi Task 1',
    englishName: 'Task 1 Tomatoes',
    icon: '🍅',
    seedPrice: 40,
    baseSellPrice: 130,
    growthTimeStages: 3,
    skill: 'task1',
    practiceName: 'Viết Đoạn Phân Tích Task 1',
    growthPerAction: 50,
    description: 'Lớn lên từ các câu miêu tả số liệu biểu đồ Line, Bar, Pie, Map.'
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Bí Ngô Hoàng Kim Task 2',
    englishName: 'Task 2 Golden Pumpkin',
    icon: '🎃',
    seedPrice: 80,
    baseSellPrice: 280,
    growthTimeStages: 3,
    skill: 'task2',
    practiceName: 'Viết Bài Luận Hoàn Chỉnh Task 2',
    growthPerAction: 34,
    description: 'Vua của các loại nông sản — đơm hoa kết trái khi lập luận mạch lạc.'
  },
  strawberry: {
    id: 'strawberry',
    name: 'Dâu Tây Nghe & Phát Âm',
    englishName: 'Phonics Strawberry',
    icon: '🍓',
    seedPrice: 30,
    baseSellPrice: 95,
    growthTimeStages: 3,
    skill: 'pronunciation',
    practiceName: 'Nghe Chép Chính Tả & Shadowing',
    growthPerAction: 50,
    description: 'Quả dâu ngọt ngào nuôi dưỡng khả năng bắt âm IPA và nối âm chuẩn.'
  },
  sunflower: {
    id: 'sunflower',
    name: 'Hướng Dương Tư Duy Phản Biện',
    englishName: 'Critical Sunflower',
    icon: '🌻',
    seedPrice: 35,
    baseSellPrice: 110,
    growthTimeStages: 3,
    skill: 'reading',
    practiceName: 'Đọc Hiểu & Bẻ Khóa Luận Điểm',
    growthPerAction: 50,
    description: 'Bông hoa tri thức hướng về ánh mặt trời khi giải mã bài đọc IELTS.'
  }
};

export const QUALITY_TIERS = {
  normal: { name: 'Thường', stars: '★', multiplier: 1.0, color: 'text-amber-700' },
  silver: { name: 'Bạc', stars: '★★', multiplier: 1.25, color: 'text-slate-400' },
  gold: { name: 'Vàng', stars: '★★★', multiplier: 1.5, color: 'text-amber-400' },
  iridium: { name: 'Iridium Thần Thoại', stars: '★★★★', multiplier: 2.0, color: 'text-purple-400' }
};

export const FARM_LEVELS_CONFIG = [
  { level: 1, title: 'Nông Dân Tập Sự', minXp: 0, maxXp: 250, badge: '🌱' },
  { level: 2, title: 'Thợ Vườn Chăm Chỉ', minXp: 250, maxXp: 700, badge: '🌾' },
  { level: 3, title: 'Chủ Điền Trang Band 6.5', minXp: 700, maxXp: 1600, badge: '🏡' },
  { level: 4, title: 'Đại Điền Chủ Band 7.5', minXp: 1600, maxXp: 3200, badge: '🚜' },
  { level: 5, title: 'Huyền Thoại MochiFarm Band 8.0+', minXp: 3200, maxXp: 99999, badge: '👑' }
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
  { id: 'decor_scarecrow', type: 'decor', name: 'Bù Nhìn Rơm Oxford', price: 150, icon: '🧙‍♂️', description: 'Đội mũ cử nhân, ngăn ngừa cỏ dại mọc thêm 2 ngày.' },
  { id: 'decor_cat_mochi', type: 'decor', name: 'Mèo Mochi Giữ Nông Trại', price: 300, icon: '🐱', description: 'Chú mèo siêu cấp đáng yêu giúp nhặt thêm 15 Gold mỗi sáng.' },
  { id: 'booster_speed_gro', type: 'booster', name: 'Phân Bón Siêu Tốc (Speed-Gro)', price: 120, icon: '🧪', description: 'Cây lớn nhanh gấp đôi trong 24 giờ.' }
];

export function getDefaultHarvestTownState() {
  return {
    farmerName: 'Học Viên Mochi',
    bandTarget: '7.0',
    level: 1,
    xp: 80,
    gold: 150, // 150 G starting capital
    gems: 2,   // 2 Mochi Gems
    stamina: 95,
    maxStamina: 100,
    season: 'spring', // spring, summer, fall, winter
    day: 14,
    year: 1,
    weather: 'sunny', // sunny, rainy, breeze
    streak: 3,
    lastActiveTimestamp: Date.now(),
    hasWeeds: false,
    doubleXpUntil: 0,
    activeTool: 'hoe', // hoe, water, scythe, fishing, pickaxe, seeds, backpack, quests
    
    // 12 Interactive Farm Plots (3x4 Grid)
    plots: [
      { id: 1, state: 'ripe', cropType: 'wheat', growthStage: 3, progress: 100, quality: 'silver', wateredToday: true },
      { id: 2, state: 'growing', cropType: 'apple', growthStage: 2, progress: 68, quality: 'normal', wateredToday: true },
      { id: 3, state: 'growing', cropType: 'tomato', growthStage: 1, progress: 34, quality: 'gold', wateredToday: false },
      { id: 4, state: 'ripe', cropType: 'strawberry', growthStage: 3, progress: 100, quality: 'gold', wateredToday: true },
      { id: 5, state: 'growing', cropType: 'pumpkin', growthStage: 1, progress: 34, quality: 'iridium', wateredToday: false },
      { id: 6, state: 'empty_tilled', cropType: null, growthStage: 0, progress: 0, quality: 'normal', wateredToday: false },
      { id: 7, state: 'growing', cropType: 'sunflower', growthStage: 2, progress: 68, quality: 'normal', wateredToday: true },
      { id: 8, state: 'empty_tilled', cropType: null, growthStage: 0, progress: 0, quality: 'normal', wateredToday: false },
      { id: 9, state: 'empty_tilled', cropType: null, growthStage: 0, progress: 0, quality: 'normal', wateredToday: false },
      { id: 10, state: 'empty_tilled', cropType: null, growthStage: 0, progress: 0, quality: 'normal', wateredToday: false },
      { id: 11, state: 'empty_tilled', cropType: null, growthStage: 0, progress: 0, quality: 'normal', wateredToday: false },
      { id: 12, state: 'empty_tilled', cropType: null, growthStage: 0, progress: 0, quality: 'normal', wateredToday: false }
    ],

    // Backpack Inventory
    inventory: [
      { id: 'inv_1', key: 'wheat', name: 'Lúa Mì Từ Vựng', icon: '🌾', qty: 14, quality: 'silver', price: 44 },
      { id: 'inv_2', key: 'apple', name: 'Táo Cú Pháp Ngữ Pháp', icon: '🍎', qty: 6, quality: 'normal', price: 80 },
      { id: 'inv_3', key: 'strawberry', name: 'Dâu Tây Nghe & Phát Âm', icon: '🍓', qty: 8, quality: 'gold', price: 142 },
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

    // Town Bulletin Board: 3 Daily Quests from Cô Oanh & Villagers
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
      currentDialogue: 'Chào em! Nông trại Mochi hôm nay tốt tươi quá. Cứ chăm chỉ viết mỗi ngày một đoạn văn, chắc chắn band điểm của em sẽ nở hoa như cánh đồng bí ngô này!'
    },

    ownedDecor: ['scarecrow_oxford']
  };
}

// Lấy Farm State (kết hợp LocalStorage và Supabase)
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
    
    // Check Inactivity (>3 days) => Weeds grow on crops (never deletes progress!)
    const now = Date.now();
    if (state.lastActiveTimestamp && (now - state.lastActiveTimestamp > THREE_DAYS_MS)) {
      state.hasWeeds = true;
      // Mark some empty plots with weeds
      state.plots = state.plots.map((p, idx) => {
        if (p.state === 'empty_tilled' && idx % 2 === 0) {
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

    // Async sync to Supabase if email exists
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

// 1. Thao tác: Gieo hạt (Plant Seed)
export function plantSeed(plotId, cropKey, email = null) {
  const state = getHarvestTownState(email);
  const plotIndex = state.plots.findIndex(p => p.id === plotId);
  if (plotIndex === -1) return { success: false, message: 'Không tìm thấy ô đất!' };

  const plot = state.plots[plotIndex];
  if (plot.state !== 'empty_tilled') {
    return { success: false, message: 'Ô đất này đang có cây trồng hoặc cỏ!' };
  }

  // Deduct seed from inventory or buy with gold if available
  const seedItemIndex = state.inventory.findIndex(item => item.isSeed && item.cropKey === cropKey && item.qty > 0);
  if (seedItemIndex !== -1) {
    state.inventory[seedItemIndex].qty -= 1;
    if (state.inventory[seedItemIndex].qty <= 0) {
      state.inventory.splice(seedItemIndex, 1);
    }
  } else {
    // Check gold
    const cropConf = CROPS_CONFIG[cropKey];
    if (state.gold < cropConf.seedPrice) {
      return { success: false, message: `Bạn không đủ Gold để mua hạt giống ${cropConf.name} (${cropConf.seedPrice} G)!` };
    }
    state.gold -= cropConf.seedPrice;
  }

  // Deduct 2 stamina
  state.stamina = Math.max(0, state.stamina - 2);

  state.plots[plotIndex] = {
    ...plot,
    state: 'growing',
    cropType: cropKey,
    growthStage: 0, // Seed
    progress: 10,
    quality: 'normal',
    wateredToday: true
  };

  saveHarvestTownState(state, email);
  return { success: true, state, plot: state.plots[plotIndex] };
}

// 2. Thao tác: Thu hoạch cây chín (Harvest Crop)
export function harvestCrop(plotId, email = null) {
  const state = getHarvestTownState(email);
  const plotIndex = state.plots.findIndex(p => p.id === plotId);
  if (plotIndex === -1) return { success: false, message: 'Không tìm thấy ô đất!' };

  const plot = state.plots[plotIndex];
  if (plot.state !== 'ripe') {
    return { success: false, message: 'Cây chưa chín, hãy làm bài tập để chăm bón thêm!' };
  }

  const crop = CROPS_CONFIG[plot.cropType] || CROPS_CONFIG.wheat;
  const quality = plot.quality || 'normal';
  const tier = QUALITY_TIERS[quality] || QUALITY_TIERS.normal;

  // Calculate yield
  const basePrice = crop.baseSellPrice;
  const finalPrice = Math.round(basePrice * tier.multiplier);
  const xpGain = Math.round(40 * tier.multiplier * (state.doubleXpUntil > Date.now() ? 2 : 1));

  // Add crop to inventory
  const existingInv = state.inventory.find(i => i.key === crop.id && i.quality === quality && !i.isSeed);
  if (existingInv) {
    existingInv.qty += 1;
  } else {
    state.inventory.push({
      id: `inv_${Date.now()}_${Math.random()}`,
      key: crop.id,
      name: crop.name,
      icon: crop.icon,
      qty: 1,
      quality: quality,
      price: finalPrice
    });
  }

  // Grant EXP
  state.xp += xpGain;

  // Level Up Check
  checkLevelUp(state);

  // Reset plot to empty_tilled
  state.plots[plotIndex] = {
    ...plot,
    state: 'empty_tilled',
    cropType: null,
    growthStage: 0,
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
    itemPrice: finalPrice
  };
}

// 3. Đưa vật phẩm vào Thùng Giao Hàng (Drop into Shipping Bin)
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

// 4. Kết toán buổi tối / Tổng kết xuất khẩu (Settle Daily Shipping)
export function settleShippingBin(email = null) {
  const state = getHarvestTownState(email);
  if (!state.shippingBin || state.shippingBin.length === 0) {
    return { success: false, message: 'Thùng xuất khẩu đang trống! Hãy gặt nông sản và bỏ vào thùng trước nhé.' };
  }

  const items = [...state.shippingBin];
  const totalGoldEarned = items.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
  const bonusXp = Math.round(totalGoldEarned * 0.4);

  state.gold += totalGoldEarned;
  state.xp += bonusXp;
  state.stamina = Math.min(state.maxStamina, state.stamina + 30); // Good night's rest gives energy!
  
  // Advance in-game day
  state.day = (state.day % 28) + 1;
  if (state.day === 1) {
    const seasons = ['spring', 'summer', 'fall', 'winter'];
    const currIdx = seasons.indexOf(state.season);
    state.season = seasons[(currIdx + 1) % seasons.length];
    if (state.season === 'spring') state.year += 1;
  }

  // Clear shipping bin
  state.shippingBin = [];

  // Record in Ledger
  state.shippingLedger.unshift({
    dateStr: `Mùa ${state.season === 'spring' ? 'Xuân' : state.season === 'summer' ? 'Hạ' : state.season === 'fall' ? 'Thu' : 'Đông'}, Ngày ${state.day}`,
    totalGold: totalGoldEarned,
    itemsCount: items.length
  });

  checkLevelUp(state);
  saveHarvestTownState(state, email);

  return {
    success: true,
    state,
    items,
    totalGoldEarned,
    bonusXp,
    newDay: state.day,
    newSeason: state.season
  };
}

// 5. Học bài trực tiếp làm lớn cây trồng & Thưởng Nông Dân (Practice Driven Growth)
export function recordLearningToFarm(skillType, performanceScore = 80, email = null) {
  const state = getHarvestTownState(email);
  const isExcellent = performanceScore >= 85;
  const isIridium = performanceScore >= 95;

  let wateredCount = 0;
  let ripeCount = 0;

  // Quality roll based on performance
  const determinedQuality = isIridium ? 'iridium' : isExcellent ? 'gold' : performanceScore >= 70 ? 'silver' : 'normal';

  // Find plots that match skillType or any growing crop
  state.plots = state.plots.map(plot => {
    if (plot.state === 'growing') {
      const crop = CROPS_CONFIG[plot.cropType];
      const matchSkill = crop && (crop.skill === skillType || skillType === 'all');
      const boostAmount = matchSkill ? (crop.growthPerAction || 40) : 20;

      const newProgress = Math.min(100, plot.progress + boostAmount);
      const isNowRipe = newProgress >= 100;
      if (isNowRipe) ripeCount++;
      wateredCount++;

      return {
        ...plot,
        progress: newProgress,
        growthStage: newProgress >= 100 ? 3 : newProgress >= 60 ? 2 : 1,
        state: isNowRipe ? 'ripe' : 'growing',
        quality: isNowRipe ? determinedQuality : plot.quality,
        wateredToday: true
      };
    }
    return plot;
  });

  // Rewards for practicing: Directly grants Gold, Stamina Regen, and EXP
  const goldEarned = Math.round((performanceScore / 10) * 3); // 24-30 G per session
  const xpEarned = Math.round(performanceScore * (state.doubleXpUntil > Date.now() ? 2 : 1));
  state.gold += goldEarned;
  state.xp += xpEarned;
  
  // Stamina Surge from studying
  state.stamina = Math.min(state.maxStamina, state.stamina + 20);

  // Check commissions progress
  state.dailyCommissions = state.dailyCommissions.map(comm => {
    if (!comm.done && (comm.skill === skillType || comm.skill === 'all')) {
      const nextCurr = comm.current + 1;
      const isDone = nextCurr >= comm.target;
      return {
        ...comm,
        current: nextCurr,
        done: isDone
      };
    }
    return comm;
  });

  // Advance friendship with Cô Oanh
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

// 6. Nhận thưởng nhiệm vụ Bảng Tin (Claim Bulletin Commission)
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

// 7. Mua sắm từ Tiệm Nông Cụ (Buy from General Store)
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
    if (item.id === 'booster_speed_gro') {
      state.doubleXpUntil = Date.now() + (24 * 60 * 60 * 1000);
    }
  }

  saveHarvestTownState(state, email);
  return { success: true, state, item };
}

// 8. Dọn cỏ hồi sinh khi vắng mặt (Weed Revival)
export function clearWeedsWithRevival(email = null) {
  const state = getHarvestTownState(email);
  state.hasWeeds = false;
  state.doubleXpUntil = Date.now() + (3 * 24 * 60 * 60 * 1000); // 3-day 2x buff
  state.gold += 150;
  state.stamina = state.maxStamina;

  state.plots = state.plots.map(p => {
    if (p.state === 'weeds') {
      return { ...p, state: 'empty_tilled' };
    }
    return p;
  });

  saveHarvestTownState(state, email);
  return { success: true, state };
}

function checkLevelUp(state) {
  const currLvl = FARM_LEVELS_CONFIG.find(l => l.level === state.level) || FARM_LEVELS_CONFIG[0];
  const nextLvl = FARM_LEVELS_CONFIG.find(l => l.level === state.level + 1);
  if (nextLvl && state.xp >= nextLvl.minXp) {
    state.level = nextLvl.level;
    state.gems += 1; // Reward 1 gem on level up
    state.stamina = state.maxStamina; // Full restore
    return true;
  }
  return false;
}
