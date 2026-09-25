import dotenv from 'dotenv';

dotenv.config();

/**
 * Application configuration
 * All environment variables centralized here
 */
export const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // Clerk Authentication
  clerkSecretKey: process.env.CLERK_SECRET_KEY,

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // LLM Configuration (Provider-Independent)
  llm: {
    provider: process.env.LLM_PROVIDER || 'groq',
    model: process.env.LLM_MODEL || 'openai/gpt-oss-120b',
    apiKey: process.env.GROQ_API_KEY || process.env.LLM_API_KEY || ''
  }
};

/**
 * Validate required environment variables
 */
export function validateConfig() {
  const required = [
    'CLERK_SECRET_KEY',
    'DATABASE_URL'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please copy .env.example to .env and fill in the values.'
    );
  }
}
