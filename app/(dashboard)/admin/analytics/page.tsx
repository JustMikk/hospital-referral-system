"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/medical/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Mock Data
const overviewMetrics = [
    { label: "Total Referrals", value: "1,248", change: "+12%", icon: TrendingUp, color: "text-blue-600 bg-blue-100" },
    { label: "Avg Response Time", value: "4.2 hrs", change: "-8%", icon: Clock, color: "text-emerald-600 bg-emerald-100" },
    { label: "Emergency Cases", value: "86", change: "+2%", icon: AlertTriangle, color: "text-red-600 bg-red-100" },
    { label: "Completion Rate", value: "94%", change: "+1%", icon: CheckCircle2, color: "text-purple-600 bg-purple-100" },
];

const referralVolumeData = [
    { name: "Mon", Routine: 45, Urgent: 12, Emergency: 4 },
    { name: "Tue", Routine: 52, Urgent: 15, Emergency: 3 },
    { name: "Wed", Routine: 48, Urgent: 10, Emergency: 6 },
    { name: "Thu", Routine: 61, Urgent: 18, Emergency: 5 },
    { name: "Fri", Routine: 55, Urgent: 14, Emergency: 8 },
    { name: "Sat", Routine: 32, Urgent: 8, Emergency: 12 },
    { name: "Sun", Routine: 28, Urgent: 6, Emergency: 10 },
];

const hospitalPerformanceData = [
    { name: "Central Medical", sent: 120, accepted: 110, avgTime: 2.5 },
    { name: "St. Mary's", sent: 98, accepted: 85, avgTime: 3.8 },
    { name: "City General", sent: 150, accepted: 130, avgTime: 4.2 },
    { name: "Memorial", sent: 80, accepted: 75, avgTime: 1.8 },
];

const rejectionReasonsData = [
    { name: "Capacity Issue", value: 45, color: "#ef4444" },
    { name: "Wrong Dept", value: 30, color: "#f97316" },
    { name: "Incomplete Info", value: 15, color: "#eab308" },
    { name: "Other", value: 10, color: "#64748b" },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <PageHeader
                    title="Referral Analytics"
                    description="Insights into referral performance, efficiency, and bottlenecks."
                />
                <div className="flex items-center gap-2">
                    <Select defaultValue="7d">
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last Quarter</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Overview Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {overviewMetrics.map((metric) => (
                    <Card key={metric.label}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <h2 className="text-2xl font-bold">{metric.value}</h2>
                                    <span className={metric.change.startsWith("+") ? "text-emerald-600 text-xs" : "text-red-600 text-xs"}>
                                        {metric.change}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-full ${metric.color}`}>
                                <metric.icon className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="flow" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="flow">Referral Flow</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
                </TabsList>

                {/* Referral Flow Tab */}
                <TabsContent value="flow" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Referral Volume & Urgency</CardTitle>
                            <CardDescription>Daily breakdown of referrals by urgency level</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={referralVolumeData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="Routine" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="Urgent" stackId="a" fill="#f59e0b" />
                                    <Bar dataKey="Emergency" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hospital Response Times</CardTitle>
                                <CardDescription>Average time to accept/reject (hours)</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={hospitalPerformanceData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={100} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Bar dataKey="avgTime" fill="#10b981" radius={[0, 4, 4, 0]} name="Avg Hours" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Acceptance Rates</CardTitle>
                                <CardDescription>Percentage of referrals accepted by hospital</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={hospitalPerformanceData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Bar dataKey="sent" fill="#94a3b8" name="Total Sent" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="accepted" fill="#3b82f6" name="Accepted" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Bottlenecks Tab */}
                <TabsContent value="bottlenecks" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Rejection Reasons</CardTitle>
                                <CardDescription>Distribution of reasons for rejected referrals</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={rejectionReasonsData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {rejectionReasonsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Top Bottlenecks</CardTitle>
                                <CardDescription>Departments with highest pending times</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { dept: "Cardiology", hospital: "City General", wait: "12.5 hrs", trend: "up" },
                                        { dept: "Neurology", hospital: "Central Medical", wait: "8.2 hrs", trend: "down" },
                                        { dept: "Orthopedics", hospital: "St. Mary's", wait: "6.8 hrs", trend: "stable" },
                                        { dept: "Oncology", hospital: "Memorial", wait: "5.5 hrs", trend: "up" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{item.dept}</p>
                                                <p className="text-sm text-muted-foreground">{item.hospital}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{item.wait}</p>
                                                <p className={`text-xs ${item.trend === "up" ? "text-red-600" :
                                                        item.trend === "down" ? "text-emerald-600" : "text-muted-foreground"
                                                    }`}>
                                                    {item.trend === "up" ? "Increasing" : item.trend === "down" ? "Improving" : "Stable"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
