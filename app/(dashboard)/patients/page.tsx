import { PageHeader } from "@/components/medical/page-header";
import { PatientTable } from "@/components/medical/patient-table";
import { getPatients } from "@/app/actions/patients";

export default async function PatientsPage() {
  const patientsData = await getPatients();

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
      />

      <PatientTable patients={patients as any} />
    </div>
  );
}
