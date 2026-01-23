"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function getTasks() {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    // Nurses only see tasks assigned to them
    // Doctors see all tasks
    const whereClause: any = {
        hospitalId: session.user.hospitalId,
    };

    if (session.user.role === "NURSE") {
        whereClause.assignedToId = session.user.id;
    }

    return await prisma.task.findMany({
        where: whereClause,
        include: {
            patient: true,
            assignedTo: true,
            assignedBy: {
                select: { name: true, role: true },
            },
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

export async function createTask(data: {
    title: string;
    description?: string;
    priority?: "NORMAL" | "URGENT" | "EMERGENCY";
    patientId?: string;
    assignedToId?: string;
    dueDate?: string;
}) {
    const session = await getSession();
    if (!session || (session.user.role !== "DOCTOR" && session.user.role !== "NURSE")) {
        throw new Error("Only doctors and nurses can create tasks");
    }

    // If nurse creates task, it's a self-assignment
    const assignedToId = data.assignedToId || (session.user.role === "NURSE" ? session.user.id : undefined);

    const task = await prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority || "NORMAL",
            patientId: data.patientId || undefined,
            assignedToId,
            assignedById: session.user.id,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            hospitalId: session.user.hospitalId!,
        },
    });

    await createAuditLog(session.user.id, "CREATE", "Task", `Created task: ${task.title}`);

    revalidatePath("/tasks");
    return task;
}
