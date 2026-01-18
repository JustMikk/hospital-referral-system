import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";

export const metadata: Metadata = {
    title: "System Admin Login | Refero",
    description: "Secure system administrator access",
};

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Shield className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">System Administrator</h1>
                    <p className="text-sm text-muted-foreground">
                        Secure access for platform management only
                    </p>
                </div>

                <Card className="border-border/40 shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl">Sign in</CardTitle>
                        <CardDescription>
                            Enter your system credentials to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="admin@system.internal" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input id="password" type="password" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 rounded border border-primary/50 bg-background" />
                            <label htmlFor="mfa" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                I have my MFA device ready
                            </label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full gap-2">
                            <Lock className="h-4 w-4" />
                            Authenticate
                        </Button>
                        <div className="text-center text-xs text-muted-foreground">
                            <p>Unauthorized access is prohibited and logged.</p>
                            <p className="mt-1">IP Address: 192.168.1.1 (Logged)</p>
                        </div>
                    </CardFooter>
                </Card>

                <div className="text-center">
                    <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Not a system admin? Go to Staff Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
