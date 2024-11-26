import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  IconButton,
  Paper
} from '@mui/material';
import { Close, NavigateNext, NavigateBefore } from '@mui/icons-material';
import welcomeImage from './welcome.png'

const tutorialSteps = [
  {
    title: "Welcome to GlobalTrade AI Assistant",
    content: "This tutorial will guide you through the key features of our platform to help you analyze international markets effectively.",
    image: welcomeImage
  },
  {
    title: "Select Your Target Market",
    content: "Choose your target country and product category. Our AI will analyze market opportunities and compliance requirements.",
    image: "/market-selection.svg"
  },
  {
    title: "Market Analysis",
    content: "Review comprehensive market data including size, growth trends, and competitive landscape to make informed decisions.",
    image: "/market-analysis.svg"
  },
  {
    title: "Compliance Check",
    content: "Understand regulatory requirements and necessary certifications for your product in the target market.",
    image: "/compliance.svg"
  },
  {
    title: "Grants & Incentives",
    content: "Discover available financial incentives and support programs to assist your market entry.",
    image: "/incentives.svg"
  },
  {
    title: "Save & Compare",
    content: "Save your analyses and compare different markets to make the best expansion decision.",
    image: "/compare.svg"
  }
];

const TutorialGuide = ({ open, onClose, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  console.log(showTutorial);


  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    setShowTutorial(!hasSeenTutorial);
  }, []);

  const handleNext = () => {
    if (activeStep === tutorialSteps.length - 1) {
      handleComplete();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{tutorialSteps[activeStep].title}</Typography>
          <IconButton onClick={handleSkip}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'primary.light',
              color: 'primary.contrastText'
            }}
          >
            {/* <Box 
              component="img"
              src={tutorialSteps[activeStep].image}
              alt="Tutorial step"
              sx={{ 
                width: '10%',
                maxWidth: 400,
                height: 'auto',
                mb: 3,
                borderRadius: 2,
                borderShadow: 1
              }}
            /> */}
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              {tutorialSteps[activeStep].content}
            </Typography>
          </Paper>

          <Stepper activeStep={activeStep} alternativeLabel>
            {tutorialSteps.map((step, index) => (
              <Step key={index}>
                <StepLabel></StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<NavigateBefore />}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleSkip}>Skip Tutorial</Button>
        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={<NavigateNext />}
        >
          {activeStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TutorialGuide;