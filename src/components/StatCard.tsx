import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function StatCard({ title, value, icon: Icon, trend, className, onClick }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg p-6 shadow-md border border-border transition-all hover:shadow-lg",
        onClick && "cursor-pointer hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {trend && (
          <p className={cn(
            "text-sm font-medium",
            trend.positive ? "text-success" : "text-destructive"
          )}>
            {trend.positive ? "+" : ""}{trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
