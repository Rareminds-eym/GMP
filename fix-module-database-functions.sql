-- =====================================================
-- MISSING MODULE DATABASE FUNCTIONS
-- =====================================================
-- This file contains the missing functions that the ModuleProgressService expects

-- Function: initialize_user_modules (creates records for all modules)
CREATE OR REPLACE FUNCTION initialize_user_modules(p_user_id uuid)
RETURNS TABLE(
  module_id integer,
  total_levels integer,
  is_unlocked boolean,
  is_completed boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_module_count integer := 4; -- Total modules: 1, 2, 3, 4
  v_module_id integer;
  v_total_levels integer;
BEGIN
  -- Create records for all modules (1, 2, 3, 4)
  FOR v_module_id IN 1..v_module_count LOOP
    -- Get total levels for this module
    v_total_levels := get_module_total_levels(v_module_id);
    
    -- Insert module progress record
    INSERT INTO module_progress (user_id, module_id, total_levels, is_completed)
    VALUES (p_user_id, v_module_id, v_total_levels, false)
    ON CONFLICT (user_id, module_id)
    DO UPDATE SET updated_at = now();
  END LOOP;
  
  -- Return all module progress
  RETURN QUERY
  SELECT 
    mp.module_id,
    mp.total_levels,
    is_module_unlocked(p_user_id, mp.module_id) as is_unlocked,
    mp.is_completed
  FROM module_progress mp
  WHERE mp.user_id = p_user_id
  ORDER BY mp.module_id;
END;
$$;

-- Function: get_all_module_progress (alias for get_user_module_progress)
CREATE OR REPLACE FUNCTION get_all_module_progress(p_user_id uuid)
RETURNS TABLE(
  module_id integer,
  total_levels integer,
  is_unlocked boolean,
  is_completed boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM get_user_module_progress(p_user_id);
END;
$$;

-- Function: Enhanced module config with proper module mapping
CREATE OR REPLACE FUNCTION get_module_total_levels(p_module_id integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_levels integer;
BEGIN
  -- Map module IDs to total levels
  CASE p_module_id
    WHEN 1 THEN v_total_levels := 4;  -- Introduction to GMP
    WHEN 2 THEN v_total_levels := 4;  -- Personal Hygiene  
    WHEN 3 THEN v_total_levels := 4;  -- Cleaning Validation
    WHEN 4 THEN v_total_levels := 4;  -- Documentation
    ELSE v_total_levels := 4;         -- Default
  END CASE;
  
  RETURN v_total_levels;
END;
$$;

-- Function: Enhanced module unlocking logic
CREATE OR REPLACE FUNCTION is_module_unlocked(
  p_user_id uuid,
  p_module_id integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Module 1 is always unlocked
  IF p_module_id = 1 THEN
    RETURN true;
  END IF;
  
  -- Check if previous module is completed
  -- Regular modules: each requires previous module completed
  RETURN EXISTS (
    SELECT 1 FROM module_progress 
    WHERE user_id = p_user_id 
      AND module_id = p_module_id - 1 
      AND is_completed = true
  );
END;
$$;

-- Create module_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS module_config (
  module_id integer PRIMARY KEY,
  module_name text NOT NULL,
  total_levels integer NOT NULL DEFAULT 4,
  unlock_previous_module integer DEFAULT NULL -- NULL means unlocked by default (Module 1)
);

-- Insert module configuration
INSERT INTO module_config (module_id, module_name, total_levels, unlock_previous_module) VALUES
(1, 'Introduction to GMP', 4, NULL),
(2, 'Personal Hygiene', 4, 1),
(3, 'Cleaning Validation', 4, 2), 
(4, 'Documentation', 4, 3)
ON CONFLICT (module_id) DO UPDATE SET
  module_name = EXCLUDED.module_name,
  total_levels = EXCLUDED.total_levels,
  unlock_previous_module = EXCLUDED.unlock_previous_module;
