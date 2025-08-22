import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

interface LevelCompletionPopupProps {
  show: boolean;
  onClose: () => void;
  onContinue?: () => void;
  message?: string;
}

const LevelCompletionPopup: React.FC<LevelCompletionPopupProps> = ({ show, onClose, onContinue, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" style={{ fontFamily: 'Verdana, Geneva, Tahoma, sans-serif' }}>
      <div className="pixel-border-thick bg-gradient-to-br from-cyan-900/90 to-blue-900/90 w-full max-w-md text-center relative overflow-hidden animate-slideIn p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 bg-cyan-200 hover:bg-cyan-300 text-cyan-900 rounded-full p-1 shadow pixel-border"
          aria-label="Close completion popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-cyan-400 pixel-border flex items-center justify-center w-10 h-10 animate-bounce relative">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-60 animate-ping"></span>
              <CheckCircle className="text-cyan-900 w-6 h-6 relative z-10" />
            </div>
            <h2 className="font-black text-cyan-100 pixel-text text-xl drop-shadow">LEVEL COMPLETE!</h2>
          </div>
          <div className="mb-6">
            <span className="font-bold text-cyan-100 pixel-text text-base">
              {message || 'Congratulations! You have successfully completed this level.'}
            </span>
          </div>
          <div className="flex justify-center gap-4">
            {onContinue && (
              <button
                className="pixel-border bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-cyan-900 font-black pixel-text transition-all duration-200 py-3 px-6 transform hover:scale-105 shadow-lg"
                onClick={onContinue}
              >
                <span className="text-sm flex items-center gap-1"><Sparkles className="w-4 h-4" /> Continue</span>
              </button>
            )}
            <button
              className="pixel-border bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-100 hover:to-gray-300 text-gray-900 font-black pixel-text transition-all duration-200 py-3 px-6 transform hover:scale-105 shadow-lg"
              onClick={onClose}
            >
              <span className="text-sm">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelCompletionPopup;
