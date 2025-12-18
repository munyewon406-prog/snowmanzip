import React, { useState } from 'react';
import { SnowmanEntry } from '../types';
import { X, Calendar, MapPin, Image as ImageIcon, Camera } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface SnowmanDetailProps {
  snowman: SnowmanEntry | null;
  onClose: () => void;
}

const rarityMap: Record<string, string> = {
  Common: '일반',
  Uncommon: '희귀',
  Rare: '레어',
  Legendary: '전설',
  Mythical: '신화',
};

export const SnowmanDetail: React.FC<SnowmanDetailProps> = ({ snowman, onClose }) => {
  const [viewMode, setViewMode] = useState<'photo' | 'sticker'>('photo');

  if (!snowman) return null;

  const statsData = [
    { subject: '창의성', A: snowman.stats.creativity, fullMark: 100 },
    { subject: '동글함', A: snowman.stats.roundness, fullMark: 100 },
    { subject: '장식', A: snowman.stats.accessories, fullMark: 100 },
    { subject: '여유', A: snowman.stats.chillFactor, fullMark: 100 },
    { subject: '내구도', A: snowman.stats.durability, fullMark: 100 },
  ];

  const stickerSrc = snowman.stickerUrl ? `data:image/png;base64,${snowman.stickerUrl}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-2xl flex flex-col md:flex-row overflow-hidden relative text-slate-800">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 relative flex flex-col">
            <div className="flex-1 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                 <img 
                  src={viewMode === 'photo' ? snowman.imageUrl : (stickerSrc || snowman.imageUrl)} 
                  alt={snowman.name} 
                  className={`w-full h-full ${viewMode === 'photo' ? 'object-cover' : 'object-contain p-8'}`}
                />
            </div>
            
            {/* Toggle View */}
            {stickerSrc && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-white/90 rounded-full p-1 shadow-lg z-20 border border-slate-200">
                    <button 
                        onClick={() => setViewMode('photo')}
                        className={`p-2 rounded-full transition-colors ${viewMode === 'photo' ? 'bg-cyan-100 text-cyan-600' : 'text-slate-400 hover:text-cyan-500'}`}
                    >
                        <Camera size={16} />
                    </button>
                    <button 
                        onClick={() => setViewMode('sticker')}
                        className={`p-2 rounded-full transition-colors ${viewMode === 'sticker' ? 'bg-cyan-100 text-cyan-600' : 'text-slate-400 hover:text-cyan-500'}`}
                    >
                        <ImageIcon size={16} />
                    </button>
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white md:hidden z-10 pointer-events-none">
                 <h2 className="text-2xl font-bold">{snowman.name}</h2>
                 <p className="opacity-90">{snowman.type} 타입 눈사람</p>
            </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <div className="hidden md:block mb-4">
             <h2 className="text-3xl font-bold text-slate-800">{snowman.name}</h2>
             <div className="flex items-center gap-2 mt-1">
                 <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-200 text-slate-600`}>
                     {snowman.type} 타입
                 </span>
                 <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                     snowman.rarity === 'Common' ? 'bg-gray-100 text-gray-600' :
                     snowman.rarity === 'Rare' ? 'bg-blue-100 text-blue-600' :
                     'bg-purple-100 text-purple-600'
                 }`}>
                     {rarityMap[snowman.rarity] || snowman.rarity}
                 </span>
             </div>
          </div>

          <p className="text-slate-600 leading-relaxed mb-6 italic border-l-4 border-cyan-400 pl-3 bg-cyan-50 py-2 rounded-r">
            "{snowman.description}"
          </p>

          <div className="mb-6 h-48 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={statsData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="능력치"
                  dataKey="A"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="#06b6d4"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">재미있는 사실</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{snowman.funFact}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs">
                <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(snowman.timestamp).toLocaleDateString('ko-KR')} 발견
                </div>
                <div className="flex items-center gap-1">
                     <MapPin size={12} />
                     야생의 조우
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
