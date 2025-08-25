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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import charactersData from "../data/characters.json";
import StarsDropdown from "./StarsDropdown";
import RankDropdown from "./RankDropdown";
import CharacterFilters, {
  type CharacterFilterValues,
} from "./CharacterFilters";

// 🔑 helper to convert names into kebab-case file names
function toKebabCase(str: string): string {
  return str
    .replace(/["']/g, "")
    .replace(/\./g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const rarityOrder: Record<string, number> = {
  Legendary: 1,
  Epic: 2,
  Rare: 3,
  Common: 4,
};

const LOCAL_STORAGE_KEY = "characterState";

export default function CharacterList() {
  const [filters, setFilters] = useState<CharacterFilterValues>({
    name: "",
    rarity: [],
    factions: [],
    ownership: "All", // default value
  });

  // 🔑 Track stars & rank per character, load from localStorage initially
  const [characterState, setCharacterState] = useState<
    Record<number, { stars: number; rank: number }>
  >(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setCharacterState(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characterState));
    }
  }, [characterState]);

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
          filters.factions.some((f) => c.factions.includes(f));

        const stars = characterState[c.id]?.stars || 0;
        const matchesOwnership =
          !filters.ownership || filters.ownership === "All"
            ? true
            : filters.ownership === "Owned"
              ? stars > 0
              : stars === 0;

        return (
          matchesName && matchesRarity && matchesFaction && matchesOwnership
        );
      })
      .sort((a, b) => {
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
        if (rarityDiff !== 0) return rarityDiff;
        return a.name.localeCompare(b.name);
      });
  }, [filters, characterState]);

  // Handlers to update state
  const handleStarsChange = (id: number, stars: number) => {
    setCharacterState((prev) => {
      const prevState = prev[id] || { stars: 0, rank: 0 };
      return {
        ...prev,
        [id]: {
          stars,
          rank: stars === 0 ? 0 : prevState.rank, // reset rank if stars is 0
        },
      };
    });
  };

  const handleRankChange = (id: number, rank: number) => {
    setCharacterState((prev) => ({ ...prev, [id]: { ...prev[id], rank } }));
  };

  return (
    <>
      {/* Character Filters */}
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
              <TableCell sx={{ minWidth: 100 }}>Stars</TableCell>
              <TableCell sx={{ minWidth: 80 }}>Rank</TableCell>
              <TableCell>Factions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCharacters.map((character) => {
              const state = characterState[character.id] || {
                stars: 0,
                rank: 0,
              };
              const isRankDisabled = !state.stars;

              return (
                <TableRow key={character.id}>
                  <TableCell>
                    <Avatar
                      src={`/images/characters/${toKebabCase(character.name)}.png`}
                      alt={character.name}
                      sx={{ width: 40, height: 40 }}
                    />
                  </TableCell>
                  <TableCell>{character.name}</TableCell>
                  <TableCell>{character.rarity}</TableCell>
                  <TableCell>
                    <StarsDropdown
                      value={state.stars}
                      onChange={(val) => handleStarsChange(character.id, val)}
                    />
                  </TableCell>
                  <TableCell>
                    <RankDropdown
                      value={state.rank}
                      onChange={(val) => handleRankChange(character.id, val)}
                      disabled={isRankDisabled}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {character.factions.map((faction: string) => (
                        <Chip key={faction} label={faction} size="small" />
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
