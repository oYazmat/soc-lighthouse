export interface FactionTeam {
  faction: string;
  characters: CharacterWithPower[];
  basePowerSum: number;
  powerPercentSum: number;
  combinedPower: number;
}
