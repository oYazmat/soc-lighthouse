import { Select, MenuItem, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

interface StarsDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

export default function StarsDropdown({ value, onChange }: StarsDropdownProps) {
  const renderStars = (count: number) => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: count }, (_, i) => (
        <StarIcon key={i} fontSize="small" sx={{ color: "#FFD700" }} />
      ))}
    </Box>
  );

  return (
    <Select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      size="small"
      renderValue={(selected) => renderStars(Number(selected))}
    >
      {[0, 1, 2, 3, 4, 5].map((star) => (
        <MenuItem key={star} value={star}>
          {renderStars(star)}
        </MenuItem>
      ))}
    </Select>
  );
}
