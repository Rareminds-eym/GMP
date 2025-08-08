// Debug script to help troubleshoot module completion console.log issue
// Run this in the browser console to test module completion logic

console.log('🔍 Module Completion Debug Script Started');

// Function to test the level completion flow
async function testLevelCompletion(userId, moduleId, levelId) {
  console.log('🧪 Testing level completion:', { userId, moduleId, levelId });
  
  try {
    // Import the handler function
    const { handleLevelCompletion } = await import('./src/utils/levelCompletionHandler.ts');
    
    console.log('📞 Calling handleLevelCompletion...');
    const result = await handleLevelCompletion(userId, moduleId, levelId);
    
    console.log('📊 Full result object:', result);
    console.log('✅ Success:', result.success);
    console.log('📝 Message:', result.message);
    console.log('📦 Data:', result.data);
    
    if (result.data) {
      console.log('🎯 Module completed:', result.data.moduleCompleted);
      console.log('🔓 Next module unlocked:', result.data.nextModuleUnlocked);
      console.log('🆔 Next module ID:', result.data.nextModuleId);
      
      // Check the specific condition
      const moduleCompleted = result.data.moduleCompleted;
      const nextModuleUnlocked = result.data.nextModuleUnlocked;
      
      console.log('🔍 Condition check:');
      console.log('  moduleCompleted:', moduleCompleted, typeof moduleCompleted);
      console.log('  nextModuleUnlocked:', nextModuleUnlocked, typeof nextModuleUnlocked);
      console.log('  Both true?:', moduleCompleted && nextModuleUnlocked);
      
      if (moduleCompleted && nextModuleUnlocked) {
        console.log('🎉 SHOULD SHOW: "Completed next module is opened"');
      } else {
        console.log('❌ Console.log will NOT show because condition is false');
      }
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error testing level completion:', error);
    return null;
  }
}

// Function to check current user and suggest test parameters
function suggestTestParameters() {
  console.log('💡 To test, you need:');
  console.log('1. Your user ID (from auth)');
  console.log('2. Module ID (1, 2, 3, or 4)');
  console.log('3. Level ID (the last level of the module)');
  console.log('');
  console.log('📋 Based on the database structure:');
  console.log('  Module 1: has 2 levels (test with levelId = 2)');
  console.log('  Module 2: has 2 levels (test with levelId = 2)');
  console.log('  Module 3: has 2 levels (test with levelId = 2)');
  console.log('  Module 4: has 2 levels (test with levelId = 2)');
  console.log('');
  console.log('🔧 Example usage:');
  console.log('  testLevelCompletion("your-user-id", 1, 2)');
  console.log('');
  
  // Try to get current user if available
  if (window.supabase && window.supabase.auth) {
    window.supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        console.log('👤 Current user ID:', user.id);
        console.log('🚀 Quick test command:');
        console.log(`testLevelCompletion("${user.id}", 1, 2)`);
      } else {
        console.log('❌ No authenticated user found');
      }
    });
  }
}

// Function to check database state
async function checkDatabaseState(userId, moduleId) {
  console.log('🗄️ Checking database state for:', { userId, moduleId });
  
  try {
    if (window.supabase) {
      // Check module_progress table
      const { data: moduleProgress, error: mpError } = await window.supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('module_id', moduleId);
      
      console.log('📊 Module progress:', moduleProgress, mpError);
      
      // Check levels table to see actual level count
      const { data: levels, error: levelsError } = await window.supabase
        .from('levels')
        .select('*')
        .eq('module_id', moduleId.toString());
      
      console.log('📚 Levels in module:', levels, levelsError);
      
      if (levels) {
        console.log(`📈 Module ${moduleId} has ${levels.length} levels`);
      }
    } else {
      console.log('❌ Supabase not available in window object');
    }
  } catch (error) {
    console.error('❌ Error checking database state:', error);
  }
}

// Make functions available globally
window.testLevelCompletion = testLevelCompletion;
window.suggestTestParameters = suggestTestParameters;
window.checkDatabaseState = checkDatabaseState;

// Auto-run suggestions
suggestTestParameters();

console.log('✅ Debug functions loaded. Available commands:');
console.log('  - testLevelCompletion(userId, moduleId, levelId)');
console.log('  - suggestTestParameters()');
console.log('  - checkDatabaseState(userId, moduleId)');
