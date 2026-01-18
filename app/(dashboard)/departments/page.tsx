"use client";

import { useState } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Building2, Users, MoreHorizontal, Plus, Pencil, Power } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for departments
const initialDepartments = [
    { id: 1, name: "Emergency Medicine", staffCount: 12, status: "Active", head: "Dr. Sarah Smith" },
    { id: 2, name: "Cardiology", staffCount: 8, status: "Active", head: "Dr. James Wilson" },
    { id: 3, name: "Pediatrics", staffCount: 6, status: "Active", head: "Dr. Emily Chen" },
    { id: 4, name: "Neurology", staffCount: 4, status: "Inactive", head: "Vacant" },
];

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState(initialDepartments);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    const handleEdit = (dept: typeof initialDepartments[0]) => {
        setEditingId(dept.id);
        setEditName(dept.name);
    };

    const saveEdit = (id: number) => {
        setDepartments(departments.map(d => d.id === id ? { ...d, name: editName } : d));
        setEditingId(null);
    };

    const toggleStatus = (id: number) => {
        setDepartments(departments.map(d => {
            if (d.id === id) {
                // Prevent disabling if staff count > 0 (Mock logic)
                if (d.staffCount > 0 && d.status === "Active") {
                    alert("Cannot disable department with active staff. Reassign staff first.");
                    return d;
                }
                return { ...d, status: d.status === "Active" ? "Inactive" : "Active" };
            }
            return d;
        }));
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
                                {departments.map((dept) => (
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
                                                    dept.status === "Active" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                                                    dept.status === "Inactive" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
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
                                                    <DropdownMenuItem onClick={() => toggleStatus(dept.id)} className={dept.status === "Active" ? "text-red-600" : "text-emerald-600"}>
                                                        <Power className="mr-2 h-4 w-4" />
                                                        {dept.status === "Active" ? "Disable" : "Enable"}
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
                            <Input id="name" placeholder="e.g. Oncology" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsAddOpen(false)}>Create Department</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
