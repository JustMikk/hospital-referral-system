import { getSystemStats } from "@/app/actions/admin";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Building2,
    Users,
    FileText,
    Shield,
    Server,
    Database,
    Lock,
    CheckCircle2,
    ArrowRight,
    Activity,
} from "lucide-react";

export default async function SystemOverviewPage() {
    const session = await getSession();
    if (!session || session.user.role !== "SYSTEM_ADMIN") {
        redirect("/login");
    }

    const stats = await getSystemStats();

    return (
        <div className="space-y-6">
            <PageHeader
                title="System Overview"
                description="Platform health and statistics at a glance"
            >
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/analytics">
                            <Activity className="h-4 w-4 mr-2" />
                            Analytics
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/hospitals">
                            <Building2 className="h-4 w-4 mr-2" />
                            Manage Hospitals
                        </Link>
                    </Button>
                </div>
            </PageHeader>

            {/* System Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/40">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalHospitals}</p>
                                <p className="text-sm text-muted-foreground">Total Hospitals</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.connectedHospitals}</p>
                                <p className="text-sm text-muted-foreground">Connected</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.pendingReferrals}</p>
                                <p className="text-sm text-muted-foreground">Pending Referrals</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* System Configuration */}
                <Card className="border-border/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-primary" />
                            System Configuration
                        </CardTitle>
                        <CardDescription>
                            Default settings for the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p className="font-medium text-sm">Default Staff Password</p>
                                <p className="text-xs text-muted-foreground">
                                    New staff accounts are created with this password
                                </p>
                            </div>
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                                password123
                            </code>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p className="font-medium text-sm">Session Duration</p>
                                <p className="text-xs text-muted-foreground">
                                    JWT token expiration time
                                </p>
                            </div>
                            <Badge variant="secondary">24 hours</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p className="font-medium text-sm">Password Hashing</p>
                                <p className="text-xs text-muted-foreground">
                                    Algorithm used for password security
                                </p>
                            </div>
                            <Badge variant="secondary">bcrypt (10 rounds)</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Security & Compliance */}
                <Card className="border-border/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Security & Compliance
                        </CardTitle>
                        <CardDescription>
                            Platform security status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-sm text-green-700 dark:text-green-400">
                                    HIPAA Compliant
                                </span>
                            </div>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Active
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-sm text-green-700 dark:text-green-400">
                                    End-to-End Encryption
                                </span>
                            </div>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Enabled
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
                            <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-sm text-green-700 dark:text-green-400">
                                    Audit Logging
                                </span>
                            </div>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Enabled
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Platform Statistics */}
                <Card className="border-border/40 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            Platform Statistics
                        </CardTitle>
                        <CardDescription>
                            Overview of platform usage
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-3xl font-bold text-primary">{stats.totalHospitals}</p>
                                <p className="text-sm text-muted-foreground">Hospitals</p>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
                                <p className="text-sm text-muted-foreground">Users</p>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-3xl font-bold text-primary">{stats.totalPatients}</p>
                                <p className="text-sm text-muted-foreground">Patients</p>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-3xl font-bold text-primary">{stats.totalReferrals}</p>
                                <p className="text-sm text-muted-foreground">Total Referrals</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

