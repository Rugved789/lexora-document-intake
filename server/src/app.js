import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import intakeRoutes from './routes/intakeRoutes.js';
import prisma from './db/index.js';

// Validate environment variables
try {
  validateConfig();
} catch (error) {
  console.error('Configuration Error:', error.message);
  process.exit(1);
}

const app = express();

// Middleware
const allowedOrigins = (config.clientUrl || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', intakeRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`LLM Provider: ${config.llm.provider}`);

  // Pre-warm database connection immediately on startup
  prisma.$connect()
    .then(() => {
      console.log('✓ PostgreSQL Database connection pre-warmed successfully');
    })
    .catch((err) => {
      console.warn('Database pre-warm warning (will retry on first query):', err.message);
    });
});

export default app;
