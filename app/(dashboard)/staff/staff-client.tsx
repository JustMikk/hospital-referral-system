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
import { Search, Plus, MoreHorizontal, Phone, Shield, UserCog, Stethoscope, Filter } from "lucide-react";
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

interface StaffClientProps {
    initialStaff: StaffMember[];
}

export default function StaffClient({ initialStaff }: StaffClientProps) {
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
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
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
                                                    <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">Deactivate Account</DropdownMenuItem>
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
            <InviteStaffModal open={isInviteOpen} onOpenChange={setIsInviteOpen} />

            {/* Staff Detail Drawer */}
            <Sheet open={!!selectedStaff} onOpenChange={(open) => !open && setSelectedStaff(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedStaff && (
                        <div className="space-y-6">
                            <SheetHeader className="flex flex-row items-start gap-4 space-y-0">
                                <Avatar className="h-16 w-16 border-2 border-border">
                                    <AvatarImage src={selectedStaff.avatar || undefined} />
                                    <AvatarFallback className="text-lg">{selectedStaff.name.charAt(0)}</AvatarFallback>
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

function InviteStaffModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
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
            toast.success("Staff member invited successfully");
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite New Staff</DialogTitle>
                    <DialogDescription>
                        Step {step} of 3: {step === 1 ? "Basic Info" : step === 2 ? "Role & Access" : "Review"}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Dr. Jane Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="jane.doe@hospital.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(val) => setFormData({ ...formData, role: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DOCTOR">Doctor</SelectItem>
                                    <SelectItem value="NURSE">Nurse</SelectItem>
                                    <SelectItem value="HOSPITAL_ADMIN">Hospital Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Select
                                value={formData.department}
                                onValueChange={(val) => setFormData({ ...formData, department: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                    <SelectItem value="Administration">Administration</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="emergency" />
                            <label
                                htmlFor="emergency"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Allow Emergency Access (Break-Glass)
                            </label>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="grid gap-4 py-4">
                        <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-medium">{formData.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{formData.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Role:</span>
                                <span className="font-medium">{formData.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Department:</span>
                                <span className="font-medium">{formData.department}</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            An invitation email will be sent to this address. The link expires in 48 hours.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    {step > 1 && (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>
                            Back
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button onClick={() => setStep(step + 1)} disabled={!formData.name || !formData.email}>Next</Button>
                    ) : (
                        <Button onClick={handleInvite} disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Invite"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
