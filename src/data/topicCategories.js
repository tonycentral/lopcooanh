// 1. Definition of MASTER_TOPIC_CATEGORIES
export const MASTER_TOPIC_CATEGORIES = [
  {
    id: 'ALL',
    name: 'All Topics',
    vietnameseName: 'Tất cả chủ đề',
    shortName: 'Tất cả',
    icon: 'Layers',
    color: 'blue',
    description: 'Toàn bộ ngân hàng đề thi IELTS Writing Task 2'
  },
  {
    id: 'education',
    name: 'Education & Schooling',
    vietnameseName: 'Giáo dục & Đào tạo',
    shortName: 'Giáo dục',
    icon: 'GraduationCap',
    color: 'amber',
    description: 'Trường học, đại học, giáo viên vs AI, học phí, kỹ năng sống vs lý thuyết'
  },
  {
    id: 'technology',
    name: 'Technology & AI',
    vietnameseName: 'Công nghệ & AI',
    shortName: 'Công nghệ',
    icon: 'Cpu',
    color: 'cyan',
    description: 'Trí tuệ nhân tạo, tự động hóa, robot, mạng xã hội, thiết bị số'
  },
  {
    id: 'environment',
    name: 'Environment & Climate',
    vietnameseName: 'Môi trường & Khí hậu',
    shortName: 'Môi trường',
    icon: 'Leaf',
    color: 'emerald',
    description: 'Biến đổi khí hậu, năng lượng sạch, ô nhiễm, rác thải & sinh thái'
  },
  {
    id: 'transport',
    name: 'Transport & Urbanization',
    vietnameseName: 'Giao thông & Đô thị',
    shortName: 'Giao thông',
    icon: 'Car',
    color: 'teal',
    description: 'Hàng không, đường sắt, xe cộ, quy hoạch đô thị, nhà ở & dãn dân'
  },
  {
    id: 'health',
    name: 'Health & Wellbeing',
    vietnameseName: 'Y tế & Sức khỏe',
    shortName: 'Y tế',
    icon: 'HeartPulse',
    color: 'red',
    description: 'Y tế công cộng, sức khỏe tinh thần, tự dùng thuốc, thể dục thể thao'
  },
  {
    id: 'work_career',
    name: 'Work & Employment',
    vietnameseName: 'Việc làm & Nghề nghiệp',
    shortName: 'Việc làm',
    icon: 'Briefcase',
    color: 'indigo',
    description: 'Thị trường lao động, tuần làm 4 ngày, làm từ xa, lương bổng, tuyển dụng'
  },
  {
    id: 'business',
    name: 'Economy & Consumerism',
    vietnameseName: 'Kinh tế & Tiêu dùng',
    shortName: 'Kinh tế',
    icon: 'TrendingUp',
    color: 'violet',
    description: 'Tăng trưởng kinh tế, hàng hiệu, quảng cáo, mua sắm & doanh nghiệp'
  },
  {
    id: 'society_family',
    name: 'Society & Family',
    vietnameseName: 'Xã hội & Gia đình',
    shortName: 'Xã hội',
    icon: 'Users',
    color: 'purple',
    description: 'Già hóa dân số, nuôi dạy con, sống tự lập, người nổi tiếng'
  },
  {
    id: 'crime_law',
    name: 'Crime & Legal System',
    vietnameseName: 'Tội phạm & Pháp luật',
    shortName: 'Pháp luật',
    icon: 'Scale',
    color: 'rose',
    description: 'Hệ thống luật pháp, xử phạt, trật tự xã hội, cải tạo tù nhân'
  },
  {
    id: 'culture_arts',
    name: 'Culture, Arts & Heritage',
    vietnameseName: 'Văn hóa & Di sản',
    shortName: 'Văn hóa',
    icon: 'Landmark',
    color: 'orange',
    description: 'Bảo tàng, di tích lịch sử, kiến trúc cổ, nghệ thuật, du lịch'
  }
];

// Explicit ID overrides for all prompts and topics
const ID_OVERRIDES = {
  // 1. Education
  'T2_008': 'education',
  'T2_012': 'education',
  'T2_015': 'education',
  'T2_023': 'education',
  'T2_029': 'education',
  'T2_037': 'education',
  'T2_042': 'education',
  'T2_050': 'education',
  'T2_053': 'education',
  'T2_056': 'education',
  'T2_060': 'education',
  'T2_068': 'education',
  'T2_070': 'education',
  'T2_071': 'education',
  'T2_074': 'education',
  'T2_091': 'education',
  'T2_092': 'education',
  'higher-education-utility-2015': 'education',
  'education': 'education',

  // 2. Technology & AI
  'T2_002': 'technology',
  'T2_021': 'technology',
  'T2_022': 'technology',
  'T2_032': 'technology',
  'T2_051': 'technology',
  'T2_077': 'technology',
  'T2_093': 'technology',
  'ai-workforce-cam19': 'technology',
  'technology': 'technology',

  // 3. Environment & Climate
  'T2_001': 'environment',
  'T2_007': 'environment',
  'T2_019': 'environment',
  'T2_025': 'environment',
  'T2_038': 'environment',
  'T2_039': 'environment',
  'T2_047': 'environment',
  'T2_054': 'environment',
  'T2_062': 'environment',
  'T2_066': 'environment',
  'T2_069': 'environment',
  'T2_075': 'environment',
  'environment': 'environment',

  // 4. Transport & Urbanization
  'T2_010': 'transport',
  'T2_020': 'transport',
  'T2_024': 'transport',
  'T2_031': 'transport',
  'T2_033': 'transport',
  'T2_040': 'transport',
  'T2_059': 'transport',
  'T2_067': 'transport',
  'T2_082': 'transport',
  'transport-2025': 'transport',
  'housing-ownership-2020': 'transport',
  'transport': 'transport',

  // 5. Health & Wellbeing
  'T2_004': 'health',
  'T2_017': 'health',
  'T2_035': 'health',
  'T2_055': 'health',
  'T2_089': 'health',
  'health-2026': 'health',
  'health': 'health',

  // 6. Work & Careers
  'T2_005': 'work_career',
  'T2_014': 'work_career',
  'T2_028': 'work_career',
  'T2_034': 'work_career',
  'T2_049': 'work_career',
  'T2_076': 'work_career',
  'T2_083': 'work_career',
  'T2_095': 'work_career',
  'work-2026': 'work_career',
  'career-mobility-2021': 'work_career',
  'risk-taking-2022': 'work_career',
  'work_career': 'work_career',

  // 7. Business & Consumerism
  'T2_009': 'business',
  'T2_013': 'business',
  'T2_027': 'business',
  'T2_036': 'business',
  'T2_041': 'business',
  'T2_057': 'business',
  'T2_058': 'business',
  'T2_061': 'business',
  'T2_065': 'business',
  'T2_072': 'business',
  'T2_099': 'business',
  'youth-demographics-2017': 'business',
  'business': 'business',

  // 8. Society & Family
  'T2_003': 'society_family',
  'T2_006': 'society_family',
  'T2_018': 'society_family',
  'T2_030': 'society_family',
  'T2_043': 'society_family',
  'T2_044': 'society_family',
  'T2_045': 'society_family',
  'T2_046': 'society_family',
  'T2_080': 'society_family',
  'T2_081': 'society_family',
  'T2_084': 'society_family',
  'T2_086': 'society_family',
  'T2_094': 'society_family',
  'T2_096': 'society_family',
  'family-2026': 'society_family',
  'science-welfare-2023': 'society_family',
  'adversity-betterment-2019': 'society_family',
  'society_family': 'society_family',
  'society': 'society_family',

  // 9. Crime & Law
  'T2_011': 'crime_law',
  'T2_098': 'crime_law',
  'law-safety-2025': 'crime_law',
  'crime_law': 'crime_law',

  // 10. Culture, Arts & Heritage
  'T2_016': 'culture_arts',
  'T2_026': 'culture_arts',
  'T2_048': 'culture_arts',
  'T2_052': 'culture_arts',
  'T2_063': 'culture_arts',
  'T2_064': 'culture_arts',
  'T2_073': 'culture_arts',
  'T2_078': 'culture_arts',
  'T2_085': 'culture_arts',
  'T2_087': 'culture_arts',
  'T2_088': 'culture_arts',
  'museum-culture-2024': 'culture_arts',
  'language-barrier-2018': 'culture_arts',
  'heritage-restoration-2016': 'culture_arts',
  'culture_arts': 'culture_arts',
  'globalization': 'culture_arts',

  // Task 1 Overrides to 10 Master Categories
  // 1. Education
  'task1-top-04-further-education': 'education',
  'task1-top-03-canterbury-map': 'education',
  'task1-zim-12-student-rooms': 'education',

  // 2. Technology & AI
  'task1-top-02-wave-power': 'technology',
  'task1-top-05-radio-tv-audiences': 'technology',
  'task1-zim-13-stone-tools': 'technology',

  // 3. Environment & Climate
  'task1-line-graph': 'environment',
  'task1-process': 'environment',
  'task1-pie-chart': 'environment',
  'task1-zim-09-rainwater': 'environment',
  'task1-zim-10-stormwater': 'environment',
  'task1-zim-11-water-supply': 'environment',
  'task1-top-06-worldwide-water-use': 'environment',
  'task1-roche-06-water-cycle': 'environment',

  // 4. Transport & Urbanization
  'task1-zim-01-tunnels': 'transport',
  'task1-zim-07-city-evolution': 'transport',
  'task1-zim-08-road-safety': 'transport',

  // 5. Health & Wellbeing
  'task1-roche-03-uk-alcohol': 'health',

  // 6. Work & Careers
  'task1-zim-05-teacher-salaries': 'work_career',

  // 7. Business & Consumerism
  'task1-bar-chart': 'business',
  'task1-zim-02-fruits': 'business',
  'task1-zim-06-water-costs': 'business',
  'task1-roche-01-kpb-shares': 'business',
  'task1-roche-04-uk-spending': 'business',
  'task1-roche-05-consumer-spending': 'business',

  // 8. Society & Family
  'task1-roche-02-gulf-fertility': 'society_family',

  // 9. Crime & Law
  'task1-zim-04-driving-license': 'crime_law',

  // 10. Culture, Arts & Heritage
  'task1-zim-03-igloo': 'culture_arts',
  'task1-top-01-tourist-arrivals': 'culture_arts',
  'task1-roche-07-island-tourism': 'culture_arts'
};

const BASE_CATEGORY_MAP = {
  education: 'education',
  technology: 'technology',
  environment: 'environment',
  transport: 'transport',
  health: 'health',
  work_career: 'work_career',
  business: 'business',
  society_family: 'society_family',
  society: 'society_family',
  crime_law: 'crime_law',
  culture_arts: 'culture_arts',
  globalization: 'culture_arts'
};

/**
 * Normalizes any topic object or category key into one of the 10 Master Categories
 */
export function getMasterCategoryId(item) {
  if (!item) return 'society_family';
  if (typeof item === 'string') {
    if (ID_OVERRIDES[item]) return ID_OVERRIDES[item];
    if (BASE_CATEGORY_MAP[item]) return BASE_CATEGORY_MAP[item];
  }

  const id = item.id || '';
  if (ID_OVERRIDES[id]) return ID_OVERRIDES[id];

  const cat = item.topicCategory || item.topicId || item.category || '';
  if (ID_OVERRIDES[cat]) return ID_OVERRIDES[cat];
  if (BASE_CATEGORY_MAP[cat]) return BASE_CATEGORY_MAP[cat];

  // Smart keyword heuristic for user custom topics
  const text = `${item.name || ''} ${item.title || ''} ${item.ieltsPrompt || ''} ${item.promptText || ''}`.toLowerCase();
  if (text.includes('học') || text.includes('giáo dục') || text.includes('education') || text.includes('school') || text.includes('student') || text.includes('teacher')) return 'education';
  if (text.includes('công nghệ') || text.includes('ai') || text.includes('robot') || text.includes('internet') || text.includes('technology') || text.includes('digital')) return 'technology';
  if (text.includes('môi trường') || text.includes('climate') || text.includes('environment') || text.includes('pollution') || text.includes('energy') || text.includes('khí hậu')) return 'environment';
  if (text.includes('giao thông') || text.includes('transport') || text.includes('traffic') || text.includes('rail') || text.includes('aviation') || text.includes('đô thị') || text.includes('urban') || text.includes('housing') || text.includes('nhà ở')) return 'transport';
  if (text.includes('y tế') || text.includes('sức khỏe') || text.includes('health') || text.includes('medical') || text.includes('hospital') || text.includes('disease')) return 'health';
  if (text.includes('việc làm') || text.includes('job') || text.includes('work') || text.includes('career') || text.includes('salary') || text.includes('lương') || text.includes('tuyển dụng')) return 'work_career';
  if (text.includes('kinh tế') || text.includes('tiêu dùng') || text.includes('economy') || text.includes('business') || text.includes('quảng cáo') || text.includes('advertis') || text.includes('consumer')) return 'business';
  if (text.includes('tội phạm') || text.includes('pháp luật') || text.includes('crime') || text.includes('law') || text.includes('prison') || text.includes('police')) return 'crime_law';
  if (text.includes('văn hóa') || text.includes('di sản') || text.includes('bảo tàng') || text.includes('museum') || text.includes('art') || text.includes('heritage') || text.includes('touris') || text.includes('du lịch')) return 'culture_arts';
  return 'society_family';
}

/**
 * Returns the Master Category object for a given item or id
 */
export function getMasterCategoryMeta(item) {
  const catId = getMasterCategoryId(item);
  return MASTER_TOPIC_CATEGORIES.find(c => c.id === catId) || MASTER_TOPIC_CATEGORIES[8]; // society_family fallback
}
