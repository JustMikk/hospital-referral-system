"use client";

import { cn } from "@/lib/utils";
import { Check, Clock, Send, X, FileText } from "lucide-react";
import type { Referral } from "@/lib/mock-data";

interface ReferralTimelineProps {
  referral: Referral;
  className?: string;
}

const statusSteps = [
  { key: "Draft", label: "Draft Created", icon: FileText },
  { key: "Sent", label: "Referral Sent", icon: Send },
  { key: "Accepted", label: "Accepted", icon: Check },
  { key: "Completed", label: "Completed", icon: Check },
];

const rejectedStep = { key: "Rejected", label: "Rejected", icon: X };

function getStatusIndex(status: Referral["status"]): number {
  if (status === "Rejected") return 2;
  const index = statusSteps.findIndex((s) => s.key === status);
  return index === -1 ? 0 : index;
}

export function ReferralTimeline({ referral, className }: ReferralTimelineProps) {
  const currentIndex = getStatusIndex(referral.status);
  const isRejected = referral.status === "Rejected";

  const steps = isRejected
    ? [...statusSteps.slice(0, 2), rejectedStep]
    : statusSteps;

  return (
    <div className={cn("space-y-1", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        const isRejectedStep = step.key === "Rejected" && isRejected;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-start gap-4">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                  isCompleted && "bg-emerald-500 border-emerald-500",
                  isCurrent && !isRejectedStep && "bg-primary border-primary",
                  isCurrent && isRejectedStep && "bg-red-500 border-red-500",
                  isPending && "bg-card border-border"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isCompleted && "text-white",
                    isCurrent && "text-white",
                    isPending && "text-muted-foreground"
                  )}
                />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8 my-1",
                    isCompleted ? "bg-emerald-500" : "bg-border"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pt-1 pb-4">
              <p
                className={cn(
                  "font-medium",
                  isCompleted && "text-foreground",
                  isCurrent && "text-foreground",
                  isPending && "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {new Date(referral.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
