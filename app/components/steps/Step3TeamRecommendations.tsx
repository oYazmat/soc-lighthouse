"use client";

import { Typography, Box } from "@mui/material";
import { useSoCContext } from "~/context/SoCContext";
import { useMemo } from "react";
import {
  calculateFactionTeams,
  calculateOwnedCharacterPower,
} from "~/utils/characters";
import { CHARACTERS } from "~/utils/data-loader";

export default function Step3TeamRecommendations() {
  const { matchedSpots, characterState } = useSoCContext();

  const charactersWithPower = useMemo(() => {
    const matchedCharIds = matchedSpots.map((spot) => spot.selectedChar.id);
    const ownedCharacters = CHARACTERS.filter(
      (char) =>
        characterState[char.id]?.stars > 0 && !matchedCharIds.includes(char.id)
    );
    return calculateOwnedCharacterPower(ownedCharacters, characterState);
  }, [characterState, matchedSpots]);

  const factionTeams = useMemo(() => {
    return calculateFactionTeams(charactersWithPower);
  }, [charactersWithPower]);

  if (!matchedSpots || matchedSpots.length === 0) {
    return (
      <Box>
        <Typography>No matched spots available yet.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Step 3: Faction Teams
      </Typography>
      {factionTeams.length === 0 ? (
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
              {team.characters.map((c) => c.name).join(", ")}
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
