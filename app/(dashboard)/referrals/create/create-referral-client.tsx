"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, AlertTriangle, FileText, Shield, Stethoscope, Paperclip, File } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { createReferral } from "@/app/actions/referrals";
import { getPatientDocuments } from "@/app/actions/documents";

interface Patient {
    id: string;
    name: string;
}

interface Hospital {
    id: string;
    name: string;
}

interface CreateReferralClientProps {
    patients: Patient[];
    hospitals: Hospital[];
    preselectedPatientId?: string;
}

export default function CreateReferralClient({ patients, hospitals, preselectedPatientId }: CreateReferralClientProps) {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        patientId: preselectedPatientId || "",
        toHospitalId: "",
        priority: "NORMAL",
        reason: "",
        notes: "",
        emergencyConfirmed: false,
        emergencyReason: "",
        immediateRisks: "",
        shareLabResults: true,
        shareImaging: false,
        shareNotes: true,
        attachedDocumentIds: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [patientDocuments, setPatientDocuments] = useState<any[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(false);

    // Fetch patient documents when patient changes
    useEffect(() => {
        async function fetchDocuments() {
            if (formData.patientId) {
                setLoadingDocuments(true);
                try {
                    const docs = await getPatientDocuments(formData.patientId);
                    setPatientDocuments(docs);
                } catch (error) {
                    console.error("Failed to fetch documents:", error);
                    setPatientDocuments([]);
                } finally {
                    setLoadingDocuments(false);
                }
            } else {
                setPatientDocuments([]);
            }
        }
        fetchDocuments();
    }, [formData.patientId]);

    const toggleDocument = (documentId: string) => {
        setFormData(prev => ({
            ...prev,
            attachedDocumentIds: prev.attachedDocumentIds.includes(documentId)
                ? prev.attachedDocumentIds.filter(id => id !== documentId)
                : [...prev.attachedDocumentIds, documentId]
        }));
    };

    const validateStep = (currentStep: number) => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.patientId) newErrors.patientId = "Please select a patient";
            if (!formData.toHospitalId) newErrors.toHospitalId = "Destination hospital is required";
            if (!formData.reason) newErrors.reason = "Referral reason is required";

            if (formData.priority === "EMERGENCY") {
                if (!formData.emergencyConfirmed) newErrors.emergencyConfirmed = "You must confirm this is an emergency";
                if (!formData.emergencyReason) newErrors.emergencyReason = "Emergency reason is required";
                if (!formData.immediateRisks) newErrors.immediateRisks = "Immediate risks must be documented";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        } else {
            setErrors({});
        }

        return isValid;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await createReferral(formData);
            router.push("/referrals");
        } catch (error) {
            console.error("Failed to create referral:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 1, title: "Basics", icon: FileText },
        { id: 2, title: "Medical Context", icon: Stethoscope },
        { id: 3, title: "Permissions", icon: Shield },
        { id: 4, title: "Review", icon: CheckCircle2 },
    ];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="shrink-0"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Create New Referral</h1>
                    <p className="text-muted-foreground text-sm">Step {step} of 4: {steps[step - 1].title}</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="relative flex justify-between mb-8 px-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
                {steps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 bg-background px-2">
                        <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors",
                            step >= s.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"
                        )}>
                            <s.icon className="h-5 w-5" />
                        </div>
                        <span className={cn(
                            "text-xs font-medium",
                            step >= s.id ? "text-primary" : "text-muted-foreground"
                        )}>{s.title}</span>
                    </div>
                ))}
            </div>

            {/* Step 1: Basics */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Referral Basics</CardTitle>
                        <CardDescription>Define where and why the patient is being referred.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Select Patient *</Label>
                                <Select
                                    value={formData.patientId}
                                    onValueChange={(val) => setFormData({ ...formData, patientId: val })}
                                >
                                    <SelectTrigger className={errors.patientId ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Select patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patients.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.patientId && <p className="text-xs text-destructive">{errors.patientId}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Urgency Level *</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(val) => setFormData({ ...formData, priority: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NORMAL">Routine (Normal)</SelectItem>
                                        <SelectItem value="URGENT">Urgent (24-48h)</SelectItem>
                                        <SelectItem value="EMERGENCY">Emergency (Immediate)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Receiving Hospital *</Label>
                                <Select
                                    value={formData.toHospitalId}
                                    onValueChange={(val) => setFormData({ ...formData, toHospitalId: val })}
                                >
                                    <SelectTrigger className={errors.toHospitalId ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Select hospital" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hospitals.map((h) => (
                                            <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.toHospitalId && <p className="text-xs text-destructive">{errors.toHospitalId}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Reason for Referral *</Label>
                            <Input
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="e.g. Specialized cardiac consultation required"
                                className={errors.reason ? "border-destructive" : ""}
                            />
                            {errors.reason && <p className="text-xs text-destructive">{errors.reason}</p>}
                        </div>

                        {/* Emergency Specific Fields */}
                        {formData.priority === "EMERGENCY" && (
                            <div className="space-y-6 pt-4 border-t border-red-200 dark:border-red-900/30">
                                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30">
                                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    <AlertTitle className="text-red-700 dark:text-red-400">Emergency Referral Protocol</AlertTitle>
                                    <AlertDescription className="text-red-600 dark:text-red-300">
                                        This will trigger immediate alerts at the receiving hospital. Ensure patient is stable for transfer.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="emergency-confirm"
                                        checked={formData.emergencyConfirmed}
                                        onCheckedChange={(c) => setFormData({ ...formData, emergencyConfirmed: !!c })}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="emergency-confirm"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            I confirm this referral requires immediate attention
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            By checking this, you acknowledge that this case meets emergency criteria.
                                        </p>
                                    </div>
                                </div>
                                {errors.emergencyConfirmed && <p className="text-xs text-destructive">{errors.emergencyConfirmed}</p>}

                                <div className="space-y-2">
                                    <Label>Emergency Reason *</Label>
                                    <Input
                                        value={formData.emergencyReason}
                                        onChange={(e) => setFormData({ ...formData, emergencyReason: e.target.value })}
                                        placeholder="e.g. Unstable Angina, Stroke Protocol"
                                        className={errors.emergencyReason ? "border-destructive" : ""}
                                    />
                                    {errors.emergencyReason && <p className="text-xs text-destructive">{errors.emergencyReason}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Immediate Risks *</Label>
                                    <Textarea
                                        value={formData.immediateRisks}
                                        onChange={(e) => setFormData({ ...formData, immediateRisks: e.target.value })}
                                        placeholder="Describe immediate risks to patient life or limb..."
                                        className={errors.immediateRisks ? "border-destructive" : ""}
                                    />
                                    {errors.immediateRisks && <p className="text-xs text-destructive">{errors.immediateRisks}</p>}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Medical Context */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Medical Context</CardTitle>
                        <CardDescription>Provide clinical background for the receiving doctor.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Clinical Notes</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Detailed clinical observations, history, and specific questions for the specialist..."
                                rows={10}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Permissions */}
            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Data Sharing & Permissions</CardTitle>
                        <CardDescription>Control exactly what data is shared with the receiving hospital.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Attach Documents Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium flex items-center gap-2">
                                    <Paperclip className="h-4 w-4" />
                                    Attach Patient Documents
                                </h3>
                                {formData.attachedDocumentIds.length > 0 && (
                                    <Badge variant="secondary">
                                        {formData.attachedDocumentIds.length} selected
                                    </Badge>
                                )}
                            </div>
                            
                            {loadingDocuments ? (
                                <div className="flex items-center justify-center py-8 text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Loading documents...
                                </div>
                            ) : patientDocuments.length > 0 ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {patientDocuments.map((doc) => (
                                        <div
                                            key={doc.id}
                                            onClick={() => toggleDocument(doc.id)}
                                            className={cn(
                                                "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                                                formData.attachedDocumentIds.includes(doc.id)
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                            )}
                                        >
                                            <Checkbox
                                                checked={formData.attachedDocumentIds.includes(doc.id)}
                                                onCheckedChange={() => toggleDocument(doc.id)}
                                                className="mt-0.5"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <File className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <span className="font-medium text-sm truncate">{doc.title}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                    <Badge variant="outline" className="text-xs">
                                                        {doc.type}
                                                    </Badge>
                                                    <span>
                                                        {new Date(doc.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No documents available for this patient</p>
                                    <p className="text-xs mt-1">Upload documents from the patient profile to attach them here</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-6 space-y-4">
                            <h3 className="text-sm font-medium">Include in Referral Package:</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                                    <Checkbox
                                        id="labs"
                                        checked={formData.shareLabResults}
                                        onCheckedChange={(c) => setFormData({ ...formData, shareLabResults: !!c })}
                                    />
                                    <label htmlFor="labs" className="text-sm font-medium leading-none cursor-pointer">
                                        Recent Lab Results
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                                    <Checkbox
                                        id="imaging"
                                        checked={formData.shareImaging}
                                        onCheckedChange={(c) => setFormData({ ...formData, shareImaging: !!c })}
                                    />
                                    <label htmlFor="imaging" className="text-sm font-medium leading-none cursor-pointer">
                                        Imaging Reports
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                                    <Checkbox
                                        id="notes"
                                        checked={formData.shareNotes}
                                        onCheckedChange={(c) => setFormData({ ...formData, shareNotes: !!c })}
                                    />
                                    <label htmlFor="notes" className="text-sm font-medium leading-none cursor-pointer">
                                        Clinical Notes
                                    </label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Review & Send</CardTitle>
                        <CardDescription>Please verify all details before submitting.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Patient</p>
                                <p className="font-medium">{patients.find(p => p.id === formData.patientId)?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Destination</p>
                                <p className="font-medium">{hospitals.find(h => h.id === formData.toHospitalId)?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Urgency</p>
                                <Badge variant={formData.priority === "EMERGENCY" ? "destructive" : "secondary"}>
                                    {formData.priority}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Reason</p>
                                <p className="font-medium">{formData.reason}</p>
                            </div>
                        </div>

                        {formData.priority === "EMERGENCY" && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg space-y-4">
                                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold">
                                    <AlertTriangle className="h-4 w-4" />
                                    Emergency Protocol Active
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs font-medium text-red-600 dark:text-red-300 uppercase">Emergency Reason</p>
                                        <p className="text-sm font-medium">{formData.emergencyReason}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-red-600 dark:text-red-300 uppercase">Immediate Risks</p>
                                        <p className="text-sm font-medium">{formData.immediateRisks}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground">Data Sharing Permissions</p>
                            <div className="flex gap-2 flex-wrap">
                                {formData.shareLabResults && <Badge variant="outline">Lab Results</Badge>}
                                {formData.shareImaging && <Badge variant="outline">Imaging</Badge>}
                                {formData.shareNotes && <Badge variant="outline">Clinical Notes</Badge>}
                            </div>
                        </div>

                        {formData.attachedDocumentIds.length > 0 && (
                            <div className="space-y-2 pt-4 border-t">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Paperclip className="h-4 w-4" />
                                    Attached Documents ({formData.attachedDocumentIds.length})
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {patientDocuments
                                        .filter(doc => formData.attachedDocumentIds.includes(doc.id))
                                        .map(doc => (
                                            <Badge key={doc.id} variant="secondary" className="gap-1">
                                                <File className="h-3 w-3" />
                                                {doc.title}
                                            </Badge>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 1 || isSubmitting}
                >
                    Back
                </Button>

                {step < 4 ? (
                    <Button onClick={handleNext}>
                        Next Step
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        Confirm & Send Referral
                    </Button>
                )}
            </div>
        </div>
    );
}
