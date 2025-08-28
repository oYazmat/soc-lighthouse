import { Box, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface StarsProps {
  value: number;
  onChange: (value: number) => void;
}

export default function Stars({ value, onChange }: StarsProps) {
  const handleClick = (starValue: number) => {
    // If user clicks the same star again, reset to 0
    if (value === starValue) {
      onChange(0);
    } else {
      onChange(starValue);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        return (
          <IconButton
            key={starValue}
            onClick={() => handleClick(starValue)}
            size="small"
          >
            {value >= starValue ? (
              <StarIcon fontSize="small" sx={{ color: "#FFD700" }} />
            ) : (
              <StarBorderIcon fontSize="small" sx={{ color: "#FFD700" }} />
            )}
          </IconButton>
        );
      })}
    </Box>
  );
}
