import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { StageProps } from '../../types';

const PrototypeStage: React.FC<StageProps> = ({ formData, onFormDataChange, isMobileHorizontal }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFormDataChange('file', e.target.files[0]);
    }
  };

  return (
    <div className={`${isMobileHorizontal ? 'space-y-3' : 'space-y-8'} animate-fadeIn`}>
      <div className={`text-center ${isMobileHorizontal ? 'mb-3' : 'mb-8'}`}>
        <div className="pixel-border-thick bg-gradient-to-br from-gray-900/30 to-slate-900/30 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-pixel-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="pixel-border bg-gradient-to-br from-gray-500 to-slate-500 p-3 relative overflow-hidden">
                <Upload className="w-8 h-8 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-slate-500 blur-sm opacity-50 -z-10"></div>
              </div>
              <div>
                <h2 className={`pixel-text ${isMobileHorizontal ? 'text-xl' : 'text-4xl'} font-black text-white mb-1`} style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.7), 0 0 20px rgba(100,116,139,0.3)' }}>
                  PROTOTYPE/DEMO/SKETCH
                </h2>
                <div className="flex items-center justify-center space-x-2">
                  <span className="pixel-text text-xs font-bold text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">
                    OPTIONAL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="group">
          <div className="pixel-border-thick bg-gray-900/50 p-4 relative overflow-hidden group-hover:bg-gray-900/70 transition-all duration-300">
            <div className="absolute inset-0 bg-pixel-pattern opacity-5"></div>
            <div className="relative z-10">
              <p className={`pixel-text text-gray-300 font-bold ${isMobileHorizontal ? 'text-sm' : 'text-base'} mb-4 leading-relaxed text-center`}>
                As PDF attachment submission.
              </p>
              
              <div 
                className={`border-2 border-dashed border-gray-600 text-center hover:border-gray-500 transition-colors duration-300 bg-gray-900/50 ${isMobileHorizontal ? 'p-4' : 'p-8'} relative`}
              >
                <Upload className={`${isMobileHorizontal ? 'w-12 h-12' : 'w-16 h-16'} text-gray-400 mx-auto mb-4`} />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className={`${isMobileHorizontal ? 'text-base' : 'text-lg'} font-black text-white mb-2 block`}>UPLOAD PDF PROTOTYPE</span>
                  <span className={`text-gray-400 block mb-4 font-bold ${isMobileHorizontal ? 'text-sm' : ''}`}>DRAG & DROP OR CLICK TO BROWSE</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div 
                    className="pixel-border inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-300 font-black"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    SELECT FILE
                  </div>
                </label>
                {formData.file && (
                  <div 
                    className={`pixel-border mt-4 bg-green-900/30 relative overflow-hidden ${isMobileHorizontal ? 'p-3' : 'p-4'}`}
                  >
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 4px,
                          rgba(0,255,0,0.1) 4px,
                          rgba(0,255,0,0.1) 8px
                        )`
                      }}></div>
                    </div>
                    <div className="relative z-10">
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <span className="text-green-400 font-black">{formData.file.name}</span>
                      <p className="text-green-300 text-sm mt-1 font-bold">FILE UPLOAD SUCCESSFUL</p>
                    </div>
                  </div>
                )}
                
                {/* Progress Indicator */}
                <div className="absolute top-2 right-2">
                  {formData.file ? (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  ) : (
                    <div className="w-3 h-3 border-2 border-gray-500 animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypeStage;
