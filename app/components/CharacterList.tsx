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
import StarsDropdown from "./StarsDropdown";
import RankDropdown from "./RankDropdownProps";

// 🔑 helper to convert "My Name" -> "my-name"
function toKebabCase(str: string): string {
  return str
    .replace(/\s+/g, "-") // spaces to dashes
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase to kebab-case
    .toLowerCase();
}

export default function CharacterList() {
  const exampleCharacter = {
    name: "Inanna",
    rarity: "Legendary",
    factions: ["Union", "Watcher"],
  };

  const handleStarsChange = (val: number) => console.log("Stars changed:", val);

  const handleRankChange = (val: number) => console.log("Rank changed:", val);

  return (
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
          <TableRow>
            <TableCell>
              <Avatar
                src={`/images/characters/${toKebabCase(exampleCharacter.name)}.png`}
                alt={exampleCharacter.name}
                sx={{ width: 40, height: 40 }}
              />
            </TableCell>
            <TableCell>{exampleCharacter.name}</TableCell>
            <TableCell>{exampleCharacter.rarity}</TableCell>
            <TableCell>
              <StarsDropdown value={0} onChange={handleStarsChange} />
            </TableCell>
            <TableCell>
              <RankDropdown value={0} onChange={handleRankChange} />
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {exampleCharacter.factions.map((faction) => (
                  <Chip key={faction} label={faction} size="small" />
                ))}
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
