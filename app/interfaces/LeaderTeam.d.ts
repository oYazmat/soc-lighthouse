import type { CharacterWithPower } from "./CharacterWithPower";
import type { FactionTeam } from "./FactionTeam";

export interface LeaderTeam {
  leaderId: number;
  team: FactionTeam | null;
  membersWithoutLeader: CharacterWithPower[];
}
