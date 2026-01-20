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
  | "Emergency"
  | "PENDING"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "NORMAL"
  | "URGENT"
  | "EMERGENCY"
  | "ACTIVE"
  | "INACTIVE"
  | "CRITICAL"
  | "DISCHARGED";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<
  string,
  { bg: string; text: string; dot?: string }
> = {
  // Generic statuses
  success: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  warning: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  error: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  info: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  default: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" },

  // Patient statuses
  active: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  inactive: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-400" },
  critical: { bg: "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-400 font-semibold", dot: "bg-red-600 animate-pulse" },
  discharged: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },

  // Referral statuses
  draft: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" },
  sent: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400" },
  pending: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400" },
  accepted: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400" },
  rejected: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-400" },
  completed: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400" },

  // Appointment statuses
  scheduled: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400" },
  "in progress": { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400" },
  cancelled: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-400" },

  // Priority
  normal: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" },
  urgent: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400" },
  emergency: { bg: "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-400 font-semibold", dot: "bg-red-600 animate-pulse" },
};

export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const config = statusConfig[normalizedStatus] || statusConfig.default;

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
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
}
