"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MousePointerClick, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { tourData } from "@/lib/tourData";

interface Props {
  onRoomClick: (roomId: string) => void;
  onInfoClick?: (roomId: string) => void;
  currentSceneId?: string;
}

export default function RoomCarousel({ onRoomClick, onInfoClick, currentSceneId }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Hanya tampilkan ruangan yang memiliki media video yang tersedia
  const availableRooms = Object.values(tourData).filter(
    (room) => room.type === "video" && room.id !== "lapangan-utama"
  );

  // Fungsi penggeser presisi langsung ke kartu aktif di dalam carousel
  const scrollToActiveCard = (smooth: boolean = true) => {
    const carousel = carouselRef.current;
    if (!carousel || !currentSceneId) return;

    const activeCard = cardRefs.current[currentSceneId];
    if (!activeCard) return;

    const cardLeft = activeCard.offsetLeft;
    const cardWidth = activeCard.offsetWidth;
    const carouselWidth = carousel.clientWidth;

    // Posisikan kartu tepat di tengah wadah carousel
    const targetScrollLeft = Math.max(0, cardLeft - carouselWidth / 2 + cardWidth / 2);

    carousel.scrollTo({
      left: targetScrollLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Auto-scroll ke kartu ruangan yang sedang aktif saat lokasi berubah
  useEffect(() => {
    // Panggil langsung, lalu beri delay bertahap untuk memastikan rendering layout stabil
    scrollToActiveCard(false);
    const t1 = setTimeout(() => scrollToActiveCard(true), 80);
    const t2 = setTimeout(() => scrollToActiveCard(true), 250);
    const t3 = setTimeout(() => scrollToActiveCard(true), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentSceneId]);

  // Re-center saat ukuran layar berubah (rotasi HP / resize desktop)
  useEffect(() => {
    const handleResize = () => scrollToActiveCard(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSceneId]);

  // Handler saat kartu diklik oleh pengguna
  const handleCardClick = (roomId: string) => {
    onRoomClick(roomId);
    // Langsung gulir ke kartu yang diklik tanpa jeda
    const carousel = carouselRef.current;
    const targetCard = cardRefs.current[roomId];
    if (carousel && targetCard) {
      const cardLeft = targetCard.offsetLeft;
      const cardWidth = targetCard.offsetWidth;
      const carouselWidth = carousel.clientWidth;
      const targetScrollLeft = Math.max(0, cardLeft - carouselWidth / 2 + cardWidth / 2);
      carousel.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  };

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

          {/* Tombol Informasi Edukasi */}
          <button
            type="button"
            onClick={() => onInfoClick && currentSceneId && onInfoClick(currentSceneId)}
            className="text-[11px] sm:text-xs text-history-marigold flex items-center gap-1.5 sm:gap-2 font-bold bg-history-seashell/95 hover:bg-[#FD6842] hover:text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-history-marigold/30 shadow-lg cursor-pointer transition-all"
            title="Buka info sejarah ruangan ini"
          >
            <span>Klik Area Untuk Info</span>
            <MousePointerClick size={13} />
          </button>
        </motion.div>

        {/* Carousel Ruangan dengan Highlight Stroke Oranye & Auto Center */}
        <div
          ref={carouselRef}
          onWheel={handleWheel}
          className="flex gap-3 sm:gap-5 overflow-x-auto py-2 pb-3 pointer-events-auto select-none scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-[#FD6842]/70 scrollbar-track-transparent"
        >
          {availableRooms.map((room) => {
            const isActive = currentSceneId === room.id;

            return (
              <div
                key={room.id}
                ref={(el) => {
                  cardRefs.current[room.id] = el;
                }}
                onClick={() => handleCardClick(room.id)}
                className={`relative flex-shrink-0 w-60 sm:w-72 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-xl ${
                  isActive
                    ? "bg-[#FFF8F0] ring-4 ring-[#FD6842] border-2 border-[#FD6842] shadow-[0_0_35px_rgba(253,104,66,0.65)] scale-[1.03] z-10"
                    : "bg-history-seashell border-2 border-history-ivy/10 hover:border-[#FD6842]/60 hover:scale-[1.01]"
                }`}
              >
                {/* Badge Penanda Lokasi Aktif Saat Ini dengan Stroke Oranye */}
                {isActive && (
                  <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-full bg-[#FD6842] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="stroke-[2.5]" /> Lokasi Anda
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
