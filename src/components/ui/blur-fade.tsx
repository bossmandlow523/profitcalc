"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  UseInViewOptions,
  Variants,
} from "motion/react";

type Direction = "up" | "down" | "left" | "right";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  duration?: number;
  delay?: number;
  offset?: number;
  inView?: boolean;
  inViewOptions?: UseInViewOptions;
  blur?: string;
}

export function BlurFade({
  children,
  className,
  direction = "up",
  duration = 0.4,
  delay = 0,
  offset = 6,
  inView = false,
  inViewOptions,
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, inViewOptions || { once: true });
  const isInView = !inView || inViewResult;

  const defaultVariants: Variants = {
    hidden: {
      y: direction === "up" ? offset : direction === "down" ? -offset : 0,
      x: direction === "left" ? offset : direction === "right" ? -offset : 0,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={defaultVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: "easeOut",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
