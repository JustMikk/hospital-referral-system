"use client";

import { useState } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, AlertTriangle, Save, History, Check, X } from "lucide-react";
import { roles, Role, Permission } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function PermissionsPage() {
    const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
    const [hasChanges, setHasChanges] = useState(false);

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <PageHeader
                title="Role & Permission Management"
                description="Configure access levels and emergency override protocols"
            >
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <History className="h-4 w-4" />
                        History
                    </Button>
                    <Button className="gap-2" disabled={!hasChanges}>
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </PageHeader>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Roles List (Left Pane) */}
                <Card className="col-span-12 md:col-span-4 lg:col-span-3 border-border/40 shadow-sm bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Roles</CardTitle>
                        <CardDescription>Select a role to edit</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-2 space-y-1">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all",
                                    selectedRole.id === role.id
                                        ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Shield className={cn("h-4 w-4", selectedRole.id === role.id ? "fill-primary/20" : "")} />
                                    <span className="font-medium text-sm">{role.name}</span>
                                </div>
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                    {role.usersCount}
                                </Badge>
                            </button>
                        ))}
                        <Separator className="my-2" />
                        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                            <PlusIcon className="h-4 w-4" />
                            Create New Role
                        </Button>
                    </CardContent>
                </Card>

                {/* Permission Matrix (Right Pane) */}
                <Card className="col-span-12 md:col-span-8 lg:col-span-9 border-border/40 shadow-sm bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden">
                    <CardHeader className="pb-4 border-b border-border/40">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">{selectedRole.name}</CardTitle>
                                <CardDescription>Configure permissions for this role</CardDescription>
                            </div>
                            <Badge variant="outline" className="gap-1">
                                <CheckCircleIcon className="h-3 w-3 text-emerald-500" />
                                Active
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-8">
                            {/* Emergency Access Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Emergency Access
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start justify-between p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10">
                                        <div className="space-y-1">
                                            <p className="font-medium text-red-900 dark:text-red-200">Break-Glass Access</p>
                                            <p className="text-xs text-red-700/80 dark:text-red-400/80">
                                                Allow bypassing normal restrictions in emergencies
                                            </p>
                                        </div>
                                        <Switch defaultChecked onCheckedChange={() => setHasChanges(true)} />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* General Permissions */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    General Permissions
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {selectedRole.permissions.map((perm) => (
                                        <div
                                            key={perm.id}
                                            className="flex items-start space-x-3 p-3 rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors"
                                        >
                                            <Switch
                                                defaultChecked={perm.enabled}
                                                onCheckedChange={() => setHasChanges(true)}
                                                className="mt-0.5"
                                            />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{perm.name}</p>
                                                <p className="text-xs text-muted-foreground">{perm.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Mock additional permissions for visual density */}
                                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-border/40 bg-background/50 opacity-60">
                                        <Switch disabled />
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium leading-none">Delete Records</p>
                                                <Lock className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Permanently remove patient data</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}

function CheckCircleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
