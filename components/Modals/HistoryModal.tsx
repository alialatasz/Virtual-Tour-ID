import { tourData } from "@/lib/tourData";
import { X, BookOpen, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  dataId: string | null;
  initialTab?: 'history' | 'current';
  onClose: () => void;
};

export default function HistoryModal({ isOpen, dataId, initialTab = 'history', onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'history' | 'current'>(initialTab);
  const [sliderValue, setSliderValue] = useState(50);

  // Sync state ketika prop berubah
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSliderValue(50); // Reset slider
    }
  }, [isOpen, initialTab]);

  if (!isOpen || !dataId) return null;
  const data = tourData[dataId];
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md pointer-events-auto transition-opacity animate-fade-in">
      
      <div className="bg-[#0a0d0a] w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl relative border border-white/10 flex flex-col shadow-2xl">
        
        {/* Header / Nav */}
        <div className="sticky top-0 z-20 flex justify-between items-center p-4 sm:p-6 bg-[#080c08]/95 backdrop-blur-md border-b border-[#1c241c]">
          <div className="bg-[#101410] p-1 rounded-full flex gap-1.5 border border-[#2a302a]">
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === 'history' 
                  ? 'bg-[#FD6842] text-white font-bold shadow-md' 
                  : 'text-[#8e998e] hover:text-[#e8ebe8]'
              }`}
            >
              <BookOpen size={14} /> <span>Sejarah</span>
            </button>
            <button 
              onClick={() => setActiveTab('current')}
              className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === 'current' 
                  ? 'bg-[#FD6842] text-white font-bold shadow-md' 
                  : 'text-[#8e998e] hover:text-[#e8ebe8]'
              }`}
            >
              <Layers size={14} /> <span>Foto Sebelum & Sesudah</span>
            </button>
          </div>

          <button 
            onClick={onClose}
            className="bg-[#101410] border border-[#2a302a] p-2 rounded-full text-[#8e998e] hover:text-white hover:border-[#FD6842] transition-all duration-300"
            title="Tutup (ESC)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-8 space-y-6">
          {activeTab === 'history' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col gap-1.5">
                <span className="text-[#FD6842] text-[10px] sm:text-xs tracking-[0.3em] uppercase font-semibold">Arsip Kolonial Benteng</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-white tracking-wide uppercase">
                  {data.title}
                </h2>
              </div>
              <div className="w-16 h-[2px] bg-[#FD6842]/60"></div>
              <p className="text-[#b0bbb0] leading-relaxed font-light text-sm sm:text-base md:text-lg">
                {data.historyDesc}
              </p>

              {/* Tampilkan Komparasi Sebelum & Sesudah Langsung di Halaman Sejarah */}
              {data.imgBefore && data.imgAfter && (
                <div className="pt-4 border-t border-[#1c241c] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      <Layers size={15} className="text-[#FD6842]" />
                      Perbandingan Sebelum & Sesudah
                    </span>
                    <span className="text-[11px] text-[#8e998e] italic">Geser slider untuk melihat perubahan</span>
                  </div>

                  <div className="relative w-full aspect-video sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 group bg-[#050705] select-none">
                    {/* Gambar Sesudah (Benteng Baru) */}
                    <img 
                      src={data.imgAfter} 
                      alt="Benteng Baru (Sesudah)" 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    
                    {/* Gambar Sebelum (Benteng Lama) */}
                    <div 
                      className="absolute inset-0 overflow-hidden border-r-2 border-[#FD6842] shadow-[0_0_15px_rgba(253,104,66,0.6)]"
                      style={{ width: `${sliderValue}%` }}
                    >
                      <img 
                        src={data.imgBefore} 
                        alt="Benteng Lama (Sebelum)" 
                        className="absolute inset-0 w-full h-full object-cover" 
                        style={{ width: '100%', maxWidth: 'none', objectFit: 'cover' }} 
                      />
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[#FD6842] text-[11px] font-bold tracking-wider">
                        SEBELUM (BENTENG LAMA)
                      </div>
                    </div>
                    
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] font-bold tracking-wider">
                      SESUDAH (BENTENG BARU)
                    </div>

                    <input 
                      type="range" min="0" max="100" value={sliderValue}
                      onChange={(e) => setSliderValue(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />

                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FD6842] border-2 border-white flex items-center justify-center pointer-events-none z-10 shadow-xl transition-transform group-hover:scale-110"
                      style={{ left: `calc(${sliderValue}% - 16px)` }}
                    >
                      <div className="flex gap-0.5 text-white">
                        <ChevronLeft size={13} className="stroke-[3]" />
                        <ChevronRight size={13} className="stroke-[3]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <span className="text-[#FD6842] text-[10px] sm:text-xs tracking-[0.3em] uppercase font-semibold">Transformasi Bangunan</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-wider uppercase">
                  Perbandingan Waktu: Sebelum & Sesudah
                </h2>
                <p className="text-[#8e998e] text-xs sm:text-sm font-light">
                  Geser garis tengah untuk membandingkan foto benteng masa lampau (sebelum) dengan revitalisasi masa kini (sesudah).
                </p>
              </div>
              
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group bg-[#050705] select-none">
                {/* Gambar Sesudah (Benteng Baru) */}
                <img 
                  src={data.imgAfter} 
                  alt="Benteng Baru (Sesudah)" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                
                {/* Gambar Sebelum (Benteng Lama) */}
                <div 
                  className="absolute inset-0 overflow-hidden border-r-2 border-[#FD6842] shadow-[0_0_15px_rgba(253,104,66,0.6)]"
                  style={{ width: `${sliderValue}%` }}
                >
                  <img 
                    src={data.imgBefore} 
                    alt="Benteng Lama (Sebelum)" 
                    className="absolute inset-0 w-full h-full object-cover" 
                    style={{ width: '100%', maxWidth: 'none', objectFit: 'cover' }} 
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-[#FD6842] text-xs font-bold tracking-wider">
                    SEBELUM (BENTENG LAMA)
                  </div>
                </div>
                
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold tracking-wider">
                  SESUDAH (BENTENG BARU)
                </div>

                <input 
                  type="range" min="0" max="100" value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FD6842] border-2 border-white flex items-center justify-center pointer-events-none z-10 shadow-xl transition-transform group-hover:scale-110"
                  style={{ left: `calc(${sliderValue}% - 16px)` }}
                >
                  <div className="flex gap-0.5 text-white">
                    <ChevronLeft size={13} className="stroke-[3]" />
                    <ChevronRight size={13} className="stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
