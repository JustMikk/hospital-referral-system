"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function getTasks() {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    return await prisma.task.findMany({
        where: {
            hospitalId: session.user.hospitalId,
        },
        include: {
            patient: true,
            assignedTo: true,
        },
        orderBy: [
            { priority: "desc" },
            { createdAt: "desc" },
        ],
    });
}

export async function updateTaskStatus(id: string, status: "PENDING" | "COMPLETED") {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const task = await prisma.task.update({
        where: { id },
        data: {
            status,
            completedAt: status === "COMPLETED" ? new Date() : null,
        },
    });

    await createAuditLog(session.user.id, "UPDATE", "Task", `Updated task ${id} status to ${status}`);

    revalidatePath("/tasks");
    return task;
}

export async function createTask(data: any) {
    const session = await getSession();
    if (!session || (session.user.role !== "DOCTOR" && session.user.role !== "NURSE")) {
        throw new Error("Only doctors and nurses can create tasks");
    }

    const task = await prisma.task.create({
        data: {
            ...data,
            hospitalId: session.user.hospitalId,
        },
    });

    await createAuditLog(session.user.id, "CREATE", "Task", `Created task: ${task.title}`);

    revalidatePath("/tasks");
    return task;
}
