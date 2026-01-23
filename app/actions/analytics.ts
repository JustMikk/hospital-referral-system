"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getAnalytics() {
    const session = await getSession();
    if (!session || !["HOSPITAL_ADMIN", "SYSTEM_ADMIN"].includes(session.user.role)) {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;
    const isSystemAdmin = session.user.role === "SYSTEM_ADMIN";

    // Build where clause based on role
    const hospitalFilter = isSystemAdmin ? {} : {
        OR: [
            { fromHospitalId: hospitalId },
            { toHospitalId: hospitalId },
        ],
    };

    // Total Referrals
    const totalReferrals = await prisma.referral.count({
        where: hospitalFilter,
    });

    // Emergency Cases
    const emergencyCases = await prisma.referral.count({
        where: {
            ...hospitalFilter,
            priority: "EMERGENCY",
        },
    });

    // Average Response Time
    const terminalReferrals = await prisma.referral.findMany({
        where: {
            ...hospitalFilter,
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
                ...hospitalFilter,
                createdAt: {
                    gte: start,
                    lt: end,
                },
            },
        });

        const emergency = await prisma.referral.count({
            where: {
                ...hospitalFilter,
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
            ...hospitalFilter,
            status: "ACCEPTED",
        },
    });

    const rejectedReferrals = await prisma.referral.findMany({
        where: {
            ...hospitalFilter,
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

    // Calculate bottlenecks based on pending referrals by department
    const pendingReferrals = await prisma.referral.findMany({
        where: {
            ...hospitalFilter,
            status: "SENT",
        },
        include: {
            toHospital: true,
            referringDoctor: true,
        },
    });

    const deptStats: Record<string, { hospital: string; totalWait: number; count: number }> = {};
    pendingReferrals.forEach(ref => {
        const dept = ref.referringDoctor.department || "General";
        const waitTime = Date.now() - ref.createdAt.getTime();
        if (!deptStats[dept]) {
            deptStats[dept] = { hospital: ref.toHospital.name, totalWait: 0, count: 0 };
        }
        deptStats[dept].totalWait += waitTime;
        deptStats[dept].count++;
    });

    const bottlenecks = Object.entries(deptStats)
        .map(([dept, stats]) => ({
            dept,
            hospital: stats.hospital,
            wait: `${(stats.totalWait / stats.count / (1000 * 60 * 60)).toFixed(1)} hrs`,
            trend: "stable" as const,
        }))
        .sort((a, b) => parseFloat(b.wait) - parseFloat(a.wait))
        .slice(0, 4);

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
        bottlenecks: bottlenecks.length > 0 ? bottlenecks : [
            { dept: "No pending referrals", hospital: "-", wait: "-", trend: "stable" },
        ],
    };
}
