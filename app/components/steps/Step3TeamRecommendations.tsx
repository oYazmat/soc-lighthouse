"use client";

import { Typography, Box } from "@mui/material";
import { useSoCContext } from "~/context/SoCContext";
import { useMemo } from "react";
import { calculateOwnedCharacterPower } from "~/utils/characters";
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
        Step 3 Debug: Matched Spots
      </Typography>
      <div>
        <h2>Owned Characters with Power</h2>
        <pre>{JSON.stringify(charactersWithPower, null, 2)}</pre>
      </div>
      {matchedSpots.map((spot) => (
        <Box
          key={spot.id}
          sx={{
            p: 1,
            mb: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography>
            Spot {spot.id} (Level Unlock: {spot.levelUnlock})
          </Typography>
          <Typography>
            Selected Character: {spot.selectedChar.name} — Rank{" "}
            {spot.selectedChar.rank}, Stars {spot.selectedChar.stars}, Rarity{" "}
            {spot.selectedChar.rarity}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
