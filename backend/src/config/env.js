import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'clausenova_user',
    password: process.env.DB_PASSWORD || 'clausenova_secret',
    name: process.env.DB_NAME || 'clausenova_db',
  },
  ai: {
    ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },
  upload: {
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '25', 10),
    dir: path.resolve(process.env.UPLOAD_DIR || 'tmp/uploads'),
  }
};
