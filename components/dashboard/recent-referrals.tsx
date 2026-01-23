"use client";

import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/medical/status-badge";
import { EmptyState } from "@/components/medical/empty-state";
interface Referral {
  id: string;
  patientName: string;
  fromHospital: string;
  toHospital: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface RecentReferralsProps {
  referrals: Referral[];
}

export function RecentReferrals({ referrals }: RecentReferralsProps) {
  if (referrals.length === 0) {
    return (
      <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={FileText}
            title="No referrals yet"
            description="Your recent referrals will appear here once you create them."
            action={{
              label: "Create Referral",
              onClick: () => { window.location.href = "/referrals/create"; },
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Recent Referrals</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/referrals" className="text-primary">
            View all
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {referrals.map((referral) => (
          <Link
            key={referral.id}
            href={`/referrals/${referral.id}`}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {referral.patientName}
                </p>
                <StatusBadge status={referral.priority} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {referral.fromHospital} → {referral.toHospital}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(referral.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <StatusBadge status={referral.status} />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
