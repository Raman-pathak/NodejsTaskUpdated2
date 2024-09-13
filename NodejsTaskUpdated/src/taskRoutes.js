// const express = require('express');
// const router = express.Router();
// const rateLimit = require('./rateLimiter');
// const { addToQueue } = require('./queue');
// const taskProcessor = require('./taskProcessor');

// // Route to handle task requests
// router.post('/task', async (req, res) => {
//   const { user_id } = req.body;

//   if (!user_id) {
//     return res.status(400).json({ error: 'User ID is required' });
//   }

//   const allowed = await rateLimit(user_id);

//   if (!allowed) {
//     await addToQueue(user_id, req.body);
//     return res.status(429).json({ error: 'Rate limit exceeded. Task added to queue.' });
//   }

//   await taskProcessor(user_id);

//   res.status(200).json({ message: 'Task completed' });
// });

// module.exports = router;
