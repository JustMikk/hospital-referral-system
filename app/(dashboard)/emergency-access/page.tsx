"use client";

import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, ShieldAlert, Eye, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for emergency access logs
const emergencyLogs = [
    { id: 1, user: "Dr. James Wilson", role: "Doctor", patient: "P-10293 (John Doe)", reason: "Patient unconscious, unable to consent", time: "10 mins ago", duration: "Active", status: "Open" },
    { id: 2, user: "Nurse Sarah Connor", role: "Nurse", patient: "P-99281 (Jane Smith)", reason: "Urgent medication verification", time: "2 hours ago", duration: "15 mins", status: "Closed" },
    { id: 3, user: "Dr. Emily Chen", role: "Doctor", patient: "P-11223 (Unknown)", reason: "Trauma admission", time: "Yesterday", duration: "45 mins", status: "Closed" },
];

export default function EmergencyAccessPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Emergency Access Oversight"
                description="Monitor and audit 'break-glass' access to patient records"
            >
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-800">
                    <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    1 Active Emergency Session
                </div>
            </PageHeader>

            <div className="grid gap-6">
                {emergencyLogs.map((log) => (
                    <Card key={log.id} className={cn(
                        "border-l-4 shadow-sm transition-all hover:shadow-md",
                        log.status === "Open" ? "border-l-red-500 border-y-border/40 border-r-border/40 bg-red-50/10" : "border-l-slate-300 border-y-border/40 border-r-border/40"
                    )}>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{log.user}</h3>
                                        <Badge variant="outline" className="text-xs">{log.role}</Badge>
                                        {log.status === "Open" && (
                                            <Badge variant="destructive" className="animate-pulse">Active Now</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Accessed record:</span>
                                        <span className="font-medium text-foreground">{log.patient}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                                            <ShieldAlert className="h-4 w-4" />
                                            Reason Provided
                                        </div>
                                        <p className="text-sm text-muted-foreground italic max-w-[300px] truncate">"{log.reason}"</p>
                                    </div>

                                    <div className="text-right min-w-[100px]">
                                        <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" />
                                            {log.time}
                                        </div>
                                        <p className="text-sm font-medium">{log.duration}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Eye className="h-4 w-4" />
                                        Details
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <Flag className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
