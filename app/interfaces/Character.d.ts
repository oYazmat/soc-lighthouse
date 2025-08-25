export interface Character {
  id: number;
  name: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  factions: string[];
}
