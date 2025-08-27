import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSoCContext } from "../../context/SoCContext";
import {
  aggregateActiveBonuses,
  getSpecialSpots,
  matchSpots,
} from "~/utils/spots";
import SpotCard from "../SpotCard";

export default function Step2SpecialSpots() {
  const {
    lighthouseLevel,
    charactersState,
    setMatchedSpecialSpots,
    setMatchedSpots,
    setSelectedTeams,
  } = useSoCContext();

  const specialSpots = getSpecialSpots(lighthouseLevel);
  const matchedSpecialSpots = matchSpots(specialSpots, charactersState);

  useEffect(() => {
    setMatchedSpecialSpots(matchedSpecialSpots);
  }, [matchedSpecialSpots, setMatchedSpecialSpots]);

  useEffect(() => {
    // Whenever matchedSpecialSpots updates, reset matchedSpots and selectedTeams
    setMatchedSpots([]);
    setSelectedTeams({});
  }, [matchedSpecialSpots, setMatchedSpots, setSelectedTeams]);

  const totalBonuses = aggregateActiveBonuses(matchedSpecialSpots);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography color="text.primary" sx={{ mb: 2 }}>
        Based on your current data, these characters will be assigned to their
        respective special spots (unmatched spots remain empty).
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {specialSpots.map((spot) => {
          const matched = matchedSpecialSpots.find((m) => m.id === spot.id);
          return (
            <SpotCard
              key={spot.id}
              spot={spot}
              matchedCharName={matched?.selectedChar?.name}
            />
          );
        })}
      </Box>

      {matchedSpecialSpots.length > 0 && (
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
