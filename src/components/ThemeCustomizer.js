import React from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Typography,
  Divider
} from '@mui/material';
import {
  Palette,
  DarkMode,
  LightMode
} from '@mui/icons-material';

const ThemeCustomizer = ({ darkMode, onDarkModeChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        aria-label="theme settings"
      >
        <Palette />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 240 }
        }}
      >
        <MenuItem>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {darkMode ? <DarkMode sx={{ mr: 1 }} /> : <LightMode sx={{ mr: 1 }} />}
              <Typography>Dark Mode</Typography>
            </Box>
            <Switch
              checked={darkMode}
              onChange={(e) => onDarkModeChange(e.target.checked)}
              inputProps={{ 'aria-label': 'toggle dark mode' }}
            />
          </Box>
        </MenuItem>
        <Divider />
      </Menu>
    </>
  );
};

export default ThemeCustomizer;