"use client"

import { useEffect, useState } from "react"
import { AnimatedCircularProgressBar } from "../ui/animated-circular-progress-bar"


interface AnimatedProgressBarProps {
  value?: number;
  label?: string;
  gaugePrimaryColor?: string;
  gaugeSecondaryColor?: string;
  className?: string;
}

export function AnimatedProgressBar({
  value: targetValue,
  label,
  gaugePrimaryColor = "currentColor",
  gaugeSecondaryColor = "rgba(120, 120, 120, 0.15)",
  className,
}: AnimatedProgressBarProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (targetValue !== undefined) {
      const timer = setTimeout(() => {
        setValue(targetValue);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      const handleIncrement = (prev: number) => {
        if (prev >= 100) return 0;
        return prev + 10;
      };
      setValue(handleIncrement);
      const interval = setInterval(() => setValue(handleIncrement), 2000);
      return () => clearInterval(interval);
    }
  }, [targetValue]);

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <AnimatedCircularProgressBar
        value={value}
        gaugePrimaryColor={gaugePrimaryColor}
        gaugeSecondaryColor={gaugeSecondaryColor}
        className={className}
      />
      {label && <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>}
    </div>
  );
}
