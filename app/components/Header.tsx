import { Toolbar, AppBar, Typography, IconButton, Button } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

interface HeaderProps {
  darkMode: boolean;
  handleDarkModeChange: () => void;
  onStartRecommendation?: () => void;
}

export default function Header({
  darkMode,
  handleDarkModeChange,
  onStartRecommendation,
}: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap component="div">
          Sword of Convallaria - Lighthouse Calculator
        </Typography>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={onStartRecommendation}
          >
            Start Recommendation
          </Button>

          <IconButton color="inherit" onClick={handleDarkModeChange}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
