import React, { useEffect, useState } from 'react';
import { Lock, Star } from 'lucide-react';
import type { Module } from '../../types/module';
import { useDeviceLayout } from '../../hooks/useOrientation';
import { useAuth } from '../../contexts/AuthContext';
import { ModuleProgressService } from '../../services/moduleProgressService';

interface ModuleNodeProps {
  module: Module;
  onSelect?: (id: number) => void;
  isCurrentModule: boolean;
  onStatusChange?: () => void; // Callback to refresh all modules when status changes
}

interface ModuleStatus {
  isUnlocked: boolean;
  isCompleted: boolean;
  loading: boolean;
}

const ModuleNode: React.FC<ModuleNodeProps> = ({ module, onSelect, isCurrentModule, onStatusChange }) => {
  const { isMobile, isHorizontal } = useDeviceLayout();
  const { user } = useAuth();
  const [moduleStatus, setModuleStatus] = useState<ModuleStatus>({
    isUnlocked: false,
    isCompleted: false,
    loading: true
  });

  // Reduce size if mobile and horizontal
  const isCompact = isMobile && isHorizontal;

  const platformWidth = isCompact ? 96 : 144;
  const platformHeight = isCompact ? 64 : 96;
  const orbSize = isCompact ? 40 : 64;
  const shadowWidth = isCompact ? 64 : 96;
  const shadowHeight = isCompact ? 20 : 32;
  const shadowTop = isCompact ? 32 : 48;
  const badgeWidth = isCompact ? 72 : 96;
  const badgeHeight = isCompact ? 32 : 40;
  const badgeFontSize = isCompact ? 12 : 16;
  const titleFontSize = isCompact ? 12 : 14;
  const titleMarginTop = isCompact ? 12 : 24;
  const titleMaxWidth = isCompact ? 96 : 144;
  const orbFontSize = isCompact ? 14 : 20;
  const badgePadding = isCompact ? '0.15rem 0.75rem' : '0.25rem 1.25rem';

  // Fetch module status from database
  const fetchModuleStatus = async () => {
    if (!user) {
      setModuleStatus({ isUnlocked: false, isCompleted: false, loading: false });
      return;
    }

    const moduleIdNum = parseInt(module.id.toString(), 10);

    try {
      // Initialize user modules if not done yet
      await ModuleProgressService.ensureUserModulesInitialized(user.id);

      // Check if module is unlocked
      const unlockResult = await ModuleProgressService.isModuleUnlocked(user.id, moduleIdNum);
      
      // Get module progress to check completion status
      const progressResult = await ModuleProgressService.getAllModuleProgress(user.id);
      const moduleProgress = progressResult.data?.find(m => m.module_id === moduleIdNum);

      setModuleStatus({
        isUnlocked: unlockResult.data || false,
        isCompleted: moduleProgress?.is_completed || false,
        loading: false
      });

      console.log(`Module ${moduleIdNum} status:`, {
        isUnlocked: unlockResult.data,
        isCompleted: moduleProgress?.is_completed,
        rawProgress: moduleProgress
      });

    } catch (error) {
      console.error(`Error fetching status for module ${moduleIdNum}:`, error);
      setModuleStatus({ isUnlocked: false, isCompleted: false, loading: false });
    }
  };

  useEffect(() => {
    fetchModuleStatus();
  }, [user, module.id]);

  // Determine actual module status based on database
  const actualStatus = moduleStatus.loading 
    ? 'locked' // Show as locked while loading
    : moduleStatus.isCompleted 
    ? 'completed' 
    : moduleStatus.isUnlocked 
    ? 'available' 
    : 'locked';

  const handleClick = async () => {
    // Only allow clicks for available or completed modules (based on database status)
    if ((actualStatus === 'available' || actualStatus === 'completed') && user) {
      try {
        // Convert module.id to number for database operations
        const moduleIdNum = parseInt(module.id.toString(), 10);
        
        // Track module click and store total_levels in database
        const result = await ModuleProgressService.handleModuleClick(user.id, moduleIdNum);
        
        if (result.error) {
          console.error('Error handling module click:', result.error);
        } else {
          console.log('Module click handled successfully:', result.data);
          
          if (result.isNewlyUnlocked) {
            console.log(`🔓 Module ${module.id} has been unlocked and stored in database`);
            // Refresh status for all modules when a new one is unlocked
            onStatusChange?.();
          }
        }
        
        // Proceed with navigation (pass the numeric ID to onSelect)
        onSelect?.(moduleIdNum);
      } catch (error) {
        console.error('Exception in module click handler:', error);
        // Even if there's an error, still allow navigation
        const moduleIdNum = parseInt(module.id.toString(), 10);
        onSelect?.(moduleIdNum);
      }
    } else if (actualStatus === 'locked') {
      // Show feedback for locked modules
      console.log(`Module ${module.id} is locked - complete previous modules to unlock`);
    }
  };

  return (
    <div className={`relative flex flex-col items-center min-h-[${isCompact ? 80 : 120}px]`}>
      {/* Completed badge (gamified style) */}
      {actualStatus === 'completed' && (
        <div
          className="absolute left-1/2 z-30 pointer-events-none"
          style={{ top: -badgeHeight, transform: `translate(-50%, ${isCompact ? 16 : 24}px)` }}
        >
          <div className="relative flex items-center justify-center">
            {/* Badge background with matte color and border */}
            <span className="absolute opacity-80 rounded-full bg-yellow-400" style={{ width: badgeWidth, height: badgeHeight }}></span>
            <span className="absolute opacity-80 rounded-full border-2 border-yellow-800" style={{ width: badgeWidth, height: badgeHeight }}></span>
            {/* Badge content */}
            <span
              className="relative flex items-center font-extrabold uppercase border border-yellow-800 rounded-full shadow-md"
              style={{ padding: badgePadding, background: '#facc15', boxShadow: '0 2px 8px #0004', fontSize: badgeFontSize, color: '#713f12', letterSpacing: 2 }}
            >
              <svg className="mr-2" width={isCompact ? 14 : 20} height={isCompact ? 14 : 20} viewBox="0 0 24 24" fill="none" stroke="#bfa700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#ffe066"/></svg>
              Completed!
            </span>
          </div>
        </div>
      )}
      {/* Platform shadow */}
      <div
        className="absolute bg-black opacity-30 rounded-full blur-sm"
        style={{ top: shadowTop, left: '50%', transform: 'translateX(-50%)', width: shadowWidth, height: shadowHeight }}
      ></div>
      {/* Floating orb/module indicator */}
      <div
        onClick={handleClick}
        className={`relative z-10 ${actualStatus === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        style={{ marginTop: isCompact ? -20 : -32, transform: `translateY(${isCompact ? 40 : 56}px)` }}
      >
        <div
          className={`flex items-center justify-center rounded-full border-4 border-white/30 shadow-lg ${actualStatus === 'available' ? 'animate-pulse' : ''}`}
          style={{
            width: orbSize,
            height: orbSize,
            background:
              actualStatus === 'completed'
                ? 'linear-gradient(to bottom, #10b981, #047857)'
                : actualStatus === 'available'
                ? 'linear-gradient(to bottom, #22d3ee, #0891b2)'
                : 'linear-gradient(to bottom, #6b7280, #374151)', // Gray gradient for locked
          }}
        >
          {/* Module content based on status */}
          {actualStatus === 'locked' ? (
            // Show lock icon for locked modules
            <Lock 
              size={isCompact ? 16 : 24} 
              color="white" 
              className="drop-shadow-md" 
            />
          ) : (
            // Show module number for available/completed modules
            <div className="font-bold text-white" style={{ fontSize: orbFontSize, textShadow: '0 2px 8px #0008' }}>
              {module.id}
            </div>
          )}
        </div>
        {/* Orb glow effect - only for available modules */}
        {actualStatus === 'available' && (
          <div
            className="absolute rounded-full bg-cyan-400 opacity-30 animate-ping"
            style={{ inset: 0, width: orbSize, height: orbSize }}
          ></div>
        )}
        {/* Locked indicator pulse */}
        {actualStatus === 'locked' && (
          <div
            className="absolute rounded-full border-2 border-gray-400 opacity-50 animate-pulse"
            style={{ inset: 0, width: orbSize, height: orbSize }}
          ></div>
        )}
      </div>
      {/* Main floating platform */}
      <div
        onClick={handleClick}
        className={`relative flex flex-col items-center justify-center transition-transform duration-300 ${
          actualStatus === 'locked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        }`}
        style={{
          width: platformWidth,
          height: platformHeight,
          background:
            actualStatus === 'completed'
              ? 'linear-gradient(to bottom right, #6d28d9, #4c1d95, #312e81)'
              : actualStatus === 'available'
              ? 'linear-gradient(to bottom right, #7c3aed, #6d28d9, #3730a3)'
              : 'linear-gradient(to bottom right, #6b7280, #4b5563, #374151)', // Gray for locked
          boxShadow: actualStatus === 'locked' 
            ? '0 8px 32px 0 rgba(0, 0, 0, 0.2)' 
            : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          clipPath: 'ellipse(70% 100% at 50% 100%)',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          outline: isCurrentModule && actualStatus === 'available' ? '4px solid #67e8f9' : undefined,
          outlineOffset: isCurrentModule && actualStatus === 'available' ? '2px' : undefined,
          boxSizing: 'border-box',
        }}
        onMouseOver={e => {
          if (actualStatus !== 'locked') e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={e => {
          if (actualStatus !== 'locked') e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {/* Platform top surface */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: 'linear-gradient(to bottom, #9333ea, transparent)',
            clipPath: 'ellipse(70% 100% at 50% 100%)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          }}
        />
        {/* Progress stars for completed modules */}
        {actualStatus === 'completed' && module.progress && (
          <div className="absolute left-1/2 flex gap-1" style={{ bottom: isCompact ? 4 : 8, transform: 'translateX(-50%)' }}>
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                size={isCompact ? 9 : 12}
                color={(module.progress || 0) >= star * 33 ? '#fde68a' : '#9ca3af'}
                fill={(module.progress || 0) >= star * 33 ? '#fde68a' : 'none'}
                style={{ filter: 'drop-shadow(0 1px 2px #0004)' }}
              />
            ))}
          </div>
        )}
      </div>
      {/* Module title */}
      <div className="text-center mt-3" style={{ marginTop: titleMarginTop, maxWidth: titleMaxWidth }}>
        <div className={`font-semibold text-white leading-tight ${actualStatus === 'locked' ? 'opacity-60' : ''}`} style={{ fontSize: titleFontSize, textShadow: '0 2px 8px #0008' }}>
          {actualStatus === 'locked' && (
            <div className="flex items-center justify-center gap-1 mb-1">
              <Lock size={10} />
              <span className="text-xs">LOCKED</span>
            </div>
          )}
          {module.title}
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.3; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ModuleNode;