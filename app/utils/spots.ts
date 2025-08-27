import type { MatchedSpot } from "~/interfaces/MatchedSpot";
import { CHARACTERS, LIGHTHOUSE_SPOTS } from "./data-loader";
import type { LighthouseSpot } from "~/interfaces/LighthouseSpot";
import type { CharactersState } from "~/interfaces/CharactersState";
import type { FilledCharacter } from "~/interfaces/FilledCharacter";

export function getSpecialSpots(lighthouseLevel: number | "") {
  return LIGHTHOUSE_SPOTS.filter(
    (spot) =>
      lighthouseLevel !== "" &&
      spot.levelUnlock <= lighthouseLevel &&
      (spot.specialChar1 !== null || spot.specialChar2 !== null)
  );
}

const getChar = (charId: number | null, characterState: CharactersState) => {
  if (charId === null) return null;

  const state = characterState[charId];
  if (!state || state.stars <= 0) return null;

  const staticData = CHARACTERS.find((c) => c.id === charId);
  if (!staticData) return null;

  return {
    ...staticData,
    ...state,
  };
};

export function matchSpots(
  specialSpots: LighthouseSpot[],
  charactersState: CharactersState
): MatchedSpot[] {
  return specialSpots
    .map((spot) => {
      const char1 = getChar(spot.specialChar1, charactersState);
      const char2 = getChar(spot.specialChar2, charactersState);

      let selectedChar: FilledCharacter | null = null;

      if (char1 && !char2) selectedChar = char1;
      else if (!char1 && char2) selectedChar = char2;
      else if (char1 && char2) {
        if (char1.rank > char2.rank) selectedChar = char1;
        else if (char2.rank > char1.rank) selectedChar = char2;
        else if (char1.stars < char2.stars) selectedChar = char1;
        else if (char2.stars < char1.stars) selectedChar = char2;
        else selectedChar = char1.rarity <= char2.rarity ? char1 : char2;
      }

      if (!selectedChar) return null;

      return { ...spot, selectedChar };
    })
    .filter((s): s is MatchedSpot => s !== null);
}

export function aggregateActiveBonuses(matchedSpotsLocal: MatchedSpot[]) {
  return matchedSpotsLocal.reduce(
    (acc, spot) => {
      if (spot.bonusYield) acc.bonusYield += spot.bonusYield;
      if (spot.bonusLogistics) acc.bonusLogistics += spot.bonusLogistics;
      if (spot.bonusLight) acc.bonusLight += spot.bonusLight;
      if (spot.bonusEvents) acc.bonusEvents += 1; // count how many
      return acc;
    },
    { bonusYield: 0, bonusLogistics: 0, bonusLight: 0, bonusEvents: 0 }
  );
}
