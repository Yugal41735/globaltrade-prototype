import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Collapse
} from '@mui/material';
import { Info } from '@mui/icons-material';

const stepGuides = {
  0: {
    title: 'Select Your Target Market',
    description: 'Choose the country you want to expand to and specify your product category. This helps us provide relevant market insights and compliance requirements.',
    tips: [
      'Consider markets with high demand for eco-friendly products',
      'Check if your product category has specific regulations',
      'Review market size and growth potential'
    ]
  },
  1: {
    title: 'Market Analysis',
    description: 'Review comprehensive market data including size, growth trends, and competitive landscape.',
    tips: [
      'Compare market growth rates across years',
      'Identify seasonal trends if any',
      'Analyze competitor market share'
    ]
  },
  2: {
    title: 'Compliance Requirements',
    description: 'Understand the regulatory requirements and necessary certifications for your product.',
    tips: [
      'Note all mandatory certifications',
      'Plan for compliance testing timelines',
      'Budget for certification costs'
    ]
  },
  3: {
    title: 'Available Grants & Incentives',
    description: 'Discover financial incentives and support programs available for your business.',
    tips: [
      'Check application deadlines',
      'Review eligibility criteria',
      'Calculate potential financial benefits'
    ]
  }
};

const StepGuide = ({ activeStep }) => {
  const guide = stepGuides[activeStep];

  return (
    <Collapse in={Boolean(guide)}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          backgroundColor: 'primary.light',
          color: 'primary.contrastText'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Info sx={{ mr: 1 }} />
          <Typography variant="h6">{guide?.title}</Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {guide?.description}
        </Typography>
        {guide?.tips && (
          <Box sx={{ pl: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Pro Tips:
            </Typography>
            {guide.tips.map((tip, index) => (
              <Typography key={index} variant="body2" sx={{ ml: 2, '&:before': { content: '"•"', mr: 1 } }}>
                {tip}
              </Typography>
            ))}
          </Box>
        )}
      </Paper>
    </Collapse>
  );
};

export default StepGuide;