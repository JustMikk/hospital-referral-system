"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    Heart,
    AlertTriangle,
    UserPlus,
    Loader2,
    X,
    Plus,
    CheckCircle2,
} from "lucide-react";
import { createPatient } from "@/app/actions/patients";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreatePatientPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        // Basic Info
        name: "",
        age: "",
        gender: "",
        // Contact
        email: "",
        phone: "",
        // Medical
        bloodType: "",
        allergies: [] as string[],
        chronicConditions: [] as string[],
        // Emergency Contact
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
    });

    const [newAllergy, setNewAllergy] = useState("");
    const [newCondition, setNewCondition] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const addAllergy = () => {
        if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
            setFormData({
                ...formData,
                allergies: [...formData.allergies, newAllergy.trim()],
            });
            setNewAllergy("");
        }
    };

    const removeAllergy = (allergy: string) => {
        setFormData({
            ...formData,
            allergies: formData.allergies.filter((a) => a !== allergy),
        });
    };

    const addCondition = () => {
        if (newCondition.trim() && !formData.chronicConditions.includes(newCondition.trim())) {
            setFormData({
                ...formData,
                chronicConditions: [...formData.chronicConditions, newCondition.trim()],
            });
            setNewCondition("");
        }
    };

    const removeCondition = (condition: string) => {
        setFormData({
            ...formData,
            chronicConditions: formData.chronicConditions.filter((c) => c !== condition),
        });
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = "Patient name is required";
            if (!formData.age || parseInt(formData.age) <= 0) newErrors.age = "Valid age is required";
            if (!formData.gender) newErrors.gender = "Gender is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        try {
            await createPatient({
                name: formData.name,
                age: parseInt(formData.age),
                gender: formData.gender as "MALE" | "FEMALE" | "OTHER",
                email: formData.email || undefined,
                phone: formData.phone || undefined,
                bloodType: formData.bloodType || undefined,
                allergies: formData.allergies,
                chronicConditions: formData.chronicConditions,
                emergencyContactName: formData.emergencyContactName || undefined,
                emergencyContactPhone: formData.emergencyContactPhone || undefined,
                emergencyContactRelationship: formData.emergencyContactRelationship || undefined,
            });
            toast.success("Patient created successfully");
            router.push("/patients");
        } catch (error: any) {
            toast.error(error.message || "Failed to create patient");
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 1, title: "Basic Info", icon: User },
        { id: 2, title: "Medical", icon: Heart },
        { id: 3, title: "Emergency", icon: AlertTriangle },
        { id: 4, title: "Review", icon: CheckCircle2 },
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="shrink-0"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <PageHeader
                    title="Register New Patient"
                    description="Add a new patient to your hospital records"
                />
            </div>

            {/* Progress Steps */}
            <div className="relative flex justify-between mb-8 px-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                        <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors",
                            currentStep >= step.id
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30 text-muted-foreground"
                        )}>
                            <step.icon className="h-5 w-5" />
                        </div>
                        <span className={cn(
                            "text-xs font-medium hidden sm:block",
                            currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                        )}>{step.title}</span>
                    </div>
                ))}
            </div>

            <Card className="border-border/40 shadow-lg">
                <CardHeader>
                    <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                    <CardDescription>
                        Step {currentStep} of {steps.length}
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[350px]">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={errors.name ? "border-destructive" : ""}
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age *</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="e.g. 35"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className={errors.age ? "border-destructive" : ""}
                                    />
                                    {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Gender *</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(val) => setFormData({ ...formData, gender: val })}
                                    >
                                        <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">Male</SelectItem>
                                            <SelectItem value="FEMALE">Female</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="patient@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Medical Info */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Blood Type</Label>
                                <Select
                                    value={formData.bloodType}
                                    onValueChange={(val) => setFormData({ ...formData, bloodType: val })}
                                >
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Select blood type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bloodTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Known Allergies</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add allergy (e.g. Penicillin)"
                                        value={newAllergy}
                                        onChange={(e) => setNewAllergy(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
                                    />
                                    <Button type="button" variant="secondary" onClick={addAllergy}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {formData.allergies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.allergies.map((allergy) => (
                                            <Badge key={allergy} variant="destructive" className="gap-1 pr-1">
                                                {allergy}
                                                <button
                                                    onClick={() => removeAllergy(allergy)}
                                                    className="ml-1 rounded-full hover:bg-destructive-foreground/20 p-0.5"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label>Chronic Conditions</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add condition (e.g. Diabetes)"
                                        value={newCondition}
                                        onChange={(e) => setNewCondition(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
                                    />
                                    <Button type="button" variant="secondary" onClick={addCondition}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {formData.chronicConditions.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.chronicConditions.map((condition) => (
                                            <Badge key={condition} variant="secondary" className="gap-1 pr-1">
                                                {condition}
                                                <button
                                                    onClick={() => removeCondition(condition)}
                                                    className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Emergency Contact */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm">
                                <AlertTriangle className="h-4 w-4 inline mr-2" />
                                Emergency contact information is crucial for patient safety
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="emergencyName">Contact Name</Label>
                                <Input
                                    id="emergencyName"
                                    placeholder="e.g. Jane Doe"
                                    value={formData.emergencyContactName}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="emergencyPhone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.emergencyContactPhone}
                                            onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Relationship</Label>
                                    <Select
                                        value={formData.emergencyContactRelationship}
                                        onValueChange={(val) => setFormData({ ...formData, emergencyContactRelationship: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select relationship" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Spouse">Spouse</SelectItem>
                                            <SelectItem value="Parent">Parent</SelectItem>
                                            <SelectItem value="Child">Child</SelectItem>
                                            <SelectItem value="Sibling">Sibling</SelectItem>
                                            <SelectItem value="Friend">Friend</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Full Name</p>
                                    <p className="font-medium">{formData.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Age</p>
                                    <p className="font-medium">{formData.age} years old</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Gender</p>
                                    <p className="font-medium capitalize">{formData.gender.toLowerCase()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Blood Type</p>
                                    <p className="font-medium">{formData.bloodType || "Not specified"}</p>
                                </div>
                                {formData.email && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{formData.email}</p>
                                    </div>
                                )}
                                {formData.phone && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium">{formData.phone}</p>
                                    </div>
                                )}
                            </div>

                            {formData.allergies.length > 0 && (
                                <div className="space-y-2 pt-4 border-t">
                                    <p className="text-sm text-muted-foreground">Allergies</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.allergies.map((a) => (
                                            <Badge key={a} variant="destructive">{a}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.chronicConditions.length > 0 && (
                                <div className="space-y-2 pt-4 border-t">
                                    <p className="text-sm text-muted-foreground">Chronic Conditions</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.chronicConditions.map((c) => (
                                            <Badge key={c} variant="secondary">{c}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.emergencyContactName && (
                                <div className="space-y-2 pt-4 border-t">
                                    <p className="text-sm text-muted-foreground">Emergency Contact</p>
                                    <p className="font-medium">
                                        {formData.emergencyContactName}
                                        {formData.emergencyContactRelationship && ` (${formData.emergencyContactRelationship})`}
                                    </p>
                                    {formData.emergencyContactPhone && (
                                        <p className="text-sm text-muted-foreground">{formData.emergencyContactPhone}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1 || isSubmitting}
                    >
                        Back
                    </Button>

                    {currentStep < 4 ? (
                        <Button onClick={handleNext}>
                            Next Step
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4" />
                                    Create Patient
                                </>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

