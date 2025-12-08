import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Avatar,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import type { CharacterFilterValues } from "~/interfaces/CharacterFilterValues";
import ClearIcon from "@mui/icons-material/Clear";
import { toKebabCase } from "~/utils/string";

// Define a reusable interface for the filter values

// Update CharacterFiltersProps to use it
interface CharacterFiltersProps {
  filters: CharacterFilterValues;
  onChange: (filters: CharacterFilterValues) => void;
  allFactions: string[];
  allRarities?: string[];
}

export default function CharacterFilters({
  filters,
  onChange,
  allFactions,
  allRarities = ["Legendary", "Epic", "Rare", "Common"],
}: CharacterFiltersProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
      {/* Name filter */}
      <TextField
        label="Name"
        value={filters.name}
        onChange={(e) => onChange({ ...filters, name: e.target.value })}
        size="small"
        InputProps={{
          endAdornment: filters.name ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => onChange({ ...filters, name: "" })}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      {/* Rarity filter */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Rarity</InputLabel>
        <Select
          multiple
          value={filters.rarity}
          onChange={(e) =>
            onChange({ ...filters, rarity: e.target.value as string[] })
          }
          input={<OutlinedInput label="Rarity" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {(selected as string[]).map((value) => (
                <Chip
                  key={value}
                  avatar={
                    <Avatar
                      alt={value}
                      src={`/images/rarities/${toKebabCase(value)}.png`}
                    />
                  }
                  label={value}
                  size="small"
                />
              ))}
            </Box>
          )}
        >
          {allRarities.map((rarity) => (
            <MenuItem key={rarity} value={rarity}>
              <Chip
                avatar={
                  <Avatar
                    alt={rarity}
                    src={`/images/rarities/${toKebabCase(rarity)}.png`}
                  />
                }
                label={rarity}
                variant="outlined"
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Factions filter */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Factions</InputLabel>
          <Select
            multiple
            value={filters.factions}
            onChange={(e) =>
              onChange({ ...filters, factions: e.target.value as string[] })
            }
            input={<OutlinedInput label="Factions" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {(selected as string[]).map((value) => (
                  <Chip
                    key={value}
                    avatar={
                      <Avatar
                        alt={value}
                        src={`/images/factions/${toKebabCase(value)}.png`}
                      />
                    }
                    label={value}
                    size="small"
                  />
                ))}
              </Box>
            )}
          >
            {allFactions.map((faction) => (
              <MenuItem key={faction} value={faction}>
                <Chip
                  avatar={
                    <Avatar
                      alt={faction}
                      src={`/images/factions/${toKebabCase(faction)}.png`}
                    />
                  }
                  label={faction}
                  variant="outlined"
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Inclusive / Exclusive checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={filters.factionMode === "exclusive"}
              onChange={(e) =>
                onChange({
                  ...filters,
                  factionMode: e.target.checked ? "exclusive" : "inclusive",
                })
              }
            />
          }
          label="Match all"
        />
      </Box>

      {/* Ownership filter */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Ownership</InputLabel>
        <Select
          value={filters.ownership || "All"}
          onChange={(e) =>
            onChange({
              ...filters,
              ownership: e.target.value as "All" | "Owned" | "Not Owned",
            })
          }
          label="Ownership"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Owned">Owned</MenuItem>
          <MenuItem value="Not Owned">Not Owned</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
