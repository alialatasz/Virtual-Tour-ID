"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navigation/Navbar";
import RoomCarousel from "@/components/Navigation/RoomCarousel";
import HistoryModal from "@/components/Modals/HistoryModal";
import GalleryModal from "@/components/Modals/GalleryModal";
import PannellumViewer from "@/components/360/PannellumViewer";
import AFrameViewer from "@/components/360/AFrameViewer";
import MinimapRadar from "@/components/Navigation/MinimapRadar";
import ExpandedMapModal from "@/components/Modals/ExpandedMapModal";
import { GyroToggle } from "@/components/ui/gyro-toggle";
import { Hand, Maximize, Minimize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSiteById, HeritageSite } from "@/lib/tourData";

export default function TourPage({ params }: { params: { siteId: string } }) {
  const [siteData, setSiteData] = useState<HeritageSite | null>(null);
  const [modalData, setModalData] = useState<{id: string, tab: 'history'|'current'} | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [currentScene, setCurrentScene] = useState("r01-gerbang");
  const [showOverlay, setShowOverlay] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isGyroEnabled, setIsGyroEnabled] = useState(false);

  // Deteksi khusus perangkat HP / Tablet agar gyro hanya muncul di HP
  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent || "";
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
      setIsMobileDevice(isMobileUA || (isTouch && window.innerWidth < 1024));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Otomatis sembunyikan tombol "Klik & Geser Layar" setelah 2 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGyroToggle = () => {
    if (!isGyroEnabled && typeof (DeviceOrientationEvent as any)?.requestPermission === "function") {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === "granted") {
            setIsGyroEnabled(true);
          }
        })
        .catch((err: any) => console.warn("Gyro permission error:", err));
    } else {
      setIsGyroEnabled(!isGyroEnabled);
    }
  };

  useEffect(() => {
    // Load site data
    getSiteById(params.siteId).then(data => {
      setSiteData(data);
    });
  }, [params.siteId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen error:", err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const events = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange"];
    events.forEach(e => document.addEventListener(e, handleFullscreenChange));
    return () => events.forEach(e => document.removeEventListener(e, handleFullscreenChange));
  }, []);

  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!siteData) {
    return <div className="w-full h-screen bg-[#050705] flex items-center justify-center"><p className="text-[#FD6842] animate-pulse">Memuat lingkungan 360...</p></div>;
  }

  const handleHotspotClick = (id: string) => { setModalData({ id, tab: 'history' }); };
  const handleSceneChange = (sceneId: string) => { 
    if (!sceneId || !siteData?.rooms[sceneId]) return;
    setIsTransitioning(true);
    setCurrentScene(sceneId);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };
  const handleRoomClick = (id: string) => { 
    if (!id || !siteData?.rooms[id]) return;
    handleSceneChange(id); 
  };
  const handleRoomInfoClick = (id: string) => {
    if (!id || !siteData?.rooms[id]) return;
    setModalData({ id, tab: 'history' });
  };

  const handleNavMenuClick = (menu: string) => {
    if (menu === "Jelajah 360") {
      setModalData(null);
      setShowGallery(false);
    } else if (menu === "Sejarah") {
      setModalData({ id: "sejarah-umum", tab: "history" });
      setShowGallery(false);
    } else if (menu === "Peta & Rute") {
      setIsMapOpen(true);
      setShowGallery(false);
    } else if (menu === "Galeri") {
      setShowGallery(true);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050705]">
      
      {/* Efek Transisi Melangkah Google Street View (Motion Blur & Warp Flash) */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[120] pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-[8px]"
          >
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(5,7,5,0.75)_100%)]" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        onClick={toggleFullscreen}
        className={`absolute top-24 right-4 sm:top-24 sm:right-8 z-[60] pointer-events-auto bg-[#0a0d0a]/90 backdrop-blur-md p-3 rounded-xl border border-[#2a302a] text-[#8e998e] hover:text-white hover:border-[#4a504a] transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
        title="Mode Layar Penuh"
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      {/* Tombol Gyroscope - HANYA MUNCUL DI PERANGKAT HP / TABLET (TIDAK MUNCUL DI LAPTOP) */}
      {isMobileDevice && (
        <div 
          className={`fixed top-[155px] right-4 z-[60] transition-all duration-500 ease-in-out ${
            isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <GyroToggle 
            isOn={isGyroEnabled} 
            onToggle={handleGyroToggle}
            className="pointer-events-auto flex flex-col items-center gap-1 scale-[0.88] origin-top-right shadow-2xl"
          />
        </div>
      )}

      {/* Kontainer Viewer dengan Animasi Zoom Maju (Street View Surge) */}
      <div 
        className={`w-full h-full absolute inset-0 transition-transform duration-700 ease-in-out ${
          isTransitioning ? 'scale-[1.12]' : 'scale-100'
        } ${isMapOpen ? 'invisible' : 'visible'}`}
        style={{ transformOrigin: "center center" }}
      >
        {siteData.rooms[currentScene].type === "video" ? (
          <AFrameViewer 
            scene={siteData.rooms[currentScene]} 
            onSceneChange={handleSceneChange}
            onHotspotClick={handleHotspotClick}
            isGyroEnabled={isGyroEnabled}
          />
        ) : (
          <PannellumViewer 
            currentScene={currentScene}
            onHotspotClick={handleHotspotClick}
            onSceneChange={handleSceneChange} 
            hideUI={isFullscreen} 
          />
        )}
      </div>

      <div className={`absolute top-0 left-0 z-[100] w-full transition-opacity duration-1000 ease-in-out ${isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Navbar onMenuClick={handleNavMenuClick} />
      </div>

      <div className={`absolute inset-0 pointer-events-none z-40 transition-all duration-1000 ease-in-out ${isFullscreen ? 'opacity-0 translate-y-[20px]' : 'opacity-100 translate-y-0'}`}>
        <AnimatePresence>
          {showOverlay && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setShowOverlay(false)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto bg-[#0a0d0a]/90 backdrop-blur-md px-6 py-3.5 rounded-full border border-[#FD6842]/50 shadow-[0_0_30px_rgba(253,104,66,0.3)] flex items-center gap-3 cursor-pointer text-white text-xs font-semibold tracking-wider uppercase hover:border-[#FD6842] transition-all"
            >
              <Hand className="animate-bounce text-[#FD6842]" size={18} />
              <span>Klik & Geser Layar</span>
            </motion.div>
          )}
        </AnimatePresence>

        <RoomCarousel 
          onRoomClick={handleRoomClick} 
          onInfoClick={handleRoomInfoClick}
          currentSceneId={currentScene} 
        />
      </div>

      {/* Minimap Radar Lingkaran Video Game HUD (Tepat di Bawah Tulisan JELAJAH VIRTUAL ID) */}
      <div 
        className={`fixed top-[88px] sm:top-[100px] left-6 sm:left-12 z-50 transition-all duration-500 ease-in-out ${
          isFullscreen ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <MinimapRadar
          currentScene={siteData.rooms[currentScene] || siteData.rooms["r01-gerbang"]}
          onOpenFullMap={() => setIsMapOpen(true)}
        />
      </div>

      {/* Modal Peta Lengkap Benteng Fort Willem I */}
      <ExpandedMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        currentSceneId={currentScene}
        onSelectScene={handleSceneChange}
      />
      
      <HistoryModal 
        isOpen={!!modalData} 
        dataId={modalData?.id || null}
        initialTab={modalData?.tab || 'history'}
        onClose={() => setModalData(null)} 
      />

      <GalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        title={siteData?.title}
        images={siteData?.gallery}
      />

    </main>
  );
}



