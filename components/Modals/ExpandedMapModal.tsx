"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Compass, 
  Video, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Layers, 
  Image as ImageIcon,
  MapPin,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  fortLocations, 
  FortLocation, 
  tourCheckpoints, 
  TourCheckpoint 
} from "@/lib/tourData";

interface ExpandedMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSceneId: string;
  onSelectScene: (sceneId: string) => void;
}

export default function ExpandedMapModal({
  isOpen,
  onClose,
  currentSceneId,
  onSelectScene,
}: ExpandedMapModalProps) {
  // Mode tampilan: "vector" (Peta Vektor Bersih - Rekomendasi) atau "photo" (Foto Maket Fisik)
  const [mapMode, setMapMode] = useState<"vector" | "photo">("vector");
  const [selectedRoom, setSelectedRoom] = useState<FortLocation | null>(null);
  const [hoveredCp, setHoveredCp] = useState<TourCheckpoint | null>(null);
  const checkpointsScrollRef = useRef<HTMLDivElement>(null);
  const activeCpBtnRef = useRef<HTMLButtonElement>(null);

  // Cari checkpoint aktif saat ini dari tourCheckpoints
  const currentCheckpoint = useMemo<TourCheckpoint>(() => {
    const found = tourCheckpoints.find(
      cp => cp.id === currentSceneId || (currentSceneId === "lapangan-utama" && cp.id === "r01-gerbang")
    );
    if (found) return found;
    return tourCheckpoints[0];
  }, [currentSceneId]);

  // Auto-scroll bilah 13 titik ke posisi aktif saat modal dibuka atau scene berubah
  useEffect(() => {
    if (isOpen && activeCpBtnRef.current) {
      setTimeout(() => {
        activeCpBtnRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }, 100);
    }
  }, [isOpen, currentSceneId]);

  // Handler scroll mousewheel horizontal untuk laptop
  const handleCheckpointsWheel = (e: React.WheelEvent) => {
    if (checkpointsScrollRef.current) {
      checkpointsScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const scrollCheckpoints = (direction: 'left' | 'right') => {
    if (checkpointsScrollRef.current) {
      checkpointsScrollRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth'
      });
    }
  };

  // Sinkronkan selectedRoom saat scene berubah
  useEffect(() => {
    const matchRoom = fortLocations.find(r => r.sceneId === currentSceneId);
    if (matchRoom) {
      setSelectedRoom(matchRoom);
    } else {
      setSelectedRoom(null);
    }
  }, [currentSceneId]);

  // Tangani tombol ESC untuk menutup modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fungsi navigasi instan satu klik ke video tujuan
  const handleJumpToVideo = (sceneId: string) => {
    onSelectScene(sceneId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop Gelap Buram */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl"
        />

        {/* Modal Container Presisi, Modern & Elegan */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl max-h-[95vh] bg-[#080d08] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-[#1c241c] bg-[#080c08]/95 flex-shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#FD6842]/15 border border-[#FD6842]/40 flex items-center justify-center text-[#FD6842] flex-shrink-0">
                <Compass size={17} />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-xs sm:text-base font-semibold text-white truncate">
                  Peta Denah Benteng Fort Willem I
                </h3>
                <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#FD6842] truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FD6842] animate-ping flex-shrink-0" />
                  <span className="font-medium truncate">
                    Posisi Anda: Titik {currentCheckpoint.step} dari 13 ({currentCheckpoint.name})
                  </span>
                </div>
              </div>
            </div>

            {/* Switcher Tipe Peta: Peta Vektor vs Foto Maket Fisik */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center bg-[#131b13] p-0.5 sm:p-1 rounded-xl border border-[#232f23]">
                <button
                  onClick={() => setMapMode("vector")}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 sm:gap-1.5 transition-all ${
                    mapMode === "vector"
                      ? "bg-[#FD6842] text-white shadow-md font-bold"
                      : "text-[#8e998e] hover:text-white"
                  }`}
                  title="Peta Vektor Bersih & Mudah Dipahami"
                >
                  <Layers size={12} />
                  <span>Peta Vektor</span>
                </button>
                <button
                  onClick={() => setMapMode("photo")}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 sm:gap-1.5 transition-all ${
                    mapMode === "photo"
                      ? "bg-[#FD6842] text-white shadow-md font-bold"
                      : "text-[#8e998e] hover:text-white"
                  }`}
                  title="Foto Papan Maket Asli Benteng"
                >
                  <ImageIcon size={12} />
                  <span>Foto Maket</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[#141a14] border border-[#2a302a] text-[#8e998e] hover:text-white hover:border-[#FD6842] flex items-center justify-center transition-colors flex-shrink-0"
                title="Tutup Peta (ESC)"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Bilah 13 Titik Video Aktif (Bisa Scroll Mousewheel & Tombol Panah Navigasi untuk Laptop) */}
          <div className="relative bg-[#0e140e] border-b border-[#1c241c] flex items-center px-2 sm:px-4 py-2 flex-shrink-0 group">
            {/* Tombol Geser Kiri (Laptop) */}
            <button
              type="button"
              onClick={() => scrollCheckpoints('left')}
              className="hidden sm:flex w-7 h-7 rounded-lg bg-[#141b14] hover:bg-[#FD6842] hover:text-white border border-[#242f24] items-center justify-center text-[#8e998e] transition-colors flex-shrink-0 mr-1.5 shadow-md cursor-pointer"
              title="Geser titik jelajah ke kiri"
            >
              <ChevronLeft size={14} />
            </button>

            <div 
              ref={checkpointsScrollRef}
              onWheel={handleCheckpointsWheel}
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1 flex-1 cursor-grab select-none scrollbar-thin scrollbar-thumb-[#232f23] scrollbar-track-transparent hover:scrollbar-thumb-[#FD6842]/50"
              style={{ scrollBehavior: "smooth" }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FD6842] whitespace-nowrap mr-1 flex items-center gap-1 flex-shrink-0">
                <Sparkles size={11} /> 13 Titik Jelajah:
              </span>
              {tourCheckpoints.map((cp) => {
                const isCurrent = currentCheckpoint.id === cp.id;
                return (
                  <button
                    key={cp.id}
                    ref={isCurrent ? activeCpBtnRef : null}
                    onClick={() => handleJumpToVideo(cp.id)}
                    onMouseEnter={() => setHoveredCp(cp)}
                    onMouseLeave={() => setHoveredCp(null)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                      isCurrent
                        ? "bg-[#FD6842] text-white shadow-[0_0_15px_rgba(253,104,66,0.5)] ring-2 ring-white/70 font-bold scale-[1.02]"
                        : "bg-[#141b14] border border-[#242f24] text-[#a0aca0] hover:text-white hover:border-[#FD6842] hover:bg-[#1f281f]"
                    }`}
                    title={`Klik untuk langsung pindah ke ${cp.fullTitle}`}
                  >
                    {isCurrent ? (
                      <Check size={11} className="stroke-[3]" />
                    ) : (
                      <span className="opacity-60">{cp.step}.</span>
                    )}
                    <span>{cp.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Tombol Geser Kanan (Laptop) */}
            <button
              type="button"
              onClick={() => scrollCheckpoints('right')}
              className="hidden sm:flex w-7 h-7 rounded-lg bg-[#141b14] hover:bg-[#FD6842] hover:text-white border border-[#242f24] items-center justify-center text-[#8e998e] transition-colors flex-shrink-0 ml-1.5 shadow-md cursor-pointer"
              title="Geser titik jelajah ke kanan"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Area Konten Peta */}
          <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-[#070907] relative min-h-[320px]">
            {mapMode === "vector" ? (
              /* ============================================================== */
              /* PETA VEKTOR ARSITEKTUR BENTENG FORT WILLEM I (VIEWBOX 1000x650) */
              /* ============================================================== */
              <div 
                className="relative w-full max-w-[850px] mx-auto rounded-2xl overflow-hidden border border-[#232f23] shadow-2xl bg-[#080d08] select-none"
                style={{ aspectRatio: "1000 / 650" }}
              >
                <svg
                  className="w-full h-full block"
                  viewBox="0 0 1000 650"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    {/* Pola Garis Grid Arsitektur */}
                    <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    </pattern>

                    {/* Gradient Jalur Masuk */}
                    <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
                      <stop offset="100%" stopColor="#FD6842" stopOpacity="1" />
                    </linearGradient>

                    {/* Filter Glow Efek Cahaya */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Latar Belakang Kotak Grid Arsitektur */}
                  <rect width="1000" height="650" fill="#080c08" />
                  <rect width="1000" height="650" fill="url(#archGrid)" />

                  {/* ========================================================== */}
                  {/* ZONA AREA LANSEKAP & TAMAN                                 */}
                  {/* ========================================================== */}
                  {/* Area Rumput / Taman Luar Sisi Barat */}
                  <polygon
                    points="30,620 40,360 300,320 280,620"
                    fill="#0e170e"
                    stroke="#1a271a"
                    strokeWidth="1.5"
                  />
                  {/* Area Taman Makam & Monumen Jogonianfu */}
                  <polygon
                    points="270,180 430,180 440,40 270,40"
                    fill="#111c11"
                    stroke="#233523"
                    strokeWidth="1.5"
                  />
                  <text x="355" y="32" fill="#5a7a5a" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                    TAMAN MEMORIAL & PEMAKAMAN
                  </text>

                  {/* Pohon & Rindang Dekoratif di Sekitar Makam */}
                  <circle cx="300" cy="80" r="14" fill="#152615" stroke="#253a25" strokeWidth="1" />
                  <circle cx="410" cy="80" r="14" fill="#152615" stroke="#253a25" strokeWidth="1" />
                  <circle cx="310" cy="140" r="12" fill="#152615" stroke="#253a25" strokeWidth="1" />
                  <circle cx="420" cy="140" r="12" fill="#152615" stroke="#253a25" strokeWidth="1" />

                  {/* Area Parkir & Plaza Terbuka Depan Benteng */}
                  <polygon
                    points="440,460 520,320 540,550 440,550"
                    fill="#0d140d"
                    stroke="#192419"
                    strokeWidth="1"
                  />

                  {/* ========================================================== */}
                  {/* JALAN DAN JALUR PEDESTRIAN (CORRIDORS)                     */}
                  {/* ========================================================== */}
                  {/* Jalan Utama Masuk (Gerbang Luar -> Pos Tiket) */}
                  <path
                    d="M 40 595 L 120 525 L 180 470 L 240 415 L 300 360 L 360 340 L 440 340"
                    fill="none"
                    stroke="#182318"
                    strokeWidth="32"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 40 595 L 120 525 L 180 470 L 240 415 L 300 360 L 360 340 L 440 340"
                    fill="none"
                    stroke="#263626"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Jalan Akses Belok Kiri ke Makam Jogonianfu */}
                  <path
                    d="M 440 340 L 410 240 L 380 160 L 360 80"
                    fill="none"
                    stroke="#182318"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 440 340 L 410 240 L 380 160 L 360 80"
                    fill="none"
                    stroke="#223022"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Jalan Akses Lurus ke Ruang Maket & Kaponieri */}
                  <path
                    d="M 440 340 L 510 320 L 550 250 M 510 320 L 580 400"
                    fill="none"
                    stroke="#182318"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 440 340 L 510 320 L 550 250 M 510 320 L 580 400"
                    fill="none"
                    stroke="#223022"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* ========================================================== */}
                  {/* STRUKTUR ARSITEKTUR KOMPLEKS BENTENG FORT WILLEM I         */}
                  {/* ========================================================== */}
                  
                  {/* Tembok Pertahanan Luar (Outer Moat & Ramparts Pentagonal) */}
                  <polygon
                    points="520,490 530,160 640,130 920,130 960,330 950,530 640,530"
                    fill="#101810"
                    stroke="#2d3d2d"
                    strokeWidth="6"
                  />
                  <polygon
                    points="526,484 535,166 640,136 914,136 954,330 944,524 640,524"
                    fill="#0a0f0a"
                    stroke="#3f543f"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Bastion Timur Laut (Sudut Meriam Kanan Atas - Ruang #6) */}
                  <polygon
                    points="910,140 950,110 970,160 930,180"
                    fill="#182518"
                    stroke="#486148"
                    strokeWidth="2.5"
                  />
                  <text x="945" y="145" fill="#8e998e" fontSize="9" fontWeight="bold" textAnchor="middle">
                    BASTION TL
                  </text>

                  {/* Bastion Barat Laut (Sudut Meriam Kiri Bawah - Ruang #14) */}
                  <polygon
                    points="525,480 495,510 520,535 550,510"
                    fill="#182518"
                    stroke="#486148"
                    strokeWidth="2.5"
                  />
                  <text x="522" y="515" fill="#8e998e" fontSize="9" fontWeight="bold" textAnchor="middle">
                    BASTION BL
                  </text>

                  {/* Lapangan Utama / Courtyard Terbuka di Dalam Benteng */}
                  <rect
                    x="640"
                    y="220"
                    width="235"
                    height="205"
                    rx="8"
                    fill="#0e160e"
                    stroke="#263826"
                    strokeWidth="2"
                  />
                  {/* Grid Paving Lapangan Tengah */}
                  <rect
                    x="655"
                    y="235"
                    width="205"
                    height="175"
                    rx="6"
                    fill="#090f09"
                    stroke="#1c2b1c"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text x="757" y="325" fill="#3d523d" fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="2">
                    LAPANGAN UTAMA
                  </text>
                  <text x="757" y="342" fill="#2d3d2d" fontSize="9" textAnchor="middle">
                    PARADE GROUND BENTENG
                  </text>

                  {/* Sayap Utara: Lorong Barak Tamtama (Ruang #11) */}
                  <rect
                    x="640"
                    y="165"
                    width="235"
                    height="45"
                    rx="4"
                    fill="#162216"
                    stroke="#3b503b"
                    strokeWidth="2"
                  />
                  <text x="757" y="192" fill="#b8c5b8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    LORONG BARAK TAMTAMA (RUANG #11)
                  </text>

                  {/* Hall Penghubung dengan Jembatan Layang (Ruang #12) */}
                  <rect
                    x="715"
                    y="285"
                    width="85"
                    height="50"
                    rx="4"
                    fill="#1c2b1c"
                    stroke="#4e684e"
                    strokeWidth="1.5"
                  />
                  <line x1="715" y1="310" x2="800" y2="310" stroke="#FD6842" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="757" y="304" fill="#e2ede2" fontSize="9" fontWeight="bold" textAnchor="middle">
                    HALL JEMBATAN
                  </text>
                  <text x="757" y="326" fill="#8e998e" fontSize="8" textAnchor="middle">
                    (RUANG #12)
                  </text>

                  {/* Sayap Selatan: Rumah Perwira / Archaeological Park (Ruang #10) */}
                  <rect
                    x="780"
                    y="360"
                    width="95"
                    height="50"
                    rx="4"
                    fill="#152115"
                    stroke="#344834"
                    strokeWidth="1.5"
                  />
                  <text x="827" y="385" fill="#a4b5a4" fontSize="9" fontWeight="bold" textAnchor="middle">
                    RUMAH PERWIRA
                  </text>
                  <text x="827" y="399" fill="#718571" fontSize="8" textAnchor="middle">
                    PARK (RUANG #10)
                  </text>

                  {/* Dapur Garnisun / Mushola (Ruang #13) */}
                  <rect
                    x="615"
                    y="435"
                    width="65"
                    height="45"
                    rx="4"
                    fill="#141f14"
                    stroke="#314331"
                    strokeWidth="1.5"
                  />
                  <text x="647" y="457" fill="#9db09d" fontSize="9" fontWeight="bold" textAnchor="middle">
                    MUSHOLA
                  </text>
                  <text x="647" y="470" fill="#657765" fontSize="8" textAnchor="middle">
                    (RUANG #13)
                  </text>

                  {/* Sisi Timur: Main Gate & Sinema (Ruang #8) */}
                  <rect
                    x="925"
                    y="305"
                    width="32"
                    height="55"
                    rx="4"
                    fill="#192719"
                    stroke="#4c654c"
                    strokeWidth="2"
                  />
                  <text x="941" y="337" fill="#cad7ca" fontSize="8" fontWeight="bold" textAnchor="middle">
                    MAIN GATE
                  </text>

                  {/* Blok Timur Penjara (Ruang #7) */}
                  <rect
                    x="880"
                    y="215"
                    width="42"
                    height="55"
                    rx="3"
                    fill="#131e13"
                    stroke="#2e402e"
                    strokeWidth="1.5"
                  />
                  <text x="901" y="247" fill="#8e998e" fontSize="8" fontWeight="bold" textAnchor="middle">
                    BLOK R-7
                  </text>

                  {/* Penjara / Aviary (Ruang #9) */}
                  <rect
                    x="895"
                    y="465"
                    width="50"
                    height="55"
                    rx="4"
                    fill="#152115"
                    stroke="#3b4f3b"
                    strokeWidth="1.5"
                  />
                  <text x="920" y="492" fill="#a4b5a4" fontSize="8" fontWeight="bold" textAnchor="middle">
                    AVIARY
                  </text>
                  <text x="920" y="505" fill="#728472" fontSize="7" textAnchor="middle">
                    (RUANG #9)
                  </text>

                  {/* Paardenstal / Kandang Kuda (Ruang #5 - Luar Sisi Utara) */}
                  <rect
                    x="640"
                    y="70"
                    width="110"
                    height="38"
                    rx="4"
                    fill="#141f14"
                    stroke="#324532"
                    strokeWidth="1.5"
                  />
                  <text x="695" y="93" fill="#9db09d" fontSize="9" fontWeight="bold" textAnchor="middle">
                    PAARDENSTAL (RUANG #5)
                  </text>

                  {/* ========================================================== */}
                  {/* BANGUNAN INTINYA RUTE TOUR AKTIF                           */}
                  {/* ========================================================== */}

                  {/* Paviliun Ruang Literasi & Maket 3D (Ruang #15 - AKTIF) */}
                  <rect
                    x="510"
                    y="215"
                    width="85"
                    height="65"
                    rx="6"
                    fill="#182c1b"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-[#1f3823] transition-colors"
                    onClick={() => handleJumpToVideo("r04-miniatur-denah")}
                  />
                  <rect x="520" y="225" width="65" height="45" rx="3" fill="#0f1f13" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="552" y="243" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                    RUANG MAKET
                  </text>
                  <text x="552" y="258" fill="#10b981" fontSize="8" textAnchor="middle">
                    LITERASI (#15)
                  </text>

                  {/* Bangunan Sayap Kaponieri — Makutoromo (Ruang #16 - AKTIF) */}
                  <rect
                    x="545"
                    y="365"
                    width="80"
                    height="70"
                    rx="6"
                    fill="#182c1b"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-[#1f3823] transition-colors"
                    onClick={() => handleJumpToVideo("r05-lanjut-dari-miniatur")}
                  />
                  <text x="585" y="397" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                    KAPONIERI
                  </text>
                  <text x="585" y="412" fill="#10b981" fontSize="8" textAnchor="middle">
                    SUVスNIR (#16)
                  </text>

                  {/* Pendopo Makam & Monumen Jogonianfu (Ruang #4 - AKTIF) */}
                  <rect
                    x="320"
                    y="50"
                    width="85"
                    height="60"
                    rx="6"
                    fill="#182c1b"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-[#1f3823] transition-colors"
                    onClick={() => handleJumpToVideo("r08-pemakaman")}
                  />
                  {/* Simbol Atap Joglo Tumpuk Tradisional */}
                  <polygon points="362,55 330,75 395,75" fill="#243d28" />
                  <polygon points="362,72 325,102 400,102" fill="#1b2f1f" />
                  <text x="362" y="92" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
                    MONUMEN & MAKAM
                  </text>
                  <text x="362" y="104" fill="#10b981" fontSize="8" textAnchor="middle">
                    JOGONIANFU (#4)
                  </text>

                  {/* Pos Tiket / Checker Gate (Ruang #2 - AKTIF) */}
                  <rect
                    x="290"
                    y="325"
                    width="48"
                    height="45"
                    rx="5"
                    fill="#182c1b"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-[#1f3823] transition-colors"
                    onClick={() => handleJumpToVideo("r02-checker-gate")}
                  />
                  <text x="314" y="348" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">
                    CHECKER
                  </text>
                  <text x="314" y="360" fill="#10b981" fontSize="8" textAnchor="middle">
                    GATE (#2)
                  </text>

                  {/* Perempatan Pertama (Ruang #3 - AKTIF) */}
                  <circle
                    cx="440"
                    cy="330"
                    r="24"
                    fill="#182c1b"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-[#1f3823] transition-colors"
                    onClick={() => handleJumpToVideo("r03-perempatan-pertama")}
                  />
                  <text x="440" y="328" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">
                    PEREMPATAN
                  </text>
                  <text x="440" y="340" fill="#10b981" fontSize="8" textAnchor="middle">
                    UTAMA (#3)
                  </text>

                  {/* Gerbang Luar Utama (Ruang #1 - AKTIF) */}
                  <rect
                    x="50"
                    y="550"
                    width="44"
                    height="40"
                    rx="4"
                    fill="#182c1b"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-[#1f3823] transition-colors"
                    onClick={() => handleJumpToVideo("r01-gerbang")}
                  />
                  <text x="72" y="572" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">
                    GERBANG
                  </text>
                  <text x="72" y="583" fill="#10b981" fontSize="7" textAnchor="middle">
                    LUAR (#1)
                  </text>

                  {/* ========================================================== */}
                  {/* GARIS RUTE PERJALANAN 13 CHECKPOINT                        */}
                  {/* ========================================================== */}

                  {/* Jalur Masuk: Titik 1 -> 6 -> 7 */}
                  <path
                    d="M 70 570 L 130 515 L 190 460 L 250 405 L 310 350 L 370 330 L 440 330"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    filter="url(#glow)"
                  />
                  {/* Cabang Lurus: Titik 7 -> 8 -> 9 & 8 -> 10 */}
                  <path
                    d="M 440 330 L 510 310 L 550 250"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    filter="url(#glow)"
                  />
                  <path
                    d="M 510 310 L 580 400"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    filter="url(#glow)"
                  />
                  {/* Cabang Belok Kiri: Titik 7 -> 11 -> 12 -> 13 */}
                  <path
                    d="M 440 330 L 410 240 L 380 160 L 360 80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    filter="url(#glow)"
                  />

                  {/* ========================================================== */}
                  {/* PIN TITIK CHECKPOINT 1 S.D. 13 (INTERAKTIF LANGSUNG PINDAH) */}
                  {/* ========================================================== */}
                  {tourCheckpoints.map((cp) => {
                    const isCurrent = currentCheckpoint.id === cp.id;
                    const isHovered = hoveredCp?.id === cp.id;

                    return (
                      <g
                        key={cp.id}
                        className="cursor-pointer"
                        onClick={() => handleJumpToVideo(cp.id)}
                        onMouseEnter={() => setHoveredCp(cp)}
                        onMouseLeave={() => setHoveredCp(null)}
                      >
                        {/* Lingkaran Luar Berkedip / Ping jika Aktif */}
                        {isCurrent && (
                          <>
                            <circle
                              cx={cp.vx}
                              cy={cp.vy}
                              r="18"
                              fill="none"
                              stroke="#FD6842"
                              strokeWidth="2"
                              className="animate-ping opacity-60"
                            />
                            <circle
                              cx={cp.vx}
                              cy={cp.vy}
                              r="14"
                              fill="#FD6842"
                              fillOpacity="0.25"
                            />
                          </>
                        )}

                        {/* Lingkaran Inti Node */}
                        <circle
                          cx={cp.vx}
                          cy={cp.vy}
                          r={isCurrent ? "12" : isHovered ? "11" : "9"}
                          fill={isCurrent ? "#FD6842" : "#10b981"}
                          stroke="#FFFFFF"
                          strokeWidth={isCurrent ? "2.5" : "1.8"}
                          filter={isCurrent ? "url(#glow)" : undefined}
                          className="transition-all duration-200"
                        />

                        {/* Angka Langkah Checkpoint 1 - 13 */}
                        <text
                          x={cp.vx}
                          y={cp.vy + 3.5}
                          fill="#FFFFFF"
                          fontSize={isCurrent ? "10" : "8.5"}
                          fontWeight="bold"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {cp.step}
                        </text>

                        {/* Label Badge "POSISI ANDA" Mengambang */}
                        {isCurrent && (
                          <g pointerEvents="none">
                            <rect
                              x={cp.vx - 36}
                              y={cp.vy - 28}
                              width="72"
                              height="16"
                              rx="4"
                              fill="#0a0d0a"
                              stroke="#FD6842"
                              strokeWidth="1.2"
                            />
                            <text
                              x={cp.vx}
                              y={cp.vy - 16}
                              fill="#FD6842"
                              fontSize="8"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              POSISI ANDA
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Kompas Mata Angin & Skala Arsitektur */}
                  <g transform="translate(930, 45)">
                    <circle cx="0" cy="0" r="18" fill="#0c120c" stroke="#253525" strokeWidth="1.5" />
                    <line x1="0" y1="12" x2="0" y2="-12" stroke="#486048" strokeWidth="1.5" />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#486048" strokeWidth="1.5" />
                    <polygon points="0,-16 -4,-4 4,-4" fill="#FD6842" />
                    <text x="0" y="-20" fill="#FD6842" fontSize="9" fontWeight="black" textAnchor="middle">
                      U
                    </text>
                  </g>

                  {/* Legenda Peta Vektor */}
                  <g transform="translate(30, 30)">
                    <rect x="0" y="0" width="180" height="65" rx="6" fill="#080c08" stroke="#1d291d" strokeWidth="1" fillOpacity="0.9" />
                    <circle cx="15" cy="18" r="5" fill="#FD6842" />
                    <text x="28" y="21" fill="#FFFFFF" fontSize="9" fontWeight="bold">Posisi Saat Ini</text>
                    
                    <circle cx="15" cy="36" r="5" fill="#10b981" />
                    <text x="28" y="39" fill="#b0c0b0" fontSize="9">Titik 360 Aktif (1-13)</text>
                    
                    <rect x="10" y="47" width="10" height="10" rx="2" fill="#182c1b" stroke="#10b981" strokeWidth="1" />
                    <text x="28" y="56" fill="#b0c0b0" fontSize="9">Zona Ruangan Benteng</text>
                  </g>
                </svg>
              </div>
            ) : (
              /* ============================================================== */
              /* FOTO PAPAN MAKET ASLI BENTENG WILLEM I (DENAH-BENTENG.JPG)     */
              /* ============================================================== */
              <div 
                className="relative mx-auto rounded-xl overflow-hidden border border-[#232b23] shadow-2xl bg-[#090d09] select-none"
                style={{
                  aspectRatio: "576 / 1024",
                  maxHeight: "min(58vh, 560px)",
                  width: "auto"
                }}
              >
                {/* Gambar Maket Asli Utuh */}
                <img
                  src="/gambar/denah-benteng.jpg"
                  alt="Denah Maket Benteng Fort Willem I"
                  className="w-full h-full object-contain pointer-events-none filter brightness-[0.96] contrast-[1.04]"
                />

                {/* Garis Rute Halus Antara Titik-Titik Video */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Rute Masuk: Titik 1 -> 6 -> 7 */}
                  <path
                    d="M 13.1 19.9 L 11.2 22.8 L 8.8 25.5 L 6.2 28.0 L 3.5 30.2 L 5.8 33.2 L 10.7 33.2"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    strokeDasharray="2 1.5"
                    className="opacity-80"
                  />
                  {/* Cabang Lurus: Titik 7 -> 8 -> 9 -> 10 */}
                  <path
                    d="M 10.7 33.2 L 14.5 34.8 L 19.6 36.2 L 23.5 36.8"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    strokeDasharray="2 1.5"
                    className="opacity-80"
                  />
                  {/* Cabang Kiri: Titik 7 -> 11 -> 12 -> 13 */}
                  <path
                    d="M 10.7 33.2 L 14.8 31.8 L 17.5 31.0 L 19.9 30.5"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    strokeDasharray="2 1.5"
                    className="opacity-80"
                  />
                </svg>

                {/* Waypoint 13 Checkpoint Video pada Foto Maket */}
                {tourCheckpoints.map((cp) => {
                  const isCurrent = currentCheckpoint.id === cp.id;
                  return (
                    <button
                      key={cp.id}
                      onClick={() => handleJumpToVideo(cp.id)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center transition-all cursor-pointer ${
                        isCurrent
                          ? "w-7 h-7 rounded-full bg-[#FD6842] text-white shadow-[0_0_18px_#FD6842] ring-4 ring-white scale-110 z-40"
                          : "w-5 h-5 rounded-full bg-[#10b981] hover:bg-[#34d399] text-white shadow-md ring-1 ring-white/60 hover:scale-125"
                      }`}
                      style={{ left: `${cp.photoX}%`, top: `${cp.photoY}%` }}
                      title={`Titik ${cp.step}: ${cp.name} (Klik untuk langsung pindah)`}
                    >
                      {isCurrent && (
                        <span className="absolute -inset-2 rounded-full bg-[#FD6842]/50 animate-ping pointer-events-none" />
                      )}
                      <span className="text-[9px] font-black">{cp.step}</span>

                      {/* Label Teks Mengambang di Titik Aktif */}
                      {isCurrent && (
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0a0d0a]/95 text-[#FD6842] text-[8px] font-bold px-1.5 py-0.5 rounded border border-[#FD6842]/50 shadow-lg pointer-events-none">
                          POSISI ANDA
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Bar: Informasi Titik Terpilih / Ruangan */}
          <div className="px-3 sm:px-6 py-2.5 bg-[#080c08] border-t border-[#1c241c] flex items-center justify-between gap-3 flex-shrink-0">
            {selectedRoom && selectedRoom.status === "upcoming" ? (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] uppercase font-bold text-[#FD6842] tracking-wider">
                    Ruangan #{selectedRoom.number}: {selectedRoom.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1">
                    <AlertCircle size={10} /> Tahap Rekaman Selanjutnya
                  </span>
                </div>
                <p className="text-[11px] text-[#8e998e] truncate max-w-sm sm:max-w-md">
                  {selectedRoom.description}
                </p>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] uppercase font-bold text-[#FD6842] tracking-wider">
                    Titik {currentCheckpoint.step} dari 13: {currentCheckpoint.fullTitle}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1">
                    <Check size={10} /> Video 360 Aktif
                  </span>
                </div>
                <p className="text-[11px] text-[#8e998e] truncate max-w-sm sm:max-w-md">
                  {currentCheckpoint.desc}
                </p>
              </div>
            )}

            {/* Tombol Aksi Bersih & Jelas */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {selectedRoom && selectedRoom.status === "upcoming" ? (
                <>
                  <button
                    disabled
                    className="py-1.5 px-3 rounded-lg bg-[#141b14] border border-[#232d23] text-[#718071] text-[11px] font-medium whitespace-nowrap cursor-not-allowed flex items-center gap-1.5"
                    title="Video untuk ruangan ini belum tersedia"
                  >
                    <span>Video Belum Ada</span>
                  </button>
                  <button
                    onClick={() => handleJumpToVideo(currentCheckpoint.id)}
                    className="py-1.5 px-3.5 rounded-lg bg-[#FD6842] hover:bg-[#e05835] text-white text-[11px] font-semibold whitespace-nowrap transition-all shadow-md flex items-center gap-1"
                  >
                    <span>Lanjut Tur</span>
                    <ArrowRight size={12} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleJumpToVideo(currentCheckpoint.id)}
                  className="py-1.5 px-3.5 rounded-lg bg-[#FD6842] hover:bg-[#e05835] text-white text-[11px] font-semibold whitespace-nowrap transition-all shadow-md flex items-center gap-1.5"
                >
                  <Video size={13} />
                  <span>Jelajahi Titik Ini</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}