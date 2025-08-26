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
    React.SetStateAction<Record<number, CharacterState>>
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
  const [characterState, setCharacterState] = useState<
    Record<number, CharacterState>
  >({});
  const [lighthouseLevel, setLighthouseLevel] = useState<number | "">(1);

  // New state for matched spots
  const [matchedSpots, setMatchedSpots] = useState<MatchedSpot[]>([]);

  // Load character state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CHARACTER_LOCAL_STORAGE_KEY);
      if (stored) setCharacterState(JSON.parse(stored));

      const levelStored = localStorage.getItem(LIGHTHOUSE_LOCAL_STORAGE_KEY);
      if (levelStored) {
        const num = Number(levelStored);
        if (!isNaN(num)) setLighthouseLevel(num);
      }
    }
  }, []);

  // Save character state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        CHARACTER_LOCAL_STORAGE_KEY,
        JSON.stringify(characterState)
      );
    }
  }, [characterState]);

  // Save lighthouse level
  useEffect(() => {
    if (typeof window !== "undefined" && lighthouseLevel !== "") {
      localStorage.setItem(
        LIGHTHOUSE_LOCAL_STORAGE_KEY,
        lighthouseLevel.toString()
      );
    }
  }, [lighthouseLevel]);

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
