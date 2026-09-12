"use client";

import React from "react";

interface TechLogoProps {
  name: string;
  className?: string;
  size?: number;
}

export default function TechLogo({ name, className = "w-3.5 h-3.5 shrink-0", size = 14 }: TechLogoProps) {
  const lower = name.toLowerCase();

  // Next.js
  if (lower.includes("next")) {
    return (
      <svg width={size} height={size} viewBox="0 0 180 180" fill="none" className={className}>
        <mask id="mask0_next" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="black" />
        </mask>
        <g mask="url(#mask0_next)">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
          <path d="M149.508 157.438L69.1555 54H54V125.968H66.8407V69.3789L139.789 164.857C143.208 162.617 146.46 160.134 149.508 157.438Z" fill="var(--bg-card, #0c0c0f)" />
          <rect x="115" y="54" width="12.84" height="71.97" fill="var(--bg-card, #0c0c0f)" />
        </g>
      </svg>
    );
  }

  // React
  if (lower.includes("react")) {
    return (
      <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none" className={className}>
        <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
        <g stroke="#00d8ff" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // TypeScript
  if (lower.includes("typescript")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <rect width="128" height="128" rx="16" fill="#3178C6" />
        <path d="M72.4 99.8c2.9 1.8 6.7 2.8 10.7 2.8 9.8 0 15.6-4.9 15.6-13.4 0-7.8-4.9-11.4-14.2-15.3-11.5-4.8-16.7-10.7-16.7-19.9 0-11.8 9.3-20.4 23.5-20.4 4.5 0 8.3.9 11.2 2.3l-2.7 9.8c-2.4-1.2-5.4-2-8.8-2-8.3 0-13.2 4.4-13.2 10.6 0 7.3 4.8 10.4 14.1 14.3 12.1 5.2 16.9 11.3 16.9 21.1 0 13.5-10.2 21.6-26.1 21.6-5.8 0-10.9-1.3-14.5-3.1l4.2-8.4zM24 43.6h38.2v9.6H48.4v48.6H37.8V53.2H24v-9.6z" fill="#FFFFFF" />
      </svg>
    );
  }

  // PostgreSQL
  if (lower.includes("postgres")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M64 8c-30.9 0-56 25.1-56 56s25.1 56 56 56 56-25.1 56-56-25.1-56-56-56zm25.9 76.5c-1.3 3.8-3.4 6.7-6.2 8.7-2.8 2-6.3 3-10.4 3-2.6 0-5.1-.5-7.5-1.5-2.4-1-4.7-2.6-6.9-4.8l4.4-6.4c1.8 1.7 3.5 3 5.1 3.7 1.6.7 3.3 1.1 5 1.1 2.2 0 4-.5 5.3-1.6 1.3-1.1 2.3-2.6 3-4.6.4-1.2.6-2.9.6-5.1V58.7H69.4V51h20.5v33.5z" fill="#336791" />
      </svg>
    );
  }

  // Supabase
  if (lower.includes("supabase")) {
    return (
      <svg width={size} height={size} viewBox="0 0 109 113" fill="none" className={className}>
        <path d="M63.7076 110.284C60.548 114.288 54.0449 112.094 53.9723 106.984L53.074 43.784H98.0589C105.748 43.784 109.914 52.7538 105.025 58.7062L63.7076 110.284Z" fill="#3ECF8E" />
        <path d="M45.297 2.71603C48.4566 -1.28805 54.9597 0.906161 55.0323 6.01579L55.9306 69.2158H10.9457C3.25646 69.2158 -0.909564 60.246 3.97918 54.2936L45.297 2.71603Z" fill="#3ECF8E" fillOpacity="0.75" />
      </svg>
    );
  }

  // Prisma
  if (lower.includes("prisma")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M107.5 106.3L67.7 14.8c-1.3-3-4.5-4.8-7.7-4.4-3.2.4-5.8 2.7-6.5 5.8L21.3 78.4c-.8 3.5.5 7.1 3.3 9.4l43.2 35.7c2.3 1.9 5.3 2.7 8.2 2.2 2.9-.5 5.4-2.1 6.8-4.6l24.7-14.8z" fill="#2D3748" />
        <path d="M68.5 25.4L98.9 95.7 69.4 113.4 33.2 83.5l23.5-51.1 11.8-7z" fill="#0C344B" />
        <path d="M68.5 25.4l-.1 88 30.5-17.7L68.5 25.4z" fill="#16A394" />
      </svg>
    );
  }

  // Firebase
  if (lower.includes("firebase")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M22.9 88.5L38.4 20.3c.7-3.1 4.8-4.1 6.9-1.7l16.1 18.5-38.5 51.4z" fill="#FFA000" />
        <path d="M22.9 88.5L5.7 101.4c-2.7 2-3.1 6-.9 8.6L55.8 126c2.4 1.4 5.3 1.4 7.7 0l47.7-27.4-88.3-10.1z" fill="#FF6F00" />
        <path d="M84.3 46.1l-18-34.5c-1.4-2.7-5.3-2.7-6.7 0L50.4 29.8 84.3 46.1z" fill="#FFC107" />
        <path d="M105.1 88.5L84.3 46.1 22.9 88.5l38.2 37.5 44-37.5z" fill="#FFCA28" />
      </svg>
    );
  }

  // Node.js
  if (lower.includes("node")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M64 9.5l49.8 28.8v57.4L64 124.5l-49.8-28.8V38.3L64 9.5z" fill="#539E43" />
        <path d="M64 21.6L24.5 44.4v45.6L64 112.8l39.5-22.8V44.4L64 21.6z" fill="#333333" />
        <path d="M64 45.4c-10.5 0-19 8.5-19 19s8.5 19 19 19 19-8.5 19-19-8.5-19-19-19zm-3.4 27.5l-8.2-12.7h6.6l4.9 7.7 4.9-7.7h6.6l-8.2 12.7v7.9h-6.6v-7.9z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Tailwind CSS
  if (lower.includes("tailwind")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M32 48c5.3-10.7 13.3-16 24-16 16 0 21.3 12 30.7 17.3C92.7 52.7 99.3 52 108 44c-5.3 10.7-13.3 16-24 16-16 0-21.3-12-30.7-17.3C47.3 39.3 40.7 40 32 48zm-20 32c5.3-10.7 13.3-16 24-16 16 0 21.3 12 30.7 17.3C72.7 84.7 79.3 84 88 76c-5.3 10.7-13.3 16-24 16-16 0-21.3-12-30.7-17.3C27.3 71.3 20.7 72 12 80z" fill="#38BDF8" />
      </svg>
    );
  }

  // Neon Database / Postgres
  if (lower.includes("neon")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M5.5 3L19.5 12L5.5 21V3Z" fill="#00E599" />
      </svg>
    );
  }

  // Drizzle ORM
  if (lower.includes("drizzle")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2.5C8.5 7.5 4.5 11.5 4.5 15.5a7.5 7.5 0 1015 0c0-4-4-8-7.5-13z" fill="#C5F74F" />
      </svg>
    );
  }

  // Leaflet Maps
  if (lower.includes("leaflet")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M20 4c-8 0-14 6-14 14 0 2 1 2 2 2 8 0 14-6 14-14 0-1-1-2-2-2z" fill="#199900" />
      </svg>
    );
  }

  // Vercel
  if (lower.includes("vercel")) {
    return (
      <svg width={size} height={size} viewBox="0 0 116 100" fill="none" className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0Z" fill="currentColor" />
      </svg>
    );
  }

  // Python
  if (lower.includes("python")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M63.5 8c-28.8 0-27.1 12.5-27.1 12.5l.03 12.9h27.6v3.9H25.3S8 35.3 8 64.2c0 28.8 15.1 27.8 15.1 27.8h9v-12.7s-.5-15.1 14.8-15.1h25.4s14.4.2 14.4-13.9V22.4S88.9 8 63.5 8zm-14.7 8.3c2.7 0 4.9 2.2 4.9 4.9s-2.2 4.9-4.9 4.9-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9z" fill="#3776AB" />
        <path d="M64.5 120c28.8 0 27.1-12.5 27.1-12.5l-.03-12.9H64v-3.9h38.7S120 92.7 120 63.8c0-28.8-15.1-27.8-15.1-27.8h-9v12.7s.5 15.1-14.8 15.1H55.7s-14.4-.2-14.4 13.9v27.9s-2.2 14.4 23.2 14.4zm14.7-8.3c-2.7 0-4.9-2.2-4.9-4.9s2.2-4.9 4.9-4.9 4.9 2.2 4.9 4.9-2.2 4.9-4.9 4.9z" fill="#FFD438" />
      </svg>
    );
  }

  // TensorFlow
  if (lower.includes("tensorflow") || lower.includes("tf")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M64 8l54 31.2v61.6L64 124 10 100.8V39.2L64 8z" fill="#FF6F00" />
        <path d="M64 24l40 23.1v45.6L64 108.8 24 92.7V47.1L64 24z" fill="#FFA000" />
        <path d="M64 36l28 16.2v32L64 95.8 36 84.2V52.2L64 36z" fill="#FFFFFF" />
      </svg>
    );
  }

  // OpenCV
  if (lower.includes("opencv")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <circle cx="64" cy="38" r="26" stroke="#ED1C24" strokeWidth="10" fill="none" />
        <circle cx="38" cy="84" r="26" stroke="#22B14C" strokeWidth="10" fill="none" />
        <circle cx="90" cy="84" r="26" stroke="#00A2E8" strokeWidth="10" fill="none" />
      </svg>
    );
  }

  // MediaPipe
  if (lower.includes("mediapipe")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <circle cx="36" cy="36" r="16" fill="#00C4B4" />
        <circle cx="92" cy="36" r="16" fill="#2563EB" />
        <circle cx="64" cy="92" r="16" fill="#06B6D4" />
        <path d="M36 36L64 92M92 36L64 92M36 36H92" stroke="#00C4B4" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }

  // LangChain
  if (lower.includes("langchain")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <circle cx="44" cy="48" r="20" fill="#1C3C3C" stroke="#10B981" strokeWidth="6" />
        <circle cx="84" cy="80" r="20" fill="#1C3C3C" stroke="#10B981" strokeWidth="6" />
        <path d="M44 48C58 48 70 80 84 80" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
        <circle cx="44" cy="48" r="8" fill="#10B981" />
        <circle cx="84" cy="80" r="8" fill="#10B981" />
      </svg>
    );
  }

  // OpenAI
  if (lower.includes("openai")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M115.5 53.8c-1.3-8.8-7.3-16.1-15.5-19.1V28c0-8.8-6.3-16.4-15.1-18.1-10.7-2.1-21 4.5-23.7 14.8L59 34.5c-3.7-2.2-8-3.3-12.4-3.3-13.8 0-25 11.2-25 25 0 2.2.3 4.4.9 6.5C14 65.5 8 72.8 8 81.6c0 13.8 11.2 25 25 25h12.5c3.7 2.2 8 3.3 12.4 3.3 13.8 0 25-11.2 25-25 0-2.2-.3-4.4-.9-6.5 8.5-2.8 14.5-10.1 14.5-18.9 0-2-.2-3.9-.7-5.7z" fill="#10A37F" />
      </svg>
    );
  }

  // Google / Google OAuth
  if (lower.includes("google") || lower.includes("oauth")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
      </svg>
    );
  }

  // Google Gemini
  if (lower.includes("gemini")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="9" stroke="#1A73E8" strokeWidth="2.5" />
        <circle cx="12" cy="12" r="4" fill="#1A73E8" />
      </svg>
    );
  }

  // WebGL
  if (lower.includes("webgl")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M64 12L112 39.7V95.3L64 123 16 95.3V39.7L64 12Z" stroke="#990000" strokeWidth="8" fill="#990000" fillOpacity="0.2" />
        <path d="M64 12V67.5M112 95.3L64 67.5M16 95.3L64 67.5" stroke="#990000" strokeWidth="6" />
      </svg>
    );
  }

  // Arduino
  if (lower.includes("arduino")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <circle cx="42" cy="64" r="28" stroke="#00979D" strokeWidth="10" fill="none" />
        <circle cx="86" cy="64" r="28" stroke="#00979D" strokeWidth="10" fill="none" />
        <path d="M34 64h16M78 64h16M86 56v16" stroke="#00979D" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  // Raspberry Pi / Linux
  if (lower.includes("raspberry") || lower.includes("linux")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M64 42c-7.7-14.8-21.7-10.4-21.7-10.4 3 8 7.3 12.5 9.7 14.4M64 42c7.7-14.8 21.7-10.4 21.7-10.4-3 8-7.3 12.5-9.7 14.4" stroke="#75A928" strokeWidth="8" strokeLinecap="round" />
        <circle cx="44" cy="66" r="14" fill="#C51A4A" />
        <circle cx="84" cy="66" r="14" fill="#C51A4A" />
        <circle cx="64" cy="74" r="15" fill="#C51A4A" />
        <circle cx="50" cy="94" r="13" fill="#C51A4A" />
        <circle cx="78" cy="94" r="13" fill="#C51A4A" />
        <circle cx="64" cy="108" r="10" fill="#C51A4A" />
      </svg>
    );
  }

  // ESP32 / Espressif / Microcontroller SoC
  if (lower.includes("esp32") || lower.includes("esp8266") || lower.includes("realtek") || lower.includes("risc-v")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <rect x="24" y="24" width="80" height="80" rx="12" fill="#E7352C" />
        <rect x="36" y="36" width="56" height="56" rx="6" fill="#1E293B" />
        {/* Chip Pins */}
        <path d="M44 14v10M64 14v10M84 14v10M44 104v10M64 104v10M84 104v10M14 44h10M14 64h10M14 84h10M104 44h10M104 64h10M104 84h10" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
        <circle cx="64" cy="64" r="10" fill="#E7352C" />
      </svg>
    );
  }

  // Embedded C++
  if (lower.includes("c++") || lower.includes("embedded")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M64 14L108 39.4V90.6L64 116 20 90.6V39.4L64 14Z" fill="#00599C" />
        <path d="M52 50c-7.7 0-14 6.3-14 14s6.3 14 14 14c5.1 0 9.6-2.8 12.1-6.9l-5.6-3.2c-1.3 2.1-3.7 3.5-6.5 3.5-4.1 0-7.4-3.3-7.4-7.4s3.3-7.4 7.4-7.4c2.8 0 5.2 1.4 6.5 3.5l5.6-3.2C61.6 52.8 57.1 50 52 50zm26 10h-4v-4h-4v4h-4v4h4v4h4v-4h4v-4zm18 0h-4v-4h-4v4h-4v4h4v4h4v-4h4v-4z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Web Serial / USB / Telemetry
  if (lower.includes("serial") || lower.includes("usb")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <circle cx="64" cy="28" r="10" fill="#0284C7" />
        <path d="M64 38v48M44 68l20 18 20-18M44 68v-12" stroke="#0284C7" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="38" y="44" width="12" height="12" fill="#0284C7" />
        <circle cx="64" cy="100" r="8" fill="#0284C7" />
      </svg>
    );
  }

  // MQTT / WebSockets / RF
  if (lower.includes("mqtt") || lower.includes("websocket") || lower.includes("rf")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <circle cx="64" cy="96" r="12" fill="#660066" />
        <path d="M42 74c12-12 32-12 44 0M26 58c21-21 55-21 76 0M10 42c30-30 78-30 108 0" stroke="#660066" strokeWidth="8" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // Android
  if (lower.includes("android")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        {/* Antennas */}
        <path d="M40 26L30 12M88 26L98 12" stroke="#3DDC84" strokeWidth="6" strokeLinecap="round" />
        {/* Head Dome */}
        <path d="M22 62c0-23.2 18.8-42 42-42s42 18.8 42 42H22z" fill="#3DDC84" />
        {/* Eyes */}
        <circle cx="44" cy="46" r="5" fill="#FFFFFF" />
        <circle cx="84" cy="46" r="5" fill="#FFFFFF" />
        {/* Body Outline */}
        <path d="M22 70h84v34c0 6-5 11-11 11H33c-6 0-11-5-11-11V70z" fill="#3DDC84" />
      </svg>
    );
  }

  // OBD-II / CAN Bus / Automotive Diagnostics
  if (lower.includes("obd") || lower.includes("can bus") || lower.includes("automotive") || lower.includes("diagnostics") || lower.includes("spectrometry")) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M24 76l10-32c2-6 8-10 15-10h30c7 0 13 4 15 10l10 32v24c0 4-3 8-8 8h-4c-4 0-8-4-8-8v-6H44v6c0 4-4 8-8 8h-4c-5 0-8-4-8-8V76z" fill="#0EA5E9" />
        <circle cx="42" cy="80" r="7" fill="#FFFFFF" />
        <circle cx="86" cy="80" r="7" fill="#FFFFFF" />
        <path d="M38 48h52l-6-14H44l-6 14z" fill="#0369A1" />
      </svg>
    );
  }

  // Default Fallback Terminal / Code Icon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}
