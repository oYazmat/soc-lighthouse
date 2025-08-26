"use client";

import { Typography, Box, CircularProgress } from "@mui/material";
import { useSoCContext } from "~/context/SoCContext";
import { useEffect, useState } from "react";
import {
  calculateFactionTeams,
  calculateOwnedCharacterPower,
} from "~/utils/characters";
import { CHARACTERS, LIGHTHOUSE_LEVELS } from "~/utils/data-loader";
import type { FactionTeam } from "~/interfaces/FactionTeam";
import type { CharacterWithPower } from "~/interfaces/CharacterWithPower";
import LighthouseDestinationsTabs from "../LighthouseDestinationsTabs";

export default function Step3TeamRecommendations() {
  const { matchedSpots, characterState, lighthouseLevel } = useSoCContext();
  const [charactersWithPower, setCharactersWithPower] = useState<
    CharacterWithPower[]
  >([]);
  const [factionTeams, setFactionTeams] = useState<FactionTeam[]>([]);
  const [loading, setLoading] = useState(false);

  const charactersAllowed = lighthouseLevel
    ? (LIGHTHOUSE_LEVELS.find((lvl) => lvl.level === lighthouseLevel)
        ?.characters ?? 1)
    : 1;

  useEffect(() => {
    let active = true;

    const runCalc = async () => {
      setLoading(true);

      // Yield to UI so loading spinner shows
      await new Promise((resolve) => setTimeout(resolve, 50));

      const matchedCharIds =
        matchedSpots?.map((spot) => spot.selectedChar.id) || [];

      const ownedCharacters = CHARACTERS.filter(
        (char) =>
          characterState[char.id]?.stars > 0 &&
          !matchedCharIds.includes(char.id)
      );

      const charsWithPower = calculateOwnedCharacterPower(
        ownedCharacters,
        characterState
      );

      // Pass charactersAllowed as team size
      const teams = await calculateFactionTeams(
        charsWithPower,
        charactersAllowed
      );

      if (!active) return;

      setCharactersWithPower(charsWithPower);
      setFactionTeams(teams);
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

          <LighthouseDestinationsTabs factionTeams={factionTeams} />
        </>
      )}
    </Box>
  );
}
