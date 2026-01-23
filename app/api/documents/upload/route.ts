import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadDocument } from "@/lib/cloudinary";
import { createAuditLog } from "@/lib/audit";

const ALLOWED_ROLES = ["DOCTOR", "NURSE"];

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const type = formData.get("type") as string;
        const patientId = formData.get("patientId") as string;

        if (!file || !title || !type || !patientId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
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

        return NextResponse.json({ success: true, document });
    } catch (error: any) {
        console.error("Document upload error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload document" },
            { status: 500 }
        );
    }
}

