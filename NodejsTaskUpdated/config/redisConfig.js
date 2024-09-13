// config/redisConfig.js
const redis = require('redis');

const client = redis.createClient({
  url: 'redis://localhost:5000' // Replace with your Redis server URL if needed
});

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

client.connect().catch((err) => {
  console.error('Error connecting to Redis:', err);
});

module.exports = client;
