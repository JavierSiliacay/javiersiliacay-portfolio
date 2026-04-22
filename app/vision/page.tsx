"use client";

import React, { useEffect, useRef, useState } from "react";
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

export default function HighFidelityVisionDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let handDetector: handPoseDetectionTypes.HandDetector | null = null;
    let faceDetector: faceLandmarksDetectionTypes.FaceLandmarksDetector | null = null;
    let poseDetector: poseDetectionTypes.PoseDetector | null = null;
    let animationFrameId: number;

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

        // 1. Initialize High-Fidelity Hand Tracking (Crowd Scale)
        handDetector = await handPoseDetection.createDetector(
          handPoseDetection.SupportedModels.MediaPipeHands,
          {
            runtime: 'tfjs',
            modelType: 'lite', // Lite is significantly faster and often better for close-up distinct palm geometries
            maxHands: 6,
          }
        );

        // 2. Initialize Precise Face Landmarks Mapping (Crowd Scale)
        faceDetector = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: 'tfjs',
            refineLandmarks: true, 
            maxFaces: 6,
          }
        );

        // 3. Initialize Multi-Person Skeleton Tracking (Overall Body/Crowd)
        poseDetector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
            enableTracking: true,
            trackerType: poseDetection.TrackerType.BoundingBox
          }
        );

        await setupCamera();
        setIsLoaded(true);
        detectFeatures();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error(e);
        setError("Failed to load precision models. Ensure camera permissions.");
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

      try {
        // Run all models simultaneously for temporal smoothing and synced rendering
        const [hands, faces, poses] = await Promise.all([
          handDetector.estimateHands(video, { flipHorizontal: false }),
          faceDetector.estimateFaces(video, { flipHorizontal: false }),
          poseDetector!.estimatePoses(video, { flipHorizontal: false })
        ]);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const safeHands = hands || [];
        const safeFaces = faces || [];
        const safePoses = poses || [];

        // -- DEBUG OVERLAY --
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)"; // Darker background
        ctx.fillRect(10, 10, 240, 80);
        ctx.fillStyle = "#ffffff"; // Pure white for visibility
        ctx.font = "bold 16px monospace";
        ctx.fillText(`Hand Detections: ${safeHands.length}`, 25, 36);
        ctx.fillStyle = safeFaces.length > 0 ? "#39ff14" : "#ff0000"; // Green / Red
        const faceText = safeFaces.length > 0 ? `Active (${safeFaces.length * 468} pts)` : 'Searching...';
        ctx.fillText(`Face Mesh: ${faceText}`, 25, 56);
        ctx.fillStyle = "#ff00ff"; // Pink for bodies
        ctx.fillText(`Body Poses: ${safePoses.length}`, 25, 76);

        // ==========================================================
        // 0. RENDER BACKGROUND POSES (Generic body detection)
        // ==========================================================
        const skeletonEdges = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
        safePoses.forEach((pose: poseDetectionTypes.Pose) => {
           ctx.shadowBlur = 10;
           ctx.shadowColor = "#ff00ff";
           ctx.strokeStyle = "rgba(255, 0, 255, 0.8)";
           ctx.lineWidth = 3;

           // 1. Draw Sci-Fi Head Targeting Box instead of the ugly facial "W" line
           const faceKps = pose.keypoints.slice(0, 5);
           const validFaceKps = faceKps.filter(kp => (kp.score || 0) > 0.3);
           
           if (validFaceKps.length >= 2) { 
             const minX = Math.min(...validFaceKps.map(k => k.x));
             const maxX = Math.max(...validFaceKps.map(k => k.x));
             const minY = Math.min(...validFaceKps.map(k => k.y));
             const maxY = Math.max(...validFaceKps.map(k => k.y));
             
             // Dynamically expand box slightly around the detected facial features
             const w = Math.max(40, (maxX - minX) * 1.8);
             const h = Math.max(40, (maxY - minY) * 2.2);
             const cx = minX + (maxX - minX) / 2;
             const cy = minY + (maxY - minY) / 2;
             const bx = cx - w / 2;
             const by = cy - h / 2 - (h * 0.1); // Shift up slightly for forehead
             
             // Draw targeting brackets [ ] around the head
             const cr = Math.min(w, h) * 0.25; // Corner bracket length
             ctx.beginPath();
             // Top Left
             ctx.moveTo(bx + cr, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by + cr);
             // Top Right
             ctx.moveTo(bx + w - cr, by); ctx.lineTo(bx + w, by); ctx.lineTo(bx + w, by + cr);
             // Bottom Left
             ctx.moveTo(bx + cr, by + h); ctx.lineTo(bx, by + h); ctx.lineTo(bx, by + h - cr);
             // Bottom Right
             ctx.moveTo(bx + w - cr, by + h); ctx.lineTo(bx + w, by + h); ctx.lineTo(bx + w, by + h - cr);
             ctx.stroke();
           }

           // 2. Draw Body Joints (excluding redundant face dots)
           ctx.fillStyle = "#ff00ff";
           pose.keypoints.forEach((kp, index) => {
             if (index < 5) return; // Skip face tracking points to keep mesh clean
             if ((kp.score || 0) > 0.4) {
               ctx.beginPath();
               ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
               ctx.fill();
             }
           });
           
           // 3. Draw Body Bones (excluding the messy "W" facial connections)
           ctx.lineWidth = 4;
           ctx.beginPath();
           skeletonEdges.forEach(([i, j]: number[]) => {
             if (i < 5 && j < 5) return; // Completely mute facial lines
             
             const kp1 = pose.keypoints[i];
             const kp2 = pose.keypoints[j];
             if ((kp1.score || 0) > 0.35 && (kp2.score || 0) > 0.35) {
               ctx.moveTo(kp1.x, kp1.y);
               ctx.lineTo(kp2.x, kp2.y);
             }
           });
           ctx.stroke();
           
           ctx.shadowBlur = 0;

           // ==========================================================
           // 4. DBZ SPIRIT BOMB EASTER EGG (Arms Raised to the Sky!)
           // ==========================================================
           const leftWrist = pose.keypoints[9];
           const rightWrist = pose.keypoints[10];
           const nose = pose.keypoints[0];

           if ((leftWrist.score || 0) > 0.4 && (rightWrist.score || 0) > 0.4 && (nose.score || 0) > 0.4) {
             // In Canvas, Y goes DOWN. So if wrists are LESS than nose, arms are in the air!
             if (leftWrist.y < nose.y - 40 && rightWrist.y < nose.y - 40) {
               
               // Center the massive bomb between the two raised hands
               const cx = (leftWrist.x + rightWrist.x) / 2;
               const cy = Math.min(leftWrist.y, rightWrist.y) - 60; // Float slightly above the hands
               
               const time = Date.now();
               const pulse = Math.sin(time / 150) * 30; // Slow, massive throb
               const altitudeBonus = Math.max(0, nose.y - Math.max(leftWrist.y, rightWrist.y));
               
               // The higher they reach, the bigger the spirit bomb gets! Maximum 250px radius.
               const radius = Math.min(250, 100 + pulse + (altitudeBonus * 0.8)); 

               ctx.shadowBlur = 100 + pulse;
               ctx.shadowColor = "#add8e6"; // Blueish glow
               
               const gradient = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
               gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // Star-white core
               gradient.addColorStop(0.15, "rgba(100, 200, 255, 0.9)"); // Bright blue
               gradient.addColorStop(0.5, "rgba(0, 100, 255, 0.6)"); // Deep blue
               gradient.addColorStop(1, "rgba(0, 50, 255, 0)"); // Fade out
               
               ctx.beginPath();
               ctx.fillStyle = gradient;
               ctx.arc(cx, cy, radius, 0, Math.PI * 2);
               ctx.fill();
               
               // Outer swirling energy rings
               ctx.strokeStyle = "rgba(100, 200, 255, 0.4)";
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
        });

        // ==========================================================
        // 1. RENDER HANDS (Palm contours, full finger tracing)
        // ==========================================================
        safeHands.forEach((hand: handPoseDetectionTypes.Hand) => {
          // Different colors for left vs right hand recognition
          const isLeft = hand.handedness === 'Left';
          const color = isLeft ? '#ff00ff' : '#00ffff'; 
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';

          // Specific tracing arrays to draw the palm and fingers properly
          const thumb = [0, 1, 2, 3, 4];
          const index = [0, 5, 6, 7, 8];
          const middle = [9, 10, 11, 12];
          const ring = [13, 14, 15, 16];
          const pinky = [17, 18, 19, 20];
          const palmBase = [0, 5, 9, 13, 17, 0]; // Traces the base contour of the palm

          const fingers = [thumb, index, middle, ring, pinky, palmBase];

          fingers.forEach((fingerIndices) => {
            ctx.beginPath();
            fingerIndices.forEach((idx, i) => {
              const kp = hand.keypoints[idx];
              if (i === 0) ctx.moveTo(kp.x, kp.y);
              else ctx.lineTo(kp.x, kp.y);
            });
            // Connect middle, ring, pinky base strictly to wrist for complete mapping
            if (fingerIndices === middle || fingerIndices === ring || fingerIndices === pinky) {
                ctx.moveTo(hand.keypoints[0].x, hand.keypoints[0].y);
                ctx.lineTo(hand.keypoints[fingerIndices[0]].x, hand.keypoints[fingerIndices[0]].y);
            }
            ctx.stroke();
          });

          // Draw individual knuckles / landmarks as distinct points
          hand.keypoints.forEach((kp) => {
             ctx.beginPath();
             ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
             ctx.fillStyle = '#ffffff';
             ctx.fill();
             ctx.strokeStyle = color;
             ctx.lineWidth = 1;
             ctx.stroke();
          });
        });

        // ==========================================================
        // 1.5 DBZ KAMEHAMEHA EASTER EGG (Two-Hand Interaction)
        // ==========================================================
        if (safeHands.length >= 2) {
          for (let i = 0; i < safeHands.length; i++) {
            for (let j = i + 1; j < safeHands.length; j++) {
              const h1 = safeHands[i];
              const h2 = safeHands[j];
              
              // Point 9 is the center of the palm base
              const p1 = h1.keypoints[9];
              const p2 = h2.keypoints[9];
              
              if (!p1 || !p2) continue;

              const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
              
              // If palms are brought directly together... CHARGE IT UP!
              if (dist < 200) { 
                const cx = (p1.x + p2.x) / 2;
                const cy = (p1.y + p2.y) / 2;
                
                // The closer the hands, the bigger the ball gets!
                const time = Date.now();
                const pulse = Math.sin(time / 60) * 15; // Fast strobe
                const chargeScale = (200 - dist) * 0.8; // Grow as hands close
                const radius = Math.max(30, 40 + pulse + chargeScale);
                
                // Extreme Neon Strobe effect
                ctx.shadowBlur = 100 + pulse * 2;
                ctx.shadowColor = "#00ffff"; // Blinding cyan glow
                
                // Draw inner plasma core
                const gradient = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
                gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // Supernova white core
                gradient.addColorStop(0.2, "rgba(100, 255, 255, 0.9)"); // Hot cyan
                gradient.addColorStop(0.6, "rgba(0, 200, 255, 0.6)"); 
                gradient.addColorStop(1, "rgba(0, 150, 255, 0)"); // Dissipate
                
                ctx.beginPath();
                ctx.fillStyle = gradient;
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Add chaotic plasma lightning arcs ripping around the sphere
                ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
                ctx.shadowBlur = 10;
                for (let k = 0; k < 6; k++) {
                  ctx.lineWidth = Math.random() * 3 + 1;
                  ctx.beginPath();
                  const angle1 = Math.random() * Math.PI * 2;
                  const angle2 = angle1 + (Math.random() * 1.5);
                  const arcRad = radius + (Math.random() * 30);
                  ctx.arc(cx, cy, arcRad, angle1, angle2);
                  ctx.stroke();
                }
                
                ctx.shadowBlur = 0; // Reset for face mesh
              }
            }
          }
        }

        // ==========================================================
        // 2. RENDER FACE (Precise contours: jawline, eyes, lips)
        // ==========================================================
        safeFaces.forEach((face: faceLandmarksDetectionTypes.Face) => {
           const pairs = faceLandmarksDetection.util.getAdjacentPairs(faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh);
           
           // Render the dense mesh with a very thin line to avoid muddying the image
           ctx.strokeStyle = 'rgba(57, 255, 20, 0.35)'; // Cyber Green, transparent
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

           // Add tiny highlight dots on the mesh vertices for that futuristic mapping aesthetic
           ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
           face.keypoints.forEach((kp) => {
             ctx.beginPath();
             // We map standard z coordinates to size for depth illusion (z is negative when closer to camera)
             const size = Math.max(0.2, 1.2 - ((kp.z || 0) / 20)); 
             ctx.arc(kp.x, kp.y, size, 0, 2 * Math.PI);
             ctx.fill();
           });
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Frame processing error:", err);
        setError("AI Crash: " + (err.message || String(err)));
        // Stop the loop if it crashed completely
        return;
      }

      animationFrameId = requestAnimationFrame(detectFeatures);
    };

    initDetectors();

    // Store the video element reference so cleanup is robust
    const currentVideo = videoRef.current;

    // Cleanup on unmount
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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black z-0 pointer-events-none"></div>

      <div className="z-10 text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
          Cyber<span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">Vision</span>
        </h1>
        <p className="text-neutral-400 max-w-2xl text-lg font-light">
          High-fidelity tracking running locally. Features dense 468-point facial contour mapping and detailed hand tracking.
        </p>
      </div>
      
      <div className="z-10 relative flex w-full max-w-6xl justify-center">
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl z-30 border border-neutral-800 backdrop-blur-sm">
             <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
             <p className="text-cyan-400 font-mono tracking-widest text-sm uppercase">Loading Precision Models...</p>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-950/80 rounded-2xl z-30 border border-red-500 backdrop-blur-md">
            <div className="text-red-400 font-bold p-6 text-center max-w-lg">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div ref={containerRef} className="group relative rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,255,255,0.15)] ring-1 ring-white/10 aspect-video w-full bg-black">
          {/* Event branding overlay */}
          <div className="absolute top-6 right-6 z-40 pointer-events-none drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] opacity-90 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/ustp-autotronics-logo.png" 
              alt="USTP Autotronics Event Logo" 
              className="h-28 md:h-40 lg:h-48 w-auto object-contain" 
            />
          </div>
          <video 
            ref={videoRef} 
            width={1280}
            height={720}
            className="w-full h-full object-cover opacity-90"
            playsInline 
            muted 
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full object-cover z-10 pointer-events-none"
          />
          
          <button 
            onClick={toggleFullScreen}
            className="absolute bottom-4 right-4 z-50 p-3 bg-black/60 hover:bg-cyan-900/80 rounded-full text-white border border-white/20 backdrop-blur-md transition-all opacity-30 hover:opacity-100 group-hover:opacity-100"
            title="Toggle Fullscreen"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
