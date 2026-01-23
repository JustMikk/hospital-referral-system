import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ user: null });
    }

    // Fetch full user details including hospital name
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            hospital: {
                select: { name: true },
            },
        },
    });

    if (!user) {
        return NextResponse.json({ user: null });
    }

    return NextResponse.json({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            hospital: user.hospital?.name || "N/A",
            department: user.department,
        },
    });
}
