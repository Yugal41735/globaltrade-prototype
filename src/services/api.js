import axios from 'axios';
import { cacheManager, CACHE_KEYS } from './cacheManager';

const API_BASE_URL = 'https://globaltrade-prototype.vercel.app';

const handleApiError = (error) => {
  const message = error.response?.data?.message || 'An unexpected error occurred';
  throw new Error(message);
};

export const fetchComplianceData = async (country, product) => {
  const cacheKey = `${CACHE_KEYS.COMPLIANCE_DATA}_${country}_${product}`;
  
  try {
    const cachedData = cacheManager.getFromCache(cacheKey);
    if(cachedData) {
      return cachedData;
    }
    const response = await axios.get(`${API_BASE_URL}/compliance`, {
      params: { country, product },
    });

    cacheManager.saveToCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    if(!navigator.onLine) {
      const cachedData = cacheManager.getFromCache(cacheKey);
      if(cachedData) {
        return {
          ...cachedData,
          isOfflineData: true
        };
      }
    }
    return handleApiError(error);
  }
};

export const fetchIncentives = async (country, product) => {
  const cacheKey = `${CACHE_KEYS.INCENTIVES}_${country}_${product}`;
  
  try {
    const cachedData = cacheManager.getFromCache(cacheKey);
    if(cachedData) {
      return cachedData;
    }
    
    const response = await axios.get(`${API_BASE_URL}/incentives`, {
      params: { country, product },
    });

    cacheManager.saveToCache(cacheKey, response.data.incentives);

    return response.data.incentives;
  } catch (error) {
    if(!navigator.onLine) {
      const cachedData = cacheManager.getFromCache(cacheKey);
      if(cachedData) {
        return {
          ...cachedData,
          isOfflineData: true
        };
      }
    }
    return handleApiError(error);
  }
};

export const generateFaqs = async (requirements) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-faqs`, { 
      requirements 
    });
    return response.data.faqs;
  } catch (error) {
    if(!navigator.onLine) {
      throw new Error('This feature requires an internet connection')
    }
    return handleApiError(error);
  }
};

export const fetchMarketData = async (country, product) => {
  const cacheKey = `${CACHE_KEYS.MARKET_DATA}_${country}_${product}`;
  
  try {
    const cachedData = cacheManager.getFromCache(cacheKey);
    if(cachedData) {
      return cachedData;
    }

    const response = await axios.get(`${API_BASE_URL}/market-analysis`, {
      params: { country, product },
    });

    cacheManager.saveToCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    if(!navigator.onLine) {
      const cachedData = cacheManager.getFromCache(cacheKey);
      if(cachedData) {
        return {
          ...cachedData,
          isOfflineData: true
        };
      }
    }
    return handleApiError(error);
  }
};

export const fetchTemplates = async (product) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/templates`, {
      params: { product },
    });
    return response.data.templates;
  } catch (error) {
    return handleApiError(error);
  }
};

export const analyzeCertificationRequirements = async (country, product) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/certifications`, {
      params: { country, product },
    });
    return response.data.certifications;
  } catch (error) {
    return handleApiError(error);
  }
};

export const generateMarketReport = async (country, product) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-report`, {
      country,
      product
    });
    return response.data.report;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/countries`);
      return response.data.countries;
    } catch (error) {
      return handleApiError(error);
    }
  };
  
  export const fetchProducts = async (country) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: { country }
      });
      return response.data.products;
    } catch (error) {
      return handleApiError(error);
    }
  };