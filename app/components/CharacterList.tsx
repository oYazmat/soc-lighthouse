import * as htmlToImage from "html-to-image";
import { Box, Button } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import CharacterFilters from "./CharacterFilters";
import { useSoCContext } from "../context/SoCContext";
import type { CharacterFilterValues } from "~/interfaces/CharacterFilterValues";
import { CHARACTERS } from "~/utils/data-loader";
import { RARITY_ORDER } from "~/utils/characters";
import CharacterJsonModal from "./CharacterJsonModal";
import type { CharactersState } from "~/interfaces/CharactersState";
import CharacterTable from "./CharacterTable";

export default function CharacterList() {
  const {
    charactersState,
    setCharactersState,
    setMatchedSpots,
    setMatchedSpecialSpots,
    setSelectedTeams,
  } = useSoCContext();

  const [filters, setFilters] = useState<CharacterFilterValues>({
    name: "",
    rarity: [],
    factions: [],
    ownership: "All",
    factionMode: "inclusive",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"import" | "export">("export");

  const tableRef = useRef<HTMLDivElement>(null);

  // Collect all unique factions from the data
  const allFactions = useMemo(() => {
    const set = new Set<string>();
    CHARACTERS.forEach((c) => c.factions.forEach((f: string) => set.add(f)));
    return Array.from(set).sort();
  }, []);

  // Filter + sort characters
  const filteredCharacters = useMemo(() => {
    return CHARACTERS.filter((c) => {
      const matchesName = c.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());

      const matchesRarity =
        filters.rarity.length === 0 || filters.rarity.includes(c.rarity);

      let matchesFaction = true;

      if (filters.factions.length > 0) {
        if (filters.factionMode === "inclusive") {
          matchesFaction = filters.factions.some((f) => c.factions.includes(f));
        } else {
          matchesFaction = filters.factions.every((f) =>
            c.factions.includes(f)
          );
        }
      }

      const stars = charactersState[c.id]?.stars || 0;
      const matchesOwnership =
        !filters.ownership || filters.ownership === "All"
          ? true
          : filters.ownership === "Owned"
            ? stars > 0
            : stars === 0;

      return matchesName && matchesRarity && matchesFaction && matchesOwnership;
    }).sort((a, b) => {
      const rarityDiff = RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
      if (rarityDiff !== 0) return rarityDiff;
      return a.name.localeCompare(b.name);
    });
  }, [filters, charactersState]);

  useEffect(() => {
    setMatchedSpots([]);
    setMatchedSpecialSpots([]);
    setSelectedTeams({});
  }, [
    charactersState,
    setMatchedSpots,
    setMatchedSpecialSpots,
    setSelectedTeams,
  ]);

  // Handlers to update state
  const handleStarsChange = (id: number, stars: number) => {
    setCharactersState((prev) => {
      const prevState = prev?.[id] ?? { stars: 0, rank: 0 };
      return {
        ...prev,
        [id]: {
          stars,
          rank: stars === 0 ? 0 : prevState.rank,
        },
      };
    });
  };

  const handleRankChange = (id: number, rank: number) => {
    setCharactersState((prev) => ({
      ...(prev ?? {}),
      [id]: {
        ...((prev ?? {})[id] ?? { stars: 0, rank: 0 }),
        rank,
      },
    }));
  };

  const handleScreenshot = async () => {
    if (!tableRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(tableRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        quality: 1,
        skipFonts: true,
      });

      const link = document.createElement("a");
      link.download = "characters-table.png";
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Screenshot failed:", e);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        {/* Left: Filters */}
        <CharacterFilters
          filters={filters}
          onChange={setFilters}
          allFactions={allFactions}
        />

        {/* Right: Import / Export / Screenshot */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            sx={{ height: 40 }}
            color="primary"
            onClick={() => {
              setModalMode("import");
              setModalOpen(true);
            }}
          >
            Import
          </Button>

          <Button
            variant="outlined"
            size="small"
            sx={{ height: 40 }}
            color="success"
            onClick={() => {
              setModalMode("export");
              setModalOpen(true);
            }}
          >
            Export
          </Button>

          <Button
            variant="outlined"
            size="small"
            sx={{ height: 40 }}
            color="secondary"
            onClick={handleScreenshot}
          >
            Take Screenshot
          </Button>
        </Box>

        <CharacterJsonModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={modalMode}
          data={charactersState}
          onSave={(json: CharactersState) => {
            setCharactersState(json);
          }}
        />
      </Box>

      <div ref={tableRef}>
        <CharacterTable
          characters={filteredCharacters}
          charactersState={charactersState}
          onStarsChange={handleStarsChange}
          onRankChange={handleRankChange}
        />
      </div>
    </>
  );
}
