-- Check if required tables exist and create them if needed

-- 1. Create module_progress table
CREATE TABLE IF NOT EXISTS module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id integer NOT NULL,
  total_levels integer NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- 2. Enable RLS
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
DROP POLICY IF EXISTS "Users can view their own module progress" ON module_progress;
CREATE POLICY "Users can view their own module progress" 
ON module_progress FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own module progress" ON module_progress;
CREATE POLICY "Users can insert their own module progress" 
ON module_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own module progress" ON module_progress;
CREATE POLICY "Users can update their own module progress" 
ON module_progress FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_module_progress_user ON module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_user_module ON module_progress(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_completed ON module_progress(user_id, is_completed);
