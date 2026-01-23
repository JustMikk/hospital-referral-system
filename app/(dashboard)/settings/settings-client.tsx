"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User, Bell, Shield, Palette, Save, Loader2, Check } from "lucide-react";
import { updateProfile, changePassword } from "@/app/actions/profile";
import { toast } from "sonner";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string | null;
    hospital: { name: string } | null;
}

interface Department {
    id: string;
    name: string;
}

interface SettingsClientProps {
    user: UserData;
    departments: Department[];
}

export default function SettingsClient({ user, departments }: SettingsClientProps) {
    const router = useRouter();

    // Profile state
    const [profileData, setProfileData] = useState({
        name: user.name,
        department: user.department || "",
    });
    const [isProfileSaving, setIsProfileSaving] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isPasswordSaving, setIsPasswordSaving] = useState(false);

    // Notifications state
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        referralUpdates: true,
        messageAlerts: true,
        systemUpdates: false,
    });

    const handleProfileSave = async () => {
        setIsProfileSaving(true);
        try {
            await updateProfile(profileData);
            setProfileSaved(true);
            toast.success("Profile updated successfully");
            setTimeout(() => setProfileSaved(false), 2000);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsProfileSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsPasswordSaving(true);
        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success("Password changed successfully");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            toast.error(error.message || "Failed to change password");
        } finally {
            setIsPasswordSaving(false);
        }
    };

    const getInitials = (name: string) => {
        return name.split(" ").map((n) => n[0]).join("").toUpperCase();
    };

    const formatRole = (role: string) => {
        return role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Settings"
                description="Manage your account preferences and system settings"
            />

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-muted">
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2">
                        <Palette className="h-4 w-4" />
                        Appearance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal information and contact details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-card-foreground">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground">{formatRole(user.role)}</p>
                                    <p className="text-sm text-muted-foreground">{user.department || "No department"}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={user.email} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select
                                        value={profileData.department}
                                        onValueChange={(v) => setProfileData({ ...profileData, department: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.length > 0 ? (
                                                departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.name}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <>
                                                    <SelectItem value="General">General</SelectItem>
                                                    <SelectItem value="Administration">Administration</SelectItem>
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hospital">Hospital</Label>
                                    <Input id="hospital" value={user.hospital?.name || "N/A"} disabled />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button className="gap-2" onClick={handleProfileSave} disabled={isProfileSaving}>
                                    {isProfileSaving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : profileSaved ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {profileSaved ? "Saved!" : "Save Changes"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose how you want to receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="email-notif" className="font-medium">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive notifications via email
                                        </p>
                                    </div>
                                    <Switch
                                        id="email-notif"
                                        checked={notifications.email}
                                        onCheckedChange={(checked) =>
                                            setNotifications((prev) => ({ ...prev, email: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="push-notif" className="font-medium">Push Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive push notifications in browser
                                        </p>
                                    </div>
                                    <Switch
                                        id="push-notif"
                                        checked={notifications.push}
                                        onCheckedChange={(checked) =>
                                            setNotifications((prev) => ({ ...prev, push: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="referral-notif" className="font-medium">Referral Updates</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Get notified when referral status changes
                                        </p>
                                    </div>
                                    <Switch
                                        id="referral-notif"
                                        checked={notifications.referralUpdates}
                                        onCheckedChange={(checked) =>
                                            setNotifications((prev) => ({ ...prev, referralUpdates: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="message-notif" className="font-medium">Message Alerts</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Get notified for new messages
                                        </p>
                                    </div>
                                    <Switch
                                        id="message-notif"
                                        checked={notifications.messageAlerts}
                                        onCheckedChange={(checked) =>
                                            setNotifications((prev) => ({ ...prev, messageAlerts: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="system-notif" className="font-medium">System Updates</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive system maintenance notifications
                                        </p>
                                    </div>
                                    <Switch
                                        id="system-notif"
                                        checked={notifications.systemUpdates}
                                        onCheckedChange={(checked) =>
                                            setNotifications((prev) => ({ ...prev, systemUpdates: checked }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button 
                                    className="gap-2"
                                    onClick={() => toast.success("Notification preferences saved (local only)")}
                                >
                                    <Save className="h-4 w-4" />
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Manage your password and security preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    className="gap-2"
                                    onClick={handlePasswordChange}
                                    disabled={isPasswordSaving || !passwordData.currentPassword || !passwordData.newPassword}
                                >
                                    {isPasswordSaving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    Update Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Appearance Settings</CardTitle>
                            <CardDescription>
                                Customize the look and feel of the application
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Theme</Label>
                                    <Select defaultValue="system">
                                        <SelectTrigger className="w-full sm:w-[200px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Theme changes are applied automatically based on your system settings.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

