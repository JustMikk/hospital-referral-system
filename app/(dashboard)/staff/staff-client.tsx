"use client";

import { useState } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, MoreHorizontal, Phone, Shield, UserCog, Stethoscope, Filter, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { inviteStaff, updateStaffRole } from "@/app/actions/staff";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string | null;
    avatar: string | null;
    createdAt: Date;
}

interface Department {
    id: string;
    name: string;
}

interface StaffClientProps {
    initialStaff: StaffMember[];
    departments: Department[];
}

export default function StaffClient({ initialStaff, departments }: StaffClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredStaff = initialStaff.filter((s) => {
        const matchesSearch =
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || s.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            await updateStaffRole(userId, newRole);
            toast.success("Staff role updated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update staff role");
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Staff Management"
                description="Manage hospital staff access, roles, and departments"
            >
                <Button className="gap-2" onClick={() => setIsInviteOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Invite Staff
                </Button>
            </PageHeader>

            <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Filter by role" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="DOCTOR">Doctors</SelectItem>
                                <SelectItem value="NURSE">Nurses</SelectItem>
                                <SelectItem value="HOSPITAL_ADMIN">Admins</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-xl border border-border/40 overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/40">
                                    <TableHead className="font-semibold">Staff Member</TableHead>
                                    <TableHead className="font-semibold">Role</TableHead>
                                    <TableHead className="font-semibold">Department</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStaff.map((member) => (
                                    <TableRow key={member.id} className="hover:bg-muted/40 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-border/50">
                                                    <AvatarImage src={member.avatar || undefined} />
                                                    <AvatarFallback className="bg-primary/10 text-primary">{member.name ? member.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{member.name}</p>
                                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {member.role === "HOSPITAL_ADMIN" ? (
                                                    <Shield className="h-4 w-4 text-purple-500" />
                                                ) : (
                                                    <UserCog className="h-4 w-4 text-blue-500" />
                                                )}
                                                <span className="text-sm">{member.role}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">
                                                {member.department || "N/A"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className="font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                            >
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(member.createdAt).toLocaleDateString()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setSelectedStaff(member)}>
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setSelectedStaff(member)}>
                                                        Edit Role
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Invite Staff Modal */}
            <InviteStaffModal open={isInviteOpen} onOpenChange={setIsInviteOpen} departments={departments} />

            {/* Staff Detail Drawer */}
            <Sheet open={!!selectedStaff} onOpenChange={(open) => !open && setSelectedStaff(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedStaff && (
                        <div className="space-y-6">
                            <SheetHeader className="flex flex-row items-start gap-4 space-y-0">
                                <Avatar className="h-16 w-16 border-2 border-border">
                                    <AvatarImage src={selectedStaff.avatar || undefined} />
                                    <AvatarFallback className="text-lg bg-primary/10 text-primary">{selectedStaff.name ? selectedStaff.name.charAt(0).toUpperCase() : <User className="h-6 w-6" />}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <SheetTitle>{selectedStaff.name}</SheetTitle>
                                    <SheetDescription>{selectedStaff.email}</SheetDescription>
                                    <div className="flex gap-2 pt-1">
                                        <Badge variant="outline">{selectedStaff.role}</Badge>
                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                            Active
                                        </Badge>
                                    </div>
                                </div>
                            </SheetHeader>

                            <Tabs defaultValue="profile" className="w-full">
                                <TabsList className="w-full">
                                    <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                                    <TabsTrigger value="permissions" className="flex-1">Permissions</TabsTrigger>
                                    <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                                </TabsList>

                                <TabsContent value="profile" className="space-y-4 mt-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground">Department</Label>
                                            <div className="flex items-center gap-2 p-2 rounded-md border border-border/50 bg-muted/20">
                                                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{selectedStaff.department || "N/A"}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-muted-foreground">Contact</Label>
                                            <div className="flex items-center gap-2 p-2 rounded-md border border-border/50 bg-muted/20">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">N/A</span>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="permissions" className="space-y-4 mt-4">
                                    <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30">
                                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1">Role Assignment</h4>
                                        <p className="text-xs text-amber-700 dark:text-amber-500 mb-3">
                                            Changing roles will update access permissions immediately.
                                        </p>
                                        <Select
                                            defaultValue={selectedStaff.role}
                                            onValueChange={(val) => handleUpdateRole(selectedStaff.id, val)}
                                        >
                                            <SelectTrigger className="bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DOCTOR">Doctor</SelectItem>
                                                <SelectItem value="NURSE">Nurse</SelectItem>
                                                <SelectItem value="HOSPITAL_ADMIN">Hospital Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TabsContent>

                                <TabsContent value="activity" className="space-y-4 mt-4">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium">Recent Activity</h4>
                                        <p className="text-sm text-muted-foreground italic">No recent activity found for this user.</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

function InviteStaffModal({ open, onOpenChange, departments }: { open: boolean; onOpenChange: (open: boolean) => void; departments: Department[] }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "DOCTOR",
        department: "",
    });

    const handleInvite = async () => {
        setIsSubmitting(true);
        try {
            await inviteStaff(formData);
            toast.success("Staff member invited successfully", {
                description: `${formData.name} will receive login credentials.`,
            });
            onOpenChange(false);
            setStep(1);
            setFormData({ name: "", email: "", role: "DOCTOR", department: "" });
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to invite staff member");
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 1, label: "Info", icon: User },
        { id: 2, label: "Role", icon: UserCog },
        { id: 3, label: "Review", icon: Shield },
    ];

    const roleOptions = [
        { value: "DOCTOR", label: "Doctor", icon: Stethoscope, description: "Full clinical access" },
        { value: "NURSE", label: "Nurse", icon: User, description: "Patient care access" },
        { value: "HOSPITAL_ADMIN", label: "Hospital Admin", icon: Shield, description: "Administrative access" },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Invite New Staff</DialogTitle>
                        <DialogDescription>
                            Add a new team member to your hospital
                        </DialogDescription>
                    </DialogHeader>

                    {/* Step indicator */}
                    <div className="flex items-center justify-between mt-6 px-4">
                        {steps.map((s, idx) => (
                            <div key={s.id} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                            step > s.id && "border-primary bg-primary text-primary-foreground",
                                            step === s.id && "border-primary bg-primary/10 text-primary ring-4 ring-primary/20",
                                            step < s.id && "border-muted-foreground/30 text-muted-foreground"
                                        )}
                                    >
                                        {step > s.id ? (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <s.icon className="h-4 w-4" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium mt-1.5 transition-colors",
                                        step >= s.id ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        {s.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={cn(
                                        "h-0.5 w-12 mx-2 -mt-5 transition-colors duration-300",
                                        step > s.id ? "bg-primary" : "bg-muted-foreground/20"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 pt-4 min-h-[280px]">
                    {step === 1 && (
                        <div className="grid gap-4 animate-in fade-in-0 slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Dr. Jane Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="jane.doe@hospital.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid gap-4 animate-in fade-in-0 slide-in-from-right-4 duration-300">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Select Role</Label>
                                <div className="grid gap-2">
                                    {roleOptions.map((role) => (
                                        <div
                                            key={role.value}
                                            onClick={() => setFormData({ ...formData, role: role.value })}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                                "hover:scale-[1.01] active:scale-[0.99]",
                                                formData.role === role.value
                                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-9 w-9 rounded-lg flex items-center justify-center transition-colors",
                                                formData.role === role.value
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                            )}>
                                                <role.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{role.label}</p>
                                                <p className="text-xs text-muted-foreground">{role.description}</p>
                                            </div>
                                            {formData.role === role.value && (
                                                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Department</Label>
                                <Select
                                    value={formData.department}
                                    onValueChange={(val) => setFormData({ ...formData, department: val })}
                                >
                                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
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
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid gap-4 animate-in fade-in-0 slide-in-from-right-4 duration-300">
                            <div className="rounded-xl border-2 border-border overflow-hidden">
                                <div className="bg-muted/50 px-4 py-2 border-b">
                                    <p className="text-sm font-medium">Staff Details</p>
                                </div>
                                <div className="p-4 space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Name</span>
                                        <span className="font-medium">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Email</span>
                                        <span className="font-medium">{formData.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Role</span>
                                        <Badge variant="secondary">{formData.role}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Department</span>
                                        <span className="font-medium">{formData.department || "Not assigned"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                        <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                            Default Password
                                        </p>
                                        <code className="inline-block mt-1 px-2 py-0.5 bg-white dark:bg-background rounded font-mono text-sm border">
                                            Welcome123!
                                        </code>
                                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                                            Share securely. Must change after first login.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-4 bg-muted/30 border-t">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            variant="ghost"
                            onClick={() => setStep(step - 1)}
                            disabled={step === 1}
                            className={cn(
                                "transition-all duration-200",
                                step === 1 && "opacity-0 pointer-events-none"
                            )}
                        >
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground mr-2">
                                Step {step} of 3
                            </span>
                            {step < 3 ? (
                                <Button
                                    onClick={() => setStep(step + 1)}
                                    disabled={step === 1 && (!formData.name || !formData.email)}
                                    className="gap-2 min-w-[100px] transition-all duration-200"
                                >
                                    Continue
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleInvite}
                                    disabled={isSubmitting}
                                    className="gap-2 min-w-[120px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-200"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Send Invite
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
