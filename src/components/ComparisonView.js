import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Close } from '@mui/icons-material';

const ComparisonView = ({ open, onClose, analyses }) => {
  if (!analyses || analyses.length !== 2) return null;

  // Prepare market size data for comparison
  const marketSizeData = analyses[0]?.marketData?.size?.map((entry, index) => ({
    year: entry.year,
    [`${analyses[0].country} - ${analyses[0].category}`]: entry.value,
    [`${analyses[1].country} - ${analyses[1].category}`]: analyses[1]?.marketData?.size?.[index]?.value
  })) || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Market Comparison Analysis</Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Market Size Comparison Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Market Size Comparison</Typography>
                <Box sx={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <BarChart data={marketSizeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {analyses.map((analysis, index) => (
                        <Bar 
                          key={`${analysis.country}-${analysis.category}`}
                          dataKey={`${analysis.country} - ${analysis.category}`}
                          fill={index === 0 ? "#8884d8" : "#82ca9d"}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Compliance Requirements Comparison */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Compliance Requirements Comparison
                </Typography>
                <Grid container spacing={2}>
                  {analyses.map((analysis, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            {analysis.country} - {analysis.category}
                          </Typography>
                          
                          <Typography variant="subtitle2" gutterBottom>
                            Mandatory Requirements:
                          </Typography>
                          {analysis.complianceData?.requirements?.mandatory?.map((req, idx) => (
                            <Box key={idx} sx={{ mb: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {req.requirement}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {req.description}
                              </Typography>
                            </Box>
                          ))}

                          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Recommended Requirements:
                          </Typography>
                          {analysis.complianceData?.requirements?.recommended?.map((req, idx) => (
                            <Box key={idx} sx={{ mb: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {req.requirement}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {req.description}
                              </Typography>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Incentives Comparison */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Available Incentives Comparison
                </Typography>
                <Grid container spacing={2}>
                  {analyses.map((analysis, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            {analysis.country} - {analysis.category}
                          </Typography>
                          {analysis.incentives?.map((incentive, idx) => (
                            <Box 
                              key={idx} 
                              sx={{ 
                                p: 1, 
                                mb: 1, 
                                bgcolor: 'background.default',
                                borderRadius: 1
                              }}
                            >
                              <Typography variant="body2">
                                {incentive}
                              </Typography>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonView;
