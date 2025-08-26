"use client";

import { Typography, Box, CircularProgress } from "@mui/material";
import { useSoCContext } from "~/context/SoCContext";
import { useEffect, useState } from "react";
import {
  calculateFactionTeams,
  calculateOwnedCharacterPower,
} from "~/utils/characters";
import { CHARACTERS } from "~/utils/data-loader";
import type { FactionTeam } from "~/interfaces/FactionTeam";
import type { CharacterWithPower } from "~/interfaces/CharacterWithPower";
import LighthouseDestinationsTabs from "../LighthouseDestinationsTabs";

export default function Step3TeamRecommendations() {
  const { matchedSpots, characterState } = useSoCContext();
  const [charactersWithPower, setCharactersWithPower] = useState<
    CharacterWithPower[]
  >([]);
  const [factionTeams, setFactionTeams] = useState<FactionTeam[]>([]);
  const [loading, setLoading] = useState(false);

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
      const teams = await calculateFactionTeams(charsWithPower);

      if (!active) return;

      setCharactersWithPower(charsWithPower);
      setFactionTeams(teams);
      setLoading(false);
    };

    runCalc();

    return () => {
      active = false;
    };
  }, [characterState, matchedSpots]);

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
          <Typography variant="body1" sx={{ mb: 2 }}>
            Here are the strongest teams you can send on your Lighthouse
            expeditions:
          </Typography>

          <LighthouseDestinationsTabs />
        </>
      )}
    </Box>
  );
}
