import Header from "~/components/Header";
import SideMenu from "~/components/SideMenu";
import type { Route } from "./+types/home";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Content from "~/components/Content";
import { useMemo, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sword of Convallaria - Lighthouse Calculator" },
    {
      name: "description",
      content: "Welcome to Sword of Convallaria - Lighthouse Calculator!",
    },
  ];
}

export default function Home() {
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

        <Content />
      </Box>
    </ThemeProvider>
  );
}
