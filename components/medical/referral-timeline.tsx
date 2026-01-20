"use client";

import { CheckCircle2, Clock, Send, Eye, XCircle, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: string;
  actorName: string;
  timestamp: string | Date;
  details?: string | null;
}

interface ReferralTimelineProps {
  events: TimelineEvent[];
}

export function ReferralTimeline({ events }: ReferralTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "CREATED":
        return <Clock className="h-4 w-4" />;
      case "SENT":
        return <Send className="h-4 w-4" />;
      case "VIEWED":
        return <Eye className="h-4 w-4" />;
      case "ACCEPTED":
        return <CheckCircle2 className="h-4 w-4" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4" />;
      case "EMERGENCY_FLAG":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "ACCEPTED":
        return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "REJECTED":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "EMERGENCY_FLAG":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border before:to-transparent">
      {events.map((event) => (
        <div key={event.id} className="relative flex items-start gap-4 group">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background shadow-sm z-10 transition-transform group-hover:scale-110",
            getEventColor(event.type)
          )}>
            {getEventIcon(event.type)}
          </div>
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {event.type.replace("_", " ")}
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {event.actorName} {event.details ? `• ${event.details}` : ""}
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              {new Date(event.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
