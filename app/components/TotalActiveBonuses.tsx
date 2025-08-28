import { Box, Typography } from "@mui/material";

interface TotalActiveBonusesProps {
  bonuses: {
    bonusYield: number;
    bonusLogistics: number;
    bonusLight: number;
    bonusEvents: number;
  };
}

export default function TotalActiveBonuses({
  bonuses,
}: TotalActiveBonusesProps) {
  const { bonusYield, bonusLogistics, bonusLight, bonusEvents } = bonuses;

  // Check if there’s anything to display
  const hasBonuses =
    bonusYield > 0 || bonusLogistics > 0 || bonusLight > 0 || bonusEvents > 0;
  if (!hasBonuses) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Total Active Bonuses
      </Typography>
      {bonusYield > 0 && (
        <Typography variant="body2" color="text.secondary">
          Expedition Yield: +{bonusYield}%
        </Typography>
      )}
      {bonusLogistics > 0 && (
        <Typography variant="body2" color="text.secondary">
          Logistics Bonus: +{bonusLogistics}%
        </Typography>
      )}
      {bonusLight > 0 && (
        <Typography variant="body2" color="text.secondary">
          Light Production Rate: +{bonusLight}%
        </Typography>
      )}
      {bonusEvents > 0 && (
        <Typography variant="body2" color="text.secondary">
          More frequent expedition events: x{bonusEvents}
        </Typography>
      )}
    </Box>
  );
}
