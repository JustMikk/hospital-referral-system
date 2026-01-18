"use client";

import { cn } from "@/lib/utils";

type StatusType =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default"
  | "Active"
  | "Inactive"
  | "Critical"
  | "Discharged"
  | "Draft"
  | "Sent"
  | "Accepted"
  | "Rejected"
  | "Completed"
  | "Scheduled"
  | "In Progress"
  | "Cancelled"
  | "Normal"
  | "Urgent"
  | "Emergency";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<
  StatusType,
  { bg: string; text: string; dot?: string }
> = {
  // Generic statuses
  success: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  warning: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  error: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  info: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  default: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" },

  // Patient statuses
  Active: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  Inactive: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-400" },
  Critical: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  Discharged: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },

  // Referral statuses
  Draft: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" },
  Sent: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400" },
  Accepted: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400" },
  Rejected: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-400" },
  Completed: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400" },

  // Appointment statuses
  Scheduled: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400" },
  "In Progress": { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400" },
  Cancelled: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-400" },

  // Priority
  Normal: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" },
  Urgent: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400" },
  Emergency: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-400" },
};

export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.default;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        config.bg,
        config.text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      {config.dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      )}
      {status}
    </span>
  );
}
