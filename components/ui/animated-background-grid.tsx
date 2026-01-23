import { cn } from "@/lib/utils";

export function AnimatedBackgroundGrid({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Static Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Moving Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-15 dark:opacity-25 animate-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridSlide 15s linear infinite',
        }}
      />

      {/* Animated Dots */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-500 rounded-full animate-ping opacity-40" />
        <div className="absolute top-3/4 left-3/4 w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-primary-600 rounded-full animate-ping opacity-25" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/6 left-5/6 w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse opacity-35" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-5/6 left-1/2 w-1 h-1 bg-primary-400 rounded-full animate-ping opacity-20" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/20 to-white/60 dark:from-transparent dark:via-neutral-900/20 dark:to-neutral-900/60" />
    </div>
  );
}