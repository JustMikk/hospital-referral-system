"use client";

import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/medical/status-badge";
import { EmptyState } from "@/components/medical/empty-state";
import type { Appointment } from "@/lib/mock-data";

interface TodaysAppointmentsProps {
  appointments: Appointment[];
}

const typeColors: Record<Appointment["type"], string> = {
  Consultation: "bg-blue-500",
  "Follow-up": "bg-emerald-500",
  Surgery: "bg-violet-500",
  "Lab Test": "bg-amber-500",
};

export function TodaysAppointments({ appointments }: TodaysAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Today&apos;s Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Calendar}
            title="No appointments today"
            description="Your schedule is clear for today."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Today&apos;s Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div
              className={`h-2 w-2 rounded-full ${typeColors[appointment.type]}`}
            />
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="font-medium text-foreground text-sm truncate">
                {appointment.patientName}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{appointment.time}</span>
                <span>•</span>
                <span>{appointment.type}</span>
              </div>
            </div>
            <StatusBadge status={appointment.status} size="sm" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
