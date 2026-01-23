"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { uploadDocument, deleteDocument as deleteCloudinaryDocument } from "@/lib/cloudinary";

const ALLOWED_ROLES = ["DOCTOR", "NURSE"];

export async function getPatientDocuments(patientId: string) {
    const session = await getSession();
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }

    return await prisma.medicalDocument.findMany({
        where: { patientId },
        include: {
            uploadedBy: {
                select: { name: true, role: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function uploadPatientDocument(
    patientId: string,
    formData: FormData
) {
    const session = await getSession();
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;

    if (!file || !title || !type) {
        throw new Error("Missing required fields");
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadDocument(buffer, file.name, `patients/${patientId}`);

    // Save to database
    const document = await prisma.medicalDocument.create({
        data: {
            patientId,
            title,
            type,
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            fileSize: result.bytes,
            uploadedById: session.user.id,
        },
    });

    await createAuditLog(
        session.user.id,
        "UPLOAD",
        "MedicalDocument",
        `Uploaded document "${title}" for patient ${patientId}`
    );

    revalidatePath(`/patients/${patientId}`);
    return document;
}

export async function deletePatientDocument(documentId: string) {
    const session = await getSession();
    if (!session || session.user.role !== "DOCTOR") {
        throw new Error("Only doctors can delete documents");
    }

    const document = await prisma.medicalDocument.findUnique({
        where: { id: documentId },
    });

    if (!document) {
        throw new Error("Document not found");
    }

    // Delete from Cloudinary
    await deleteCloudinaryDocument(document.cloudinaryPublicId);

    // Delete from database
    await prisma.medicalDocument.delete({
        where: { id: documentId },
    });

    await createAuditLog(
        session.user.id,
        "DELETE",
        "MedicalDocument",
        `Deleted document "${document.title}"`
    );

    revalidatePath(`/patients/${document.patientId}`);
}

export async function getDocumentsForReferral(patientId: string) {
    const session = await getSession();
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }

    return await prisma.medicalDocument.findMany({
        where: { patientId },
        select: {
            id: true,
            title: true,
            type: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getAllDocuments() {
    const session = await getSession();
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }

    const hospitalId = session.user.hospitalId;

    const documents = await prisma.medicalDocument.findMany({
        where: {
            patient: {
                hospitalId,
            },
        },
        include: {
            patient: {
                select: { id: true, name: true },
            },
            uploadedBy: {
                select: { name: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return documents.map(doc => ({
        id: doc.id,
        patientName: doc.patient.name,
        patientId: doc.patient.id,
        type: doc.type,
        title: doc.title,
        date: doc.createdAt.toISOString().split("T")[0],
        uploadedBy: doc.uploadedBy.name,
        size: doc.fileSize ? formatFileSize(doc.fileSize) : "Unknown",
        url: doc.cloudinaryUrl,
    }));
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

