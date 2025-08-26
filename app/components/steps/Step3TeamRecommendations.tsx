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

export default function Step3TeamRecommendations() {
  const { matchedSpots, characterState } = useSoCContext();
  const [charactersWithPower, setCharactersWithPower] = useState<
    CharacterWithPower[]
  >([]);
  const [factionTeams, setFactionTeams] = useState<FactionTeam[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!matchedSpots || matchedSpots.length === 0) return;

    let active = true;

    const runCalc = async () => {
      setLoading(true);

      // Yield to UI so loading spinner shows
      await new Promise((resolve) => setTimeout(resolve, 50));

      const matchedCharIds = matchedSpots.map((spot) => spot.selectedChar.id);
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

      if (!active) return; // cancel if component unmounted

      setCharactersWithPower(charsWithPower);
      setFactionTeams(teams);
      setLoading(false);
    };

    runCalc();

    return () => {
      active = false;
    };
  }, [characterState, matchedSpots]);

  if (!matchedSpots || matchedSpots.length === 0) {
    return (
      <Box>
        <Typography>No matched spots available yet.</Typography>
      </Box>
    );
  }

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
      ) : factionTeams.length === 0 ? (
        <Typography>No faction teams available.</Typography>
      ) : (
        factionTeams.map((team, index) => (
          <Box
            key={index}
            sx={{
              p: 1,
              mb: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Typography>
              <strong>Faction:</strong> {team.faction}
            </Typography>
            <Typography>
              <strong>Characters:</strong>{" "}
              {team.characters
                .map((c: CharacterWithPower) => c.name)
                .join(", ")}
            </Typography>
            <Typography>
              <strong>Base Power Sum:</strong> {team.basePowerSum}
            </Typography>
            <Typography>
              <strong>Power Percent Sum:</strong> {team.powerPercentSum}%
            </Typography>
            <Typography>
              <strong>Combined Power:</strong> {team.combinedPower.toFixed(0)}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}
