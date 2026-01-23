"use client";

import { useState } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { AuditLogItem } from "@/components/medical/audit-log-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Download, Filter } from "lucide-react";

interface AuditLogEntry {
    id: string;
    action: string;
    resource: string;
    details: string | null;
    timestamp: Date;
    user: {
        name: string;
        role: string;
        avatar: string | null;
    };
}

interface AuditLogsClientProps {
    initialLogs: AuditLogEntry[];
}

export default function AuditLogsClient({ initialLogs }: AuditLogsClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFilter, setActionFilter] = useState("all");

    const filteredLogs = initialLogs.filter((log) => {
        const matchesSearch =
            log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        const matchesAction =
            actionFilter === "all" || log.action.toLowerCase().includes(actionFilter.toLowerCase());
        return matchesSearch && matchesAction;
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Audit Logs"
                description="Track all system activity and data access for compliance"
            />

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg font-semibold text-card-foreground">
                            Activity Log
                        </CardTitle>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                            <Input
                                placeholder="Search logs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all"
                            />
                        </div>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50 focus:ring-primary/20">
                                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filter by action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="CREATE">Create</SelectItem>
                                <SelectItem value="UPDATE">Update</SelectItem>
                                <SelectItem value="DELETE">Delete</SelectItem>
                                <SelectItem value="INVITE">Invite</SelectItem>
                                <SelectItem value="LOGIN">Login</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log) => (
                                <AuditLogItem
                                    key={log.id}
                                    entry={{
                                        id: log.id,
                                        user: log.user.name,
                                        userRole: log.user.role,
                                        action: `${log.action} ${log.resource}`,
                                        details: log.details || `Action performed on ${log.resource}`,
                                        timestamp: new Date(log.timestamp).toLocaleString(),
                                        ipAddress: "N/A"
                                    }}
                                />
                            ))
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                No audit logs found matching your criteria.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
