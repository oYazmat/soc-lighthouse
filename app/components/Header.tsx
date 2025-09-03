import { Toolbar, AppBar, Typography, IconButton, Button } from "@mui/material";

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
            {darkMode ? (
              <img
                src="/images/dark-mode/sun.png"
                alt="Light Mode"
                style={{ width: 24, height: 24 }}
                color="inherit"
              />
            ) : (
              <img
                src="/images/dark-mode/moon.png"
                alt="Dark Mode"
                style={{ width: 24, height: 24 }}
                color="inherit"
              />
            )}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
