export interface CharacterFilterValues {
  name: string;
  rarity: string[];
  factions: string[];
  ownership?: "All" | "Owned" | "Not Owned";
}
