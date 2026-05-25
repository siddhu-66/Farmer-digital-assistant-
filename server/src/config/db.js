const mongoose = require('mongoose');
const { getEnv } = require('./env');

function formatMongoStartupError(uri, err) {
  const lines = [
    '',
    '❌ MongoDB is not available.',
    `   URI: ${uri}`,
    `   ${err.message}`,
    '',
    '   Start MongoDB locally, then restart the backend:',
    '   • Windows:  net start MongoDB',
    '   • macOS:    brew services start mongodb-community',
    '   • Docker:   docker run -d -p 27017:27017 mongo:7',
    '',
    '   Configure MONGO_URI in server/.env if you use a different host.',
    '',
  ];
  return lines.join('\n');
}

const connectDB = async () => {
  const env = getEnv();
  const uri = env.MONGO_URI || 'mongodb://localhost:27017/farmer_assistant';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected (${conn.connection.host})`);

    if (env.NODE_ENV !== 'test') {
      try {
        const { ensureTestUsers } = require('../seedTestUsers');
        await ensureTestUsers();
      } catch (e) {
        console.warn('[seed] ensureTestUsers:', e.message);
      }
    }
  } catch (err) {
    console.error(formatMongoStartupError(uri, err));
    throw err;
  }
};

module.exports = connectDB;
