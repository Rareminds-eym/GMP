/**
 * Test Script for Signup Metadata Storage
 * 
 * This script tests that join_code and session_id are properly stored
 * in the auth.users.raw_user_meta_data column during signup.
 * 
 * Run this in the browser console after signup to verify the implementation.
 */

console.log('🧪 Testing Signup Metadata Storage...');

async function testSignupMetadata() {
  try {
    // Check if supabase is available
    if (typeof supabase === 'undefined') {
      console.error('❌ Supabase not available. Make sure you are on the application page.');
      return false;
    }

    console.log('✅ Supabase client available');

    // Test 1: Check current user's metadata
    console.log('\n1️⃣ Checking current user metadata...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ User error:', userError);
      return false;
    }

    if (!user) {
      console.warn('⚠️ No authenticated user found. Please sign up or sign in first.');
      return false;
    }

    console.log('✅ User found:', user.email);
    console.log('📋 User metadata:', user.user_metadata);

    // Test 2: Check for join_code and session_id in metadata
    console.log('\n2️⃣ Checking for required fields...');
    
    const metadata = user.user_metadata || {};
    const hasJoinCode = 'join_code' in metadata;
    const hasSessionId = 'session_id' in metadata;
    
    console.log(`📧 Join Code: ${hasJoinCode ? '✅ Present' : '❌ Missing'} - ${metadata.join_code || 'N/A'}`);
    console.log(`🔗 Session ID: ${hasSessionId ? '✅ Present' : '❌ Missing'} - ${metadata.session_id || 'N/A'}`);

    // Test 3: Verify against teams table
    console.log('\n3️⃣ Cross-checking with teams table...');
    
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('join_code, session_id, is_team_leader')
      .eq('email', user.email)
      .limit(1)
      .single();

    if (teamError) {
      console.error('❌ Team data error:', teamError);
      return false;
    }

    if (!teamData) {
      console.warn('⚠️ No team data found for this user');
      return false;
    }

    console.log('✅ Team data found');
    console.log(`📧 Teams table join_code: ${teamData.join_code}`);
    console.log(`🔗 Teams table session_id: ${teamData.session_id}`);
    console.log(`👤 Is team leader: ${teamData.is_team_leader}`);

    // Test 4: Compare metadata with teams table
    console.log('\n4️⃣ Comparing metadata with teams table...');
    
    const metadataJoinCode = metadata.join_code;
    const metadataSessionId = metadata.session_id;
    
    const joinCodeMatch = metadataJoinCode === teamData.join_code;
    const sessionIdMatch = metadataSessionId === teamData.session_id;
    
    console.log(`📧 Join code match: ${joinCodeMatch ? '✅ Match' : '❌ Mismatch'}`);
    console.log(`🔗 Session ID match: ${sessionIdMatch ? '✅ Match' : '❌ Mismatch'}`);

    // Test 5: Overall result
    console.log('\n5️⃣ Overall Test Result:');
    
    const allTestsPassed = hasJoinCode && hasSessionId && joinCodeMatch && sessionIdMatch;
    
    if (allTestsPassed) {
      console.log('🎉 ✅ ALL TESTS PASSED!');
      console.log('✅ Join code and session ID are properly stored in user metadata');
    } else {
      console.log('❌ TESTS FAILED:');
      if (!hasJoinCode) console.log('  - Join code missing from metadata');
      if (!hasSessionId) console.log('  - Session ID missing from metadata');
      if (!joinCodeMatch) console.log('  - Join code mismatch between metadata and teams table');
      if (!sessionIdMatch) console.log('  - Session ID mismatch between metadata and teams table');
    }

    return allTestsPassed;

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Test function to check auth users table directly (requires authenticated user)
async function testAuthUsersTable() {
  console.log('\n🔍 Testing auth.users table access...');
  
  try {
    // Note: This might not work due to RLS policies on auth.users
    const { data: userData, error } = await supabase
      .from('auth.users')
      .select('email, raw_user_meta_data')
      .limit(1);

    if (error) {
      console.log('⚠️ Cannot access auth.users table directly (this is normal due to security)');
      console.log('💡 Use the user metadata from getUser() instead');
      return false;
    } else {
      console.log('✅ Auth users data:', userData);
      return true;
    }
  } catch (error) {
    console.log('⚠️ Auth users table access failed (this is normal):', error.message);
    return false;
  }
}

// Function to simulate signup flow for testing
async function simulateSignupFlow(isTeamLeader = true) {
  console.log(`\n🎮 Simulating ${isTeamLeader ? 'Team Leader' : 'Team Member'} Signup Flow...`);
  
  const testData = {
    email: `test-${Date.now()}@example.com`,
    password: 'testpass123',
    fullName: 'Test User',
    phone: '9876543210',
    teamName: 'Test Team',
    collegeCode: 'TEST001',
    joinCode: isTeamLeader ? null : 'ABC123',
    sessionId: isTeamLeader ? 'test-session-' + Date.now() : 'existing-session-123'
  };

  console.log('📋 Test data:', testData);
  console.log('💡 Note: This is a simulation - no actual signup will be performed');
  console.log('💡 To test the actual implementation:');
  console.log('  1. Go to /auth page');
  console.log('  2. Fill out the signup form');
  console.log('  3. Complete the signup process');
  console.log('  4. Run testSignupMetadata() to verify the results');

  return testData;
}

// Make functions available globally
window.testSignupMetadata = testSignupMetadata;
window.testAuthUsersTable = testAuthUsersTable;
window.simulateSignupFlow = simulateSignupFlow;

console.log(`
🔧 Signup Metadata Test Functions Available:

1. testSignupMetadata() - Test current user's metadata
2. testAuthUsersTable() - Try to access auth.users table
3. simulateSignupFlow(isTeamLeader) - Simulate signup flow

Example usage:
- testSignupMetadata()
- simulateSignupFlow(true)  // Team leader
- simulateSignupFlow(false) // Team member

💡 To test the full implementation:
1. Go to /auth page and sign up as team leader
2. Note the generated join code
3. Run testSignupMetadata() to verify metadata
4. Sign up another user as team member with the join code
5. Run testSignupMetadata() again for the team member

Expected metadata structure:
{
  "full_name": "User Name",
  "phone": "1234567890",
  "team_name": "Team Name",
  "college_code": "COLLEGE123",
  "join_code": "ABC123",
  "session_id": "uuid-string",
  "team_lead": "",
  "team_members": []
}
`);

// Auto-run a basic check if user is authenticated
(async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('\n🚀 User is authenticated. Running automatic test...');
      await testSignupMetadata();
    } else {
      console.log('\n⚠️ No authenticated user. Please sign up or sign in to test.');
    }
  } catch (error) {
    console.log('\n⚠️ Could not check authentication status:', error.message);
  }
})();
