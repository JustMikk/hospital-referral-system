import { getConversations } from "@/app/actions/messages";
import { getSession } from "@/lib/auth";
import MessagesClient from "./messages-client";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    // Only DOCTOR and NURSE can access messaging
    if (session.user.role !== "DOCTOR" && session.user.role !== "NURSE") {
        redirect("/dashboard");
    }

    const conversations = await getConversations();

    return (
        <MessagesClient
            initialConversations={conversations as any}
            currentUserId={session.user.id}
        />
    );
}
