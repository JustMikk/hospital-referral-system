"use client";

import { PageHeader } from "@/components/medical/page-header";
import { PatientTable } from "@/components/medical/patient-table";
import { patients } from "@/lib/mock-data";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Manage and view patient records across all connected hospitals"
      />

      <PatientTable patients={patients} />
    </div>
  );
}
