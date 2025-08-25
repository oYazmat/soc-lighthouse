"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Box,
} from "@mui/material";
import { useState, useMemo } from "react";
import charactersData from "../data/characters.json";
import StarsDropdown from "./StarsDropdown";
import RankDropdown from "./RankDropdownProps";
import CharacterFilters from "./CharacterFilters";

// 🔑 helper to convert names into kebab-case file names
function toKebabCase(str: string): string {
  return str
    .replace(/["']/g, "") // remove quotes
    .replace(/\./g, "-") // dots to dashes
    .replace(/[^\w\s-]/g, "") // remove other punctuation
    .replace(/\s+/g, "-") // spaces to dashes
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase to kebab-case
    .toLowerCase()
    .replace(/-+/g, "-") // collapse multiple dashes
    .replace(/^-|-$/g, ""); // trim leading/trailing dash
}

const rarityOrder: Record<string, number> = {
  Legendary: 1,
  Epic: 2,
  Rare: 3,
  Common: 4,
};

export default function CharacterList() {
  const [filters, setFilters] = useState({
    name: "",
    rarity: [] as string[],
    factions: [] as string[],
  });

  // Collect all unique factions from the data
  const allFactions = useMemo(() => {
    const set = new Set<string>();
    charactersData.forEach((c) =>
      c.factions.forEach((f: string) => set.add(f))
    );
    return Array.from(set).sort();
  }, []);

  // Filter + sort characters
  const filteredCharacters = useMemo(() => {
    return charactersData
      .filter((c) => {
        const matchesName = c.name
          .toLowerCase()
          .includes(filters.name.toLowerCase());

        const matchesRarity =
          filters.rarity.length === 0 || filters.rarity.includes(c.rarity);

        const matchesFaction =
          filters.factions.length === 0 ||
          filters.factions.every((f) => c.factions.includes(f));

        return matchesName && matchesRarity && matchesFaction;
      })
      .sort((a, b) => {
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
        if (rarityDiff !== 0) return rarityDiff;
        return a.name.localeCompare(b.name);
      });
  }, [filters]);

  const handleStarsChange = (val: number) => console.log("Stars changed:", val);

  const handleRankChange = (val: number) => console.log("Rank changed:", val);

  return (
    <>
      <CharacterFilters
        filters={filters}
        onChange={setFilters}
        allFactions={allFactions}
      />

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Rarity</TableCell>
              <TableCell>Stars</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Factions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCharacters.map((character) => (
              <TableRow key={character.id}>
                <TableCell>
                  <Avatar
                    src={`/images/characters/${toKebabCase(
                      character.name
                    )}.png`}
                    alt={character.name}
                    sx={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell>{character.name}</TableCell>
                <TableCell>{character.rarity}</TableCell>
                <TableCell>
                  <StarsDropdown value={0} onChange={handleStarsChange} />
                </TableCell>
                <TableCell>
                  <RankDropdown value={0} onChange={handleRankChange} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {character.factions.map((faction: string) => (
                      <Chip key={faction} label={faction} size="small" />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
