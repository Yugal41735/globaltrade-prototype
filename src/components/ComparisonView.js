import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
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
import { CompareArrows, Close } from '@mui/icons-material';

const ComparisonView = ({ 
  open, 
  onClose, 
  analyses 
}) => {
  if (!analyses || analyses.length === 0) return null;

  // Prepare market size comparison data
  const marketSizeData = analyses[0]?.marketData?.size?.map((entry, index) => {
    const dataPoint = { year: entry.year };
    analyses.forEach((analysis, i) => {
      dataPoint[`${analysis.country} - ${analysis.product}`] = 
        analysis.marketData?.size?.[index]?.value || 0;
    });
    return dataPoint;
  }) || [];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Market Comparison Analysis
          </Typography>
          <Button
            startIcon={<Close />}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Market Size Comparison Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Market Size Comparison (Billion USD)
                </Typography>
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
                          key={`${analysis.country}-${analysis.product}`}
                          dataKey={`${analysis.country} - ${analysis.product}`}
                          fill={index === 0 ? '#8884d8' : '#82ca9d'}
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
                  Compliance Requirements
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Market</TableCell>
                      <TableCell>Requirements</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyses.map((analysis) => (
                      <TableRow key={`${analysis.country}-${analysis.product}`}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {analysis.country} - {analysis.product}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {analysis.complianceData?.requirements?.map((req, index) => (
                              <Chip
                                key={index}
                                label={req}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          {/* Incentives Comparison */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Available Incentives
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Market</TableCell>
                      <TableCell>Incentives</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyses.map((analysis) => (
                      <TableRow key={`${analysis.country}-${analysis.product}`}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {analysis.country} - {analysis.product}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {analysis.incentives?.map((incentive, index) => (
                              <Chip
                                key={index}
                                label={incentive}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonView;