"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useState } from "react";
import Step1Lighthouse from "./steps/Step1Lighthouse";
import Step2SpecialSpots from "./steps/Step2SpecialSpots";
import Step3TeamRecommendations from "./steps/Step3TeamRecommendations";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import { useSoCContext } from "../context/SoCContext";

interface RecommendationModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  "Enter Lighthouse Level",
  "Special Logistic Spots",
  "Team Recommendations",
  "Step 4",
  "Step 5",
];

export default function RecommendationModal({
  open,
  onClose,
}: RecommendationModalProps) {
  const { lighthouseLevel } = useSoCContext();
  const [activeStep, setActiveStep] = useState(0);

  const stepComponents = [
    <Step1Lighthouse key="step1" />,
    <Step2SpecialSpots key="step2" />,
    <Step3TeamRecommendations key="step3" />,
    <Step4 key="step4" />,
    <Step5 key="step5" />,
  ];

  const levelError =
    lighthouseLevel !== "" && (lighthouseLevel < 1 || lighthouseLevel > 70);

  const handleNext = () => {
    if (activeStep === 0 && (lighthouseLevel === "" || levelError)) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleStart = () => {
    // Trigger actual recommendation process here
    onClose();
    setActiveStep(0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg" // makes the modal large
    >
      <DialogTitle>Start Recommendation</DialogTitle>

      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Make sure your characters are filled or updated!
        </Alert>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {stepComponents[activeStep]}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button
          onClick={handleBack}
          color="inherit"
          disabled={activeStep === 0}
        >
          Back
        </Button>
        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            color="secondary"
            variant="contained"
            disabled={
              activeStep === 0 && (lighthouseLevel === "" || !!levelError)
            }
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleStart} color="secondary" variant="contained">
            Start
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
