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
import { useState, useMemo, useEffect } from "react";
import charactersData from "../data/characters.json";
import StarsDropdown from "./StarsDropdown";
import RankDropdown from "./RankDropdown";
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

const LOCAL_STORAGE_KEY = "characterState";

export default function CharacterList() {
  const [filters, setFilters] = useState({
    name: "",
    rarity: [] as string[],
    factions: [] as string[],
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
          filters.factions.every((f) => c.factions.includes(f));

        return matchesName && matchesRarity && matchesFaction;
      })
      .sort((a, b) => {
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
        if (rarityDiff !== 0) return rarityDiff;
        return a.name.localeCompare(b.name);
      });
  }, [filters]);

  // Handlers to update state
  const handleStarsChange = (id: number, stars: number) => {
    setCharacterState((prev) => {
      const prevState = prev[id] || { stars: 0, rank: 0 };
      const updated = {
        ...prev,
        [id]: {
          stars,
          rank: stars === 0 ? 0 : prevState.rank, // reset rank if stars is 0
        },
      };
      return updated;
    });
  };

  const handleRankChange = (id: number, rank: number) => {
    setCharacterState((prev) => {
      const updated = { ...prev, [id]: { ...prev[id], rank } };
      return updated;
    });
  };

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
              const isRankDisabled = !state.stars; // disabled if stars is 0

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
                      disabled={isRankDisabled} // <-- disable if stars is 0
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
