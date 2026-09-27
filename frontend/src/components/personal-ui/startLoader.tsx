"use client";

import { useEffect, useState } from "react";
import { NumberTicker } from "../ui/number-ticker";

export function StartLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Fade out starts at 3.6s, unmounts at 4.0s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3600);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-400 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div>
        <NumberTicker
      value={100}
      className="text-8xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
    /> <span className="text-8xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white">%...</span>
      </div>
      
    </div>
  );
}

export default StartLoader;
