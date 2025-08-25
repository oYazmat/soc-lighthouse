"use client";

import { Typography, Box } from "@mui/material";
import { useSoCContext } from "~/context/SoCContext";

export default function Step3() {
  const { matchedSpots } = useSoCContext();

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
