"use client";

import { Box, Typography } from "@mui/material";
import { useSoCContext } from "~/context/SoCContext";
import lighthouseSpotsData from "~/data/lighthouse-spots.json";
import type { LighthouseSpot } from "~/interfaces/LighthouseSpot";
import SpotCard from "../SpotCard";

export default function Step4Recap() {
  const { lighthouseLevel, matchedSpots } = useSoCContext();

  // All unlocked spots (up to current lighthouse level)
  const unlockedSpots = (lighthouseSpotsData as LighthouseSpot[]).filter(
    (spot) =>
      lighthouseLevel !== "" && spot.levelUnlock <= Number(lighthouseLevel)
  );

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        All Unlocked Spots
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Review all unlocked spots and their assigned characters (if any):
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
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
    </Box>
  );
}
