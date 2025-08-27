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
import { CHARACTERS } from "~/utils/data-loader";

export default function Step2SpecialSpots() {
  const { lighthouseLevel, charactersState, setMatchedSpots } = useSoCContext();

  const specialSpots = getSpecialSpots(lighthouseLevel);
  const matchedSpotsLocal = matchSpots(specialSpots, charactersState);

  useEffect(() => {
    setMatchedSpots(matchedSpotsLocal);
  }, [matchedSpotsLocal, setMatchedSpots]);

  const totalBonuses = aggregateActiveBonuses(matchedSpotsLocal);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography color="text.primary" sx={{ mb: 2 }}>
        Based on your current data, these characters will be assigned to their
        respective special spots (unmatched spots remain empty).
      </Typography>

      {/* Show all spots, whether matched or not */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {specialSpots.map((spot) => {
          const matched = matchedSpotsLocal.find((m) => m.id === spot.id);

          // Look up names of special characters
          const specialCharNames = [spot.specialChar1, spot.specialChar2]
            .filter((id): id is number => id !== null) // remove nulls
            .map((id) => CHARACTERS.find((c) => c.id === id)?.name)
            .filter(Boolean); // remove undefined

          return (
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

              {matched ? (
                <>
                  <CharacterAvatar
                    name={matched.selectedChar!.name}
                    size={80}
                  />
                  <Typography
                    variant="caption"
                    sx={{ mt: 0.5, textAlign: "center" }}
                  >
                    {matched.selectedChar!.name}
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mt: 3,
                    textAlign: "center",
                    width: 80, // same as avatar size
                    whiteSpace: "normal", // allow wrapping
                    wordBreak: "break-word",
                  }}
                >
                  {specialCharNames.length > 0
                    ? `You don't own ${specialCharNames.join(" or ")}`
                    : "No special character assigned"}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Total bonuses only if something matched */}
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
