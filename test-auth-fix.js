/**
 * Authentication Fix and Test Script
 * 
 * Copy and paste this into the browser console to diagnose and fix auth issues.
 */

async function fixAndTestAuthentication() {
  console.log('🔧 Starting Authentication Fix and Test...');
  
  try {
    const { supabase } = window;
    
    if (!supabase) {
      console.error('❌ Supabase not available. Make sure you\'re on the application page.');
      return false;
    }

    // Step 1: Check current session
    console.log('\n1️⃣ Checking current session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
    } else if (!sessionData.session) {
      console.warn('⚠️ No active session found');
    } else {
      console.log('✅ Session found:', {
        expires_at: new Date(sessionData.session.expires_at * 1000).toLocaleString(),
        user_id: sessionData.session.user?.id
      });
    }

    // Step 2: Check user
    console.log('\n2️⃣ Checking user...');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ User error:', userError);
      
      // Try to refresh session
      console.log('\n🔄 Attempting session refresh...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('❌ Session refresh failed:', refreshError);
        console.log('💡 Solution: Please log out and log back in');
        return false;
      } else {
        console.log('✅ Session refreshed successfully');
        
        // Check user again after refresh
        const { data: newUserData, error: newUserError } = await supabase.auth.getUser();
        if (newUserError) {
          console.error('❌ User check still failing after refresh:', newUserError);
          return false;
        } else {
          console.log('✅ User authenticated after refresh:', newUserData.user.email);
        }
      }
    } else {
      console.log('✅ User authenticated:', userData.user.email);
    }

    // Step 3: Test database access
    console.log('\n3️⃣ Testing database access...');
    const { data: tableData, error: tableError } = await supabase
      .from('level3_progress')
      .select('count', { count: 'exact', head: true });
    
    if (tableError) {
      console.error('❌ Database access failed:', tableError);
      return false;
    } else {
      console.log('✅ Database accessible');
    }

    // Step 4: Test Level3Service if available
    console.log('\n4️⃣ Testing Level3Service...');
    const { Level3Service } = window;
    
    if (Level3Service) {
      const testData = {
        userId: userData.user?.id || 'test-user',
        module: 'auth-test',
        level: 3,
        scenario_index: 0,
        finalScore: 100,
        finalTime: 60,
        placedPieces: { test: true, timestamp: new Date().toISOString() },
        isCompleted: true
      };

      console.log('📤 Testing save with data:', testData);
      
      const result = await Level3Service.saveGameCompletion(testData);
      
      if (result.error) {
        console.error('❌ Save test failed:', result.error);
        return false;
      } else {
        console.log('✅ Save test successful:', result);
      }
    } else {
      console.log('⚠️ Level3Service not available (normal if not on Level 3 page)');
    }

    console.log('\n🎉 Authentication Fix and Test Completed Successfully!');
    return true;

  } catch (error) {
    console.error('💥 Test failed with error:', error);
    return false;
  }
}

// Quick session refresh function
async function quickSessionRefresh() {
  console.log('🔄 Quick Session Refresh...');
  
  try {
    const { supabase } = window;
    
    if (!supabase) {
      console.error('❌ Supabase not available');
      return false;
    }

    const { error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('❌ Refresh failed:', error);
      return false;
    } else {
      console.log('✅ Session refreshed successfully');
      
      // Verify refresh worked
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('❌ User check failed after refresh:', userError);
        return false;
      } else {
        console.log('✅ User verified after refresh:', userData.user.email);
        return true;
      }
    }
  } catch (error) {
    console.error('💥 Refresh failed:', error);
    return false;
  }
}

// Check authentication status
async function checkAuthStatus() {
  console.log('🔍 Checking Authentication Status...');
  
  try {
    const { supabase } = window;
    
    if (!supabase) {
      console.error('❌ Supabase not available');
      return;
    }

    // Check session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('📋 Session Status:', {
      hasSession: !!sessionData.session,
      error: sessionError?.message || 'None',
      expiresAt: sessionData.session?.expires_at ? 
        new Date(sessionData.session.expires_at * 1000).toLocaleString() : 'N/A'
    });

    // Check user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log('👤 User Status:', {
      hasUser: !!userData.user,
      email: userData.user?.email || 'None',
      id: userData.user?.id || 'None',
      error: userError?.message || 'None'
    });

    // Check if session is about to expire (within 5 minutes)
    if (sessionData.session) {
      const expiresAt = sessionData.session.expires_at * 1000;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));
      
      console.log('⏰ Session Expiry:', {
        minutesRemaining: minutesUntilExpiry,
        needsRefresh: minutesUntilExpiry < 5
      });
      
      if (minutesUntilExpiry < 5) {
        console.log('⚠️ Session expires soon, consider refreshing');
      }
    }

  } catch (error) {
    console.error('💥 Status check failed:', error);
  }
}

// Make functions available globally
window.fixAndTestAuthentication = fixAndTestAuthentication;
window.quickSessionRefresh = quickSessionRefresh;
window.checkAuthStatus = checkAuthStatus;

console.log(`
🔧 Authentication Fix Functions Available:

1. fixAndTestAuthentication() - Complete diagnosis and fix
2. quickSessionRefresh() - Quick session refresh
3. checkAuthStatus() - Check current auth status

Example usage:
- fixAndTestAuthentication()
- quickSessionRefresh()
- checkAuthStatus()

💡 If you're getting "Auth session missing!" errors, try:
1. quickSessionRefresh()
2. If that fails, refresh the page and log in again
`);

// Auto-run status check
checkAuthStatus();
