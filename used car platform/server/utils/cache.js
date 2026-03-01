const redis = require('redis');

let redisClient = null;
let cacheEnabled = false;

// Initialize Redis client (non-blocking)
const initRedis = async () => {
  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        connectTimeout: 3000, // 3 second timeout
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.warn('⚠️ Redis unavailable - running without cache');
            return new Error('Redis connection limit reached');
          }
          return Math.min(retries * 200, 500);
        },
      },
    });

    redisClient.on('error', (err) => {
      if (!cacheEnabled) {
        console.warn('⚠️ Redis unavailable - caching disabled');
      }
      cacheEnabled = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected - Cache enabled');
      cacheEnabled = true;
    });

    redisClient.on('end', () => {
      console.warn('⚠️ Redis connection closed');
      cacheEnabled = false;
    });

    // Try to connect but don't await - let it happen in background
    redisClient.connect().catch(() => {
      cacheEnabled = false;
    });
  } catch (error) {
    console.warn('⚠️ Redis unavailable - caching disabled');
    cacheEnabled = false;
  }
};

// Initialize on module load (async but non-blocking)
initRedis();

// Cache key generators
const cacheKeys = {
  allCars: (filters = {}) => {
    const filterStr = JSON.stringify(filters);
    return `cars:all:${Buffer.from(filterStr).toString('base64').substring(0, 50)}`;
  },
  carById: (id) => `car:${id}`,
  userCars: (userId) => `user:${userId}:cars`,
  search: (query) => `search:${Buffer.from(query).toString('base64')}`,
  favorites: (userId) => `favorites:${userId}`,
  favorites_count: (carId) => `car:${carId}:favCount`,
};

// Cache durations (in seconds)
const cacheDurations = {
  carsList: 5 * 60, // 5 minutes
  carDetail: 10 * 60, // 10 minutes
  search: 5 * 60, // 5 minutes
  userCars: 3 * 60, // 3 minutes
  favorites: 1 * 60, // 1 minute
};

// Set cache (async)
const setCache = async (key, data, duration = 300) => {
  if (!cacheEnabled || !redisClient) return;
  
  try {
    await redisClient.setEx(key, duration, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error.message);
  }
};

// Get cache (async)
const getCache = async (key) => {
  if (!cacheEnabled || !redisClient) {
    return null;
  }

  try {
    const data = await redisClient.get(key);
    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data);
    return parsed;
  } catch (error) {
    console.error('Cache get error:', error.message);
    return null;
  }
};

// Delete cache (async)
const deleteCache = async (key) => {
  if (!cacheEnabled || !redisClient) return;
  
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Cache delete error:', error.message);
  }
};

// Delete cache by pattern (async)
const deleteCachePattern = async (pattern) => {
  if (!cacheEnabled || !redisClient) return;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Cache pattern delete error:', error.message);
  }
};

// Flush entire cache (async)
const flushCache = async () => {
  if (!cacheEnabled || !redisClient) return;
  
  try {
    await redisClient.flushDb();
    console.log('✨ Cache flushed');
  } catch (error) {
    console.error('Cache flush error:', error.message);
  }
};

module.exports = {
  redisClient,
  cacheEnabled: () => cacheEnabled,
  cacheKeys,
  cacheDurations,
  setCache,
  getCache,
  deleteCache,
  deleteCachePattern,
  flushCache,
};
