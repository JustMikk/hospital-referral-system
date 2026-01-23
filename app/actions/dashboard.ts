"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getDashboardData() {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const hospitalId = session.user.hospitalId;

    // Total Patients
    const totalPatients = await prisma.patient.count({
        where: { hospitalId },
    });

    // Active Referrals (SENT, PENDING)
    const activeReferrals = await prisma.referral.count({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
            status: { in: ["SENT", "ACCEPTED"] },
        },
    });

    // Pending Reviews (Incoming referrals that are SENT)
    const pendingReviews = await prisma.referral.count({
        where: {
            toHospitalId: hospitalId,
            status: "SENT",
        },
    });

    // Emergency Alerts (Emergency referrals in the last 24h)
    const emergencyAlerts = await prisma.referral.count({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
            priority: "EMERGENCY",
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
        },
    });

    // Recent Referrals
    const recentReferrals = await prisma.referral.findMany({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
        },
        include: {
            patient: true,
            fromHospital: true,
            toHospital: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    // Staff Count (for admin)
    const staffCount = await prisma.user.count({
        where: { hospitalId },
    });

    // Recent Activity (Audit Logs)
    const recentActivity = await prisma.auditLog.findMany({
        where: {
            user: {
                hospitalId,
            },
        },
        include: {
            user: true,
        },
        orderBy: { timestamp: "desc" },
        take: 5,
    });

    // Data for Chart (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const patients = await prisma.patient.findMany({
        where: {
            hospitalId,
            createdAt: { gte: sixMonthsAgo },
        },
        select: { createdAt: true },
    });

    const referrals = await prisma.referral.findMany({
        where: {
            OR: [
                { fromHospitalId: hospitalId },
                { toHospitalId: hospitalId },
            ],
            createdAt: { gte: sixMonthsAgo },
        },
        select: { createdAt: true },
    });

    // Today's Appointments
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
        where: {
            doctorId: session.user.id,
            time: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            patient: true,
        },
        orderBy: { time: "asc" },
    });

    return {
        metrics: {
            totalPatients,
            activeReferrals,
            pendingReviews,
            emergencyAlerts,
        },
        recentReferrals: recentReferrals.map(r => ({
            id: r.id,
            patientName: r.patient.name,
            fromHospital: r.fromHospital.name,
            toHospital: r.toHospital.name,
            status: r.status,
            priority: r.priority,
            createdAt: r.createdAt.toISOString(),
        })),
        recentActivity: recentActivity.map(a => ({
            id: a.id,
            user: a.user.name,
            action: a.action,
            resource: a.resource,
            timestamp: a.timestamp.toISOString(),
        })),
        appointments: appointments.map((a: any) => ({
            id: a.id,
            patientName: a.patient.name,
            time: a.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: a.type,
            status: a.status === "SCHEDULED" ? "Scheduled" : a.status === "IN_PROGRESS" ? "In Progress" : a.status === "COMPLETED" ? "Completed" : "Cancelled",
        })),
        staffCount,
        chartData: generateChartData(patients, referrals),
    };
}

function generateChartData(patients: { createdAt: Date }[], referrals: { createdAt: Date }[]) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months: { month: string, monthIndex: number, year: number, patients: number, referrals: number }[] = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        last6Months.push({
            month: months[d.getMonth()],
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            patients: 0,
            referrals: 0,
        });
    }

    patients.forEach(p => {
        const d = new Date(p.createdAt);
        const monthData = last6Months.find(m => m.monthIndex === d.getMonth() && m.year === d.getFullYear());
        if (monthData) monthData.patients++;
    });

    referrals.forEach(r => {
        const d = new Date(r.createdAt);
        const monthData = last6Months.find(m => m.monthIndex === d.getMonth() && m.year === d.getFullYear());
        if (monthData) monthData.referrals++;
    });

    return last6Months.map(({ month, patients, referrals }) => ({ month, patients, referrals }));
}
