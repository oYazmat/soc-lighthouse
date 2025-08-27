import type { Character } from "./character";
import type { LighthouseSpot } from "./LighthouseSpot";
import type { FilledCharacter } from "./FilledCharacter";

export interface MatchedSpot extends LighthouseSpot {
  selectedChar: FilledCharacter;
}
