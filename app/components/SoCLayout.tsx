import SideMenu from "./SideMenu";
import Header from "./Header";
import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { useMemo, useState } from "react";

interface SoCLayoutProps {
  children: React.ReactNode;
}

export default function SoCLayout({ children }: SoCLayoutProps) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const handleDarkModeChange = () => setDarkMode(!darkMode);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Header
          darkMode={darkMode}
          handleDarkModeChange={handleDarkModeChange}
        />

        <SideMenu />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            minHeight: "100vh", // fill remaining space
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
