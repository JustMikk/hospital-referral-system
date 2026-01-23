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

    // Average Response Time
    const terminalReferrals = await prisma.referral.findMany({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
            status: { in: ["ACCEPTED", "REJECTED", "COMPLETED"] },
        },
        select: {
            createdAt: true,
            updatedAt: true,
        },
    });

    let avgResponseTime = 0;
    if (terminalReferrals.length > 0) {
        const totalMs = terminalReferrals.reduce((acc, ref) => {
            return acc + (ref.updatedAt.getTime() - ref.createdAt.getTime());
        }, 0);
        avgResponseTime = totalMs / terminalReferrals.length / (1000 * 60 * 60); // in hours
    }

    // Hospital Performance
    const hospitals = await prisma.hospital.findMany({
        take: 5,
    });

    const performanceData = await Promise.all(hospitals.map(async (h) => {
        const received = await prisma.referral.count({ where: { toHospitalId: h.id } });
        const accepted = await prisma.referral.count({ where: { toHospitalId: h.id, status: "ACCEPTED" } });

        return {
            name: h.name,
            received,
            accepted,
            rate: received > 0 ? Math.round((accepted / received) * 100) : 0,
        };
    }));

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

    const acceptedCount = await prisma.referral.count({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
            status: "ACCEPTED",
        },
    });

    const rejectedReferrals = await prisma.referral.findMany({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
            status: "REJECTED",
            rejectionReason: { not: null },
        },
        select: { rejectionReason: true },
    });

    const rejectionCounts: Record<string, number> = {};
    rejectedReferrals.forEach(r => {
        const reason = r.rejectionReason || "Other";
        rejectionCounts[reason] = (rejectionCounts[reason] || 0) + 1;
    });

    const rejectionReasons = Object.entries(rejectionCounts).map(([name, value]) => ({
        name,
        value,
    }));

    return {
        metrics: {
            totalReferrals,
            emergencyCases,
            acceptanceRate: totalReferrals > 0 ? Math.round((acceptedCount / totalReferrals) * 100) : 0,
            responseTime: avgResponseTime > 0 ? `${avgResponseTime.toFixed(1)}h` : "N/A",
        },
        flowData,
        performanceData,
        rejectionReasons: rejectionReasons.length > 0 ? rejectionReasons : [
            { name: "No Data", value: 1 },
        ],
        bottlenecks: [
            { dept: "Cardiology", hospital: "City General", wait: "12.5 hrs", trend: "up" },
            { dept: "Neurology", hospital: "Central Medical", wait: "8.2 hrs", trend: "down" },
            { dept: "Orthopedics", hospital: "St. Mary's", wait: "6.8 hrs", trend: "stable" },
            { dept: "Oncology", hospital: "Memorial", wait: "5.5 hrs", trend: "up" },
        ],
    };
}
