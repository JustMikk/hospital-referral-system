import { Suspense } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { getReferrals } from "@/app/actions/referrals";
import ReferralsClient from "./referrals-client";
import Loading from "./loading";

export default async function ReferralsPage() {
  const incomingData = await getReferrals("incoming");
  const outgoingData = await getReferrals("outgoing");

  // Map Prisma data to match frontend expectations
  const mapReferral = (r: any) => ({
    ...r,
    patientName: r.patient.name,
    fromHospital: r.fromHospital.name,
    toHospital: r.toHospital.name,
    referringDoctor: r.referringDoctor.name,
    receivingDoctor: r.receivingDoctor?.name || "Unassigned",
    createdAt: r.createdAt.toISOString(),
  });

  const incoming = incomingData.map(mapReferral);
  const outgoing = outgoingData.map(mapReferral);

  return (
    <Suspense fallback={<Loading />}>
      <ReferralsClient
        initialIncoming={incoming as any}
        initialOutgoing={outgoing as any}
      />
    </Suspense>
  );
}
