// Global test setup
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock environment variables for testing
process.env.OVERSEERR_URL = process.env.OVERSEERR_URL || 'http://localhost:5055';
process.env.OVERSEERR_API_KEY = process.env.OVERSEERR_API_KEY || 'test-api-key';
process.env.DISCORD_TOKEN = process.env.DISCORD_TOKEN || 'test-discord-token';
process.env.DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID || '123456789';
process.env.ENABLE_QUOTA_CHECK = process.env.ENABLE_QUOTA_CHECK || 'true';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods in tests to reduce noise
globalThis.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};
