"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Phone, Mail, Droplet, Heart, FileText, Pill, Activity, ClipboardList, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/medical/status-badge";
import { AuditLogItem } from "@/components/medical/audit-log-item";
import { EmptyState } from "@/components/medical/empty-state";
import { patients, medicalRecords, auditLogs, referrals } from "@/lib/mock-data";
import Link from "next/link";

interface PatientProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function PatientProfilePage({ params }: PatientProfilePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const patient = patients.find((p) => p.id === resolvedParams.id);

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          icon={FileText}
          title="Patient not found"
          description="The patient you are looking for does not exist."
          action={{
            label: "Go back to patients",
            onClick: () => router.push("/patients"),
          }}
        />
      </div>
    );
  }

  const patientReferrals = referrals.filter((r) => r.patientId === patient.id);
  const patientAuditLogs = auditLogs.filter((log) =>
    log.details.includes(patient.name) || log.details.includes(patient.id)
  );

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {patient.name}
            </h1>
            <StatusBadge status={patient.status} />
            {patient.status === "Critical" && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                Emergency
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Patient ID: {patient.id} | {patient.hospital}
          </p>
        </div>
        <Button asChild>
          <Link href={`/referrals/create?patientId=${patient.id}`}>
            <Send className="mr-2 h-4 w-4" />
            Create Referral
          </Link>
        </Button>
      </div>

      {/* Critical Info Banner */}
      {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-amber-800 dark:text-amber-200">
                  Critical Patient Information
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {patient.allergies.length > 0 && (
                    <div>
                      <span className="font-medium text-amber-700 dark:text-amber-300">
                        Allergies:{" "}
                      </span>
                      <span className="text-amber-600 dark:text-amber-400">
                        {patient.allergies.join(", ")}
                      </span>
                    </div>
                  )}
                  {patient.chronicConditions.length > 0 && (
                    <div>
                      <span className="font-medium text-amber-700 dark:text-amber-300">
                        Chronic Conditions:{" "}
                      </span>
                      <span className="text-amber-600 dark:text-amber-400">
                        {patient.chronicConditions.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">{patient.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{patient.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <Droplet className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Blood Type</p>
                <p className="text-sm font-medium text-foreground">{patient.bloodType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Heart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Age / Gender</p>
                <p className="text-sm font-medium text-foreground">
                  {patient.age} years / {patient.gender}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium text-foreground">
              {patient.emergencyContact.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {patient.emergencyContact.relationship}
            </p>
            <p className="text-sm text-primary">{patient.emergencyContact.phone}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Recent Medical Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicalRecords.slice(0, 3).map((record) => (
                <div
                  key={record.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    {record.type === "Diagnosis" && <Activity className="h-5 w-5 text-primary" />}
                    {record.type === "Lab Result" && <FileText className="h-5 w-5 text-primary" />}
                    {record.type === "Prescription" && <Pill className="h-5 w-5 text-primary" />}
                    {record.type === "Procedure" && <Heart className="h-5 w-5 text-primary" />}
                    {record.type === "Note" && <ClipboardList className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground">{record.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{record.details}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {record.doctor} | {record.hospital}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Medical History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicalRecords
                .filter((r) => r.type === "Diagnosis" || r.type === "Procedure")
                .map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground">{record.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{record.details}</p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Lab Results</CardTitle>
            </CardHeader>
            <CardContent>
              {medicalRecords.filter((r) => r.type === "Lab Result").length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No lab results"
                  description="Lab results will appear here when available."
                />
              ) : (
                <div className="space-y-3">
                  {medicalRecords
                    .filter((r) => r.type === "Lab Result")
                    .map((record) => (
                      <div
                        key={record.id}
                        className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-foreground">{record.title}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{record.details}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {medicalRecords.filter((r) => r.type === "Prescription").length === 0 ? (
                <EmptyState
                  icon={Pill}
                  title="No prescriptions"
                  description="Prescriptions will appear here when available."
                />
              ) : (
                <div className="space-y-3">
                  {medicalRecords
                    .filter((r) => r.type === "Prescription")
                    .map((record) => (
                      <div
                        key={record.id}
                        className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                          <Pill className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-foreground">{record.title}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{record.details}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              {patientReferrals.length === 0 ? (
                <EmptyState
                  icon={Send}
                  title="No referrals"
                  description="Referrals for this patient will appear here."
                  action={{
                    label: "Create Referral",
                    onClick: () =>
                      router.push(`/referrals/create?patientId=${patient.id}`),
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {patientReferrals.map((referral) => (
                    <Link
                      key={referral.id}
                      href={`/referrals/${referral.id}`}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {referral.toHospital}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {referral.reason}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={referral.status} />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              {patientAuditLogs.length === 0 ? (
                <EmptyState
                  icon={ClipboardList}
                  title="No audit logs"
                  description="Activity logs for this patient will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {patientAuditLogs.map((entry) => (
                    <AuditLogItem key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
