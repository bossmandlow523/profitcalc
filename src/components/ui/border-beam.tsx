import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  color?: string;
  duration?: number;
  delay?: number;
}

export function BorderBeam({
  className,
  color = "#3b82f6",
  duration = 3,
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:1px_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[200px] after:animate-border-beam after:[animation-delay:0s] after:[background:linear-gradient(to_left,var(--color),transparent,transparent)] after:[offset-path:rect(0_auto_auto_0_round_200px)]",
        className
      )}
      style={
        {
          "--color": color,
          "--duration": `${duration}s`,
          "--delay": `${delay}s`,
        } as React.CSSProperties
      }
    />
  );
}
