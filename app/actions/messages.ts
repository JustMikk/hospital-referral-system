"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const ALLOWED_ROLES = ["DOCTOR", "NURSE"];

// Get staff members available for messaging (doctors and nurses, excluding current user)
export async function getAvailableStaff() {
    const session = await getSession();
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }

    const staff = await prisma.user.findMany({
        where: {
            role: { in: ["DOCTOR", "NURSE"] },
            id: { not: session.user.id },
        },
        select: {
            id: true,
            name: true,
            role: true,
            department: true,
            hospital: {
                select: { name: true },
            },
        },
        orderBy: [
            { hospital: { name: "asc" } },
            { name: "asc" },
        ],
    });

    return staff.map((s) => ({
        id: s.id,
        name: s.name,
        role: s.role,
        department: s.department || "General",
        hospital: s.hospital?.name || "Unknown Hospital",
    }));
}

// Start a new conversation or send to existing one
export async function startConversation(receiverId: string, content: string) {
    const session = await getSession();
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }

    // Verify the receiver exists and is allowed to receive messages
    const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { id: true, role: true },
    });

    if (!receiver || !ALLOWED_ROLES.includes(receiver.role)) {
        throw new Error("Invalid recipient");
    }

    const message = await prisma.message.create({
        data: {
            senderId: session.user.id,
            receiverId,
            content,
        },
    });

    revalidatePath("/messages");
    return message;
}

export async function getConversations() {
    const session = await getSession();
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        throw new Error("Unauthorized: Messaging is restricted to clinical staff.");
    }

    const userId = session.user.id;

    // Fetch all messages where the user is sender or receiver
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: userId },
                { receiverId: userId },
            ],
        },
        include: {
            sender: {
                select: { id: true, name: true, role: true, hospital: { select: { name: true } } },
            },
            receiver: {
                select: { id: true, name: true, role: true, hospital: { select: { name: true } } },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach((msg) => {
        const isSender = msg.senderId === userId;
        const partner = isSender ? msg.receiver : msg.sender;
        const partnerId = partner.id;

        if (!conversationsMap.has(partnerId)) {
            conversationsMap.set(partnerId, {
                id: partnerId, // Using partner ID as conversation ID for simplicity
                participantName: partner.name,
                participantRole: partner.role,
                participantHospital: partner.hospital?.name || "Unknown Hospital",
                lastMessage: msg.content,
                lastMessageTime: msg.createdAt,
                unreadCount: 0,
                messages: [],
            });
        }

        const conversation = conversationsMap.get(partnerId);
        conversation.messages.push({
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            senderName: msg.sender.name,
            timestamp: msg.createdAt,
            read: msg.read,
        });

        if (!isSender && !msg.read) {
            conversation.unreadCount++;
        }
    });

    // Sort messages within conversations
    conversationsMap.forEach((conv) => {
        conv.messages.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });

    return Array.from(conversationsMap.values());
}

export async function sendMessage(receiverId: string, content: string) {
    const session = await getSession();
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }

    const message = await prisma.message.create({
        data: {
            senderId: session.user.id,
            receiverId,
            content,
        },
    });

    revalidatePath("/messages");
    return message;
}

export async function markMessagesAsRead(senderId: string) {
    const session = await getSession();
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        throw new Error("Unauthorized");
    }

    await prisma.message.updateMany({
        where: {
            senderId: senderId,
            receiverId: session.user.id,
            read: false,
        },
        data: {
            read: true,
        },
    });

    revalidatePath("/messages");
}
