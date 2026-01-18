"use client";

import { cn } from "@/lib/utils";
import { FileText, LogIn, Edit, Send, Eye, UserCog } from "lucide-react";
import type { AuditLogEntry } from "@/lib/mock-data";

interface AuditLogItemProps {
  entry: AuditLogEntry;
  className?: string;
}

const actionIcons: Record<string, typeof FileText> = {
  "Patient Record Viewed": Eye,
  "Patient Record Updated": Edit,
  "Referral Created": FileText,
  "Referral Status Changed": Send,
  "Login Successful": LogIn,
  "User Settings Changed": UserCog,
};

export function AuditLogItem({ entry, className }: AuditLogItemProps) {
  const Icon = actionIcons[entry.action] || FileText;

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors",
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-foreground">{entry.action}</p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {entry.timestamp}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{entry.details}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{entry.user}</span>
          <span className="text-border">|</span>
          <span>{entry.userRole}</span>
          <span className="text-border">|</span>
          <span>IP: {entry.ipAddress}</span>
        </div>
      </div>
    </div>
  );
}
