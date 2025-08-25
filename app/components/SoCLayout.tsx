import SideMenu from "./SideMenu";
import Header from "./Header";
import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";

interface SoCLayoutProps {
  children: React.ReactNode;
}

const LOCAL_STORAGE_KEY = "soc-darkmode";

export default function SoCLayout({ children }: SoCLayoutProps) {
  const [darkMode, setDarkMode] = useState(false);

  // Load darkMode from localStorage initially
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored !== null) {
        setDarkMode(stored === "true");
      }
    }
  }, []);

  // Save darkMode to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, darkMode.toString());
    }
  }, [darkMode]);

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
