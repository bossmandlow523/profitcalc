"use client";

import React from "react";
import { Plus } from "lucide-react";

interface TextColorProps {
  words?: string[];
  className?: string;
}

export function TextColor({
  words = ["Develop.", "Preview.", "Ship."],
  className = ""
}: TextColorProps) {
  // Map index to specific animation classes (Tailwind needs explicit class names)
  const getAnimationClasses = (index: number) => {
    const animations = [
      {
        background: "before:animate-gradient-background-1",
        foreground: "animate-gradient-foreground-1",
        gradientFrom: "from-gradient-1-start",
        gradientTo: "to-gradient-1-end"
      },
      {
        background: "before:animate-gradient-background-2",
        foreground: "animate-gradient-foreground-2",
        gradientFrom: "from-gradient-2-start",
        gradientTo: "to-gradient-2-end"
      },
      {
        background: "before:animate-gradient-background-3",
        foreground: "animate-gradient-foreground-3",
        gradientFrom: "from-gradient-3-start",
        gradientTo: "to-gradient-3-end"
      }
    ];
    return animations[index % 3];
  };

  return (
    <div className={className}>
      <div className="mb-10 mt-4 md:mt-6">
        <div className="px-2">
          <div className="relative p-8 w-full h-full border border-slate-200 dark:border-slate-800 [mask-image:radial-gradient(200rem_24rem_at_center,white,transparent)]">
            <h1 className="tracking-tighter flex select-none px-3 py-2 flex-col text-center text-7xl font-extrabold leading-none sm:text-8xl md:flex-col lg:flex-row">
              <Plus className="absolute -left-4 -top-4 h-8 w-8 text-indigo-500" />
              <Plus className="absolute -bottom-4 -left-4 h-8 w-8 text-indigo-500" />
              <Plus className="absolute -right-4 -top-4 h-8 w-8 text-indigo-500" />
              <Plus className="absolute -bottom-4 -right-4 h-8 w-8 text-indigo-500" />

              {words.map((word, index) => {
                const animations = getAnimationClasses(index);
                return (
                  <span
                    key={index}
                    data-content={word}
                    className={`${animations.background} relative before:absolute before:bottom-4 before:left-0 before:top-0 before:z-0 before:w-full before:px-2 before:content-[attr(data-content)] sm:before:top-0`}
                  >
                    <span className={`${animations.gradientFrom} ${animations.gradientTo} ${animations.foreground} bg-gradient-to-r bg-clip-text px-2 text-transparent sm:px-5`}>
                      {word}
                    </span>
                  </span>
                );
              })}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
