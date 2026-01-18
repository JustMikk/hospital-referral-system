"use client";

import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardMetrics, hospitals, staff } from "@/lib/mock-data";
import { Building2, Users, FileText, AlertTriangle, ArrowUpRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
    const stats = [
        {
            title: "Connected Hospitals",
            value: hospitals.length,
            change: "+2 this month",
            icon: Building2,
            trend: "up",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            title: "Active Staff",
            value: staff.filter(s => s.status === "Active").length,
            change: "+5 new hires",
            icon: Users,
            trend: "up",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            title: "Pending Referrals",
            value: dashboardMetrics.pendingReviews,
            change: "-3 from yesterday",
            icon: FileText,
            trend: "down",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            title: "Compliance Alerts",
            value: "2",
            change: "Requires attention",
            icon: AlertTriangle,
            trend: "neutral",
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-900/20",
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Admin Dashboard"
                description="Overview of hospital network status and system health"
            />

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </p>
                                <div className={cn("p-2 rounded-lg", stat.bg)}>
                                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                                    ) : stat.trend === "down" ? (
                                        <ArrowUpRight className="mr-1 h-3 w-3 text-red-500 rotate-90" />
                                    ) : (
                                        <Activity className="mr-1 h-3 w-3 text-amber-500" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activity / Compliance */}
                <Card className="border-border/40 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">System Health & Compliance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { label: "HIPAA Compliance Audit", status: "Passed", date: "Jan 15, 2026", color: "text-emerald-600" },
                                { label: "Server Uptime (30 days)", status: "99.99%", date: "Ongoing", color: "text-emerald-600" },
                                { label: "Failed Login Attempts", status: "12 detected", date: "Last 24h", color: "text-amber-600" },
                                { label: "Emergency Access Logs", status: "3 incidents", date: "Last 7 days", color: "text-blue-600" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                                    <div>
                                        <p className="font-medium text-sm">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                    <span className={cn("text-sm font-semibold", item.color)}>{item.status}</span>
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
                            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors gap-2 group">
                                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-sm font-medium">Invite Staff</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors gap-2 group">
                                <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20 group-hover:scale-110 transition-transform">
                                    <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="text-sm font-medium">Add Hospital</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors gap-2 group">
                                <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-900/20 group-hover:scale-110 transition-transform">
                                    <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="text-sm font-medium">View Alerts</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors gap-2 group">
                                <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 group-hover:scale-110 transition-transform">
                                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-sm font-medium">Audit Report</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
