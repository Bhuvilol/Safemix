"use client";
import { useState, useRef } from "react";
import { Search, Camera, ArrowLeft, Plus, CheckCircle2, FlaskConical, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CameraScanner from "@/components/ui/CameraScanner";
import { extractMedicineData } from "@/app/actions/ocr";

export default function AddMedicinePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // OCR Integration states
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const [ocrResult, setOcrResult] = useState<{ brandName?: string, ingredients?: string[] } | null>(null);

  const handleCapture = async (base64Image: string) => {
    setIsScanning(false);
    setIsAnalyzing(true);
    setOcrError("");
    setOcrResult(null);

    try {
      const data = await extractMedicineData(base64Image);
      setOcrResult(data);
    } catch (err: any) {
      console.error(err);
      setOcrError(err.message || "Failed to analyze the image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const processImageFile = (file: File) => {
    // We downscale the image to avoid Next.js 1MB Server Action limits (413 Payload Too Large)
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress heavily for AI parsing
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
          handleCapture(compressedBase64);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] dark:bg-[#1A1F1B] pb-24">
      {/* 1. Fullscreen Camera Overlay */}
      {isScanning && <CameraScanner onCapture={handleCapture} onClose={() => setIsScanning(false)} />}
      
      {/* 2. Fullscreen Analysis Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-[#1A1F1B]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6">
          <RefreshCw className="w-12 h-12 text-[#B5CCBA] animate-spin mb-6" />
          <h2 className="text-[#E3E2E0] font-manrope font-bold text-2xl text-center mb-2 text-balance">
            SafeMix Intelligence Engine Running...
          </h2>
          <p className="text-[#C3C8C1] text-center max-w-xs text-sm">
            Gemini 2.5 Flash is extracting ingredients and cross-referencing global pharmacokinetic databases.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#465B4C] text-[#E1F9E5] pt-12 pb-6 px-6 rounded-b-[2rem] shadow-sm relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-2xl font-manrope font-bold">Add Medicine</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by brand or salt name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#2A312B] text-[#0B1F14] dark:text-[#E3E2E0] px-12 py-4 rounded-2xl shadow-sm placeholder-[#737873] outline-none focus:ring-2 focus:ring-[#89A38E] transition-all"
          />
          <Search className="w-5 h-5 text-[#465B4C] dark:text-[#B5CCBA] absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="px-6 pt-10">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#737873]">Or</span>
        </div>

        {/* OCR Intelligence Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setIsScanning(true)}
            className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-gradient-to-br from-[#D0E9D5] to-[#E1F9E5] dark:from-[#2A3B30] dark:to-[#1A1F1B] border-2 border-[#B5CCBA]/50 dark:border-[#465B4C]/50 shadow-sm active:scale-[0.98] transition-transform group"
          >
            <div className="w-16 h-16 rounded-full bg-[#465B4C] mb-3 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-[#0B1F14] dark:text-[#E3E2E0] font-manrope font-bold mb-1">
              Live Camera
            </h2>
          </button>

          <button 
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white dark:bg-[#222823] border-2 border-[#E3E2E0] dark:border-[#434843] shadow-sm active:scale-[0.98] transition-transform group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-[#F5F3F1] dark:bg-[#2A312B] border border-[#E3E2E0] dark:border-[#434843] mb-3 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[#434843] dark:text-[#C3C8C1] text-3xl">upload_file</span>
            </div>
            <h2 className="text-[#0B1F14] dark:text-[#E3E2E0] font-manrope font-bold mb-1">
              Upload Image
            </h2>
          </button>
        </div>

        {/* Hidden file input - placed OUTSIDE grid, using sr-only so .click() works */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", opacity: 0 }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              processImageFile(file);
            }
            e.target.value = "";
          }}
        />

        {/* Error message */}
        {ocrError && (
          <div className="mt-8 bg-[#FFDAD6] border border-[#93000A]/30 p-4 rounded-2xl flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-[#BA1A1A] flex-shrink-0" />
            <p className="text-sm text-[#93000A]">{ocrError}</p>
          </div>
        )}

        {/* OCR Intelligence Result Payload */}
        {ocrResult && (
          <div className="mt-8 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <h3 className="font-semibold text-[#0B1F14] dark:text-[#E3E2E0] mb-4 flex justify-between items-center">
              AI Analysis Result
              <span className="text-[10px] font-bold tracking-widest uppercase bg-[#D0E9D5] text-[#0B1F14] px-2 py-1 rounded-full">Gemini</span>
            </h3>
            
            <div className="bg-white dark:bg-[#2A312B] rounded-2xl p-6 border-2 border-[#465B4C] dark:border-[#B5CCBA] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FlaskConical className="w-24 h-24 text-[#465B4C]" />
              </div>
              
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-[#737873] uppercase tracking-widest mb-1">Brand Name Found</p>
                <p className="text-xl font-manrope font-bold text-[#0B1F14] dark:text-[#E1F9E5] mb-6">
                  {ocrResult.brandName || "Unknown Brand"}
                </p>

                <p className="text-[10px] font-bold text-[#737873] uppercase tracking-widest mb-2">Detected Salts / Ingredients</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {ocrResult.ingredients && ocrResult.ingredients.length > 0 ? (
                    ocrResult.ingredients.map((ing, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#F5F3F1] dark:bg-[#1A1F1B] border border-[#E3E2E0] dark:border-[#434843] rounded-lg text-sm font-semibold text-[#374B3D] dark:text-[#B5CCBA]">
                        {ing}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#737873]">No specific ingredients extracted.</span>
                  )}
                </div>

                <button 
                  onClick={() => router.push("/dashboard/add-medicine")}
                  className="w-full py-4 rounded-full font-semibold text-white bg-[#465B4C] hover:bg-[#4E6354] transition-all flex justify-center items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-5 h-5" /> Add to My Daily Regimen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popular / Recent Empty State */}
        {!ocrResult && !ocrError && (
          <div className="mt-10">
            <h3 className="font-semibold text-[#0B1F14] dark:text-[#E3E2E0] mb-4">No Recent Searches</h3>
            <div className="bg-white dark:bg-[#222823] rounded-2xl p-6 border border-[#E3E2E0] dark:border-[#434843] flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#F5F3F1] dark:bg-[#2A312B] flex items-center justify-center mb-3">
                <Plus className="w-5 h-5 text-[#737873]" />
              </div>
              <p className="text-[#434843] dark:text-[#C3C8C1] text-sm">
                Use the search bar or scan a strip to add your first daily medication.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
