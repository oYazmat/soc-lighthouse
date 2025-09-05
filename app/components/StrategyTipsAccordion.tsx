import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";

export default function StrategyTipsAccordion() {
  return (
    <Box sx={{ mt: 2 /* wrapper keeps spacing stable */ }}>
      <Accordion
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 2,
          "& .MuiAccordionSummary-content": { margin: 0 },
          "& .MuiAccordionSummary-root": { minHeight: 48 },
          "& .MuiAccordionSummary-root.Mui-expanded": { minHeight: 48 },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "primary.contrastText" }} />}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            py: 1,
          }}
        >
          <InfoIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle2" fontWeight={600}>
            Strategy Tips
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ bgcolor: "background.paper", pt: 2, pb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Braindead Mode:</strong> Use if you just want to auto-fill
            as many teams as possible (up to 2 per destination) for daily
            dispatches. Fast, but not optimal.
          </Typography>

          <Typography variant="body2" gutterBottom>
            <strong>Optimal Setup:</strong> Sending only your single strongest
            team each time yields the best results, but it is very
            time-consuming and likely requires multiple setups throughout the
            day.
          </Typography>

          <Typography variant="body2" gutterBottom>
            <strong>Recommended Approach:</strong> Set up 2–5 of your strongest
            teams that can cover all your available destinations (the exact
            number depends on how many times you can log in to send dispatches
            each day), and assign the rest of your characters to logistics. This
            balances efficiency and convenience.
          </Typography>

          <Typography variant="body2" gutterBottom>
            <strong>Faction Bonus Limit:</strong> Only up to 4 characters of the
            same faction contribute to faction bonuses. The 5th character won’t
            increase the bonus, so the “Bonus Faction” column may differ from
            your leader’s factions.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
