import { Box, Typography, Stack } from "@mui/material";
import AgricultureIcon from "@mui/icons-material/Agriculture"; // Expedition Yield
import LocalShippingIcon from "@mui/icons-material/LocalShipping"; // Logistics
import LightModeIcon from "@mui/icons-material/LightMode"; // Light Production
import EventAvailableIcon from "@mui/icons-material/EventAvailable"; // Events

interface TotalBonusesBoxProps {
  bonuses: {
    bonusYield: number;
    bonusLogistics: number;
    bonusLight: number;
    bonusEvents: number;
  };
  active: boolean;
}

export default function TotalBonusesBox({
  bonuses,
  active,
}: TotalBonusesBoxProps) {
  const { bonusYield, bonusLogistics, bonusLight, bonusEvents } = bonuses;

  const iconColor = active ? "success" : "error";

  const items = [
    {
      label: "Expedition Yield",
      value: bonusYield,
      suffix: "%",
      icon: <AgricultureIcon fontSize="small" color={iconColor} />,
    },
    {
      label: "Logistics Bonus",
      value: bonusLogistics,
      suffix: "%",
      icon: <LocalShippingIcon fontSize="small" color={iconColor} />,
    },
    {
      label: "Light Production",
      value: bonusLight,
      suffix: "%",
      icon: <LightModeIcon fontSize="small" color={iconColor} />,
    },
    {
      label: "Expedition Events",
      value: bonusEvents,
      prefix: "x",
      icon: <EventAvailableIcon fontSize="small" color={iconColor} />,
    },
  ];

  const visibleItems = items.filter((i) => i.value > 0);
  if (visibleItems.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {active ? "Total Active Bonuses" : "Total Inactive Bonuses"}
      </Typography>

      <Stack spacing={1}>
        {visibleItems.map(({ label, value, prefix, suffix, icon }) => (
          <Stack key={label} direction="row" alignItems="center" spacing={1}>
            {icon}
            <Typography variant="body2" color="text.secondary">
              {label}: {prefix ?? "+"}
              {value}
              {suffix ?? ""}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
