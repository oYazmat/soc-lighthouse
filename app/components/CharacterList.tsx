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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import characters from "../data/characters.json";
import StarsDropdown from "./StarsDropdown";
import RankDropdown from "./RankDropdownProps";

// 🔑 helper to convert "My Name" -> "my-name"
function toKebabCase(str: string): string {
  return str
    .replace(/\s+/g, "-") // spaces to dashes
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase to kebab-case
    .toLowerCase();
}

// rarity order definition
const rarityOrder = ["Legendary", "Epic", "Rare", "Common"];

// collect all factions dynamically from data
const allFactions = Array.from(
  new Set(characters.flatMap((c) => c.factions))
).sort();

export default function CharacterList() {
  const [nameFilter, setNameFilter] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string[]>([]);
  const [factionFilter, setFactionFilter] = useState<string[]>([]);

  const handleStarsChange = (val: number) => console.log("Stars changed:", val);
  const handleRankChange = (val: number) => console.log("Rank changed:", val);

  // apply filters + sorting
  const filteredCharacters = characters
    .filter((char) =>
      char.name.toLowerCase().includes(nameFilter.toLowerCase())
    )
    .filter(
      (char) => rarityFilter.length === 0 || rarityFilter.includes(char.rarity)
    )
    .filter(
      (char) =>
        factionFilter.length === 0 ||
        factionFilter.every((f) => char.factions.includes(f))
    )
    .sort((a, b) => {
      const rarityDiff =
        rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
      if (rarityDiff !== 0) return rarityDiff;
      return a.name.localeCompare(b.name);
    });

  return (
    <>
      {/* 🔍 Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        {/* Name Filter */}
        <TextField
          label="Filter by Name"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        {/* Rarity Filter */}
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Filter by Rarity</InputLabel>
          <Select
            multiple
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as string[])}
            input={<OutlinedInput label="Filter by Rarity" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {rarityOrder.map((rarity) => (
              <MenuItem key={rarity} value={rarity}>
                <Checkbox checked={rarityFilter.includes(rarity)} />
                <ListItemText primary={rarity} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Faction Filter */}
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Filter by Faction</InputLabel>
          <Select
            multiple
            value={factionFilter}
            onChange={(e) => setFactionFilter(e.target.value as string[])}
            input={<OutlinedInput label="Filter by Faction" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {allFactions.map((faction) => (
              <MenuItem key={faction} value={faction}>
                <Checkbox checked={factionFilter.includes(faction)} />
                <ListItemText primary={faction} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 📋 Character Table */}
      <TableContainer component={Paper}>
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
            {filteredCharacters.map((char) => (
              <TableRow key={char.id}>
                <TableCell>
                  <Avatar
                    src={`/images/characters/${toKebabCase(char.name)}.png`}
                    alt={char.name}
                    sx={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell>{char.name}</TableCell>
                <TableCell>{char.rarity}</TableCell>
                <TableCell>
                  <StarsDropdown value={0} onChange={handleStarsChange} />
                </TableCell>
                <TableCell>
                  <RankDropdown value={0} onChange={handleRankChange} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {char.factions.map((faction) => (
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
