"use client";

import { TextField, Box, Autocomplete } from "@mui/material";

interface CharacterFiltersProps {
  filters: {
    name: string;
    rarity: string[];
    factions: string[];
  };
  onChange: (newFilters: {
    name: string;
    rarity: string[];
    factions: string[];
  }) => void;
  allFactions: string[];
}

const rarities = ["Legendary", "Epic", "Rare", "Common"];

export default function CharacterFilters({
  filters,
  onChange,
  allFactions,
}: CharacterFiltersProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, name: e.target.value });
  };

  const handleRarityChange = (_: any, value: string[]) => {
    onChange({ ...filters, rarity: value });
  };

  const handleFactionChange = (_: any, value: string[]) => {
    onChange({ ...filters, factions: value });
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
      {/* Name Filter */}
      <TextField
        label="Filter by Name"
        value={filters.name}
        onChange={handleNameChange}
        size="small"
      />

      {/* Rarity Filter */}
      <Autocomplete
        multiple
        options={rarities}
        value={filters.rarity}
        onChange={handleRarityChange}
        renderInput={(params) => (
          <TextField {...params} label="Filter by Rarity" size="small" />
        )}
        sx={{ minWidth: 200 }}
      />

      {/* Faction Filter */}
      <Autocomplete
        multiple
        options={allFactions}
        value={filters.factions}
        onChange={handleFactionChange}
        renderInput={(params) => (
          <TextField {...params} label="Filter by Faction" size="small" />
        )}
        sx={{ minWidth: 200 }}
      />
    </Box>
  );
}
