"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    Calendar,
    FileText,
    MessageSquare,
    Check,
    X,
    Activity,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/medical/status-badge";
import { ReferralTimeline } from "@/components/medical/referral-timeline";
import { ConfirmModal } from "@/components/medical/confirm-modal";
import { useAuth } from "@/context/auth-context";
import { updateReferralStatus } from "@/app/actions/referrals";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createMedicalRecord } from "@/app/actions/patients";
import { createTask } from "@/app/actions/tasks";
import { toast } from "sonner";

interface Referral {
    id: string;
    patientId: string;
    patientName: string;
    fromHospital: string;
    toHospital: string;
    fromHospitalId: string;
    toHospitalId: string;
    referringDoctor: string;
    receivingDoctor: string;
    status: string;
    priority: string;
    reason: string;
    notes?: string;
    createdAt: string;
    timeline: any[];
    patient: any;
}

interface ReferralDetailsClientProps {
    referral: Referral;
    userHospitalId: string;
}

export default function ReferralDetailsClient({ referral, userHospitalId }: ReferralDetailsClientProps) {
    const { userRole } = useAuth();
    const isReceivingHospital = userHospitalId === referral.toHospitalId;
    const router = useRouter();
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    // Nurse action states
    const [showVitalsModal, setShowVitalsModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showConcernModal, setShowConcernModal] = useState(false);
    const [isNurseActionLoading, setIsNurseActionLoading] = useState(false);
    const [vitalsData, setVitalsData] = useState({ bp: "", temp: "", pulse: "", respRate: "" });
    const [nursingNote, setNursingNote] = useState("");
    const [concernDetails, setConcernDetails] = useState("");

    const handleAccept = async () => {
        setIsLoading(true);
        try {
            await updateReferralStatus(referral.id, "ACCEPTED");
            setShowAcceptModal(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to accept referral:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) return;

        setIsLoading(true);
        try {
            await updateReferralStatus(referral.id, "REJECTED", rejectionReason);
            setShowRejectModal(false);
            setRejectionReason("");
            router.refresh();
        } catch (error) {
            console.error("Failed to reject referral:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Nurse action handlers
    const handleUpdateVitals = async () => {
        setIsNurseActionLoading(true);
        try {
            const vitalsText = `BP: ${vitalsData.bp}, Temp: ${vitalsData.temp}°F, Pulse: ${vitalsData.pulse} bpm, Resp Rate: ${vitalsData.respRate}/min`;
            await createMedicalRecord({
                patientId: referral.patientId,
                type: "Note",
                title: "Vital Signs Update",
                details: vitalsText,
            });
            toast.success("Vitals updated successfully");
            setShowVitalsModal(false);
            setVitalsData({ bp: "", temp: "", pulse: "", respRate: "" });
            router.refresh();
        } catch (error) {
            toast.error("Failed to update vitals");
        } finally {
            setIsNurseActionLoading(false);
        }
    };

    const handleAddNursingNote = async () => {
        if (!nursingNote.trim()) return;
        setIsNurseActionLoading(true);
        try {
            await createMedicalRecord({
                patientId: referral.patientId,
                type: "Note",
                title: "Nursing Note",
                details: nursingNote,
            });
            toast.success("Nursing note added successfully");
            setShowNoteModal(false);
            setNursingNote("");
            router.refresh();
        } catch (error) {
            toast.error("Failed to add nursing note");
        } finally {
            setIsNurseActionLoading(false);
        }
    };

    const handleFlagConcern = async () => {
        if (!concernDetails.trim()) return;
        setIsNurseActionLoading(true);
        try {
            await createTask({
                title: `Concern: ${referral.patientName}`,
                description: concernDetails,
                priority: "URGENT",
                patientId: referral.patientId,
            });
            toast.success("Concern flagged - Task created");
            setShowConcernModal(false);
            setConcernDetails("");
            router.refresh();
        } catch (error) {
            toast.error("Failed to flag concern");
        } finally {
            setIsNurseActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="shrink-0"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Referral {referral.id}
                            </h1>
                            <StatusBadge status={referral.status} />
                            <StatusBadge status={referral.priority} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Created on {new Date(referral.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Action buttons - only show for pending referrals, non-nurses, and receiving hospital */}
                {referral.status === "SENT" && userRole !== "nurse" && isReceivingHospital && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                            onClick={() => setShowRejectModal(true)}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                        <Button onClick={() => setShowAcceptModal(true)}>
                            <Check className="mr-2 h-4 w-4" />
                            Accept
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient Info */}
                    <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
                        <CardHeader>
                            <CardTitle className="text-lg">Patient Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Patient Name</p>
                                        <Link
                                            href={`/patients/${referral.patientId}`}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            {referral.patientName}
                                        </Link>
                                    </div>
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Age / Gender</p>
                                            <p className="font-medium text-foreground">
                                                {referral.patient.age} / {referral.patient.gender}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <p className="font-medium text-foreground">
                                                {referral.patient.status}
                                            </p>
                                        </div>
                                    </div>
                                    {referral.patient.allergies.length > 0 && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Allergies</p>
                                            <p className="font-medium text-red-600 dark:text-red-400">
                                                {referral.patient.allergies.join(", ")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/patients/${referral.patientId}`}>
                                        View Patient
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medical Data Tabs */}
                    <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
                        <CardHeader>
                            <CardTitle className="text-lg">Clinical Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Reason for Referral</h3>
                                    <p className="text-base">{referral.reason}</p>
                                </div>

                                {referral.notes && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Clinical Notes</h3>
                                        <div className="bg-muted/30 p-4 rounded-lg text-sm">
                                            {referral.notes}
                                        </div>
                                    </div>
                                )}

                                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Records</h3>
                                        <ul className="space-y-2 text-sm">
                                            {referral.patient.medicalRecords.slice(0, 3).map((record: any) => (
                                                <li key={record.id} className="flex justify-between">
                                                    <span>{record.title}</span>
                                                    <span className="text-muted-foreground">{new Date(record.date).toLocaleDateString()}</span>
                                                </li>
                                            ))}
                                            {referral.patient.medicalRecords.length === 0 && (
                                                <li className="text-muted-foreground italic">No recent records found.</li>
                                            )}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Attachments</h3>
                                        <p className="text-sm text-muted-foreground italic">No attachments provided.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Transfer Details */}
                    <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
                        <CardHeader>
                            <CardTitle className="text-lg">Transfer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">From</p>
                                    <p className="text-sm font-medium">{referral.fromHospital}</p>
                                    <p className="text-xs text-muted-foreground">{referral.referringDoctor}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="h-4 w-0.5 bg-border" />
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                    <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">To</p>
                                    <p className="text-sm font-medium">{referral.toHospital}</p>
                                    <p className="text-xs text-muted-foreground">{referral.receivingDoctor}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
                        <CardHeader>
                            <CardTitle className="text-lg">Status Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ReferralTimeline events={referral.timeline} />
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                                <Link href="/messages">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Message Doctor
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start bg-transparent">
                                <FileText className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                            <Button variant="outline" className="w-full justify-start bg-transparent">
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Follow-up
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Nursing Actions - Only for Nurses */}
                    {userRole === "nurse" && (
                        <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06] border-l-4 border-l-blue-500">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-blue-500" />
                                    Nursing Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                                    variant="outline"
                                    onClick={() => setShowVitalsModal(true)}
                                >
                                    <Activity className="mr-2 h-4 w-4" />
                                    Update Vitals
                                </Button>
                                <Button
                                    className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                                    variant="outline"
                                    onClick={() => setShowNoteModal(true)}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Add Nursing Note
                                </Button>
                                <Button
                                    className="w-full justify-start bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                                    variant="outline"
                                    onClick={() => setShowConcernModal(true)}
                                >
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Flag Concern
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Confirmation Modals */}
            <ConfirmModal
                open={showAcceptModal}
                onOpenChange={setShowAcceptModal}
                title="Accept Referral"
                description="Are you sure you want to accept this referral? The referring hospital will be notified."
                confirmLabel="Accept Referral"
                onConfirm={handleAccept}
                isLoading={isLoading}
            />

            <ConfirmModal
                open={showRejectModal}
                onOpenChange={setShowRejectModal}
                title="Reject Referral"
                description="Please provide a reason for rejecting this referral. This will be sent to the referring doctor."
                confirmLabel="Reject Referral"
                onConfirm={handleReject}
                variant="destructive"
                isLoading={isLoading}
                input={true}
                inputPlaceholder="Reason for rejection (required)"
                inputValue={rejectionReason}
                onInputChange={setRejectionReason}
            />

            {/* Nurse Action Dialogs */}
            <Dialog open={showVitalsModal} onOpenChange={setShowVitalsModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Vital Signs</DialogTitle>
                        <DialogDescription>
                            Record the patient's current vital signs
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bp">Blood Pressure</Label>
                                <Input
                                    id="bp"
                                    placeholder="120/80"
                                    value={vitalsData.bp}
                                    onChange={(e) => setVitalsData({ ...vitalsData, bp: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="temp">Temperature (°F)</Label>
                                <Input
                                    id="temp"
                                    placeholder="98.6"
                                    value={vitalsData.temp}
                                    onChange={(e) => setVitalsData({ ...vitalsData, temp: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pulse">Pulse (bpm)</Label>
                                <Input
                                    id="pulse"
                                    placeholder="72"
                                    value={vitalsData.pulse}
                                    onChange={(e) => setVitalsData({ ...vitalsData, pulse: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="respRate">Respiratory Rate</Label>
                                <Input
                                    id="respRate"
                                    placeholder="16"
                                    value={vitalsData.respRate}
                                    onChange={(e) => setVitalsData({ ...vitalsData, respRate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowVitalsModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateVitals} disabled={isNurseActionLoading}>
                            {isNurseActionLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Vitals"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Nursing Note</DialogTitle>
                        <DialogDescription>
                            Add observation or care notes for this patient
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Enter your nursing notes here..."
                            value={nursingNote}
                            onChange={(e) => setNursingNote(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNoteModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddNursingNote} disabled={isNurseActionLoading || !nursingNote.trim()}>
                            {isNurseActionLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Add Note"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showConcernModal} onOpenChange={setShowConcernModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-amber-600">Flag a Concern</DialogTitle>
                        <DialogDescription>
                            This will create an urgent task for the care team
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Describe the concern in detail..."
                            value={concernDetails}
                            onChange={(e) => setConcernDetails(e.target.value)}
                            rows={4}
                            className="border-amber-200 focus-visible:ring-amber-500"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConcernModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleFlagConcern}
                            disabled={isNurseActionLoading || !concernDetails.trim()}
                            className="bg-amber-600 hover:bg-amber-700"
                        >
                            {isNurseActionLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Flag Concern
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
