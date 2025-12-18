import React from 'react';
import { SnowmanEntry } from '../types';

interface SnowmanCardProps {
  snowman: SnowmanEntry;
  onClick: (snowman: SnowmanEntry) => void;
  index: number;
}

export const SnowmanCard: React.FC<SnowmanCardProps> = ({ snowman, onClick }) => {
  // Use stickerUrl if available, otherwise fallback to imageUrl
  const displayImage = snowman.stickerUrl 
    ? `data:image/png;base64,${snowman.stickerUrl}` 
    : snowman.imageUrl;

  return (
    <div 
      onClick={() => onClick(snowman)}
      className="group cursor-pointer aspect-square rounded-[18px] border-2 border-white/80 flex items-center justify-center p-2 hover:bg-white/10 transition-colors relative overflow-hidden"
    >
      <img 
        src={displayImage} 
        alt={snowman.name} 
        className={`w-full h-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110 ${!snowman.stickerUrl ? 'rounded-lg opacity-80' : ''}`}
      />
      
      {/* Name Overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <span className="text-white text-xs font-bold px-2 text-center">{snowman.name}</span>
      </div>
    </div>
  );
};