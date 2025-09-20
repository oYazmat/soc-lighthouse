import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Button,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import RedditIcon from "@mui/icons-material/Reddit";
import HistoryIcon from "@mui/icons-material/History";
import UpdateIcon from "@mui/icons-material/Update";
import DiscordIcon from "./DiscordIcon";
import ChangelogModal from "./ChangelogModal";
import config from "../../app-config.json";
import { Link } from "react-router";

const drawerWidth = 240;

export default function SideMenu() {
  const lastUpdate = config.lastUpdate;
  const [openChangelog, setOpenChangelog] = useState(false);
  const theme = useTheme();

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <List sx={{ zIndex: 1 }}>
            {/* My Characters */}
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: "50%", // circle style
                      bgcolor:
                        theme.palette.mode === "dark" ? "grey.700" : "grey.800",
                    }}
                  >
                    <img
                      src="/images/menu/my-characters.png"
                      alt="My Characters"
                      style={{ width: 20, height: 20 }}
                    />
                  </Box>
                </ListItemIcon>
                <ListItemText primary="My Characters" />
              </ListItemButton>
            </ListItem>
          </List>

          {/* Empty space background */}
          <Box
            sx={{
              flexGrow: 1,
              backgroundImage: `url(/images/lighthouse-bg.png)`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        </Box>

        {/* Bottom section */}
        <Divider />
        <Box sx={{ p: 2 }}>
          <Stack spacing={1.2}>
            <Box display="flex" alignItems="center" gap={1}>
              <UpdateIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Last update: {lastUpdate}
              </Typography>
            </Box>

            <Button
              size="small"
              startIcon={<HistoryIcon />}
              variant="outlined"
              color="primary"
              onClick={() => setOpenChangelog(true)}
            >
              View Changelog
            </Button>

            <Divider flexItem />

            <Button
              variant="outlined"
              size="small"
              startIcon={<RedditIcon />}
              href="https://www.reddit.com/u/oYazmat"
              target="_blank"
            >
              Reddit
            </Button>
            <Button variant="outlined" size="small" startIcon={<DiscordIcon />}>
              oyazmat
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* Modal */}
      <ChangelogModal
        open={openChangelog}
        onClose={() => setOpenChangelog(false)}
      />
    </>
  );
}
