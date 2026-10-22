import { useEffect, useRef, useState } from "react";
import { tourData } from "@/lib/tourData";
import { Orbit } from "lucide-react";
import { GyroToggle } from "@/components/ui/gyro-toggle";

type Props = {
  currentScene: string;
  onHotspotClick: (id: string) => void;
  onSceneChange: (sceneId: string) => void;
  hideUI?: boolean;
};

export default function PannellumViewer({ currentScene, onHotspotClick, onSceneChange, hideUI = false }: Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);
  const [isGyroEnabled, setIsGyroEnabled] = useState(false);
  const viewerInstance = useRef<any>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (!viewerRef.current) return;
    if (viewerInstance.current && typeof viewerInstance.current.destroy === 'function') viewerInstance.current.destroy();

    const handleHotspotClickGlobal = (event: any, args: any) => {
      if (args && args.id) onHotspotClick(args.id);
    };
    (window as any).handleHotspotClick = handleHotspotClickGlobal;

    const scenesConfig: Record<string, any> = {};
    Object.keys(tourData).forEach(key => {
      const room = tourData[key];
      if (!room.panorama) return; 

      scenesConfig[key] = {
        // TITTLE DIHAPUS AGAR BOX NATIVE PANNELLUM TIDAK MUNCUL!
        type: "equirectangular",
        panorama: room.panorama,
        autoLoad: true,
        hotSpots: [
          ...(room.infoHotspots || []).map((spot) => ({
            pitch: spot.pitch,
            yaw: spot.yaw,
            type: "info",
            text: spot.text,
            clickHandlerFunc: handleHotspotClickGlobal,
            clickHandlerArgs: { id: spot.dataId }
          })),
          ...(room.sceneHotspots || []).map((spot) => ({
            pitch: spot.pitch,
            yaw: spot.yaw,
            type: "scene",
            text: spot.text,
            sceneId: spot.targetScene
          }))
        ]
      };
    });

    if (!scenesConfig[currentScene]) return;

    viewerInstance.current = (window as any).pannellum.viewer(viewerRef.current, {
      default: { 
        firstScene: currentScene, 
        sceneFadeDuration: 1000, 
        autoLoad: true, 
        showControls: false, // Mematikan kontrol default
        showFullscreenCtrl: false, // Mematikan fullscreen bawaan
        showZoomCtrl: false, // Mematikan zoom bawaan
        compass: false // Mematikan kompas bawaan
      },
      scenes: scenesConfig
    });

    viewerInstance.current.on('scenechange', (sceneId: string) => onSceneChange(sceneId));

    const updateRadar = () => {
      if (viewerInstance.current && radarRef.current) {
        const yaw = viewerInstance.current.getYaw();
        radarRef.current.style.transform = `rotate(${yaw}deg)`;
      }
      requestRef.current = requestAnimationFrame(updateRadar);
    };
    requestRef.current = requestAnimationFrame(updateRadar);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (viewerInstance.current && typeof viewerInstance.current.destroy === 'function') viewerInstance.current.destroy();
      delete (window as any).handleHotspotClick;
    };
  }, [currentScene]);

  const handleGyroToggle = () => {
    if (!viewerInstance.current) return;
    if (isGyroEnabled) {
      viewerInstance.current.stopOrientation();
      setIsGyroEnabled(false);
    } else {
      viewerInstance.current.startOrientation();
      setIsGyroEnabled(true);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={viewerRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto"></div>
      
      <div className={`transition-opacity duration-700 ease-in-out ${hideUI ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-500'}`}>
        
        {/* Tombol Gyro - Kiri Atas (Muncul 100%) */}
        <GyroToggle isOn={isGyroEnabled} onToggle={handleGyroToggle} />

        {/* Radar Minimap - Kanan Atas (Muncul 100%) */}
        <div 
          id="radar-minimap"
          className="absolute top-24 right-4 sm:top-28 sm:right-8 z-[50] pointer-events-auto p-3 sm:p-4 bg-[#0a0d0a]/90 backdrop-blur-md border border-[#2a302a] rounded-2xl transition-all shadow-lg"
        >
          <p className="text-[8px] sm:text-[9px] font-medium text-[#8e998e] mb-3 text-center uppercase tracking-[0.2em]">
            Arah Pandang
          </p>
          <div className="relative w-24 h-24 rounded-full border border-[#2a302a] bg-[#050705] overflow-hidden mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#FD6842] rounded-full z-20"></div>
            <div ref={radarRef} className="absolute top-1/2 left-1/2 z-10" style={{ width: 0, height: 0 }}>
              <div 
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-full pointer-events-none transition-transform duration-75 origin-bottom"
                style={{
                  borderLeft: "35px solid transparent",
                  borderRight: "35px solid transparent",
                  borderTop: "50px solid rgba(253, 104, 66, 0.4)"
                }}
              ></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

