import { Box, Toolbar, Typography } from "@mui/material";

export default function Content() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        minHeight: "100vh", // fill remaining space
      }}
    >
      <Toolbar />
      <Typography>Welcome to the My Characters section.</Typography>
    </Box>
  );
}
