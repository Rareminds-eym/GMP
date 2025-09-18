import { useEffect, useState } from 'react';
import { useLockedMainModules } from './useLockedModules';

export function useAvailableModules(userId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  // Get user email for dynamic locking - set to undefined to respect base module configuration
  const userEmail = undefined; // Change this to actual user email when you want dynamic unlocking
  
  // Use the dynamic module system
  const modules = useLockedMainModules(userEmail);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Modules are already processed by the dynamic system
        console.log('📡 Using dynamic modules system');
        console.log('🔑 Dynamic modules result:', modules.map(m => `${m.id}:${m.status}`));
        
        // The modules are already in the correct format, no additional processing needed
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    }
    fetchData();
  }, [modules, userId]);

  return { modules, loading, error };
}
