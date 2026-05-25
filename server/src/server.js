const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { loadEnv, getEnv } = require('./config/env');

loadEnv();

const connectDB = require('./config/db');
const app = require('./app');

async function startServer() {
  const env = getEnv();
  const PORT = env.PORT;

  if (env.NODE_ENV === 'development' && PORT !== 5000) {
    console.error(
      `\n❌ Invalid PORT=${PORT} for local development. Backend must use PORT=5000 (see server/.env).\n`
    );
    process.exit(1);
  }

  try {
    await connectDB();
  } catch {
    process.exit(1);
  }

  if (require.main !== module) {
    return;
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Backend listening on http://localhost:${PORT}`);
    console.log(`📡 CORS origin: ${env.FRONTEND_ORIGIN}`);
    console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use.`);
      console.error(`   Free the port, then restart (do not change PORT in development):`);
      console.error(`   Windows: netstat -ano | findstr :${PORT}`);
      console.error(`   Then:     taskkill /F /PID <PID>\n`);
    } else {
      console.error('❌ Server error:', err.message);
    }
    process.exit(1);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
