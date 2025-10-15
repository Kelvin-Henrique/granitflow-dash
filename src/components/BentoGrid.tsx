import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-12 gap-3 auto-rows-auto", className)}>
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  span?: number;
}

export function BentoCard({ children, className, span = 3 }: BentoCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg p-6 shadow-md border border-border transition-shadow hover:shadow-lg",
        `col-span-12 md:col-span-${span}`,
        className
      )}
    >
      {children}
    </div>
  );
}
