"use client";

import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSoCContext } from "../../context/SoCContext";
import type { Character } from "~/interfaces/character";
import CharacterAvatar from "../CharacterAvatar";
import type { MatchedSpot } from "~/interfaces/MatchedSpot";
import { CHARACTERS, LIGHTHOUSE_SPOTS } from "~/utils/data-loader";

export default function Step2SpecialSpots() {
  const { lighthouseLevel, characterState, setMatchedSpots } = useSoCContext();

  // Helper: get full character info (static + dynamic) if owned
  const getChar = (charId: number | null) => {
    if (charId === null) return null;

    const state = characterState[charId];
    if (!state || state.stars <= 0) return null;

    const staticData = CHARACTERS.find((c) => c.id === charId);
    if (!staticData) return null;

    return {
      ...staticData, // includes id, name, rarity, etc.
      ...state, // rank, stars
    };
  };

  // Filter spots unlocked at current level and that have at least one special character
  const specialSpots = LIGHTHOUSE_SPOTS.filter(
    (spot) =>
      lighthouseLevel !== "" &&
      spot.levelUnlock <= lighthouseLevel &&
      (spot.specialChar1 !== null || spot.specialChar2 !== null)
  );

  // For each spot, pick the best matching character
  const matchedSpotsLocal: MatchedSpot[] = specialSpots
    .map((spot) => {
      const char1 = getChar(spot.specialChar1);
      const char2 = getChar(spot.specialChar2);

      let selectedChar: (Character & { stars: number; rank: number }) | null =
        null;

      if (char1 && !char2) selectedChar = char1;
      else if (!char1 && char2) selectedChar = char2;
      else if (char1 && char2) {
        if (char1.rank > char2.rank) selectedChar = char1;
        else if (char2.rank > char1.rank) selectedChar = char2;
        else if (char1.stars < char2.stars) selectedChar = char1;
        else if (char2.stars < char1.stars) selectedChar = char2;
        else selectedChar = char1.rarity <= char2.rarity ? char1 : char2;
      }

      if (!selectedChar) return null; // nulls removed here

      return { ...spot, selectedChar };
    })
    .filter((s): s is MatchedSpot => s !== null); // type guard ensures non-null

  // Save matched spots into context for later steps
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

  return (
    <Box sx={{ mt: 2 }}>
      {/* Instruction for the user */}
      <Typography color="text.primary" sx={{ mb: 2 }}>
        Based on your current data, these characters will be assigned to their
        respective special spots and will be excluded from team recommendations.
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
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
    </Box>
  );
}
