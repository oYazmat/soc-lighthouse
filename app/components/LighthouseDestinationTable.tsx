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
import type { FactionTeam } from "~/interfaces/FactionTeam";
import { getBestTeamForLeader } from "~/utils/characters";

interface Props {
  leaders: number[];
  charactersAllowed: number;
  factionTeams: FactionTeam[];
}

export default function LighthouseDestinationTable({
  leaders,
  charactersAllowed,
  factionTeams,
}: Props) {
  const { characterState } = useSoCContext();
  const maxCharactersPerRow = 4; // leader + 4 characters

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {/* Extra checkbox column */}
            <TableCell align="center" />

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
            const ownedLeader = leader && characterState[leaderId]?.stars > 0;

            const { team, membersWithoutLeader } = getBestTeamForLeader(
              leaderId,
              factionTeams
            );

            const isRowDisabled = !ownedLeader;

            return (
              <TableRow key={leaderId}>
                {/* Checkbox column */}
                <TableCell align="center">
                  <Checkbox disabled={isRowDisabled} />
                </TableCell>

                {/* Leader cell */}
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

                {/* Best team cells */}
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

                {/* Extra columns for team stats */}
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
