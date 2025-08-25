"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  TextField,
} from "@mui/material";
import { useSoCContext } from "../context/SoCContext";

interface RecommendationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RecommendationModal({
  open,
  onClose,
}: RecommendationModalProps) {
  const { lighthouseLevel, setLighthouseLevel } = useSoCContext();

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = Number(value);
    if (value === "") {
      setLighthouseLevel("");
    } else if (!isNaN(num) && num >= 1 && num <= 70) {
      setLighthouseLevel(num);
    }
  };

  const levelError =
    lighthouseLevel !== "" && (lighthouseLevel < 1 || lighthouseLevel > 70);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Start Recommendation</DialogTitle>
      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Make sure your characters are filled or updated before starting!
        </Alert>

        <Typography sx={{ mb: 2 }}>
          Enter your Lighthouse level (1–70):
        </Typography>

        <TextField
          label="Lighthouse Level"
          type="number"
          value={lighthouseLevel}
          onChange={handleLevelChange}
          fullWidth
          slotProps={{
            input: {
              inputProps: { min: 1, max: 70 },
            },
          }}
          error={!!levelError}
          helperText={levelError ? "Level must be between 1 and 70" : ""}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button
          onClick={onClose}
          color="secondary"
          variant="contained"
          disabled={lighthouseLevel === "" || !!levelError}
        >
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
}
