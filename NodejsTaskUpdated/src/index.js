const express = require('express');
const rateLimit = require('./rateLimiter');
const { addToQueue, processQueue } = require('./queue');
const taskProcessor = require('./taskProcessor');
const redisClient = require('../config/redisConfig'); // Import Redis client

const app = express();
const port = 5000;

app.use(express.json());

app.post('/task', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const allowed = await rateLimit(user_id);

    if (!allowed) {
      await addToQueue(user_id, req.body);
      return res.status(429).json({ error: 'Rate limit exceeded. Task added to queue.' });
    }

    await taskProcessor(user_id);

    res.status(200).json({ message: 'Task completed' });
  } catch (err) {
    console.error('Error processing task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Process queued tasks every second
const processAllQueues = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const stream = redisClient.scanIterator({
      MATCH: 'task-queue:*',
      COUNT: 100 // Adjust count as needed
    });

    for await (const keys of stream) {
      for (const key of keys) {
        const userId = key.split(':')[1];
        await processQueue(userId, taskProcessor);
      }
    }
  } catch (error) {
    console.error('Error processing queues:', error);
  }
};

setInterval(processAllQueues, 1000);

// Handle process termination and clean up
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing Redis client');
  await redisClient.quit();
  process.exit(0);
});
