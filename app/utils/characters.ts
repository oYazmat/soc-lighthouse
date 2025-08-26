import type { Character } from "~/interfaces/character";
import type { CharacterState } from "~/interfaces/CharacterState";
import type { CharacterWithPower } from "~/interfaces/CharacterWithPower";
import { RANK_POWERS, RARITY_AND_STARS_POWERS } from "./data-loader";

export function calculateOwnedCharacterPower(
  ownedCharacters: Character[],
  characterState: Record<number, CharacterState>
): CharacterWithPower[] {
  return ownedCharacters.map((char) => {
    const charState = characterState[char.id];
    const basePower =
      RANK_POWERS.find((r) => r.rank === charState.rank)?.power ?? 0;
    const powerPercent =
      RARITY_AND_STARS_POWERS.find(
        (r) => r.rarity === char.rarity && r.stars === charState.stars
      )?.powerPercent ?? 0;

    return {
      id: char.id,
      name: char.name,
      factions: char.factions,
      basePower,
      powerPercent,
    };
  });
}
