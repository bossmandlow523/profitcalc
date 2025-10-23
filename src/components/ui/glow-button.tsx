import { cn } from "@/lib/utils";

function hexToRgba(hex: string, alpha: number = 1): string {
  let hexValue = hex.replace("#", "");

  if (hexValue.length === 3) {
    hexValue = hexValue
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    console.error("Invalid hex color:", hex);
    return "rgba(0, 0, 0, 1)";
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function GlowButton({
  children,
  className,
  glowColor = "#a3e635",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}) {
  const glowColorRgba = hexToRgba(glowColor);
  const glowColorVia = hexToRgba(glowColor, 0.075);
  const glowColorTo = hexToRgba(glowColor, 0.2);

  return (
    <button
      onClick={onClick}
      style={
        {
          "--glow-color": glowColorRgba,
          "--glow-color-via": glowColorVia,
          "--glow-color-to": glowColorTo,
        } as React.CSSProperties
      }
      className={cn(
        "w-full min-h-10 !px-5 text-sm rounded-md border flex items-center justify-between relative transition-all overflow-hidden bg-gradient-to-t border-r-0 duration-300 whitespace-nowrap group",
        "from-background to-muted text-foreground hover:text-foreground border-border hover:border-[var(--glow-color)] hover:shadow-[0_0_15px_var(--glow-color-via)]",
        "after:inset-0 after:absolute after:rounded-[inherit] after:bg-gradient-to-r after:from-transparent after:from-40% after:via-[var(--glow-color-via)] after:to-[var(--glow-color-to)] after:via-70% after:shadow-[hsl(var(--foreground)/0.15)_0px_1px_0px_inset] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300",
        "before:absolute before:w-[5px] before:translate-x-0 hover:before:translate-x-full before:transition-all before:duration-300 before:ease-out before:h-[60%] before:bg-[var(--glow-color)] before:right-0 before:rounded-l before:shadow-[-2px_0_15px_var(--glow-color)]",
        className
      )}
    >
      {children}
    </button>
  );
}
