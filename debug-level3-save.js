/**
 * Level 3 Save Debug Script
 * 
 * Copy and paste this into the browser console to debug Level 3 save issues.
 * Run this BEFORE completing Level 3 to monitor the save process.
 */

// Global debug state
window.level3Debug = {
  logs: [],
  originalConsole: {},
  isMonitoring: false
};

// Enhanced console logging
function setupConsoleMonitoring() {
  const debug = window.level3Debug;
  
  if (debug.isMonitoring) {
    console.log('🔍 Console monitoring already active');
    return;
  }

  // Store original console methods
  debug.originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn
  };

  // Override console methods to capture Level 3 related logs
  console.log = function(...args) {
    debug.originalConsole.log.apply(console, args);
    const message = args.join(' ');
    if (message.includes('Level3') || message.includes('saveGameCompletion') || message.includes('🎮') || message.includes('💾')) {
      debug.logs.push({
        type: 'log',
        timestamp: new Date().toISOString(),
        message: message,
        args: args
      });
    }
  };

  console.error = function(...args) {
    debug.originalConsole.error.apply(console, args);
    const message = args.join(' ');
    if (message.includes('Level3') || message.includes('saveGameCompletion') || message.includes('❌') || message.includes('💥')) {
      debug.logs.push({
        type: 'error',
        timestamp: new Date().toISOString(),
        message: message,
        args: args
      });
    }
  };

  console.warn = function(...args) {
    debug.originalConsole.warn.apply(console, args);
    const message = args.join(' ');
    if (message.includes('Level3') || message.includes('saveGameCompletion') || message.includes('⚠️')) {
      debug.logs.push({
        type: 'warn',
        timestamp: new Date().toISOString(),
        message: message,
        args: args
      });
    }
  };

  debug.isMonitoring = true;
  console.log('🔍 Level 3 console monitoring started');
}

// Restore original console
function restoreConsole() {
  const debug = window.level3Debug;
  if (!debug.isMonitoring) return;

  console.log = debug.originalConsole.log;
  console.error = debug.originalConsole.error;
  console.warn = debug.originalConsole.warn;
  
  debug.isMonitoring = false;
  console.log('🔍 Console monitoring stopped');
}

// Show captured logs
function showDebugLogs() {
  const debug = window.level3Debug;
  console.log('\n📋 Level 3 Debug Logs:');
  console.log('='.repeat(50));
  
  if (debug.logs.length === 0) {
    console.log('No Level 3 related logs captured');
    return;
  }

  debug.logs.forEach((log, index) => {
    const icon = log.type === 'error' ? '❌' : log.type === 'warn' ? '⚠️' : 'ℹ️';
    console.log(`${icon} [${log.timestamp}] ${log.message}`);
  });
  
  console.log('='.repeat(50));
  console.log(`Total logs: ${debug.logs.length}`);
}

// Clear debug logs
function clearDebugLogs() {
  window.level3Debug.logs = [];
  console.log('🧹 Debug logs cleared');
}

// Test current authentication
async function testCurrentAuth() {
  console.log('\n🔐 Testing Current Authentication...');
  
  try {
    const { supabase } = window;
    
    if (!supabase) {
      console.error('❌ Supabase not available');
      return false;
    }

    // Check session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('📋 Session Check:', {
      hasSession: !!sessionData.session,
      error: sessionError?.message || 'None',
      userId: sessionData.session?.user?.id || 'None'
    });

    // Check user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log('👤 User Check:', {
      hasUser: !!userData.user,
      email: userData.user?.email || 'None',
      id: userData.user?.id || 'None',
      error: userError?.message || 'None'
    });

    // Test database connection
    const { data: dbTest, error: dbError } = await supabase
      .from('level3_progress')
      .select('count', { count: 'exact', head: true });
    
    console.log('🗄️ Database Check:', {
      accessible: !dbError,
      error: dbError?.message || 'None'
    });

    return !sessionError && !userError && !dbError;

  } catch (error) {
    console.error('💥 Auth test failed:', error);
    return false;
  }
}

// Test Level3Service directly
async function testLevel3Service() {
  console.log('\n🧪 Testing Level3Service...');
  
  try {
    // Check if Level3Service is available
    if (typeof window.Level3Service === 'undefined') {
      console.error('❌ Level3Service not available globally');
      console.log('💡 This is normal if not on Level 3 page');
      return false;
    }

    const { supabase } = window;
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      console.error('❌ No user for testing');
      return false;
    }

    // Create test data similar to your completion
    const testData = {
      userId: userData.user.id,
      module: 'debug-test',
      level: 3,
      scenario_index: 2, // Last scenario
      finalScore: 79, // Your actual score
      finalTime: 51, // Your actual time
      placedPieces: {
        scenarioResults: [
          { score: 100, combo: 1, health: 25 },
          { score: 99, combo: 1, health: 45 },
          { score: 100, combo: 1, health: 70 }
        ],
        timestamp: new Date().toISOString()
      },
      isCompleted: true
    };

    console.log('📤 Testing save with data:', testData);
    
    const result = await window.Level3Service.saveGameCompletion(testData);
    
    console.log('📥 Save result:', result);
    
    if (result.error) {
      console.error('❌ Save test failed:', result.error);
      return false;
    } else {
      console.log('✅ Save test successful');
      return true;
    }

  } catch (error) {
    console.error('💥 Level3Service test failed:', error);
    return false;
  }
}

// Monitor network requests
function monitorNetworkRequests() {
  console.log('\n🌐 Setting up network monitoring...');
  
  // Monitor fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && (url.includes('supabase') || url.includes('level3'))) {
      console.log('🌐 Network Request:', {
        url: url,
        method: args[1]?.method || 'GET',
        timestamp: new Date().toISOString()
      });
    }
    return originalFetch.apply(this, args);
  };

  console.log('✅ Network monitoring active');
}

// Complete diagnostic
async function runCompleteDiagnostic() {
  console.log('\n🔬 Running Complete Level 3 Save Diagnostic...');
  console.log('='.repeat(60));
  
  const results = {
    auth: await testCurrentAuth(),
    service: await testLevel3Service()
  };
  
  console.log('\n📊 Diagnostic Results:');
  console.log('='.repeat(30));
  console.log(`Authentication: ${results.auth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Level3Service: ${results.service ? '✅ PASS' : '❌ FAIL'}`);
  
  if (!results.auth) {
    console.log('\n💡 Authentication Issues Detected:');
    console.log('1. Try refreshing the page');
    console.log('2. Log out and log back in');
    console.log('3. Clear browser storage');
  }
  
  if (!results.service) {
    console.log('\n💡 Service Issues Detected:');
    console.log('1. Check if you\'re on the Level 3 page');
    console.log('2. Check browser console for errors');
    console.log('3. Verify Supabase configuration');
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Start monitoring: startLevel3Monitoring()');
  console.log('2. Complete Level 3 game');
  console.log('3. Check logs: showDebugLogs()');
  
  return results;
}

// Start comprehensive monitoring
function startLevel3Monitoring() {
  console.log('\n🚀 Starting Level 3 Save Monitoring...');
  setupConsoleMonitoring();
  monitorNetworkRequests();
  console.log('✅ Monitoring active - now complete Level 3 and check logs');
}

// Stop monitoring
function stopLevel3Monitoring() {
  restoreConsole();
  console.log('🛑 Level 3 monitoring stopped');
}

// Make functions globally available
window.startLevel3Monitoring = startLevel3Monitoring;
window.stopLevel3Monitoring = stopLevel3Monitoring;
window.showDebugLogs = showDebugLogs;
window.clearDebugLogs = clearDebugLogs;
window.testCurrentAuth = testCurrentAuth;
window.testLevel3Service = testLevel3Service;
window.runCompleteDiagnostic = runCompleteDiagnostic;

console.log(`
🔬 Level 3 Save Debug Tools Available:

🚀 MAIN FUNCTIONS:
- startLevel3Monitoring() - Start monitoring (run this first!)
- runCompleteDiagnostic() - Complete diagnostic test
- showDebugLogs() - Show captured logs after completing Level 3

🔧 UTILITY FUNCTIONS:
- testCurrentAuth() - Test authentication
- testLevel3Service() - Test save service
- clearDebugLogs() - Clear captured logs
- stopLevel3Monitoring() - Stop monitoring

📋 USAGE:
1. Run: startLevel3Monitoring()
2. Complete Level 3 game
3. Run: showDebugLogs()
4. If issues, run: runCompleteDiagnostic()

🎯 QUICK START:
runCompleteDiagnostic()
`);

// Auto-run diagnostic
runCompleteDiagnostic();
