const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/tasks.log');

const task = async (userId) => {
  const timestamp = Date.now();
  const logMessage = `${userId}-task completed at-${timestamp}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) throw err;
  });
};

module.exports = task;
