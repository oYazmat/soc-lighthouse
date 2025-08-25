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
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      size="small"
      disabled={disabled}
    >
      {Array.from({ length: 14 }, (_, i) => (
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      ))}
    </Select>
  );
}
