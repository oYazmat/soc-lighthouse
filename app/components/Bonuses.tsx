import { Box } from "@mui/material";
import type { TotalBonuses } from "~/interfaces/TotalBonuses";
import TotalBonusesBox from "./TotalBonusesBox";

interface BonusesProps {
  activeBonuses?: TotalBonuses;
  inactiveBonuses?: TotalBonuses;
}

export default function Bonuses({
  activeBonuses,
  inactiveBonuses,
}: BonusesProps) {
  if (!activeBonuses && !inactiveBonuses) return null;

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      {activeBonuses && <TotalBonusesBox bonuses={activeBonuses} active />}
      {inactiveBonuses && (
        <TotalBonusesBox bonuses={inactiveBonuses} active={false} />
      )}
    </Box>
  );
}
