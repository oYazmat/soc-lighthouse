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
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import RedditIcon from "@mui/icons-material/Reddit";
import DiscordIcon from "./DiscordIcon";
import config from "../../app-config.json";

const drawerWidth = 240;

export default function SideMenu() {
  const lastUpdate = config.lastUpdate;

  return (
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
      <List sx={{ flexGrow: 1 }}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="My Characters" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Bottom section */}
      <Box sx={{ p: 2, borderTop: "1px solid #ddd" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Last update: {lastUpdate}
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
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
        </Box>
      </Box>
    </Drawer>
  );
}
