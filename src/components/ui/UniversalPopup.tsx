import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import PopupPortal from './PopupPortal';

interface UniversalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  backdropClassName?: string;
  contentClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  preventBodyScroll?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  animation?: 'scale' | 'slide' | 'fade';
}

const sizeClasses = {
  sm: 'max-w-sm w-full mx-4',
  md: 'max-w-md w-full mx-4',
  lg: 'max-w-lg w-full mx-4',
  xl: 'max-w-xl w-full mx-4',
  full: 'w-full h-full m-0'
};

const animationVariants = {
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  slide: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }
};

export const UniversalPopup: React.FC<UniversalPopupProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  backdropClassName = 'bg-black/60 backdrop-blur-sm',
  contentClassName = 'bg-white rounded-lg shadow-2xl',
  size = 'md',
  preventBodyScroll = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  animation = 'scale',
}) => {
  
  // Handle escape key
  React.useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  return (
    <PopupPortal
      isOpen={isOpen}
      onClose={onClose}
      preventBodyScroll={preventBodyScroll}
      closeOnBackdropClick={closeOnBackdropClick}
      className={backdropClassName}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`relative ${sizeClasses[size]} ${contentClassName}`}
            variants={animationVariants[animation]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking content
          >
            {/* Header with close button */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close popup"
                  >
                    <Icon icon="mdi:close" className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PopupPortal>
  );
};

export default UniversalPopup;
