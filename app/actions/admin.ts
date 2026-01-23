"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

const DEFAULT_PASSWORD = "Welcome123!";

// Get all hospitals (System Admin only)
export async function getAllHospitals() {
    const session = await getSession();
    if (!session || session.user.role !== "SYSTEM_ADMIN") {
        throw new Error("Unauthorized");
    }

    return await prisma.hospital.findMany({
        include: {
            _count: {
                select: {
                    users: true,
                    patients: true,
                    departments: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

// Create hospital with admin account
export async function createHospitalWithAdmin(data: {
    hospital: {
        name: string;
        type: "GENERAL" | "SPECIALTY" | "CLINIC" | "REHABILITATION";
        location: string;
        departments: string[];
        contactEmail: string;
        contactPhone: string;
    };
    admin: {
        name: string;
        email: string;
    };
}) {
    const session = await getSession();
    if (!session || session.user.role !== "SYSTEM_ADMIN") {
        throw new Error("Unauthorized");
    }

    // Check if admin email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.admin.email },
    });

    if (existingUser) {
        throw new Error("A user with this email already exists");
    }

    // Create hospital
    const hospital = await prisma.hospital.create({
        data: {
            name: data.hospital.name,
            type: data.hospital.type,
            location: data.hospital.location,
            specialties: data.hospital.departments, // Keep for backwards compatibility
            contactEmail: data.hospital.contactEmail,
            contactPhone: data.hospital.contactPhone,
            status: "CONNECTED",
        },
    });

    // Create Department records for each department
    if (data.hospital.departments.length > 0) {
        await prisma.department.createMany({
            data: data.hospital.departments.map((name) => ({
                name,
                hospitalId: hospital.id,
                status: "ACTIVE",
            })),
        });
    }

    // Create hospital admin account
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const admin = await prisma.user.create({
        data: {
            name: data.admin.name,
            email: data.admin.email,
            password: hashedPassword,
            role: "HOSPITAL_ADMIN",
            hospitalId: hospital.id,
            department: "Administration",
        },
    });

    revalidatePath("/admin/hospitals");
    return { hospital, admin, defaultPassword: DEFAULT_PASSWORD };
}

// Update hospital status
export async function updateHospitalStatus(
    hospitalId: string,
    status: "CONNECTED" | "PENDING" | "INACTIVE"
) {
    const session = await getSession();
    if (!session || session.user.role !== "SYSTEM_ADMIN") {
        throw new Error("Unauthorized");
    }

    const hospital = await prisma.hospital.update({
        where: { id: hospitalId },
        data: { status },
    });

    revalidatePath("/admin/hospitals");
    return hospital;
}

// Get system statistics
export async function getSystemStats() {
    const session = await getSession();
    if (!session || session.user.role !== "SYSTEM_ADMIN") {
        throw new Error("Unauthorized");
    }

    const [
        totalHospitals,
        connectedHospitals,
        totalUsers,
        totalPatients,
        totalReferrals,
        pendingReferrals,
    ] = await Promise.all([
        prisma.hospital.count(),
        prisma.hospital.count({ where: { status: "CONNECTED" } }),
        prisma.user.count(),
        prisma.patient.count(),
        prisma.referral.count(),
        prisma.referral.count({ where: { status: "SENT" } }),
    ]);

    return {
        totalHospitals,
        connectedHospitals,
        totalUsers,
        totalPatients,
        totalReferrals,
        pendingReferrals,
    };
}

// Get hospitals for public contact page (no auth required)
export async function getHospitalsForContact() {
    return await prisma.hospital.findMany({
        where: { status: "CONNECTED" },
        select: {
            id: true,
            name: true,
            type: true,
            location: true,
            contactEmail: true,
            contactPhone: true,
            specialties: true,
        },
        orderBy: { name: "asc" },
    });
}

// Get departments for current user's hospital
export async function getHospitalDepartments() {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;
    if (!hospitalId) {
        return [];
    }

    return await prisma.department.findMany({
        where: { hospitalId },
        orderBy: { name: "asc" },
    });
}

// Add department to hospital (Hospital Admin only)
export async function addDepartment(name: string) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;
    if (!hospitalId) {
        throw new Error("No hospital associated with this account");
    }

    const department = await prisma.department.create({
        data: {
            name,
            hospitalId,
            status: "ACTIVE",
        },
    });

    revalidatePath("/staff");
    return department;
}

// Delete department (Hospital Admin only)
export async function deleteDepartment(departmentId: string) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        throw new Error("Unauthorized");
    }

    await prisma.department.delete({
        where: { id: departmentId },
    });

    revalidatePath("/staff");
}

