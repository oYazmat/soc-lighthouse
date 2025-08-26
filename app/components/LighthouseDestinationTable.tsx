"use client";

import {
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
import CharacterAvatar from "./CharacterAvatar";
import { useSoCContext } from "~/context/SoCContext";
import type { Character } from "~/interfaces/character";

interface Props {
  leaders: number[];
  charactersAllowed: number;
  allCharacters: Character[];
}

export default function LighthouseDestinationTable({
  leaders,
  charactersAllowed,
  allCharacters,
}: Props) {
  const { characterState } = useSoCContext();
  const maxCharactersPerRow = 4;

  return (
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
          {leaders.map((leaderId) => {
            const leader = allCharacters.find((c) => c.id === leaderId);
            const ownedLeader = leader && characterState[leader.id]?.stars > 0;

            return (
              <TableRow key={leaderId}>
                <TableCell
                  sx={{
                    color: ownedLeader ? "inherit" : "text.disabled",
                    backgroundColor: ownedLeader
                      ? "inherit"
                      : "action.disabledBackground",
                  }}
                >
                  {leader && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <CharacterAvatar
                        name={leader.name}
                        size={50}
                        sx={{
                          filter: ownedLeader ? "none" : "grayscale(100%)",
                        }}
                      />
                      <Typography variant="caption">{leader.name}</Typography>
                    </Box>
                  )}
                </TableCell>

                {Array.from({ length: maxCharactersPerRow }).map((_, i) => {
                  const isAvailable = i < charactersAllowed - 1; // subtract leader
                  const isDisabled = !ownedLeader || !isAvailable;

                  return (
                    <TableCell
                      key={i}
                      sx={{
                        color: isDisabled ? "text.disabled" : "inherit",
                        backgroundColor: isDisabled
                          ? "action.disabledBackground"
                          : "inherit",
                      }}
                    >
                      {/* Future character placeholder */}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
