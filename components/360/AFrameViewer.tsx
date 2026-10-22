"use client";

import { useEffect, useState, useRef } from "react";
import { SceneData } from "@/lib/tourData";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    AFRAME?: any;
    __onTourSceneChange?: (sceneId: string) => void;
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
  isGyroEnabled?: boolean;
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

export default function AFrameViewer({ scene, onSceneChange, onHotspotClick, isGyroEnabled = false }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onSceneChangeRef = useRef(onSceneChange);
  const lastLoadedSceneIdRef = useRef<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cam = document.querySelector("a-camera");
      if (cam) {
        cam.setAttribute(
          "look-controls",
          `reverseMouseDrag: true; touchEnabled: true; mouseEnabled: true; magicWindowTrackingEnabled: ${isGyroEnabled ? "true" : "false"}`
        );
      }
    }
  }, [isGyroEnabled]);

  const placeholderSrc = getScenePlaceholder(scene);

  useEffect(() => {
    onSceneChangeRef.current = onSceneChange;
  }, [onSceneChange]);

  // Daftarkan global callback agar komponen A-Frame bisa memicu perpindahan scene React secara andal
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__onTourSceneChange = (targetScene: string) => {
        if (onSceneChangeRef.current) {
          onSceneChangeRef.current(targetScene);
        }
      };
    }
    return () => {
      if (typeof window !== "undefined") {
        delete window.__onTourSceneChange;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      require("aframe");
      
      // Mendaftarkan komponen klik & sentuh khusus untuk hotspot dengan debounce
      if (typeof window.AFRAME !== 'undefined' && !window.AFRAME.components['cursor-listener']) {
        window.AFRAME.registerComponent('cursor-listener', {
          init: function () {
            const el = this.el;
            let lastClickTime = 0;

            const handleAction = (evt?: any) => {
              if (evt && evt.stopPropagation) evt.stopPropagation();
              const now = Date.now();
              if (now - lastClickTime < 500) return;
              lastClickTime = now;

              const target = el.getAttribute('data-target');
              if (target && typeof window !== 'undefined' && window.__onTourSceneChange) {
                // Efek Street View: Kamera meluncur maju ke depan
                const camera = document.querySelector('a-camera');
                if (camera) {
                  camera.setAttribute('animation__rush', 'property: position; to: 0 0 -2.5; dur: 350; easing: easeInQuad');
                }
                window.__onTourSceneChange(target);
              }
            };

            el.addEventListener('click', handleAction);
            el.addEventListener('touchend', (e: any) => {
              handleAction(e);
            });
            el.addEventListener('mouseenter', () => {
              document.body.style.cursor = 'pointer';
            });
            el.addEventListener('mouseleave', () => {
              document.body.style.cursor = 'default';
            });
          }
        });
      }

      // Mendaftarkan kontrol rotasi keyboard (panah kanan-kiri-atas-bawah)
      if (typeof window.AFRAME !== 'undefined' && !window.AFRAME.components['keyboard-rotate']) {
        window.AFRAME.registerComponent('keyboard-rotate', {
          init: function () {
            this.onKeyDown = (e: KeyboardEvent) => {
              if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                const lookControls = (this as any).el.components['look-controls'];
                if (lookControls && lookControls.yawObject && lookControls.pitchObject) {
                  const rotSpeed = 0.06;
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
              
              if (this.yawObject) {
                this.yawObject.rotation.y -= deltaX * 0.5 * direction;
              }
              if (this.pitchObject) {
                this.pitchObject.rotation.x -= deltaY * 0.5 * direction;
                var maxPitch = Math.PI / 2.15;
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
  }, []);

  const ensurePlay = () => {
    if (videoRef.current) {
      const vid = videoRef.current;
      vid.muted = true;
      (vid as any).defaultMuted = true;
      vid.setAttribute("muted", "");
      vid.setAttribute("playsinline", "");
      vid.setAttribute("webkit-playsinline", "true");
      if (vid.paused) {
        vid.play().then(() => {
          setIsVideoPlaying(true);
          setIsBuffering(false);
        }).catch(e => console.warn("Ensure play error:", e));
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

  // Manajemen Pergantian Video yang Handal saat Scene Berubah
  useEffect(() => {
    if (!isMounted || !videoRef.current) return;
    const vid = videoRef.current;

    vid.muted = true;
    (vid as any).defaultMuted = true;
    vid.setAttribute("muted", "");
    vid.setAttribute("playsinline", "");
    vid.setAttribute("webkit-playsinline", "true");

    const targetSrc = scene.mediaUrl || scene.panorama;

    // Deteksi jika scene berpindah ke scene baru
    if (lastLoadedSceneIdRef.current !== scene.id) {
      lastLoadedSceneIdRef.current = scene.id;
      setIsVideoPlaying(false);
      setIsBuffering(true);

      // Pasang target video baru secara eksplisit
      vid.pause();
      vid.src = targetSrc;
      vid.currentTime = 0;
      try {
        vid.load();
      } catch (err) {
        console.warn("Video load error:", err);
      }

      const updateVideosphereTexture = () => {
        const videosphere = document.querySelector('a-videosphere');
        if (videosphere) {
          const mesh = (videosphere as any).getObject3D('mesh');
          if (mesh && mesh.material && mesh.material.map) {
            mesh.material.map.needsUpdate = true;
          }
        }
      };

      const handleCanPlay = () => {
        vid.play().then(() => {
          setIsVideoPlaying(true);
          setIsBuffering(false);
        }).catch(e => console.warn("Autoplay notice:", e));
        updateVideosphereTexture();
      };

      const handlePlaying = () => {
        setIsVideoPlaying(true);
        setIsBuffering(false);
        updateVideosphereTexture();
      };

      const handleWaiting = () => {
        setIsBuffering(true);
      };

      const handleError = (e: any) => {
        console.warn("Video loading notice (fallback 360 photo active):", e);
        setIsBuffering(false);
      };

      vid.addEventListener("canplay", handleCanPlay, { once: true });
      vid.addEventListener("playing", handlePlaying);
      vid.addEventListener("waiting", handleWaiting);
      vid.addEventListener("error", handleError);

      return () => {
        vid.removeEventListener("canplay", handleCanPlay);
        vid.removeEventListener("playing", handlePlaying);
        vid.removeEventListener("waiting", handleWaiting);
        vid.removeEventListener("error", handleError);
      };
    } else {
      if (vid.paused) {
        vid.play().then(() => {
          setIsVideoPlaying(true);
          setIsBuffering(false);
        }).catch(e => console.warn(e));
      } else {
        setIsVideoPlaying(true);
        setIsBuffering(false);
      }
    }
  }, [isMounted, scene.id, scene.mediaUrl, scene.panorama]);

  // Reset posisi kamera setelah berpindah scene (Street View step completion)
  useEffect(() => {
    const camera = document.querySelector('a-camera');
    if (camera) {
      camera.removeAttribute('animation__rush');
      camera.setAttribute('position', '0 0 0');
    }
  }, [scene.id]);

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
      {/* Badge Indikator Buffering Video 360° yang Halus */}
      {isBuffering && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 sm:top-24 sm:left-auto sm:right-24 z-50 pointer-events-none flex items-center gap-2 bg-[#0c120c]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white/90 text-xs shadow-xl animate-pulse">
          <Loader2 size={13} className="text-[#FD6842] animate-spin" />
          <span>Memuat Aliran Video 360°...</span>
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

        {/* Latar Belakang Foto 360° Equirectangular Instan (Hanya Aktif Saat Video Masih Buffering untuk Mencegah Z-Fighting & Garis-Garis) */}
        {/* @ts-ignore */}
        <a-sky 
          key={`sky-${scene.id}`}
          src={placeholderSrc} 
          rotation="0 -90 0"
          visible={!isVideoPlaying}
        ></a-sky>

        {/* Pemutar Video 360° Spherical (Aktif Penuh saat Video Sudah Berputar) */}
        {/* @ts-ignore */}
        <a-videosphere 
          src="#video360" 
          rotation="0 -90 0"
          segments-width="64"
          segments-height="64"
          visible={isVideoPlaying}
        ></a-videosphere>

        {/* Render Hotspots Navigasi Pindah Ruangan Rapi, Proporsional & Responsif untuk HP & Laptop */}
        {scene.sceneHotspots?.map((hotspot, idx) => {
          const isLong = hotspot.text.length > 14;
          const isMedium = hotspot.text.length > 8;

          // Proporsi tombol yang rapi, pas dan tidak kebesaran di layar HP
          const btnWidth = isMobile
            ? (isLong ? "1.55" : isMedium ? "1.25" : "1.00")
            : (isLong ? "1.90" : isMedium ? "1.50" : "1.20");

          const btnHeight = isMobile ? "0.34" : "0.40";

          const textWidth = isMobile
            ? (isLong ? "2.85" : "3.0")
            : (isLong ? "3.6" : "3.8");

          const arrowScale = isMobile ? "0.40 0.40 0.40" : "0.50 0.50 0.50";
          const arrowPosY = isMobile ? 0.09 : 0.12;
          const arrowAnimToY = isMobile ? 0.18 : 0.22;
          const btnPosY = isMobile ? -0.24 : -0.30;
          const textPosY = isMobile ? -0.24 : -0.30;

          return (
            // @ts-ignore
            <a-entity key={`${scene.id}-hotspot-${idx}`} rotation={`${hotspot.pitch} ${hotspot.yaw} 0`}>
              {/* Ikon Panah Mengambang Proporsional */}
              {/* @ts-ignore */}
              <a-image 
                src="#arrow-icon" 
                position={`0 ${arrowPosY} -4.50`} 
                scale={arrowScale} 
                class="clickable"
                cursor-listener
                data-target={hotspot.targetScene}
                animation={`property: position; to: 0 ${arrowAnimToY} -4.50; dir: alternate; dur: 1200; easing: easeInOutSine; loop: true`}
              ></a-image>

              {/* Background Tombol Bertekstur Lengkung */}
              {/* @ts-ignore */}
              <a-image
                src="#button-masuk-bg"
                position={`0 ${btnPosY} -4.50`}
                width={btnWidth}
                height={btnHeight}
                transparent="true"
                class="clickable"
                cursor-listener
                data-target={hotspot.targetScene}
              ></a-image>

              {/* Teks Label Tombol Terbaca Jelas Tepat di Depan Background */}
              {/* @ts-ignore */}
              <a-text 
                value={hotspot.text} 
                position={`0 ${textPosY} -4.42`} 
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
          look-controls={`reverseMouseDrag: true; touchEnabled: true; mouseEnabled: true; magicWindowTrackingEnabled: ${isGyroEnabled ? "true" : "false"}`} 
          wasd-controls="enabled: false" 
          keyboard-rotate
        ></a-camera>

      {/* @ts-ignore */}
      </a-scene>
    </div>
  );
}
