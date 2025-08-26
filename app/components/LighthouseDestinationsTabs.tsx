import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";
import { LIGHTHOUSE_DESTINATIONS } from "~/utils/data-loader";
import LighthouseDestinationTable from "./LighthouseDestinationTable";
import { useSoCContext } from "~/context/SoCContext";
import type { LeaderTeams } from "~/interfaces/LeaderTeams";

interface Props {
  leaderTeams: LeaderTeams;
  charactersAllowed: number;
}

export default function LighthouseDestinationsTabs({
  leaderTeams,
  charactersAllowed,
}: Props) {
  const { lighthouseLevel } = useSoCContext();
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
          const isDisabled =
            lighthouseLevel === "" ||
            dest.levelUnlock > Number(lighthouseLevel);

          return (
            <Tab
              key={dest.id}
              value={index}
              disabled={isDisabled}
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
            <LighthouseDestinationTable
              destinationId={dest.id}
              leaders={dest.leaders}
              charactersAllowed={charactersAllowed}
              leaderTeams={leaderTeams}
            />
          )}
        </Box>
      ))}
    </>
  );
}
