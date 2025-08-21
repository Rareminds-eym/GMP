
import React from "react";
import { Info, ChevronRight } from "lucide-react";

interface CaseQuestionModalProps {
  open: boolean;
  question: string;
  caseNumber?: number;
  onClose: () => void;
  onConfirm: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

const CaseQuestionModal: React.FC<CaseQuestionModalProps> = ({ open, question, caseNumber, onClose, onConfirm, onPrev, onNext, disablePrev, disableNext }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 font-[Verdana,Arial,sans-serif]">
  <div className="pixel-border-thick bg-blue-100 w-full max-w-2xl min-h-[200px] max-h-[450px] text-center relative overflow-hidden animate-slideIn p-8 font-[Verdana,Arial,sans-serif] flex flex-col justify-between">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pixel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-20"></div>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-full p-1 shadow pixel-border"
          aria-label="Close case modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Heading */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-blue-400 pixel-border flex items-center justify-center w-8 h-8 animate-bounce relative">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-60 animate-ping"></span>
              <Info className="text-blue-900 w-5 h-5 relative z-10" />
            </div>
            <h2 className="font-black text-blue-900 pixel-text text-lg">
              Case Question{typeof caseNumber === 'number' ? ` ${caseNumber}` : ''}
            </h2>
          </div>
          {/* Scrollable Question Area */}
          <div className="flex-1 overflow-y-auto mb-4 max-h-56">
            <span className="font-bold text-blue-900 pixel-text text-base whitespace-pre-line">
              {question}
            </span>
          </div>
          {/* Buttons Row */}
          <div className="relative h-16 w-full flex items-center justify-center">
            {onPrev && (
              <button
                onClick={onPrev}
                disabled={disablePrev}
                className="absolute left-2 bottom-2 z-20 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-full p-1 shadow pixel-border disabled:opacity-50"
                aria-label="Previous case"
                style={{ width: '2.25rem', height: '2.25rem', minWidth: '2.25rem', minHeight: '2.25rem' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <button
              onClick={onConfirm}
              className="pixel-border bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-300 hover:to-blue-400 text-blue-900 font-black pixel-text transition-all duration-200 flex items-center space-x-2 py-3 px-8 transform hover:scale-105 shadow-lg mx-auto"
              style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)' }}
            >
              <span className="text-sm">Confirm</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            {onNext && (
              <button
                onClick={onNext}
                disabled={disableNext}
                className="absolute right-2 bottom-2 z-20 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-full p-1 shadow pixel-border disabled:opacity-50"
                aria-label="Next case"
                style={{ width: '2.25rem', height: '2.25rem', minWidth: '2.25rem', minHeight: '2.25rem' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseQuestionModal;
