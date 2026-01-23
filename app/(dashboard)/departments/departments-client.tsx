"use client";

import { useState } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { Building2, Users, MoreHorizontal, Plus, Pencil, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import { createDepartment, updateDepartment, toggleDepartmentStatus } from "@/app/actions/departments";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Department {
    id: string;
    name: string;
    status: string;
    head: string;
    staffCount: number;
}

interface DepartmentsClientProps {
    initialDepartments: Department[];
}

export default function DepartmentsClient({ initialDepartments }: DepartmentsClientProps) {
    const router = useRouter();
    const [departments, setDepartments] = useState(initialDepartments);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [newDeptName, setNewDeptName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEdit = (dept: Department) => {
        setEditingId(dept.id);
        setEditName(dept.name);
    };

    const saveEdit = async (id: string) => {
        try {
            await updateDepartment(id, { name: editName });
            toast.success("Department updated successfully");
            setEditingId(null);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update department");
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleDepartmentStatus(id);
            toast.success("Department status updated");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to update department status");
        }
    };

    const handleCreate = async () => {
        if (!newDeptName.trim()) return;
        setIsSubmitting(true);
        try {
            await createDepartment({ name: newDeptName });
            toast.success("Department created successfully");
            setIsAddOpen(false);
            setNewDeptName("");
            router.refresh();
        } catch (error) {
            toast.error("Failed to create department");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Departments"
                description="Manage hospital departments and operational units"
            >
                <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add Department
                </Button>
            </PageHeader>

            <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="rounded-xl border border-border/40 overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/40">
                                    <TableHead className="font-semibold">Department Name</TableHead>
                                    <TableHead className="font-semibold">Head of Dept</TableHead>
                                    <TableHead className="font-semibold">Staff Count</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No departments found. Create your first department.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    departments.map((dept) => (
                                        <TableRow key={dept.id} className="hover:bg-muted/40 transition-colors">
                                            <TableCell>
                                                {editingId === dept.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            className="h-8 w-[200px]"
                                                        />
                                                        <Button size="sm" onClick={() => saveEdit(dept.id)}>Save</Button>
                                                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                            <Building2 className="h-4 w-4" />
                                                        </div>
                                                        <span className="font-medium">{dept.name}</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {dept.head}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{dept.staffCount}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "font-medium",
                                                        dept.status === "ACTIVE" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                                                        dept.status === "INACTIVE" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                                    )}
                                                >
                                                    {dept.status}
                                                </Badge>
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
                                                        <DropdownMenuItem onClick={() => handleEdit(dept)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit Name
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleToggleStatus(dept.id)}
                                                            className={dept.status === "ACTIVE" ? "text-red-600" : "text-emerald-600"}
                                                        >
                                                            <Power className="mr-2 h-4 w-4" />
                                                            {dept.status === "ACTIVE" ? "Disable" : "Enable"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                        <DialogDescription>
                            Create a new operational unit for your hospital.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Department Name</label>
                            <Input
                                id="name"
                                placeholder="e.g. Oncology"
                                value={newDeptName}
                                onChange={(e) => setNewDeptName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isSubmitting || !newDeptName.trim()}>
                            {isSubmitting ? "Creating..." : "Create Department"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
