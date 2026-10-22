"use client";

import { motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import { tourData } from "@/lib/tourData";

interface Props {
  onRoomClick: (roomId: string) => void;
}

export default function RoomCarousel({ onRoomClick }: Props) {
  // Hanya tampilkan ruangan yang memiliki media video yang tersedia
  const availableRooms = Object.values(tourData).filter(room => room.type === "video" && room.id !== "lapangan-utama");

  return (
    <div className="absolute bottom-0 left-0 w-full pt-12 pb-6 px-4 sm:px-8 z-20 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center justify-between mb-4 pointer-events-auto"
        >
          <h3 className="font-serif text-white text-lg sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Eksplorasi Ruangan
          </h3>
          <div className="text-xs text-history-marigold flex items-center gap-2 font-bold bg-history-seashell/95 px-3 py-1.5 rounded-full border border-history-marigold/30 shadow-lg">
            Klik Area Untuk Info <MousePointerClick size={14} />
          </div>
        </motion.div>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-4 pointer-events-auto">
          {availableRooms.map((room) => (
            <motion.div
              key={room.id}
              onClick={() => onRoomClick(room.id)}
              whileHover={{ y: -5, scale: 1.02 }}
              className="flex-shrink-0 w-64 sm:w-72 bg-history-seashell rounded-2xl overflow-hidden border-2 border-history-ivy/10 hover:border-history-marigold shadow-xl cursor-pointer group transition-all"
            >
              <div className="h-28 sm:h-32 overflow-hidden relative border-b-2 border-history-ivy/10 bg-[#1a201a]">
                {/* Fallback image is imgAfter if it exists, otherwise a placeholder */}
                <img
                  src={room.imgAfter || "/gambar/tahanan-kini.jpg"}
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-4 bg-history-seashell">
                <h4 className="font-serif font-bold text-history-ivy text-base mb-1.5 group-hover:text-history-marigold transition-colors">
                  {room.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-history-ivy/80 font-medium leading-relaxed border-l-2 border-transparent group-hover:border-history-marigold pl-2 transition-all line-clamp-2">
                  {room.shortDesc || room.historyDesc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
