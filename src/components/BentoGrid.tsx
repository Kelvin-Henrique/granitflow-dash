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
  const spanClass = {
    1: "col-span-12 md:col-span-1",
    2: "col-span-12 md:col-span-2",
    3: "col-span-12 md:col-span-3",
    4: "col-span-12 md:col-span-4",
    6: "col-span-12 md:col-span-6",
    12: "col-span-12",
  }[span] || "col-span-12 md:col-span-3";

  return (
    <div
      className={cn(
        "bg-card rounded-lg p-6 shadow-md border border-border transition-shadow hover:shadow-lg",
        spanClass,
        className
      )}
    >
      {children}
    </div>
  );
}
