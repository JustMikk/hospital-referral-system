import { Suspense } from "react";
import { getPatients } from "@/app/actions/patients";
import { getHospitals } from "@/app/actions/hospitals";
import CreateReferralClient from "./create-referral-client";
import Loading from "./loading";

export default async function CreateReferralPage({
  searchParams
}: {
  searchParams: Promise<{ patientId?: string }>
}) {
  const patients = await getPatients();
  const hospitals = await getHospitals();
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<Loading />}>
      <CreateReferralClient
        patients={patients as any}
        hospitals={hospitals as any}
        preselectedPatientId={resolvedSearchParams.patientId}
      />
    </Suspense>
  );
}
