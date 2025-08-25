import { Toolbar, AppBar, Typography, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

interface HeaderProps {
  darkMode: boolean;
  handleDarkModeChange: () => void;
}

export default function Header({
  darkMode,
  handleDarkModeChange,
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

        {/* Dark mode toggle */}
        <IconButton
          color="inherit"
          onClick={handleDarkModeChange}
          sx={{ ml: 1 }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
