"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CharacterState } from "~/interfaces/CharacterState";
import type { MatchedSpot } from "~/interfaces/MatchedSpot";

interface SoCContextType {
  characterState: Record<number, CharacterState>;
  setCharacterState: React.Dispatch<
    React.SetStateAction<Record<number, CharacterState> | null>
  >;
  lighthouseLevel: number | "";
  setLighthouseLevel: React.Dispatch<React.SetStateAction<number | "">>;
  matchedSpots: MatchedSpot[];
  setMatchedSpots: React.Dispatch<React.SetStateAction<MatchedSpot[]>>;
}

const SoCContext = createContext<SoCContextType | undefined>(undefined);

const CHARACTER_LOCAL_STORAGE_KEY = "characterState";
const LIGHTHOUSE_LOCAL_STORAGE_KEY = "lighthouse-level";

export function SoCProvider({ children }: { children: ReactNode }) {
  const [characterState, setCharacterState] = useState<Record<
    number,
    CharacterState
  > | null>(null);
  const [lighthouseLevel, setLighthouseLevel] = useState<number | "">(1);
  const [matchedSpots, setMatchedSpots] = useState<MatchedSpot[]>([]);

  // Load character state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(CHARACTER_LOCAL_STORAGE_KEY);
      if (stored) {
        setCharacterState(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load characterState from localStorage", err);
    }

    const levelStored = localStorage.getItem(LIGHTHOUSE_LOCAL_STORAGE_KEY);
    if (levelStored) {
      const num = Number(levelStored);
      if (!isNaN(num)) setLighthouseLevel(num);
    }
  }, []);

  // Save character state only if it's non-null
  useEffect(() => {
    if (typeof window === "undefined" || characterState === null) return;

    try {
      localStorage.setItem(
        CHARACTER_LOCAL_STORAGE_KEY,
        JSON.stringify(characterState)
      );
    } catch (err) {
      console.error("Failed to save characterState", err);
    }
  }, [characterState]);

  // Save lighthouse level
  useEffect(() => {
    if (typeof window === "undefined" || lighthouseLevel === "") return;

    try {
      localStorage.setItem(
        LIGHTHOUSE_LOCAL_STORAGE_KEY,
        lighthouseLevel.toString()
      );
    } catch (err) {
      console.error("Failed to save lighthouseLevel", err);
    }
  }, [lighthouseLevel]);

  // Do not render children until characterState is loaded
  if (characterState === null) return null;

  return (
    <SoCContext.Provider
      value={{
        characterState,
        setCharacterState,
        lighthouseLevel,
        setLighthouseLevel,
        matchedSpots,
        setMatchedSpots,
      }}
    >
      {children}
    </SoCContext.Provider>
  );
}

// Custom hook for convenience
export function useSoCContext() {
  const context = useContext(SoCContext);
  if (!context)
    throw new Error("useSoCContext must be used within SoCProvider");
  return context;
}
