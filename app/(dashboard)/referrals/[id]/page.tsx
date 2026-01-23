import { getReferralById } from "@/app/actions/referrals";
import { getSession } from "@/lib/auth";
import ReferralDetailsClient from "./referral-details-client";
import { notFound, redirect } from "next/navigation";

interface ReferralDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReferralDetailsPage({ params }: ReferralDetailsPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const referral = await getReferralById(id);

  if (!referral) {
    return notFound();
  }

  // Map Prisma data to match frontend expectations if necessary
  const mappedReferral = {
    ...referral,
    patientName: referral.patient.name,
    fromHospital: referral.fromHospital.name,
    toHospital: referral.toHospital.name,
    fromHospitalId: referral.fromHospitalId,
    toHospitalId: referral.toHospitalId,
    referringDoctor: referral.referringDoctor.name,
    receivingDoctor: referral.receivingDoctor?.name || "Unassigned",
    createdAt: referral.createdAt.toISOString(),
    timeline: referral.timeline.map(t => ({
      ...t,
      timestamp: t.timestamp.toISOString()
    }))
  };

  return (
    <ReferralDetailsClient
      referral={mappedReferral as any}
      userHospitalId={session.user.hospitalId}
    />
  );
}
