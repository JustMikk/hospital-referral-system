"use client";

import React from "react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/medical/page-header";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patients } from "@/lib/mock-data";
import Loading from "./loading";

function CreateReferralForm({ searchParams }: { searchParams: any }) {
  const router = useRouter();
  const preselectedPatientId = searchParams.get("patientId") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientId: preselectedPatientId,
    toHospital: "",
    receivingDoctor: "",
    priority: "Normal",
    reason: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = "Please select a patient";
    }
    if (!formData.toHospital) {
      newErrors.toHospital = "Please enter destination hospital";
    }
    if (!formData.receivingDoctor) {
      newErrors.receivingDoctor = "Please enter receiving doctor";
    }
    if (!formData.reason) {
      newErrors.reason = "Please provide a reason for referral";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    router.push("/referrals");
  };

  const hospitals = [
    "Central Medical Center",
    "St. Mary's Hospital",
    "City General Hospital",
    "Memorial Hospital",
    "Heart Specialist Clinic",
    "Cardiac Surgery Center",
    "Neurology Specialist Clinic",
    "Pulmonary Rehabilitation Center",
  ];

  const doctors = [
    "Dr. James Carter",
    "Dr. Sarah Lee",
    "Dr. Robert Martinez",
    "Dr. Patricia Anderson",
    "Dr. William Taylor",
    "Dr. Jennifer Brown",
  ];

  return (
    <div className="space-y-6">
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
          title="Create Referral"
          description="Create a new patient referral to another hospital"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Patient Information */}
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Select Patient *</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, patientId: value });
                    if (errors.patientId) setErrors({ ...errors, patientId: "" });
                  }}
                >
                  <SelectTrigger
                    id="patient"
                    className={errors.patientId ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patientId && (
                  <p className="text-xs text-destructive">{errors.patientId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Destination Information */}
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Destination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toHospital">Destination Hospital *</Label>
                <Select
                  value={formData.toHospital}
                  onValueChange={(value) => {
                    setFormData({ ...formData, toHospital: value });
                    if (errors.toHospital) setErrors({ ...errors, toHospital: "" });
                  }}
                >
                  <SelectTrigger
                    id="toHospital"
                    className={errors.toHospital ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital} value={hospital}>
                        {hospital}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.toHospital && (
                  <p className="text-xs text-destructive">{errors.toHospital}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="receivingDoctor">Receiving Doctor *</Label>
                <Select
                  value={formData.receivingDoctor}
                  onValueChange={(value) => {
                    setFormData({ ...formData, receivingDoctor: value });
                    if (errors.receivingDoctor)
                      setErrors({ ...errors, receivingDoctor: "" });
                  }}
                >
                  <SelectTrigger
                    id="receivingDoctor"
                    className={errors.receivingDoctor ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.receivingDoctor && (
                  <p className="text-xs text-destructive">
                    {errors.receivingDoctor}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Referral Details */}
          <Card className="lg:col-span-2 shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardHeader>
              <CardTitle className="text-lg">Referral Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Referral *</Label>
                <Input
                  id="reason"
                  placeholder="Brief reason for referral"
                  value={formData.reason}
                  onChange={(e) => {
                    setFormData({ ...formData, reason: e.target.value });
                    if (errors.reason) setErrors({ ...errors, reason: "" });
                  }}
                  className={errors.reason ? "border-destructive" : ""}
                />
                {errors.reason && (
                  <p className="text-xs text-destructive">{errors.reason}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Include any relevant medical history, current medications, or special instructions..."
                  rows={5}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  This information will be shared with the receiving hospital.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Referral"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CreateReferralPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateReferralForm searchParams={useSearchParams()} />
    </Suspense>
  );
}
