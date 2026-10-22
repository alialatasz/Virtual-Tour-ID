"use client";

import { useEffect, useState, useRef } from "react";
import { SceneData } from "@/lib/tourData";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    AFRAME?: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface Props {
  scene: SceneData;
  onSceneChange?: (sceneId: string) => void;
  onHotspotClick?: (id: string, tab: 'history'|'current') => void;
}

const getScenePlaceholder = (scene: SceneData) => {
  const map: Record<string, string> = {
    "r01-gerbang": "/gambar/thumb-r01-gerbang-1.jpg",
    "r01-gerbang-2": "/gambar/thumb-r01-gerbang-2.jpg",
    "r01-gerbang-3": "/gambar/thumb-r01-gerbang-3.jpg",
    "r01-gerbang-4": "/gambar/thumb-r01-gerbang-4.jpg",
    "r02-checker-gate": "/gambar/thumb-r02-checker-gate-1.jpg",
    "r02-checker-gate-2": "/gambar/thumb-r02-checker-gate-2.jpg",
    "r03-perempatan-pertama": "/gambar/thumb-r03-perempatan.jpg",
    "r03-lanjut-maju": "/gambar/thumb-r03-lanjut-maju.jpg",
    "r04-miniatur-denah": "/gambar/thumb-r04-miniatur.jpg",
    "r05-lanjut-dari-miniatur": "/gambar/thumb-r05-lanjut-miniatur.jpg",
    "r06-belok-kiri": "/gambar/thumb-r06-belok-kiri.jpg",
    "r07-menuju-pemakaman": "/gambar/thumb-r07-menuju-makam.jpg",
    "r08-pemakaman": "/gambar/thumb-r08-pemakaman.jpg",
    "lapangan-utama": "/gambar/thumb-r01-gerbang-1.jpg",
  };
  return map[scene.id] || scene.imgAfter || "/gambar/thumb-r01-gerbang-1.jpg";
};

export default function AFrameViewer({ scene, onSceneChange, onHotspotClick }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onSceneChangeRef = useRef(onSceneChange);

  const placeholderSrc = getScenePlaceholder(scene);

  useEffect(() => {
    setIsVideoPlaying(false);
    setIsBuffering(true);
  }, [scene.id, scene.mediaUrl]);

  useEffect(() => {
    onSceneChangeRef.current = onSceneChange;
  }, [onSceneChange]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      require("aframe");
      
      // Mendaftarkan komponen klik khusus untuk Next.js agar bisa komunikasi dengan React State
      if (typeof window.AFRAME !== 'undefined' && !window.AFRAME.components['cursor-listener']) {
        window.AFRAME.registerComponent('cursor-listener', {
          init: function () {
            const handleAction = () => {
              const target = this.el.getAttribute('data-target');
              if (target && onSceneChangeRef.current) {
                // Efek Google Street View: Kamera meluncur maju ke depan
                const camera = document.querySelector('a-camera');
                if (camera) {
                  camera.setAttribute('animation__rush', 'property: position; to: 0 0 -2.5; dur: 400; easing: easeInQuad');
                }
                onSceneChangeRef.current(target);
              }
            };

            this.el.addEventListener('click', handleAction);
            // Efek hover (kursor tangan)
            this.el.addEventListener('mouseenter', () => {
              document.body.style.cursor = 'pointer';
            });
            this.el.addEventListener('mouseleave', () => {
              document.body.style.cursor = 'default';
            });
          }
        });
      }

      // Mendaftarkan kontrol rotasi keyboard agar tombol panah keyboard memutar pandangan (bukan menggeser posisi)
      if (typeof window.AFRAME !== 'undefined' && !window.AFRAME.components['keyboard-rotate']) {
        window.AFRAME.registerComponent('keyboard-rotate', {
          init: function () {
            this.onKeyDown = (e: KeyboardEvent) => {
              if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                const lookControls = (this as any).el.components['look-controls'];
                if (lookControls && lookControls.yawObject && lookControls.pitchObject) {
                  const rotSpeed = 0.06; // Kecepatan rotasi sudut
                  if (e.key === 'ArrowLeft') {
                    lookControls.yawObject.rotation.y += rotSpeed;
                  } else if (e.key === 'ArrowRight') {
                    lookControls.yawObject.rotation.y -= rotSpeed;
                  } else if (e.key === 'ArrowUp') {
                    lookControls.pitchObject.rotation.x = Math.min(lookControls.pitchObject.rotation.x + rotSpeed, Math.PI / 2.2);
                  } else if (e.key === 'ArrowDown') {
                    lookControls.pitchObject.rotation.x = Math.max(lookControls.pitchObject.rotation.x - rotSpeed, -Math.PI / 2.2);
                  }
                }
              }
            };
            window.addEventListener('keydown', this.onKeyDown);
          },
          remove: function () {
            if (this.onKeyDown) {
              window.removeEventListener('keydown', this.onKeyDown);
            }
          }
        });
      }

      // Patch look-controls agar di HP bisa geser bebas 360 derajat (atas, bawah, kanan, kiri)
      if (typeof window.AFRAME !== 'undefined' && window.AFRAME.components['look-controls']) {
        const lookControlsProto = window.AFRAME.components['look-controls'].Component.prototype;
        if (!lookControlsProto.__fullTouchPatched) {
          lookControlsProto.__fullTouchPatched = true;
          lookControlsProto.onTouchMove = function (evt: any) {
            var canvas = this.el.sceneEl && this.el.sceneEl.canvas;
            if (!this.touchStarted || !this.data.touchEnabled || !canvas) {
              return;
            }
            if (evt.touches && evt.touches.length > 0) {
              var touch = evt.touches[0];
              var deltaX = 2 * Math.PI * (touch.pageX - this.touchStart.x) / canvas.clientWidth;
              var deltaY = 2 * Math.PI * (touch.pageY - this.touchStart.y) / canvas.clientHeight;
              var direction = this.data.reverseTouchDrag ? 1 : -1;
              
              // Rotasi Horizontal (Yaw: Kanan - Kiri)
              if (this.yawObject) {
                this.yawObject.rotation.y -= deltaX * 0.5 * direction;
              }
              // Rotasi Vertikal (Pitch: Atas - Bawah)
              if (this.pitchObject) {
                this.pitchObject.rotation.x -= deltaY * 0.5 * direction;
                var maxPitch = Math.PI / 2.15; // Batas ~84 derajat agar tidak jungkir balik
                this.pitchObject.rotation.x = Math.max(-maxPitch, Math.min(maxPitch, this.pitchObject.rotation.x));
              }
              
              this.touchStart = {
                x: touch.pageX,
                y: touch.pageY
              };
            }
          };
        }
      }

      setIsMounted(true);
    }
  }, [onSceneChange]);

  const ensurePlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      (videoRef.current as any).defaultMuted = true;
      videoRef.current.setAttribute("muted", "");
      videoRef.current.setAttribute("playsinline", "");
      videoRef.current.setAttribute("webkit-playsinline", "true");
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => console.warn("Play error:", e));
      }
    }
  };

  // Buka pemutaran video otomatis saat user menyentuh layar pertama kali di HP
  useEffect(() => {
    const handleTouchOrClick = () => {
      ensurePlay();
    };
    window.addEventListener("touchstart", handleTouchOrClick, { passive: true, once: true });
    window.addEventListener("click", handleTouchOrClick, { passive: true, once: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchOrClick);
      window.removeEventListener("click", handleTouchOrClick);
    };
  }, []);

  useEffect(() => {
    if (isMounted && videoRef.current) {
      const vid = videoRef.current;
      vid.muted = true;
      (vid as any).defaultMuted = true;
      vid.setAttribute("muted", "");
      vid.setAttribute("playsinline", "");
      vid.setAttribute("webkit-playsinline", "true");

      const targetSrc = scene.mediaUrl || scene.panorama;
      const currentSrcPath = vid.src ? new URL(vid.src, window.location.href).pathname : "";
      const isSameSrc = (
        decodeURIComponent(currentSrcPath) === decodeURIComponent(targetSrc) ||
        currentSrcPath === targetSrc ||
        vid.src === targetSrc
      );

      const onPlaying = () => {
        setIsVideoPlaying(true);
        setIsBuffering(false);
      };
      const onWaiting = () => {
        setIsBuffering(true);
      };
      const onError = (e: any) => {
        console.warn("Video stream notice:", e);
        setIsBuffering(false);
      };

      vid.addEventListener("playing", onPlaying);
      vid.addEventListener("waiting", onWaiting);
      vid.addEventListener("error", onError);

      if (!isSameSrc) {
        vid.src = targetSrc;
        vid.currentTime = 0;
        try {
          vid.load();
        } catch (err) {
          console.warn("Video reload error:", err);
        }

        const handleReady = () => {
          vid.play().catch(e => console.warn("Autoplay ditahan browser:", e));
          const videosphere = document.querySelector('a-videosphere');
          if (videosphere) {
            const mesh = (videosphere as any).getObject3D('mesh');
            if (mesh && mesh.material && mesh.material.map) {
              mesh.material.map.needsUpdate = true;
            }
          }
        };

        if (vid.readyState >= 2) {
          handleReady();
        } else {
          vid.addEventListener('canplay', handleReady, { once: true });
          vid.addEventListener('loadeddata', handleReady, { once: true });
        }
      } else {
        if (vid.paused) {
          vid.play().catch(e => console.warn(e));
        } else {
          setIsVideoPlaying(true);
          setIsBuffering(false);
        }
      }

      return () => {
        vid.removeEventListener("playing", onPlaying);
        vid.removeEventListener("waiting", onWaiting);
        vid.removeEventListener("error", onError);
      };
    }
  }, [isMounted, scene.id, scene.mediaUrl, scene.panorama]);

  // Reset posisi kamera setelah berpindah scene (Street View step completion)
  useEffect(() => {
    const camera = document.querySelector('a-camera');
    if (camera) {
      camera.removeAttribute('animation__rush');
      camera.setAttribute('position', '0 0 0');
    }
  }, [scene.id, scene.mediaUrl]);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-[#050705] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#FD6842] animate-spin mb-4" />
        <p className="text-[#8e998e] font-serif animate-pulse">Memuat Mesin 360...</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full absolute inset-0 z-0 bg-[#050705]"
      onClick={ensurePlay}
      onTouchStart={ensurePlay}
    >
      {/* Badge Indikator Buffering Video 360° yang Halus & Informatif */}
      {isBuffering && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 sm:top-24 sm:left-auto sm:right-24 z-50 pointer-events-none flex items-center gap-2 bg-[#0c120c]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white/90 text-xs shadow-xl animate-pulse">
          <Loader2 size={13} className="text-[#FD6842] animate-spin" />
          <span>Memuat Streaming 360°...</span>
        </div>
      )}

      {/* @ts-ignore */}
      <a-scene 
        embedded 
        vr-mode-ui="enabled: false" 
        device-orientation-permission-ui="enabled: false"
        loading-screen="enabled: false" 
        cursor="rayOrigin: mouse" 
        raycaster="objects: .clickable"
      >
        
        {/* @ts-ignore */}
        <a-assets>
          <video 
            id="video360" 
            ref={videoRef}
            src={scene.mediaUrl || scene.panorama}
            crossOrigin="anonymous" 
            autoPlay 
            loop 
            muted 
            playsInline
            // @ts-ignore
            webkit-playsinline="true"
            preload="auto"
          />
          <img id="arrow-icon" src="/gambar/hotspot-nav.svg" crossOrigin="anonymous" />
          <img id="button-masuk-bg" src="/gambar/button-masuk-styled.png" crossOrigin="anonymous" />
        {/* @ts-ignore */}
        </a-assets>

        {/* Latar Belakang Foto 360° Equirectangular Instan (0 Detik, Menghilangkan Layar Hitam) */}
        {/* @ts-ignore */}
        <a-sky 
          src={placeholderSrc} 
          rotation="0 -90 0"
        ></a-sky>

        {/* Pemutar Video 360° Spherical (Fades in otomatis begitu video berputar) */}
        {/* @ts-ignore */}
        <a-videosphere 
          src="#video360" 
          rotation="0 -90 0"
          segments-width="36"
          segments-height="36"
          opacity={isVideoPlaying ? "1" : "0"}
        ></a-videosphere>

        {/* Render Hotspots Navigasi Pindah Ruangan Elegan & Proporsional */}
        {scene.sceneHotspots?.map((hotspot, idx) => {
          // Ukuran proporsional & terbaca jelas untuk layar HP maupun desktop
          const btnWidth = hotspot.text.length > 14 ? "1.9" : hotspot.text.length > 8 ? "1.5" : "1.2";
          const textWidth = hotspot.text.length > 14 ? "3.8" : "4.0";

          return (
            // @ts-ignore
            <a-entity key={idx} rotation={`${hotspot.pitch} ${hotspot.yaw} 0`}>
              {/* Ikon Panah Mengambang Proporsional */}
              {/* @ts-ignore */}
              <a-image 
                src="#arrow-icon" 
                position="0 0.10 -4.5" 
                scale="0.48 0.48 0.48" 
                class="clickable" 
                cursor-listener 
                data-target={hotspot.targetScene}
                animation="property: position; to: 0 0.20 -4.5; dir: alternate; dur: 1200; easing: easeInOutSine; loop: true"
              ></a-image>

              {/* Background Melengkung Bertekstur button-pattern Transparansi 60% */}
              {/* @ts-ignore */}
              <a-image
                src="#button-masuk-bg"
                position="0 -0.32 -4.50"
                width={btnWidth}
                height="0.40"
                transparent="true"
                class="clickable"
                cursor-listener
                data-target={hotspot.targetScene}
              ></a-image>

              {/* Teks Label Terbaca Jelas Tepat di Depan Background Tombol */}
              {/* @ts-ignore */}
              <a-text 
                value={hotspot.text} 
                position="0 -0.32 -4.42" 
                align="center" 
                color="#FFFFFF" 
                width={textWidth}
                class="clickable"
                cursor-listener
                data-target={hotspot.targetScene}
              ></a-text>
            {/* @ts-ignore */}
            </a-entity>
          );
        })}

        {/* @ts-ignore */}
        <a-camera 
          position="0 0 0" 
          look-controls="reverseMouseDrag: true; touchEnabled: true; mouseEnabled: true; magicWindowTrackingEnabled: false" 
          wasd-controls="enabled: false" 
          keyboard-rotate
        ></a-camera>

      {/* @ts-ignore */}
      </a-scene>
    </div>
  );
}
