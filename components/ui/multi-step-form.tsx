"use client";

import * as React from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Step {
    id: number;
    title: string;
    icon: React.ElementType;
    description?: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (step: number) => void;
    allowClickNavigation?: boolean;
}

export function StepIndicator({
    steps,
    currentStep,
    onStepClick,
    allowClickNavigation = false,
}: StepIndicatorProps) {
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="relative px-4 py-2">
            {/* Background track */}
            <div className="absolute top-[28px] left-8 right-8 h-1 bg-muted rounded-full" />
            
            {/* Animated progress bar */}
            <div
                className="absolute top-[28px] left-8 h-1 bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
                style={{ width: `calc(${progressPercentage}% - ${progressPercentage > 0 ? '0px' : '0px'})`, maxWidth: 'calc(100% - 64px)' }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const isClickable = allowClickNavigation && (isCompleted || step.id === currentStep);

                    return (
                        <div
                            key={step.id}
                            className="flex flex-col items-center gap-2"
                            onClick={() => isClickable && onStepClick?.(step.id)}
                        >
                            {/* Step circle */}
                            <div
                                className={cn(
                                    "relative h-14 w-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-out",
                                    "bg-background shadow-sm",
                                    isCompleted && "border-primary bg-primary text-primary-foreground scale-100",
                                    isCurrent && "border-primary ring-4 ring-primary/20 scale-110",
                                    !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground",
                                    isClickable && "cursor-pointer hover:scale-105"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-6 w-6 animate-in zoom-in-50 duration-200" />
                                ) : (
                                    <step.icon className={cn(
                                        "h-6 w-6 transition-transform duration-200",
                                        isCurrent && "animate-pulse"
                                    )} />
                                )}
                                
                                {/* Pulse effect for current step */}
                                {isCurrent && (
                                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                                )}
                            </div>

                            {/* Step label */}
                            <div className="flex flex-col items-center">
                                <span
                                    className={cn(
                                        "text-xs font-semibold transition-colors duration-200 hidden sm:block",
                                        isCompleted && "text-primary",
                                        isCurrent && "text-primary",
                                        !isCompleted && !isCurrent && "text-muted-foreground"
                                    )}
                                >
                                    {step.title}
                                </span>
                                {step.description && (
                                    <span className="text-[10px] text-muted-foreground hidden lg:block">
                                        {step.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface StepContentProps {
    children: React.ReactNode;
    step: number;
    currentStep: number;
    className?: string;
}

export function StepContent({ children, step, currentStep, className }: StepContentProps) {
    const isVisible = step === currentStep;
    const direction = step < currentStep ? -1 : 1;

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "animate-in fade-in-0 slide-in-from-right-4 duration-300",
                className
            )}
            style={{
                animationFillMode: "forwards",
            }}
        >
            {children}
        </div>
    );
}

interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
    isSubmitting?: boolean;
    backLabel?: string;
    nextLabel?: string;
    submitLabel?: string;
    submitIcon?: React.ReactNode;
    canProceed?: boolean;
}

export function StepNavigation({
    currentStep,
    totalSteps,
    onBack,
    onNext,
    isSubmitting = false,
    backLabel = "Back",
    nextLabel = "Continue",
    submitLabel = "Submit",
    submitIcon,
    canProceed = true,
}: StepNavigationProps) {
    const isLastStep = currentStep === totalSteps;

    return (
        <div className="flex items-center justify-between pt-6 border-t">
            <Button
                variant="ghost"
                onClick={onBack}
                disabled={currentStep === 1 || isSubmitting}
                className={cn(
                    "gap-2 transition-all duration-200",
                    currentStep === 1 && "opacity-0 pointer-events-none"
                )}
            >
                <ChevronRight className="h-4 w-4 rotate-180" />
                {backLabel}
            </Button>

            <div className="flex items-center gap-2">
                {/* Step counter */}
                <span className="text-sm text-muted-foreground mr-4 hidden sm:block">
                    Step {currentStep} of {totalSteps}
                </span>

                <Button
                    onClick={onNext}
                    disabled={isSubmitting || !canProceed}
                    className={cn(
                        "gap-2 min-w-[140px] transition-all duration-200",
                        isLastStep && "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    )}
                >
                    {isSubmitting ? (
                        <>
                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : isLastStep ? (
                        <>
                            {submitIcon}
                            {submitLabel}
                        </>
                    ) : (
                        <>
                            {nextLabel}
                            <ChevronRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

interface FormSectionProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
    return (
        <div className={cn("space-y-4", className)}>
            {(title || description) && (
                <div className="space-y-1">
                    {title && (
                        <h3 className="font-semibold text-foreground">{title}</h3>
                    )}
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}

interface ReviewItemProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

export function ReviewItem({ label, value, icon, className }: ReviewItemProps) {
    return (
        <div className={cn(
            "flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50",
            "transition-all duration-200 hover:bg-muted/50 hover:border-border",
            className
        )}>
            {icon && (
                <div className="shrink-0 mt-0.5 text-muted-foreground">
                    {icon}
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                </p>
                <div className="font-medium text-foreground mt-0.5">
                    {value || <span className="text-muted-foreground italic">Not provided</span>}
                </div>
            </div>
        </div>
    );
}

interface ReviewSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function ReviewSection({ title, icon, children, className }: ReviewSectionProps) {
    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {icon}
                {title}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
                {children}
            </div>
        </div>
    );
}

