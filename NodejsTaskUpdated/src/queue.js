const redisClient = require('../config/redisConfig');

const addToQueue = async (userId, task) => {
  const queueKey = `task-queue:${userId}`;
  await redisClient.rpush(queueKey, JSON.stringify(task));
};

const processQueue = async (userId, processTask) => {
  const queueKey = `task-queue:${userId}`;
  const taskString = await redisClient.lpop(queueKey);

  if (taskString) {
    const task = JSON.parse(taskString);
    await processTask(task);
  }
};

module.exports = { addToQueue, processQueue };
