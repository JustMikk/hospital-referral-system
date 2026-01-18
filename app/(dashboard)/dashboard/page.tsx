"use client";

import { Users, FileText, Clock, AlertTriangle, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/medical/page-header";
import { StatCard } from "@/components/medical/stat-card";
import { StatusBadge } from "@/components/medical/status-badge";
import { Button } from "@/components/ui/button";
import { dashboardMetrics, referrals, appointments } from "@/lib/mock-data";
import Link from "next/link";
import { RecentReferrals } from "@/components/dashboard/recent-referrals";
import { TodaysAppointments } from "@/components/dashboard/todays-appointments";
import { PatientActivityChart } from "@/components/dashboard/patient-activity-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your hospital referral activities"
      >
        <Button asChild>
          <Link href="/referrals/create">
            New Referral
          </Link>
        </Button>
      </PageHeader>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={dashboardMetrics.totalPatients}
          icon={Users}
          variant="purple"
          trend={{ value: 12, label: "from last month" }}
        />
        <StatCard
          title="Active Referrals"
          value={dashboardMetrics.activeReferrals}
          icon={FileText}
          variant="orange"
          trend={{ value: 8, label: "from last week" }}
        />
        <StatCard
          title="Pending Reviews"
          value={dashboardMetrics.pendingReviews}
          icon={Clock}
          variant="green"
          trend={{ value: -5, label: "from yesterday" }}
        />
        <StatCard
          title="Emergency Alerts"
          value={dashboardMetrics.emergencyAlerts}
          icon={AlertTriangle}
          variant="blue"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Referrals - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentReferrals referrals={referrals.slice(0, 5)} />
        </div>

        {/* Today's Appointments */}
        <div>
          <TodaysAppointments appointments={appointments} />
        </div>
      </div>

      {/* Patient Activity Chart */}
      <PatientActivityChart />
    </div>
  );
}
