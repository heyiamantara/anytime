import { cn } from "@/lib/utils";

export function RetroGrid({
  className,
  angle = 65,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        className,
      )}
      style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid",
            "[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]",
            // Light mode - using purple grid lines
            "[background-image:linear-gradient(to_right,rgba(124,58,237,0.4)_1px,transparent_0),linear-gradient(to_bottom,rgba(124,58,237,0.4)_1px,transparent_0)]",
            // Dark mode - using lighter purple grid lines
            "dark:[background-image:linear-gradient(to_right,rgba(139,92,246,0.5)_1px,transparent_0),linear-gradient(to_bottom,rgba(139,92,246,0.5)_1px,transparent_0)]",
          )}
        />
      </div>
      {/* Background Gradient - subtle fade to not overpower content */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/30 dark:from-neutral-900 dark:via-neutral-900/80 dark:to-neutral-900/30" />
    </div>
  );
}