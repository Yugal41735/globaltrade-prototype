import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Breadcrumbs,
  Link,
  Alert,
  Grid,
  Paper,
  CircularProgress,
  Tooltip,
  IconButton,
  Chip,
  LinearProgress
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { 
  Download, 
  History, 
  CompareArrows, 
  Info as InfoIcon,
  HelpOutline 
} from '@mui/icons-material';
import {
  fetchComplianceData,
  fetchIncentives,
  fetchMarketData
} from "./services/api";
import { fetchCountries, fetchProducts } from "./services/api";
import { cacheManager, CACHE_KEYS } from "./services/cacheManager";
import SavedAnalysis from './components/SavedAnalysis';
import ComparisonView from './components/ComparisonView';
import ReportGenerator from './components/ReportGenerator';
import ErrorBoundary from "./components/ErrorBoundary";
import HelpTooltip from "./components/HelpToolTip";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import StepGuide from "./components/StepGuide";
import TutorialGuide from "./components/TutorialGuide";
import ThemeCustomizer from "./components/ThemeCustomizer";
import OfflineIndicator from "./components/OfflineIndicator";

const GlobalTradeAssistant = () => {
  // State Management
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [savedAnalysisOpen, setSavedAnalysisOpen] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState(() => {
    const saved = localStorage.getItem('savedAnalyses');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeStep, setActiveStep] = useState(0);
  const [country, setCountry] = useState("");
  const [product, setProduct] = useState("");
  const [complianceData, setComplianceData] = useState(null);
  const [incentives, setIncentives] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [marketData, setMarketData] = useState(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isOfflineData, setIsOfflineData] = useState(false);
  // Add new state variables after existing ones
  const [countries, setCountries] = useState([]);
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setTutorialOpen(true);
    }
  }, []);

  // Add useEffect hooks after existing ones
useEffect(() => {
  const loadCountries = async () => {
    try {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    } catch (error) {
      setError("Failed to load countries");
    }
  };
  loadCountries();
}, []);

useEffect(() => {
  const loadProducts = async () => {
    if (country) {
      try {
        const productsData = await fetchProducts(country);
        setProducts(productsData);
      } catch (error) {
        setError("Failed to load products");
      }
    }
  };
  if (country) {
    loadProducts();
  }
}, [country]);

  // Constants
  const steps = [
    'Market Selection',
    'Market Analysis',
    'Compliance Check',
    'Grants & Incentives'
  ];

  // Handlers
  const handleCompare = (analyses) => {
    setSelectedAnalyses(analyses);
    setComparisonOpen(true);
  };

  const handleSaveAnalysis = () => {
    const newAnalysis = {
      id: Date.now(),
      date: new Date().toISOString(),
      country,
      product,
      marketSize: marketData?.size?.[marketData.size.length - 1]?.value,
      marketData,
      complianceData,
      incentives,
      favorite: false
    };

    const updatedAnalyses = [...savedAnalyses, newAnalysis];
    setSavedAnalyses(updatedAnalyses);
    localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
  };

  const handleRestoreAnalysis = (analysis) => {
    setCountry(analysis.country);
    setProduct(analysis.product);
    setMarketData(analysis.marketData);
    setComplianceData(analysis.complianceData);
    setIncentives(analysis.incentives);
    setActiveStep(1);
    setSavedAnalysisOpen(false);
  };

  const handleDeleteAnalysis = (id) => {
    const updatedAnalyses = savedAnalyses.filter(analysis => analysis.id !== id);
    setSavedAnalyses(updatedAnalyses);
    localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
  };

  const handleFavoriteAnalysis = (id) => {
    const updatedAnalyses = savedAnalyses.map(analysis => 
      analysis.id === id 
        ? { ...analysis, favorite: !analysis.favorite }
        : analysis
    );
    setSavedAnalyses(updatedAnalyses);
    localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
  };

  const handleFetchData = async () => {
    try {
      setLoading(true);
      setError("");
      setIsOfflineData(false);

      const [compliance, incentiveList, market] = await Promise.all([
        fetchComplianceData(country, product),
        fetchIncentives(country, product),
        fetchMarketData(country, product)
      ]);

      setComplianceData(compliance);
      setIncentives(incentiveList);
      setMarketData(market);
      setActiveStep(1);
      handleSaveAnalysis();

      if (compliance.isOfflineData || incentiveList.isOfflineData || market.isOfflineData) {
        setIsOfflineData(true);
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleThemeChange = (isDark) => {
    setDarkMode(isDark);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  };

  // Render Functions
  const renderMarketAnalysis = () => {
    if (loading) return <LoadingSkeleton />;
    if (!marketData?.size || !marketData?.growth) {
      return <Typography>No market data available</Typography>;
    }
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Market Size (Billion USD)</Typography>
                <HelpTooltip
                    title="Market Size"
                    content="Shows the total addressable market size over time. Use this to understand market potential and growth trends."
                />
              </Box>
              <Box sx={{ width: '100%', height: 300, minWidth: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={marketData.size} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="value" name="Market Size" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Growth Trend (%)</Typography>
                <HelpTooltip
                    title="Growth Trend"
                    content="Year-over-year market growth rate."
                />
              </Box>
              <Box sx={{ width: '100%', height: 300, minWidth: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={marketData.growth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Growth Rate" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {marketData.competitors && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Key Competitors</Typography>
                <Grid container spacing={1}>
                  {marketData.competitors.map((competitor, index) => (
                    <Grid item key={index}>
                      <Chip label={competitor} variant="outlined" />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        {marketData.marketShare && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Market Share Distribution</Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(marketData.marketShare).map(([key, value]) => (
                    <Box key={key} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
                        <Typography>{value}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={value} 
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  const renderExportButton = () => {
    if (activeStep > 0 && marketData) {
      return (
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => setReportDialogOpen(true)}
          sx={{ ml: 2 }}
        >
          Export Report
        </Button>
      );
    }
    return null;
  };

  return (
    <ErrorBoundary>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
              GlobalTrade AI Assistant
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2 }}>
              <ThemeCustomizer
                darkMode={darkMode}
                onDarkModeChange={handleThemeChange}
              />
              <Button
                variant="outlined"
                onClick={() => setTutorialOpen(true)}
              >
                Show Tutorial
              </Button>
            </Box>
          </Box>
          <Breadcrumbs>
            <Link color="inherit" href="#">Home</Link>
            <Typography color="text.primary">{steps[activeStep]}</Typography>
          </Breadcrumbs>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <StepGuide activeStep={activeStep} />

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Target Market
                  <HelpTooltip
                    title="Target Market Selection"
                    content="Choose your expansion destination. Consider factors like market size, regulations, and local competetion."
                  />  
                </Typography>
                <Select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">Select Country</MenuItem>
                  {/* <MenuItem value="United States">United States</MenuItem> */}
                  {/* <MenuItem value="Europe">Europe</MenuItem> */}
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Product Category
                  <HelpTooltip
                    title="Product Category"
                    content="Select your product type. This helps us provide relevant compliance requirements and market insights."
                  />
                </Typography>
                <Select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  fullWidth
                  disabled={!country}
                >
                  <MenuItem value="">Select Product</MenuItem>
                  {/* <MenuItem value="Eco-packaging">Eco-packaging</MenuItem> */}
                  {/* <MenuItem value="Biodegradable containers">
                    Biodegradable containers
                  </MenuItem> */}
                  {products.map((product) => (
                    <MenuItem key={product} value={product}>
                      {product}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleFetchData}
                  disabled={!country || !product || loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Analyze Market"}
                </Button>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && renderMarketAnalysis()}

          {activeStep === 2 && complianceData && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Compliance Requirements
                <HelpTooltip
                  title="Compliance Requirements"
                  content="Required certifications and regulatory requirements"
                />
              </Typography>
              <Grid container spacing={3}>
                {complianceData.requirements.map((req, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Typography>{req}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeStep === 3 && incentives && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Available Grants & Incentives
                <HelpTooltip
                  title="Grants & Incentives"
                  content="Financial support and incentives available"
                />
              </Typography>
              <Grid container spacing={3}>
                {incentives.map((incentive, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card>
                      <CardContent>
                        <Typography>{incentive}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  onClick={() => setSavedAnalysisOpen(true)}
                  sx={{ mr: 1 }}
                >
                  History
                </Button>
              )}
              {renderExportButton()}
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
                sx={{ ml: 1 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <SavedAnalysis
          open={savedAnalysisOpen}
          onClose={() => setSavedAnalysisOpen(false)}
          savedAnalyses={savedAnalyses}
          onRestore={handleRestoreAnalysis}
          onDelete={handleDeleteAnalysis}
          onFavorite={handleFavoriteAnalysis}
          onCompare={handleCompare}
        />

        <ComparisonView
          open={comparisonOpen}
          onClose={() => setComparisonOpen(false)}
          analyses={selectedAnalyses}
        />

        <ReportGenerator
          open={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
          marketData={marketData}
          complianceData={complianceData}
          incentives={incentives}
        />

        <TutorialGuide
          open={tutorialOpen}
          onClose={() => setTutorialOpen(false)}
          onComplete={() => {
            setTutorialOpen(false);
          }}
        />

        <OfflineIndicator />
        {isOfflineData && (
          <Alert
            severity="info"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000
            }}
          >
            You're viewing cached data. Some information may not be up to date.
          </Alert>
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default GlobalTradeAssistant;