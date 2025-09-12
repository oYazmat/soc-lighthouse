import { Dialog, DialogTitle, DialogContent, Box, Avatar } from "@mui/material";
import CharacterAvatar from "./CharacterAvatar";
import type { CharactersState } from "~/interfaces/CharactersState";
import { CHARACTERS } from "~/utils/data-loader";
import { toKebabCase } from "~/utils/string";

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
  // Only owned Legendary characters, sorted by stars descending
  const ownedCharacters = CHARACTERS.filter(
    (char) =>
      char.rarity === "Legendary" && (charactersState[char.id]?.stars || 0) > 0
  ).sort((a, b) => {
    const stateA = charactersState[a.id];
    const stateB = charactersState[b.id];
    return (stateB.stars || 0) - (stateA.stars || 0);
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>My Collection</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(275px, 1fr))", // responsive wrapping
            justifyContent: "center",
            gap: 2,
          }}
        >
          {ownedCharacters.map((character) => {
            const state = charactersState[character.id];
            return (
              <Box
                key={character.id}
                sx={{
                  width: 275,
                  height: 275,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundImage: `url("/images/character-bg.png")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "80% auto",
                  backgroundPosition: "center",
                  mx: "auto",
                }}
              >
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    position: "absolute",
                    left: 50,
                    top: 68,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden", // clip the overflow
                    mx: "auto",
                  }}
                >
                  <Avatar
                    src={`/images/character-faces/${toKebabCase(character.name)}.png`}
                    alt={character.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain", // keep full image visible
                      objectPosition: "center", // default center, can tweak per image
                      transform: "scale(1.5)", // can scale up or down
                      bgcolor: "transparent",
                    }}
                    variant="square"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </Box>

                {/* Name positioned absolutely inside the box */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 36,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    color: "#f9f4e8",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {character.name}
                </Box>

                {/* <Box
                  fontSize="0.85rem"
                  color="text.secondary"
                  mt={0.5}
                  textAlign="center"
                >
                  ⭐ {state.stars} | ⬆️ {state.rank}
                </Box> */}
              </Box>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
