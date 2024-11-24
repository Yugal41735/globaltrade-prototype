import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  Box,
  Button,
  Chip,
  Tooltip,
  Checkbox
} from '@mui/material';
import {
  Delete,
  Restore,
  Star,
  StarBorder,
  CalendarToday,
  CompareArrows
} from '@mui/icons-material';

const SavedAnalysis = ({ 
  open, 
  onClose, 
  savedAnalyses, 
  onRestore, 
  onDelete, 
  onFavorite,
  onCompare 
}) => {
  // Add this state for tracking selected analyses for comparison
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  // Add this handler for managing comparison selection
  const handleComparisonSelect = (analysis) => {
    setSelectedForComparison(prev => {
      if (prev.find(a => a.id === analysis.id)) {
        return prev.filter(a => a.id !== analysis.id);
      }
      if (prev.length < 2) {
        return [...prev, analysis];
      }
      return prev;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Saved Market Analyses</Typography>
          <Chip 
            label={`${savedAnalyses.length} saved`} 
            size="small" 
            color="primary" 
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {savedAnalyses.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No saved analyses yet. Your analyzed markets will appear here.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {savedAnalyses.map((analysis) => (
              <Grid item xs={12} key={analysis.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'start' }}>
                        {/* Add Checkbox for comparison selection */}
                        <Checkbox
                          checked={selectedForComparison.some(a => a.id === analysis.id)}
                          onChange={() => handleComparisonSelect(analysis)}
                          disabled={selectedForComparison.length >= 2 && 
                                  !selectedForComparison.some(a => a.id === analysis.id)}
                        />
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {analysis.country} - {analysis.product}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(analysis.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          {analysis.marketSize && (
                            <Typography variant="body2" color="text.secondary">
                              Market Size: ${analysis.marketSize}B
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box>
                        <Tooltip title={analysis.favorite ? "Remove from favorites" : "Add to favorites"}>
                          <IconButton 
                            size="small" 
                            onClick={() => onFavorite(analysis.id)}
                          >
                            {analysis.favorite ? <Star color="warning" /> : <StarBorder />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Load this analysis">
                          <IconButton 
                            size="small" 
                            onClick={() => onRestore(analysis)}
                            color="primary"
                          >
                            <Restore />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            onClick={() => onDelete(analysis.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      {/* Add DialogActions for comparison button */}
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<CompareArrows />}
          disabled={selectedForComparison.length !== 2}
          onClick={() => {
            onCompare(selectedForComparison);
            onClose();
            setSelectedForComparison([]); // Reset selection after comparison
          }}
        >
          Compare Selected ({selectedForComparison.length}/2)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavedAnalysis;