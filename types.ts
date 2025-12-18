export interface SnowmanStats {
  creativity: number;
  roundness: number;
  accessories: number;
  chillFactor: number;
  durability: number;
}

export interface SnowmanEntry {
  id: string;
  name: string;
  description: string;
  type: string; // e.g., "Classic", "Abstract", "Melty"
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Mythical';
  stats: SnowmanStats;
  funFact: string;
  imageUrl: string;
  stickerUrl?: string; // New field for the generated sticker image
  timestamp: number;
}

export interface GeminiAnalysisResult {
  name: string;
  description: string;
  type: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Mythical';
  stats: SnowmanStats;
  funFact: string;
}
