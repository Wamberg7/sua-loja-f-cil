import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor = "text-primary",
}: StatsCardProps) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border card-glow">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-lg bg-secondary flex items-center justify-center")}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            changeType === "positive" && "bg-success/20 text-success",
            changeType === "negative" && "bg-destructive/20 text-destructive",
            changeType === "neutral" && "bg-muted text-muted-foreground"
          )}
        >
          {change}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
