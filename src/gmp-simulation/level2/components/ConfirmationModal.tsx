import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ConfirmationModalProps } from '../types';

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onClose, onConfirm, isLoading = false }) => {
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" 
      style={{ fontFamily: 'Verdana, Geneva, Tahoma, sans-serif' }}
    >
      <div 
        className="pixel-border-thick bg-yellow-100 w-full max-w-md text-center relative overflow-hidden animate-slideIn p-6" 
        style={{ fontFamily: 'Verdana, Geneva, Tahoma, sans-serif' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
        
        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-20 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded-full p-1 shadow pixel-border"
            aria-label="Close warning modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-yellow-400 pixel-border flex items-center justify-center w-8 h-8 animate-bounce relative">
              <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-60 animate-ping"></span>
              <AlertTriangle className="text-yellow-900 w-5 h-5 relative z-10" />
            </div>
            <h2 className="font-black text-yellow-900 pixel-text text-lg">CAUTION</h2>
          </div>
          
          <div className="mb-6">
            <span className="font-bold text-yellow-900 pixel-text text-base">
              {isLoading ? 'Saving your progress...' : 'Action cannot be undone. Are you sure you want to proceed?'}
            </span>
          </div>
          
          <div className="flex justify-center">
            <button
              className={`pixel-border ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105'
              } text-yellow-900 font-black pixel-text transition-all duration-200 py-3 px-6 shadow-lg flex items-center gap-2`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-900 border-t-transparent" />
              )}
              <span className="text-sm">
                {isLoading ? 'Saving...' : 'Yes, Proceed'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
