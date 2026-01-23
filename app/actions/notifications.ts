"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getNotifications() {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const hospitalId = session.user.hospitalId;
    const userId = session.user.id;

    // Get emergency referrals (incoming) from last 24 hours
    const emergencyReferrals = await prisma.referral.findMany({
        where: {
            toHospitalId: hospitalId,
            priority: "EMERGENCY",
            status: "SENT",
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
        },
        include: {
            patient: { select: { name: true } },
            fromHospital: { select: { name: true } },
            referringDoctor: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    // Get referral status updates (for referrals user created)
    const referralUpdates = await prisma.referralEvent.findMany({
        where: {
            referral: {
                referringDoctorId: userId,
            },
            type: { in: ["ACCEPTED", "REJECTED"] },
            timestamp: {
                gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
            },
        },
        include: {
            referral: {
                include: {
                    patient: { select: { name: true } },
                    toHospital: { select: { name: true } },
                },
            },
        },
        orderBy: { timestamp: "desc" },
        take: 5,
    });

    // Get unread messages count
    const unreadMessages = await prisma.message.count({
        where: {
            receiverId: userId,
            read: false,
        },
    });

    // Format notifications
    const notifications = [
        ...emergencyReferrals.map((r) => ({
            id: `emergency-${r.id}`,
            type: "emergency" as const,
            title: "Emergency Referral",
            message: `${r.patient.name} from ${r.fromHospital.name}`,
            time: r.createdAt,
            link: `/referrals/${r.id}`,
            priority: "high" as const,
        })),
        ...referralUpdates.map((e) => ({
            id: `update-${e.id}`,
            type: e.type === "ACCEPTED" ? ("accepted" as const) : ("rejected" as const),
            title: e.type === "ACCEPTED" ? "Referral Accepted" : "Referral Rejected",
            message: `${e.referral.patient.name} - ${e.referral.toHospital.name}`,
            time: e.timestamp,
            link: `/referrals/${e.referralId}`,
            priority: "normal" as const,
        })),
    ];

    // Sort by time
    notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return {
        notifications: notifications.slice(0, 10),
        unreadMessages,
        emergencyCount: emergencyReferrals.length,
    };
}

