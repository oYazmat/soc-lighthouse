import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CharactersState } from "~/interfaces/CharactersState";
import type { CharacterState } from "~/interfaces/CharacterState";
import type { MatchedSpot } from "~/interfaces/MatchedSpot";
import type { SelectedTeams } from "~/interfaces/SelectedTeams";

interface SoCContextType {
  charactersState: CharactersState;
  setCharactersState: React.Dispatch<React.SetStateAction<CharactersState>>;
  lighthouseLevel: number | "";
  setLighthouseLevel: React.Dispatch<React.SetStateAction<number | "">>;
  matchedSpots: MatchedSpot[];
  setMatchedSpots: React.Dispatch<React.SetStateAction<MatchedSpot[]>>;
  matchedSpecialSpots: MatchedSpot[];
  setMatchedSpecialSpots: React.Dispatch<React.SetStateAction<MatchedSpot[]>>;
  selectedTeams: SelectedTeams;
  setSelectedTeams: React.Dispatch<React.SetStateAction<SelectedTeams>>;
}

const SoCContext = createContext<SoCContextType | undefined>(undefined);

const CHARACTER_LOCAL_STORAGE_KEY = "characterState";
const LIGHTHOUSE_LOCAL_STORAGE_KEY = "lighthouse-level";

export function SoCProvider({ children }: { children: ReactNode }) {
  const [charactersState, setCharactersState] = useState<
    Record<number, CharacterState>
  >({});
  const [lighthouseLevel, setLighthouseLevel] = useState<number | "">("");
  const [matchedSpots, setMatchedSpots] = useState<MatchedSpot[]>([]);
  const [matchedSpecialSpots, setMatchedSpecialSpots] = useState<MatchedSpot[]>(
    []
  );
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeams>({});

  // Load character state & lighthouse level from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(CHARACTER_LOCAL_STORAGE_KEY);
      if (stored) {
        setCharactersState(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load character state from localStorage", err);
    }

    try {
      const levelStored = localStorage.getItem(LIGHTHOUSE_LOCAL_STORAGE_KEY);
      if (levelStored) {
        const num = Number(levelStored);
        if (!isNaN(num)) setLighthouseLevel(num);
      }
    } catch (err) {
      console.error("Failed to load lighthouse level from localStorage", err);
    }
  }, []);

  // Save character state only if it's non-null
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(CHARACTER_LOCAL_STORAGE_KEY);
      const storedState: Record<number, CharacterState> = stored
        ? JSON.parse(stored)
        : {};

      // Only overwrite localStorage if charactersState is valid object
      if (charactersState && Object.keys(charactersState).length > 0) {
        localStorage.setItem(
          CHARACTER_LOCAL_STORAGE_KEY,
          JSON.stringify(charactersState)
        );
      } else {
        // If charactersState is empty due to crash, preserve previous storage
        localStorage.setItem(
          CHARACTER_LOCAL_STORAGE_KEY,
          JSON.stringify(storedState)
        );
      }
    } catch (err) {
      console.error("Failed to save characterState", err);
    }
  }, [charactersState]);

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

  return (
    <SoCContext.Provider
      value={{
        charactersState,
        setCharactersState,
        lighthouseLevel,
        setLighthouseLevel,
        matchedSpots,
        setMatchedSpots,
        matchedSpecialSpots,
        setMatchedSpecialSpots,
        selectedTeams,
        setSelectedTeams,
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
