"use client";
import { Compass, Info, Map, Image as ImageIcon, Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onMenuClick: (menu: string) => void; };

export default function Navbar({ onMenuClick }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { name: "Jelajah 360", icon: <Compass size={14} /> },
    { name: "Sejarah", icon: <Info size={14} /> },
    { name: "Peta & Rute", icon: <Map size={14} /> },
    { name: "Galeri", icon: <ImageIcon size={14} /> },
  ];

  const handleMenuClick = (name: string) => {
    setIsOpen(false);
    onMenuClick(name);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-40 bg-gradient-to-b from-[#050705] via-[#050705]/80 to-transparent pointer-events-none z-30"></div>

      <nav className="w-full flex justify-between items-start pt-6 px-6 sm:px-12 relative z-50">
        <Link href="/">
          <div className="flex flex-col cursor-pointer group">
            <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-widest text-history-seashell uppercase drop-shadow-2xl group-hover:text-white transition-colors">
              Jelajah<span className="text-history-marigold font-light group-hover:text-[#ff8059] transition-colors">Virtual ID</span>
            </h1>
            <p className="text-[8px] sm:text-[9px] tracking-[0.4em] text-history-seashell/50 uppercase mt-2 group-hover:text-history-seashell/80 transition-colors">
              Benteng Fort Willem I
            </p>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <ul className="hidden sm:flex items-center gap-10 mt-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button 
                onClick={() => handleMenuClick(item.name)}
                className="relative flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase font-medium text-[#8e998e] hover:text-history-marigold transition-all group overflow-hidden py-1"
              >
                <span className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">{item.icon}</span>
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-history-marigold transform -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
              </button>
            </li>
          ))}
        </ul>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button 
          onClick={() => setIsOpen(true)} 
          className="sm:hidden text-white hover:text-history-marigold mt-2 z-50 transition-transform active:scale-90"
        >
          <Menu size={32} />
        </button>
      </nav>

      {/* Mobile Menu Fullscreen Drawer (Inspirasi Nakula) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#0c0f0c] pointer-events-auto flex flex-col overflow-y-auto"
          >
            {/* Header Menu */}
            <div className="flex justify-between items-center px-6 py-6 border-b border-[#1a201a]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FD6842]"></div>
                <span className="text-[#a0aab0] text-xs font-semibold tracking-widest uppercase">Menu</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-3 border border-[#2a302a] rounded-full text-[#a0aab0] hover:text-white hover:border-[#FD6842] transition-colors"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Nav Items List */}
            <div className="flex-1 px-6 pt-6 flex flex-col">
              {menuItems.map((item) => (
                <button 
                  key={item.name}
                  onClick={() => handleMenuClick(item.name)}
                  className="group text-left py-7 border-b border-[#1a201a] flex items-center justify-between"
                >
                  <span className="font-sans font-black text-4xl sm:text-5xl uppercase tracking-tighter text-[#e8ebe8] group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                  <div className="w-2.5 h-2.5 bg-[#FD6842] opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-4 group-hover:translate-x-0 duration-300"></div>
                </button>
              ))}
            </div>

            {/* Footer Menu Info */}
            <div className="px-6 pb-12 pt-8 flex flex-col gap-8">
              <div>
                <p className="text-[#5a6a5a] text-[10px] font-medium tracking-[0.2em] mb-2">(EMAIL)</p>
                <p className="text-[#FD6842] text-sm tracking-wide font-medium">hello@jelajahvirtual.id</p>
              </div>
              
              <div className="flex justify-between max-w-[200px]">
                <div className="flex flex-col gap-3">
                  <p className="text-[#5a6a5a] text-[10px] font-medium tracking-[0.2em] mb-1">(SOCIALS)</p>
                  <a href="#" className="text-[#a0aab0] hover:text-white transition-colors text-xs flex items-center gap-1">Instagram <ArrowUpRight size={12} className="text-[#5a6a5a]"/></a>
                  <a href="#" className="text-[#a0aab0] hover:text-white transition-colors text-xs flex items-center gap-1">YouTube <ArrowUpRight size={12} className="text-[#5a6a5a]"/></a>
                </div>
                <div className="flex flex-col gap-3 justify-end pt-5">
                  <a href="#" className="text-[#a0aab0] hover:text-white transition-colors text-xs flex items-center gap-1">Twitter <ArrowUpRight size={12} className="text-[#5a6a5a]"/></a>
                  <a href="#" className="text-[#a0aab0] hover:text-white transition-colors text-xs flex items-center gap-1">LinkedIn <ArrowUpRight size={12} className="text-[#5a6a5a]"/></a>
                </div>
              </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
