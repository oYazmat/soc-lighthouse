import type { Character } from "./character";
import type { LighthouseSpot } from "./LighthouseSpot";

export interface MatchedSpot extends LighthouseSpot {
  selectedChar: Character & { stars: number; rank: number };
}
