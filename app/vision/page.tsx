"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Eye,
  Hand,
  Activity,
  Zap,
  Volume2,
  VolumeX,
  ShieldCheck,
  Cpu,
  Layers,
  Radio,
  Flame
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import type * as handPoseDetectionTypes from "@tensorflow-models/hand-pose-detection";
import type * as faceLandmarksDetectionTypes from "@tensorflow-models/face-landmarks-detection";
import type * as poseDetectionTypes from "@tensorflow-models/pose-detection";

// Bypass Next.js SSR and ESM resolution issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tf: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let handPoseDetection: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let faceLandmarksDetection: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let poseDetection: any = null;

if (typeof window !== "undefined") {
  // Use pure require for all TF modules to prevent Turbopack from mixing ESM/CJS and double-registering WebGL
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  tf = require("@tensorflow/tfjs-core");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@tensorflow/tfjs-backend-webgl");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  handPoseDetection = require("@tensorflow-models/hand-pose-detection/dist/index.js");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  faceLandmarksDetection = require("@tensorflow-models/face-landmarks-detection/dist/index.js");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  poseDetection = require("@tensorflow-models/pose-detection/dist/index.js");
}

interface TelemetryData {
  fps: number;
  faces: number;
  hands: number;
  poses: number;
  activeVfx: "Idle" | "Kamehameha Charging" | "Spirit Bomb Active" | "None";
}

export default function HighFidelityVisionDemo() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // User interactive feature controls
  const [showFaceMesh, setShowFaceMesh] = useState(true);
  const [showHands, setShowHands] = useState(true);
  const [showPoses, setShowPoses] = useState(true);
  const [showVFX, setShowVFX] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live telemetry state for the floating HUD
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    fps: 0,
    faces: 0,
    hands: 0,
    poses: 0,
    activeVfx: "Idle",
  });

  // Dynamic refs so the animation loop always reads latest toggle values without re-mounting
  const showFaceMeshRef = useRef(true);
  const showHandsRef = useRef(true);
  const showPosesRef = useRef(true);
  const showVFXRef = useRef(true);
  const soundEnabledRef = useRef(true);

  showFaceMeshRef.current = showFaceMesh;
  showHandsRef.current = showHands;
  showPosesRef.current = showPoses;
  showVFXRef.current = showVFX;
  soundEnabledRef.current = soundEnabled;

  const spiritBombAudioRef = useRef<HTMLAudioElement | null>(null);
  const kamehamehaAudioRef = useRef<HTMLAudioElement | null>(null);

  // Kamehameha Charge Tracking
  const kamehamehaChargeRef = useRef<number>(0);
  const lastKamehamehaActiveRef = useRef<number>(0);

  // Initialize Audio
  useEffect(() => {
    const sbaudio = new Audio("/spiritbomb.mp3");
    sbaudio.loop = true;
    spiritBombAudioRef.current = sbaudio;

    const kaudio = new Audio("/kamekameha.mp3");
    kaudio.loop = true;
    kamehamehaAudioRef.current = kaudio;

    return () => {
      sbaudio.pause();
      kaudio.pause();
    };
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    let handDetector: handPoseDetectionTypes.HandDetector | null = null;
    let faceDetector: faceLandmarksDetectionTypes.FaceLandmarksDetector | null = null;
    let poseDetector: poseDetectionTypes.PoseDetector | null = null;
    let animationFrameId: number;

    // FPS calculation tracking
    let frameCount = 0;
    let lastTime = performance.now();
    let currentFps = 0;

    const setupCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser API navigator.mediaDevices.getUserMedia not available");
      }

      const video = videoRef.current;
      if (!video) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      video.srcObject = stream;

      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(video);
        };
      });
    };

    const initDetectors = async () => {
      try {
        await tf.ready();

        // 1. Hand Tracking (Multi-Hand)
        handDetector = await handPoseDetection.createDetector(
          handPoseDetection.SupportedModels.MediaPipeHands,
          {
            runtime: "tfjs",
            modelType: "lite",
            maxHands: 6,
          }
        );

        // 2. Face Landmarks (468-point 3D contour)
        faceDetector = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: "tfjs",
            refineLandmarks: true,
            maxFaces: 6,
          }
        );

        // 3. Multi-Person MoveNet Skeleton
        poseDetector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
            enableTracking: true,
            trackerType: poseDetection.TrackerType.BoundingBox,
          }
        );

        await setupCamera();
        setIsLoaded(true);
        detectFeatures();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error(e);
        setError("Failed to load precision models. Please ensure webcam permissions are enabled.");
      }
    };

    const detectFeatures = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !handDetector || !faceDetector || video.readyState < 2) {
        animationFrameId = requestAnimationFrame(detectFeatures);
        return;
      }

      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationFrameId = requestAnimationFrame(detectFeatures);
        return;
      }

      // FPS tracking calculation
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 500) {
        currentFps = Math.round((frameCount * 1000) / (now - lastTime));
        frameCount = 0;
        lastTime = now;
      }

      try {
        // Run inference in parallel on WebGL
        const [hands, faces, poses] = await Promise.all([
          handDetector.estimateHands(video, { flipHorizontal: false }),
          faceDetector.estimateFaces(video, { flipHorizontal: false }),
          poseDetector!.estimatePoses(video, { flipHorizontal: false }),
        ]);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const safeHands = hands || [];
        const safeFaces = faces || [];
        const safePoses = poses || [];

        let currentActiveVfx: TelemetryData["activeVfx"] = "Idle";

        // ==========================================================
        // 1. RENDER BACKGROUND BODY POSES & SPIRIT BOMB
        // ==========================================================
        const skeletonEdges = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
        let isAnySpiritBombActive = false;

        safePoses.forEach((pose: poseDetectionTypes.Pose) => {
          // If body poses toggle is active, draw skeleton
          if (showPosesRef.current) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#06b6d4";
            ctx.strokeStyle = "rgba(6, 182, 212, 0.85)";
            ctx.lineWidth = 3;

            // Sci-Fi Head Targeting Box
            const faceKps = pose.keypoints.slice(0, 5);
            const validFaceKps = faceKps.filter((kp) => (kp.score || 0) > 0.3);

            if (validFaceKps.length >= 2) {
              const minX = Math.min(...validFaceKps.map((k) => k.x));
              const maxX = Math.max(...validFaceKps.map((k) => k.x));
              const minY = Math.min(...validFaceKps.map((k) => k.y));
              const maxY = Math.max(...validFaceKps.map((k) => k.y));

              const w = Math.max(40, (maxX - minX) * 1.8);
              const h = Math.max(40, (maxY - minY) * 2.2);
              const cx = minX + (maxX - minX) / 2;
              const cy = minY + (maxY - minY) / 2;
              const bx = cx - w / 2;
              const by = cy - h / 2 - h * 0.1;

              const cr = Math.min(w, h) * 0.25;
              ctx.beginPath();
              // Top Left
              ctx.moveTo(bx + cr, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by + cr);
              // Top Right
              ctx.moveTo(bx + w - cr, by); ctx.lineTo(bx + w, by); ctx.lineTo(bx + w, by + cr);
              // Bottom Left
              ctx.moveTo(bx + cr, by + h); ctx.lineTo(bx, by + h); ctx.lineTo(bx + h, by + cr);
              // Bottom Right
              ctx.moveTo(bx + w - cr, by + h); ctx.lineTo(bx + w, by + h); ctx.lineTo(bx + w, by + h - cr);
              ctx.stroke();
            }

            // Draw Body Joints
            ctx.fillStyle = "#38bdf8";
            pose.keypoints.forEach((kp, index) => {
              if (index < 5) return;
              if ((kp.score || 0) > 0.4) {
                ctx.beginPath();
                ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
                ctx.fill();
              }
            });

            // Draw Body Bones
            ctx.lineWidth = 4;
            ctx.beginPath();
            skeletonEdges.forEach(([i, j]: number[]) => {
              if (i < 5 && j < 5) return;
              const kp1 = pose.keypoints[i];
              const kp2 = pose.keypoints[j];
              if ((kp1.score || 0) > 0.35 && (kp2.score || 0) > 0.35) {
                ctx.moveTo(kp1.x, kp1.y);
                ctx.lineTo(kp2.x, kp2.y);
              }
            });
            ctx.stroke();
            ctx.shadowBlur = 0;
          }

          // SPIRIT BOMB VFX (Both arms raised high above head)
          if (showVFXRef.current) {
            const leftWrist = pose.keypoints[9];
            const rightWrist = pose.keypoints[10];
            const nose = pose.keypoints[0];

            if ((leftWrist.score || 0) > 0.4 && (rightWrist.score || 0) > 0.4 && (nose.score || 0) > 0.4) {
              if (leftWrist.y < nose.y - 40 && rightWrist.y < nose.y - 40) {
                isAnySpiritBombActive = true;
                currentActiveVfx = "Spirit Bomb Active";

                const cx = (leftWrist.x + rightWrist.x) / 2;
                const cy = Math.min(leftWrist.y, rightWrist.y) - 60;

                const time = Date.now();
                const pulse = Math.sin(time / 150) * 30;
                const altitudeBonus = Math.max(0, nose.y - Math.max(leftWrist.y, rightWrist.y));
                const radius = Math.min(250, 100 + pulse + altitudeBonus * 0.8);

                ctx.shadowBlur = 100 + pulse;
                ctx.shadowColor = "#38bdf8";

                const gradient = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
                gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
                gradient.addColorStop(0.15, "rgba(100, 200, 255, 0.95)");
                gradient.addColorStop(0.5, "rgba(14, 165, 233, 0.6)");
                gradient.addColorStop(1, "rgba(2, 132, 199, 0)");

                ctx.beginPath();
                ctx.fillStyle = gradient;
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fill();

                // Swirling energy orbit rings
                ctx.strokeStyle = "rgba(186, 230, 253, 0.5)";
                ctx.lineWidth = 4;
                for (let k = 0; k < 3; k++) {
                  ctx.beginPath();
                  const offset = (time / (500 + k * 100)) % (Math.PI * 2);
                  ctx.arc(cx, cy, radius + 20 + k * 15, offset, offset + Math.PI);
                  ctx.stroke();
                }

                ctx.shadowBlur = 0;
              }
            }
          }
        });

        // Audio controller for Spirit Bomb
        if (spiritBombAudioRef.current) {
          if (isAnySpiritBombActive && soundEnabledRef.current) {
            if (spiritBombAudioRef.current.paused) {
              spiritBombAudioRef.current.play().catch(() => {});
            }
          } else {
            if (!spiritBombAudioRef.current.paused) {
              spiritBombAudioRef.current.pause();
              spiritBombAudioRef.current.currentTime = 0;
            }
          }
        }

        // ==========================================================
        // 2. RENDER HANDS & KAMEHAMEHA
        // ==========================================================
        if (showHandsRef.current) {
          safeHands.forEach((hand: handPoseDetectionTypes.Hand) => {
            const isLeft = hand.handedness === "Left";
            const color = isLeft ? "#ec4899" : "#06b6d4";

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";

            const thumb = [0, 1, 2, 3, 4];
            const index = [0, 5, 6, 7, 8];
            const middle = [9, 10, 11, 12];
            const ring = [13, 14, 15, 16];
            const pinky = [17, 18, 19, 20];
            const palmBase = [0, 5, 9, 13, 17, 0];

            const fingers = [thumb, index, middle, ring, pinky, palmBase];

            fingers.forEach((fingerIndices) => {
              ctx.beginPath();
              fingerIndices.forEach((idx, i) => {
                const kp = hand.keypoints[idx];
                if (i === 0) ctx.moveTo(kp.x, kp.y);
                else ctx.lineTo(kp.x, kp.y);
              });
              if (fingerIndices === middle || fingerIndices === ring || fingerIndices === pinky) {
                ctx.moveTo(hand.keypoints[0].x, hand.keypoints[0].y);
                ctx.lineTo(hand.keypoints[fingerIndices[0]].x, hand.keypoints[fingerIndices[0]].y);
              }
              ctx.stroke();
            });

            // Draw individual joints
            hand.keypoints.forEach((kp) => {
              ctx.beginPath();
              ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
              ctx.fillStyle = "#ffffff";
              ctx.fill();
              ctx.strokeStyle = color;
              ctx.lineWidth = 1;
              ctx.stroke();
            });
          });
        }

        // KAMEHAMEHA VFX (Two hands brought close together)
        let kamehamehaThisFrame = false;

        if (showVFXRef.current && safeHands.length >= 2) {
          for (let i = 0; i < safeHands.length; i++) {
            for (let j = i + 1; j < safeHands.length; j++) {
              const h1 = safeHands[i];
              const h2 = safeHands[j];

              const p1 = h1.keypoints[9];
              const p2 = h2.keypoints[9];

              if (!p1 || !p2) continue;

              const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

              if (dist < 220) {
                kamehamehaThisFrame = true;
                currentActiveVfx = "Kamehameha Charging";
                const nowMs = Date.now();
                lastKamehamehaActiveRef.current = nowMs;

                kamehamehaChargeRef.current = Math.min(1, kamehamehaChargeRef.current + 0.008);
                const charge = kamehamehaChargeRef.current;

                const cx = (p1.x + p2.x) / 2;
                const cy = (p1.y + p2.y) / 2;

                const time = nowMs;
                const pulse = Math.sin(time / 50) * (10 + charge * 30);
                const chargeScale = (220 - dist) * 0.7;
                const radius = Math.max(30, 40 + pulse + chargeScale + charge * 180);

                if (charge > 0.7) {
                  ctx.save();
                  const shake = (charge - 0.7) * 20;
                  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
                }

                // Energy gathering rings
                if (charge > 0.05) {
                  ctx.strokeStyle = `rgba(100, 255, 255, ${0.2 + charge * 0.5})`;
                  ctx.lineWidth = 2 + charge * 4;
                  for (let k = 0; k < 4; k++) {
                    const ringTime = (time / (1200 - k * 150)) % 1;
                    const ringRad = radius * (3 - ringTime * 2.8);
                    if (ringRad > radius * 0.2) {
                      ctx.beginPath();
                      ctx.arc(cx, cy, ringRad, 0, Math.PI * 2);
                      ctx.stroke();
                    }
                  }
                }

                // Main plasma sphere
                ctx.shadowBlur = 40 + charge * 100 + pulse;
                ctx.shadowColor = charge > 0.8 ? "#ffffff" : "#00ffff";

                const gradient = ctx.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius);
                gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
                gradient.addColorStop(0.1 + charge * 0.1, `rgba(${255 - charge * 155}, 255, 255, 1)`);
                gradient.addColorStop(0.5, `rgba(0, ${150 + charge * 105}, 255, 0.8)`);
                gradient.addColorStop(1, "rgba(0, 50, 255, 0)");

                ctx.beginPath();
                ctx.fillStyle = gradient;
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fill();

                // Chaotic plasma lightning
                const lightningCount = Math.floor(4 + charge * 12);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
                for (let k = 0; k < lightningCount; k++) {
                  ctx.lineWidth = Math.random() * (1 + charge * 4);
                  ctx.beginPath();
                  const angle1 = Math.random() * Math.PI * 2;
                  const angle2 = angle1 + Math.random() * (0.5 + charge);
                  const arcRad = radius + Math.random() * (20 + charge * 60);
                  ctx.arc(cx, cy, arcRad, angle1, angle2);
                  ctx.stroke();
                }

                if (charge > 0.7) {
                  ctx.restore();
                }
              }
            }
          }
        }

        // Discharge Kamehameha energy when hands separate
        if (!kamehamehaThisFrame) {
          kamehamehaChargeRef.current = Math.max(0, kamehamehaChargeRef.current - 0.03);
        }

        // Audio controller for Kamehameha
        if (kamehamehaAudioRef.current) {
          if (kamehamehaThisFrame && soundEnabledRef.current) {
            if (kamehamehaAudioRef.current.paused) {
              kamehamehaAudioRef.current.play().catch(() => {});
            }
          } else {
            if (!kamehamehaAudioRef.current.paused) {
              kamehamehaAudioRef.current.pause();
              kamehamehaAudioRef.current.currentTime = 0;
            }
          }
        }

        // ==========================================================
        // 3. RENDER 468-POINT 3D FACE MESH CONTOURS
        // ==========================================================
        if (showFaceMeshRef.current) {
          const pairs = faceLandmarksDetection.util.getAdjacentPairs(
            faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
          );

          safeFaces.forEach((face: faceLandmarksDetectionTypes.Face) => {
            ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
            ctx.lineWidth = 0.8;
            ctx.beginPath();

            pairs.forEach((pair: number[]) => {
              const i = pair[0];
              const j = pair[1];
              if (face.keypoints[i] && face.keypoints[j]) {
                ctx.moveTo(face.keypoints[i].x, face.keypoints[i].y);
                ctx.lineTo(face.keypoints[j].x, face.keypoints[j].y);
              }
            });
            ctx.stroke();

            // Vertex highlight points
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            face.keypoints.forEach((kp) => {
              ctx.beginPath();
              const size = Math.max(0.3, 1.2 - (kp.z || 0) / 20);
              ctx.arc(kp.x, kp.y, size, 0, 2 * Math.PI);
              ctx.fill();
            });
          });
        }

        // Update React telemetry HUD every ~15 frames for high performance
        if (frameCount % 6 === 0) {
          setTelemetry({
            fps: currentFps,
            faces: safeFaces.length,
            hands: safeHands.length,
            poses: safePoses.length,
            activeVfx: currentActiveVfx,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Frame processing error:", err);
        setError("AI Inference Error: " + (err.message || String(err)));
        return;
      }

      animationFrameId = requestAnimationFrame(detectFeatures);
    };

    initDetectors();

    const currentVideo = videoRef.current;

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handDetector) handDetector.dispose();
      if (faceDetector) faceDetector.dispose();
      if (poseDetector) poseDetector.dispose();
      if (currentVideo && currentVideo.srcObject) {
        const stream = currentVideo.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--ink))] flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 overflow-x-hidden font-sans relative transition-colors duration-400">
      {/* Background Halftone Aesthetic Textures (Adaptive light & dark) */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="halftone halftone-wide mask-tr absolute right-0 top-0 h-[70vh] w-[60vw] opacity-15 dark:opacity-20" />
        <div className="halftone mask-bl absolute bottom-0 left-0 h-[60vh] w-[50vw] opacity-15 dark:opacity-15" />
      </div>

      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl z-20 flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white/85 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/90 dark:border-white/[0.08] shadow-sm transition-all hover:scale-[1.02]"
        >
          <ArrowLeft size={14} className="text-cyan-500" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 text-[11px] font-mono font-semibold text-cyan-700 dark:text-cyan-300">
            <Radio size={12} className="animate-pulse text-cyan-500" />
            <span>WebGL Hardware Inference</span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Hero Headline */}
      <div className="z-10 text-center max-w-3xl mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-3 border border-cyan-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span>Real-Time In-Browser Computer Vision</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2.5 text-slate-900 dark:text-white">
          Multimodal <span className="text-gradient-cyan">Vision Lab</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Zero-server latency. 100% client-side 3D face mesh, multi-hand skeleton recognition, and interactive Dragon Ball Z energy particle VFX.
        </p>
      </div>

      {/* Main Vision Stage (Camera + Canvas) */}
      <div className="z-10 relative flex flex-col w-full max-w-5xl justify-center items-center">
        {/* Loading Overlay */}
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-slate-950/80 rounded-3xl z-30 border border-slate-200 dark:border-white/10 backdrop-blur-md">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
            <p className="text-cyan-600 dark:text-cyan-400 font-mono tracking-widest text-xs uppercase font-bold">
              Compiling Neural Models &amp; Camera Feed...
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Initial compile takes 2–4 seconds</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-rose-50/90 dark:bg-rose-950/80 rounded-3xl z-30 border border-rose-400/40 backdrop-blur-md p-6">
            <div className="text-rose-600 dark:text-rose-300 font-bold text-center max-w-md text-sm">
              <p className="text-base mb-1">Camera / Model Access Needed</p>
              <p className="font-normal text-xs text-rose-500 dark:text-rose-400">{error}</p>
            </div>
          </div>
        )}

        {/* Chassis Frame Container */}
        <div
          ref={containerRef}
          className={`group relative rounded-3xl overflow-hidden aspect-video w-full bg-slate-950 shadow-2xl border border-slate-200 dark:border-white/10 transition-all ${
            isFullscreen ? "rounded-none border-none aspect-auto h-screen" : ""
          }`}
        >
          {/* Live Video Capture */}
          <video
            ref={videoRef}
            width={1280}
            height={720}
            className="w-full h-full object-cover opacity-90"
            playsInline
            muted
          />

          {/* Precision Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-cover z-10 pointer-events-none"
          />

          {/* Floating Glass Telemetry HUD (Replaces old black rectangle) */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-lg text-[11px] font-mono space-y-1.5 transition-all">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-1.5">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Activity size={12} className="text-cyan-500" />
                <span>TELEMETRY</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                {telemetry.fps > 0 ? `${telemetry.fps} FPS` : "SYNCING"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-600 dark:text-slate-300 pt-0.5">
              <div>
                <span className="text-slate-400">Faces: </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {telemetry.faces > 0 ? `${telemetry.faces} (468 pts)` : "0"}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Hands: </span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {telemetry.hands > 0 ? `${telemetry.hands} tracked` : "0"}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Bodies: </span>
                <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400">{telemetry.poses}</span>
              </div>
              <div>
                <span className="text-slate-400">VFX: </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{telemetry.activeVfx}</span>
              </div>
            </div>
          </div>

          {/* Fullscreen Trigger */}
          <button
            onClick={toggleFullScreen}
            className="absolute bottom-4 right-4 z-20 p-2.5 sm:p-3 bg-white/80 dark:bg-slate-900/80 hover:bg-cyan-600 dark:hover:bg-cyan-500 hover:text-white text-slate-700 dark:text-slate-300 rounded-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-md shadow-lg transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Feature Toggles Console */}
        <div className="w-full mt-4 p-3.5 sm:p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-wrap items-center justify-between gap-2.5 text-xs font-semibold">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
            <Layers size={13} className="text-cyan-500" />
            <span>Active Layers:</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {/* Face Mesh Toggle */}
            <button
              onClick={() => setShowFaceMesh(!showFaceMesh)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                showFaceMesh
                  ? "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-400"
              }`}
            >
              <Eye size={13} />
              <span>Face Mesh</span>
            </button>

            {/* Hand Tracking Toggle */}
            <button
              onClick={() => setShowHands(!showHands)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                showHands
                  ? "bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500/40 text-cyan-700 dark:text-cyan-300"
                  : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-400"
              }`}
            >
              <Hand size={13} />
              <span>Hands</span>
            </button>

            {/* Body Pose Toggle */}
            <button
              onClick={() => setShowPoses(!showPoses)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                showPoses
                  ? "bg-fuchsia-500/10 dark:bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-700 dark:text-fuchsia-300"
                  : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-400"
              }`}
            >
              <Activity size={13} />
              <span>Poses</span>
            </button>

            {/* DBZ Energy VFX Toggle */}
            <button
              onClick={() => setShowVFX(!showVFX)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                showVFX
                  ? "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300"
                  : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-400"
              }`}
            >
              <Zap size={13} />
              <span>Energy VFX</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/40 text-purple-700 dark:text-purple-300"
                  : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-400"
              }`}
              title={soundEnabled ? "Mute audio effects" : "Enable audio effects"}
            >
              {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{soundEnabled ? "SFX On" : "Muted"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Gesture & Engineering Guide */}
      <div className="w-full max-w-5xl mt-8 mb-6 z-10">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
          Interactive Gesture Controls &amp; Capabilities:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Spirit Bomb */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1.5 hover:border-cyan-500/40 transition-all">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-2">
              <Flame size={15} />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Spirit Bomb</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Raise both arms high above your head to spawn and grow a celestial energy sphere.
            </p>
          </div>

          {/* Card 2: Kamehameha */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1.5 hover:border-cyan-500/40 transition-all">
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
              <Zap size={15} />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Kamehameha</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Bring both palms close together in front of the lens to charge dense plasma lightning.
            </p>
          </div>

          {/* Card 3: 468-Point Mesh */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1.5 hover:border-cyan-500/40 transition-all">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
              <Eye size={15} />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">3D Face Mesh</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              468 high-precision vertex points map micro-expressions and depth in real-time.
            </p>
          </div>

          {/* Card 4: Local Privacy */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1.5 hover:border-cyan-500/40 transition-all">
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
              <ShieldCheck size={15} />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Local Inference</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              100% private. All video frames are computed in memory on your WebGL GPU.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
