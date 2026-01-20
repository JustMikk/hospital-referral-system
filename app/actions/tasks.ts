"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/tasks");
    return task;
}

export async function createTask(data: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const task = await prisma.task.create({
        data: {
            ...data,
            hospitalId: session.user.hospitalId,
        },
    });

    revalidatePath("/tasks");
    return task;
}
