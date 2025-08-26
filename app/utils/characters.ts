import type { Character } from "~/interfaces/character";
import type { CharacterState } from "~/interfaces/CharacterState";
import type { CharacterWithPower } from "~/interfaces/CharacterWithPower";
import { RANK_POWERS, RARITY_AND_STARS_POWERS, FACTIONS } from "./data-loader";
import type { FactionTeam } from "~/interfaces/FactionTeam";

export function calculateOwnedCharacterPower(
  ownedCharacters: Character[],
  characterState: Record<number, CharacterState>
): CharacterWithPower[] {
  return ownedCharacters.map((char) => {
    const charState = characterState[char.id];
    const basePower =
      RANK_POWERS.find((r) => r.rank === charState.rank)?.power ?? 0;
    const powerPercent =
      RARITY_AND_STARS_POWERS.find(
        (r) => r.rarity === char.rarity && r.stars === charState.stars
      )?.powerPercent ?? 0;

    // filter out ignored factions
    const filteredFactions = char.factions.filter((f) =>
      FACTIONS.find((fa) => fa.name === f && !fa.ignored)
    );

    return {
      id: char.id,
      name: char.name,
      factions: filteredFactions,
      basePower,
      powerPercent,
    };
  });
}

// Helper to generate combinations of given size
function combinations<T>(array: T[], size: number): T[][] {
  if (size === 0) return [[]];
  if (array.length === 0) return [];
  const [first, ...rest] = array;
  const withFirst = combinations(rest, size - 1).map((c) => [first, ...c]);
  const withoutFirst = combinations(rest, size);
  return withFirst.concat(withoutFirst);
}

export async function calculateFactionTeams(
  characters: CharacterWithPower[]
): Promise<FactionTeam[]> {
  const factionTeams: FactionTeam[] = [];
  const validFactions = FACTIONS.filter((f) => !f.ignored).map((f) => f.name);

  for (const faction of validFactions) {
    const charsInFaction = characters.filter((c) =>
      c.factions.includes(faction)
    );
    if (charsInFaction.length === 0) continue;

    const teamSize = charsInFaction.length >= 4 ? 4 : charsInFaction.length;
    const combos = combinations(charsInFaction, teamSize);

    combos.forEach((team) => {
      const basePowerSum = team.reduce((sum, c) => sum + c.basePower, 0);
      const powerPercentSum = team.reduce((sum, c) => sum + c.powerPercent, 0);
      const combinedPower = basePowerSum * (1 + powerPercentSum / 100);

      factionTeams.push({
        faction,
        characters: team,
        basePowerSum,
        powerPercentSum,
        combinedPower,
      });
    });
  }

  // sort by combinedPower (highest first)
  factionTeams.sort((a, b) => b.combinedPower - a.combinedPower);

  return factionTeams;
}

/**
 * Returns the best team (highest combinedPower) that contains the given leader.
 */
export function getBestTeamForLeader(
  leaderId: number,
  factionTeams: FactionTeam[]
): CharacterWithPower[] {
  const bestTeam = factionTeams
    .filter((team) => team.characters.some((char) => char.id === leaderId))
    .reduce(
      (best, team) =>
        !best || team.combinedPower > best.combinedPower ? team : best,
      null as FactionTeam | null
    );

  if (!bestTeam) return [];

  // Remove leader from the team array so we don't duplicate in the table
  return bestTeam.characters.filter((char) => char.id !== leaderId);
}
