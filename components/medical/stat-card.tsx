"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "purple" | "orange" | "green" | "blue" | "default";
  className?: string;
}

const variantStyles = {
  purple: "bg-gradient-to-br from-violet-500 to-violet-700",
  orange: "bg-gradient-to-br from-orange-500 to-orange-600",
  green: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  blue: "bg-gradient-to-br from-sky-400 to-sky-500",
  default: "bg-card",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const isColored = variant !== "default";

  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5",
        isColored
          ? variantStyles[variant]
          : "bg-card shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border dark:border-white/[0.06]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p
            className={cn(
              "text-sm font-medium",
              isColored ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-3xl font-bold tracking-tight",
              isColored ? "text-white" : "text-foreground"
            )}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                isColored ? "text-white/70" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  trend.value >= 0 ? "text-emerald-500" : "text-red-500",
                  isColored && "text-white/90"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>{" "}
              {trend.label}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            isColored ? "bg-white/20" : "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              isColored ? "text-white" : "text-primary"
            )}
          />
        </div>
      </div>
    </div>
  );
}
