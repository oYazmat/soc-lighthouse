"use client";

import { Typography, Box, CircularProgress } from "@mui/material";
import { useSoCContext } from "~/context/SoCContext";
import { useEffect, useState } from "react";
import {
  buildLeaderTeams,
  calculateFactionTeams,
  calculateOwnedCharacterPower,
  selectBestTeamsPerDestination,
} from "~/utils/characters";
import { CHARACTERS, LIGHTHOUSE_LEVELS } from "~/utils/data-loader";
import LighthouseDestinationsTabs from "../LighthouseDestinationsTabs";
import type { LeaderTeam } from "~/interfaces/LeaderTeam";

export default function Step3TeamRecommendations() {
  const {
    matchedSpots,
    characterState,
    lighthouseLevel,
    selectedTeams,
    setSelectedTeams,
  } = useSoCContext();

  const [leaderTeams, setLeaderTeams] = useState<Record<number, LeaderTeam>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const charactersAllowed = lighthouseLevel
    ? (LIGHTHOUSE_LEVELS.find((lvl) => lvl.level === lighthouseLevel)
        ?.characters ?? 1)
    : 1;

  useEffect(() => {
    let active = true;

    const runCalc = async () => {
      setLoading(true);

      // Small delay so spinner renders
      await new Promise((resolve) => setTimeout(resolve, 50));

      const matchedCharIds = matchedSpots?.map((s) => s.selectedChar.id) || [];

      const ownedCharacters = CHARACTERS.filter(
        (c) => characterState[c.id]?.stars > 0 && !matchedCharIds.includes(c.id)
      );

      const charsWithPower = calculateOwnedCharacterPower(
        ownedCharacters,
        characterState
      );

      const factionTeams = await calculateFactionTeams(
        charsWithPower,
        charactersAllowed
      );
      if (!active) return;

      const leaderTeamsMap = buildLeaderTeams(factionTeams);
      setLeaderTeams(leaderTeamsMap);

      // Select the leader with the highest combinedPower per destination
      const selected = selectBestTeamsPerDestination(
        lighthouseLevel,
        leaderTeamsMap
      );

      setSelectedTeams(selected);
      setLoading(false);
    };

    runCalc();
    return () => {
      active = false;
    };
  }, [characterState, matchedSpots, charactersAllowed]);

  return (
    <Box sx={{ mt: 2 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Calculating teams...
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Select your expedition teams
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose the teams you want to send on your Lighthouse expeditions.
              Any remaining characters will automatically be assigned to
              logistics in the next step.
            </Typography>
          </Box>

          <LighthouseDestinationsTabs
            leaderTeams={leaderTeams}
            charactersAllowed={charactersAllowed}
          />
        </>
      )}
    </Box>
  );
}
