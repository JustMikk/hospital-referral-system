"use client";

import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Lock, Clock, Download, Save } from "lucide-react";

export default function SystemSettingsPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="System Settings"
                description="Configure global platform policies and security controls"
            >
                <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </PageHeader>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Authentication Policies */}
                <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Authentication Policies</CardTitle>
                        </div>
                        <CardDescription>Manage login security and session rules</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Multi-Factor Authentication (MFA)</Label>
                                <p className="text-xs text-muted-foreground">Enforce MFA for all admin accounts</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="space-y-2">
                            <Label>Session Timeout (Minutes)</Label>
                            <Select defaultValue="30">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select timeout" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 minutes</SelectItem>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                    <SelectItem value="60">1 hour</SelectItem>
                                    <SelectItem value="120">2 hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Password Rotation Policy</Label>
                            <Select defaultValue="90">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rotation period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">Every 30 days</SelectItem>
                                    <SelectItem value="60">Every 60 days</SelectItem>
                                    <SelectItem value="90">Every 90 days</SelectItem>
                                    <SelectItem value="never">Never expire</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Retention & Export */}
                <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Download className="h-5 w-5 text-primary" />
                            <CardTitle>Data Retention & Export</CardTitle>
                        </div>
                        <CardDescription>Configure data lifecycle and export restrictions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Audit Log Retention</Label>
                            <Select defaultValue="7">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select retention period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 year</SelectItem>
                                    <SelectItem value="3">3 years</SelectItem>
                                    <SelectItem value="7">7 years (HIPAA)</SelectItem>
                                    <SelectItem value="10">10 years</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Allow Bulk Data Export</Label>
                                <p className="text-xs text-muted-foreground">Permit admins to download full patient datasets</p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Anonymize Exports</Label>
                                <p className="text-xs text-muted-foreground">Automatically remove PII from exported reports</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Access Defaults */}
                <Card className="md:col-span-2 border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            <CardTitle>Security Defaults</CardTitle>
                        </div>
                        <CardDescription>Global security settings applied to all new hospitals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Require Strong Passwords</Label>
                                        <p className="text-xs text-muted-foreground">Min 12 chars, special chars, numbers</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Lockout After Failed Attempts</Label>
                                        <p className="text-xs text-muted-foreground">Lock account after 5 failed logins</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>IP Whitelisting</Label>
                                        <p className="text-xs text-muted-foreground">Restrict admin access to specific IPs</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Device Fingerprinting</Label>
                                        <p className="text-xs text-muted-foreground">Alert on new device logins</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
