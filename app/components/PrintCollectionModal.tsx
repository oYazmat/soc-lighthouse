import { Dialog, DialogTitle, DialogContent, Box, Grid } from "@mui/material";
import CharacterAvatar from "./CharacterAvatar";
import type { CharactersState } from "~/interfaces/CharactersState";
import { CHARACTERS } from "~/utils/data-loader";
import { RARITY_ORDER } from "~/utils/characters";

interface PrintCollectionModalProps {
  open: boolean;
  onClose: () => void;
  charactersState: CharactersState;
}

export default function PrintCollectionModal({
  open,
  onClose,
  charactersState,
}: PrintCollectionModalProps) {
  // Only owned characters, sorted by rarity descending then stars descending
  const ownedCharacters = CHARACTERS.filter(
    (char) => (charactersState[char.id]?.stars || 0) > 0
  ).sort((a, b) => {
    const stateA = charactersState[a.id];
    const stateB = charactersState[b.id];

    // Sort by rarity descending (Legendary → Common)
    if (RARITY_ORDER[a.rarity] !== RARITY_ORDER[b.rarity]) {
      return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
    }

    // Then by stars descending
    return (stateB.stars || 0) - (stateA.stars || 0);
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>My Collection</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {ownedCharacters.map((character) => {
            const state = charactersState[character.id];
            return (
              <Grid
                key={character.id}
                size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
                sx={{ textAlign: "center" }}
              >
                <CharacterAvatar name={character.name} size={60} />
                <Box fontWeight="bold" mt={1}>
                  {character.name}
                </Box>
                <Box fontSize="0.9rem" color="text.secondary">
                  ⭐ {state.stars} | ⬆️ {state.rank}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
