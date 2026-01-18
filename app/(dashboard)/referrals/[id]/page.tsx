"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  Calendar,
  FileText,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/medical/status-badge";
import { ReferralTimeline } from "@/components/medical/referral-timeline";
import { ConfirmModal } from "@/components/medical/confirm-modal";
import { EmptyState } from "@/components/medical/empty-state";
import { referrals, patients } from "@/lib/mock-data";

interface ReferralDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ReferralDetailsPage({ params }: ReferralDetailsPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const referral = referrals.find((r) => r.id === resolvedParams.id);
  const patient = patients.find((p) => p.id === referral?.patientId);

  if (!referral) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          icon={FileText}
          title="Referral not found"
          description="The referral you are looking for does not exist."
          action={{
            label: "Go back to referrals",
            onClick: () => router.push("/referrals"),
          }}
        />
      </div>
    );
  }

  const handleAccept = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowAcceptModal(false);
    // In a real app, this would update the referral status
  };

  const handleReject = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowRejectModal(false);
    // In a real app, this would update the referral status
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

        {/* Action buttons - only show for pending referrals */}
        {referral.status === "Sent" && (
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
                  {patient && (
                    <>
                      <div className="flex gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Age / Gender</p>
                          <p className="font-medium text-foreground">
                            {patient.age} / {patient.gender}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Blood Type</p>
                          <p className="font-medium text-foreground">
                            {patient.bloodType}
                          </p>
                        </div>
                      </div>
                      {patient.allergies.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Allergies</p>
                          <p className="font-medium text-red-600 dark:text-red-400">
                            {patient.allergies.join(", ")}
                          </p>
                        </div>
                      )}
                    </>
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

          {/* Transfer Details */}
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Transfer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">From Hospital</p>
                      <p className="font-medium text-foreground">
                        {referral.fromHospital}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Referring Doctor
                      </p>
                      <p className="font-medium text-foreground">
                        {referral.referringDoctor}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">To Hospital</p>
                      <p className="font-medium text-foreground">
                        {referral.toHospital}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Receiving Doctor
                      </p>
                      <p className="font-medium text-foreground">
                        {referral.receivingDoctor}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reason & Notes */}
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Referral Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Reason for Referral
                </p>
                <p className="text-foreground">{referral.reason}</p>
              </div>
              {referral.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Additional Notes
                  </p>
                  <p className="text-foreground">{referral.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ReferralTimeline referral={referral} />
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
        description="Are you sure you want to reject this referral? The referring hospital will be notified and they may need to find an alternative."
        confirmLabel="Reject Referral"
        onConfirm={handleReject}
        variant="destructive"
        isLoading={isLoading}
      />
    </div>
  );
}
