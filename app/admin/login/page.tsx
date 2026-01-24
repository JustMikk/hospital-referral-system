import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";

export const metadata: Metadata = {
    title: "System Admin Login | Refero",
    description: "Secure system administrator access",
};

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="w-full max-w-md space-y-6">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Shield className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-semibold">System Administrator</h1>
                    <p className="text-sm text-muted-foreground">
                        Restricted access for platform management
                    </p>
                </div>

                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Sign in</CardTitle>
                        <CardDescription>
                            Enter your administrator credentials
                        </CardDescription>
                    </CardHeader>

                    <form>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@refero.io"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="mfa" />
                                <Label htmlFor="mfa" className="text-sm">
                                    I have my MFA device ready
                                </Label>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3">
                            <Button type="submit" className="w-full gap-2">
                                <Lock className="h-4 w-4" />
                                Authenticate
                            </Button>

                            <p className="text-center text-xs text-muted-foreground">
                                Unauthorized access attempts are monitored and logged.
                            </p>
                        </CardFooter>
                    </form>
                </Card>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        Not a system admin? Go to Staff Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
