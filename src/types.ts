export interface DedicationStar {
  id: string;
  sender: string;
  message: string;
  date: string;
  color: string; // Tailwind-friendly or Hex color code
  glowColor: string; // Glow color for drop shadow
  distance: number; // Orbital distance (radius)
  angle: number; // Current angle in radians
  speed: number; // Angular speed
  size: number; // Star size in pixels
  type: 'wish' | 'memory' | 'poem' | 'gravity' | 'birthday';
  title: string;
}

export interface CosmicSettings {
  gravityForce: number; // multiplier for speed/distance
  starDustDensity: number;
  isPlayingMusic: boolean;
  volume: number;
  selectedStarId: string | null;
}
