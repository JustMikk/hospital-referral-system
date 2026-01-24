"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Building2,
    MapPin,
    Stethoscope,
    Share2,
    UserCog,
    CheckCircle2,
    Loader2,
    Copy,
    Check,
    Plus,
    X,
    Mail,
    Phone,
    Shield,
    Sparkles,
    Globe,
    FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createHospitalWithAdmin } from "@/app/actions/admin";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    StepIndicator,
    StepContent,
    StepNavigation,
    FormSection,
    ReviewItem,
    ReviewSection,
} from "@/components/ui/multi-step-form";

const steps = [
    { id: 1, title: "Identity", icon: Building2, description: "Basic information" },
    { id: 2, title: "Contact", icon: MapPin, description: "Location & phone" },
    { id: 3, title: "Departments", icon: Stethoscope, description: "Medical units" },
    { id: 4, title: "Data Sharing", icon: Share2, description: "Permissions" },
    { id: 5, title: "Admin", icon: UserCog, description: "Account setup" },
    { id: 6, title: "Review", icon: CheckCircle2, description: "Confirm details" },
];

const hospitalTypes = [
    { value: "public", label: "Public Hospital", description: "Government-funded facility", icon: Building2 },
    { value: "private", label: "Private Clinic", description: "Privately owned facility", icon: Building2 },
    { value: "specialty", label: "Specialty Center", description: "Specialized care facility", icon: Stethoscope },
];

export default function CreateHospitalPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdPassword, setCreatedPassword] = useState("");
    const [copied, setCopied] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        licenseId: "",
        region: "",
        type: "",
        address: "",
        phone: "",
        email: "",
        departments: ["Emergency", "Cardiology", "Pediatrics"],
        newDepartment: "",
        canSendReferrals: true,
        canReceiveReferrals: true,
        emergencyAccessAllowed: false,
        adminName: "",
        adminEmail: "",
    });

    const copyPassword = () => {
        navigator.clipboard.writeText(createdPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNext = async () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsSubmitting(true);
            try {
                const typeMap: Record<string, "GENERAL" | "SPECIALTY" | "CLINIC" | "REHABILITATION"> = {
                    public: "GENERAL",
                    private: "CLINIC",
                    specialty: "SPECIALTY",
                };

                const result = await createHospitalWithAdmin({
                    hospital: {
                        name: formData.name,
                        type: typeMap[formData.type] || "GENERAL",
                        location: formData.address,
                        departments: formData.departments,
                        contactEmail: formData.email,
                        contactPhone: formData.phone,
                    },
                    admin: {
                        name: formData.adminName,
                        email: formData.adminEmail,
                    },
                });

                setCreatedPassword(result.defaultPassword);
                setShowSuccess(true);
            } catch (error: any) {
                toast.error(error.message || "Failed to create hospital");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const addDepartment = () => {
        if (formData.newDepartment.trim() && !formData.departments.includes(formData.newDepartment.trim())) {
            setFormData({
                ...formData,
                departments: [...formData.departments, formData.newDepartment.trim()],
                newDepartment: "",
            });
        }
    };

    const removeDepartment = (dept: string) => {
        setFormData({
            ...formData,
            departments: formData.departments.filter((d) => d !== dept),
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <PageHeader
                title="Register New Hospital"
                description="Onboard a new healthcare facility to the network"
            />

            {/* Progress Steps */}
            <StepIndicator steps={steps} currentStep={currentStep} />

            {/* Form Card */}
            <Card className="border-border/40 shadow-xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />

                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center",
                            "bg-primary/10 text-primary"
                        )}>
                            {(() => {
                                const StepIcon = steps[currentStep - 1].icon;
                                return <StepIcon className="h-5 w-5" />;
                            })()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{steps[currentStep - 1].title}</h2>
                            <p className="text-sm text-muted-foreground">
                                {steps[currentStep - 1].description}
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="min-h-[400px]">
                    {/* Step 1: Identity */}
                    <StepContent step={1} currentStep={currentStep}>
                        <div className="space-y-6">
                            <FormSection title="Hospital Information" description="Enter the facility's official details">
                                <div className="space-y-2">
                                    <Label>Hospital Name</Label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            placeholder="e.g. Central Medical Center"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Registration / License ID</Label>
                                    <div className="relative group">
                                        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            placeholder="e.g. LIC-2026-001"
                                            value={formData.licenseId}
                                            onChange={(e) => setFormData({ ...formData, licenseId: e.target.value })}
                                            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection title="Classification" description="Select region and facility type">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Region / Country</Label>
                                        <Select
                                            value={formData.region}
                                            onValueChange={(val) => setFormData({ ...formData, region: val })}
                                        >
                                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                                <SelectValue placeholder="Select region" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="us-east">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" /> US East
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="us-west">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" /> US West
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="eu-central">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" /> EU Central
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Facility Type</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(val) => setFormData({ ...formData, type: val })}
                                        >
                                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hospitalTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        <div className="flex items-center gap-2">
                                                            <type.icon className="h-4 w-4" />
                                                            {type.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </FormSection>
                        </div>
                    </StepContent>

                    {/* Step 2: Contact */}
                    <StepContent step={2} currentStep={currentStep}>
                        <div className="space-y-6">
                            <FormSection title="Location" description="Full address of the facility">
                                <div className="space-y-2">
                                    <Label>Full Address</Label>
                                    <Textarea
                                        placeholder="Street address, city, state, zip code"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                                    />
                                </div>
                            </FormSection>

                            <FormSection title="Contact Information" description="How to reach the facility">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Primary Phone</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                            <Input
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Admin Contact Email</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                            <Input
                                                type="email"
                                                placeholder="admin@hospital.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </FormSection>
                        </div>
                    </StepContent>

                    {/* Step 3: Departments */}
                    <StepContent step={3} currentStep={currentStep}>
                        <div className="space-y-6">
                            <FormSection title="Medical Departments" description="Add departments available at this facility">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add new department..."
                                        value={formData.newDepartment}
                                        onChange={(e) => setFormData({ ...formData, newDepartment: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDepartment())}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                    <Button
                                        onClick={addDepartment}
                                        variant="secondary"
                                        className="shrink-0 hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {formData.departments.map((dept, index) => (
                                        <div
                                            key={dept}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-xl border-2 bg-muted/30 group",
                                                "animate-in fade-in-0 zoom-in-95 duration-200",
                                                "hover:border-primary/50 hover:bg-muted/50 transition-all"
                                            )}
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{dept}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                                                onClick={() => removeDepartment(dept)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {formData.departments.length > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        {formData.departments.length} department{formData.departments.length > 1 ? 's' : ''} configured
                                    </p>
                                )}
                            </FormSection>
                        </div>
                    </StepContent>

                    {/* Step 4: Data Sharing */}
                    <StepContent step={4} currentStep={currentStep}>
                        <div className="space-y-6">
                            <FormSection title="Referral Permissions" description="Configure data sharing capabilities">
                                <div className="space-y-4">
                                    <div
                                        onClick={() => setFormData({ ...formData, canSendReferrals: !formData.canSendReferrals })}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                            "hover:scale-[1.01] active:scale-[0.99]",
                                            formData.canSendReferrals
                                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                                : "border-border hover:border-muted-foreground/50"
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium flex items-center gap-2">
                                                {formData.canSendReferrals && <Check className="h-4 w-4 text-emerald-500" />}
                                                Can Send Referrals
                                            </p>
                                            <p className="text-sm text-muted-foreground">Allow staff to refer patients to other hospitals</p>
                                        </div>
                                        <Switch
                                            checked={formData.canSendReferrals}
                                            onCheckedChange={(c) => setFormData({ ...formData, canSendReferrals: c })}
                                        />
                                    </div>

                                    <div
                                        onClick={() => setFormData({ ...formData, canReceiveReferrals: !formData.canReceiveReferrals })}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                            "hover:scale-[1.01] active:scale-[0.99]",
                                            formData.canReceiveReferrals
                                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                                : "border-border hover:border-muted-foreground/50"
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium flex items-center gap-2">
                                                {formData.canReceiveReferrals && <Check className="h-4 w-4 text-emerald-500" />}
                                                Can Receive Referrals
                                            </p>
                                            <p className="text-sm text-muted-foreground">Allow this hospital to accept incoming patients</p>
                                        </div>
                                        <Switch
                                            checked={formData.canReceiveReferrals}
                                            onCheckedChange={(c) => setFormData({ ...formData, canReceiveReferrals: c })}
                                        />
                                    </div>

                                    <div
                                        onClick={() => setFormData({ ...formData, emergencyAccessAllowed: !formData.emergencyAccessAllowed })}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                            "hover:scale-[1.01] active:scale-[0.99]",
                                            formData.emergencyAccessAllowed
                                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                                : "border-border hover:border-muted-foreground/50"
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium flex items-center gap-2 text-red-700 dark:text-red-400">
                                                <Shield className="h-4 w-4" />
                                                Emergency Access Allowed
                                            </p>
                                            <p className="text-sm text-red-600/80 dark:text-red-400/80">Allow break-glass access to patient records</p>
                                        </div>
                                        <Switch
                                            checked={formData.emergencyAccessAllowed}
                                            onCheckedChange={(c) => setFormData({ ...formData, emergencyAccessAllowed: c })}
                                        />
                                    </div>
                                </div>
                            </FormSection>
                        </div>
                    </StepContent>

                    {/* Step 5: Admin */}
                    <StepContent step={5} currentStep={currentStep}>
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <UserCog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                                            Hospital Administrator
                                        </h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                            This user will be the primary super-admin for the hospital with full access to manage staff, settings, and operations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <FormSection title="Admin Account Details">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Admin Full Name</Label>
                                        <Input
                                            placeholder="e.g. Dr. John Doe"
                                            value={formData.adminName}
                                            onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Admin Email</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                            <Input
                                                type="email"
                                                placeholder="john.doe@hospital.com"
                                                value={formData.adminEmail}
                                                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </FormSection>

                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Note:</strong> A temporary password will be generated and displayed after creation. The admin should change it after their first login.
                                </p>
                            </div>
                        </div>
                    </StepContent>

                    {/* Step 6: Review */}
                    <StepContent step={6} currentStep={currentStep}>
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">
                                            Ready to Create
                                        </h4>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                                            Review all information before creating the hospital.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <ReviewSection title="Hospital Identity" icon={<Building2 className="h-4 w-4" />}>
                                <ReviewItem label="Name" value={formData.name} icon={<Building2 className="h-4 w-4" />} />
                                <ReviewItem label="License ID" value={formData.licenseId} icon={<FileText className="h-4 w-4" />} />
                                <ReviewItem label="Type" value={formData.type ? hospitalTypes.find(t => t.value === formData.type)?.label : null} />
                                <ReviewItem label="Region" value={formData.region?.replace('-', ' ').toUpperCase()} icon={<Globe className="h-4 w-4" />} />
                            </ReviewSection>

                            <ReviewSection title="Contact Information" icon={<MapPin className="h-4 w-4" />}>
                                <ReviewItem label="Address" value={formData.address} className="sm:col-span-2" />
                                <ReviewItem label="Phone" value={formData.phone} icon={<Phone className="h-4 w-4" />} />
                                <ReviewItem label="Email" value={formData.email} icon={<Mail className="h-4 w-4" />} />
                            </ReviewSection>

                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Stethoscope className="h-4 w-4" />
                                    Departments ({formData.departments.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {formData.departments.map((dept) => (
                                        <Badge key={dept} variant="secondary">{dept}</Badge>
                                    ))}
                                </div>
                            </div>

                            <ReviewSection title="Administrator" icon={<UserCog className="h-4 w-4" />}>
                                <ReviewItem label="Name" value={formData.adminName} />
                                <ReviewItem label="Email" value={formData.adminEmail} icon={<Mail className="h-4 w-4" />} />
                            </ReviewSection>

                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Share2 className="h-4 w-4" />
                                    Permissions
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {formData.canSendReferrals && <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20">✓ Can Send Referrals</Badge>}
                                    {formData.canReceiveReferrals && <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20">✓ Can Receive Referrals</Badge>}
                                    {formData.emergencyAccessAllowed && <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700">⚠ Emergency Access</Badge>}
                                </div>
                            </div>

                            <div
                                onClick={() => setConfirmed(!confirmed)}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                    "hover:scale-[1.01]",
                                    confirmed
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <div className={cn(
                                    "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0",
                                    confirmed
                                        ? "bg-primary border-primary"
                                        : "border-muted-foreground/30"
                                )}>
                                    {confirmed && <Check className="h-3 w-3 text-white" />}
                                </div>
                                <span className="text-sm font-medium">
                                    I confirm that all provided information is accurate and verified.
                                </span>
                            </div>
                        </div>
                    </StepContent>
                </CardContent>

                <CardFooter className="bg-muted/30">
                    <StepNavigation
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        onBack={handleBack}
                        onNext={handleNext}
                        isSubmitting={isSubmitting}
                        nextLabel="Continue"
                        submitLabel="Create Hospital"
                        submitIcon={<Building2 className="h-4 w-4" />}
                        canProceed={currentStep !== steps.length || confirmed}
                    />
                </CardFooter>
            </Card>

            {/* Success Dialog */}
            <Dialog open={showSuccess} onOpenChange={() => {}}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-emerald-600">
                            <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            Hospital Created Successfully!
                        </DialogTitle>
                        <DialogDescription>
                            The hospital and admin account have been created.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">
                                Admin Account Credentials
                            </p>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-white/60 dark:bg-white/5">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="font-medium">{formData.adminEmail}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-white/60 dark:bg-white/5">
                                    <span className="text-muted-foreground">Password:</span>
                                    <div className="flex items-center gap-2">
                                        <code className="px-2 py-0.5 bg-background rounded font-mono text-sm border">
                                            {createdPassword}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={copyPassword}
                                        >
                                            {copied ? (
                                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            ⚠️ Please save these credentials and share them securely with the hospital administrator.
                            They should change the password after their first login.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => router.push("/admin/hospitals")} className="gap-2">
                            <Building2 className="h-4 w-4" />
                            Go to Hospitals
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
