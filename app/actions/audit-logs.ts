"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getAuditLogs() {
    const session = await getSession();
    if (!session || (session.user.role !== "HOSPITAL_ADMIN" && session.user.role !== "SYSTEM_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;

    return await prisma.auditLog.findMany({
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
                    avatar: true,
                },
            },
        },
        orderBy: {
            timestamp: "desc",
        },
    });
}
