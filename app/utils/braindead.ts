// braindead.ts
import type { FactionTeam } from "~/interfaces/FactionTeam";
import { LIGHTHOUSE_DESTINATIONS } from "./data-loader";
import type { LeaderTeams } from "~/interfaces/LeaderTeams";

/**
 * Compute leader criticality: leaders with fewer team options are more critical.
 */
function computeLeaderCriticality(
  factionTeams: FactionTeam[]
): Record<number, number> {
  const criticality: Record<number, number> = {};

  LIGHTHOUSE_DESTINATIONS.forEach((dest) => {
    dest.leaders.forEach((leaderId) => {
      const teams = factionTeams.filter((team) =>
        team.characters.some((c) => c.id === leaderId)
      );
      criticality[leaderId] = teams.length > 0 ? 1 / teams.length : 1;
    });
  });

  return criticality;
}

/**
 * Weighted round-robin pick: 2 teams per destination, global character exclusion.
 */
function buildLeaderTeamsWeightedRoundRobin(
  factionTeams: FactionTeam[],
  useCriticality: boolean = true
): LeaderTeams {
  const leaderTeamsMap: LeaderTeams = {};
  const globalUsedCharIds = new Set<number>();
  const leaderCriticality = useCriticality
    ? computeLeaderCriticality(factionTeams)
    : {};

  // Precompute best teams per leader
  const leaderToTeams: Record<number, FactionTeam[]> = {};
  LIGHTHOUSE_DESTINATIONS.forEach((dest) => {
    dest.leaders.forEach((leaderId) => {
      leaderToTeams[leaderId] = factionTeams
        .filter((team) => team.characters.some((c) => c.id === leaderId))
        .sort((a, b) => b.combinedPower - a.combinedPower);
    });
  });

  // Round-robin pick: 1st team then 2nd team
  for (let teamIndex = 0; teamIndex < 2; teamIndex++) {
    for (const dest of LIGHTHOUSE_DESTINATIONS) {
      const availableLeaders = dest.leaders.filter(
        (lid) =>
          !Object.values(leaderTeamsMap).some((lt) => lt.leaderId === lid)
      );

      let bestTeam: FactionTeam | null = null;
      let bestLeaderId: number | null = null;

      for (const lid of availableLeaders) {
        for (const team of leaderToTeams[lid] ?? []) {
          if (team.characters.some((c) => globalUsedCharIds.has(c.id)))
            continue;

          const score = useCriticality
            ? team.combinedPower + (leaderCriticality[lid] ?? 0) * 100
            : team.combinedPower;

          if (!bestTeam || score > bestTeam.combinedPower) {
            bestTeam = team;
            bestLeaderId = lid;
          }

          break; // only consider top available team per leader
        }
      }

      if (bestTeam && bestLeaderId !== null) {
        leaderTeamsMap[bestLeaderId] = {
          leaderId: bestLeaderId,
          team: bestTeam,
          membersWithoutLeader: bestTeam.characters.filter(
            (c) => c.id !== bestLeaderId
          ),
        };
        bestTeam.characters.forEach((c) => globalUsedCharIds.add(c.id));
      }
    }
  }

  return leaderTeamsMap;
}

/**
 * One-pass swap to improve selected teams' combined power.
 * Returns a LeaderTeams object keyed by leaderId.
 */
function onePassSwap(
  selectedTeams: LeaderTeams,
  unusedFactionTeams: FactionTeam[]
): LeaderTeams {
  const globalUsedCharIds = new Set<number>();
  Object.values(selectedTeams).forEach((lt) =>
    lt.team?.characters.forEach((c) => globalUsedCharIds.add(c.id))
  );

  for (const leaderTeam of Object.values(selectedTeams)) {
    const leaderId = leaderTeam.leaderId;
    const oldTeam = leaderTeam.team!;
    for (const candidate of unusedFactionTeams) {
      if (candidate.characters.some((c) => globalUsedCharIds.has(c.id)))
        continue;
      if (!candidate.characters.some((c) => c.id === leaderId)) continue;
      if (candidate.combinedPower > oldTeam.combinedPower) {
        // Swap
        leaderTeam.team = candidate;
        leaderTeam.membersWithoutLeader = candidate.characters.filter(
          (c) => c.id !== leaderId
        );
        oldTeam.characters.forEach((c) => globalUsedCharIds.delete(c.id));
        candidate.characters.forEach((c) => globalUsedCharIds.add(c.id));
        break; // only one pass
      }
    }
  }

  return selectedTeams;
}

/**
 * Strategy 3: Braindead mode = global no-overlap,
 * only top 2 leaders per destination.
 */
export function buildLeaderTeamsBraindead(
  factionTeams: FactionTeam[]
): LeaderTeams {
  // 1. Pick 2 teams per destination using weighted round-robin
  let leaderTeams = buildLeaderTeamsWeightedRoundRobin(factionTeams, true);

  // 2. Get all unused faction teams (teams not already selected)
  const usedTeamIds = new Set(
    Object.values(leaderTeams)
      .map((lt) => lt.team)
      .filter(Boolean)
      .map((t) => t!)
  );
  const unusedFactionTeams = factionTeams.filter(
    (team) => !usedTeamIds.has(team)
  );

  // 3. One-pass swap to improve combined power
  leaderTeams = onePassSwap(leaderTeams, unusedFactionTeams);

  return leaderTeams;
}
