"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getAnalytics() {
    const session = await getSession();
    if (!session || (session.user.role !== "hospital_admin" && session.user.role !== "system_admin")) {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;

    // Total Referrals
    const totalReferrals = await prisma.referral.count({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
        },
    });

    // Emergency Cases
    const emergencyCases = await prisma.referral.count({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
            priority: "EMERGENCY",
        },
    });

    // Average Response Time (simplified: time between SENT and ACCEPTED/REJECTED)
    // This is a bit complex for Prisma without raw SQL or multiple queries
    // For now, let's return some mock-ish real data based on counts

    const acceptedCount = await prisma.referral.count({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
            status: "ACCEPTED",
        },
    });

    const rejectedCount = await prisma.referral.count({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
            status: "REJECTED",
        },
    });

    // Referral Flow (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const flowData = await Promise.all(last7Days.map(async (date) => {
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);

        const count = await prisma.referral.count({
            where: {
                OR: [
                    { fromHospitalId: hospitalId },
                    { toHospitalId: hospitalId },
                ],
                createdAt: {
                    gte: start,
                    lt: end,
                },
            },
        });

        const emergency = await prisma.referral.count({
            where: {
                OR: [
                    { fromHospitalId: hospitalId },
                    { toHospitalId: hospitalId },
                ],
                priority: "EMERGENCY",
                createdAt: {
                    gte: start,
                    lt: end,
                },
            },
        });

        return {
            date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            total: count,
            emergency: emergency,
        };
    }));

    return {
        metrics: {
            totalReferrals,
            emergencyCases,
            acceptanceRate: totalReferrals > 0 ? Math.round((acceptedCount / totalReferrals) * 100) : 0,
            responseTime: "1.2h", // Placeholder for now
        },
        flowData,
        rejectionReasons: [
            { name: "Capacity", value: 40 },
            { name: "Specialty Unavailable", value: 30 },
            { name: "Insurance", value: 15 },
            { name: "Other", value: 15 },
        ],
    };
}
