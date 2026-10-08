export const MASTER_TOPIC_CATEGORIES = [
  {
    id: 'ALL',
    name: 'All Topics',
    vietnameseName: 'Tất cả chủ đề',
    shortName: 'Tất cả',
    icon: 'Layers',
    color: 'blue',
    description: 'Toàn bộ ngân hàng đề thi IELTS Writing'
  },
  {
    id: 'education',
    name: 'Education & Schooling',
    vietnameseName: 'Giáo dục & Học đường',
    shortName: 'Giáo dục',
    icon: 'GraduationCap',
    color: 'amber',
    description: 'Trường học, đại học, giáo viên vs AI, học phí, phương pháp học, kỹ năng sống'
  },
  {
    id: 'technology',
    name: 'Technology & Artificial Intelligence',
    vietnameseName: 'Công nghệ & AI',
    shortName: 'Công nghệ & AI',
    icon: 'Cpu',
    color: 'cyan',
    description: 'Trí tuệ nhân tạo, tự động hóa, mạng xã hội, thiết bị thông minh, công nghệ số'
  },
  {
    id: 'environment',
    name: 'Environment & Transportation',
    vietnameseName: 'Môi trường & Giao thông',
    shortName: 'Môi trường',
    icon: 'Leaf',
    color: 'emerald',
    description: 'Biến đổi khí hậu, năng lượng sạch, ô nhiễm, hàng không, xe cộ, sinh thái'
  },
  {
    id: 'society',
    name: 'Society, Health & Modern Lifestyle',
    vietnameseName: 'Xã hội, Y tế & Lối sống',
    shortName: 'Xã hội & Y tế',
    icon: 'Users',
    color: 'purple',
    description: 'Già hóa dân số, y tế cộng đồng, sức khỏe tinh thần, gia đình, đô thị hóa, văn hóa'
  },
  {
    id: 'economy_law',
    name: 'Economy, Career & Law',
    vietnameseName: 'Kinh tế, Việc làm & Pháp luật',
    shortName: 'Kinh tế & Luật',
    icon: 'Scale',
    color: 'rose',
    description: 'Thị trường lao động, tuần làm 4 ngày, kinh doanh, tiêu dùng, tội phạm & luật pháp'
  }
];

// Specific prompt & topic ID overrides for optimal categorization
const ID_OVERRIDES = {
  // Transport & Green Infrastructure -> environment
  'T2_010': 'environment',
  'T2_059': 'environment',
  'T2_067': 'environment',
  'transport-2025': 'environment',

  // Tech & Digital -> technology
  'T2_002': 'technology',
  'T2_021': 'technology',
  'T2_022': 'technology',
  'T2_032': 'technology',
  'T2_051': 'technology',
  'T2_077': 'technology',
  'T2_093': 'technology',
  'ai-workforce-cam19': 'technology',

  // Economy, Career & Law -> economy_law
  'T2_005': 'economy_law',
  'T2_009': 'economy_law',
  'T2_011': 'economy_law',
  'T2_013': 'economy_law',
  'T2_014': 'economy_law',
  'T2_027': 'economy_law',
  'T2_028': 'economy_law',
  'T2_034': 'economy_law',
  'T2_036': 'economy_law',
  'T2_041': 'economy_law',
  'T2_049': 'economy_law',
  'T2_057': 'economy_law',
  'T2_058': 'economy_law',
  'T2_061': 'economy_law',
  'T2_065': 'economy_law',
  'T2_072': 'economy_law',
  'T2_076': 'economy_law',
  'T2_083': 'economy_law',
  'work-2026': 'economy_law',
  'career-mobility-2021': 'economy_law',
  'law-safety-2025': 'economy_law',
  'risk-taking-2022': 'economy_law',
  'youth-demographics-2017': 'economy_law',

  // Education -> education
  'higher-education-utility-2015': 'education',

  // Society, Health & Culture -> society
  'health-2026': 'society',
  'family-2026': 'society',
  'museum-culture-2024': 'society',
  'science-welfare-2023': 'society',
  'housing-ownership-2020': 'society',
  'adversity-betterment-2019': 'society',
  'language-barrier-2018': 'society',
  'heritage-restoration-2016': 'society'
};

const BASE_CATEGORY_MAP = {
  education: 'education',
  technology: 'technology',
  environment: 'environment',
  society: 'society',
  health: 'society',
  globalization: 'society',
  work_career: 'economy_law',
  business: 'economy_law',
  crime_law: 'economy_law',
  economy_law: 'economy_law'
};

/**
 * Normalizes any topic object or category key into one of the 5 Master Categories
 * ('education' | 'technology' | 'environment' | 'society' | 'economy_law')
 */
export function getMasterCategoryId(item) {
  if (!item) return 'society';
  if (typeof item === 'string') {
    if (ID_OVERRIDES[item]) return ID_OVERRIDES[item];
    if (BASE_CATEGORY_MAP[item]) return BASE_CATEGORY_MAP[item];
  }

  const id = item.id || '';
  if (ID_OVERRIDES[id]) return ID_OVERRIDES[id];

  const cat = item.topicCategory || item.topicId || item.category || '';
  if (ID_OVERRIDES[cat]) return ID_OVERRIDES[cat];
  if (BASE_CATEGORY_MAP[cat]) return BASE_CATEGORY_MAP[cat];

  // Smart heuristic for custom topics
  const text = `${item.name || ''} ${item.title || ''} ${item.ieltsPrompt || ''} ${item.promptText || ''}`.toLowerCase();
  if (text.includes('học') || text.includes('giáo dục') || text.includes('education') || text.includes('school') || text.includes('student') || text.includes('teacher') || text.includes('curriculum')) {
    return 'education';
  }
  if (text.includes('công nghệ') || text.includes('ai') || text.includes('trí tuệ nhân tạo') || text.includes('robot') || text.includes('internet') || text.includes('technology') || text.includes('digital') || text.includes('smartphone')) {
    return 'technology';
  }
  if (text.includes('môi trường') || text.includes('climate') || text.includes('environment') || text.includes('pollution') || text.includes('energy') || text.includes('khí hậu') || text.includes('rác') || text.includes('transport') || text.includes('giao thông') || text.includes('aviation') || text.includes('hàng không')) {
    return 'environment';
  }
  if (text.includes('kinh tế') || text.includes('việc làm') || text.includes('tiêu dùng') || text.includes('tội phạm') || text.includes('pháp luật') || text.includes('economy') || text.includes('job') || text.includes('work') || text.includes('business') || text.includes('crime') || text.includes('law')) {
    return 'economy_law';
  }
  return 'society';
}

/**
 * Returns the Master Category object for a given item or id
 */
export function getMasterCategoryMeta(item) {
  const catId = getMasterCategoryId(item);
  return MASTER_TOPIC_CATEGORIES.find(c => c.id === catId) || MASTER_TOPIC_CATEGORIES[4];
}
