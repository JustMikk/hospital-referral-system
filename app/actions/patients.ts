"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";

export async function getPatients() {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const user = session.user;

    return await prisma.patient.findMany({
        where: {
            hospitalId: user.hospitalId,
        },
        include: {
            hospital: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}

export async function getPatientById(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    return await prisma.patient.findUnique({
        where: { id },
        include: {
            hospital: true,
            medicalRecords: {
                orderBy: { date: "desc" },
            },
            medicalDocuments: {
                include: {
                    uploadedBy: {
                        select: { name: true, role: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
            referrals: {
                orderBy: { createdAt: "desc" },
            },
        },
    });
}

export async function createPatient(data: {
    name: string;
    age: number;
    gender: "MALE" | "FEMALE" | "OTHER";
    email?: string;
    phone?: string;
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
}) {
    const session = await getSession();
    if (!session || !["DOCTOR", "NURSE"].includes(session.user.role)) {
        throw new Error("Only clinical staff can create patients");
    }

    const patient = await prisma.patient.create({
        data: {
            name: data.name,
            age: data.age,
            gender: data.gender,
            email: data.email || null,
            phone: data.phone || null,
            bloodType: data.bloodType || null,
            allergies: data.allergies || [],
            chronicConditions: data.chronicConditions || [],
            emergencyContactName: data.emergencyContactName || null,
            emergencyContactPhone: data.emergencyContactPhone || null,
            emergencyContactRelationship: data.emergencyContactRelationship || null,
            hospitalId: session.user.hospitalId,
            lastVisit: new Date(),
            status: "ACTIVE",
        },
    });

    await createAuditLog(session.user.id, "CREATE", "Patient", `Created patient ${patient.name}`);

    revalidatePath("/patients");
    return patient;
}

export async function updatePatient(id: string, data: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const patient = await prisma.patient.update({
        where: { id },
        data,
    });

    revalidatePath(`/patients/${id}`);
    return patient;
}
export async function createMedicalRecord(data: any) {
    const session = await getSession();
    if (!session || (session.user.role !== "DOCTOR" && session.user.role !== "NURSE")) {
        throw new Error("Only doctors and nurses can add medical records");
    }

    const { patientId, type, title, details, date } = data;

    const record = await prisma.medicalRecord.create({
        data: {
            patientId,
            type,
            title,
            details,
            date: date ? new Date(date) : new Date(),
            doctorId: session.user.id,
            hospitalId: session.user.hospitalId,
        },
    });

    await createAuditLog(session.user.id, "CREATE", "MedicalRecord", `Added ${type} for patient ${patientId}`);

    revalidatePath(`/patients/${patientId}`);
    return record;
}
