import { config } from './env.js';

export const OLLAMA_URL = config.ai.ollamaUrl;
export const OLLAMA_MODEL = config.ai.ollamaModel;

export default {
  OLLAMA_URL,
  OLLAMA_MODEL,
};
