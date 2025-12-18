import React, { useState, useEffect } from 'react';
import { SnowmanEntry } from './types';
import { analyzeSnowmanImage, generateSnowmanSticker } from './services/geminiService';
import { SnowmanCard } from './components/SnowmanCard';
import { SnowmanDetail } from './components/SnowmanDetail';
import { CameraInput } from './components/CameraInput';
import { Snowflake, Share2, Copy } from 'lucide-react';

const App: React.FC = () => {
  const [collection, setCollection] = useState<SnowmanEntry[]>([]);
  const [selectedSnowman, setSelectedSnowman] = useState<SnowmanEntry | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('snowmanDex');
    if (saved) {
      try {
        setCollection(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse collection", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('snowmanDex', JSON.stringify(collection));
  }, [collection]);

  const handleImageSelect = async (file: File) => {
    setIsAnalyzing(true);
    setLoadingMessage("눈사람 스캔 중...");
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1];

        try {
          const [analysis, stickerBase64] = await Promise.all([
            analyzeSnowmanImage(base64Content),
            generateSnowmanSticker(base64Content)
          ]);

          const newEntry: SnowmanEntry = {
            id: Date.now().toString(),
            imageUrl: base64String,
            stickerUrl: stickerBase64,
            timestamp: Date.now(),
            ...analysis
          };

          setCollection(prev => [newEntry, ...prev]);
          setSelectedSnowman(newEntry);
        } catch (error) {
          console.error(error);
          alert("오류가 발생했습니다. 다시 시도해 주세요!");
        } finally {
          setIsAnalyzing(false);
          setLoadingMessage("");
        }
      };
    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
    }
  };

  const totalCount = collection.length;
  const categoriesCount = new Set(collection.map(s => s.type)).size;

  // Render empty slots to maintain the grid feel (minimum 12 slots)
  const emptySlotsCount = Math.max(0, 12 - collection.length);
  const emptySlots = Array(emptySlotsCount).fill(null);

  const shareUrl = `snowmandex.zip/${Math.random().toString(36).substring(7)}`;

  return (
    <div className="flex flex-col min-h-screen max-w-[393px] mx-auto bg-[#2D325A] text-white p-6 relative overflow-x-hidden">
      
      {/* Header */}
      <header className="flex flex-col items-center mb-8 pt-4">
        <div className="relative inline-block">
          <div className="absolute -top-2 -left-4 text-3xl font-light opacity-80">⌜</div>
          <div className="absolute -bottom-2 -right-4 text-3xl font-light opacity-80 rotate-180">⌜</div>
          <h1 className="text-4xl font-bold tracking-tight">눈사람 도감</h1>
        </div>
      </header>

      {/* Stats Buttons */}
      <div className="flex gap-4 mb-8">
        <button className="flex-1 py-2 bg-white text-[#2D325A] rounded-full font-bold text-lg shadow-inner">
          전체 {totalCount.toString().padStart(2, '0')}
        </button>
        <button className="flex-1 py-2 rounded-full border-2 border-white/80 font-bold text-lg hover:bg-white/5">
          카테고리 {categoriesCount.toString().padStart(2, '0')}
        </button>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-3 gap-3 mb-10 overflow-y-auto custom-scrollbar flex-1 max-h-[450px]">
        {collection.map((snowman, index) => (
          <SnowmanCard 
            key={snowman.id} 
            snowman={snowman} 
            index={index}
            onClick={setSelectedSnowman} 
          />
        ))}
        {emptySlots.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-[18px] border-2 border-white/40 border-dashed flex items-center justify-center opacity-30">
             <Snowflake size={20} />
          </div>
        ))}
      </div>

      {/* Action Area */}
      <div className="mt-auto space-y-8 pb-4">
        <CameraInput onImageSelect={handleImageSelect} isAnalyzing={isAnalyzing} />

        {/* Footer Share UI */}
        <div className="flex gap-2 items-center">
            <div className="flex-1 px-4 py-2 border-2 border-white/80 rounded-sm font-mono text-sm overflow-hidden whitespace-nowrap opacity-80">
                {shareUrl}
            </div>
            <button 
                onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert('링크가 복사되었습니다!');
                }}
                className="bg-white text-[#2D325A] px-4 py-2 rounded-sm text-sm font-bold active:scale-95 transition-transform"
            >
                도감 공유
            </button>
        </div>
      </div>

      {/* Details Modal */}
      {selectedSnowman && (
        <SnowmanDetail 
          snowman={selectedSnowman} 
          onClose={() => setSelectedSnowman(null)} 
        />
      )}

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#2D325A]/80 backdrop-blur-md">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xl font-bold animate-pulse">{loadingMessage}</p>
        </div>
      )}
    </div>
  );
};

export default App;