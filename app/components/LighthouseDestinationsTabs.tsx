"use client";

import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";
import { LIGHTHOUSE_DESTINATIONS } from "~/utils/data-loader";

interface Props {
  lighthouseLevel: number | "";
}

export default function LighthouseDestinationsTabs({ lighthouseLevel }: Props) {
  const [selectedTab, setSelectedTab] = useState(0);

  const sortedDestinations = [...LIGHTHOUSE_DESTINATIONS].sort(
    (a, b) => a.levelUnlock - b.levelUnlock
  );

  return (
    <>
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        {sortedDestinations.map((dest, index) => {
          const [map, mission] = dest.mapName.split(" - ");
          return (
            <Tab
              key={dest.id}
              value={index}
              disabled={
                lighthouseLevel === "" ||
                dest.levelUnlock > Number(lighthouseLevel)
              }
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    lineHeight: 1.2,
                  }}
                >
                  <Typography variant="body2">{map}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mission}
                  </Typography>
                </Box>
              }
            />
          );
        })}
      </Tabs>

      {sortedDestinations.map((dest, index) => (
        <Box
          key={dest.id}
          role="tabpanel"
          hidden={selectedTab !== index}
          sx={{ p: 2 }}
        >
          {selectedTab === index && (
            <Typography variant="body1" color="text.secondary">
              {/* Placeholder for now — will fill with real team recs later */}
              Content for <strong>{dest.mapName}</strong> (unlock level{" "}
              {dest.levelUnlock})
            </Typography>
          )}
        </Box>
      ))}
    </>
  );
}
