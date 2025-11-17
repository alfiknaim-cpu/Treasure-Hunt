// Detector tiers
export const DETECTOR_TIERS = [
  {
    id: 1,
    name: 'Basic Metal Detector',
    tier: 'basic',
    price: 0,
    requiredLevel: 1,
    detectableRarities: ['common'],
    detectionBonus: 0,
    color: 'from-gray-500 to-gray-600',
    icon: '🔍'
  },
  {
    id: 2,
    name: 'Upgraded Detector',
    tier: 'upgraded',
    price: 5000,
    requiredLevel: 10,
    detectableRarities: ['common', 'uncommon'],
    detectionBonus: 10,
    color: 'from-green-500 to-green-600',
    icon: '🔬'
  },
  {
    id: 3,
    name: 'Advanced Detector',
    tier: 'advanced',
    price: 15000,
    requiredLevel: 25,
    detectableRarities: ['common', 'uncommon', 'rare'],
    detectionBonus: 20,
    color: 'from-blue-500 to-blue-600',
    icon: '📡'
  },
  {
    id: 4,
    name: 'Professional Detector',
    tier: 'professional',
    price: 40000,
    requiredLevel: 50,
    detectableRarities: ['common', 'uncommon', 'rare', 'legendary'],
    detectionBonus: 30,
    color: 'from-purple-500 to-purple-600',
    icon: '🛰️'
  },
  {
    id: 5,
    name: 'Master Detector',
    tier: 'master',
    price: 100000,
    requiredLevel: 75,
    detectableRarities: ['common', 'uncommon', 'rare', 'legendary', 'mythic'],
    detectionBonus: 50,
    color: 'from-orange-500 to-red-600',
    icon: '⚡'
  }
];

// Shovel tiers
export const SHOVEL_TIERS = [
  {
    id: 1,
    name: 'Rusty Shovel',
    tier: 'basic',
    price: 0,
    requiredLevel: 1,
    clickRadiusBonus: 0,
    valueMultiplier: 1,
    color: 'from-gray-500 to-gray-600',
    icon: '⛏️'
  },
  {
    id: 2,
    name: 'Iron Shovel',
    tier: 'upgraded',
    price: 3000,
    requiredLevel: 5,
    clickRadiusBonus: 5,
    valueMultiplier: 1.15,
    color: 'from-slate-500 to-slate-600',
    icon: '⚒️'
  },
  {
    id: 3,
    name: 'Steel Shovel',
    tier: 'advanced',
    price: 10000,
    requiredLevel: 20,
    clickRadiusBonus: 10,
    valueMultiplier: 1.30,
    color: 'from-cyan-500 to-cyan-600',
    icon: '🔨'
  },
  {
    id: 4,
    name: 'Titanium Shovel',
    tier: 'professional',
    price: 30000,
    requiredLevel: 40,
    clickRadiusBonus: 15,
    valueMultiplier: 1.50,
    color: 'from-violet-500 to-violet-600',
    icon: '⚡'
  },
  {
    id: 5,
    name: 'Diamond Shovel',
    tier: 'master',
    price: 80000,
    requiredLevel: 65,
    clickRadiusBonus: 25,
    valueMultiplier: 2.0,
    color: 'from-pink-500 to-rose-600',
    icon: '💎'
  }
];

// Map configurations - each level has a unique map
export const MAPS = [
  {
    level: 1,
    name: 'Sunny Beach',
    itemCount: 7,
    theme: {
      background: '#D4B896',
      waterColor: '#4A9ECC',
      accentColor: '#F4A460',
      description: 'A peaceful sunny beach perfect for beginners'
    }
  },
  {
    level: 2,
    name: 'Rocky Shore',
    itemCount: 8,
    theme: {
      background: '#A89080',
      waterColor: '#2E5F75',
      accentColor: '#8B7355',
      description: 'Rocky coastline with hidden treasures'
    }
  },
  {
    level: 3,
    name: 'Golden Sands',
    itemCount: 9,
    theme: {
      background: '#E8D4A0',
      waterColor: '#5BA3C5',
      accentColor: '#D4AF37',
      description: 'Shimmering golden sands hide valuable items'
    }
  },
  {
    level: 4,
    name: 'Coral Bay',
    itemCount: 10,
    theme: {
      background: '#C9ADA7',
      waterColor: '#FF6B6B',
      accentColor: '#FF8FA3',
      description: 'Beautiful coral formations dot the beach'
    }
  },
  {
    level: 5,
    name: 'Mystic Cove',
    itemCount: 11,
    theme: {
      background: '#9D84B7',
      waterColor: '#6A4C93',
      accentColor: '#C8B8DB',
      description: 'A mysterious cove filled with ancient relics'
    }
  },
  {
    level: 6,
    name: 'Volcanic Beach',
    itemCount: 12,
    theme: {
      background: '#5A4A42',
      waterColor: '#1A535C',
      accentColor: '#FF6B35',
      description: 'Dark volcanic sand conceals rare treasures'
    }
  },
  {
    level: 7,
    name: 'Crystal Shore',
    itemCount: 13,
    theme: {
      background: '#B8D4E8',
      waterColor: '#4ECDC4',
      accentColor: '#95E1D3',
      description: 'Crystalline waters reveal sparkling treasures'
    }
  },
  {
    level: 8,
    name: 'Pirate\'s Haven',
    itemCount: 14,
    theme: {
      background: '#8B6F47',
      waterColor: '#2C3E50',
      accentColor: '#D4AF37',
      description: 'The legendary pirate hideout!'
    }
  },
  {
    level: 9,
    name: 'Emerald Coast',
    itemCount: 15,
    theme: {
      background: '#A8C69F',
      waterColor: '#52796F',
      accentColor: '#84A98C',
      description: 'Lush green coastal paradise'
    }
  },
  {
    level: 10,
    name: 'Treasure Island',
    itemCount: 16,
    theme: {
      background: '#FFD700',
      waterColor: '#4169E1',
      accentColor: '#FF8C00',
      description: 'The ultimate treasure hunting destination!'
    }
  }
];

// Get map configuration for a level
export const getMapForLevel = (level) => {
  // Cycle through maps if level exceeds available maps
  const mapIndex = ((level - 1) % MAPS.length);
  const map = MAPS[mapIndex];
  
  // For levels beyond the defined maps, increase item count
  const extraLevels = Math.floor((level - 1) / MAPS.length);
  return {
    ...map,
    level: level,
    itemCount: map.itemCount + (extraLevels * 2) // Add 2 items per cycle
  };
};

// Rarity base values - all items of same rarity worth the same
const RARITY_VALUES = {
  common: 50,
  uncommon: 200,
  rare: 1000,
  legendary: 5000,
  mythic: 25000
};

// Item database by level ranges - expanded common items
const ITEM_DATABASE = {
  1: [
    { name: 'Rusty Screw', emoji: '🔩', rarity: 'common' },
    { name: 'Old Coin', emoji: '🪙', rarity: 'common' },
    { name: 'Bottle Cap', emoji: '🍾', rarity: 'common' },
    { name: 'Old Button', emoji: '⚫', rarity: 'common' },
    { name: 'Bent Nail', emoji: '📌', rarity: 'common' },
    { name: 'Rusted Key', emoji: '🔑', rarity: 'common' },
    { name: 'Tin Can', emoji: '🥫', rarity: 'common' },
    { name: 'Broken Chain', emoji: '⛓️', rarity: 'common' },
    { name: 'Old Spoon', emoji: '🥄', rarity: 'common' },
    { name: 'Metal Ring', emoji: '⭕', rarity: 'common' },
  ],
  10: [
    { name: 'Silver Ring', emoji: '💍', rarity: 'uncommon' },
    { name: 'Old Watch', emoji: '⌚', rarity: 'uncommon' },
    { name: 'Copper Bracelet', emoji: '📿', rarity: 'uncommon' },
    { name: 'Vintage Key', emoji: '🗝️', rarity: 'uncommon' },
    { name: 'Bronze Medal', emoji: '🥉', rarity: 'uncommon' },
    { name: 'Silver Locket', emoji: '💝', rarity: 'uncommon' },
    { name: 'Brass Compass', emoji: '🧭', rarity: 'uncommon' },
    { name: 'Copper Coin', emoji: '🟤', rarity: 'uncommon' },
  ],
  25: [
    { name: 'Gold Necklace', emoji: '📿', rarity: 'rare' },
    { name: 'Ruby Ring', emoji: '💍', rarity: 'rare' },
    { name: 'Ancient Coin', emoji: '🪙', rarity: 'rare' },
    { name: 'Emerald Brooch', emoji: '💎', rarity: 'rare' },
    { name: 'Sapphire Earring', emoji: '💠', rarity: 'rare' },
    { name: 'Golden Goblet', emoji: '🏺', rarity: 'rare' },
    { name: 'Jade Pendant', emoji: '🟢', rarity: 'rare' },
  ],
  50: [
    { name: 'Pirate Treasure', emoji: '💰', rarity: 'legendary' },
    { name: 'Royal Crown', emoji: '👑', rarity: 'legendary' },
    { name: 'Diamond Ring', emoji: '💎', rarity: 'legendary' },
    { name: 'Golden Chalice', emoji: '🏆', rarity: 'legendary' },
    { name: 'Ancient Artifact', emoji: '🔱', rarity: 'legendary' },
    { name: 'Royal Scepter', emoji: '👸', rarity: 'legendary' },
  ],
  75: [
    { name: 'Excalibur Sword', emoji: '⚔️', rarity: 'mythic' },
    { name: 'Dragon Crystal', emoji: '🔮', rarity: 'mythic' },
    { name: 'Phoenix Feather', emoji: '🪶', rarity: 'mythic' },
    { name: 'Ancient Relic', emoji: '📜', rarity: 'mythic' },
    { name: 'Legendary Gem', emoji: '💠', rarity: 'mythic' },
  ]
};

// Rarity XP rewards
const RARITY_XP = {
  common: 10,
  uncommon: 30,
  rare: 80,
  legendary: 200,
  mythic: 500
};

export const calculateXP = (rarity) => {
  return RARITY_XP[rarity] || 10;
};

export const getItemValue = (rarity) => {
  return RARITY_VALUES[rarity] || 50;
};

// Combo system constants
export const COMBO_TIME_LIMIT = 10; // seconds to maintain combo
export const COMBO_MULTIPLIERS = {
  1: 1.0,
  2: 1.3,
  3: 1.6,
  5: 2.0,
  10: 3.0,
  15: 4.0,
  20: 5.0
};

export const calculateComboMultiplier = (combo) => {
  if (combo >= 20) return 5.0;
  if (combo >= 15) return 4.0;
  if (combo >= 10) return 3.0;
  if (combo >= 5) return 2.0;
  if (combo >= 3) return 1.6;
  if (combo >= 2) return 1.3;
  return 1.0;
};

export const calculateStreakBonus = (streak) => {
  // Every 5 streak = bonus XP
  const bonusTiers = Math.floor(streak / 5);
  return bonusTiers * 50; // 50 bonus XP per tier
};

// Helper function to check if positions are too close
const isTooClose = (x1, y1, x2, y2, minDistance = 80) => {
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance < minDistance;
};

export const generateItems = (playerLevel, detector) => {
  const items = [];
  let itemId = 1;
  
  // Get map configuration for this level
  const map = getMapForLevel(playerLevel);
  const itemCount = map.itemCount;
  
  // Determine which item pools to use based on level
  const availablePools = [];
  if (playerLevel >= 1) availablePools.push(...ITEM_DATABASE[1]);
  if (playerLevel >= 10) availablePools.push(...ITEM_DATABASE[10]);
  if (playerLevel >= 25) availablePools.push(...ITEM_DATABASE[25]);
  if (playerLevel >= 50) availablePools.push(...ITEM_DATABASE[50]);
  if (playerLevel >= 75) availablePools.push(...ITEM_DATABASE[75]);
  
  // Filter by detector capabilities
  const detectableItems = availablePools.filter(item => 
    detector.detectableRarities.includes(item.rarity)
  );
  
  if (detectableItems.length === 0) return items;
  
  // Generate exact number of items for this map with proper spacing
  const maxAttempts = 100; // Prevent infinite loops
  
  for (let i = 0; i < itemCount; i++) {
    const template = detectableItems[Math.floor(Math.random() * detectableItems.length)];
    const value = getItemValue(template.rarity);
    
    let x, y;
    let attempts = 0;
    let validPosition = false;
    
    // Try to find a position that doesn't overlap with existing items
    while (!validPosition && attempts < maxAttempts) {
      x = 120 + Math.random() * 660; // More centered
      y = 100 + Math.random() * 360; // Better vertical spacing
      
      // Check if this position is far enough from all existing items
      validPosition = items.every(existingItem => 
        !isTooClose(x, y, existingItem.x, existingItem.y)
      );
      
      attempts++;
    }
    
    // If we couldn't find a good position after max attempts, use the last position anyway
    if (!validPosition) {
      x = 120 + Math.random() * 660;
      y = 100 + Math.random() * 360;
    }
    
    items.push({
      id: itemId++,
      x: x,
      y: y,
      name: template.name,
      emoji: template.emoji,
      rarity: template.rarity,
      value: value,
      found: false,
      sold: false
    });
  }
  
  return items;
};