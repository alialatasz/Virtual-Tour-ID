"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface GyroToggleProps {
  isOn: boolean;
  onToggle: () => void;
  className?: string;
}

export function GyroToggle({ isOn, onToggle, className }: GyroToggleProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    // Gunakan Web Audio API untuk playback tanpa delay (Zero Latency)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass();
      
      // Fetch file ke RAM agar bisa diputar instan
      fetch('/audio/suara-tombol-gyro.m4a')
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => audioContextRef.current!.decodeAudioData(arrayBuffer))
        .then(decodedBuffer => {
          audioBufferRef.current = decodedBuffer;
        })
        .catch(err => console.error("Gagal meload audio:", err));
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleToggleClick = () => {
    if (audioContextRef.current && audioBufferRef.current) {
      // Pastikan context tidak di-suspend oleh browser
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Buat node sumber baru setiap kali klik (wajib untuk Web Audio API)
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    }
    
    onToggle();
  };

  return (
    <div className={className || "absolute top-24 left-4 sm:top-28 sm:left-8 z-[50] pointer-events-auto flex flex-col items-center gap-2"}>
      <div
        onClick={handleToggleClick}
        className="bg-[#0a0d0a]/90 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-3 rounded-md border border-[#2a302a] shadow-2xl flex items-center gap-3 cursor-pointer group w-full justify-center"
        style={{
          backgroundImage: "url('/gambar/button-pattern.png')", // Ganti sesuai nama file foto
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span
          className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
            !isOn ? "text-[#e8ebe8]" : "text-[#4a504a]"
          }`}
        >
          OFF
        </span>

        <div
          className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-sm p-1 transition-colors duration-500 ease-in-out flex items-center ${
            isOn ? "bg-[#FD6842] justify-end" : "bg-[#1a201a] justify-start"
          }`}
          style={{
            boxShadow: isOn
              ? "inset 0 2px 4px rgba(0,0,0,0.3), 0 0 15px rgba(253,104,66,0.3)"
              : "inset 0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <motion.div
            layout
            className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-sm flex items-center justify-center overflow-hidden"
            initial={false}
            animate={{
              backgroundColor: isOn ? "#ff9253" : "#4a504a",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            style={{
              boxShadow: isOn
                ? "0 0 10px rgba(253,104,66,0.8), inset 0 2px 2px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.2)"
                : "0 2px 4px rgba(0,0,0,0.4), inset 0 2px 2px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {/* 3D Glass Highlight */}
            <div className="absolute top-[10%] left-[20%] w-[40%] h-[30%] bg-white/40 rounded-sm blur-[1px]"></div>
          </motion.div>
        </div>

        <span
          className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
            isOn ? "text-[#FD6842]" : "text-[#4a504a]"
          }`}
          style={{
            textShadow: isOn ? "0 0 10px rgba(253,104,66,0.5)" : "none",
          }}
        >
          ON
        </span>
      </div>

      <div
        className="text-[9px] text-white uppercase tracking-[0.3em] font-bold whitespace-nowrap text-center w-full"
        style={{
          textShadow:
            "1px 1px 3px rgba(0,0,0,0.9), 0px 0px 6px rgba(0,0,0,0.8)",
        }}
      >
        Mode Gyro
      </div>
    </div>
  );
}
