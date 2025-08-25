"use client";

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
} from "@mui/material";
import { useMemo, useState } from "react";
import charactersData from "../data/characters.json";
import StarsDropdown from "./StarsDropdown";
import RankDropdown from "./RankDropdown";
import CharacterFilters, {
  type CharacterFilterValues,
} from "./CharacterFilters";
import { useSoCContext } from "../context/SoCContext";
import type { Character } from "~/interfaces/character";
import CharacterAvatar from "./CharacterAvatar";

const rarityOrder: Record<string, number> = {
  Legendary: 1,
  Epic: 2,
  Rare: 3,
  Common: 4,
};

const characters = charactersData as Character[];

export default function CharacterList() {
  const { characterState, setCharacterState } = useSoCContext();

  const [filters, setFilters] = useState<CharacterFilterValues>({
    name: "",
    rarity: [],
    factions: [],
    ownership: "All", // default value
  });

  // Collect all unique factions from the data
  const allFactions = useMemo(() => {
    const set = new Set<string>();
    characters.forEach((c) => c.factions.forEach((f: string) => set.add(f)));
    return Array.from(set).sort();
  }, []);

  // Filter + sort characters
  const filteredCharacters = useMemo(() => {
    return characters
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
                    <CharacterAvatar name={character.name} size={40} />
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
