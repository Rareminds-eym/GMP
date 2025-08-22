import React, { useEffect, useRef, useState } from 'react';
import { useDeviceLayout } from '../hooks/useOrientation';

interface Level2TimerProps {
  initialTime: number;
  isActive: boolean;
  onTimeUp: () => void;
}

const Level2Timer: React.FC<Level2TimerProps> = ({ initialTime, isActive, onTimeUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer if initialTime changes (e.g., on restart)
  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = (timeRemaining / initialTime) * 100;
  const { isMobile } = useDeviceLayout();
  const getTextColor = () => {
    if (percentage > 25) return 'text-white';
    return 'text-red-400';
  };

  // Compact style for mobile
  return (
    <div
      className={`font-mono ${getTextColor()} ${isMobile ? 'text-[13px] px-1 py-0.5 rounded bg-gray-900/80' : 'text-xs'} flex items-center justify-center`}
      style={isMobile ? { minWidth: 38, minHeight: 22, lineHeight: '18px', letterSpacing: 1 } : {}}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export default Level2Timer;
