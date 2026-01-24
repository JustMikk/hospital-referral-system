"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    FileText,
    Shield,
    Stethoscope,
    Paperclip,
    File,
    Building2,
    User,
    Send,
    Sparkles,
    Check,
    Clock,
    Zap,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { createReferral } from "@/app/actions/referrals";
import { getPatientDocuments } from "@/app/actions/documents";
import { toast } from "sonner";
import {
    StepIndicator,
    StepContent,
    StepNavigation,
    FormSection,
    ReviewItem,
    ReviewSection,
} from "@/components/ui/multi-step-form";

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

const steps = [
    { id: 1, title: "Basics", icon: FileText, description: "Patient & destination" },
    { id: 2, title: "Clinical Notes", icon: Stethoscope, description: "Medical context" },
    { id: 3, title: "Attachments", icon: Shield, description: "Documents & data" },
    { id: 4, title: "Review", icon: CheckCircle2, description: "Confirm & send" },
];

const priorityOptions = [
    { value: "NORMAL", label: "Routine", description: "Standard referral timeline", icon: Clock, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { value: "URGENT", label: "Urgent", description: "Within 24-48 hours", icon: Zap, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { value: "EMERGENCY", label: "Emergency", description: "Immediate attention", icon: AlertTriangle, color: "text-red-600 bg-red-50 border-red-200" },
];

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            if (step < steps.length) {
                setStep(step + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await createReferral(formData);
            toast.success("Referral sent successfully!", {
                description: "The receiving hospital has been notified.",
                icon: <Sparkles className="h-4 w-4" />,
            });
            router.push("/referrals");
        } catch (error) {
            console.error("Failed to create referral:", error);
            toast.error("Failed to create referral");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedPatient = patients.find(p => p.id === formData.patientId);
    const selectedHospital = hospitals.find(h => h.id === formData.toHospitalId);

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="shrink-0 hover:bg-muted/80 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Create New Referral</h1>
                    <p className="text-muted-foreground text-sm">Transfer a patient to another healthcare facility</p>
                </div>
            </div>

            {/* Progress Steps */}
            <StepIndicator steps={steps} currentStep={step} />

            {/* Form Card */}
            <Card className="border-border/40 shadow-xl overflow-hidden">
                {/* Decorative top gradient */}
                <div className={cn(
                    "h-1.5 transition-colors duration-300",
                    formData.priority === "EMERGENCY" 
                        ? "bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-pulse" 
                        : formData.priority === "URGENT"
                        ? "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500"
                        : "bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                )} />

                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center",
                            "bg-primary/10 text-primary"
                        )}>
                            {(() => {
                                const StepIcon = steps[step - 1].icon;
                                return <StepIcon className="h-5 w-5" />;
                            })()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{steps[step - 1].title}</h2>
                            <p className="text-sm text-muted-foreground">
                                {steps[step - 1].description}
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="min-h-[450px]">
                    {/* Step 1: Basics */}
                    <StepContent step={1} currentStep={step}>
                        <div className="space-y-6">
                            <FormSection title="Patient & Destination" description="Select the patient and receiving hospital">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                            Select Patient <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.patientId}
                                            onValueChange={(val) => setFormData({ ...formData, patientId: val })}
                                        >
                                            <SelectTrigger className={cn(
                                                "transition-all duration-200",
                                                errors.patientId ? "border-destructive ring-destructive/20 ring-2" : "focus:ring-2 focus:ring-primary/20"
                                            )}>
                                                <SelectValue placeholder="Select patient" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {patients.map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            {p.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.patientId && (
                                            <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.patientId}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                            Receiving Hospital <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.toHospitalId}
                                            onValueChange={(val) => setFormData({ ...formData, toHospitalId: val })}
                                        >
                                            <SelectTrigger className={cn(
                                                "transition-all duration-200",
                                                errors.toHospitalId ? "border-destructive ring-destructive/20 ring-2" : "focus:ring-2 focus:ring-primary/20"
                                            )}>
                                                <SelectValue placeholder="Select hospital" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hospitals.map((h) => (
                                                    <SelectItem key={h.id} value={h.id}>
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                                            {h.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.toHospitalId && (
                                            <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.toHospitalId}</p>
                                        )}
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection title="Priority Level" description="Set the urgency of this referral">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {priorityOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, priority: option.value, emergencyConfirmed: false })}
                                            className={cn(
                                                "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                                                "hover:scale-[1.02] active:scale-[0.98]",
                                                formData.priority === option.value
                                                    ? option.color + " ring-2 ring-offset-2 ring-offset-background"
                                                    : "border-border hover:border-muted-foreground/50 bg-background"
                                            )}
                                            style={{
                                                ringColor: option.value === "NORMAL" ? "rgb(37 99 235)" 
                                                    : option.value === "URGENT" ? "rgb(217 119 6)" 
                                                    : "rgb(220 38 38)"
                                            }}
                                        >
                                            {formData.priority === option.value && (
                                                <div className="absolute top-2 right-2">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                            <option.icon className={cn(
                                                "h-5 w-5 mb-2",
                                                formData.priority === option.value ? "" : "text-muted-foreground"
                                            )} />
                                            <div className="font-semibold">{option.label}</div>
                                            <div className={cn(
                                                "text-xs mt-1",
                                                formData.priority === option.value ? "opacity-80" : "text-muted-foreground"
                                            )}>
                                                {option.description}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </FormSection>

                            <FormSection title="Referral Reason" description="Explain why this referral is needed">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        Reason <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        placeholder="e.g. Specialized cardiac consultation required"
                                        className={cn(
                                            "transition-all duration-200",
                                            errors.reason ? "border-destructive ring-destructive/20 ring-2" : "focus:ring-2 focus:ring-primary/20"
                                        )}
                                    />
                                    {errors.reason && (
                                        <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.reason}</p>
                                    )}
                                </div>
                            </FormSection>

                            {/* Emergency Specific Fields */}
                            {formData.priority === "EMERGENCY" && (
                                <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800 animate-in fade-in-0 zoom-in-95 duration-300">
                                    <Alert variant="destructive" className="bg-white/80 dark:bg-red-950/50">
                                        <AlertTriangle className="h-5 w-5" />
                                        <AlertTitle>Emergency Referral Protocol</AlertTitle>
                                        <AlertDescription>
                                            This will trigger immediate alerts at the receiving hospital. Ensure patient is stable for transfer.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="flex items-start space-x-3 p-4 rounded-lg bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                                        <Checkbox
                                            id="emergency-confirm"
                                            checked={formData.emergencyConfirmed}
                                            onCheckedChange={(c) => setFormData({ ...formData, emergencyConfirmed: !!c })}
                                            className="mt-0.5 border-red-400"
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="emergency-confirm"
                                                className="text-sm font-semibold text-red-800 dark:text-red-300 cursor-pointer"
                                            >
                                                I confirm this referral requires immediate attention
                                            </label>
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                By checking this, you acknowledge that this case meets emergency criteria.
                                            </p>
                                        </div>
                                    </div>
                                    {errors.emergencyConfirmed && <p className="text-xs text-destructive">{errors.emergencyConfirmed}</p>}

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-red-700 dark:text-red-300">Emergency Reason *</Label>
                                            <Input
                                                value={formData.emergencyReason}
                                                onChange={(e) => setFormData({ ...formData, emergencyReason: e.target.value })}
                                                placeholder="e.g. Unstable Angina"
                                                className={cn(
                                                    "bg-white dark:bg-red-950/30",
                                                    errors.emergencyReason ? "border-destructive" : "border-red-300 dark:border-red-700"
                                                )}
                                            />
                                            {errors.emergencyReason && <p className="text-xs text-destructive">{errors.emergencyReason}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-red-700 dark:text-red-300">Immediate Risks *</Label>
                                            <Input
                                                value={formData.immediateRisks}
                                                onChange={(e) => setFormData({ ...formData, immediateRisks: e.target.value })}
                                                placeholder="Describe immediate risks"
                                                className={cn(
                                                    "bg-white dark:bg-red-950/30",
                                                    errors.immediateRisks ? "border-destructive" : "border-red-300 dark:border-red-700"
                                                )}
                                            />
                                            {errors.immediateRisks && <p className="text-xs text-destructive">{errors.immediateRisks}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </StepContent>

                    {/* Step 2: Clinical Notes */}
                    <StepContent step={2} currentStep={step}>
                        <div className="space-y-6">
                            <FormSection
                                title="Clinical Notes"
                                description="Provide detailed clinical background for the receiving doctor"
                            >
                                <div className="space-y-2">
                                    <Label>Detailed Notes</Label>
                                    <Textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Include relevant clinical observations, patient history, current medications, specific questions for the specialist, and any other pertinent information..."
                                        rows={12}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {formData.notes.length} characters • Be as detailed as possible to ensure continuity of care
                                    </p>
                                </div>
                            </FormSection>

                            {formData.notes.length > 0 && (
                                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 animate-in fade-in-0 duration-200">
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        Preview
                                    </h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                                        {formData.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </StepContent>

                    {/* Step 3: Attachments */}
                    <StepContent step={3} currentStep={step}>
                        <div className="space-y-6">
                            <FormSection
                                title="Attach Patient Documents"
                                description="Select documents to include with this referral"
                            >
                                {loadingDocuments ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-3" />
                                        <p>Loading patient documents...</p>
                                    </div>
                                ) : patientDocuments.length > 0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {patientDocuments.map((doc, index) => (
                                            <div
                                                key={doc.id}
                                                onClick={() => toggleDocument(doc.id)}
                                                className={cn(
                                                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                                    "hover:scale-[1.01] active:scale-[0.99]",
                                                    "animate-in fade-in-0 slide-in-from-bottom-2",
                                                    formData.attachedDocumentIds.includes(doc.id)
                                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                                                )}
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <div className={cn(
                                                    "shrink-0 h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                                                    formData.attachedDocumentIds.includes(doc.id)
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                )}>
                                                    {formData.attachedDocumentIds.includes(doc.id) ? (
                                                        <Check className="h-5 w-5" />
                                                    ) : (
                                                        <File className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-medium text-sm block truncate">{doc.title}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {doc.type}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(doc.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                                        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                                        <p className="font-medium text-muted-foreground">No documents available</p>
                                        <p className="text-sm text-muted-foreground/80 mt-1">
                                            Upload documents from the patient profile to attach them here
                                        </p>
                                    </div>
                                )}

                                {formData.attachedDocumentIds.length > 0 && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 animate-in fade-in-0 duration-200">
                                        <Paperclip className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium text-primary">
                                            {formData.attachedDocumentIds.length} document{formData.attachedDocumentIds.length > 1 ? 's' : ''} selected
                                        </span>
                                    </div>
                                )}
                            </FormSection>

                            <FormSection
                                title="Additional Data Sharing"
                                description="Select what categories of data to include"
                            >
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {[
                                        { key: "shareLabResults", label: "Lab Results", description: "Recent laboratory tests" },
                                        { key: "shareImaging", label: "Imaging Reports", description: "X-rays, MRI, CT scans" },
                                        { key: "shareNotes", label: "Clinical Notes", description: "Doctor's notes & observations" },
                                    ].map((item) => (
                                        <div
                                            key={item.key}
                                            onClick={() => setFormData({ ...formData, [item.key]: !formData[item.key as keyof typeof formData] })}
                                            className={cn(
                                                "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                                "hover:scale-[1.01] active:scale-[0.99]",
                                                formData[item.key as keyof typeof formData]
                                                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                                    : "border-border hover:border-muted-foreground/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={cn(
                                                    "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors",
                                                    formData[item.key as keyof typeof formData]
                                                        ? "bg-emerald-500 border-emerald-500"
                                                        : "border-muted-foreground/30"
                                                )}>
                                                    {formData[item.key as keyof typeof formData] && (
                                                        <Check className="h-3 w-3 text-white" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-sm">{item.label}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground ml-7">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </FormSection>
                        </div>
                    </StepContent>

                    {/* Step 4: Review */}
                    <StepContent step={4} currentStep={step}>
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">
                                            Ready to Send
                                        </h4>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                                            Please verify all details before submitting this referral.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <ReviewSection title="Patient & Destination" icon={<User className="h-4 w-4" />}>
                                <ReviewItem label="Patient" value={selectedPatient?.name} icon={<User className="h-4 w-4" />} />
                                <ReviewItem label="Receiving Hospital" value={selectedHospital?.name} icon={<Building2 className="h-4 w-4" />} />
                                <ReviewItem
                                    label="Priority"
                                    value={
                                        <Badge variant={formData.priority === "EMERGENCY" ? "destructive" : formData.priority === "URGENT" ? "default" : "secondary"}>
                                            {formData.priority}
                                        </Badge>
                                    }
                                />
                                <ReviewItem label="Reason" value={formData.reason} />
                            </ReviewSection>

                            {formData.priority === "EMERGENCY" && (
                                <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800">
                                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold mb-3">
                                        <AlertTriangle className="h-4 w-4" />
                                        Emergency Protocol Active
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <ReviewItem label="Emergency Reason" value={formData.emergencyReason} />
                                        <ReviewItem label="Immediate Risks" value={formData.immediateRisks} />
                                    </div>
                                </div>
                            )}

                            {formData.notes && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <Stethoscope className="h-4 w-4" />
                                        Clinical Notes
                                    </h4>
                                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                                            {formData.notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Data Sharing Permissions
                                </h4>
                                <div className="flex gap-2 flex-wrap">
                                    {formData.shareLabResults && <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20">✓ Lab Results</Badge>}
                                    {formData.shareImaging && <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20">✓ Imaging</Badge>}
                                    {formData.shareNotes && <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20">✓ Clinical Notes</Badge>}
                                </div>
                            </div>

                            {formData.attachedDocumentIds.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <Paperclip className="h-4 w-4" />
                                        Attached Documents ({formData.attachedDocumentIds.length})
                                    </h4>
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
                        </div>
                    </StepContent>
                </CardContent>

                <CardFooter className="bg-muted/30">
                    <StepNavigation
                        currentStep={step}
                        totalSteps={steps.length}
                        onBack={handleBack}
                        onNext={handleNext}
                        isSubmitting={isSubmitting}
                        nextLabel="Continue"
                        submitLabel="Send Referral"
                        submitIcon={<Send className="h-4 w-4" />}
                    />
                </CardFooter>
            </Card>
        </div>
    );
}
