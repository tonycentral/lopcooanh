import React from 'react';

/**
 * Harvest Town Authentic Pixel Art Trees
 * 10 Distinct Species, Custom Foliage Shapes, Bark Textures, 
 * 5 Unique Growth Stages (Sprout -> Sapling -> Lush -> Fruiting -> Ancient Golden),
 * and Dynamic Health States (Healthy, Thirsty, Wilting).
 */

export const TREE_SPECIES_CONFIG = {
  // 1. Môi trường: Cây Táo Rừng Sinh Thái
  environment: {
    id: 'apple',
    name: 'Cây Táo Sinh Thái',
    fruitName: 'Táo Đỏ',
    foliageType: 'apple_dome',
    colors: {
      primary: '#2E7D32',
      secondary: '#1B5E20',
      highlight: '#4CAF50',
      thirsty: '#9E9D24',
      wilting: '#6D5B46',
      fruit: '#E53935',
      fruitStem: '#2E7D32',
      trunk: '#6D4C41',
      bark: '#4E342E'
    }
  },

  // 2. Công nghệ: Cây Tùng / Thông Số Hóa
  technology: {
    id: 'pine',
    name: 'Cây Tùng Số Hóa',
    fruitName: 'Quả Tùng Hoàng Kim',
    foliageType: 'pine_tiers',
    colors: {
      primary: '#00695C',
      secondary: '#004D40',
      highlight: '#26A69A',
      thirsty: '#827717',
      wilting: '#545B50',
      fruit: '#FFB300',
      fruitStem: '#5D4037',
      trunk: '#4E342E',
      bark: '#3E2723'
    }
  },

  // 3. Giáo dục: Cây Sồi Trí Thức
  education: {
    id: 'oak',
    name: 'Cây Sồi Trí Thức',
    fruitName: 'Hạt Dẻ Sồi',
    foliageType: 'oak_grand',
    colors: {
      primary: '#33691E',
      secondary: '#1B5E20',
      highlight: '#689F38',
      thirsty: '#AFB42B',
      wilting: '#796B58',
      fruit: '#8D6E63',
      fruitStem: '#5D4037',
      trunk: '#5D4037',
      bark: '#3E2723'
    }
  },

  // 4. Xã hội & Đời sống: Cây Phong Đỏ
  society_family: {
    id: 'maple',
    name: 'Cây Phong Đời Sống',
    fruitName: 'Lá Phong Vàng',
    foliageType: 'maple_warm',
    colors: {
      primary: '#D84315',
      secondary: '#BF360C',
      highlight: '#FF8A65',
      thirsty: '#BCAAA4',
      wilting: '#5D4037',
      fruit: '#FFD54F',
      fruitStem: '#8D6E63',
      trunk: '#423229',
      bark: '#2A1F19'
    }
  },

  // 5. Kinh tế: Cây Liễu Kim Ngân
  business: {
    id: 'willow',
    name: 'Cây Liễu Kim Ngân',
    fruitName: 'Lê Vàng Tài Chính',
    foliageType: 'willow_weeping',
    colors: {
      primary: '#9E9D24',
      secondary: '#827717',
      highlight: '#DCE775',
      thirsty: '#A1887F',
      wilting: '#5A5043',
      fruit: '#FFCA28',
      fruitStem: '#689F38',
      trunk: '#3E2723',
      bark: '#2A1A14'
    }
  },

  // 6. Y tế & Sức khỏe: Cây Cam Dược Liệu
  health: {
    id: 'citrus',
    name: 'Cây Cam Dược Liệu',
    fruitName: 'Cam Vàng Dược Thảo',
    foliageType: 'citrus_round',
    colors: {
      primary: '#1B5E20',
      secondary: '#0D3813',
      highlight: '#43A047',
      thirsty: '#9E9D24',
      wilting: '#635342',
      fruit: '#FB8C00',
      fruitStem: '#2E7D32',
      trunk: '#795548',
      bark: '#4E342E'
    }
  },

  // 7. Việc làm: Cây Trầm Hương / Gỗ Đỏ
  work_career: {
    id: 'redwood',
    name: 'Cây Gỗ Đỏ Sự Nghiệp',
    fruitName: 'Trái Hổ Phách',
    foliageType: 'redwood_tall',
    colors: {
      primary: '#2E7D32',
      secondary: '#1B5E20',
      highlight: '#558B2F',
      thirsty: '#8D6E63',
      wilting: '#4E342E',
      fruit: '#FF8F00',
      fruitStem: '#3E2723',
      trunk: '#8D4004',
      bark: '#5D2B03'
    }
  },

  // 8. Giao thông: Cây Bách Đô Thị
  transport: {
    id: 'cypress',
    name: 'Cây Bách Đô Thị',
    fruitName: 'Hạt Quả Bách',
    foliageType: 'cypress_column',
    colors: {
      primary: '#004D40',
      secondary: '#00332C',
      highlight: '#00796B',
      thirsty: '#607D8B',
      wilting: '#455A64',
      fruit: '#80CBC4',
      fruitStem: '#004D40',
      trunk: '#4E342E',
      bark: '#37241E'
    }
  },

  // 9. Pháp luật: Cây Tuyết Tùng Công Lý
  crime_law: {
    id: 'cedar',
    name: 'Tuyết Tùng Kỷ Cương',
    fruitName: 'Quả Tuyết Tùng',
    foliageType: 'cedar_shelves',
    colors: {
      primary: '#37474F',
      secondary: '#263238',
      highlight: '#607D8B',
      thirsty: '#78909C',
      wilting: '#455A64',
      fruit: '#FFD700',
      fruitStem: '#263238',
      trunk: '#5D4037',
      bark: '#3E2723'
    }
  },

  // 10. Văn hóa: Cây Anh Đào Cung Đình
  culture_arts: {
    id: 'cherry',
    name: 'Anh Đào Di Sản',
    fruitName: 'Quả Anh Đào',
    foliageType: 'cherry_blossom',
    colors: {
      primary: '#F06292',
      secondary: '#C2185B',
      highlight: '#F8BBD0',
      thirsty: '#B0BEC5',
      wilting: '#78909C',
      fruit: '#D81B60',
      fruitStem: '#880E4F',
      trunk: '#3E2723',
      bark: '#2A1810'
    }
  }
};

export default function HarvestTownTree({
  topicId = 'environment',
  level = 1,
  status = 'healthy',
  isNearby = false
}) {
  const config = TREE_SPECIES_CONFIG[topicId] || TREE_SPECIES_CONFIG.environment;
  const isWilting = status === 'wilting';
  const isThirsty = status === 'thirsty';

  const foliageColor = isWilting 
    ? config.colors.wilting 
    : isThirsty 
    ? config.colors.thirsty 
    : config.colors.primary;

  const shadowColor = isWilting 
    ? '#3E3428' 
    : isThirsty 
    ? '#555217' 
    : config.colors.secondary;

  const highlightColor = isWilting 
    ? '#8D7E6C' 
    : isThirsty 
    ? '#D4E157' 
    : config.colors.highlight;

  const trunkColor = isWilting ? '#423630' : config.colors.trunk;
  const barkColor = isWilting ? '#2C221D' : config.colors.bark;

  // Render by Growth Level (1 to 5)
  return (
    <div className={`relative flex flex-col items-center justify-end select-none group transition-transform duration-300 ${isNearby ? 'scale-105' : ''}`}>
      
      {/* Soil Mound Base with Grass Tufts and Dropped Leaves */}
      <div className="absolute -bottom-1 w-20 h-7 rounded-full bg-black/45 blur-[1.5px] pointer-events-none" />
      
      {/* Ground Mound / Rich Earth Plate */}
      <svg className="absolute -bottom-1 w-24 h-7 pointer-events-none" viewBox="0 0 96 28">
        {/* Dirt patch */}
        <ellipse cx="48" cy="14" rx="42" ry="10" fill="#3E271B" opacity="0.9" />
        <ellipse cx="48" cy="14" rx="36" ry="7" fill="#5D3A24" opacity="0.8" />
        <ellipse cx="48" cy="13" rx="26" ry="4" fill="#6F462C" opacity="0.6" />
        
        {/* Grass tufts around tree base */}
        <path d="M 22 14 L 20 8 L 24 13 M 24 13 L 26 7 L 27 14" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 70 15 L 72 9 L 74 15 M 74 15 L 76 8 L 77 15" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Fallen petals / leaves / fruit on ground */}
        {level >= 3 && (
          <>
            <circle cx="34" cy="16" r="2" fill={config.colors.fruit} opacity="0.8" />
            <circle cx="62" cy="16" r="1.5" fill={config.colors.fruit} opacity="0.7" />
          </>
        )}
      </svg>

      {/* =========================================================================
          STAGE 1: LEVEL 1 (MẦM CÂY / SPROUT)
          ========================================================================= */}
      {level === 1 && (
        <div className="relative w-20 h-24 flex flex-col items-center justify-end pb-2">
          <svg className="w-16 h-20" viewBox="0 0 64 80">
            {/* Wooden Stake */}
            <rect x="22" y="38" width="4" height="34" fill="#8D6E63" rx="1" />
            <polygon points="22,72 26,72 24,78" fill="#5D4037" />

            {/* Little Wooden Topic Signboard */}
            <rect x="10" y="24" width="28" height="15" fill="#5D4037" stroke="#3E2723" strokeWidth="1.5" rx="2" />
            <rect x="12" y="26" width="24" height="11" fill="#795548" rx="1" />
            <line x1="14" y1="31" x2="34" y2="31" stroke="#FFD54F" strokeWidth="1.2" strokeDasharray="2 1" />

            {/* Tiny Sprout Stem */}
            <path d="M 38 72 Q 40 54 36 44" stroke="#558B2F" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Baby Leaves */}
            <path d="M 36 44 C 30 38 32 30 40 34 C 44 38 40 44 36 44 Z" fill={foliageColor} stroke={shadowColor} strokeWidth="1" />
            <path d="M 37 48 C 44 46 48 40 46 34 C 40 34 38 42 37 48 Z" fill={highlightColor} stroke={shadowColor} strokeWidth="0.8" />

            {/* Tiny Water Droplets / Dew */}
            <circle cx="37" cy="35" r="1.2" fill="#E0F7FA" />
          </svg>
        </div>
      )}

      {/* =========================================================================
          STAGE 2: LEVEL 2 (CÂY NON / YOUNG SAPLING)
          ========================================================================= */}
      {level === 2 && (
        <div className="relative w-24 h-28 flex flex-col items-center justify-end pb-2">
          <svg className="w-20 h-26" viewBox="0 0 80 104">
            {/* Trunk with Bamboo Support Stake */}
            <line x1="32" y1="56" x2="30" y2="94" stroke="#795548" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="68" x2="39" y2="68" stroke="#FFE082" strokeWidth="1.5" />
            
            {/* Sapling Trunk */}
            <path d="M 38 96 Q 39 74 40 56 Q 41 46 38 38" stroke={trunkColor} strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 40 56 Q 46 50 49 46" stroke={trunkColor} strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Emerging Young Canopy Shape */}
            <ellipse cx="40" cy="36" rx="22" ry="18" fill={shadowColor} />
            <ellipse cx="38" cy="32" rx="20" ry="17" fill={foliageColor} />
            <ellipse cx="35" cy="28" rx="14" ry="11" fill={highlightColor} opacity="0.9" />

            {/* Branch Details */}
            <circle cx="30" cy="36" r="8" fill={foliageColor} />
            <circle cx="48" cy="36" r="9" fill={foliageColor} />
            <circle cx="36" cy="22" r="10" fill={highlightColor} />
          </svg>
        </div>
      )}

      {/* =========================================================================
          STAGE 3, 4, 5: MATURE TREES (SPECIES SPECIFIC HIGH-FIDELITY SILHOUETTES)
          ========================================================================= */}
      {level >= 3 && (
        <div className="relative w-28 sm:w-32 h-36 sm:h-40 flex flex-col items-center justify-end pb-2">
          
          {/* Level 5 Ancient Golden Halo Particle Ring */}
          {level === 5 && !isWilting && (
            <div className="absolute inset-0 rounded-full border-2 border-yellow-300/40 animate-pulse pointer-events-none scale-110 shadow-[0_0_24px_rgba(255,215,0,0.4)]" />
          )}

          {/* SVG RENDERING PER FOLIAGE TYPE */}
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 144">
            <defs>
              {/* Dynamic Gradient for Depth */}
              <linearGradient id={`grad_${config.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={highlightColor} />
                <stop offset="60%" stopColor={foliageColor} />
                <stop offset="100%" stopColor={shadowColor} />
              </linearGradient>

              {/* Bark Gradient */}
              <linearGradient id={`bark_${config.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={barkColor} />
                <stop offset="50%" stopColor={trunkColor} />
                <stop offset="100%" stopColor={barkColor} />
              </linearGradient>
            </defs>

            {/* ==========================================
                TRUNK & ROOTS (ORGANIC GNARLY PIXEL WOOD)
                ========================================== */}
            {/* Left Root Flare */}
            <path d="M 52 136 C 44 136 34 138 32 140 C 36 137 46 133 54 126 Z" fill={barkColor} />
            {/* Right Root Flare */}
            <path d="M 68 136 C 76 136 86 138 88 140 C 84 137 74 133 66 126 Z" fill={barkColor} />
            
            {/* Main Trunk Body */}
            <path d="M 50 136 Q 52 98 46 64 L 74 64 Q 68 98 70 136 Z" fill={`url(#bark_${config.id})`} stroke={barkColor} strokeWidth="1.5" />
            
            {/* Bark Striations & Knots */}
            <path d="M 56 128 Q 58 114 55 104" stroke={barkColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M 65 120 Q 64 108 67 96" stroke={barkColor} strokeWidth="1.8" strokeLinecap="round" />
            <ellipse cx="60" cy="112" rx="2.5" ry="4" fill={barkColor} />

            {/* Branch Arms peeking into canopy */}
            <path d="M 50 78 Q 38 68 32 58" stroke={trunkColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M 70 76 Q 82 66 88 56" stroke={trunkColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M 60 70 Q 60 52 58 44" stroke={trunkColor} strokeWidth="7" strokeLinecap="round" />

            {/* =====================================================================
                SPECIES 1: PINE TIERS (CONIFER / FIR - CÔNG NGHỆ)
                ===================================================================== */}
            {config.foliageType === 'pine_tiers' && (
              <g>
                {/* Tier 3 (Bottom Layer) */}
                <polygon points="60,38 12,88 38,88 20,102 100,102 82,88 108,88" fill={shadowColor} />
                <polygon points="60,34 16,84 40,84 24,98 96,98 80,84 104,84" fill={foliageColor} />
                
                {/* Tier 2 (Middle Layer) */}
                <polygon points="60,20 22,66 42,66 30,78 90,78 78,66 98,66" fill={shadowColor} />
                <polygon points="60,16 26,62 44,62 34,74 86,74 76,62 94,62" fill={`url(#grad_${config.id})`} />

                {/* Tier 1 (Top Spire) */}
                <polygon points="60,2 38,44 82,44" fill={shadowColor} />
                <polygon points="60,0 40,40 80,40" fill={highlightColor} />
                <polygon points="60,0 52,40 68,40" fill="#FFFFFF" opacity="0.15" />
              </g>
            )}

            {/* =====================================================================
                SPECIES 2: MAPLE WARM (CANADIAN JAGGED MAPLE - XÃ HỘI)
                ===================================================================== */}
            {config.foliageType === 'maple_warm' && (
              <g>
                {/* Shadow Back Canopy */}
                <path d="M 60 14 C 36 12 16 32 18 56 C 14 74 34 94 60 94 C 86 94 106 74 102 56 C 104 32 84 12 60 14 Z" fill={shadowColor} />
                
                {/* Jagged Lobes (Maple Silhouette) */}
                <path d="M 60 10 L 72 26 L 88 18 L 84 36 L 104 42 L 92 58 L 102 74 L 84 76 L 78 92 L 60 84 L 42 92 L 36 76 L 18 74 L 28 58 L 16 42 L 36 36 L 32 18 L 48 26 Z" fill={`url(#grad_${config.id})`} stroke={shadowColor} strokeWidth="1.5" />
                
                {/* Inner Highlight Leaf Clumps */}
                <circle cx="46" cy="42" r="16" fill={highlightColor} opacity="0.6" />
                <circle cx="74" cy="44" r="15" fill={highlightColor} opacity="0.7" />
                <circle cx="60" cy="30" r="14" fill="#FFCC80" opacity="0.5" />
              </g>
            )}

            {/* =====================================================================
                SPECIES 3: CHERRY BLOSSOM SAKURA (BILLOWING CLOUDS - VĂN HÓA)
                ===================================================================== */}
            {config.foliageType === 'cherry_blossom' && (
              <g>
                {/* Deep Pink Shadow Base */}
                <circle cx="36" cy="62" r="22" fill={shadowColor} />
                <circle cx="84" cy="62" r="22" fill={shadowColor} />
                <circle cx="60" cy="40" r="28" fill={shadowColor} />

                {/* Soft Midtone Blossoms */}
                <circle cx="38" cy="58" r="21" fill={foliageColor} />
                <circle cx="82" cy="58" r="21" fill={foliageColor} />
                <circle cx="60" cy="36" r="27" fill={foliageColor} />
                <circle cx="34" cy="38" r="18" fill={foliageColor} />
                <circle cx="86" cy="38" r="18" fill={foliageColor} />

                {/* Fluffy White-Pink Highlights */}
                <circle cx="58" cy="24" r="18" fill={highlightColor} />
                <circle cx="42" cy="34" r="14" fill={highlightColor} />
                <circle cx="78" cy="34" r="14" fill={highlightColor} />
                <circle cx="62" cy="38" r="16" fill="#FFF0F5" opacity="0.6" />

                {/* Drifting Petals in Wind */}
                <ellipse cx="20" cy="74" rx="3" ry="1.5" fill="#F48FB1" transform="rotate(-20 20 74)" />
                <ellipse cx="98" cy="80" rx="2.5" ry="1.2" fill="#F48FB1" transform="rotate(30 98 80)" />
                <ellipse cx="106" cy="98" rx="2" ry="1" fill="#F8BBD0" transform="rotate(15 106 98)" />
              </g>
            )}

            {/* =====================================================================
                SPECIES 4: WEEPING WILLOW (CASCADING TENDRILS - KINH TẾ)
                ===================================================================== */}
            {config.foliageType === 'willow_weeping' && (
              <g>
                {/* Crown Core */}
                <ellipse cx="60" cy="34" rx="34" ry="24" fill={shadowColor} />
                <ellipse cx="60" cy="30" rx="30" ry="20" fill={`url(#grad_${config.id})`} />

                {/* Cascading Willow Drooping Vines */}
                {/* Left Tendrils */}
                <path d="M 32 36 Q 24 64 26 94 Q 28 66 36 38" fill={shadowColor} />
                <path d="M 28 34 Q 20 62 22 90 Q 24 64 32 36" fill={foliageColor} />
                <path d="M 40 40 Q 34 70 36 96 Q 38 72 44 42" fill={highlightColor} />

                {/* Center Tendrils */}
                <path d="M 52 42 Q 48 76 50 102 Q 54 78 56 44" fill={foliageColor} />
                <path d="M 64 42 Q 68 76 66 104 Q 64 78 60 44" fill={highlightColor} />

                {/* Right Tendrils */}
                <path d="M 76 40 Q 82 70 80 96 Q 78 72 72 42" fill={shadowColor} />
                <path d="M 88 34 Q 96 62 94 92 Q 92 64 84 36" fill={foliageColor} />
                <path d="M 84 36 Q 92 64 90 96 Q 88 66 80 38" fill={highlightColor} />
              </g>
            )}

            {/* =====================================================================
                SPECIES 5: CYPRESS COLUMNAR (TALL SLENDER SPHEROID - GIAO THÔNG)
                ===================================================================== */}
            {config.foliageType === 'cypress_column' && (
              <g>
                {/* Slender Flame/Column Silhouette */}
                <path d="M 60 6 C 44 26 38 58 40 102 L 80 102 C 82 58 76 26 60 6 Z" fill={shadowColor} />
                <path d="M 60 8 C 46 28 42 58 44 100 L 76 100 C 78 58 74 28 60 8 Z" fill={`url(#grad_${config.id})`} />
                <path d="M 60 10 C 52 30 50 60 52 98 L 68 98 C 70 60 68 30 60 10 Z" fill={highlightColor} opacity="0.6" />
                
                {/* Vertical Feathered Foliage Texture */}
                <line x1="50" y1="36" x2="52" y2="78" stroke={highlightColor} strokeWidth="1.5" strokeDasharray="6 4" />
                <line x1="68" y1="42" x2="66" y2="84" stroke={shadowColor} strokeWidth="1.5" strokeDasharray="5 3" />
              </g>
            )}

            {/* =====================================================================
                SPECIES 6: CEDAR SHELVES (PAGODA HORIZONTAL SHELVES - PHÁP LUẬT)
                ===================================================================== */}
            {config.foliageType === 'cedar_shelves' && (
              <g>
                {/* Tier 1 Top Shelf */}
                <ellipse cx="60" cy="18" rx="22" ry="9" fill={shadowColor} />
                <ellipse cx="60" cy="16" rx="20" ry="7" fill={highlightColor} />

                {/* Tier 2 Middle Left Shelf */}
                <ellipse cx="44" cy="38" rx="28" ry="10" fill={shadowColor} />
                <ellipse cx="44" cy="35" rx="26" ry="8" fill={`url(#grad_${config.id})`} />

                {/* Tier 2 Middle Right Shelf */}
                <ellipse cx="76" cy="48" rx="28" ry="10" fill={shadowColor} />
                <ellipse cx="76" cy="45" rx="26" ry="8" fill={`url(#grad_${config.id})`} />

                {/* Tier 3 Wide Low Shelf */}
                <ellipse cx="58" cy="72" rx="42" ry="12" fill={shadowColor} />
                <ellipse cx="58" cy="68" rx="40" ry="10" fill={`url(#grad_${config.id})`} />
                <ellipse cx="54" cy="66" rx="26" ry="6" fill={highlightColor} opacity="0.7" />
              </g>
            )}

            {/* =====================================================================
                DEFAULT / DOME / OAK / CITRUS / APPLE (LUSH LAYERED ORCHARD CROWNS)
                ===================================================================== */}
            {(config.foliageType === 'apple_dome' || 
              config.foliageType === 'oak_grand' || 
              config.foliageType === 'citrus_round' || 
              config.foliageType === 'redwood_tall') && (
              <g>
                {/* Shadow Base Clusters */}
                <circle cx="40" cy="62" r="24" fill={shadowColor} />
                <circle cx="80" cy="62" r="24" fill={shadowColor} />
                <circle cx="60" cy="44" r="32" fill={shadowColor} />
                <circle cx="34" cy="44" r="20" fill={shadowColor} />
                <circle cx="86" cy="44" r="20" fill={shadowColor} />

                {/* Midtone Foliage Body */}
                <circle cx="42" cy="58" r="22" fill={foliageColor} />
                <circle cx="78" cy="58" r="22" fill={foliageColor} />
                <circle cx="60" cy="40" r="30" fill={foliageColor} />
                <circle cx="36" cy="40" r="18" fill={foliageColor} />
                <circle cx="84" cy="40" r="18" fill={foliageColor} />
                <circle cx="60" cy="24" r="18" fill={foliageColor} />

                {/* Highlight Canopy Tops & Sunlit Leaf Clusters */}
                <circle cx="56" cy="20" r="14" fill={highlightColor} />
                <circle cx="42" cy="34" r="14" fill={highlightColor} />
                <circle cx="76" cy="34" r="14" fill={highlightColor} />
                <circle cx="60" cy="36" r="16" fill={highlightColor} opacity="0.7" />
              </g>
            )}

            {/* =====================================================================
                HARVESTABLE FRUITS & NUTS (LEVEL 4 & 5)
                ===================================================================== */}
            {level >= 4 && !isWilting && (
              <g className="filter drop-shadow">
                {/* Fruit 1 */}
                <circle cx="34" cy="48" r="4.5" fill={config.colors.fruit} stroke={config.colors.fruitStem} strokeWidth="1" />
                <circle cx="33" cy="46" r="1.5" fill="#FFFFFF" opacity="0.7" />
                <path d="M 34 44 Q 36 41 39 42" stroke="#2E7D32" strokeWidth="1.2" fill="none" />

                {/* Fruit 2 */}
                <circle cx="78" cy="46" r="4.5" fill={config.colors.fruit} stroke={config.colors.fruitStem} strokeWidth="1" />
                <circle cx="77" cy="44" r="1.5" fill="#FFFFFF" opacity="0.7" />
                <path d="M 78 42 Q 80 39 83 40" stroke="#2E7D32" strokeWidth="1.2" fill="none" />

                {/* Fruit 3 */}
                <circle cx="58" cy="30" r="4.5" fill={config.colors.fruit} stroke={config.colors.fruitStem} strokeWidth="1" />
                <circle cx="57" cy="28" r="1.5" fill="#FFFFFF" opacity="0.7" />

                {/* Fruit 4 */}
                <circle cx="46" cy="68" r="4" fill={config.colors.fruit} stroke={config.colors.fruitStem} strokeWidth="0.8" />
                <circle cx="45" cy="66" r="1.2" fill="#FFFFFF" opacity="0.7" />

                {/* Fruit 5 */}
                <circle cx="72" cy="68" r="4" fill={config.colors.fruit} stroke={config.colors.fruitStem} strokeWidth="0.8" />
                <circle cx="71" cy="66" r="1.2" fill="#FFFFFF" opacity="0.7" />

                {/* Extra Fruit for Level 5 Ancient */}
                {level === 5 && (
                  <>
                    <circle cx="60" cy="52" r="5" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
                    <circle cx="59" cy="50" r="1.8" fill="#FFFFFF" opacity="0.9" />
                  </>
                )}
              </g>
            )}

            {/* Level 5 Ancient Tree Crown Aura / Ribbons */}
            {level === 5 && !isWilting && (
              <g className="animate-bounce">
                <polygon points="60,-8 64,-2 70,-2 66,2 68,8 60,4 52,8 54,2 50,-2 56,-2" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
                <circle cx="60" cy="1" r="2" fill="#E91E63" />
              </g>
            )}
          </svg>
        </div>
      )}

      {/* =========================================================================
          HEALTH STATUS ALERTS (FLOATING RETRO BUBBLES)
          ========================================================================= */}
      {isWilting && (
        <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500 text-rose-200 font-pixel text-[8px] animate-bounce z-20 shadow-lg flex items-center gap-1">
          <span>🥀</span>
          <span>HÉO ÚA</span>
        </div>
      )}

      {isThirsty && (
        <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-amber-950 border border-amber-400 text-amber-200 font-pixel text-[8px] animate-bounce z-20 shadow-lg flex items-center gap-1">
          <span>💧</span>
          <span>KHÁT NƯỚC</span>
        </div>
      )}

      {/* =========================================================================
          AUTHENTIC HARVEST TOWN WOODEN GARDEN PLAQUE (COMPACT & BEAUTIFUL)
          ========================================================================= */}
      <div className="mt-1 text-center pointer-events-none z-10">
        <div className="px-2 py-0.5 rounded-md bg-[#2D160A]/95 border border-[#5E3219] shadow-md flex flex-col items-center">
          {/* Tree Name */}
          <div className="font-pixel text-[8.5px] sm:text-[9.5px] text-amber-200 font-bold tracking-wide truncate max-w-[105px]">
            {config.name}
          </div>

          {/* Stars & Level Indicator */}
          <div className="flex items-center gap-1 text-[7.5px] font-pixel leading-none mt-0.5">
            <span className="text-amber-400 font-black">
              {'★'.repeat(level)}{'☆'.repeat(5 - level)}
            </span>
            <span className={`text-[7px] font-bold ${
              isWilting ? 'text-rose-400' : isThirsty ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {isWilting ? 'Héo úa' : isThirsty ? 'Khát' : 'Tươi tốt'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
