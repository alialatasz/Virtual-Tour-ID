"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { SceneData, tourCheckpoints, TourCheckpoint } from "@/lib/tourData";

interface MinimapRadarProps {
  currentScene: SceneData;
  onOpenFullMap: () => void;
}

export default function MinimapRadar({ currentScene, onOpenFullMap }: MinimapRadarProps) {
  // Tentukan langkah aktif saat ini
  const activeCheckpoint = useMemo<TourCheckpoint>(() => {
    const found = tourCheckpoints.find(
      s => s.id === currentScene.id || (currentScene.id === "lapangan-utama" && s.id === "r01-gerbang")
    );
    if (found) return found;
    return tourCheckpoints[0];
  }, [currentScene.id]);

  const activeIndex = tourCheckpoints.findIndex(s => s.id === activeCheckpoint.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-auto select-none"
    >
      {/* Kartu Radar HUD Bersih, Minimalis & Elegan di Bawah Judul */}
      <div 
        onClick={onOpenFullMap}
        className="group relative bg-[#0a0e0a]/90 backdrop-blur-xl border border-white/10 hover:border-[#FD6842]/60 rounded-xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.85)] cursor-pointer transition-all duration-300 flex items-center gap-2.5 max-w-[240px] sm:max-w-[260px]"
        title="Buka Peta & Rute Lengkap Benteng"
      >
        {/* Lingkaran Radar Visual Sederhana & Mewah */}
        <div className="relative w-12 h-12 rounded-full bg-[#050805] border border-[#FD6842]/40 group-hover:border-[#FD6842] shadow-[inset_0_0_12px_rgba(253,104,66,0.2)] flex-shrink-0 overflow-hidden flex items-center justify-center">
          
          {/* Garis Sumbu & Grid Halus */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/5 pointer-events-none" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/5 pointer-events-none" />
          <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />

          {/* Indikator Arah Utara */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[7px] font-black tracking-widest text-[#FD6842]/90 leading-none">
            U
          </div>

          {/* Garis Sapuan Radar Lembut */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
            className="absolute inset-0 origin-center pointer-events-none"
            style={{
              background: "conic-gradient(from 0deg at 50% 50%, rgba(253,104,66,0.25) 0deg, transparent 75deg, transparent 360deg)"
            }}
          />

          {/* Garis Rute Vektor Sinkron: Gerbang ➔ Perempatan ➔ Percabangan */}
          <svg className="absolute inset-0 w-full h-full p-2 pointer-events-none" viewBox="0 0 100 100">
            {/* Jalur Utama: Gerbang -> Perempatan */}
            <path
              d="M 12 86 L 20 78 L 27 68 L 34 60 L 40 53 L 45 50 L 52 50"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              strokeDasharray="2 1.5"
            />
            {/* Cabang Lurus: Menuju Ruang Maket & Kaponieri */}
            <path
              d="M 52 50 L 60 48 L 65 38 L 70 60"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.8"
              strokeDasharray="2 1.5"
            />
            {/* Cabang Belok Kiri: Menuju Makam & Monumen */}
            <path
              d="M 52 50 L 48 37 L 44 25 L 42 12"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.8"
              strokeDasharray="2 1.5"
            />

            {/* Jalur Aktif Hijau Menyala */}
            <path
              d={
                activeCheckpoint.branch === 'makam'
                  ? "M 12 86 L 20 78 L 27 68 L 34 60 L 40 53 L 45 50 L 52 50 L 48 37 L 44 25 L 42 12"
                  : activeCheckpoint.branch === 'maket'
                  ? "M 12 86 L 20 78 L 27 68 L 34 60 L 40 53 L 45 50 L 52 50 L 60 48 L 65 38 L 70 60"
                  : "M 12 86 L 20 78 L 27 68 L 34 60 L 40 53 L 45 50 L 52 50"
              }
              fill="none"
              stroke="#10b981"
              strokeWidth="2.2"
              className="opacity-75"
            />
          </svg>

          {/* Titik-Titik Node Rute Sinkron dengan tourCheckpoints */}
          {tourCheckpoints.map((s, idx) => {
            const isCurrent = s.id === activeCheckpoint.id;
            const isPassed = activeIndex >= 0 && idx < activeIndex;

            // Mapping posisi radar yang pas dalam lingkaran
            const rx = s.branch === 'maket' 
              ? (s.step === 8 ? 60 : s.step === 9 ? 65 : 70)
              : s.branch === 'makam'
              ? (s.step === 11 ? 48 : s.step === 12 ? 44 : 42)
              : (12 + (s.step - 1) * 6.5);

            const ry = s.branch === 'maket'
              ? (s.step === 8 ? 48 : s.step === 9 ? 38 : 60)
              : s.branch === 'makam'
              ? (s.step === 11 ? 37 : s.step === 12 ? 25 : 12)
              : (86 - (s.step - 1) * 6.0);

            return (
              <div
                key={s.id}
                className={`absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  isCurrent
                    ? "bg-[#FD6842] ring-4 ring-[#FD6842]/50 z-20 scale-125"
                    : isPassed
                    ? "bg-[#10b981] z-10"
                    : "bg-white/25 z-0"
                }`}
                style={{ left: `${rx}%`, top: `${ry}%` }}
              >
                {/* Ping Pulse pada Node Aktif */}
                {isCurrent && (
                  <span className="absolute -inset-1 rounded-full bg-[#FD6842] animate-ping opacity-75" />
                )}
              </div>
            );
          })}
        </div>

        {/* Informasi Status Langkah Posisi Pengunjung */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FD6842] animate-pulse" />
            <span className="text-[9px] font-bold tracking-widest text-[#FD6842] uppercase">
              Titik {activeCheckpoint.step} dari 13
            </span>
          </div>
          
          <h4 className="font-serif text-xs sm:text-[13px] font-semibold text-white truncate group-hover:text-[#FD6842] transition-colors">
            {activeCheckpoint.name}
          </h4>
          
          <div className="flex items-center gap-1 text-[10px] text-[#8e998e] mt-0.5">
            <span className="truncate max-w-[110px]">{activeCheckpoint.sub}</span>
            <span className="text-white/30">•</span>
            <span className="text-[#a0aca0] group-hover:text-white flex items-center gap-0.5 font-medium transition-colors">
              Peta <Maximize2 size={9} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
