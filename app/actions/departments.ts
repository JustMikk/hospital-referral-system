"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function getDepartments() {
    const session = await getSession();
    if (!session || (session.user.role !== "HOSPITAL_ADMIN" && session.user.role !== "SYSTEM_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;

    const departments = await prisma.department.findMany({
        where: {
            hospitalId,
        },
        include: {
            head: {
                select: {
                    name: true,
                },
            },
            _count: {
                select: {
                    users: true,
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });

    return departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        status: dept.status,
        head: dept.head?.name || "Vacant",
        staffCount: dept._count.users,
    }));
}

export async function createDepartment(data: { name: string }) {
    const session = await getSession();
    if (!session || (session.user.role !== "HOSPITAL_ADMIN" && session.user.role !== "SYSTEM_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;

    const department = await prisma.department.create({
        data: {
            name: data.name,
            hospitalId: hospitalId!,
        },
    });

    await createAuditLog(session.user.id, "CREATE", "Department", `Created department: ${data.name}`);

    revalidatePath("/departments");
    return department;
}

export async function updateDepartment(id: string, data: { name?: string; status?: string }) {
    const session = await getSession();
    if (!session || (session.user.role !== "HOSPITAL_ADMIN" && session.user.role !== "SYSTEM_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const department = await prisma.department.update({
        where: { id },
        data,
    });

    await createAuditLog(session.user.id, "UPDATE", "Department", `Updated department: ${department.name}`);

    revalidatePath("/departments");
    return department;
}

export async function toggleDepartmentStatus(id: string) {
    const session = await getSession();
    if (!session || (session.user.role !== "HOSPITAL_ADMIN" && session.user.role !== "SYSTEM_ADMIN")) {
        throw new Error("Unauthorized");
    }

    const dept = await prisma.department.findUnique({
        where: { id },
        include: {
            _count: {
                select: { users: true },
            },
        },
    });

    if (!dept) {
        throw new Error("Department not found");
    }

    // Prevent disabling if staff count > 0
    if (dept._count.users > 0 && dept.status === "ACTIVE") {
        throw new Error("Cannot disable department with active staff. Reassign staff first.");
    }

    const newStatus = dept.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const updated = await prisma.department.update({
        where: { id },
        data: { status: newStatus },
    });

    await createAuditLog(session.user.id, "UPDATE", "Department", `${newStatus === "ACTIVE" ? "Enabled" : "Disabled"} department: ${dept.name}`);

    revalidatePath("/departments");
    return updated;
}
