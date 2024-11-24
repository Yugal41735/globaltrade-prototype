import React from 'react';
import {
  Tooltip,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

const HelpTooltip = ({ title, content }) => {
  return (
    <Tooltip
      title={
        <Box sx={{ p: 1, maxWidth: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2">
            {content}
          </Typography>
        </Box>
      }
      arrow
      placement="right"
    >
      <IconButton size="small" color="primary" sx={{ ml: 1 }}>
        <HelpOutline fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default HelpTooltip;