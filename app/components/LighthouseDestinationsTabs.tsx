"use client";

import {
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import { LIGHTHOUSE_DESTINATIONS, CHARACTERS } from "~/utils/data-loader";
import CharacterAvatar from "./CharacterAvatar";
import { useSoCContext } from "~/context/SoCContext";

export default function LighthouseDestinationsTabs() {
  const { characterState, lighthouseLevel } = useSoCContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [ownedLeaders, setOwnedLeaders] = useState<number[]>([]); // store owned leader IDs

  const sortedDestinations = [...LIGHTHOUSE_DESTINATIONS].sort(
    (a, b) => a.levelUnlock - b.levelUnlock
  );

  const maxCharactersPerRow = 4; // Leader + 4 characters

  // Update owned leaders when tab changes
  useEffect(() => {
    const dest = sortedDestinations[selectedTab];
    if (!dest) return;

    const owned = dest.leaders.filter(
      (leaderId) => characterState[leaderId]?.stars > 0
    );

    setOwnedLeaders(owned);
  }, [selectedTab, characterState, sortedDestinations]);

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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Leader</TableCell>
                    {Array.from({ length: maxCharactersPerRow }).map((_, i) => (
                      <TableCell
                        key={i}
                        align="center"
                      >{`Character ${i + 1}`}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {dest.leaders.map((leaderId) => {
                    const leader = CHARACTERS.find((c) => c.id === leaderId);
                    const owned =
                      leader && characterState[leader.id]?.stars > 0;

                    return (
                      <TableRow
                        key={leaderId}
                        sx={{
                          backgroundColor: owned
                            ? "inherit"
                            : "action.disabledBackground",
                        }}
                      >
                        <TableCell>
                          {leader && (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 0.5,
                                color: owned ? "inherit" : "text.disabled",
                              }}
                            >
                              <CharacterAvatar
                                name={leader.name}
                                size={50}
                                sx={{
                                  filter: owned ? "none" : "grayscale(100%)",
                                }}
                              />
                              <Typography variant="caption">
                                {leader.name}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>

                        {Array.from({ length: maxCharactersPerRow }).map(
                          (_, i) => (
                            <TableCell
                              key={i}
                              sx={{
                                color: owned ? "inherit" : "text.disabled",
                              }}
                            >
                              {/* Placeholder for future characters */}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      ))}
    </>
  );
}
