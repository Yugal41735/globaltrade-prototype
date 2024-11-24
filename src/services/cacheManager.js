const CACHE_KEYS = {
    MARKET_DATA: 'marketData',
    COMPLIANCE_DATA: 'complianceData',
    SAVED_ANALYSES: 'savedAnalyses',
    LAST_UPDATE: 'lastUpdate',
    INCENTIVES: 'incentives'
  };
  
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  export const cacheManager = {
    // Save data to cache
    saveToCache: (key, data) => {
      try {
        const cacheData = {
          data,
          timestamp: new Date().getTime()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
      } catch (error) {
        console.error('Cache save error:', error);
      }
    },
  
    // Get data from cache
    getFromCache: (key) => {
      try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
  
        const { data, timestamp } = JSON.parse(cached);
        const now = new Date().getTime();
  
        // Check if cache is expired
        if (now - timestamp > CACHE_EXPIRY) {
          localStorage.removeItem(key);
          return null;
        }
  
        return data;
      } catch (error) {
        console.error('Cache retrieval error:', error);
        return null;
      }
    },
  
    // Clear specific cache
    clearCache: (key) => {
      localStorage.removeItem(key);
    },
  
    // Clear all cache
    clearAllCache: () => {
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    },
  
    // Check if cache exists and is valid
    isValidCache: (key) => {
      try {
        const cached = localStorage.getItem(key);
        if (!cached) return false;
  
        const { timestamp } = JSON.parse(cached);
        const now = new Date().getTime();
  
        return (now - timestamp) <= CACHE_EXPIRY;
      } catch (error) {
        return false;
      }
    }
  };
  
export { CACHE_KEYS };