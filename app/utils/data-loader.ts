import rankPowerData from "../data/rank-power.json";
import rarityAndStarsPowerData from "../data/rarity-and-stars-power.json";
import charactersData from "../data/characters.json";
import lighthouseSpotsData from "../data/lighthouse-spots.json";
import factionsData from "../data/factions.json";
import lighthouseDestinationsData from "../data/lighthouse-destinations.json";
import lighthouseLevelsData from "../data/lighthouse-levels.json";

import type { RarityAndStarsPower } from "~/interfaces/RarityAndStarsPower";
import type { RankPower } from "~/interfaces/RankPower";
import type { Character } from "~/interfaces/character";
import type { LighthouseSpot } from "~/interfaces/LighthouseSpot";
import type { Faction } from "~/interfaces/Faction";
import type { LighthouseDestination } from "~/interfaces/LighthouseDestination";
import type { LighthouseLevel } from "~/interfaces/LighthouseLevel";

export const CHARACTERS = charactersData as Character[];
export const LIGHTHOUSE_SPOTS = lighthouseSpotsData as LighthouseSpot[];
export const RANK_POWERS = rankPowerData as RankPower[];
export const RARITY_AND_STARS_POWERS =
  rarityAndStarsPowerData as RarityAndStarsPower[];
export const FACTIONS = factionsData as Faction[];
export const LIGHTHOUSE_DESTINATIONS =
  lighthouseDestinationsData as LighthouseDestination[];
export const LIGHTHOUSE_LEVELS = lighthouseLevelsData as LighthouseLevel[];
