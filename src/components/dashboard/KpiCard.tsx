import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "primary" | "warning" | "danger";
  index?: number;
  isLoading?: boolean;
}

const variantStyles = {
  default: "border-border/50",
  primary: "border-primary/30 glow-primary",
  warning: "border-warning/30",
  danger: "border-destructive/30",
};

const iconVariantStyles = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/15 text-primary",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
};

export function KpiCard({ title, value, subtitle, icon: Icon, variant = "default", index = 0, isLoading = false }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`glass-card p-5 ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded w-24" />
          ) : (
            <p className="font-heading text-3xl font-bold text-foreground">{value}</p>
          )}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${iconVariantStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
