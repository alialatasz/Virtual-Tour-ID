"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MousePointerClick, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { tourData } from "@/lib/tourData";

interface Props {
  onRoomClick: (roomId: string) => void;
  currentSceneId?: string;
}

export default function RoomCarousel({ onRoomClick, currentSceneId }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);

  // Hanya tampilkan ruangan yang memiliki media video yang tersedia
  const availableRooms = Object.values(tourData).filter(
    (room) => room.type === "video" && room.id !== "lapangan-utama"
  );

  // Auto-scroll ke kartu ruangan yang sedang aktif saat lokasi berubah
  useEffect(() => {
    if (activeCardRef.current && carouselRef.current) {
      activeCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentSceneId]);

  // Handler scroll mousewheel horizontal untuk laptop/desktop
  const handleWheel = (e: React.WheelEvent) => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full pt-10 pb-5 px-3 sm:px-8 z-20 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center justify-between mb-3 pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-white text-base sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-semibold flex items-center gap-2">
              <span>Eksplorasi Ruangan</span>
            </h3>

            {/* Tombol Panah Geser Kiri / Kanan untuk Laptop */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="w-7 h-7 rounded-lg bg-[#0a0d0a]/90 hover:bg-[#FD6842] hover:text-white border border-white/15 text-[#8e998e] flex items-center justify-center transition-colors shadow-md cursor-pointer"
                title="Geser area ke kiri"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="w-7 h-7 rounded-lg bg-[#0a0d0a]/90 hover:bg-[#FD6842] hover:text-white border border-white/15 text-[#8e998e] flex items-center justify-center transition-colors shadow-md cursor-pointer"
                title="Geser area ke kanan"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div className="text-[11px] sm:text-xs text-history-marigold flex items-center gap-1.5 sm:gap-2 font-bold bg-history-seashell/95 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-history-marigold/30 shadow-lg">
            <span>Klik Area Untuk Info</span>
            <MousePointerClick size={13} />
          </div>
        </motion.div>

        {/* Carousel Ruangan dengan Support Mousewheel & Dragging di Laptop */}
        <div
          ref={carouselRef}
          onWheel={handleWheel}
          className="flex gap-3 sm:gap-5 overflow-x-auto py-2 pb-3 pointer-events-auto select-none scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-[#FD6842]/70 scrollbar-track-transparent"
          style={{ scrollBehavior: "smooth" }}
        >
          {availableRooms.map((room) => {
            const isActive = currentSceneId === room.id;

            return (
              <motion.div
                key={room.id}
                ref={isActive ? activeCardRef : null}
                onClick={() => onRoomClick(room.id)}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`relative flex-shrink-0 w-60 sm:w-72 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-xl ${
                  isActive
                    ? "bg-[#FFF8F0] ring-4 ring-[#FD6842] shadow-[0_0_30px_rgba(253,104,66,0.55)] scale-[1.02] border-2 border-[#FD6842]"
                    : "bg-history-seashell border-2 border-history-ivy/10 hover:border-history-marigold"
                }`}
              >
                {/* Badge Penanda Lokasi Aktif Saat Ini */}
                {isActive && (
                  <div className="absolute top-2.5 left-2.5 z-20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#FD6842] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span className="flex items-center gap-1">
                      <MapPin size={10} /> Lokasi Anda
                    </span>
                  </div>
                )}

                <div className="h-28 sm:h-32 overflow-hidden relative border-b-2 border-history-ivy/10 bg-[#1a201a]">
                  <img
                    src={room.imgAfter || "/gambar/tahanan-kini.jpg"}
                    alt={room.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>

                <div className={`p-3 sm:p-4 ${isActive ? "bg-[#FFF8F0]" : "bg-history-seashell"}`}>
                  <h4
                    className={`font-serif font-bold text-sm sm:text-base mb-1 transition-colors line-clamp-1 ${
                      isActive ? "text-[#FD6842]" : "text-history-ivy group-hover:text-history-marigold"
                    }`}
                  >
                    {room.title}
                  </h4>
                  <p
                    className={`text-[10px] sm:text-xs font-medium leading-relaxed border-l-2 pl-2 transition-all line-clamp-2 ${
                      isActive
                        ? "text-[#4a2e20] border-[#FD6842]"
                        : "text-history-ivy/80 border-transparent group-hover:border-history-marigold"
                    }`}
                  >
                    {room.shortDesc || room.historyDesc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
