import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import config from "../../app-config.json";

interface ChangelogModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangelogModal({ open, onClose }: ChangelogModalProps) {
  const { changelog } = config;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>📜 Changelog</DialogTitle>
      <DialogContent dividers>
        {Object.entries(changelog)
          .sort(([a], [b]) => b.localeCompare(a, undefined, { numeric: true }))
          .map(([version, changes], idx) => (
            <Box
              key={version}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                color="primary"
                fontWeight="bold"
                gutterBottom
              >
                {version}
              </Typography>
              <List dense disablePadding>
                {changes.map((change: string, i: number) => (
                  <ListItem key={i} sx={{ pl: 1, py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2">• {change}</Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
