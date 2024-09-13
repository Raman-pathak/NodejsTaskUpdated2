const redisClient = require('../config/redisConfig');

const RATE_LIMIT_SECOND = 1;  // 1 task per second
const RATE_LIMIT_MINUTE = 20; // 20 tasks per minute

const getRateLimiterKey = (userId) => `rate-limit:${userId}`;

const rateLimit = async (userId) => {
  const key = getRateLimiterKey(userId);

  const now = Date.now();
  const minuteBucketKey = `${key}:minute`;
  const secondBucketKey = `${key}:second`;

  const [secondCount, minuteCount] = await Promise.all([
    redisClient.get(secondBucketKey),
    redisClient.get(minuteBucketKey)
  ]);

  // Limit tasks per second
  if (secondCount >= RATE_LIMIT_SECOND) {
    return false; // Rate limit exceeded for the second
  }

  // Limit tasks per minute
  if (minuteCount >= RATE_LIMIT_MINUTE) {
    return false; // Rate limit exceeded for the minute
  }

  // Increment counters
  await Promise.all([
    redisClient.multi()
      .incr(secondBucketKey)
      .expire(secondBucketKey, 1)
      .exec(),
    redisClient.multi()
      .incr(minuteBucketKey)
      .expire(minuteBucketKey, 60)
      .exec()
  ]);

  return true;
};

module.exports = rateLimit;
