"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Map, Compass } from "lucide-react";
import { getHeritageSites, HeritageSite } from "@/lib/tourData";
import { ShinyButton } from "@/components/ui/shiny-button";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Cek apakah user sudah pernah melihat splash screen di sesi ini
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("hasSeenIntro")
    ) {
      setShowIntro(false);
    }
    getHeritageSites().then((data) => setSites(data));
  }, []);

  const handleStart = () => {
    setShowIntro(false);
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  const filteredSites = sites.filter((site) => {
    const matchCategory = activeTab === "Semua" || site.category === activeTab;
    const matchSearch =
      site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <main className="relative min-h-screen text-[#fcf4ea] font-sans overflow-x-hidden selection:bg-[#FD6842] selection:text-white">
      {/* ---------------------------------------------------------------- */}
      {/* 1. SPLASH SCREEN (Tampil Paling Awal) */}
      {/* ---------------------------------------------------------------- */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050705] overflow-hidden"
          >
            <motion.img
              initial={{ scale: 1 }}
              animate={{ scale: 1.15 }}
              transition={{ duration: 25, ease: "linear" }}
              src="/gambar/splash-screen.jpg"
              alt="Background Splash"
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050705]/80 via-transparent to-[#050705]/95 pointer-events-none"></div>

            <div className="relative z-30 flex flex-col items-center text-center px-4 w-full max-w-5xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="flex items-center gap-4 mb-8 sm:mb-12"
              >
                <div className="h-[1px] w-8 sm:w-16 bg-[#4a504a]"></div>
                <span className="text-[#8e998e] text-[10px] sm:text-xs tracking-[0.5em]">
                  EST. 2026
                </span>
                <div className="h-[1px] w-8 sm:w-16 bg-[#4a504a]"></div>
              </motion.div>
              <motion.h1
                initial={{ y: 30, opacity: 0, filter: "blur(12px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 1, duration: 2, ease: "easeOut" }}
                className="font-serif font-medium text-5xl sm:text-7xl md:text-[8rem] text-[#e8ebe8] tracking-wide uppercase leading-[0.9] sm:leading-[0.85]"
              >
                Jelajah
                <br />
                <span className="text-[#AA2B1D]">Virtual ID</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1.5 }}
                className="mt-10 sm:mt-12 text-[#8e998e] font-light text-[10px] sm:text-xs md:text-sm tracking-[0.6em] sm:tracking-[0.8em] uppercase max-w-2xl"
              >
                Rumah Warisan Cagar Budaya Indonesia
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1.5 }}
                className="mt-16 sm:mt-24"
              >
                <ShinyButton
                  label="MULAI JELAJAH"
                  onClick={handleStart}
                  fillColor="#050705"
                  accentColor="#AA2B1D"
                  accentSoftColor="#dab59f"
                  className="font-glacial"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ---------------------------------------------------------------- */}

      {/* 2. HALAMAN HOME / PORTAL (Muncul setelah Splash Screen) */}
      <div
        className={`transition-opacity duration-1000 relative ${showIntro ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}
      >
        {/* BACKGROUND COLLAGE */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050705]">
          <div className="absolute inset-0 flex grayscale scale-105 opacity-[0.25]">
            {sites.slice(0, 4).map((site, i) => (
              <img
                key={i}
                src={site.thumbnail}
                className="w-1/4 h-full object-cover"
                alt=""
              />
            ))}
          </div>
          {/* Overlay gelap gradasi agar teks tetap terbaca jelas */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050705]/50 via-[#050705]/80 to-[#050705]"></div>
        </div>
        <nav className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 md:px-12 border-b border-[#1a201a] z-50 bg-[#050705]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FD6842] rounded-lg flex items-center justify-center">
              <Compass className="text-white w-5 h-5" />
            </div>
            <strong className="font-serif text-xl tracking-wide">
              Jelajah Virtual ID
            </strong>
          </div>
          <div className="hidden md:flex gap-8 text-[#8e998e] text-xs font-semibold uppercase tracking-widest">
            <span className="text-[#FD6842] cursor-pointer">Katalog Area</span>
            <span className="cursor-pointer hover:text-white transition">
              Peta Interaktif
            </span>
            <span className="cursor-pointer hover:text-white transition">
              Tentang Kami
            </span>
          </div>
        </nav>
        <section className="relative pt-40 pb-20 px-6 md:px-12 z-10 flex flex-col items-center text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 text-[#e8ebe8]">
            Katalog Cagar Budaya
          </h1>
          <p className="text-[#8e998e] max-w-2xl text-sm md:text-base leading-relaxed mb-12">
            Pilih destinasi sejarah Anda di bawah ini dan mulailah perjalanan
            melintasi waktu.
          </p>

          <div className="flex flex-col items-center gap-6 mb-16 w-full max-w-5xl mx-auto px-4 md:px-0">
            {/* Kotak Pencarian - Ditaruh di tengah atas */}
            <div className="w-full md:max-w-md relative flex-shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a6a5a] w-4 h-4" />
              <input
                type="text"
                placeholder="Cari cagar budaya..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-[#101410] border border-[#2a302a] rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:border-[#FD6842] transition-colors text-white placeholder-[#5a6a5a]"
              />
            </div>

            {/* Tab Kategori - Punya baris sendiri di bawah pencarian agar bebas memanjang */}
            <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar justify-start md:justify-center w-full">
              {[
                "Semua",
                "Benteng",
                "Candi",
                "Keraton",
                "Gedung",
                "Kelenteng",
                "Vihara",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === tab ? "bg-[#FD6842] text-white shadow-lg shadow-[#FD6842]/20" : "bg-[#101410] text-[#5a6a5a] border border-[#2a302a] hover:text-[#8e998e] hover:border-[#4a504a]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="px-6 md:px-12 pb-32 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#2a302a] to-transparent"></div>
            <span className="text-[#8e998e] text-xs font-bold uppercase tracking-[0.3em]">
              Koleksi Cagar Budaya
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#2a302a] to-transparent"></div>
          </div>

          <div className="flex flex-col gap-12 md:gap-16">
            {filteredSites.map((site) => (
              <div key={site.id} className="w-full">
                {site.isAvailable ? (
                  <Link href={`/tour/${site.id}`} className="block group">
                    <div className="bg-[#0a0d0a]/90 backdrop-blur-md border border-[#2a302a] rounded-[2rem] overflow-hidden transition-all duration-500 group-hover:border-[#FD6842]/50 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(253,104,66,0.15)] flex flex-col md:flex-row h-auto md:h-[400px]">
                      {/* Bagian Gambar */}
                      <div className="w-full md:w-[55%] h-64 md:h-full relative overflow-hidden flex-shrink-0">
                        {/* Gradient disesuaikan: bawah ke atas di HP, kanan ke kiri di Laptop */}
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#0a0d0a]/90 md:from-[#0a0d0a] via-transparent to-transparent z-10"></div>
                        <img
                          src={site.thumbnail}
                          alt={site.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute top-6 left-6 z-20">
                          <span className="bg-[#FD6842] text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#FD6842]/30">
                            {site.category}
                          </span>
                        </div>
                      </div>

                      {/* Bagian Konten Text */}
                      <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center relative z-20">
                        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 group-hover:text-[#FD6842] transition-colors leading-tight">
                          {site.title}
                        </h3>
                        <p className="text-[#8e998e] text-sm md:text-base flex items-center gap-2 mb-8 md:mb-12">
                          <Map className="w-4 h-4 text-[#FD6842]" />{" "}
                          {site.location}
                        </p>
                        <div className="w-full md:w-max px-8 py-4 text-center bg-[#101410] border border-[#2a302a] text-[#e8ebe8] group-hover:bg-[#FD6842] group-hover:text-white group-hover:border-[#FD6842] transition-all duration-300 text-xs font-bold tracking-widest rounded-xl shadow-xl">
                          MULAI VIRTUAL TOUR
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="block group opacity-70 cursor-not-allowed">
                    <div className="bg-[#0a0d0a]/80 backdrop-blur-md border border-[#1a1f1a] rounded-[2rem] overflow-hidden flex flex-col md:flex-row h-auto md:h-[400px]">
                      <div className="w-full md:w-[55%] h-64 md:h-full relative overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#0a0d0a] via-[#0a0d0a]/60 to-[#0a0d0a]/30 z-10"></div>
                        <img
                          src={site.thumbnail}
                          alt={site.title}
                          className="w-full h-full object-cover grayscale opacity-50"
                        />
                        <div className="absolute top-6 left-6 z-20">
                          <span className="bg-[#1a1f1a] text-[#5a6a5a] border border-[#2a302a] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {site.category}
                          </span>
                        </div>
                      </div>

                      <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center relative z-20">
                        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 text-[#5a6a5a] leading-tight">
                          {site.title}
                        </h3>
                        <p className="text-[#3a453a] text-sm md:text-base flex items-center gap-2 mb-8 md:mb-12">
                          <Map className="w-4 h-4 text-[#3a453a]" />{" "}
                          {site.location}
                        </p>
                        <div className="w-full md:w-max px-8 py-4 text-center bg-[#0a0d0a] border border-[#1a1f1a] text-[#3a453a] transition-all duration-300 text-xs font-bold tracking-widest rounded-xl">
                          SEGERA HADIR
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
