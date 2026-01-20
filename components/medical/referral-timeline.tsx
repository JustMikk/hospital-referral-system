import { cn } from "@/lib/utils";
import { Check, Clock, Send, X, FileText, Eye, AlertTriangle } from "lucide-react";
import type { Referral } from "@/lib/mock-data";

interface TimelineEvent {
  id: string;
  type: "created" | "sent" | "viewed" | "accepted" | "rejected" | "completed" | "cancelled" | "emergency_flag";
  title: string;
  actor: string;
  hospital: string;
  timestamp: string;
  note?: string;
}

interface ReferralTimelineProps {
  referral: Referral;
  className?: string;
}

// Mock events generator based on referral status
function generateMockEvents(referral: Referral): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: "1",
      type: "created",
      title: "Referral Created",
      actor: referral.referringDoctor,
      hospital: referral.fromHospital,
      timestamp: referral.createdAt,
    }
  ];

  if (referral.status !== "Draft") {
    events.unshift({
      id: "2",
      type: "sent",
      title: "Referral Sent",
      actor: referral.referringDoctor,
      hospital: referral.fromHospital,
      timestamp: referral.createdAt, // Simulating same time for mock
    });
  }

  if (referral.priority === "Emergency") {
    events.unshift({
      id: "e1",
      type: "emergency_flag",
      title: "Emergency Priority Flagged",
      actor: referral.referringDoctor,
      hospital: referral.fromHospital,
      timestamp: referral.createdAt,
    });
  }

  if (referral.status === "Accepted") {
    events.unshift({
      id: "3",
      type: "viewed",
      title: "Referral Viewed",
      actor: referral.receivingDoctor,
      hospital: referral.toHospital,
      timestamp: referral.updatedAt,
    });
    events.unshift({
      id: "4",
      type: "accepted",
      title: "Referral Accepted",
      actor: referral.receivingDoctor,
      hospital: referral.toHospital,
      timestamp: referral.updatedAt,
    });
  }

  if (referral.status === "Rejected") {
    events.unshift({
      id: "5",
      type: "rejected",
      title: "Referral Rejected",
      actor: referral.receivingDoctor,
      hospital: referral.toHospital,
      timestamp: referral.updatedAt,
      note: "Capacity issue at this time.",
    });
  }

  return events;
}

const eventIcons = {
  created: FileText,
  sent: Send,
  viewed: Eye,
  accepted: Check,
  rejected: X,
  completed: Check,
  cancelled: X,
  emergency_flag: AlertTriangle,
};

const eventColors = {
  created: "bg-blue-100 text-blue-600 border-blue-200",
  sent: "bg-blue-100 text-blue-600 border-blue-200",
  viewed: "bg-gray-100 text-gray-600 border-gray-200",
  accepted: "bg-emerald-100 text-emerald-600 border-emerald-200",
  rejected: "bg-red-100 text-red-600 border-red-200",
  completed: "bg-emerald-100 text-emerald-600 border-emerald-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  emergency_flag: "bg-red-100 text-red-600 border-red-200 animate-pulse",
};

export function ReferralTimeline({ referral, className }: ReferralTimelineProps) {
  const events = generateMockEvents(referral);

  return (
    <div className={cn("space-y-0", className)}>
      {events.map((event, index) => {
        const Icon = eventIcons[event.type];
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex gap-4 relative pb-8 last:pb-0">
            {!isLast && (
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border" />
            )}

            <div className={cn(
              "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
              eventColors[event.type]
            )}>
              <Icon className="h-4 w-4" />
            </div>

            <div className="flex-1 pt-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <p className="font-medium text-sm text-foreground">{event.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">{event.actor}</span>
                <span className="mx-1">•</span>
                <span>{event.hospital}</span>
              </div>

              {event.note && (
                <div className="mt-2 text-sm bg-muted/50 p-2 rounded border border-border/50">
                  {event.note}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
