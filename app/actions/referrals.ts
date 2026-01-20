"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getReferrals(type: "incoming" | "outgoing") {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const user = session.user;

    if (type === "incoming") {
        return await prisma.referral.findMany({
            where: {
                toHospitalId: user.hospitalId,
            },
            include: {
                patient: true,
                fromHospital: true,
                toHospital: true,
                referringDoctor: true,
                receivingDoctor: true,
            },
            orderBy: [
                { priority: "desc" }, // Emergency first (if we map them correctly)
                { createdAt: "desc" },
            ],
        });
    } else {
        return await prisma.referral.findMany({
            where: {
                fromHospitalId: user.hospitalId,
            },
            include: {
                patient: true,
                fromHospital: true,
                toHospital: true,
                referringDoctor: true,
                receivingDoctor: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}

export async function getReferralById(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    return await prisma.referral.findUnique({
        where: { id },
        include: {
            patient: {
                include: {
                    medicalRecords: {
                        orderBy: { date: "desc" },
                    },
                },
            },
            fromHospital: true,
            toHospital: true,
            referringDoctor: true,
            receivingDoctor: true,
            timeline: {
                orderBy: { timestamp: "asc" },
            },
        },
    });
}

export async function createReferral(data: any) {
    const session = await getSession();
    if (!session || session.user.role !== "DOCTOR") {
        throw new Error("Only doctors can create referrals");
    }

    const {
        patientId,
        toHospitalId,
        priority,
        reason,
        notes,
        emergencyConfirmed,
        emergencyReason,
        immediateRisks,
        shareLabResults,
        shareImaging,
        shareNotes,
    } = data;

    const referral = await prisma.referral.create({
        data: {
            patientId,
            fromHospitalId: session.user.hospitalId,
            toHospitalId,
            referringDoctorId: session.user.id,
            status: "SENT",
            priority,
            reason,
            notes,
            emergencyConfirmed: emergencyConfirmed || false,
            emergencyReason,
            immediateRisks,
            shareLabResults: shareLabResults ?? true,
            shareImaging: shareImaging ?? false,
            shareNotes: shareNotes ?? true,
        },
    });

    // Log the creation event
    await prisma.referralEvent.create({
        data: {
            referralId: referral.id,
            type: "CREATED",
            actorId: session.user.id,
            actorName: session.user.name,
            details: "Referral created and sent",
        },
    });

    revalidatePath("/referrals");
    return referral;
}

export async function updateReferralStatus(id: string, status: "ACCEPTED" | "REJECTED", reason?: string) {
    const session = await getSession();
    if (!session || session.user.role !== "DOCTOR") {
        throw new Error("Only doctors can accept or reject referrals");
    }

    const referral = await prisma.referral.update({
        where: { id },
        data: {
            status,
            rejectionReason: reason,
            receivingDoctorId: session.user.id,
        },
    });

    // Log the event
    await prisma.referralEvent.create({
        data: {
            referralId: id,
            type: status,
            actorId: session.user.id,
            actorName: session.user.name,
            details: reason ? `Reason: ${reason}` : undefined,
        },
    });

    revalidatePath(`/referrals/${id}`);
    revalidatePath("/referrals");
    return referral;
}
