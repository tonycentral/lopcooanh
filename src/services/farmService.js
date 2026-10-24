// Service quản lý toàn diện logic Nông Trại Tri Thức (IELTS Harvest Farm)
// Bao gồm: Đất đai, cây trồng, chu kỳ chăm sóc, cơ chế hồi sinh dọn cỏ, kho nông sản và hợp tác xã

import { supabase } from './supabaseClient';

const FARM_STORAGE_KEY = 'lopcooanh_farm_state_v1';
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const THREE_DAYS_BUFF_MS = 3 * 24 * 60 * 60 * 1000;

export const CROP_DEFINITIONS = {
  wheat: {
    id: 'wheat',
    name: 'Lúa Mì Từ Vựng',
    englishName: 'Vocabulary Wheat',
    icon: '🌾',
    skillTarget: 'vocab',
    skillTitle: 'Luyện 5 từ vựng hoặc Flashcard',
    targetUnit: 'từ vựng',
    growthPerAction: 35, // ~3 lần học là chín rộ
    color: 'from-amber-500 to-yellow-400',
    borderColor: 'border-amber-400/60',
    bgColor: 'bg-amber-950/20',
    reward: { xp: 50, coins: 25, item: 'wheat', qty: 5 },
    description: 'Tưới nước bằng cách học từ vựng mới hoặc lật Flashcard phản xạ.'
  },
  apple: {
    id: 'apple',
    name: 'Cây Táo Ngữ Pháp',
    englishName: 'Grammar Apple Tree',
    icon: '🍎',
    skillTarget: 'grammar',
    skillTitle: 'Luyện 1 điểm ngữ pháp / sửa câu',
    targetUnit: 'câu ngữ pháp',
    growthPerAction: 40,
    color: 'from-rose-500 to-red-400',
    borderColor: 'border-rose-400/60',
    bgColor: 'bg-rose-950/20',
    reward: { xp: 60, coins: 30, item: 'apples', qty: 3 },
    description: 'Cây táo lớn lên khi bạn luyện viết câu chuẩn ngữ pháp không lỗi sai.'
  },
  tomato: {
    id: 'tomato',
    name: 'Vườn Cà Chua Task 1',
    englishName: 'Task 1 Tomato Patch',
    icon: '🍅',
    skillTarget: 'task1',
    skillTitle: 'Viết câu miêu tả số liệu Task 1',
    targetUnit: 'câu Task 1',
    growthPerAction: 50,
    color: 'from-emerald-500 to-green-400',
    borderColor: 'border-emerald-400/60',
    bgColor: 'bg-emerald-950/20',
    reward: { xp: 75, coins: 35, item: 'tomatoes', qty: 4 },
    description: 'Chăm sóc cà chua bằng các câu phân tích biểu đồ Line, Bar, Pie, Table.'
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Bí Ngô Khổng Lồ Task 2',
    englishName: 'Task 2 Golden Pumpkin',
    icon: '🎃',
    skillTarget: 'task2',
    skillTitle: 'Luyện viết luận điểm Task 2',
    targetUnit: 'đoạn văn Task 2',
    growthPerAction: 34,
    color: 'from-orange-500 to-amber-400',
    borderColor: 'border-orange-400/60',
    bgColor: 'bg-orange-950/20',
    reward: { xp: 100, coins: 50, item: 'pumpkins', qty: 2 },
    description: 'Quả bí ngô hoàng gia lớn dần khi bạn phát triển ý tưởng phản biện sắc bén.'
  },
  strawberry: {
    id: 'strawberry',
    name: 'Vườn Dâu Phát Âm & Nghe',
    englishName: 'Phonics Strawberry',
    icon: '🍓',
    skillTarget: 'pronunciation',
    skillTitle: 'Luyện phát âm IPA & Nghe',
    targetUnit: 'bài phát âm',
    growthPerAction: 50,
    color: 'from-pink-500 to-rose-400',
    borderColor: 'border-pink-400/60',
    bgColor: 'bg-pink-950/20',
    reward: { xp: 55, coins: 25, item: 'strawberries', qty: 6 },
    description: 'Thu hoạch những quả dâu ngọt ngào qua việc chuẩn hóa phát âm và nối âm.'
  },
  sunflower: {
    id: 'sunflower',
    name: 'Hoa Hướng Dương Tư Duy',
    englishName: 'Critical Thinking Sunflower',
    icon: '🌻',
    skillTarget: 'reading',
    skillTitle: 'Đọc hiểu & Tư duy phản biện',
    targetUnit: 'bài đọc hiểu',
    growthPerAction: 50,
    color: 'from-yellow-400 to-amber-300',
    borderColor: 'border-yellow-400/60',
    bgColor: 'bg-yellow-950/20',
    reward: { xp: 80, coins: 40, item: 'sunflowers', qty: 4 },
    description: 'Bông hoa luôn hướng về ánh mặt trời tri thức khi bạn giải mã bài đọc IELTS.'
  }
};

export const FARM_LEVELS = [
  { level: 1, title: 'Nông Dân Tập Sự', minXp: 0, maxXp: 200, badge: '🌱' },
  { level: 2, title: 'Thợ Làm Vườn Chăm Chỉ', minXp: 200, maxXp: 600, badge: '🌾' },
  { level: 3, title: 'Chủ Điền Trang Tri Thức', minXp: 600, maxXp: 1500, badge: '🏡' },
  { level: 4, title: 'Đại Nông Gia IELTS', minXp: 1500, maxXp: 3000, badge: '🚜' },
  { level: 5, title: 'Huyền Thoại Nông Trại Cô Oanh', minXp: 3000, maxXp: 99999, badge: '👑' }
];

export const SHOP_ITEMS = [
  {
    id: 'scarecrow_oxford',
    name: 'Bù Nhìn Rơm Học Giả',
    icon: '🧙‍♂️',
    category: 'decor',
    price: 120,
    description: 'Đội mũ cử nhân Oxford, giúp chim chóc không dám phá hoại cánh đồng tri thức.'
  },
  {
    id: 'windmill_delft',
    name: 'Cối Xay Gió Hà Lan',
    icon: '💨',
    category: 'building',
    price: 250,
    description: 'Xoay đều đón gió tự nhiên, giúp tăng 10% nước thần mỗi ngày.'
  },
  {
    id: 'farm_dog_shepherd',
    name: 'Cún Chăn Cừu Thông Minh',
    icon: '🐕',
    category: 'pet',
    price: 300,
    description: 'Chú cún trung thành luôn chạy vòng quanh động viên bạn học bài mỗi ngày.'
  },
  {
    id: 'flower_fence',
    name: 'Hàng Rào Gỗ Trắng & Hoa',
    icon: '🪵',
    category: 'decor',
    price: 80,
    description: 'Hàng rào xinh xắn phong cách trang viên nước Anh bao quanh nông trại.'
  },
  {
    id: 'magic_fertilizer_x2',
    name: 'Bao Phân Bón Thần Kỳ (x2 EXP 24h)',
    icon: '✨',
    category: 'booster',
    price: 150,
    description: 'Kích hoạt hiệu ứng nhân đôi toàn bộ kinh nghiệm (EXP) trong 24 giờ.'
  }
];

// Khởi tạo trạng thái ban đầu mặc định của nông trại
function getDefaultFarmState() {
  return {
    level: 1,
    xp: 60,
    coins: 100, // Tặng sẵn 100 Bút Vàng làm vốn khởi nghiệp
    water: 5,   // 5 gáo nước thần
    streak: 1,
    lastVisit: Date.now(),
    hasWeeds: false,
    doubleXpUntil: 0,
    barnInventory: {
      wheat: 12,
      apples: 4,
      tomatoes: 5,
      pumpkins: 1,
      strawberries: 6,
      sunflowers: 3
    },
    ownedItems: ['flower_fence'],
    // 6 ô đất nông trại
    plots: [
      { id: 1, cropType: 'wheat', progress: 85, isWeeded: false },
      { id: 2, cropType: 'apple', progress: 45, isWeeded: false },
      { id: 3, cropType: 'tomato', progress: 100, isWeeded: false }, // Có sẵn 1 ô chín để học viên trải nghiệm gặt lúa ngay!
      { id: 4, cropType: 'pumpkin', progress: 30, isWeeded: false },
      { id: 5, cropType: 'strawberry', progress: 60, isWeeded: false },
      { id: 6, cropType: 'sunflower', progress: 20, isWeeded: false }
    ],
    // Tiến độ đơn hàng Hợp Tác Xã tuần này của Lớp Cô Oanh
    coopTrain: {
      orderId: 'week_43_harvest',
      title: 'Chuyến Tàu Nông Sản Tuần Này của Lớp',
      deadline: 'Chủ Nhật (23:59)',
      requirements: {
        wheat: { target: 100, current: 68 },
        apples: { target: 40, current: 28 },
        pumpkins: { target: 15, current: 11 }
      },
      userContribution: {
        wheat: 5,
        apples: 2,
        pumpkins: 1
      },
      rewardText: 'Nhận 200 Bút Vàng + Huy hiệu Nông Dân Xuất Sắc từ Cô Oanh'
    }
  };
}

/**
 * Đọc trạng thái nông trại từ bộ nhớ (localStorage & Supabase)
 * Tự động kiểm tra thời gian vắng mặt để kích hoạt cơ chế cỏ dại hồi sinh (Comeback Revival)
 */
export function getFarmState(email = null) {
  try {
    const key = email ? `${FARM_STORAGE_KEY}_${email.trim().toLowerCase()}` : FARM_STORAGE_KEY;
    const raw = localStorage.getItem(key);
    let state = raw ? JSON.parse(raw) : getDefaultFarmState();

    // Kiểm tra thời gian vắng mặt (Inactivity check)
    const now = Date.now();
    const lastVisit = state.lastVisit || now;
    const daysSinceLastVisit = (now - lastVisit) / (24 * 60 * 60 * 1000);

    // Nếu vắng mặt trên 3 ngày -> Kích hoạt cơ chế cỏ dại mọc nhẹ (Không xóa cây, không phạt)
    if (daysSinceLastVisit >= 3 && !state.hasWeeds) {
      state.hasWeeds = true;
      // Đánh dấu 2 ô đất ngẫu nhiên bị cỏ dại bao phủ nhẹ
      state.plots = state.plots.map((p, idx) => {
        if (idx === 0 || idx === 3) {
          return { ...p, isWeeded: true };
        }
        return p;
      });
      saveFarmState(state, email);
    }

    return state;
  } catch (e) {
    console.error('Lỗi khi đọc Farm State:', e);
    return getDefaultFarmState();
  }
}

/**
 * Lưu trạng thái nông trại vào localStorage và đồng bộ lên Supabase nếu có mạng
 */
export function saveFarmState(state, email = null) {
  try {
    const key = email ? `${FARM_STORAGE_KEY}_${email.trim().toLowerCase()}` : FARM_STORAGE_KEY;
    const updated = {
      ...state,
      lastVisit: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(updated));

    // Async sync lên Supabase nếu có tài khoản
    syncFarmToCloud(updated, email);
    return updated;
  } catch (e) {
    console.error('Lỗi khi lưu Farm State:', e);
    return state;
  }
}

async function syncFarmToCloud(state, email) {
  try {
    if (!supabase || !email) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      // Upsert vào profile farm metadata
      await supabase
        .from('profiles')
        .update({
          xp: state.xp,
          streak: state.streak,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);
    }
  } catch (err) {
    // Silent cloud fallback
    console.debug('Cloud sync non-critical notice:', err);
  }
}

/**
 * Tưới nước hoặc hoàn thành 1 phiên học cho cây trồng
 * @param {string} skillType 'vocab' | 'grammar' | 'task1' | 'task2' | 'reading' | 'pronunciation'
 * @param {number} actionUnits Số lượng câu/từ hoàn thành (mặc định 1)
 */
export function tendCropWithLearning(skillType, actionUnits = 1, email = null) {
  const state = getFarmState(email);
  const isDoubleXp = Boolean(state.doubleXpUntil && state.doubleXpUntil > Date.now());

  let totalXpGained = 0;
  let totalCoinsGained = 0;
  let cropsGrownCount = 0;

  const newPlots = state.plots.map(plot => {
    const cropDef = CROP_DEFINITIONS[plot.cropType];
    if (cropDef && cropDef.skillTarget === skillType) {
      // Ô đất này trùng với kỹ năng vừa học -> tăng tiến độ
      const growth = cropDef.growthPerAction * actionUnits;
      const newProgress = Math.min(100, (plot.progress || 0) + growth);
      cropsGrownCount++;
      return {
        ...plot,
        progress: newProgress,
        isWeeded: false // Tưới nước làm tan biến cỏ dại
      };
    }
    return plot;
  });

  // Tặng ngay 1 lượng EXP và nước thần
  const baseBonusXp = 20 * actionUnits;
  const actualXp = isDoubleXp ? baseBonusXp * 2 : baseBonusXp;
  totalXpGained += actualXp;
  totalCoinsGained += 5 * actionUnits;

  // Tính toán Level mới
  const currentXp = (state.xp || 0) + totalXpGained;
  let currentLevel = state.level || 1;
  for (const lvl of FARM_LEVELS) {
    if (currentXp >= lvl.minXp) {
      currentLevel = lvl.level;
    }
  }

  const updatedState = {
    ...state,
    xp: currentXp,
    level: currentLevel,
    coins: (state.coins || 0) + totalCoinsGained,
    water: Math.min(20, (state.water || 0) + 1), // Tích thêm 1 gáo nước thần
    plots: newPlots,
    lastVisit: Date.now()
  };

  saveFarmState(updatedState, email);
  return {
    state: updatedState,
    xpGained: totalXpGained,
    coinsGained: totalCoinsGained,
    isDoubleXp,
    cropsGrownCount
  };
}

/**
 * Thu hoạch một ô đất đã chín (progress >= 100)
 */
export function harvestPlot(plotId, email = null) {
  const state = getFarmState(email);
  const plot = state.plots.find(p => p.id === plotId);

  if (!plot || plot.progress < 100) {
    return { success: false, message: 'Cây chưa chín để thu hoạch!' };
  }

  const cropDef = CROP_DEFINITIONS[plot.cropType];
  const isDoubleXp = Boolean(state.doubleXpUntil && state.doubleXpUntil > Date.now());
  const xpEarned = isDoubleXp ? cropDef.reward.xp * 2 : cropDef.reward.xp;
  const coinsEarned = cropDef.reward.coins;
  const itemType = cropDef.reward.item;
  const itemQty = cropDef.reward.qty;

  // Cập nhật kho nông sản
  const newInventory = {
    ...state.barnInventory,
    [itemType]: (state.barnInventory[itemType] || 0) + itemQty
  };

  // Reset ô đất về 0% để trồng lứa mới
  const newPlots = state.plots.map(p => {
    if (p.id === plotId) {
      return { ...p, progress: 0, isWeeded: false };
    }
    return p;
  });

  const newXp = (state.xp || 0) + xpEarned;
  let newLevel = state.level || 1;
  for (const lvl of FARM_LEVELS) {
    if (newXp >= lvl.minXp) {
      newLevel = lvl.level;
    }
  }

  const updatedState = {
    ...state,
    xp: newXp,
    level: newLevel,
    coins: (state.coins || 0) + coinsEarned,
    barnInventory: newInventory,
    plots: newPlots
  };

  saveFarmState(updatedState, email);

  return {
    success: true,
    plotId,
    cropDef,
    xpEarned,
    coinsEarned,
    itemType,
    itemQty,
    isDoubleXp,
    state: updatedState
  };
}

/**
 * Hoàn thành nhiệm vụ Hồi Sinh Dọn Cỏ (Revival Quest) khi học sinh lâu ngày quay lại
 * Tặng ngay: Xóa sạch cỏ dại + Gói Phân Bón x2 EXP trong 3 ngày + 100 Coins + 10 Nước thần
 */
export function completeRevivalQuest(email = null) {
  const state = getFarmState(email);

  const cleanPlots = state.plots.map(p => ({
    ...p,
    isWeeded: false
  }));

  const updatedState = {
    ...state,
    hasWeeds: false,
    doubleXpUntil: Date.now() + THREE_DAYS_BUFF_MS,
    coins: (state.coins || 0) + 100,
    water: (state.water || 0) + 10,
    plots: cleanPlots,
    lastVisit: Date.now()
  };

  saveFarmState(updatedState, email);

  return {
    success: true,
    message: 'Nông trại đã hồi sinh rực rỡ! Bạn nhận được Buff x2 EXP trong 3 ngày và 100 Bút Vàng!',
    state: updatedState
  };
}

/**
 * Đóng góp nông sản cho Chuyến Tàu Hợp Tác Xã của Lớp Cô Oanh
 */
export function contributeToCoopTrain(itemKey, amount = 1, email = null) {
  const state = getFarmState(email);
  const currentStock = state.barnInventory[itemKey] || 0;

  if (currentStock < amount) {
    return { success: false, message: 'Số lượng nông sản trong kho không đủ!' };
  }

  const newStock = currentStock - amount;
  const newInventory = {
    ...state.barnInventory,
    [itemKey]: newStock
  };

  // Cập nhật tiến độ chuyến tàu
  const currentReq = state.coopTrain?.requirements?.[itemKey] || { target: 50, current: 0 };
  const newReqCurrent = Math.min(currentReq.target, currentReq.current + amount);

  const newCoopTrain = {
    ...state.coopTrain,
    requirements: {
      ...state.coopTrain.requirements,
      [itemKey]: {
        ...currentReq,
        current: newReqCurrent
      }
    },
    userContribution: {
      ...state.coopTrain.userContribution,
      [itemKey]: (state.coopTrain.userContribution?.[itemKey] || 0) + amount
    }
  };

  // Đóng góp được tặng Bút Vàng và EXP
  const coinsBonus = amount * 10;
  const xpBonus = amount * 15;

  const updatedState = {
    ...state,
    barnInventory: newInventory,
    coopTrain: newCoopTrain,
    coins: (state.coins || 0) + coinsBonus,
    xp: (state.xp || 0) + xpBonus
  };

  saveFarmState(updatedState, email);

  return {
    success: true,
    message: `Đã đóng góp ${amount} ${itemKey} vào chuyến tàu của lớp!`,
    coinsBonus,
    xpBonus,
    state: updatedState
  };
}

/**
 * Mua vật phẩm từ Cửa Hàng Nông Trại bằng Bút Vàng
 */
export function buyShopItem(itemId, email = null) {
  const state = getFarmState(email);
  const item = SHOP_ITEMS.find(i => i.id === itemId);

  if (!item) return { success: false, message: 'Vật phẩm không tồn tại' };
  if ((state.coins || 0) < item.price) {
    return { success: false, message: 'Bạn không đủ Bút Vàng để mua vật phẩm này!' };
  }

  if (item.category === 'booster' && item.id === 'magic_fertilizer_x2') {
    // Buff booster x2 EXP 24h
    const updatedState = {
      ...state,
      coins: state.coins - item.price,
      doubleXpUntil: Math.max(Date.now(), state.doubleXpUntil || 0) + 24 * 60 * 60 * 1000
    };
    saveFarmState(updatedState, email);
    return { success: true, message: 'Đã kích hoạt Phân Bón Thần Kỳ x2 EXP trong 24 giờ!', state: updatedState };
  }

  if (state.ownedItems?.includes(itemId)) {
    return { success: false, message: 'Bạn đã sở hữu vật phẩm này rồi!' };
  }

  const updatedState = {
    ...state,
    coins: state.coins - item.price,
    ownedItems: [...(state.ownedItems || []), itemId]
  };

  saveFarmState(updatedState, email);
  return { success: true, message: `Mua thành công ${item.name}!`, state: updatedState };
}
