import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

interface CharacterJsonModalProps {
  open: boolean;
  onClose: () => void;
  mode: "import" | "export";
  data?: any; // only for export
  onSave?: (json: any) => void; // only for import
}

export default function CharacterJsonModal({
  open,
  onClose,
  mode,
  data,
  onSave,
}: CharacterJsonModalProps) {
  const [jsonText, setJsonText] = useState("");
  const textAreaRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mode === "export" && data) {
      setJsonText(JSON.stringify(data, null, 2));
    } else {
      setJsonText(""); // clear for import
    }
  }, [mode, data, open]);

  const handleSave = () => {
    try {
      if (onSave) {
        const parsed = JSON.parse(jsonText);
        onSave(parsed);
      }
      onClose();
    } catch (err) {
      alert("Invalid JSON");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      alert("Copied to clipboard!");
    } catch {
      alert("Failed to copy");
    }
  };

  const handleClickTextarea = () => {
    if (mode === "export" && textAreaRef.current) {
      textAreaRef.current.select();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "export" ? "Export Characters" : "Import Characters"}
      </DialogTitle>
      <DialogContent>
        <TextField
          multiline
          minRows={15}
          fullWidth
          variant="outlined"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={mode === "import" ? "Paste JSON here..." : ""}
          inputRef={textAreaRef}
          onClick={handleClickTextarea}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        {mode === "export" && (
          <Button onClick={handleCopy} variant="contained" color="primary">
            Copy
          </Button>
        )}

        {mode === "import" && (
          <Button onClick={handleSave} variant="contained" color="success">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
