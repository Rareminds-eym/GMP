# Level 2 Screen 3 Progress Table Column Mapping

## Overview
The `level2_screen3_progress` table columns have been updated to include stage numbers for better identification and tracking of user progress through the Level 2 Screen 3 innovation journey.

## Column Mapping (Old → New)

### Stage 1: YOUR INNOVATION IDEA
- `idea_statement_what` → `stage1_idea_what` (The "what" part: problem/need being solved)
- `idea_statement_who` → `stage1_idea_who` (The "who" part: target audience)
- `idea_statement_how` → `stage1_idea_how` (The "how" part: solution method)

### Stage 2: PROBLEM YOU ARE SOLVING
- `problem` → `stage2_problem` (Issue or need being addressed)

### Stage 3: TECHNOLOGY YOU CAN USE  
- `technology` → `stage3_technology` (Tools, apps, software, machines, or digital aids)

### Stage 4: COLLABORATION ANGLE
- `collaboration` → `stage4_collaboration` (Team partnerships and collaborations)

### Stage 5: CREATIVITY TWIST
- `creativity` → `stage5_creativity` (Unique features, design, or approach)

### Stage 6: SPEED & SCALE
- `speed_scale` → `stage6_speed_scale` (Quick application and scalability)

### Stage 7: PURPOSE & IMPACT
- `impact` → `stage7_impact` (Value creation: social, environmental, educational, economic)

### Stage 8: FINAL STATEMENT
- `final_problem` → `stage8_final_problem`
- `final_technology` → `stage8_final_technology`
- `final_collaboration` → `stage8_final_collaboration`
- `final_creativity` → `stage8_final_creativity`
- `final_speed_scale` → `stage8_final_speed_scale`
- `final_impact` → `stage8_final_impact`

### Stage 9: PROTOTYPE
- `uploaded_file_name` → `stage9_prototype_file_name`
- `uploaded_file_data` → `stage9_prototype_file_data`

### Stage 10: REFLECTION
- `reflection` → `stage10_reflection` (Learning and improvement insights)

## Unchanged Columns
The following columns remain unchanged:
- `id` (Primary key)
- `user_id` (User reference)
- `email` (User email)
- `current_stage` (Current stage number)
- `completed_stages` (Array of completed stages)
- `is_completed` (Completion status)
- `progress_percentage` (Progress percentage)
- `selected_case_id` (Selected case reference)
- `created_at` (Creation timestamp)
- `updated_at` (Last update timestamp)
- `completed_at` (Completion timestamp)
- `idea_statement` (Computed column combining stage1 fields)

## Benefits of the New Structure

1. **Clear Stage Identification**: Each column now clearly indicates which stage it belongs to
2. **Better Progress Tracking**: Easier to identify which stages have been completed
3. **Simplified Debugging**: Developers can quickly locate stage-specific data
4. **Enhanced Analytics**: Better reporting and analysis capabilities per stage
5. **Maintainability**: Easier code maintenance and feature development

## Usage Examples

```sql
-- Get all Stage 2 (Problem) responses
SELECT email, stage2_problem FROM level2_screen3_progress WHERE stage2_problem != '';

-- Check progress on specific stages
SELECT email, current_stage, 
       CASE WHEN stage1_idea_what != '' THEN 'Complete' ELSE 'Incomplete' END as stage1_status,
       CASE WHEN stage2_problem != '' THEN 'Complete' ELSE 'Incomplete' END as stage2_status,
       CASE WHEN stage3_technology != '' THEN 'Complete' ELSE 'Incomplete' END as stage3_status
FROM level2_screen3_progress;

-- Get final statement components
SELECT email, 
       stage8_final_problem,
       stage8_final_technology, 
       stage8_final_collaboration,
       stage8_final_creativity,
       stage8_final_speed_scale,
       stage8_final_impact
FROM level2_screen3_progress WHERE current_stage >= 8;
```

## Migration Details

The migration was applied on: 2025-08-23
- Migration name: `add_stage_numbers_to_level2_screen3_progress`
- All existing data was preserved
- Computed column `idea_statement` was updated to use new column names
- No downtime or data loss occurred

## Code Updates Required

Frontend code needs to be updated to use the new column names when:
1. Saving form data to Supabase
2. Loading user progress
3. Displaying saved responses
4. Tracking stage completion

Example code changes:
```typescript
// Old
formData.problem = userInput;

// New  
formData.stage2_problem = userInput;
```
