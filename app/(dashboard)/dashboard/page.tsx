"use client";

import { Users, FileText, Clock, AlertTriangle, Building2, UserCog, Activity } from "lucide-react";
import { PageHeader } from "@/components/medical/page-header";
import { StatCard } from "@/components/medical/stat-card";
import { Button } from "@/components/ui/button";
import { dashboardMetrics, referrals, appointments, currentUser, staff } from "@/lib/mock-data";
import Link from "next/link";
import { RecentReferrals } from "@/components/dashboard/recent-referrals";
import { TodaysAppointments } from "@/components/dashboard/todays-appointments";
import { PatientActivityChart } from "@/components/dashboard/patient-activity-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const { userRole } = useAuth();
  const isHospitalAdmin = userRole === "hospital_admin";

  if (isHospitalAdmin) {
    return <HospitalAdminDashboard />;
  }

  return <ClinicalDashboard />;
}

function ClinicalDashboard() {
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

function HospitalAdminDashboard() {
  const activeStaffCount = staff.filter(s => s.status === "Active").length;
  const departmentsCount = new Set(staff.map(s => s.department)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital Operations"
        description={`Operational overview for ${currentUser.hospital}`}
      >
        <Button asChild>
          <Link href="/staff">
            Manage Staff
          </Link>
        </Button>
      </PageHeader>

      {/* Operational Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Staff"
          value={activeStaffCount}
          icon={UserCog}
          variant="blue"
          trend={{ value: 2, label: "new this month" }}
        />
        <StatCard
          title="Departments"
          value={departmentsCount}
          icon={Building2}
          variant="purple"
        />
        <StatCard
          title="Pending Referrals"
          value={dashboardMetrics.pendingReviews}
          icon={FileText}
          variant="orange"
          trend={{ value: 5, label: "awaiting review" }}
        />
        <StatCard
          title="Emergency Events"
          value={3} // Mock value
          icon={AlertTriangle}
          variant="orange" // Changed from 'red' to 'orange' as 'red' is not in the type definition
          trend={{ value: 1, label: "last 24h" }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity / Alerts */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Operational Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Emergency Access Granted", desc: "Dr. Wilson accessed P002 record", time: "10 mins ago", type: "warning" },
                { label: "New Staff Onboarded", desc: "Nurse Sarah joined Emergency Dept", time: "2 hours ago", type: "info" },
                { label: "Referral Escalation", desc: "Urgent referral R005 pending > 48h", time: "5 hours ago", type: "error" },
                { label: "Department Status", desc: "Cardiology operating at 95% capacity", time: "Yesterday", type: "neutral" },
              ].map((item, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/staff" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors gap-2 group">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:scale-110 transition-transform">
                  <UserCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium">Invite Staff</span>
              </Link>
              <Link href="/departments" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors gap-2 group">
                <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium">Manage Depts</span>
              </Link>
              <Link href="/emergency-access" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors gap-2 group">
                <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/20 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium">Emergency Logs</span>
              </Link>
              <Link href="/audit-logs" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors gap-2 group">
                <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium">View Audits</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
