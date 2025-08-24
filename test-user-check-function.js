// Test script for the check_user_exists_by_email RPC function
// Run this in the browser console on your application page

console.log('🧪 Testing check_user_exists_by_email RPC function');

async function testUserCheckFunction() {
  try {
    // Check if supabase is available
    if (typeof supabase === 'undefined') {
      console.error('❌ Supabase not available. Make sure you are on the application page.');
      return;
    }

    console.log('✅ Supabase client available');

    // Test 1: Check if function exists by calling it with a test email
    console.log('\n🔍 Test 1: Function existence check...');
    
    const { data: testResult, error: testError } = await supabase
      .rpc('check_user_exists_by_email', { p_email: 'test@example.com' });

    if (testError) {
      if (testError.message.includes('function check_user_exists_by_email does not exist')) {
        console.error('❌ Function not found. Please create the RPC function first.');
        console.log('📋 Run this SQL in Supabase SQL Editor:');
        console.log(`
CREATE OR REPLACE FUNCTION check_user_exists_by_email(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_exists BOOLEAN := FALSE;
BEGIN
    SELECT EXISTS(
        SELECT 1 
        FROM auth.users 
        WHERE email = p_email
    ) INTO user_exists;
    
    RETURN user_exists;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION check_user_exists_by_email(TEXT) TO authenticated;
        `);
        return;
      } else {
        console.error('❌ Function call failed:', testError.message);
        return;
      }
    }

    console.log('✅ Function exists and is callable');
    console.log('📋 Test result:', testResult);

    // Test 2: Test with different email formats
    console.log('\n🔍 Test 2: Testing different email formats...');
    
    const testEmails = [
      'nonexistent@example.com',
      'invalid-email',
      '',
      'test@test.com'
    ];

    for (const email of testEmails) {
      try {
        const { data: result, error } = await supabase
          .rpc('check_user_exists_by_email', { p_email: email });
        
        console.log(`📧 "${email}": ${error ? 'ERROR - ' + error.message : (result ? 'EXISTS' : 'NOT FOUND')}`);
      } catch (err) {
        console.log(`📧 "${email}": ERROR - ${err.message}`);
      }
    }

    // Test 3: Test the actual password reset flow
    console.log('\n🔍 Test 3: Testing password reset integration...');
    console.log('Go to the forgot password form and test with:');
    console.log('- An email you know exists in your system');
    console.log('- An email you know does NOT exist');
    console.log('- Check that you get appropriate error messages');

    console.log('\n✅ Function testing completed!');
    console.log('📋 Next steps:');
    console.log('1. Test the forgot password form with existing/non-existing emails');
    console.log('2. Verify error messages are user-friendly');
    console.log('3. Check that emails are only sent for existing users');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test password reset with actual AuthContext
async function testPasswordResetFlow(email) {
  console.log(`\n🔍 Testing password reset flow for: ${email}`);
  
  try {
    // This simulates what the AuthContext does
    const { data: userExists, error: checkError } = await supabase
      .rpc('check_user_exists_by_email', { p_email: email });

    if (checkError) {
      console.log('❌ Error checking user:', checkError.message);
      return;
    }

    if (!userExists) {
      console.log('❌ User not found - would show error message');
      return;
    }

    console.log('✅ User exists - would proceed with password reset');
    
    // Note: We don't actually send the reset email in this test
    console.log('📧 Would send reset email to:', email);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Make functions available globally
window.testUserCheckFunction = testUserCheckFunction;
window.testPasswordResetFlow = testPasswordResetFlow;

// Auto-run the test
console.log('🎯 Available functions:');
console.log('- testUserCheckFunction() - Test the RPC function');
console.log('- testPasswordResetFlow(email) - Test password reset logic');
console.log('\n🚀 Running automatic test...');

testUserCheckFunction();
