import { getPatientById } from "@/app/actions/patients";
import { notFound } from "next/navigation";
import PatientProfileClient from "./patient-profile-client";

export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) return notFound();

  return <PatientProfileClient patient={patient} />;
}
