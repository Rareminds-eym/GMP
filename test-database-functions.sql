-- Test script to verify module database functions work correctly
-- Run this in Supabase SQL Editor AFTER running fix-module-database-functions.sql

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('module_progress', 'module_config');

-- 2. Check if functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'initialize_user_modules',
    'get_all_module_progress', 
    'is_module_unlocked',
    'get_module_total_levels'
);

-- 3. Test with your user ID (replace with your actual user ID)
-- Get your user ID first:
SELECT auth.uid() as your_user_id;

-- 4. Test initialize_user_modules function (replace USER_ID_HERE with your actual user ID)
-- SELECT * FROM initialize_user_modules('USER_ID_HERE');

-- 5. Test module unlock status (replace USER_ID_HERE with your actual user ID)
-- SELECT 
--   module_id,
--   is_module_unlocked('USER_ID_HERE', module_id) as is_unlocked
-- FROM generate_series(1, 4) as module_id;

-- 6. Check module_progress table content (replace USER_ID_HERE with your actual user ID)
-- SELECT * FROM module_progress WHERE user_id = 'USER_ID_HERE' ORDER BY module_id;
