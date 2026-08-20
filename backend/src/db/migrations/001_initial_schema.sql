-- ClauseNova Database Schema
-- Compatible with PostgreSQL 14+

CREATE TABLE IF NOT EXISTS audits (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    standard_name VARCHAR(255) NOT NULL,
    standard_type VARCHAR(100) DEFAULT 'ISO 9001:2015',
    status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'complete', 'failed'
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS requirements (
    id VARCHAR(64) PRIMARY KEY,
    audit_id VARCHAR(64) NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    clause_id VARCHAR(100) NOT NULL,
    section VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'verified', 'flagged', 'pending'
    reviewer_note TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence (
    id VARCHAR(64) PRIMARY KEY,
    requirement_id VARCHAR(64) NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    page INTEGER,
    paragraph INTEGER,
    excerpt TEXT,
    confidence NUMERIC(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_requirements_audit_id ON requirements(audit_id);
CREATE INDEX IF NOT EXISTS idx_evidence_requirement_id ON evidence(requirement_id);
