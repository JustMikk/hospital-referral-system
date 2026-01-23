import { PageHeader } from "@/components/medical/page-header";
import { PatientTable } from "@/components/medical/patient-table";
import { getPatients } from "@/app/actions/patients";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default async function PatientsPage() {
  const session = await getSession();
  const patientsData = await getPatients();

  const canCreatePatient = session?.user.role === "DOCTOR" || session?.user.role === "NURSE";

  // Map Prisma data to match frontend expectations if necessary
  const patients = patientsData.map(p => ({
    ...p,
    hospital: p.hospital.name,
    lastVisit: p.lastVisit.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Manage and view patient records across all connected hospitals"
      >
        {canCreatePatient && (
          <Button asChild className="gap-2">
            <Link href="/patients/create">
              <UserPlus className="h-4 w-4" />
              New Patient
            </Link>
          </Button>
        )}
      </PageHeader>

      <PatientTable patients={patients as any} />
    </div>
  );
}
