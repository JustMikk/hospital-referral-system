"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            hospital: {
                select: { name: true },
            },
        },
    });

    return user;
}

export async function updateProfile(data: {
    name: string;
    department?: string;
}) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: data.name,
            department: data.department,
        },
    });

    revalidatePath("/settings");
    return user;
}

export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
}) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    // Get current user with password
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Verify current password
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
        throw new Error("Current password is incorrect");
    }

    // Validate new password
    if (data.newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters");
    }

    // Hash and update
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
    });

    revalidatePath("/settings");
    return { success: true };
}

