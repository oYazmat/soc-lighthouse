import { Select, MenuItem } from "@mui/material";

interface RankDropdownProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export default function RankDropdown({
  value,
  onChange,
  disabled,
}: RankDropdownProps) {
  return (
    <Select
      value={value || 0}
      onChange={(e) => onChange(Number(e.target.value))}
      size="small"
      disabled={disabled}
    >
      {Array.from({ length: 14 }, (_, i) => 13 - i).map((rank) => (
        <MenuItem key={rank} value={rank}>
          {rank}
        </MenuItem>
      ))}
    </Select>
  );
}
