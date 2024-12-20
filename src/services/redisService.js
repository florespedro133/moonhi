const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
redisClient.connect().catch(console.error);

const setCache = async (key, value, ttl) => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
};

const getCache = async (key) => {
  const cachedValue = await redisClient.get(key);
  return cachedValue ? JSON.parse(cachedValue) : null;
};

module.exports = { setCache, getCache };
