"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

interface NumberFlowProps {
  value: number;
  format?: Intl.NumberFormatOptions;
  className?: string;
  willChange?: boolean;
  transformTiming?: {
    duration?: number;
    easing?: string;
  };
}

export default function NumberFlow({
  value,
  format = {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  className = "",
  willChange = false,
  transformTiming = { duration: 400, easing: "ease-out" },
}: NumberFlowProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setDirection(value > prevValueRef.current ? "up" : "down");
      prevValueRef.current = value;
      
      // Animate to the new value
      const startTime = Date.now();
      const startValue = displayValue;
      const endValue = value;
      const duration = transformTiming.duration || 400;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use ease-out easing
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easedProgress;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, displayValue, transformTiming.duration]);

  const formattedValue = new Intl.NumberFormat("en-US", format).format(displayValue);

  return (
    <motion.span
      className={className}
      initial={false}
      animate={{
        scale: willChange ? [1, 1.1, 1] : 1,
        color: willChange 
          ? direction === "up" 
            ? ["inherit", "rgb(34, 197, 94)", "inherit"] 
            : ["inherit", "rgb(239, 68, 68)", "inherit"]
          : "inherit",
      }}
      transition={{
        duration: willChange ? 0.6 : 0,
        ease: "easeOut",
      }}
    >
      {formattedValue}
    </motion.span>
  );
}
