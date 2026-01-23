"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function getEmergencyAccessLogs() {
    const session = await getSession();
    if (!session || (session.user.role !== "HOSPITAL_ADMIN" && session.user.role !== "SYSTEM_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;

    const logs = await prisma.emergencyAccessLog.findMany({
        where: {
            user: {
                hospitalId,
            },
        },
        include: {
            user: {
                select: {
                    name: true,
                    role: true,
                },
            },
            patient: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            startTime: "desc",
        },
    });

    return logs.map(log => ({
        id: log.id,
        user: log.user.name,
        role: log.user.role,
        patient: `P-${log.patient.id.slice(0, 5).toUpperCase()} (${log.patient.name})`,
        reason: log.reason,
        time: log.startTime,
        duration: log.endTime
            ? `${Math.round((log.endTime.getTime() - log.startTime.getTime()) / 60000)} mins`
            : "Active",
        status: log.status,
    }));
}

export async function createEmergencyAccess(data: { patientId: string; reason: string }) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const log = await prisma.emergencyAccessLog.create({
        data: {
            userId: session.user.id,
            patientId: data.patientId,
            reason: data.reason,
        },
        include: {
            patient: {
                select: { name: true },
            },
        },
    });

    await createAuditLog(
        session.user.id,
        "EMERGENCY_ACCESS",
        "Patient",
        `Started emergency access to patient record: ${log.patient.name}. Reason: ${data.reason}`
    );

    revalidatePath("/emergency-access");
    return log;
}

export async function closeEmergencyAccess(id: string) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const log = await prisma.emergencyAccessLog.update({
        where: { id },
        data: {
            endTime: new Date(),
            status: "CLOSED",
        },
        include: {
            patient: {
                select: { name: true },
            },
        },
    });

    await createAuditLog(
        session.user.id,
        "CLOSE_EMERGENCY_ACCESS",
        "Patient",
        `Closed emergency access to patient record: ${log.patient.name}`
    );

    revalidatePath("/emergency-access");
    return log;
}

export async function getActiveEmergencySessionCount() {
    const session = await getSession();
    if (!session) {
        return 0;
    }

    const hospitalId = session.user.hospitalId;

    return await prisma.emergencyAccessLog.count({
        where: {
            user: {
                hospitalId,
            },
            status: "OPEN",
        },
    });
}
