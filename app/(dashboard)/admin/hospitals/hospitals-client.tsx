"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Building2, MoreHorizontal, MapPin, Phone, Mail, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { updateHospitalStatus } from "@/app/actions/admin";
import { toast } from "sonner";

interface Hospital {
    id: string;
    name: string;
    type: string;
    location: string;
    status: string;
    specialties: string[];
    contactEmail: string;
    contactPhone: string;
    createdAt: Date;
    _count: {
        users: number;
        patients: number;
        departments: number;
    };
}

interface HospitalsClientProps {
    initialHospitals: Hospital[];
}

export default function HospitalsClient({ initialHospitals }: HospitalsClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

    const filteredHospitals = initialHospitals.filter((hospital) => {
        const matchesSearch =
            hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hospital.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all" || hospital.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleStatusChange = async (hospitalId: string, newStatus: "CONNECTED" | "PENDING" | "INACTIVE") => {
        try {
            await updateHospitalStatus(hospitalId, newStatus);
            toast.success("Hospital status updated");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update hospital status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONNECTED":
                return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
            case "PENDING":
                return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
            case "INACTIVE":
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
            default:
                return "";
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Hospital Management"
                description="Manage connected hospitals, clinics, and specialty centers"
            >
                <Button className="gap-2" asChild>
                    <Link href="/admin/hospitals/create">
                        <Plus className="h-4 w-4" />
                        Add Hospital
                    </Link>
                </Button>
            </PageHeader>

            <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                            <Input
                                placeholder="Search hospitals..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="GENERAL">General</SelectItem>
                                <SelectItem value="SPECIALTY">Specialty</SelectItem>
                                <SelectItem value="CLINIC">Clinic</SelectItem>
                                <SelectItem value="REHABILITATION">Rehabilitation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-xl border border-border/40 overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/40">
                                    <TableHead className="font-semibold">Hospital Name</TableHead>
                                    <TableHead className="font-semibold">Type</TableHead>
                                    <TableHead className="font-semibold">Location</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Staff</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredHospitals.map((hospital) => (
                                    <TableRow key={hospital.id} className="hover:bg-muted/40 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <Building2 className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{hospital.name}</p>
                                                    <p className="text-xs text-muted-foreground">{hospital.contactPhone}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">
                                                {hospital.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span className="truncate max-w-[150px]">{hospital.location}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={cn("font-medium", getStatusColor(hospital.status))}
                                            >
                                                {hospital.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <Users className="h-3.5 w-3.5" />
                                                <span>{hospital._count.users}</span>
                                            </div>
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
                                                    <DropdownMenuItem onClick={() => setSelectedHospital(hospital)}>
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(hospital.id, "CONNECTED")}
                                                        disabled={hospital.status === "CONNECTED"}
                                                    >
                                                        Set Connected
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(hospital.id, "PENDING")}
                                                        disabled={hospital.status === "PENDING"}
                                                    >
                                                        Set Pending
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(hospital.id, "INACTIVE")}
                                                        disabled={hospital.status === "INACTIVE"}
                                                        className="text-red-600"
                                                    >
                                                        Set Inactive
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredHospitals.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No hospitals found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Sheet open={!!selectedHospital} onOpenChange={(open) => !open && setSelectedHospital(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedHospital && (
                        <div className="space-y-6">
                            <SheetHeader>
                                <SheetTitle>{selectedHospital.name}</SheetTitle>
                                <SheetDescription>
                                    {selectedHospital.type} • {selectedHospital.location}
                                </SheetDescription>
                            </SheetHeader>

                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="w-full">
                                    <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                                    <TabsTrigger value="stats" className="flex-1">Statistics</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-4 mt-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                {selectedHospital.contactEmail}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                {selectedHospital.contactPhone}
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                                            <Badge
                                                variant="secondary"
                                                className={cn("font-medium", getStatusColor(selectedHospital.status))}
                                            >
                                                {selectedHospital.status}
                                            </Badge>
                                        </div>
                                        <Separator />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Specialties</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedHospital.specialties.map((s) => (
                                                    <Badge key={s} variant="outline" className="text-xs">
                                                        {s}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="stats" className="space-y-4 mt-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                                            <p className="text-2xl font-bold">{selectedHospital._count.users}</p>
                                            <p className="text-xs text-muted-foreground">Staff</p>
                                        </div>
                                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                                            <p className="text-2xl font-bold">{selectedHospital._count.patients}</p>
                                            <p className="text-xs text-muted-foreground">Patients</p>
                                        </div>
                                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                                            <p className="text-2xl font-bold">{selectedHospital._count.departments}</p>
                                            <p className="text-xs text-muted-foreground">Departments</p>
                                        </div>
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

