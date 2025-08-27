"use client";

import { Box, Typography, TextField } from "@mui/material";
import { useSoCContext } from "../../context/SoCContext";
import { useEffect } from "react";

export default function Step1Lighthouse() {
  const {
    lighthouseLevel,
    setLighthouseLevel,
    setMatchedSpecialSpots,
    setMatchedSpots,
    setSelectedTeams,
  } = useSoCContext();

  // Reset all dependent states whenever lighthouseLevel changes
  useEffect(() => {
    setMatchedSpecialSpots([]);
    setMatchedSpots([]);
    setSelectedTeams({});
  }, [
    lighthouseLevel,
    setMatchedSpecialSpots,
    setMatchedSpots,
    setSelectedTeams,
  ]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = Number(value);
    if (value === "") {
      setLighthouseLevel("");
    } else if (!isNaN(num) && num >= 1 && num <= 70) {
      setLighthouseLevel(num);
    }
  };

  const levelError =
    lighthouseLevel !== "" && (lighthouseLevel < 1 || lighthouseLevel > 70);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography>Enter your Lighthouse level (1–70):</Typography>
      <TextField
        label="Lighthouse Level"
        type="number"
        value={lighthouseLevel}
        onChange={handleLevelChange}
        sx={{ maxWidth: 200, width: "100%" }}
        slotProps={{
          input: {
            inputProps: { min: 1, max: 70 },
          },
        }}
        error={!!levelError}
        helperText={levelError ? "Level must be between 1 and 70" : ""}
      />
    </Box>
  );
}
