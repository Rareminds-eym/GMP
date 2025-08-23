-- Migration: Add idea statement columns to level2_screen3_progress table
-- This adds support for storing the three parts of the fill-in-the-blanks idea statement:
-- "I want to solve ___ for ___ by ___"

-- Add the three new columns for idea statement parts
ALTER TABLE level2_screen3_progress 
ADD COLUMN IF NOT EXISTS idea_statement_what TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS idea_statement_who TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS idea_statement_how TEXT DEFAULT '';

-- Add a computed column for the complete idea statement (optional, for easy querying)
ALTER TABLE level2_screen3_progress 
ADD COLUMN IF NOT EXISTS idea_statement TEXT 
GENERATED ALWAYS AS (
  CASE 
    WHEN idea_statement_what != '' OR idea_statement_who != '' OR idea_statement_how != '' 
    THEN 'I want to solve ' || idea_statement_what || ' for ' || idea_statement_who || ' by ' || idea_statement_how
    ELSE ''
  END
) STORED;

-- Update the check constraint for current_stage to allow stage 10 (now that we have 10 stages)
ALTER TABLE level2_screen3_progress 
DROP CONSTRAINT IF EXISTS level2_screen3_progress_current_stage_check;

ALTER TABLE level2_screen3_progress 
ADD CONSTRAINT level2_screen3_progress_current_stage_check 
CHECK (current_stage >= 1 AND current_stage <= 10);

-- Create an index on the idea statement parts for better query performance
CREATE INDEX IF NOT EXISTS idx_level2_screen3_progress_idea_parts 
ON level2_screen3_progress (idea_statement_what, idea_statement_who, idea_statement_how);

-- Update the updated_at trigger to include the new columns
-- (Assuming there's already an update trigger for the updated_at field)

-- Comments for documentation
COMMENT ON COLUMN level2_screen3_progress.idea_statement_what IS 'The "what" part: problem/need being solved';
COMMENT ON COLUMN level2_screen3_progress.idea_statement_who IS 'The "who" part: target audience';  
COMMENT ON COLUMN level2_screen3_progress.idea_statement_how IS 'The "how" part: solution method';
COMMENT ON COLUMN level2_screen3_progress.idea_statement IS 'Complete computed idea statement combining all three parts';
