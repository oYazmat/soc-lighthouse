import { Select, MenuItem } from "@mui/material";

interface RankDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RankDropdown({ value, onChange }: RankDropdownProps) {
  // Array from 13 down to 0
  const ranks = Array.from({ length: 14 }, (_, i) => 13 - i);

  return (
    <Select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      size="small"
    >
      {ranks.map((rank) => (
        <MenuItem key={rank} value={rank}>
          {rank}
        </MenuItem>
      ))}
    </Select>
  );
}
