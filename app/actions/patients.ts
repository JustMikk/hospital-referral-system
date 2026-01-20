"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
            referrals: {
                orderBy: { createdAt: "desc" },
            },
        },
    });
}

export async function createPatient(data: any) {
    const session = await getSession();
    if (!session || session.user.role !== "DOCTOR") {
        throw new Error("Only doctors can create patients");
    }

    const patient = await prisma.patient.create({
        data: {
            ...data,
            hospitalId: session.user.hospitalId,
            lastVisit: new Date(),
        },
    });

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
