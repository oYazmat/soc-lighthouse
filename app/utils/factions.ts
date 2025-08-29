import type { LeaderTeam } from "~/interfaces/LeaderTeam";
import { FACTIONS } from "./data-loader";

// Helper to get common faction (not ignored)
export const getTeamFaction = (team: LeaderTeam | undefined) => {
  if (!team || !team.team?.characters.length) return undefined;

  const members = team.team.characters;

  // Only keep non-ignored factions
  const validFactions = FACTIONS.filter((f) => !f.ignored).map((f) => f.name);

  // Start with the first member's factions
  let common = members[0].factions.filter((f) => validFactions.includes(f));

  // Intersect with the rest of members' factions
  for (let i = 1; i < members.length; i++) {
    common = common.filter((f) => members[i].factions.includes(f));
    if (common.length === 0) break;
  }

  return common[0] ?? undefined; // pick first common valid faction, or undefined if none
};
