import type { Character } from "./character";

export type FilledCharacter = Character & { stars: number; rank: number };
