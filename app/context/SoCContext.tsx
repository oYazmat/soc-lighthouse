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
const CHARACTER_BACKUP_KEY = "characterStateBackup";
const LIGHTHOUSE_LOCAL_STORAGE_KEY = "lighthouse-level";

export function SoCProvider({ children }: { children: ReactNode }) {
  const [characterState, setCharacterState] = useState<
    Record<number, CharacterState>
  >({});
  const [lighthouseLevel, setLighthouseLevel] = useState<number | "">(1);
  const [matchedSpots, setMatchedSpots] = useState<MatchedSpot[]>([]);

  // Load character state from localStorage safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(CHARACTER_LOCAL_STORAGE_KEY);
        if (stored) {
          setCharacterState(JSON.parse(stored));
        } else {
          // Try backup if main storage missing
          const backup = localStorage.getItem(CHARACTER_BACKUP_KEY);
          if (backup) setCharacterState(JSON.parse(backup));
        }

        const levelStored = localStorage.getItem(LIGHTHOUSE_LOCAL_STORAGE_KEY);
        if (levelStored) {
          const num = Number(levelStored);
          if (!isNaN(num)) setLighthouseLevel(num);
        }
      } catch (err) {
        console.error(
          "Failed to load localStorage, restoring backup if available",
          err
        );
        const backup = localStorage.getItem(CHARACTER_BACKUP_KEY);
        if (backup) {
          try {
            setCharacterState(JSON.parse(backup));
          } catch {
            // Final fallback: keep empty, but do NOT overwrite user data
          }
        }
      }
    }
  }, []);

  // Save character state with backup
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const serialized = JSON.stringify(characterState);
        localStorage.setItem(CHARACTER_LOCAL_STORAGE_KEY, serialized);
        localStorage.setItem(CHARACTER_BACKUP_KEY, serialized);
      } catch (err) {
        console.error("Failed to save character state", err);
      }
    }
  }, [characterState]);

  // Save lighthouse level safely
  useEffect(() => {
    if (typeof window !== "undefined" && lighthouseLevel !== "") {
      try {
        localStorage.setItem(
          LIGHTHOUSE_LOCAL_STORAGE_KEY,
          lighthouseLevel.toString()
        );
      } catch (err) {
        console.error("Failed to save lighthouse level", err);
      }
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

// Custom hook
export function useSoCContext() {
  const context = useContext(SoCContext);
  if (!context)
    throw new Error("useSoCContext must be used within SoCProvider");
  return context;
}
