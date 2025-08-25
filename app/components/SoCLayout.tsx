import SideMenu from "./SideMenu";
import Header from "./Header";
import RecommendationModal from "./RecommendationModal";
import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { SoCProvider } from "~/context/SoCContext";

interface SoCLayoutProps {
  children: React.ReactNode;
}

const LOCAL_STORAGE_KEY_DARK = "soc-darkmode";

export default function SoCLayout({ children }: SoCLayoutProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Load dark mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDark = localStorage.getItem(LOCAL_STORAGE_KEY_DARK);
      if (storedDark !== null) setDarkMode(storedDark === "true");
    }
  }, []);

  // Save dark mode to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY_DARK, darkMode.toString());
    }
  }, [darkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: darkMode ? "dark" : "light" },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <SoCProvider>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />

          <Header
            darkMode={darkMode}
            handleDarkModeChange={() => setDarkMode(!darkMode)}
            onStartRecommendation={() => setModalOpen(true)}
          />

          <SideMenu />

          <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh" }}>
            <Toolbar />
            {children}
          </Box>

          <RecommendationModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </Box>
      </SoCProvider>
    </ThemeProvider>
  );
}
