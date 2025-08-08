// Test Module System - Check if modules are properly loading and displaying lock icons

async function testModuleSystem() {
  console.log('🧪 Testing Module System...');
  console.log('='.repeat(50));
  
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      console.log('❌ This script needs to run in browser environment');
      return;
    }

    const { supabase } = window;
    
    if (!supabase) {
      console.log('❌ Supabase not available');
      return;
    }

    // Check authentication
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.log('❌ Authentication failed:', userError?.message);
      return;
    }
    
    console.log('✅ User authenticated:', userData.user.email);
    const userId = userData.user.id;

    // 1. Test database functions exist
    console.log('\n1️⃣ Testing database functions...');
    
    try {
      const { data: initResult, error: initError } = await supabase.rpc('initialize_user_modules', {
        p_user_id: userId
      });
      
      if (initError) {
        console.log('❌ initialize_user_modules function error:', initError.message);
      } else {
        console.log('✅ initialize_user_modules function works');
        console.log('📊 Modules initialized:', initResult);
      }
    } catch (error) {
      console.log('❌ initialize_user_modules function missing or broken:', error.message);
    }

    // 2. Test get_all_module_progress
    console.log('\n2️⃣ Testing module progress retrieval...');
    
    try {
      const { data: progressResult, error: progressError } = await supabase.rpc('get_all_module_progress', {
        p_user_id: userId
      });
      
      if (progressError) {
        console.log('❌ get_all_module_progress function error:', progressError.message);
      } else {
        console.log('✅ get_all_module_progress function works');
        console.log('📊 Module progress:', progressResult);
        
        // Check if Module 1 is unlocked
        const module1 = progressResult.find(m => m.module_id === 1);
        if (module1 && module1.is_unlocked) {
          console.log('✅ Module 1 is properly unlocked');
        } else {
          console.log('❌ Module 1 is not unlocked:', module1);
        }
        
        // Check other modules are locked
        const lockedModules = progressResult.filter(m => m.module_id > 1 && !m.is_unlocked);
        console.log(`🔒 Locked modules count: ${lockedModules.length}`);
      }
    } catch (error) {
      console.log('❌ get_all_module_progress function missing or broken:', error.message);
    }

    // 3. Test is_module_unlocked individually
    console.log('\n3️⃣ Testing individual module unlock status...');
    
    for (let moduleId = 1; moduleId <= 4; moduleId++) {
      try {
        const { data: unlockResult, error: unlockError } = await supabase.rpc('is_module_unlocked', {
          p_user_id: userId,
          p_module_id: moduleId
        });
        
        if (unlockError) {
          console.log(`❌ Module ${moduleId} unlock check error:`, unlockError.message);
        } else {
          const status = unlockResult ? '🔓 UNLOCKED' : '🔒 LOCKED';
          console.log(`Module ${moduleId}: ${status}`);
        }
      } catch (error) {
        console.log(`❌ Module ${moduleId} unlock check failed:`, error.message);
      }
    }

    // 4. Test module_progress table direct query
    console.log('\n4️⃣ Testing direct module_progress table access...');
    
    try {
      const { data: tableData, error: tableError } = await supabase
        .from('module_progress')
        .select('*')
        .eq('user_id', userId)
        .order('module_id');
      
      if (tableError) {
        console.log('❌ Direct table access error:', tableError.message);
      } else {
        console.log('✅ Direct table access works');
        console.log('📊 Module progress records:', tableData);
      }
    } catch (error) {
      console.log('❌ Direct table access failed:', error.message);
    }

    console.log('\n✨ Module system test completed!');
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testModuleSystem);
  } else {
    testModuleSystem();
  }
} else {
  console.log('Run this script in the browser console on your app page');
}
