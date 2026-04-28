"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, X, RefreshCw } from "lucide-react";

interface CameraScannerProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
}

export default function CameraScanner({ onCapture, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [error, setError] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);

  // Start the camera
  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1920 } }
        });
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsInitializing(false);
      } catch (err: any) {
        console.error("Camera access denied:", err);
        setError("Camera access was denied or is not available. Please check permissions.");
        setIsInitializing(false);
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video precisely
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg", 0.9);
      
      // Stop the camera explicitly since we're done
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      onCapture(base64);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onClose} className="p-3 bg-white/20 rounded-full text-white backdrop-blur-md">
          <X className="w-6 h-6" />
        </button>
        <span className="text-white font-manrope font-bold uppercase tracking-wider">Object Scanner</span>
        <div className="w-12" /> {/* Spacer for alignment */}
      </div>

      <div className="relative w-full h-[70vh] flex items-center justify-center bg-black overflow-hidden">
        {isInitializing && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <RefreshCw className="w-10 h-10 text-white animate-spin opacity-50" />
          </div>
        )}

        {error ? (
          <div className="text-white text-center p-6 bg-red-500/20 rounded-xl border border-red-500 max-w-sm">
            <p className="font-semibold mb-2">Camera Unavailable</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover rounded-3xl"
            />
            {/* Outline guide for users to center the strip */}
            <div className="absolute inset-0 mx-8 my-32 border-2 border-dashed border-white/50 rounded-xl z-10 pointer-events-none" />
          </>
        )}
      </div>

      <div className="w-full h-32 flex items-center justify-center pb-8 absolute bottom-0 bg-gradient-to-t from-black to-transparent">
        {!error && !isInitializing && (
          <button 
            onClick={handleCapture}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-1 relative active:scale-95 transition-transform"
          >
            <div className="w-full h-full border-4 border-black rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-black" />
            </div>
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
