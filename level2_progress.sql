-- level2_progress.sql
-- Table to store Level 2 progress for each user
CREATE TABLE IF NOT EXISTS HL2_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    current_screen INTEGER NOT NULL DEFAULT 1,
    completed_screens JSONB NOT NULL DEFAULT '[]',
    timer INTEGER NOT NULL DEFAULT 0, -- store timer in seconds
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);
