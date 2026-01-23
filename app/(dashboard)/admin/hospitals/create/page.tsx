"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building2, MapPin, Stethoscope, Share2, UserCog, CheckCircle2, ChevronRight, ChevronLeft, Loader2, Copy, Check } from "lucide-react";
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

const steps = [
    { id: 1, title: "Identity", icon: Building2 },
    { id: 2, title: "Contact", icon: MapPin },
    { id: 3, title: "Departments", icon: Stethoscope },
    { id: 4, title: "Data Sharing", icon: Share2 },
    { id: 5, title: "Admin", icon: UserCog },
    { id: 6, title: "Review", icon: CheckCircle2 },
];

export default function CreateHospitalPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdPassword, setCreatedPassword] = useState("");
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1
        name: "",
        licenseId: "",
        region: "",
        type: "",
        // Step 2
        address: "",
        phone: "",
        email: "",
        // Step 3
        departments: ["Emergency", "Cardiology", "Pediatrics"],
        newDepartment: "",
        // Step 4
        canSendReferrals: true,
        canReceiveReferrals: true,
        emergencyAccessAllowed: false,
        // Step 5
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
            // Submit
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
        if (formData.newDepartment.trim()) {
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
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <PageHeader
                title="Register New Hospital"
                description="Onboard a new healthcare facility to the network"
            />

            {/* Progress Steps */}
            <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
                <div className="flex justify-between">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={cn(
                                "flex flex-col items-center gap-2 bg-background px-2",
                                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <div
                                className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all",
                                    currentStep >= step.id
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-muted-foreground/30 bg-background"
                                )}
                            >
                                <step.icon className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Card className="border-border/40 shadow-lg">
                <CardHeader>
                    <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                    <CardDescription>
                        Step {currentStep} of {steps.length}
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px]">
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Hospital Name</Label>
                                <Input
                                    placeholder="e.g. Central Medical Center"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Registration / License ID</Label>
                                <Input
                                    placeholder="e.g. LIC-2026-001"
                                    value={formData.licenseId}
                                    onChange={(e) => setFormData({ ...formData, licenseId: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Region / Country</Label>
                                    <Select
                                        value={formData.region}
                                        onValueChange={(val) => setFormData({ ...formData, region: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="us-east">US East</SelectItem>
                                            <SelectItem value="us-west">US West</SelectItem>
                                            <SelectItem value="eu-central">EU Central</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(val) => setFormData({ ...formData, type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public Hospital</SelectItem>
                                            <SelectItem value="private">Private Clinic</SelectItem>
                                            <SelectItem value="specialty">Specialty Center</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Full Address</Label>
                                <Textarea
                                    placeholder="Street address, city, state, zip"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Primary Phone</Label>
                                <Input
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Admin Contact Email</Label>
                                <Input
                                    type="email"
                                    placeholder="admin@hospital.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add new department..."
                                    value={formData.newDepartment}
                                    onChange={(e) => setFormData({ ...formData, newDepartment: e.target.value })}
                                    onKeyDown={(e) => e.key === "Enter" && addDepartment()}
                                />
                                <Button onClick={addDepartment} variant="secondary">Add</Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {formData.departments.map((dept) => (
                                    <div
                                        key={dept}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30"
                                    >
                                        <span className="text-sm font-medium">{dept}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeDepartment(dept)}
                                        >
                                            &times;
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-border/50">
                                <div className="space-y-1">
                                    <p className="font-medium">Can Send Referrals</p>
                                    <p className="text-sm text-muted-foreground">Allow staff to refer patients to other hospitals</p>
                                </div>
                                <Switch
                                    checked={formData.canSendReferrals}
                                    onCheckedChange={(c) => setFormData({ ...formData, canSendReferrals: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-border/50">
                                <div className="space-y-1">
                                    <p className="font-medium">Can Receive Referrals</p>
                                    <p className="text-sm text-muted-foreground">Allow this hospital to accept incoming patients</p>
                                </div>
                                <Switch
                                    checked={formData.canReceiveReferrals}
                                    onCheckedChange={(c) => setFormData({ ...formData, canReceiveReferrals: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10">
                                <div className="space-y-1">
                                    <p className="font-medium text-red-700 dark:text-red-400">Emergency Access Allowed</p>
                                    <p className="text-sm text-red-600/80 dark:text-red-400/80">Allow break-glass access to patient records</p>
                                </div>
                                <Switch
                                    checked={formData.emergencyAccessAllowed}
                                    onCheckedChange={(c) => setFormData({ ...formData, emergencyAccessAllowed: c })}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm mb-4">
                                This user will be the primary super-admin for the hospital.
                            </div>
                            <div className="space-y-2">
                                <Label>Admin Full Name</Label>
                                <Input
                                    placeholder="e.g. Dr. John Doe"
                                    value={formData.adminName}
                                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Admin Email</Label>
                                <Input
                                    type="email"
                                    placeholder="john.doe@hospital.com"
                                    value={formData.adminEmail}
                                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 6 && (
                        <div className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Hospital Name</p>
                                    <p className="font-medium">{formData.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">License ID</p>
                                    <p className="font-medium">{formData.licenseId}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <p className="font-medium capitalize">{formData.type}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Region</p>
                                    <p className="font-medium capitalize">{formData.region}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Admin</p>
                                    <p className="font-medium">{formData.adminName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Departments</p>
                                    <p className="font-medium">{formData.departments.length} configured</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-2">
                                <Checkbox id="confirm" />
                                <label htmlFor="confirm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I confirm that all provided information is accurate and verified.
                                </label>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1 || isSubmitting}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button onClick={handleNext} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : currentStep === steps.length ? (
                            "Create Hospital"
                        ) : (
                            <>
                                Next Step
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Success Dialog */}
            <Dialog open={showSuccess} onOpenChange={() => {}}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-5 w-5" />
                            Hospital Created Successfully!
                        </DialogTitle>
                        <DialogDescription>
                            The hospital and admin account have been created.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30">
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                                Admin Account Details
                            </p>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-muted-foreground">Email:</span> {formData.adminEmail}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Password:</span>
                                    <code className="px-2 py-0.5 bg-background rounded font-mono text-sm">
                                        {createdPassword}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={copyPassword}
                                    >
                                        {copied ? (
                                            <Check className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Please save these credentials and share them securely with the hospital administrator.
                            They should change the password after their first login.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => router.push("/admin/hospitals")}>
                            Go to Hospitals
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
