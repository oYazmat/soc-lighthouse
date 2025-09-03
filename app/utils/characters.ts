import type { Character } from "~/interfaces/character";
import type { CharacterWithPower } from "~/interfaces/CharacterWithPower";
import {
  RANK_POWERS,
  RARITY_AND_STARS_POWERS,
  FACTIONS,
  LIGHTHOUSE_DESTINATIONS,
  CHARACTERS,
  LIGHTHOUSE_LEVELS,
} from "./data-loader";
import type { FactionTeam } from "~/interfaces/FactionTeam";
import type { LeaderTeam } from "~/interfaces/LeaderTeam";
import type { SelectedTeams } from "~/interfaces/SelectedTeams";
import type { LeaderTeams } from "~/interfaces/LeaderTeams";
import type { CharactersState } from "~/interfaces/CharactersState";
import type { FilledCharacter } from "~/interfaces/FilledCharacter";
import type { MatchedSpot } from "~/interfaces/MatchedSpot";
import { buildLeaderTeamsBraindead } from "./braindead";
import type { CharacterState } from "~/interfaces/CharacterState";

export const RARITY_ORDER: Record<string, number> = {
  Legendary: 1,
  Epic: 2,
  Rare: 3,
  Common: 4,
};

function getCharacterWithPower(
  character: Character,
  charState: CharacterState
): CharacterWithPower {
  const basePower =
    RANK_POWERS.find((r) => r.rank === charState.rank)?.power ?? 0;
  const powerPercent =
    RARITY_AND_STARS_POWERS.find(
      (r) => r.rarity === character.rarity && r.stars === charState.stars
    )?.powerPercent ?? 0;

  // filter out ignored factions
  const filteredFactions = character.factions.filter((f) =>
    FACTIONS.find((fa) => fa.name === f && !fa.ignored)
  );

  return {
    id: character.id,
    name: character.name,
    factions: filteredFactions,
    basePower,
    powerPercent,
  };
}

function getCharacterWithPowerById(
  charId: number,
  charactersState: CharactersState
): CharacterWithPower | null {
  if (!charactersState[charId] || charactersState[charId].stars < 1)
    return null;

  const leader = CHARACTERS.find((c) => c.id === charId);

  if (!leader) return null;

  return getCharacterWithPower(leader, charactersState[charId]);
}

export function calculateOwnedCharacterPower(
  ownedCharacters: Character[],
  characterState: CharactersState
): CharacterWithPower[] {
  return ownedCharacters.map((char) => {
    const charState = characterState[char.id];
    return getCharacterWithPower(char, charState);
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

// Extra bonus depending on team size
export function getExtraBonusPercent(teamSize: number): number {
  if (teamSize === 2) return 40;
  if (teamSize === 3) return 100;
  if (teamSize >= 4) return 180;
  return 0;
}

function calculateTeamPower(
  team: CharacterWithPower[],
  lighthouseLevel: number | ""
) {
  const basePowerSum = team.reduce((sum, c) => sum + c.basePower, 0);

  const rawPowerPercentSum = team.reduce((sum, c) => sum + c.powerPercent, 0);

  // Add extra bonus depending on number of characters
  const extraPercent = getExtraBonusPercent(team.length);
  const powerPercentSum = rawPowerPercentSum + extraPercent;

  const baseLighthousePower =
    lighthouseLevel !== ""
      ? (LIGHTHOUSE_LEVELS.find((lvl) => lvl.level === lighthouseLevel)
          ?.power ?? 0)
      : 0;

  const combinedPower = Math.round(
    basePowerSum + baseLighthousePower * (1 + powerPercentSum / 100)
  );

  return { basePowerSum, powerPercentSum, combinedPower };
}

export async function calculateFactionTeams(
  characters: CharacterWithPower[],
  teamSize: number,
  lighthouseLevel: number | ""
): Promise<FactionTeam[]> {
  const factionTeams: FactionTeam[] = [];
  const validFactions = FACTIONS.filter((f) => !f.ignored).map((f) => f.name);

  for (const faction of validFactions) {
    const charsInFaction = characters.filter((c) =>
      c.factions.includes(faction)
    );
    if (charsInFaction.length === 0) continue;

    const size =
      charsInFaction.length >= teamSize ? teamSize : charsInFaction.length;
    const combos = combinations(charsInFaction, size);

    combos.forEach((team) => {
      factionTeams.push({
        faction,
        characters: team,
        ...calculateTeamPower(team, lighthouseLevel),
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
): { team: FactionTeam | null; membersWithoutLeader: CharacterWithPower[] } {
  const bestTeam = factionTeams
    .filter((team) => team.characters.some((char) => char.id === leaderId))
    .reduce(
      (best, team) =>
        !best || team.combinedPower > best.combinedPower ? team : best,
      null as FactionTeam | null
    );

  if (!bestTeam) return { team: null, membersWithoutLeader: [] };

  return {
    team: bestTeam,
    membersWithoutLeader: bestTeam.characters.filter(
      (char) => char.id !== leaderId
    ),
  };
}

function addLeaderToTeamAndUpdatePowers(
  leaderWithPower: CharacterWithPower,
  team: FactionTeam,
  lightouseLevel: number | ""
): FactionTeam {
  const charactersWithLeader = [...team.characters, leaderWithPower];
  return {
    ...team,
    characters: charactersWithLeader,
    ...calculateTeamPower(charactersWithLeader, lightouseLevel),
  };
}

/**
 * Returns the best team (highest combinedPower) that does not contain the given leader and then adds him to it.
 */
export function getBestTeamWithoutLeaderAndAddHim(
  leaderId: number,
  factionTeams: FactionTeam[],
  charactersState: CharactersState,
  lighthouseLevel: number | ""
): { team: FactionTeam | null; membersWithoutLeader: CharacterWithPower[] } {
  // Step 1: find the leader data
  const leaderWithPower = getCharacterWithPowerById(leaderId, charactersState);

  if (!leaderWithPower) return { team: null, membersWithoutLeader: [] };

  // Step 2: exclude teams that already contain the leader
  const validTeams = factionTeams.filter(
    (team) => !team.characters.some((char) => char.id === leaderWithPower.id)
  );

  // Step 3: pick best team by combinedPower
  const bestTeam = validTeams.reduce(
    (best, team) =>
      !best || team.combinedPower > best.combinedPower ? team : best,
    null as FactionTeam | null
  );

  if (!bestTeam) return { team: null, membersWithoutLeader: [] };

  // Step 4: build new team with leader added
  const updatedTeam = addLeaderToTeamAndUpdatePowers(
    leaderWithPower,
    bestTeam,
    lighthouseLevel
  );

  return {
    team: updatedTeam,
    membersWithoutLeader: bestTeam.characters, // leader wasn’t in original team
  };
}

export function buildLeaderTeams(
  factionTeams: FactionTeam[],
  allowOverlap: boolean,
  braindeadMode: boolean,
  addLeaderToTeam: boolean,
  charactersState: CharactersState,
  lighthouseLevel: number | ""
): LeaderTeams {
  if (braindeadMode) {
    return buildLeaderTeamsBraindead(factionTeams, addLeaderToTeam);
  }
  if (allowOverlap) {
    return buildLeaderTeamsWithOverlap(
      factionTeams,
      addLeaderToTeam,
      charactersState,
      lighthouseLevel
    );
  }

  return buildLeaderTeamsNoOverlap(
    factionTeams,
    addLeaderToTeam,
    charactersState,
    lighthouseLevel
  );
}

/**
 * Strategy 1: Allow overlap, simple greedy pick.
 */
function buildLeaderTeamsWithOverlap(
  factionTeams: FactionTeam[],
  addLeaderToTeam: boolean,
  charactersState: CharactersState,
  lighthouseLevel: number | ""
): LeaderTeams {
  const leaderTeamsMap: LeaderTeams = {};

  LIGHTHOUSE_DESTINATIONS.forEach((dest) => {
    dest.leaders.forEach((leaderId) => {
      const { team, membersWithoutLeader } = addLeaderToTeam
        ? getBestTeamWithoutLeaderAndAddHim(
            leaderId,
            factionTeams,
            charactersState,
            lighthouseLevel
          )
        : getBestTeamForLeader(leaderId, factionTeams);

      if (team) {
        leaderTeamsMap[leaderId] = { leaderId, team, membersWithoutLeader };
      }
    });
  });

  return leaderTeamsMap;
}

/**
 * Strategy 2: No overlap, greedy within each destination.
 */
function buildLeaderTeamsNoOverlap(
  factionTeams: FactionTeam[],
  addLeaderToTeam: boolean,
  charactersState: CharactersState,
  lighthouseLevel: number | ""
): LeaderTeams {
  const leaderTeamsMap: LeaderTeams = {};

  LIGHTHOUSE_DESTINATIONS.forEach((dest) => {
    const localUsedCharIds = new Set<number>();

    const leadersWithBest = getSortedLeadersWithBestTeams(
      dest.leaders,
      factionTeams,
      addLeaderToTeam,
      charactersState,
      lighthouseLevel
    );

    for (const { leaderId } of leadersWithBest) {
      const leaderWithPower = getCharacterWithPowerById(
        leaderId,
        charactersState
      );

      if (!leaderWithPower) continue;

      const exclusions = new Set(localUsedCharIds);

      const bestNonOverlap = getBestTeamForLeaderWithExclusions(
        leaderId,
        factionTeams,
        exclusions,
        addLeaderToTeam,
        dest.leaders
      );

      if (!bestNonOverlap.team) continue;

      let teamWithLeader = bestNonOverlap.team;

      if (addLeaderToTeam && bestNonOverlap) {
        const leaderWithPower = getCharacterWithPowerById(
          leaderId,
          charactersState
        );

        teamWithLeader = addLeaderToTeamAndUpdatePowers(
          leaderWithPower!,
          bestNonOverlap.team,
          lighthouseLevel
        );
      }

      leaderTeamsMap[leaderId] = {
        leaderId,
        team: teamWithLeader,
        membersWithoutLeader: bestNonOverlap.membersWithoutLeader,
      };

      teamWithLeader.characters.forEach((c) => localUsedCharIds.add(c.id));
    }
  });

  return leaderTeamsMap;
}

/**
 * Utility: get leaders sorted by best possible team power.
 */
function getSortedLeadersWithBestTeams(
  leaderIds: number[],
  factionTeams: FactionTeam[],
  addLeaderToTeam: boolean,
  charactersState: CharactersState,
  lighthouseLevel: number | ""
) {
  return leaderIds
    .map((leaderId) => {
      const { team } = addLeaderToTeam
        ? getBestTeamWithoutLeaderAndAddHim(
            leaderId,
            factionTeams,
            charactersState,
            lighthouseLevel
          )
        : getBestTeamForLeader(leaderId, factionTeams);
      return { leaderId, bestTeamPower: team?.combinedPower ?? 0 };
    })
    .filter((x) => x.bestTeamPower > 0)
    .sort((a, b) => b.bestTeamPower - a.bestTeamPower);
}

/**
 * Best team for a leader *without* using any characters present in excludeIds.
 * (Exclusion applies to the whole team, including the leader.)
 */
function getBestTeamForLeaderWithExclusions(
  leaderId: number,
  factionTeams: FactionTeam[],
  excludeIds: Set<number>,
  addLeaderToTeam: boolean,
  leaderIds: number[]
): { team: FactionTeam | null; membersWithoutLeader: CharacterWithPower[] } {
  let best: FactionTeam | null = null;

  for (const team of factionTeams) {
    // Must include the leader if not addLeaderToTeam
    if (!addLeaderToTeam && !team.characters.some((ch) => ch.id === leaderId))
      continue;

    // Must not include any leader if addLeaderToTeam
    if (
      addLeaderToTeam &&
      team.characters.some((ch) => leaderIds.includes(ch.id))
    )
      continue;

    // Must not contain any excluded character IDs
    const overlaps = team.characters.some((ch) => excludeIds.has(ch.id));
    if (overlaps) continue;

    if (!best || team.combinedPower > best.combinedPower) {
      best = team;
    }
  }

  if (!best) return { team: null, membersWithoutLeader: [] };

  return {
    team: best,
    membersWithoutLeader: best.characters.filter((ch) => ch.id !== leaderId),
  };
}

export function selectBestTeamsPerDestination(
  lighthouseLevel: number | "",
  leaderTeamsMap: LeaderTeams,
  braindeadMode: boolean
): SelectedTeams {
  const selected: SelectedTeams = {};

  LIGHTHOUSE_DESTINATIONS.forEach((dest) => {
    // Skip if destination is locked
    if (dest.levelUnlock > Number(lighthouseLevel)) return;

    if (braindeadMode) {
      // --- Braindead mode: include ALL teams for this destination ---
      dest.leaders.forEach((leaderId) => {
        const leaderTeam = leaderTeamsMap[leaderId];
        if (!leaderTeam || !leaderTeam.team) return;

        if (!selected[dest.id]) selected[dest.id] = {};
        selected[dest.id][leaderId] = leaderTeam;
      });
    } else {
      // --- Normal mode: pick strongest team only ---
      let bestLeader: LeaderTeam | null = null;

      dest.leaders.forEach((leaderId) => {
        const leaderTeam = leaderTeamsMap[leaderId];
        if (!leaderTeam || !leaderTeam.team) return;

        if (!bestLeader) {
          bestLeader = leaderTeam;
        } else if (
          leaderTeam.team.combinedPower > (bestLeader.team?.combinedPower ?? 0)
        ) {
          bestLeader = leaderTeam;
        }
      });

      if (bestLeader !== null) {
        if (!selected[dest.id]) selected[dest.id] = {};
        selected[dest.id][(bestLeader as LeaderTeam).leaderId] = bestLeader;
      }
    }
  });

  return selected;
}

// Helper function to collect all used character IDs
export function getUsedCharacterIds(
  matchedSpecialSpots: MatchedSpot[] | undefined,
  selectedTeams: SelectedTeams
): Set<number> {
  const usedCharIds = new Set<number>();

  // Add special spots
  matchedSpecialSpots?.forEach((m) => {
    if (m.selectedChar) usedCharIds.add(m.selectedChar.id);
  });

  // Add characters already assigned in destination teams
  Object.values(selectedTeams).forEach((leaderTeams) => {
    Object.values(leaderTeams).forEach((leaderTeam) => {
      // Add leader
      if (leaderTeam.leaderId) usedCharIds.add(leaderTeam.leaderId);

      // Add team characters if FactionTeam exists
      leaderTeam.team?.characters.forEach((c) => usedCharIds.add(c.id));
    });
  });

  return usedCharIds;
}

export function getFallbackCharacters(
  charactersState: CharactersState,
  excludeIds: Set<number> = new Set()
): FilledCharacter[] {
  // Only characters owned by the user and not in excludeIds
  const ownedChars = CHARACTERS.filter(
    (c) => charactersState[c.id]?.stars > 0 && !excludeIds.has(c.id)
  );

  if (ownedChars.length === 0) return [];

  const filledChars: FilledCharacter[] = ownedChars.map((c) => ({
    ...c,
    stars: charactersState[c.id].stars,
    rank: charactersState[c.id].rank,
  }));

  filledChars.sort((a, b) => {
    // 1. Highest rank first
    if (b.rank !== a.rank) return b.rank - a.rank;

    // 2. Lowest rarity first
    const rarityA = RARITY_ORDER[a.rarity] ?? 999;
    const rarityB = RARITY_ORDER[b.rarity] ?? 999;
    if (rarityA !== rarityB) return rarityA - rarityB;

    // 3. Lowest stars first
    return a.stars - b.stars;
  });

  return filledChars;
}
