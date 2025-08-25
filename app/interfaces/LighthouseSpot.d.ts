export interface LighthouseSpot {
  id: number;
  levelUnlock: number;
  specialChar1: number | null;
  specialChar2: number | null;
  bonusYield?: number;
  bonusLogistics?: number;
  bonusLight?: number;
  bonusEvents?: boolean;
}
