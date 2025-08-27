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
  Checkbox,
} from "@mui/material";
import CharacterAvatar from "./CharacterAvatar";
import { useSoCContext } from "~/context/SoCContext";
import { CHARACTERS } from "~/utils/data-loader";
import type { LeaderTeam } from "~/interfaces/LeaderTeam";
import type { SelectedTeams } from "~/interfaces/SelectedTeams";
import type { LeaderTeams } from "~/interfaces/LeaderTeams";

interface Props {
  destinationId: number;
  leaders: number[];
  charactersAllowed: number;
  leaderTeams: LeaderTeams;
  showCheckbox?: boolean;
}

export default function TeamsTable({
  destinationId,
  leaders,
  charactersAllowed,
  leaderTeams,
  showCheckbox,
}: Props) {
  const { charactersState, selectedTeams, setSelectedTeams } = useSoCContext();
  const maxCharactersPerRow = 4;

  const handleCheckboxChange = (
    destId: number,
    leaderId: number,
    leaderTeam: LeaderTeam | undefined,
    checked: boolean
  ) => {
    if (!leaderTeam) return;

    setSelectedTeams((prev) => {
      const next: SelectedTeams = { ...prev };

      if (!next[destId]) {
        next[destId] = {};
      }

      if (checked) {
        next[destId][leaderId] = { ...leaderTeam };
      } else {
        delete next[destId][leaderId];
        if (Object.keys(next[destId]).length === 0) {
          delete next[destId];
        }
      }

      return next;
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {showCheckbox && <TableCell align="center" />}
            <TableCell align="center">Leader</TableCell>
            {Array.from({ length: maxCharactersPerRow }).map((_, i) => (
              <TableCell
                key={i}
                align="center"
              >{`Character ${i + 1}`}</TableCell>
            ))}
            <TableCell align="center">Base Power</TableCell>
            <TableCell align="center">Bonus Power %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaders.map((leaderId) => {
            const leader = CHARACTERS.find((c) => c.id === leaderId);
            const ownedLeader = leader && charactersState[leaderId]?.stars > 0;
            const leaderTeam = leaderTeams[leaderId];
            const membersWithoutLeader = leaderTeam?.membersWithoutLeader ?? [];
            const team = leaderTeam?.team ?? null;
            const isRowDisabled = !ownedLeader;
            const isChecked = !!selectedTeams[destinationId]?.[leaderId];

            return (
              <TableRow key={leaderId}>
                {showCheckbox && (
                  <TableCell align="center">
                    <Checkbox
                      disabled={isRowDisabled}
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(
                          destinationId,
                          leaderId,
                          leaderTeam,
                          e.target.checked
                        )
                      }
                    />
                  </TableCell>
                )}

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
                  const member = membersWithoutLeader[i];
                  const isDisabled = !member || i >= charactersAllowed - 1;

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
                      {member && (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <CharacterAvatar
                            name={member.name}
                            size={50}
                            sx={{
                              filter: isDisabled ? "grayscale(100%)" : "none",
                            }}
                          />
                          <Typography variant="caption">
                            {member.name}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                  );
                })}

                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: isRowDisabled
                      ? "action.disabledBackground"
                      : "inherit",
                  }}
                >
                  {team?.basePowerSum ?? "-"}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: isRowDisabled
                      ? "action.disabledBackground"
                      : "inherit",
                  }}
                >
                  {team?.powerPercentSum != null
                    ? `${team.powerPercentSum}%`
                    : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
