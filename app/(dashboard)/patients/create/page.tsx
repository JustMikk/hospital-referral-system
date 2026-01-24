"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    Droplet,
    Users,
    Sparkles,
} from "lucide-react";
import { createPatient } from "@/app/actions/patients";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    StepIndicator,
    StepContent,
    StepNavigation,
    FormSection,
    ReviewItem,
    ReviewSection,
} from "@/components/ui/multi-step-form";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const steps = [
    { id: 1, title: "Basic Info", icon: User, description: "Personal details" },
    { id: 2, title: "Medical", icon: Heart, description: "Health information" },
    { id: 3, title: "Emergency", icon: AlertTriangle, description: "Contact info" },
    { id: 4, title: "Review", icon: CheckCircle2, description: "Confirm details" },
];

export default function CreatePatientPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        bloodType: "",
        allergies: [] as string[],
        chronicConditions: [] as string[],
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
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
            }
            if (currentStep < steps.length) {
                setCurrentStep(currentStep + 1);
            } else {
                handleSubmit();
            }
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
            toast.success("Patient created successfully!", {
                description: `${formData.name} has been added to your records.`,
                icon: <Sparkles className="h-4 w-4" />,
            });
            router.push("/patients");
        } catch (error: any) {
            toast.error(error.message || "Failed to create patient");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="shrink-0 hover:bg-muted/80 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <PageHeader
                    title="Register New Patient"
                    description="Add a new patient to your hospital records"
                />
            </div>

            {/* Progress Steps */}
            <StepIndicator
                steps={steps}
                currentStep={currentStep}
                allowClickNavigation={false}
            />

            {/* Form Card */}
            <Card className="border-border/40 shadow-xl overflow-hidden">
                {/* Decorative top gradient */}
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
                    {/* Step 1: Basic Info */}
                    <StepContent step={1} currentStep={currentStep}>
                        <div className="space-y-6">
                            <FormSection title="Personal Information" description="Enter the patient's basic details">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-1">
                                        Full Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={cn(
                                            "transition-all duration-200",
                                            errors.name ? "border-destructive ring-destructive/20 ring-2" : "focus:ring-2 focus:ring-primary/20"
                                        )}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="age" className="flex items-center gap-1">
                                            Age <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            placeholder="e.g. 35"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className={cn(
                                                "transition-all duration-200",
                                                errors.age ? "border-destructive ring-destructive/20 ring-2" : "focus:ring-2 focus:ring-primary/20"
                                            )}
                                        />
                                        {errors.age && (
                                            <p className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200">
                                                {errors.age}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                            Gender <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(val) => setFormData({ ...formData, gender: val })}
                                        >
                                            <SelectTrigger className={cn(
                                                "transition-all duration-200",
                                                errors.gender ? "border-destructive ring-destructive/20 ring-2" : ""
                                            )}>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MALE">Male</SelectItem>
                                                <SelectItem value="FEMALE">Female</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && (
                                            <p className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200">
                                                {errors.gender}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection title="Contact Information" description="Optional contact details">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="patient@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </FormSection>
                        </div>
                    </StepContent>

                    {/* Step 2: Medical Info */}
                    <StepContent step={2} currentStep={currentStep}>
                        <div className="space-y-6">
                            <FormSection title="Blood Type" description="Select the patient's blood type if known">
                                <div className="flex flex-wrap gap-2">
                                    {bloodTypes.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, bloodType: type })}
                                            className={cn(
                                                "px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200",
                                                "hover:scale-105 active:scale-95",
                                                formData.bloodType === type
                                                    ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                                    : "border-border hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-900/10"
                                            )}
                                        >
                                            <Droplet className={cn(
                                                "h-4 w-4 inline mr-1.5 transition-colors",
                                                formData.bloodType === type ? "text-red-500" : "text-muted-foreground"
                                            )} />
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </FormSection>

                            <FormSection title="Known Allergies" description="Add any allergies the patient has">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add allergy (e.g. Penicillin)"
                                        value={newAllergy}
                                        onChange={(e) => setNewAllergy(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={addAllergy}
                                        className="shrink-0 hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {formData.allergies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 animate-in fade-in-0 duration-200">
                                        {formData.allergies.map((allergy, index) => (
                                            <Badge
                                                key={allergy}
                                                variant="destructive"
                                                className="gap-1 pr-1 animate-in zoom-in-95 duration-200"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                {allergy}
                                                <button
                                                    onClick={() => removeAllergy(allergy)}
                                                    className="ml-1 rounded-full hover:bg-destructive-foreground/20 p-0.5 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </FormSection>

                            <FormSection title="Chronic Conditions" description="Add any ongoing medical conditions">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add condition (e.g. Diabetes)"
                                        value={newCondition}
                                        onChange={(e) => setNewCondition(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={addCondition}
                                        className="shrink-0 hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {formData.chronicConditions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 animate-in fade-in-0 duration-200">
                                        {formData.chronicConditions.map((condition, index) => (
                                            <Badge
                                                key={condition}
                                                variant="secondary"
                                                className="gap-1 pr-1 animate-in zoom-in-95 duration-200"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                {condition}
                                                <button
                                                    onClick={() => removeCondition(condition)}
                                                    className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </FormSection>
                        </div>
                    </StepContent>

                    {/* Step 3: Emergency Contact */}
                    <StepContent step={3} currentStep={currentStep}>
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-amber-800 dark:text-amber-300">
                                            Emergency Contact Information
                                        </h4>
                                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                                            This information is crucial for patient safety and will be used in case of emergencies.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <FormSection>
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyName">Contact Name</Label>
                                    <div className="relative group">
                                        <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            id="emergencyName"
                                            placeholder="e.g. Jane Doe"
                                            value={formData.emergencyContactName}
                                            onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="emergencyPhone">Contact Phone</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                            <Input
                                                id="emergencyPhone"
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.emergencyContactPhone}
                                                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Relationship</Label>
                                        <Select
                                            value={formData.emergencyContactRelationship}
                                            onValueChange={(val) => setFormData({ ...formData, emergencyContactRelationship: val })}
                                        >
                                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
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
                            </FormSection>
                        </div>
                    </StepContent>

                    {/* Step 4: Review */}
                    <StepContent step={4} currentStep={currentStep}>
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">
                                            Almost Done!
                                        </h4>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                                            Please review the information below before creating the patient record.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <ReviewSection title="Personal Information" icon={<User className="h-4 w-4" />}>
                                <ReviewItem label="Full Name" value={formData.name} icon={<User className="h-4 w-4" />} />
                                <ReviewItem label="Age" value={formData.age ? `${formData.age} years old` : null} />
                                <ReviewItem label="Gender" value={formData.gender ? formData.gender.charAt(0) + formData.gender.slice(1).toLowerCase() : null} />
                                <ReviewItem label="Blood Type" value={formData.bloodType} icon={<Droplet className="h-4 w-4" />} />
                            </ReviewSection>

                            {(formData.email || formData.phone) && (
                                <ReviewSection title="Contact Information" icon={<Mail className="h-4 w-4" />}>
                                    {formData.email && <ReviewItem label="Email" value={formData.email} icon={<Mail className="h-4 w-4" />} />}
                                    {formData.phone && <ReviewItem label="Phone" value={formData.phone} icon={<Phone className="h-4 w-4" />} />}
                                </ReviewSection>
                            )}

                            {formData.allergies.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                        Allergies
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.allergies.map((a) => (
                                            <Badge key={a} variant="destructive">{a}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.chronicConditions.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-amber-500" />
                                        Chronic Conditions
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.chronicConditions.map((c) => (
                                            <Badge key={c} variant="secondary">{c}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.emergencyContactName && (
                                <ReviewSection title="Emergency Contact" icon={<AlertTriangle className="h-4 w-4" />}>
                                    <ReviewItem label="Name" value={formData.emergencyContactName} icon={<Users className="h-4 w-4" />} />
                                    <ReviewItem label="Phone" value={formData.emergencyContactPhone} icon={<Phone className="h-4 w-4" />} />
                                    <ReviewItem
                                        label="Relationship"
                                        value={formData.emergencyContactRelationship}
                                        className="sm:col-span-2"
                                    />
                                </ReviewSection>
                            )}
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
                        submitLabel="Create Patient"
                        submitIcon={<UserPlus className="h-4 w-4" />}
                    />
                </CardFooter>
            </Card>
        </div>
    );
}
