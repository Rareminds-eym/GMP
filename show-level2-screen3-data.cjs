#!/usr/bin/env node

/**
 * Script to display data from level2_screen3_progress table
 * 
 * This script will:
 * 1. Show all records in the table
 * 2. Display the table schema/structure
 * 3. Show any existing idea statement data
 * 4. Count records by stage and completion status
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

async function showTableData() {
  console.log('📊 Level2Screen3 Progress Table Data\n');
  console.log('=' .repeat(80));
  
  try {
    // Get all records from the table
    console.log('\n📋 Fetching all records...\n');
    
    const { data: allData, error: fetchError } = await supabase
      .from('level2_screen3_progress')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching data:', fetchError);
      return;
    }

    if (!allData || allData.length === 0) {
      console.log('📭 No records found in level2_screen3_progress table');
      return;
    }

    console.log(`📊 Found ${allData.length} record(s)\n`);
    
    // Display each record
    allData.forEach((record, index) => {
      console.log(`🔍 Record ${index + 1}:`);
      console.log('─'.repeat(50));
      
      // Basic info
      console.log(`   ID: ${record.id}`);
      console.log(`   Email: ${record.email}`);
      console.log(`   Current Stage: ${record.current_stage}`);
      console.log(`   Completed Stages: [${record.completed_stages.join(', ')}]`);
      console.log(`   Progress: ${record.progress_percentage}%`);
      console.log(`   Is Completed: ${record.is_completed}`);
      
      // Idea statement fields (new columns)
      if (record.idea_statement_what || record.idea_statement_who || record.idea_statement_how) {
        console.log('\n   💡 Idea Statement:');
        console.log(`      What: "${record.idea_statement_what || '(empty)'}"`);
        console.log(`      Who:  "${record.idea_statement_who || '(empty)'}"`);
        console.log(`      How:  "${record.idea_statement_how || '(empty)'}"`);
        if (record.idea_statement) {
          console.log(`      Combined: "${record.idea_statement}"`);
        }
      }
      
      // Form data fields
      console.log('\n   📝 Form Data:');
      console.log(`      Problem: "${record.problem || '(empty)'}"`);
      console.log(`      Technology: "${record.technology || '(empty)'}"`);
      console.log(`      Collaboration: "${record.collaboration || '(empty)'}"`);
      console.log(`      Creativity: "${record.creativity || '(empty)'}"`);
      console.log(`      Speed & Scale: "${record.speed_scale || '(empty)'}"`);
      console.log(`      Impact: "${record.impact || '(empty)'}"`);
      console.log(`      Reflection: "${record.reflection || '(empty)'}"`);
      
      // Final statement fields
      const hasFinalData = record.final_problem || record.final_technology || 
                          record.final_collaboration || record.final_creativity || 
                          record.final_speed_scale || record.final_impact;
      
      if (hasFinalData) {
        console.log('\n   📄 Final Statement:');
        console.log(`      Problem: "${record.final_problem || '(empty)'}"`);
        console.log(`      Technology: "${record.final_technology || '(empty)'}"`);
        console.log(`      Collaboration: "${record.final_collaboration || '(empty)'}"`);
        console.log(`      Creativity: "${record.final_creativity || '(empty)'}"`);
        console.log(`      Speed & Scale: "${record.final_speed_scale || '(empty)'}"`);
        console.log(`      Impact: "${record.final_impact || '(empty)'}"`);
      }
      
      // File info
      if (record.uploaded_file_name) {
        console.log('\n   📁 File Upload:');
        console.log(`      File Name: ${record.uploaded_file_name}`);
        console.log(`      Has Data: ${record.uploaded_file_data ? 'Yes' : 'No'}`);
      }
      
      // Timestamps
      console.log('\n   🕐 Timestamps:');
      console.log(`      Created: ${new Date(record.created_at).toLocaleString()}`);
      console.log(`      Updated: ${new Date(record.updated_at).toLocaleString()}`);
      if (record.completed_at) {
        console.log(`      Completed: ${new Date(record.completed_at).toLocaleString()}`);
      }
      
      console.log('\n');
    });

    // Summary statistics
    console.log('📈 Summary Statistics:');
    console.log('─'.repeat(30));
    
    const stageCount = {};
    const completionStats = { completed: 0, inProgress: 0 };
    const ideaStatementStats = { withIdea: 0, withoutIdea: 0 };
    
    allData.forEach(record => {
      // Count by stage
      const stage = record.current_stage;
      stageCount[stage] = (stageCount[stage] || 0) + 1;
      
      // Count completion status
      if (record.is_completed) {
        completionStats.completed++;
      } else {
        completionStats.inProgress++;
      }
      
      // Count idea statements
      if (record.idea_statement_what || record.idea_statement_who || record.idea_statement_how) {
        ideaStatementStats.withIdea++;
      } else {
        ideaStatementStats.withoutIdea++;
      }
    });
    
    console.log(`   Total Records: ${allData.length}`);
    console.log(`   Completed: ${completionStats.completed}`);
    console.log(`   In Progress: ${completionStats.inProgress}`);
    console.log(`   With Idea Statement: ${ideaStatementStats.withIdea}`);
    console.log(`   Without Idea Statement: ${ideaStatementStats.withoutIdea}`);
    
    console.log('\n   Records by Current Stage:');
    Object.keys(stageCount).sort((a, b) => parseInt(a) - parseInt(b)).forEach(stage => {
      console.log(`      Stage ${stage}: ${stageCount[stage]} record(s)`);
    });

    // Check for new columns existence
    console.log('\n🔍 Column Check:');
    console.log('─'.repeat(20));
    
    const firstRecord = allData[0];
    const hasIdeaWhat = firstRecord.hasOwnProperty('idea_statement_what');
    const hasIdeaWho = firstRecord.hasOwnProperty('idea_statement_who');
    const hasIdeaHow = firstRecord.hasOwnProperty('idea_statement_how');
    const hasIdeaComputed = firstRecord.hasOwnProperty('idea_statement');
    
    console.log(`   idea_statement_what column: ${hasIdeaWhat ? '✅ Present' : '❌ Missing'}`);
    console.log(`   idea_statement_who column: ${hasIdeaWho ? '✅ Present' : '❌ Missing'}`);
    console.log(`   idea_statement_how column: ${hasIdeaHow ? '✅ Present' : '❌ Missing'}`);
    console.log(`   idea_statement column: ${hasIdeaComputed ? '✅ Present' : '❌ Missing'}`);
    
    if (!hasIdeaWhat || !hasIdeaWho || !hasIdeaHow) {
      console.log('\n⚠️  New idea statement columns are missing!');
      console.log('   Please run the migration: add_idea_statement_columns.sql');
    }

  } catch (error) {
    console.error('\n💥 Unexpected error:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the function
showTableData().catch(console.error);
