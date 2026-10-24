// MochiFarm IELTS State & Area-Skill Economy Engine
// 1. Mỗi kĩ năng tương ứng với 1 khu vực trong nông trại:
//    - Ruộng Lúa: Từ vựng (Vocabulary)
//    - Vườn Cây: Reading (Đọc hiểu)
//    - Nhà Kính: Writing (Viết luận)
//    - Ao Hồ: Speaking (Nói & Phát âm)
//    - Chăn Nuôi: Listening (Nghe hiểu)
// 2. Mỗi khu vực có 10 loài/thửa tượng trưng cho 10 chủ đề IELTS cốt lõi.
//    Luyện tập nhiều thì cây/vật nuôi lớn lên (Level 1 -> 5); lâu không luyện sẽ héo úa/ủ rũ.
// 3. Ở mỗi màn hình chỉ hiển thị 1 khu vực duy nhất (không cuộn). Menu hiển thị đầy đủ 5 khu vực.
// 4. Currency trong game chỉ gồm 2 yếu tố: Tiền (Gold 🪙) và Mana (🔮).

import { supabase } from './supabaseClient';

const HARVEST_STORAGE_KEY = 'mochifarm_harvest_state_v4';
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;

// 1. Definition of 5 Farm Areas corresponding to 5 IELTS Skills
// Ordered exactly by: Ruộng lúa -> Vườn cây -> Chăn nuôi -> Ao hồ -> Nhà kính
export const FARM_AREAS = [
  {
    id: 'paddy',
    name: 'Ruộng Lúa',
    skill: 'vocab',
    skillName: 'Từ Vựng',
    skillTitle: 'Kỹ Năng Từ Vựng',
    icon: '🌾',
    themeColor: '#F59E0B',
    bgGradient: 'from-[#2B381A] via-[#3B4D25] to-[#2B381A]',
    description: 'Canh tác 10 thửa ruộng Từ Vựng học thuật C1/C2 theo chủ đề'
  },
  {
    id: 'orchard',
    name: 'Vườn Cây',
    skill: 'reading',
    skillName: 'Reading',
    skillTitle: 'Kỹ Năng Đọc Hiểu',
    icon: '🌳',
    themeColor: '#2E7D32',
    bgGradient: 'from-[#1B3B1E] via-[#244A28] to-[#1B3B1E]',
    description: 'Nuôi dưỡng 10 cây tri thức Đọc Hiểu theo 10 chủ đề IELTS'
  },
  {
    id: 'pasture',
    name: 'Chăn Nuôi',
    skill: 'listening',
    skillName: 'Listening',
    skillTitle: 'Kỹ Năng Nghe',
    icon: '🐮',
    themeColor: '#D97706',
    bgGradient: 'from-[#331C13] via-[#4A2A1E] to-[#331C13]',
    description: 'Chăm sóc 10 bầy vật nuôi nhạy bén cho kỹ năng Nghe IELTS'
  },
  {
    id: 'pond',
    name: 'Khu Ao Hồ',
    skill: 'speaking',
    skillName: 'Speaking',
    skillTitle: 'Kỹ Năng Nói & Âm',
    icon: '🐟',
    themeColor: '#0284C7',
    bgGradient: 'from-[#0C2738] via-[#143A52] to-[#0C2738]',
    description: 'Nuôi dưỡng 10 đàn cá năng động cho phản xạ Nói và Phát Âm chuẩn'
  },
  {
    id: 'greenhouse',
    name: 'Nhà Kính',
    skill: 'writing',
    skillName: 'Writing',
    skillTitle: 'Kỹ Năng Viết Luận',
    icon: '🏡',
    themeColor: '#059669',
    bgGradient: 'from-[#14352D] via-[#1D4A3F] to-[#14352D]',
    description: 'Ươm mầm 10 loài hoa quý cho kỹ năng Viết Task 1 & Task 2'
  }
];

// 2. Definition of 10 Core IELTS Topics
export const FARM_TOPICS = [
  { id: 'environment', name: 'Môi Trường & Khí Hậu', english: 'Environment & Climate', icon: '🌍' },
  { id: 'technology', name: 'Công Nghệ & AI', english: 'Technology & AI', icon: '🤖' },
  { id: 'education', name: 'Giáo Dục & Đào Tạo', english: 'Education & Schooling', icon: '🎓' },
  { id: 'society_family', name: 'Xã Hội & Đời Sống', english: 'Society & Family', icon: '👨‍👩‍👧' },
  { id: 'business', name: 'Kinh Tế & Tiêu Dùng', english: 'Economy & Consumerism', icon: '📈' },
  { id: 'health', name: 'Y Tế & Sức Khỏe', english: 'Health & Wellbeing', icon: '🏥' },
  { id: 'work_career', name: 'Việc Làm & Nghề Nghiệp', english: 'Work & Employment', icon: '💼' },
  { id: 'transport', name: 'Giao Thông & Đô Thị', english: 'Transport & Cities', icon: '🚆' },
  { id: 'crime_law', name: 'Pháp Luật & Chính Sách', english: 'Crime & Law', icon: '⚖️' },
  { id: 'culture_arts', name: 'Văn Hóa & Di Sản', english: 'Culture & Heritage', icon: '🏛️' }
];

// Specific Entity Metadata for Each (Area x Topic)
export const AREA_TOPIC_NAMES = {
  orchard: {
    environment: { name: 'Cây Rừng Sinh Thái', type: 'tree_rainforest', english: 'Rainforest Eco Tree', fruit: 'Trái Sinh Thái' },
    technology: { name: 'Cây Tùng Số Hóa', type: 'tree_pine', english: 'Cyber Pine Tree', fruit: 'Quả Tùng AI' },
    education: { name: 'Cây Sồi Trí Thức', type: 'tree_oak', english: 'Wisdom Oak', fruit: 'Hạt Dẻ Học Thuật' },
    society_family: { name: 'Cây Phong Đời Sống', type: 'tree_maple', english: 'Society Maple', fruit: 'Lá Phong Hòa Hợp' },
    business: { name: 'Cây Kim Ngân Tài Chính', type: 'tree_willow', english: 'Finance Willow', fruit: 'Quả Vàng Kinh Tế' },
    health: { name: 'Cây Bạch Đàn Trị Liệu', type: 'tree_eucalyptus', english: 'Healing Eucalyptus', fruit: 'Tinh Dầu Dược Thảo' },
    work_career: { name: 'Cây Trầm Hương Nghề Nghiệp', type: 'tree_redwood', english: 'Career Redwood', fruit: 'Hương Sự Nghiệp' },
    transport: { name: 'Cây Bách Đô Thị', type: 'tree_cypress', english: 'Urban Cypress', fruit: 'Trái Đô Thị' },
    crime_law: { name: 'Cây Cổ Thụ Công Lý', type: 'tree_cedar', english: 'Justice Cedar', fruit: 'Hạt Kỷ Cương' },
    culture_arts: { name: 'Cây Anh Đào Di Sản', type: 'tree_cherry', english: 'Heritage Cherry Blossom', fruit: 'Hoa Đào Nghệ Thuật' }
  },
  paddy: {
    environment: { name: 'Thửa Lúa Mì Sinh Thái', type: 'paddy_eco', english: 'Eco Wheat Field', fruit: 'Bông Lúa Xanh' },
    technology: { name: 'Thửa Lúa Công Nghệ AI', type: 'paddy_tech', english: 'High-Tech Rice', fruit: 'Hạt Ngọc Số Hóa' },
    education: { name: 'Thửa Lúa Mạch Trí Thức', type: 'paddy_edu', english: 'Wisdom Barley', fruit: 'Mầm Tri Thức' },
    society_family: { name: 'Thửa Lúa Nếp Đời Sống', type: 'paddy_soc', english: 'Lifestyle Rice', fruit: 'Hạt Nếp Ấm No' },
    business: { name: 'Thửa Lúa Vàng Tài Chính', type: 'paddy_biz', english: 'Golden Wealth Grain', fruit: 'Bông Lúa Vàng' },
    health: { name: 'Thửa Lúa Dược Liệu Y Tế', type: 'paddy_health', english: 'Medicinal Rice', fruit: 'Gạo Dược Thảo' },
    work_career: { name: 'Thửa Lúa Sự Nghiệp', type: 'paddy_work', english: 'Career Rye', fruit: 'Bông Lúa Bền Vững' },
    transport: { name: 'Thửa Lúa Nước Đô Thị', type: 'paddy_trans', english: 'Urban Paddy', fruit: 'Hạt Gạo Hiện Đại' },
    crime_law: { name: 'Thửa Lúa Kỷ Cương Pháp Lý', type: 'paddy_law', english: 'Law & Order Oats', fruit: 'Hạt Lúa Công Bằng' },
    culture_arts: { name: 'Thửa Nếp Cẩm Di Sản', type: 'paddy_art', english: 'Heritage Black Rice', fruit: 'Nếp Cẩm Cung Đình' }
  },
  greenhouse: {
    environment: { name: 'Lan Rừng Môi Trường', type: 'plant_orchid', english: 'Wild Eco Orchid', fruit: 'Hoa Lan Thanh Khiết' },
    technology: { name: 'Sen Đá Vi Mạch', type: 'plant_succulent', english: 'Cyber Succulent', fruit: 'Mầm Vi Mạch' },
    education: { name: 'Xương Rồng Học Thuật', type: 'plant_cactus', english: 'Academic Cactus', fruit: 'Hoa Xương Rồng' },
    society_family: { name: 'Cẩm Tú Cầu Xã Hội', type: 'plant_hydrangea', english: 'Community Hydrangea', fruit: 'Chùm Hoa Đoàn Kết' },
    business: { name: 'Cây Kim Tiền Doanh Nghiệp', type: 'plant_money', english: 'Corporate Money Plant', fruit: 'Lá Kim Tiền' },
    health: { name: 'Nha Đam Dược Thảo', type: 'plant_aloe', english: 'Healing Aloe Vera', fruit: 'Nhựa Dược Liệu' },
    work_career: { name: 'Trúc Phú Quý Nghề Nghiệp', type: 'plant_bamboo', english: 'Career Lucky Bamboo', fruit: 'Đốt Trúc Thăng Tiến' },
    transport: { name: 'Cây Không Khí Đô Thị', type: 'plant_air', english: 'Urban Air Plant', fruit: 'Hoa Lọc Khí' },
    crime_law: { name: 'Cây Bonsai Pháp Lý', type: 'plant_bonsai', english: 'Bonsai of Justice', fruit: 'Thế Cây Cân Bằng' },
    culture_arts: { name: 'Hoa Hồng Di Sản Cổ Điển', type: 'plant_rose', english: 'Heritage Rose', fruit: 'Đóa Hồng Cung Đình' }
  },
  pond: {
    environment: { name: 'Đàn Cá Koi Sinh Thái', type: 'fish_koi', english: 'Eco Koi School', fruit: 'Vảy Cá Hoàng Kim' },
    technology: { name: 'Cá Rồng Điện Tử', type: 'fish_dragon', english: 'Cyber Dragonfish', fruit: 'Ngọc Quang Điện' },
    education: { name: 'Cá Chép Vượt Vũ Môn', type: 'fish_carp', english: 'Scholastic Carp', fruit: 'Ngọc Trai Học Vấn' },
    society_family: { name: 'Đàn Vịt Trời Xã Hội', type: 'duck_family', english: 'Community Mallards', fruit: 'Lông Vịt Ấm Áp' },
    business: { name: 'Đàn Cá Kim Ngân Tài Lộc', type: 'fish_golden', english: 'Golden Arowana', fruit: 'Vảy Vàng Tài Lộc' },
    health: { name: 'Cá Thần Tiên Sức Khỏe', type: 'fish_angel', english: 'Healing Angelfish', fruit: 'Nước Bổ Thần Tiên' },
    work_career: { name: 'Đàn Rái Cá Năng Động', type: 'otter_work', english: 'Energetic Otters', fruit: 'Khoáng Sản Bờ Sông' },
    transport: { name: 'Thiên Nga Đô Thị', type: 'swan_urban', english: 'Urban Swans', fruit: 'Lông Vũ Tinh Khiết' },
    crime_law: { name: 'Rùa Cổ Thụ Pháp Luật', type: 'turtle_law', english: 'Ancient Law Turtle', fruit: 'Mai Rùa Kỷ Cương' },
    culture_arts: { name: 'Sen Hồng & Cá Vàng Cung Đình', type: 'fish_goldfish', english: 'Lotus & Royal Goldfish', fruit: 'Đài Sen Di Sản' }
  },
  pasture: {
    environment: { name: 'Bò Sữa Đồng Cỏ Tự Nhiên', type: 'cow_dairy', english: 'Eco Dairy Cow', fruit: 'Bình Sữa Đồng Cỏ' },
    technology: { name: 'Gà Trống Báo Thức AI', type: 'chicken_tech', english: 'Tech Rooster', fruit: 'Trứng Gà Tự Động' },
    education: { name: 'Cừu Thông Thái Trí Thức', type: 'sheep_wisdom', english: 'Wisdom Sheep', fruit: 'Len Trắng Học Thuật' },
    society_family: { name: 'Chó Chăn Cừu Thân Thiện', type: 'dog_collie', english: 'Friendly Collie', fruit: 'Chuông Gắn Kết' },
    business: { name: 'Bò Thịt Thượng Hạng', type: 'bull_angus', english: 'Prime Angus Bull', fruit: 'Thịt Thượng Hạng' },
    health: { name: 'Đàn Dê Dược Thảo', type: 'goat_health', english: 'Alpine Herb Goat', fruit: 'Sữa Dê Dược Liệu' },
    work_career: { name: 'Ngựa Chiến Sự Nghiệp', type: 'horse_career', english: 'Career Steed', fruit: 'Móng Ngựa Thành Công' },
    transport: { name: 'Lạc Đà Chuyên Chở Đô Thị', type: 'llama_transport', english: 'Urban Llama', fruit: 'Túi Hàng Vận Chuyển' },
    crime_law: { name: 'Đàn Ngỗng Canh Gác Kỷ Cương', type: 'geese_guard', english: 'Watchful Geese', fruit: 'Lông Ngỗng Trật Tự' },
    culture_arts: { name: 'Chim Trĩ Di Sản Cung Đình', type: 'pheasant_royal', english: 'Imperial Pheasant', fruit: 'Lông Trĩ Cung Đình' }
  }
};

// 10 Screen Coordinates (2 rows x 5 columns) inside each Area View
export const AREA_GRID_POSITIONS = [
  // Row 1 (5 items)
  { x: 12, y: 36 },
  { x: 30, y: 36 },
  { x: 48, y: 36 },
  { x: 66, y: 36 },
  { x: 84, y: 36 },
  // Row 2 (5 items)
  { x: 12, y: 70 },
  { x: 30, y: 70 },
  { x: 48, y: 70 },
  { x: 66, y: 70 },
  { x: 84, y: 70 }
];

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
  { id: 'fertilizer_mana', type: 'item', name: 'Bình Thủy Tinh Hồi Mana (+50 Mana)', price: 60, icon: '🔮', description: 'Hồi phục tức thì 50 Mana để luyện tập tiếp.' },
  { id: 'nutrient_soil', type: 'item', name: 'Phân Bón Sinh Học Thần Tốc', price: 90, icon: '🧪', description: 'Phục hồi cây héo úa về trạng thái xanh tốt ngay lập tức.' },
  { id: 'water_can_gold', type: 'tool', name: 'Bình Tưới Hoàng Kim', price: 200, icon: '✨', description: 'Tăng x1.5 lượng EXP nhận được khi chăm sóc cây trồng.' },
  { id: 'decor_scarecrow', type: 'decor', name: 'Bù Nhìn Rơm Oxford', price: 150, icon: '🧙‍♂️', description: 'Bảo vệ cây không bị héo thêm 2 ngày vắng mặt.' }
];

export function generateInitialAreaEntities() {
  const result = {};
  const now = Date.now();

  FARM_AREAS.forEach(area => {
    result[area.id] = FARM_TOPICS.map((topic, idx) => {
      const meta = AREA_TOPIC_NAMES[area.id]?.[topic.id] || {
        name: topic.name,
        type: 'default',
        english: topic.english,
        fruit: 'Nông sản'
      };

      const pos = AREA_GRID_POSITIONS[idx] || { x: 50, y: 50 };

      // Vary initial levels (Level 1 to 3)
      const initialLevel = (idx % 3) + 1;
      const hoursAgo = (idx * 5) % 36; // Some recently watered, some a bit thirsty

      return {
        id: `${area.id}_${topic.id}`,
        areaId: area.id,
        topicId: topic.id,
        name: meta.name,
        type: meta.type,
        english: meta.english,
        fruit: meta.fruit,
        topicName: topic.name,
        topicIcon: topic.icon,
        level: initialLevel, // 1 to 5
        exp: initialLevel * 25,
        maxExp: 100,
        status: hoursAgo > 28 ? 'thirsty' : 'healthy', // 'healthy' | 'thirsty' | 'wilting'
        lastPracticed: now - (hoursAgo * 60 * 60 * 1000),
        x: pos.x,
        y: pos.y
      };
    });
  });

  return result;
}

export function getDefaultHarvestTownState() {
  return {
    farmerName: 'Học Viên Mochi',
    bandTarget: '7.0',
    level: 1,
    xp: 80,
    
    // ONLY 2 CURRENCIES IN THE GAME:
    gold: 250, // Tiền để giao dịch (Gold Coins)
    mana: 85,  // Mana để học tập & nuôi dưỡng (0 - 100)
    maxMana: 100,

    activeArea: 'paddy', // 'paddy' (Vocab) | 'orchard' (Reading) | 'pasture' (Listening) | 'pond' (Speaking) | 'greenhouse' (Writing)
    day: 14,
    season: 'spring',
    streak: 3,
    longestStreak: 12,
    lastActiveTimestamp: Date.now(),

    // 5 Areas, each with 10 topics:
    areaEntities: generateInitialAreaEntities(),

    // Inventory
    inventory: [
      { id: 'inv_1', name: 'Hạt Giống Tri Thức', icon: '🌱', qty: 5, price: 20 },
      { id: 'inv_2', name: 'Bình Mana Nhỏ', icon: '🧪', qty: 2, price: 40 }
    ],

    // Shipping Bin
    shippingBin: []
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

    // Make sure areaEntities exists
    if (!state.areaEntities || Object.keys(state.areaEntities).length < 5) {
      state.areaEntities = generateInitialAreaEntities();
    }

    // Ensure ONLY 2 currencies exist
    if (state.mana === undefined) state.mana = 85;
    if (state.maxMana === undefined) state.maxMana = 100;
    if (state.gold === undefined) state.gold = 200;
    if (!state.activeArea) state.activeArea = 'paddy';

    // Check Inactivity & Update Wilting Status for all 10 topics across 5 areas
    const now = Date.now();
    Object.keys(state.areaEntities).forEach(areaId => {
      state.areaEntities[areaId] = state.areaEntities[areaId].map(entity => {
        const timeDiff = now - (entity.lastPracticed || (now - 24 * 60 * 60 * 1000));
        let newStatus = 'healthy';
        if (timeDiff > FOUR_DAYS_MS) {
          newStatus = 'wilting'; // Héo úa do lâu không luyện tập
        } else if (timeDiff > TWO_DAYS_MS) {
          newStatus = 'thirsty'; // Ủ rũ / khát nước
        }
        return {
          ...entity,
          status: newStatus
        };
      });
    });

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

    if (email && supabase) {
      supabase
        .from('user_profiles')
        .update({
          farm_state: state,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .then(() => {})
        .catch(() => {});
    }
  } catch (e) {
    console.error('Error saving harvest town state:', e);
  }
}

// Chăm sóc / Luyện tập một chủ đề trong khu vực
// (Tưới nước, bón phân, cho ăn, nuôi cá...)
export function nurtureTopicEntity(areaId, topicId, score = 85, email = null) {
  const state = getHarvestTownState(email);
  if (!state.areaEntities || !state.areaEntities[areaId]) {
    state.areaEntities = generateInitialAreaEntities();
  }

  const entities = state.areaEntities[areaId];
  const idx = entities.findIndex(e => e.topicId === topicId);
  if (idx === -1) return { success: false, message: 'Không tìm thấy thực thể chủ đề!' };

  const entity = entities[idx];

  // Consume 5 Mana to practice (or free if mana low)
  state.mana = Math.max(0, state.mana - 5);

  // Bonus rewards based on score
  const isGreat = score >= 80;
  const expGain = isGreat ? 50 : 30;
  const goldGain = isGreat ? 40 : 25;
  const manaRestored = isGreat ? 30 : 15; // Recover mana upon success!

  // Update entity status
  entity.status = 'healthy'; // Revive from wilting / thirsty!
  entity.lastPracticed = Date.now();
  entity.exp += expGain;

  // Level up check for entity (Max Level 5)
  let leveledUp = false;
  if (entity.exp >= entity.maxExp && entity.level < 5) {
    entity.level += 1;
    entity.exp = entity.exp - entity.maxExp;
    leveledUp = true;
  }

  // Update currencies
  state.gold += goldGain;
  state.mana = Math.min(state.maxMana, state.mana + manaRestored);
  state.xp += expGain;

  checkFarmerLevelUp(state);
  saveHarvestTownState(state, email);

  return {
    success: true,
    state,
    entity,
    leveledUp,
    goldGain,
    manaRestored,
    expGain
  };
}

// Chuyển đổi khu vực hiển thị
export function switchActiveArea(areaId, email = null) {
  const state = getHarvestTownState(email);
  const found = FARM_AREAS.find(a => a.id === areaId);
  if (!found) return { success: false, message: 'Khu vực không tồn tại!' };

  state.activeArea = areaId;
  saveHarvestTownState(state, email);
  return { success: true, state, activeArea: found };
}

// Mua sắm từ Tiệm Nông Cụ
export function buyGeneralStoreItem(itemId, email = null) {
  const state = getHarvestTownState(email);
  const item = GENERAL_STORE_CATALOG.find(i => i.id === itemId);
  if (!item) return { success: false, message: 'Không tìm thấy vật phẩm!' };

  if (state.gold < item.price) {
    return { success: false, message: `Bạn cần ${item.price} Tiền (Hiện có: ${state.gold} G)!` };
  }

  state.gold -= item.price;

  if (item.id === 'fertilizer_mana') {
    state.mana = Math.min(state.maxMana, state.mana + 50);
  } else if (item.id === 'nutrient_soil') {
    // Revive all wilting entities in current area!
    const currentList = state.areaEntities[state.activeArea] || [];
    currentList.forEach(e => {
      e.status = 'healthy';
      e.lastPracticed = Date.now();
    });
  }

  saveHarvestTownState(state, email);
  return { success: true, state, item };
}

function checkFarmerLevelUp(state) {
  const currLvl = FARM_LEVELS_CONFIG.find(l => l.level === state.level) || FARM_LEVELS_CONFIG[0];
  const nextLvl = FARM_LEVELS_CONFIG.find(l => l.level === state.level + 1);
  if (nextLvl && state.xp >= nextLvl.minXp) {
    state.level = nextLvl.level;
    state.mana = state.maxMana; // Full restore on level up!
    state.gold += 100;
    return true;
  }
  return false;
}


// =========================================================================
// SUPPORTING EXPORTS FOR LEARNING MODALS (ALMANAC, PASTURE, KITCHEN, APP)
// =========================================================================

export const LIVESTOCK_CONFIG = {
  chickens: { id: 'chickens', name: 'Đàn Gà Ngữ Pháp SVO', icon: '🐔', grammarFocus: 'Subject-Verb-Object Structure', reward: 'Trứng Vàng Ngữ Pháp' },
  cows: { id: 'cows', name: 'Đàn Bò Thì Động Từ', icon: '🐮', grammarFocus: 'Tense Mastery (Present Perfect vs Past)', reward: 'Bình Sữa Thời Gian' },
  sheep: { id: 'sheep', name: 'Đàn Cừu Mạo Từ', icon: '🐑', grammarFocus: 'Articles (a / an / the / zero)', reward: 'Len Trắng Mạo Từ' },
  bees: { id: 'bees', name: 'Tổ Ong Liên Từ', icon: '🐝', grammarFocus: 'Conjunctions & Linking Devices', reward: 'Mật Ong Gắn Kết' }
};

export const KITCHEN_RECIPES = [
  { id: 'dish_1', name: 'Món Súp Tác Động Sâu Sắc', wordA: 'profound', wordB: 'impact', collocation: 'profound impact', dish: '🍲 Bát Súp Học Thuật', bonusMana: 25 },
  { id: 'dish_2', name: 'Bánh Mì Phụ Thuộc Nặng Nề', wordA: 'heavily', wordB: 'rely', collocation: 'heavily rely', dish: '🥖 Bánh Mì Năng Lượng', bonusMana: 25 },
  { id: 'dish_3', name: 'Thịt Nướng Bùng Nổ Tranh Cãi', wordA: 'spark', wordB: 'controversy', collocation: 'spark controversy', dish: '🍖 Thịt Nướng Cao Cấp', bonusMana: 30 },
  { id: 'dish_4', name: 'Trà Xanh Vai Trò Thiết Yếu', wordA: 'vital', wordB: 'role', collocation: 'vital role', dish: '🍵 Trà Xanh Thanh Khiết', bonusMana: 20 },
  { id: 'dish_5', name: 'Salad Tăng Vọt Đột Biến', wordA: 'sharp', wordB: 'upsurge', collocation: 'sharp upsurge', dish: '🥗 Salad Tươi Mới', bonusMana: 25 }
];

export function recordLearningToFarm(skillType = 'vocab', score = 85, email = null) {
  const skillToArea = {
    reading: 'orchard',
    vocab: 'paddy',
    vocabulary: 'paddy',
    writing: 'greenhouse',
    speaking: 'pond',
    pronunciation: 'pond',
    listening: 'pasture'
  };
  const areaId = skillToArea[skillType] || 'paddy';
  const state = getHarvestTownState(email);
  const entities = state.areaEntities?.[areaId] || [];
  const targetTopicId = entities[0]?.topicId || 'environment';

  return nurtureTopicEntity(areaId, targetTopicId, score, email);
}

export function completeAlmanacRound(roundType, score = 85, email = null) {
  const state = getHarvestTownState(email);
  if (!state.almanac) {
    state.almanac = { completedRounds: {}, completedToday: false };
  }
  if (!state.almanac.completedRounds) {
    state.almanac.completedRounds = {};
  }

  state.almanac.completedRounds[roundType] = true;
  state.mana = Math.min(state.maxMana, state.mana + 25);
  state.gold += 20;
  state.xp += 30;

  const allDone = ['water', 'sunlight', 'seed', 'fertilizer'].every(r => state.almanac.completedRounds[r]);
  if (allDone) {
    state.almanac.completedToday = true;
    state.mana = state.maxMana; // Fully restored!
    state.gold += 50;
  }

  checkFarmerLevelUp(state);
  saveHarvestTownState(state, email);

  return { success: true, state, allDone };
}

export function careForLivestock(animalKey, score = 85, email = null) {
  const state = getHarvestTownState(email);
  state.mana = Math.min(state.maxMana, state.mana + 20);
  state.gold += 25;
  state.xp += 30;

  checkFarmerLevelUp(state);
  saveHarvestTownState(state, email);

  return { success: true, state, animalKey };
}

export function cookCollocationDish(wordA, wordB, email = null) {
  const state = getHarvestTownState(email);
  const found = KITCHEN_RECIPES.find(
    r => (r.wordA === wordA && r.wordB === wordB) || (r.wordA === wordB && r.wordB === wordA)
  );

  if (!found) {
    return { success: false, message: 'Hai từ này không tạo thành collocation học thuật hợp lệ!' };
  }

  state.mana = Math.min(state.maxMana, state.mana + (found.bonusMana || 25));
  state.gold += 20;
  state.xp += 25;

  checkFarmerLevelUp(state);
  saveHarvestTownState(state, email);

  return { success: true, state, dish: found };
}

// Stubs for backwards compatibility
export function plantSeed(plotId, cropKey, seedObj = null, email = null) {
  const state = getHarvestTownState(email);
  return { success: true, state };
}
export function harvestCrop(plotId, email = null) {
  const state = getHarvestTownState(email);
  return { success: true, state, isHeirloomMastered: false };
}
export function shipItemFromBackpack(inventoryId, qty = 1, email = null) {
  const state = getHarvestTownState(email);
  return { success: true, state };
}
export function settleShippingBin(email = null) {
  const state = getHarvestTownState(email);
  return { success: true, state, totalGoldEarned: 50, shippedCount: 2 };
}
export function claimCommissionReward(commissionId, email = null) {
  const state = getHarvestTownState(email);
  return { success: true, state };
}
export function clearWeedsWithRevival(email = null) {
  const state = getHarvestTownState(email);
  return { success: true, state };
}
