import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Avatar,
  TableSortLabel,
} from "@mui/material";
import { useState, useMemo } from "react";
import CharacterAvatar from "./CharacterAvatar";
import StarsDropdown from "./StarsDropdown";
import RankDropdown from "./RankDropdown";
import { toKebabCase } from "~/utils/string";
import type { CharactersState } from "~/interfaces/CharactersState";
import type { Character } from "~/interfaces/character";

interface CharacterTableProps {
  characters: Character[];
  charactersState: CharactersState;
  onStarsChange: (id: number, stars: number) => void;
  onRankChange: (id: number, rank: number) => void;
}

type Order = "asc" | "desc";

export default function CharacterTable({
  characters,
  charactersState,
  onStarsChange,
  onRankChange,
}: CharacterTableProps) {
  const [orderBy, setOrderBy] = useState<"stars" | "rank" | null>(null);
  const [order, setOrder] = useState<Order>("asc");

  const handleSort = (property: "stars" | "rank") => {
    if (orderBy !== property) {
      // first click → start with desc
      setOrderBy(property);
      setOrder("desc");
    } else if (order === "desc") {
      // second click → asc
      setOrder("asc");
    } else if (order === "asc") {
      // third click → reset to unsorted
      setOrderBy(null);
      setOrder("asc");
    }
  };

  const sortedCharacters = useMemo(() => {
    if (!orderBy) return characters;
    return [...characters].sort((a, b) => {
      const aVal = charactersState[a.id]?.[orderBy] ?? 0;
      const bVal = charactersState[b.id]?.[orderBy] ?? 0;
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [characters, charactersState, orderBy, order]);

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Rarity</TableCell>
            <TableCell sx={{ minWidth: 100 }}>
              <TableSortLabel
                active={orderBy === "stars"}
                direction={orderBy === "stars" ? order : "asc"}
                onClick={() => handleSort("stars")}
                hideSortIcon={orderBy !== "stars"} // hide arrow when unsorted
              >
                Stars
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ minWidth: 80 }}>
              <TableSortLabel
                active={orderBy === "rank"}
                direction={orderBy === "rank" ? order : "asc"}
                onClick={() => handleSort("rank")}
                hideSortIcon={orderBy !== "rank"} // hide arrow when unsorted
              >
                Rank
              </TableSortLabel>
            </TableCell>
            <TableCell>Factions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCharacters.map((character) => {
            const state = charactersState[character.id] || {
              stars: 0,
              rank: 0,
            };
            const isRankDisabled = !state.stars;

            return (
              <TableRow key={character.id}>
                <TableCell>
                  <CharacterAvatar name={character.name} size={40} />
                </TableCell>
                <TableCell>{character.name}</TableCell>
                <TableCell>
                  <Chip
                    avatar={
                      <Avatar
                        alt={character.rarity}
                        src={`/images/rarities/${toKebabCase(
                          character.rarity
                        )}.png`}
                      />
                    }
                    label={character.rarity}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <StarsDropdown
                    value={state.stars}
                    onChange={(val) => onStarsChange(character.id, val)}
                  />
                </TableCell>
                <TableCell>
                  <RankDropdown
                    value={state.rank}
                    onChange={(val) => onRankChange(character.id, val)}
                    disabled={isRankDisabled}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {character.factions.map((faction: string) => (
                      <Chip
                        key={faction}
                        avatar={
                          <Avatar
                            alt={faction}
                            src={`/images/factions/${toKebabCase(faction)}.png`}
                          />
                        }
                        label={faction}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
