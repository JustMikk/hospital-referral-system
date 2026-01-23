"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function getStaff() {
    const session = await getSession();
    if (!session || (session.user.role !== "HOSPITAL_ADMIN" && session.user.role !== "SYSTEM_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;

    return await prisma.user.findMany({
        where: {
            hospitalId,
        },
        orderBy: {
            name: "asc",
        },
    });
}

export async function inviteStaff(data: { name: string; email: string; role: string; department: string }) {
    const session = await getSession();
    if (!session || (session.user.role !== "HOSPITAL_ADMIN" && session.user.role !== "SYSTEM_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // In a real app, we would send an email. For now, we'll just create the user with a default password.
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            role: data.role as any,
            department: data.department,
            password: hashedPassword,
            hospitalId,
        },
    });

    await createAuditLog(session.user.id, "INVITE", "User", `Invited staff member: ${data.name} (${data.email})`);

    revalidatePath("/staff");
    return user;
}

export async function updateStaffRole(userId: string, role: string) {
    const session = await getSession();
    if (!session || (session.user.role !== "HOSPITAL_ADMIN" && session.user.role !== "SYSTEM_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { role: role as any },
    });

    await createAuditLog(session.user.id, "UPDATE", "User", `Updated role for ${user.name} to ${role}`);

    revalidatePath("/staff");
    return user;
}
