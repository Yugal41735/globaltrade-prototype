import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import { FileDownload } from '@mui/icons-material';

const ReportGenerator = ({ open, onClose, marketData, complianceData, incentives }) => {
  const [selectedSections, setSelectedSections] = useState({
    marketAnalysis: true,
    compliance: true,
    incentives: true
  });
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);

  const handleSectionToggle = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generateReport = async () => {
    try {
      setGenerating(true);
      
      // Prepare report data
      const reportData = {
        title: 'Market Entry Analysis Report',
        timestamp: new Date().toISOString(),
        sections: {}
      };

      if (selectedSections.marketAnalysis && marketData) {
        reportData.sections.marketAnalysis = {
          size: marketData.size,
          growth: marketData.growth,
          competitors: marketData.competitors
        };
      }

      if (selectedSections.compliance && complianceData) {
        reportData.sections.compliance = {
          requirements: complianceData.requirements
        };
      }

      if (selectedSections.incentives && incentives) {
        reportData.sections.incentives = incentives;
      }

      // Simulate file generation and download
      // In production, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trigger download
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: format === 'pdf' ? 'application/pdf' : 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `market-analysis-report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate Report</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Export Format</InputLabel>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              label="Export Format"
            >
              <MenuItem value="pdf">PDF Document</MenuItem>
              <MenuItem value="json">JSON Data</MenuItem>
            </Select>
          </FormControl>

          <List>
            <ListItem button onClick={() => handleSectionToggle('marketAnalysis')}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedSections.marketAnalysis}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary="Market Analysis" />
            </ListItem>
            
            <ListItem button onClick={() => handleSectionToggle('compliance')}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedSections.compliance}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary="Compliance Requirements" />
            </ListItem>
            
            <ListItem button onClick={() => handleSectionToggle('incentives')}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedSections.incentives}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary="Grants & Incentives" />
            </ListItem>
          </List>

          {!Object.values(selectedSections).some(Boolean) && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Please select at least one section to include in the report
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={generateReport}
          disabled={generating || !Object.values(selectedSections).some(Boolean)}
          startIcon={generating ? null : <FileDownload />}
        >
          {generating ? 'Generating...' : 'Generate Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportGenerator;