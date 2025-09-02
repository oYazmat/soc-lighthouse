import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSoCContext } from "../../context/SoCContext";
import {
  aggregateBonuses,
  getSpecialSpots,
  getUnmatchedSpots,
  matchSpots,
} from "~/utils/spots";
import SpotCard from "../SpotCard";
import type { LighthouseSpot } from "~/interfaces/LighthouseSpot";
import type { TotalBonuses } from "~/interfaces/TotalBonuses";
import Bonuses from "../Bonuses";

export default function Step2SpecialSpots() {
  const {
    lighthouseLevel,
    charactersState,
    setMatchedSpecialSpots,
    setMatchedSpots,
    setSelectedTeams,
  } = useSoCContext();

  const [unmatchedSpecialSpots, setUnmatchedSpecialSpots] = useState<
    LighthouseSpot[]
  >([]);
  const [totalActiveBonuses, setTotalBonuses] = useState<TotalBonuses>();
  const [totalInactiveBonuses, setTotalInactiveBonuses] =
    useState<TotalBonuses>();

  const specialSpots = getSpecialSpots(lighthouseLevel);
  const matchedSpecialSpots = matchSpots(specialSpots, charactersState);

  useEffect(() => {
    setMatchedSpecialSpots(matchedSpecialSpots);
    setUnmatchedSpecialSpots(
      getUnmatchedSpots(specialSpots, matchedSpecialSpots)
    );
  }, [matchedSpecialSpots, specialSpots, setMatchedSpecialSpots]);

  useEffect(() => {
    // Whenever matchedSpecialSpots updates, reset matchedSpots and selectedTeams
    setMatchedSpots([]);
    setSelectedTeams({});
  }, [matchedSpecialSpots, setMatchedSpots, setSelectedTeams]);

  useEffect(() => {
    setTotalBonuses(aggregateBonuses(matchedSpecialSpots));
  }, [matchedSpecialSpots]);

  useEffect(() => {
    setTotalInactiveBonuses(aggregateBonuses(unmatchedSpecialSpots));
  }, [unmatchedSpecialSpots]);

  return (
    <Box sx={{ mt: 2 }}>
      {specialSpots.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No special logistic spots are available at your current lighthouse
          level.
        </Typography>
      ) : (
        <>
          <Typography color="text.primary" sx={{ mb: 2 }}>
            Based on your current data, these characters will be assigned to
            their respective special spots (unmatched spots remain empty).
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

          <Bonuses
            activeBonuses={totalActiveBonuses}
            inactiveBonuses={totalInactiveBonuses}
          />
        </>
      )}
    </Box>
  );
}
