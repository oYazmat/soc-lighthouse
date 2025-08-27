"use client";

import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSoCContext } from "~/context/SoCContext";
import {
  LIGHTHOUSE_SPOTS,
  LIGHTHOUSE_DESTINATIONS,
  LIGHTHOUSE_LEVELS,
} from "~/utils/data-loader";
import SpotCard from "../SpotCard";
import TeamsTable from "../TeamsTable";
import { getFallbackCharacters } from "~/utils/characters";
import type { MatchedSpot } from "~/interfaces/MatchedSpot";

export default function Step4Recap() {
  const {
    lighthouseLevel,
    matchedSpecialSpots,
    matchedSpots,
    setMatchedSpots,
    selectedTeams,
    charactersState,
  } = useSoCContext();

  // All unlocked spots (up to current lighthouse level)
  const unlockedSpots = LIGHTHOUSE_SPOTS.filter(
    (spot) =>
      lighthouseLevel !== "" && spot.levelUnlock <= Number(lighthouseLevel)
  );

  const charactersAllowed = lighthouseLevel
    ? (LIGHTHOUSE_LEVELS.find((lvl) => lvl.level === lighthouseLevel)
        ?.characters ?? 1)
    : 1;

  // Assign fallback characters to empty spots once
  useEffect(() => {
    if (!unlockedSpots.length || !charactersState) return;

    let usedCharIds = new Set<number>();
    const fallbackChars = getFallbackCharacters(charactersState);

    const updatedMatches: MatchedSpot[] = unlockedSpots.map(
      (spot): MatchedSpot => {
        const existingMatch = matchedSpecialSpots?.find(
          (s) => s.id === spot.id
        );
        if (existingMatch && existingMatch.selectedChar) {
          usedCharIds.add(existingMatch.selectedChar.id);
          return existingMatch;
        }

        const fallback = fallbackChars.find((c) => !usedCharIds.has(c.id));
        if (fallback) usedCharIds.add(fallback.id);

        return { ...spot, selectedChar: fallback ?? null };
      }
    );

    const prevIds = matchedSpecialSpots?.map((m) => m.selectedChar?.id) ?? [];
    const newIds = updatedMatches.map((m) => m.selectedChar?.id);
    const hasChanged = prevIds.join(",") !== newIds.join(",");

    if (hasChanged) {
      setMatchedSpots(updatedMatches);
      console.debug("🚀 ~ Step4Recap ~ updatedMatches:", updatedMatches);
    }
  }, [unlockedSpots.length, charactersState]);

  // Flatten all selected teams by destination
  const selectedDestinations = Object.keys(selectedTeams)
    .map((k) => Number(k))
    .sort((a, b) => a - b);

  return (
    <Box sx={{ mb: 2 }}>
      {/* Unlocked spots */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        All Unlocked Spots
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Review all unlocked spots and their assigned characters (if any):
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        {unlockedSpots.map((spot) => {
          const matched = matchedSpots?.find((s) => s.id === spot.id);
          return (
            <SpotCard
              key={spot.id}
              spot={spot}
              matchedCharName={matched?.selectedChar?.name}
            />
          );
        })}
      </Box>

      {/* Selected Teams recap table */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Your Teams
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Review all selected teams for your unlocked destinations:
      </Typography>
      <Box sx={{ mb: 2 }}>
        {selectedDestinations.map((destId) => {
          const leaderTeamsForDest = selectedTeams[destId];
          if (!leaderTeamsForDest) return null;

          const destination = LIGHTHOUSE_DESTINATIONS.find(
            (d) => d.id === destId
          );
          const destinationName =
            destination?.mapName ?? `Destination ${destId}`;

          return (
            <Box key={destId} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {destinationName}
              </Typography>
              <TeamsTable
                destinationId={destId}
                leaders={Object.keys(leaderTeamsForDest).map((k) => Number(k))}
                charactersAllowed={charactersAllowed}
                leaderTeams={leaderTeamsForDest}
                showCheckbox={false} // recap only
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
