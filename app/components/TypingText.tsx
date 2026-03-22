"use client";

import { useState, useEffect } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  repeatCount?: number; // number of times to repeat after first full typing
  pauseAfterMs?: number; // pause before restarting
}

export default function TypingText({
  text,
  speed = 80,
  repeatCount = 3,
  pauseAfterMs = 2000
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [cycle, setCycle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const timer = setTimeout(() => {
        if (cycle < repeatCount) {
          setDisplayed("");
          setCycle((prev) => prev + 1);
          setIsPaused(false);
        } // else: stop, keep full text
      }, pauseAfterMs);
      return () => clearTimeout(timer);
    } else if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      // Full text shown, pause then restart (if cycles left)
      setIsPaused(true);
    }
  }, [displayed, text, speed, cycle, repeatCount, pauseAfterMs, isPaused]);

  return (
    <span>
      {displayed}
      <span className={`inline-block w-1 h-8 ml-1 align-middle bg-primary-400 transition-opacity ${isPaused || displayed.length === text.length ? 'opacity-0' : 'opacity-100'}`} />
    </span>
  );
}
