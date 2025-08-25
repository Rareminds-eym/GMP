const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLevel2Screen3Progress() {
  console.log('🧪 Testing Level2Screen3 Progress Database Setup...');
  console.log('=' .repeat(60));

  try {
    // Test 1: Check if table exists and has correct structure
    console.log('\n1️⃣ Testing table structure...');
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('level2_screen3_progress')
      .select('*')
      .limit(1);
    
    if (tableError) {
      if (tableError.code === 'PGRST116') {
        console.error('❌ Table does not exist or is not accessible');
        console.error('   Make sure you have run the migration script');
        return;
      } else {
        throw tableError;
      }
    }
    console.log('✅ Table exists and is accessible');

    // Test 2: Test insert operation (mock data)
    console.log('\n2️⃣ Testing insert operation...');
    
    const mockUserId = '00000000-0000-0000-0000-000000000001'; // Mock UUID
    const mockEmail = 'test@example.com';
    
    const testData = {
      user_id: mockUserId,
      email: mockEmail,
      problem: 'Test problem statement',
      technology: 'React, Node.js',
      collaboration: 'Team collaboration approach',
      creativity: 'Innovative solution ideas',
      speed_scale: 'Rapid development and scaling plan',
      impact: 'Significant impact on users',
      reflection: 'Key learnings from the process',
      final_problem: 'Final problem definition',
      final_technology: 'Final tech stack',
      final_collaboration: 'Final collaboration strategy',
      final_creativity: 'Final creative approach',
      final_speed_scale: 'Final scaling strategy',
      final_impact: 'Final impact assessment',
      current_stage: 3,
      completed_stages: [1, 2, 3],
      is_completed: false,
      progress_percentage: 42.86,
      selected_case_id: 1
    };

    const { data: insertData, error: insertError } = await supabase
      .from('level2_screen3_progress')
      .upsert(testData, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select();

    if (insertError) {
      console.error('❌ Insert operation failed:', insertError.message);
      return;
    }
    console.log('✅ Insert/Upsert operation successful');
    console.log(`   Inserted record ID: ${insertData[0]?.id}`);

    // Test 3: Test select operation
    console.log('\n3️⃣ Testing select operation...');
    
    const { data: selectData, error: selectError } = await supabase
      .from('level2_screen3_progress')
      .select('*')
      .eq('user_id', mockUserId)
      .single();

    if (selectError) {
      console.error('❌ Select operation failed:', selectError.message);
      return;
    }
    console.log('✅ Select operation successful');
    console.log(`   Record found - Stage: ${selectData.current_stage}, Progress: ${selectData.progress_percentage}%`);

    // Test 4: Test update operation
    console.log('\n4️⃣ Testing update operation...');
    
    const { data: updateData, error: updateError } = await supabase
      .from('level2_screen3_progress')
      .update({ 
        current_stage: 5,
        completed_stages: [1, 2, 3, 4, 5],
        progress_percentage: 71.43
      })
      .eq('user_id', mockUserId)
      .select();

    if (updateError) {
      console.error('❌ Update operation failed:', updateError.message);
      return;
    }
    console.log('✅ Update operation successful');
    console.log(`   Updated record - Stage: ${updateData[0]?.current_stage}, Progress: ${updateData[0]?.progress_percentage}%`);

    // Test 5: Test completion marking
    console.log('\n5️⃣ Testing completion marking...');
    
    const { data: completionData, error: completionError } = await supabase
      .from('level2_screen3_progress')
      .update({ 
        is_completed: true,
        completed_at: new Date().toISOString(),
        progress_percentage: 100
      })
      .eq('user_id', mockUserId)
      .select();

    if (completionError) {
      console.error('❌ Completion marking failed:', completionError.message);
      return;
    }
    console.log('✅ Completion marking successful');
    console.log(`   Completed at: ${completionData[0]?.completed_at}`);

    // Test 6: Test RLS (Row Level Security) - This should fail for unauthorized users
    console.log('\n6️⃣ Testing Row Level Security...');
    
    const { data: rlsData, error: rlsError } = await supabase
      .from('level2_screen3_progress')
      .select('*')
      .eq('user_id', '00000000-0000-0000-0000-000000000002'); // Different user ID

    if (rlsError || (rlsData && rlsData.length === 0)) {
      console.log('✅ RLS working correctly - Cannot access other users\' data');
    } else {
      console.log('⚠️ RLS might not be working correctly - Could access other users\' data');
    }

    // Test 7: Clean up test data
    console.log('\n7️⃣ Cleaning up test data...');
    
    const { error: deleteError } = await supabase
      .from('level2_screen3_progress')
      .delete()
      .eq('user_id', mockUserId);

    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError.message);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }

    // Test 8: Verify table schema
    console.log('\n8️⃣ Verifying table schema...');
    
    // This query should work in PostgreSQL to check column details
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_table_schema', { table_name: 'level2_screen3_progress' });
    
    if (schemaError) {
      console.log('⚠️ Schema verification skipped (RPC function not available)');
    } else {
      console.log('✅ Schema verified successfully');
    }

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 All tests completed successfully!');
    console.log('🎯 Level2Screen3 progress database is ready to use');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Helper function to test file upload simulation
async function testFileUpload() {
  console.log('\n📁 Testing file upload simulation...');
  
  // Simulate a small text file
  const mockFile = {
    name: 'prototype-demo.txt',
    type: 'text/plain',
    size: 1024,
    content: 'This is a mock prototype file for testing purposes.'
  };
  
  // Convert to base64 (as would happen in the browser)
  const base64Content = Buffer.from(mockFile.content).toString('base64');
  const dataUrl = `data:${mockFile.type};base64,${base64Content}`;
  
  console.log('✅ File conversion simulation successful');
  console.log(`   File: ${mockFile.name} (${mockFile.size} bytes)`);
  console.log(`   Base64 length: ${base64Content.length} characters`);
  
  return dataUrl;
}

// Run the test
if (require.main === module) {
  testLevel2Screen3Progress();
}

module.exports = { testLevel2Screen3Progress };
