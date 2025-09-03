import {
  Typography,
  Box,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useSoCContext } from "~/context/SoCContext";
import { useEffect, useState } from "react";
import {
  buildLeaderTeams,
  calculateFactionTeams,
  calculateOwnedCharacterPower,
  selectBestTeamsPerDestination,
} from "~/utils/characters";
import { CHARACTERS, LIGHTHOUSE_LEVELS } from "~/utils/data-loader";
import LighthouseDestinationsTabs from "../LighthouseDestinationsTabs";
import type { LeaderTeams } from "~/interfaces/LeaderTeams";

export default function Step3TeamRecommendations() {
  const {
    matchedSpecialSpots,
    charactersState,
    lighthouseLevel,
    selectedTeams,
    setSelectedTeams,
    setMatchedSpots,
  } = useSoCContext();

  const [leaderTeams, setLeaderTeams] = useState<LeaderTeams>({});
  const [loading, setLoading] = useState(true);
  const [allowOverlap, setAllowOverlap] = useState(true);
  const [braindeadMode, setBraindeadMode] = useState(false);

  const charactersAllowed = lighthouseLevel
    ? (LIGHTHOUSE_LEVELS.find((lvl) => lvl.level === lighthouseLevel)
        ?.characters ?? 1)
    : 1;

  useEffect(() => {
    let active = true;

    const runCalc = async () => {
      setLoading(true);

      // Small delay so spinner renders
      await new Promise((resolve) => setTimeout(resolve, 50));

      const matchedCharIds =
        matchedSpecialSpots?.map((s) => s.selectedChar?.id) || [];

      const ownedCharacters = CHARACTERS.filter(
        (c) =>
          charactersState[c.id]?.stars > 0 && !matchedCharIds.includes(c.id)
      );

      const charsWithPower = calculateOwnedCharacterPower(
        ownedCharacters,
        charactersState
      );

      const factionTeams = await calculateFactionTeams(
        charsWithPower,
        charactersAllowed < 5 ? charactersAllowed : 4, // Once 5 characters are unlocked, only 4 are used in the calculation
        lighthouseLevel
      );

      if (!active) return;

      const leaderTeamsMap = buildLeaderTeams(
        factionTeams,
        braindeadMode ? false : allowOverlap, // disallow overlap in Braindead mode
        braindeadMode,
        charactersAllowed >= 5, // Once 5 characters are unlocked, since only 4 characters are used in the calculation, leader should be added to the team
        charactersState
      );
      console.log("🚀 ~ runCalc ~ leaderTeamsMap:", leaderTeamsMap)

      setLeaderTeams(leaderTeamsMap);

      // Select the leader with the highest combinedPower per destination
      const selected = selectBestTeamsPerDestination(
        lighthouseLevel,
        leaderTeamsMap,
        braindeadMode
      );

      setSelectedTeams(selected);
      setLoading(false);
    };

    runCalc();
    return () => {
      active = false;
    };
  }, [
    charactersState,
    matchedSpecialSpots,
    charactersAllowed,
    allowOverlap,
    braindeadMode,
    lighthouseLevel,
    setSelectedTeams,
  ]);

  useEffect(() => {
    // Whenever selectedTeams changes, reset matchedSpots
    setMatchedSpots([]);
  }, [selectedTeams, setMatchedSpots]);

  return (
    <Box sx={{ mt: 2 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Calculating teams...
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Select your expedition teams
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose the teams you want to save to your presets. Any remaining
              characters will automatically be assigned to the remaining
              logistic spots next.
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Please review all tabs to ensure your teams are correctly assigned
              before proceeding.
            </Typography>

            {/* Braindead Mode Switch */}
            <FormControlLabel
              control={
                <Switch
                  checked={braindeadMode}
                  onChange={(e) => setBraindeadMode(e.target.checked)}
                />
              }
              label="Braindead Mode"
            />

            {/* Allow Overlap Switch */}
            <FormControlLabel
              control={
                <Switch
                  checked={allowOverlap}
                  onChange={(e) => setAllowOverlap(e.target.checked)}
                  disabled={braindeadMode} // disabled in Braindead mode
                />
              }
              label="Allow overlapping characters"
            />
          </Box>

          <LighthouseDestinationsTabs
            leaderTeams={leaderTeams}
            charactersAllowed={charactersAllowed}
          />
        </>
      )}
    </Box>
  );
}
