"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Hand, Loader2, ShieldCheck, User, Eye, Smile, X } from "lucide-react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Hands: any;
    FaceMesh: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
    FACEMESH_TESSELATION: any;
  }
}

export default function MultimodalVision() {
  const [isVisionModeOn, setIsVisionModeOn] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [libsReady, setLibsReady] = useState(false);
  
  const [emotion, setEmotion] = useState<string>("Neutral");
  const [gesture, setGesture] = useState<string>("Ready");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const handsRef = useRef<any>(null);
  const faceMeshRef = useRef<any>(null);
  const smoothedCursor = useRef({ x: 0, y: 0 });

  const handleHands = useCallback((results: any) => {
    if (!canvasRef.current || !results.multiHandLandmarks) return;
    const ctx = canvasRef.current.getContext("2d")!;
    if (results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const indexTip = landmarks[8];
      
      if (window.drawConnectors) window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, { color: "rgba(245,158,11,0.3)", lineWidth: 2 });
      if (window.drawLandmarks) window.drawLandmarks(ctx, landmarks, { color: "#fbbf24", lineWidth: 1, radius: 1.5 });

      if (indexTip.y < 0.3) { window.scrollBy(0, -20); setGesture("Scrolling Up"); }
      else if (indexTip.y > 0.7) { window.scrollBy(0, 20); setGesture("Scrolling Down"); }
      else setGesture("Tracking Hand");

      const tx = indexTip.x * canvasRef.current.width;
      const ty = indexTip.y * canvasRef.current.height;
      smoothedCursor.current.x += (tx - smoothedCursor.current.x) * 0.4;
      smoothedCursor.current.y += (ty - smoothedCursor.current.y) * 0.4;
      ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(smoothedCursor.current.x, smoothedCursor.current.y, 5, 0, 2*Math.PI); ctx.fill();
    }
  }, []);

  const handleFace = useCallback((results: any) => {
    if (!canvasRef.current || !results.multiFaceLandmarks) return;
    const ctx = canvasRef.current.getContext("2d")!;
    
    if (results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      
      ctx.save();
      if (window.drawConnectors) window.drawConnectors(ctx, landmarks, window.FACEMESH_TESSELATION, 
        { color: "rgba(6, 182, 212, 0.25)", lineWidth: 0.5 });
      
      const mouthLeft = landmarks[61]; const mouthRight = landmarks[291];
      const mouthTop = landmarks[13]; const mouthBottom = landmarks[14];
      const eyeLeft = landmarks[33]; const eyeRight = landmarks[263];
      
      const mouthWidth = Math.sqrt(Math.pow(mouthLeft.x - mouthRight.x, 2) + Math.pow(mouthLeft.y - mouthRight.y, 2));
      const eyeWidth = Math.sqrt(Math.pow(eyeLeft.x - eyeRight.x, 2) + Math.pow(eyeLeft.y - eyeRight.y, 2));
      const mouthHeight = Math.abs(mouthTop.y - mouthBottom.y);
      const smileRatio = mouthWidth / eyeWidth;
      
      if (mouthHeight > 0.05) setEmotion("Surprised");
      else if (smileRatio > 0.85) setEmotion("Smiling :)");
      else setEmotion("Focused");
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    const scripts = [
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
    ];

    let loaded = 0;
    const loadHandler = () => {
      loaded++;
      if (loaded === scripts.length) setLibsReady(true);
    };

    scripts.forEach(src => {
      const s = document.createElement("script");
      s.src = src; 
      s.async = true;
      s.crossOrigin = "anonymous";
      s.onload = loadHandler;
      s.onerror = (e) => console.error("Script load error:", src, e);
      document.head.appendChild(s);
    });
  }, []);

  const stopVision = useCallback(() => {
    if (streamRef.current) { 
      streamRef.current.getTracks().forEach(t => t.stop()); 
      streamRef.current = null; 
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsActive(false); 
    setIsVisionModeOn(false);
  }, []);

  useEffect(() => {
    if (isVisionModeOn && !isActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then(s => { 
          if (videoRef.current) { 
            videoRef.current.srcObject = s; 
            streamRef.current = s; 
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play(); 
              setIsActive(true); 
            };
          }
        })
        .catch(err => {
          console.error("Camera access denied:", err);
          setIsVisionModeOn(false);
        });
    }
  }, [isVisionModeOn, isActive]);

  useEffect(() => {
    if (!libsReady || !window.Hands || !window.FaceMesh) {
      return;
    }

    const hands = new window.Hands({
      locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
    });
    hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7 });
    hands.onResults((res: any) => handleHands(res));
    handsRef.current = hands;

    const faceMesh = new window.FaceMesh({
      locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`
    });
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.7 });
    faceMesh.onResults((res: any) => handleFace(res));
    faceMeshRef.current = faceMesh;

    return () => { 
      if (hands) hands.close(); 
      if (faceMesh) faceMesh.close(); 
    };
  }, [libsReady, handleHands, handleFace]);

  useEffect(() => {
    let anim: number;
    const loop = async () => {
      if (isActive && videoRef.current?.readyState === 4) {
        try {
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d")!;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
          if (handsRef.current) await handsRef.current.send({ image: videoRef.current });
          if (faceMeshRef.current) await faceMeshRef.current.send({ image: videoRef.current });
        } catch {
          // Frame skip
        }
      }
      anim = requestAnimationFrame(loop);
    };
    if (isActive) loop();
    return () => cancelAnimationFrame(anim);
  }, [isActive]);

  return (
    <>
      {/* Bottom-Left Floating Trigger (Opposite of Chatbot on Right) */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => isVisionModeOn ? stopVision() : setIsVisionModeOn(true)}
        disabled={!libsReady}
        className={`fixed bottom-6 left-6 z-40 px-3.5 py-3 rounded-full border shadow-xl backdrop-blur-xl flex items-center gap-2 text-xs font-bold transition-all ${
          isVisionModeOn 
            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20" 
            : "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08] hover:border-amber-500/40 hover:text-slate-900 dark:hover:text-white shadow-lg"
        }`}
        title="Toggle AI Camera Vision & Gesture Control"
      >
        {isVisionModeOn && !isActive ? (
          <Loader2 className="animate-spin text-slate-950" size={16} />
        ) : isVisionModeOn ? (
          <User size={16} />
        ) : (
          <Video size={16} className="text-amber-500 dark:text-amber-400" />
        )}
        <span className="hidden sm:inline-block">
          {isVisionModeOn ? "Vision Active" : "AI Vision"}
        </span>
      </motion.button>

      {/* Docked Vision Panel on Bottom-Left */}
      <AnimatePresence>
        {isVisionModeOn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-20 left-4 sm:left-6 z-40 w-72 sm:w-80 rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-white/[0.12] shadow-2xl backdrop-blur-2xl bg-white dark:bg-[#0b0f19]"
          >
            {/* Top Bar with Close Button */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={13} className="text-cyan-500 dark:text-cyan-400" />
                <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Local Computer Vision</span>
              </div>
              <button
                onClick={stopVision}
                className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Status Pills */}
            <div className="p-2.5 flex items-center gap-2 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-white/[0.06] text-[10px] font-mono">
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Hand size={11} />
                <span>{gesture}</span>
              </div>
              <span className="text-slate-400 dark:text-slate-600">&bull;</span>
              <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
                <Smile size={11} />
                <span>{emotion}</span>
              </div>
            </div>

            {/* Video Canvas Layer */}
            <div className="relative w-full h-48 bg-black scale-x-[-1] overflow-hidden">
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[1.4] opacity-40 mix-blend-screen" 
                muted 
                playsInline 
              />
              <canvas 
                ref={canvasRef} 
                width={320} 
                height={240} 
                className="absolute inset-0 w-full h-full pointer-events-none z-20" 
              />
            </div>
            
            {/* Bottom Actions */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-white/[0.08] space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                <ShieldCheck size={12} className="text-emerald-500 dark:text-emerald-400" />
                <span>100% Client-Side Local Execution</span>
              </div>
              <Link 
                href="/vision" 
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Eye size={13} />
                <span>Open Fullscreen Vision Lab</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

