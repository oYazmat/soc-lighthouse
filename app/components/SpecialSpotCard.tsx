"use client";

import { Box, Typography } from "@mui/material";
import CharacterAvatar from "./CharacterAvatar";
import { CHARACTERS } from "~/utils/data-loader";

interface SpecialSpotCardProps {
  spot: {
    id: number;
    specialChar1: number | null;
    specialChar2: number | null;
  };
  matchedCharName?: string;
}

export default function SpecialSpotCard({
  spot,
  matchedCharName,
}: SpecialSpotCardProps) {
  // Look up names of special characters
  const specialCharNames = [spot.specialChar1, spot.specialChar2]
    .filter((id): id is number => id !== null)
    .map((id) => CHARACTERS.find((c) => c.id === id)?.name)
    .filter(Boolean);

  return (
    <Box
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

      {matchedCharName ? (
        <>
          <CharacterAvatar name={matchedCharName} size={80} />
          <Typography variant="caption" sx={{ mt: 0.5, textAlign: "center" }}>
            {matchedCharName}
          </Typography>
        </>
      ) : (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 3,
            textAlign: "center",
            width: 80,
            whiteSpace: "normal",
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
}
