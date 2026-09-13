"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function HeroAvatar() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hasEnded, setHasEnded] = useState(true);
  const [isTransforming, setIsTransforming] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevIsDarkRef = useRef<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : false;

  // Handler when video completes its playthrough
  const handleVideoEnded = useCallback(() => {
    setHasEnded(true);
    setIsTransforming(false);
    setVideoCompleted(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  // Handle video playback: only play transformation when explicitly switching from Light to Dark
  useEffect(() => {
    if (!mounted) return;

    const video = videoRef.current;
    if (!video) return;

    // Switching into Dark Mode FROM Light Mode
    if (isDark) {
      if (prevIsDarkRef.current === false) {
        // User clicked from light into dark mode!
        setHasEnded(false);
        setIsTransforming(true);
        setVideoCompleted(false);
        video.currentTime = 0;

        // Attempt play with audio, fallback to muted if browser restricts
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            video.muted = true;
            video.play().catch(() => {
              setHasEnded(true);
              setIsTransforming(false);
              setVideoCompleted(true);
            });
          });
        }

        // The video is 7.2s long: set fallback safety timer to 8.5s so it never prematurely cuts off the video
        const safetyTimer = setTimeout(() => {
          setHasEnded(true);
          setIsTransforming(false);
          setVideoCompleted(true);
        }, 8500);

        return () => clearTimeout(safetyTimer);
      } else {
        // Initial mount in dark mode: display static dark portrait
        setHasEnded(true);
        setIsTransforming(false);
        setVideoCompleted(false);
      }
    } else {
      // Light Mode: reset video
      video.pause();
      video.currentTime = 0;
      setHasEnded(true);
      setIsTransforming(false);
      setVideoCompleted(false);
    }

    prevIsDarkRef.current = isDark;
  }, [isDark, mounted]);

  const handleAvatarClick = (e: React.MouseEvent) => {
    // If we're in light mode and about to switch to dark, unmute video for rich audio
    if (!isDark && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
    }
    toggleTheme(e);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Interactive Portrait / Video Container */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAvatarClick}
        className="relative w-72 sm:w-80 aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer group p-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl transition-all duration-500"
        title="Click to toggle theme transformation!"
      >
        {/* Glow halo behind the frame */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950">
          {/* 1. Light Mode Portrait (Daylight studio, warm smile) */}
          <Image
            src="/javier-light.jpg"
            alt="Javier Siliacay — Software Developer & AI Engineer (Daylight Studio)"
            fill
            sizes="(max-width: 640px) 288px, 320px"
            className={`object-cover object-top transition-opacity duration-500 ease-in-out ${isDark ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            priority
          />

          {/* 2. Dark Mode Base Portrait (Clean dark studio portrait - NO shades) */}
          <Image
            src="/javier-dark.jpg"
            alt="Javier Siliacay — Software Developer & AI Engineer (Cyber Dark)"
            fill
            sizes="(max-width: 640px) 288px, 320px"
            className={`object-cover object-top transition-opacity duration-500 ease-in-out ${isDark ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            priority
          />

          {/* 3. Dark Mode Transformation Video (Plays full 7.2s seamlessly on Light -> Dark toggle) */}
          <video
            ref={videoRef}
            src="/javier-dark-transform.mp4"
            poster="/javier-dark.jpg"
            playsInline
            muted
            preload="auto"
            onEnded={handleVideoEnded}
            onError={handleVideoEnded}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${isDark && (isTransforming || videoCompleted) ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          />

          {/* Subtle bottom vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent pointer-events-none" />

          {/* Bottom Info HUD in the frame */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/85 border border-white/10 backdrop-blur-md shadow-lg transition-transform group-hover:translate-y-[-2px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white tracking-wide">Javier Siliacay</p>
              </div>

              {/* Theme State Indicator Pill */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/90 border border-white/10 text-[10px] font-mono text-slate-300">
                {isDark ? (
                  !isTransforming && hasEnded ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span className="text-cyan-300 font-semibold">Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-cyan-300 font-semibold">Transforming</span>
                    </>
                  )
                ) : (
                  <>
                    <Sun size={11} className="text-amber-400" />
                    <span className="text-amber-300 font-semibold">Studio</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Micro-Label under Avatar */}
      <motion.button
        type="button"
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-300 shadow-sm transition-all"
      >
        {isDark ? (
          <Moon size={12} className="text-cyan-400" />
        ) : (
          <Sun size={12} className="text-amber-500" />
        )}
        <span>{isDark ? "Click to switch to Daylight Studio" : "Click to activate Dark Transformation"}</span>
      </motion.button>
    </div>
  );
}
