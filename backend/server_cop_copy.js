const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const complianceData = require('./mockData/complianceData.json');
const marketData = require('./mockData/marketData.json');
const templateData = require('./mockData/templateData.json');

const client = new GoogleGenerativeAI("AIzaSyCpb87yzRHWQLGjpZ-UV9QUagSfIJrkY_k");
const model = client.getGenerativeModel({ model: "gemini-1.5-pro" });

const app = express();
app.use(cors());
app.use(express.json());

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
};

// Compliance endpoint
app.get('/compliance', (req, res) => {
  console.log("hello");
  const { country, product } = req.query;
  const data = complianceData[country]?.[product] || null;
  
  if (!data) {
    return res.status(404).json({ error: "Data not found" });
  }
  res.json(data);
});

// Incentives endpoint
app.get('/incentives', (req, res) => {
  const { country, product } = req.query;
  const incentives = complianceData[country]?.[product]?.incentives || null;
  
  if (!incentives) {
    return res.status(404).json({ error: "Incentives not found" });
  }
  res.json({ incentives });
});

// Market analysis endpoint
app.get('/market-analysis', (req, res) => {
  const { country, product } = req.query;
  const data = marketData[country]?.[product] || null;
  
  if (!data) {
    return res.status(404).json({ error: "Market data not found" });
  }
  res.json(data);
});

// Templates endpoint
app.get('/templates', (req, res) => {
  const { product } = req.query;
  const templates = templateData[product] || null;
  
  if (!templates) {
    return res.status(404).json({ error: "Templates not found" });
  }
  res.json({ templates });
});

// FAQ generation endpoint
app.post('/generate-faqs', async (req, res) => {
  const { requirements } = req.body;

  if (!requirements?.length) {
    return res.status(400).json({ error: "Requirements are missing" });
  }

  try {
    const prompt = `Generate 3 FAQs based on these compliance requirements: ${requirements.join(", ")}`;
    const result = await model.generateContent(prompt);
    res.json({ faqs: result.response.text().split("\n") });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate FAQs" });
  }
});

// Market report generation endpoint
app.post('/generate-report', async (req, res) => {
  const { country, product } = req.body;

  if (!country || !product) {
    return res.status(400).json({ error: "Country and product are required" });
  }

  try {
    const prompt = `Generate a market analysis report for ${product} in ${country} including market size, growth trends, and key challenges.`;
    const result = await model.generateContent(prompt);
    res.json({ report: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate market report" });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});