"use client";

import { useState } from "react";
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
import { Search, Plus, Building2, MoreHorizontal, MapPin, Phone, Mail } from "lucide-react";
import { hospitals, Hospital } from "@/lib/mock-data";
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

export default function HospitalManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

    const filteredHospitals = hospitals.filter((hospital) => {
        const matchesSearch =
            hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hospital.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all" || hospital.type === typeFilter;
        return matchesSearch && matchesType;
    });

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
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Specialty">Specialty</SelectItem>
                                <SelectItem value="Clinic">Clinic</SelectItem>
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
                                    <TableHead className="font-semibold">Specialties</TableHead>
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
                                                className={cn(
                                                    "font-medium",
                                                    hospital.status === "Connected" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                                                    hospital.status === "Pending" && "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                                                    hospital.status === "Inactive" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                                )}
                                            >
                                                {hospital.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {hospital.specialties.slice(0, 2).map((s) => (
                                                    <span key={s} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-muted font-medium text-muted-foreground">
                                                        {s}
                                                    </span>
                                                ))}
                                                {hospital.specialties.length > 2 && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-muted font-medium text-muted-foreground">
                                                        +{hospital.specialties.length - 2}
                                                    </span>
                                                )}
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
                                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Manage Departments</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">Suspend Access</DropdownMenuItem>
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
                                    <TabsTrigger value="departments" className="flex-1">Departments</TabsTrigger>
                                    <TabsTrigger value="sharing" className="flex-1">Sharing</TabsTrigger>
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
                                                className={cn(
                                                    "font-medium",
                                                    selectedHospital.status === "Connected" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                                                    selectedHospital.status === "Pending" && "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                                                    selectedHospital.status === "Inactive" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                                )}
                                            >
                                                {selectedHospital.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="departments" className="space-y-4 mt-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium">Active Departments</h4>
                                        <Button variant="outline" size="sm">Add Dept</Button>
                                    </div>
                                    <div className="grid gap-2">
                                        {selectedHospital.specialties.map((dept) => (
                                            <div key={dept} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                                                <span className="text-sm">{dept}</span>
                                                <Switch defaultChecked />
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="sharing" className="space-y-4 mt-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between space-x-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Incoming Referrals</p>
                                                <p className="text-xs text-muted-foreground">Allow receiving patients</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between space-x-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Outgoing Referrals</p>
                                                <p className="text-xs text-muted-foreground">Allow sending patients</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between space-x-4 p-3 rounded-lg bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-red-700 dark:text-red-400">Emergency Override</p>
                                                <p className="text-xs text-red-600/80 dark:text-red-400/80">Allow break-glass access</p>
                                            </div>
                                            <Switch />
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
