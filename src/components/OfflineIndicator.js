import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { Wifi, WifiOff } from '@mui/icons-material';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  return (
    <Snackbar 
      open={!isOnline} 
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert 
        icon={<WifiOff />}
        severity="warning"
      >
        You are offline. Some features may be limited.
      </Alert>
    </Snackbar>
  );
};

export default OfflineIndicator;