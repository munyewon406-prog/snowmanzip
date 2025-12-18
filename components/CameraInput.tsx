import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

interface CameraInputProps {
  onImageSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const CameraInput: React.FC<CameraInputProps> = ({ onImageSelect, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center px-8">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        disabled={isAnalyzing}
        onClick={() => fileInputRef.current?.click()}
        className="w-full max-w-sm py-4 px-6 rounded-full border-2 border-white/80 bg-white/10 text-white text-xl font-bold flex items-center justify-center gap-3 hover:bg-white/20 active:scale-95 transition-all shadow-lg backdrop-blur-sm"
      >
        {isAnalyzing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>분석 중...</span>
          </>
        ) : (
          <span>설마 희귀 눈사람 발견?!</span>
        )}
      </button>
    </div>
  );
};