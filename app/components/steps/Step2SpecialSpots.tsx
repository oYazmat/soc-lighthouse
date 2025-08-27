import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSoCContext } from "../../context/SoCContext";
import {
  aggregateActiveBonuses,
  getSpecialSpots,
  matchSpots,
} from "~/utils/spots";
import SpotCard from "../SpotCard";
import TotalActiveBonuses from "../TotalActiveBonuses";

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
        <TotalActiveBonuses bonuses={totalBonuses} />
      )}
    </Box>
  );
}
