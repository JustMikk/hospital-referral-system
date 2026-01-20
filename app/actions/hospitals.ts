"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getHospitals() {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    return await prisma.hospital.findMany({
        where: {
            status: "CONNECTED",
        },
        orderBy: {
            name: "asc",
        },
    });
}

export async function getHospitalById(id: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    return await prisma.hospital.findUnique({
        where: { id },
    });
}
