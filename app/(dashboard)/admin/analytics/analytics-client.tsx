"use client";

import { useMemo } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/medical/page-header";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Download,
    TrendingUp,
    Clock,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";


interface AnalyticsData {
    metrics: {
        totalReferrals: number;
        emergencyCases: number;
        acceptanceRate: number;
        responseTime: string;
    };
    flowData: { date: string; total: number; emergency: number }[];
    performanceData: {
        name: string;
        received: number;
        accepted: number;
        rate: number;
    }[];
    rejectionReasons: { name: string; value: number }[];
    bottlenecks: {
        dept: string;
        hospital: string;
        wait: string;
        trend: "up" | "down" | "stable";
    }[];
}

interface AnalyticsClientProps {
    initialData: AnalyticsData;
}


const CHART_TOOLTIP_STYLE = {
    contentStyle: {
        backgroundColor: "hsl(var(--background))",
        borderColor: "hsl(var(--border))",
    },
    itemStyle: {
        color: "hsl(var(--foreground))",
    },
};

const PIE_COLORS = ["#ef4444", "#f97316", "#eab308", "#64748b"];

function exportAnalytics(data: AnalyticsData) {
    const payload = {
        ...data,
        exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-export-${new Date()
        .toISOString()
        .split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}


export default function AnalyticsClient({ initialData }: AnalyticsClientProps) {
    const overviewMetrics = useMemo(
        () => [
            {
                label: "Total Referrals",
                value: initialData.metrics.totalReferrals.toLocaleString(),
                icon: TrendingUp,
                color: "text-blue-600 bg-blue-100",
            },
            {
                label: "Avg Response Time",
                value: initialData.metrics.responseTime,
                icon: Clock,
                color: "text-emerald-600 bg-emerald-100",
            },
            {
                label: "Emergency Cases",
                value: initialData.metrics.emergencyCases.toString(),
                icon: AlertTriangle,
                color: "text-red-600 bg-red-100",
            },
            {
                label: "Acceptance Rate",
                value: `${initialData.metrics.acceptanceRate}%`,
                icon: CheckCircle2,
                color: "text-purple-600 bg-purple-100",
            },
        ],
        [initialData.metrics]
    );

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

                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => exportAnalytics(initialData)}
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {overviewMetrics.map((metric) => (
                    <Card key={metric.label}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {metric.label}
                                </p>
                                <h2 className="text-2xl font-bold mt-1">{metric.value}</h2>
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

                <TabsContent value="flow">
                    <Card>
                        <CardHeader>
                            <CardTitle>Referral Volume & Urgency</CardTitle>
                            <CardDescription>
                                Daily breakdown of referrals by urgency
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer>
                                <BarChart data={initialData.flowData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip {...CHART_TOOLTIP_STYLE} />
                                    <Legend />
                                    <Bar
                                        dataKey="total"
                                        stackId="a"
                                        fill="#3b82f6"
                                        name="Total Referrals"
                                    />
                                    <Bar
                                        dataKey="emergency"
                                        stackId="a"
                                        fill="#ef4444"
                                        name="Emergency Cases"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bottlenecks">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rejection Reasons</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={initialData.rejectionReasons}
                                        dataKey="value"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                    >
                                        {initialData.rejectionReasons.map((_, i) => (
                                            <Cell
                                                key={i}
                                                fill={PIE_COLORS[i % PIE_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip {...CHART_TOOLTIP_STYLE} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
