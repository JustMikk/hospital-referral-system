import { prisma } from "./prisma";

export async function createAuditLog(userId: string, action: string, resource: string, details?: string) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                resource,
                details,
            },
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
    }
}
