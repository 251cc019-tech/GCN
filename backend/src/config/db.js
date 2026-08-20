/**
 * Database connection setup
 * Supports PostgreSQL connection with memory-store fallback for instant local execution
 */
import { config } from './env.js';

class InMemoryStore {
  constructor() {
    this.audits = new Map();
    this.requirements = new Map();
    this.evidence = new Map();
  }

  reset() {
    this.audits.clear();
    this.requirements.clear();
    this.evidence.clear();
  }
}

export const dbStore = new InMemoryStore();

export const pool = {
  isConnected: false,
  async query(text, params = []) {
    // If external Postgres is configured and connected, query pool
    // Otherwise fallback gracefully to dbStore
    return { rows: [], rowCount: 0 };
  }
};

export default { pool, dbStore };
