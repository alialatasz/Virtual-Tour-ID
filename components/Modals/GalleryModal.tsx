"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import MorphGallery, { MorphItem } from "@/components/ui/morph-gallery";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images?: MorphItem[];
  title?: string;
}

export default function GalleryModal({ isOpen, onClose, images, title }: GalleryModalProps) {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent clicks inside the modal content from closing the modal
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-[#0a0d0a] border border-[#2a302a] rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh] sm:h-[82vh]"
            onClick={stopPropagation}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-4 border-b border-[#2a302a] bg-[#101410] shrink-0">
              <h2 className="text-sm sm:text-2xl font-serif text-[#e8ebe8] truncate pr-2">
                Galeri Foto {title ? `- ${title}` : ""}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full hover:bg-[#2a302a] text-[#8e998e] hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Tutup Galeri"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            {/* Gallery Content dengan Tampilan Landscape Elegan & Proporsional */}
            <div className="w-full relative bg-black flex-1 min-h-[240px] aspect-[16/10] sm:aspect-auto">
              {images && images.length > 0 ? (
                <MorphGallery items={images} autoplay={4000} height="100%" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                  <p className="text-[#8e998e] text-center font-mono text-sm">Belum ada foto galeri untuk cagar budaya ini.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
