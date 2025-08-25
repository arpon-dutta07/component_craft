"use client";

import { useState, useRef, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { MousePointerClick, Check } from "lucide-react";

type ButtonProps = React.ComponentProps<typeof Button>;

interface ParticleButtonProps extends ButtonProps {
  onSuccess?: () => void;
  successDuration?: number;
  particleCount?: number;
  particleColors?: string[];
}

function SuccessParticles({
  buttonRef,
  particleCount = 6,
  particleColors = ["#000", "#fff", "#facc15", "#ef4444", "#3b82f6"],
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
  particleCount?: number;
  particleColors?: string[];
}) {
  const rect = buttonRef.current?.getBoundingClientRect();
  if (!rect) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return (
    <AnimatePresence>
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1.5 h-1.5 rounded-full"
          style={{
            left: centerX,
            top: centerY,
            backgroundColor: particleColors[i % particleColors.length],
          }}
          initial={{
            scale: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            x: [0, (i % 2 ? 1 : -1) * (Math.random() * 60 + 30)],
            y: [0, -Math.random() * 60 - 20],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.7,
            delay: i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  );
}

export default function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 1200,
  particleCount = 6,
  particleColors,
  className,
  ...props
}: ParticleButtonProps) {
  const [showParticles, setShowParticles] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) await onClick(e);

    setShowParticles(true);

    setTimeout(() => {
      setShowParticles(false);
      setIsSuccess(true);

      if (onSuccess) onSuccess();

      setTimeout(() => setIsSuccess(false), 1000);
    }, successDuration);
  };

  return (
    <>
      {showParticles && (
        <SuccessParticles
          buttonRef={buttonRef as RefObject<HTMLButtonElement>}
          particleCount={particleCount}
          particleColors={particleColors}
        />
      )}
      <Button
        ref={buttonRef}
        onClick={handleClick}
        className={cn(
          "relative flex items-center gap-2 font-medium",
          showParticles && "scale-95",
          "transition-transform duration-150",
          className
        )}
        {...props}
      >
        {isSuccess ? (
          <>
            <Check className="h-4 w-4 text-green-500" />
            Success
          </>
        ) : (
          <>
            {children}
            <MousePointerClick className="h-4 w-4" />
          </>
        )}
      </Button>
    </>
  );
}
