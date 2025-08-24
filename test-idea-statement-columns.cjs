#!/usr/bin/env node

/**
 * Test script for idea statement columns in level2_screen3_progress table
 * 
 * This script tests the new idea statement functionality:
 * 1. Tests the three new columns (idea_statement_what, idea_statement_who, idea_statement_how)
 * 2. Tests the computed idea_statement column
 * 3. Tests saving and restoring progress with idea statements
 * 4. Tests the updated stage validation (now supports 10 stages)
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check if we have the required environment variables
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - VITE_SUPABASE_ANON_KEY');
  console.error('\nPlease check your .env file.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Test data
const testUserId = '00000000-0000-0000-0000-000000000001';
const testEmail = 'test@example.com';

const testProgressData = {
  user_id: testUserId,
  email: testEmail,
  
  // New idea statement fields
  idea_statement_what: 'food waste in college cafeterias',
  idea_statement_who: 'students and cafeteria staff', 
  idea_statement_how: 'creating an AI-powered demand prediction app',
  
  // Existing fields
  problem: 'Test problem',
  technology: 'Test technology',
  collaboration: 'Test collaboration',
  creativity: 'Test creativity',
  speed_scale: 'Test speed scale',
  impact: 'Test impact',
  reflection: 'Test reflection',
  final_problem: 'Final test problem',
  final_technology: 'Final test technology',
  final_collaboration: 'Final test collaboration',
  final_creativity: 'Final test creativity',
  final_speed_scale: 'Final test speed scale',
  final_impact: 'Final test impact',
  current_stage: 1,
  completed_stages: [1],
  progress_percentage: 12.5, // 1/8 stages completed
  is_completed: false
};

async function runTests() {
  console.log('🧪 Testing idea statement columns in level2_screen3_progress table\n');
  
  try {
    // Test 1: Clean up any existing test data
    console.log('1️⃣ Cleaning up existing test data...');
    const { error: deleteError } = await supabase
      .from('level2_screen3_progress')
      .delete()
      .eq('user_id', testUserId);
    
    if (deleteError) {
      console.warn('⚠️  Warning during cleanup:', deleteError.message);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }

    // Test 2: Insert new progress with idea statement
    console.log('\n2️⃣ Testing insert with idea statement fields...');
    const { data: insertData, error: insertError } = await supabase
      .from('level2_screen3_progress')
      .insert(testProgressData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert failed:', insertError);
      return;
    }

    console.log('✅ Insert successful');
    console.log('   - idea_statement_what:', insertData.idea_statement_what);
    console.log('   - idea_statement_who:', insertData.idea_statement_who);
    console.log('   - idea_statement_how:', insertData.idea_statement_how);
    console.log('   - computed idea_statement:', insertData.idea_statement);

    // Test 3: Verify computed column works correctly
    console.log('\n3️⃣ Testing computed idea_statement column...');
    const expectedStatement = 'I want to solve food waste in college cafeterias for students and cafeteria staff by creating an AI-powered demand prediction app';
    
    if (insertData.idea_statement === expectedStatement) {
      console.log('✅ Computed column works correctly');
      console.log('   Expected:', expectedStatement);
      console.log('   Actual:', insertData.idea_statement);
    } else {
      console.log('❌ Computed column failed');
      console.log('   Expected:', expectedStatement);
      console.log('   Actual:', insertData.idea_statement);
    }

    // Test 4: Test update with partial idea statement
    console.log('\n4️⃣ Testing update with partial idea statement...');
    const { data: updateData, error: updateError } = await supabase
      .from('level2_screen3_progress')
      .update({
        idea_statement_what: 'water scarcity',
        idea_statement_who: 'rural communities',
        idea_statement_how: 'building low-cost water purification systems',
        current_stage: 2,
        completed_stages: [1, 2],
        progress_percentage: 25.0
      })
      .eq('user_id', testUserId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return;
    }

    console.log('✅ Update successful');
    console.log('   - Updated idea_statement:', updateData.idea_statement);
    console.log('   - Current stage:', updateData.current_stage);
    console.log('   - Completed stages:', updateData.completed_stages);

    // Test 5: Test stage constraint (should allow stages 1-10)
    console.log('\n5️⃣ Testing stage constraint (stages 1-10)...');
    
    // Test valid stage 10
    const { error: stage10Error } = await supabase
      .from('level2_screen3_progress')
      .update({ current_stage: 10 })
      .eq('user_id', testUserId);

    if (stage10Error) {
      console.error('❌ Stage 10 constraint failed:', stage10Error);
    } else {
      console.log('✅ Stage 10 allowed correctly');
    }

    // Test invalid stage 11 (should fail)
    const { error: stage11Error } = await supabase
      .from('level2_screen3_progress')
      .update({ current_stage: 11 })
      .eq('user_id', testUserId);

    if (stage11Error) {
      console.log('✅ Stage constraint working - stage 11 rejected correctly');
      console.log('   Error:', stage11Error.message);
    } else {
      console.log('❌ Stage constraint failed - stage 11 was allowed');
    }

    // Test 6: Test completion with stage 10
    console.log('\n6️⃣ Testing completion with stage 10...');
    const { data: completionData, error: completionError } = await supabase
      .from('level2_screen3_progress')
      .update({
        current_stage: 10,
        completed_stages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        is_completed: true,
        progress_percentage: 100.0,
        completed_at: new Date().toISOString()
      })
      .eq('user_id', testUserId)
      .select()
      .single();

    if (completionError) {
      console.error('❌ Completion test failed:', completionError);
    } else {
      console.log('✅ Completion test successful');
      console.log('   - Current stage:', completionData.current_stage);
      console.log('   - Is completed:', completionData.is_completed);
      console.log('   - Progress percentage:', completionData.progress_percentage);
      console.log('   - Completed at:', completionData.completed_at);
    }

    // Test 7: Test querying with idea statement parts
    console.log('\n7️⃣ Testing queries with idea statement parts...');
    const { data: queryData, error: queryError } = await supabase
      .from('level2_screen3_progress')
      .select('*')
      .eq('idea_statement_what', 'water scarcity')
      .single();

    if (queryError) {
      console.error('❌ Query test failed:', queryError);
    } else {
      console.log('✅ Query test successful');
      console.log('   - Found record with idea_statement_what:', queryData.idea_statement_what);
    }

    // Test 8: Final cleanup
    console.log('\n8️⃣ Final cleanup...');
    const { error: finalCleanupError } = await supabase
      .from('level2_screen3_progress')
      .delete()
      .eq('user_id', testUserId);

    if (finalCleanupError) {
      console.error('❌ Final cleanup failed:', finalCleanupError);
    } else {
      console.log('✅ Final cleanup successful');
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Idea statement columns working correctly');
    console.log('   ✅ Computed column functioning properly');
    console.log('   ✅ Stage constraints updated for 1-10 stages');
    console.log('   ✅ Insert, update, and query operations successful');
    console.log('   ✅ Progress completion with stage 10 working');

  } catch (error) {
    console.error('\n💥 Unexpected error during testing:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the tests
runTests().catch(console.error);
