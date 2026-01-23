"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Activity,
    AlertTriangle,
    FileText,
    Pill,
    Stethoscope,
    ShieldAlert,
    Plus,
    History,
    Loader2,
    Building2,
    Upload,
} from "lucide-react";
import { createMedicalRecord } from "@/app/actions/patients";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DocumentUploadDialog } from "@/components/medical/document-upload-dialog";
import { DocumentList } from "@/components/medical/document-list";

interface PatientProfileClientProps {
    patient: any;
}

export default function PatientProfileClient({ patient }: PatientProfileClientProps) {
    const router = useRouter();
    const { userRole } = useAuth();
    const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [newRecord, setNewRecord] = useState({
        type: "Note",
        title: "",
        details: "",
    });

    const handleAddRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createMedicalRecord({
                patientId: patient.id,
                ...newRecord,
            });
            toast.success("Medical record added successfully");
            setIsAddRecordOpen(false);
            setNewRecord({ type: "Note", title: "", details: "" });
            router.refresh();
        } catch (error) {
            toast.error("Failed to add medical record");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20 border-2 border-border">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">{patient.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <span>{patient.age} yrs</span>
                            <span>•</span>
                            <span>{patient.gender}</span>
                            <span>•</span>
                            <span>ID: {patient.id}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <Badge variant="outline" className="gap-1">
                                <Building2 className="h-3 w-3" />
                                {patient.hospital.name}
                            </Badge>
                            {patient.status === "Critical" && (
                                <Badge variant="destructive" className="animate-pulse gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Critical Status
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {(userRole === "doctor" || userRole === "nurse") && (
                        <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Record
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Medical Record</DialogTitle>
                                    <DialogDescription>
                                        Add a new note, diagnosis, or lab result to the patient's history.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddRecord} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Record Type</Label>
                                        <Select
                                            value={newRecord.type}
                                            onValueChange={(v) => setNewRecord({ ...newRecord, type: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Note">Clinical Note</SelectItem>
                                                <SelectItem value="Diagnosis">Diagnosis</SelectItem>
                                                <SelectItem value="Lab Result">Lab Result</SelectItem>
                                                <SelectItem value="Prescription">Prescription</SelectItem>
                                                <SelectItem value="Procedure">Procedure</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., Routine Checkup, Blood Test Results"
                                            value={newRecord.title}
                                            onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="details">Details</Label>
                                        <Textarea
                                            id="details"
                                            placeholder="Enter detailed information..."
                                            value={newRecord.details}
                                            onChange={(e) => setNewRecord({ ...newRecord, details: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsAddRecordOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save Record"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            {/* Critical Alerts */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Allergies</AlertTitle>
                    <AlertDescription>
                        {patient.allergies.length > 0 ? patient.allergies.join(", ") : "None reported"}
                    </AlertDescription>
                </Alert>
                <Alert className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30">
                    <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="text-amber-800 dark:text-amber-400">Chronic Conditions</AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-500">
                        {patient.chronicConditions.length > 0 ? patient.chronicConditions.join(", ") : "None reported"}
                    </AlertDescription>
                </Alert>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                    <TabsTrigger
                        value="overview"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                    >
                        Medical History
                    </TabsTrigger>
                    <TabsTrigger
                        value="medications"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                    >
                        Medications
                    </TabsTrigger>
                    <TabsTrigger
                        value="labs"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                    >
                        Lab Results
                    </TabsTrigger>
                    <TabsTrigger
                        value="documents"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                    >
                        Documents
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-primary" />
                                    Active Diagnoses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {patient.medicalRecords.filter((r: any) => r.type === "Diagnosis").slice(0, 3).map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">{item.details}</p>
                                        </div>
                                        <Badge variant="secondary">Active</Badge>
                                    </div>
                                ))}
                                {patient.medicalRecords.filter((r: any) => r.type === "Diagnosis").length === 0 && (
                                    <p className="text-sm text-muted-foreground italic">No active diagnoses found.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-primary" />
                                    Current Medications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {patient.medicalRecords.filter((r: any) => r.type === "Prescription").map((med: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{med.title}</p>
                                            <p className="text-xs text-muted-foreground">{med.details}</p>
                                        </div>
                                        <Badge variant="outline" className="text-xs">Active</Badge>
                                    </div>
                                ))}
                                {patient.medicalRecords.filter((r: any) => r.type === "Prescription").length === 0 && (
                                    <p className="text-sm text-muted-foreground italic">No active medications found.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                    <Card>
                        <CardContent className="p-0">
                            {patient.medicalRecords.map((item: any, i: number) => (
                                <div key={i} className="flex items-center p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                                        <History className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.title}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{new Date(item.date).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{item.type}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(item)}>View Details</Button>
                                </div>
                            ))}
                            {patient.medicalRecords.length === 0 && (
                                <div className="p-8 text-center">
                                    <p className="text-muted-foreground">No medical history found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Medical Record Details Dialog */}
                <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedRecord?.title}</DialogTitle>
                            <DialogDescription>
                                {selectedRecord?.type} • {selectedRecord && new Date(selectedRecord.date).toLocaleDateString()}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="whitespace-pre-wrap">{selectedRecord?.details || "No details available."}</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedRecord(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <TabsContent value="medications" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {patient.medicalRecords.filter((r: any) => r.type === "Prescription").map((med: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{med.title}</p>
                                            <p className="text-sm text-muted-foreground">{med.details}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Prescribed on {new Date(med.date).toLocaleDateString()}</p>
                                        </div>
                                        <Badge>Active</Badge>
                                    </div>
                                ))}
                                {patient.medicalRecords.filter((r: any) => r.type === "Prescription").length === 0 && (
                                    <p className="text-muted-foreground text-sm italic">No medications found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="labs" className="mt-6">
                    <Card>
                        <CardContent className="p-0">
                            {patient.medicalRecords.filter((r: any) => r.type === "Lab Result").map((lab: any, i: number) => (
                                <div key={i} className="flex items-center p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-4">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{lab.title}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{new Date(lab.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">Normal</Badge>
                                </div>
                            ))}
                            {patient.medicalRecords.filter((r: any) => r.type === "Lab Result").length === 0 && (
                                <div className="p-8 text-center">
                                    <p className="text-muted-foreground">No lab results found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Medical Documents
                            </CardTitle>
                            {(userRole === "doctor" || userRole === "nurse") && (
                                <DocumentUploadDialog
                                    patientId={patient.id}
                                    patientName={patient.name}
                                    trigger={
                                        <Button size="sm" className="gap-2">
                                            <Upload className="h-4 w-4" />
                                            Upload
                                        </Button>
                                    }
                                />
                            )}
                        </CardHeader>
                        <CardContent>
                            <DocumentList
                                documents={patient.medicalDocuments || []}
                                patientId={patient.id}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
