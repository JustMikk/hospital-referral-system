"use client";

import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, ShieldAlert, Eye, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface EmergencyLog {
    id: string;
    user: string;
    role: string;
    patient: string;
    reason: string;
    time: Date;
    duration: string;
    status: string;
}

interface EmergencyAccessClientProps {
    initialLogs: EmergencyLog[];
    activeCount: number;
}

export default function EmergencyAccessClient({ initialLogs, activeCount }: EmergencyAccessClientProps) {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Emergency Access Oversight"
                description="Monitor and audit 'break-glass' access to patient records"
            >
                {activeCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-800">
                        <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                        {activeCount} Active Emergency Session{activeCount > 1 ? "s" : ""}
                    </div>
                )}
            </PageHeader>

            <div className="grid gap-6">
                {initialLogs.length === 0 ? (
                    <Card className="border-border/40 shadow-sm">
                        <CardContent className="p-12 text-center">
                            <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Emergency Access Logs</h3>
                            <p className="text-muted-foreground">
                                There are no break-glass access records to display. Emergency access logs will appear here when staff use the emergency access feature.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    initialLogs.map((log) => (
                        <Card key={log.id} className={cn(
                            "border-l-4 shadow-sm transition-all hover:shadow-md",
                            log.status === "OPEN" ? "border-l-red-500 border-y-border/40 border-r-border/40 bg-red-50/10" : "border-l-slate-300 border-y-border/40 border-r-border/40"
                        )}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-lg">{log.user}</h3>
                                            <Badge variant="outline" className="text-xs">{log.role}</Badge>
                                            {log.status === "OPEN" && (
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
                                                {formatDistanceToNow(new Date(log.time), { addSuffix: true })}
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
                    ))
                )}
            </div>
        </div>
    );
}
