"use client";

import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSoCContext } from "../../context/SoCContext";
import CharacterAvatar from "../CharacterAvatar";
import {
  aggregateActiveBonuses,
  getSpecialSpots,
  matchSpots,
} from "~/utils/spots";

export default function Step2SpecialSpots() {
  const { lighthouseLevel, charactersState, setMatchedSpots } = useSoCContext();

  const specialSpots = getSpecialSpots(lighthouseLevel);

  const matchedSpotsLocal = matchSpots(specialSpots, charactersState);

  useEffect(() => {
    setMatchedSpots(matchedSpotsLocal);
  }, [matchedSpotsLocal, setMatchedSpots]);

  if (matchedSpotsLocal.length === 0) {
    return (
      <Typography color="text.secondary">
        No special logistic spots match your owned characters yet.
      </Typography>
    );
  }

  const totalBonuses = aggregateActiveBonuses(matchedSpotsLocal);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography color="text.primary" sx={{ mb: 2 }}>
        Based on your current data, these characters will be assigned to their
        respective special spots and will be excluded from team recommendations.
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {matchedSpotsLocal.map((spot) => (
          <Box
            key={spot.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              minWidth: 100,
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              Spot {spot.id}
            </Typography>
            <CharacterAvatar name={spot.selectedChar!.name} size={80} />
            <Typography variant="caption" sx={{ mt: 0.5, textAlign: "center" }}>
              {spot.selectedChar!.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {matchedSpotsLocal.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Total Active Bonuses
          </Typography>
          {totalBonuses.bonusYield > 0 && (
            <Typography variant="body2" color="text.secondary">
              Expedition Yield: +{totalBonuses.bonusYield}%
            </Typography>
          )}
          {totalBonuses.bonusLogistics > 0 && (
            <Typography variant="body2" color="text.secondary">
              Logistics Bonus: +{totalBonuses.bonusLogistics}%
            </Typography>
          )}
          {totalBonuses.bonusLight > 0 && (
            <Typography variant="body2" color="text.secondary">
              Light Production Rate: +{totalBonuses.bonusLight}%
            </Typography>
          )}
          {totalBonuses.bonusEvents > 0 && (
            <Typography variant="body2" color="text.secondary">
              More frequent expedition events: x{totalBonuses.bonusEvents}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
