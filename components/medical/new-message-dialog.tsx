"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Search,
    Send,
    Loader2,
    User,
    Stethoscope,
    Building2,
} from "lucide-react";
import { getAvailableStaff, startConversation } from "@/app/actions/messages";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StaffMember {
    id: string;
    name: string;
    role: string;
    department: string;
    hospital: string;
}

interface NewMessageDialogProps {
    existingConversationIds: string[];
}

export function NewMessageDialog({ existingConversationIds }: NewMessageDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"select" | "compose">("select");
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (open) {
            loadStaff();
        } else {
            // Reset state when dialog closes
            setStep("select");
            setSelectedStaff(null);
            setMessage("");
            setSearchQuery("");
        }
    }, [open]);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const staffList = await getAvailableStaff();
            setStaff(staffList);
        } catch (error) {
            toast.error("Failed to load staff members");
        } finally {
            setLoading(false);
        }
    };

    const filteredStaff = staff.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.hospital.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectStaff = (staffMember: StaffMember) => {
        setSelectedStaff(staffMember);
        setStep("compose");
    };

    const handleSendMessage = async () => {
        if (!selectedStaff || !message.trim()) return;

        setSending(true);
        try {
            await startConversation(selectedStaff.id, message);
            toast.success(`Message sent to ${selectedStaff.name}`);
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "DOCTOR":
                return <Stethoscope className="h-3 w-3" />;
            case "NURSE":
                return <User className="h-3 w-3" />;
            default:
                return null;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "DOCTOR":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "NURSE":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Message
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 border-b border-border/40">
                    <DialogTitle className="flex items-center gap-2">
                        {step === "select" ? (
                            <>
                                <User className="h-5 w-5 text-primary" />
                                Select Recipient
                            </>
                        ) : (
                            <>
                                <Send className="h-5 w-5 text-primary" />
                                Compose Message
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {step === "select" ? (
                    <div className="flex flex-col">
                        {/* Search */}
                        <div className="p-4 border-b border-border/40">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, department, or hospital..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* Staff List */}
                        <ScrollArea className="h-[350px]">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : filteredStaff.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                    <User className="h-12 w-12 text-muted-foreground mb-3" />
                                    <p className="text-sm text-muted-foreground">
                                        {searchQuery
                                            ? "No staff members found"
                                            : "No staff members available"}
                                    </p>
                                </div>
                            ) : (
                                <div className="p-2">
                                    {filteredStaff.map((staffMember) => {
                                        const hasExistingConvo = existingConversationIds.includes(
                                            staffMember.id
                                        );
                                        return (
                                            <button
                                                key={staffMember.id}
                                                onClick={() => handleSelectStaff(staffMember)}
                                                className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-muted/60 transition-colors text-left group"
                                            >
                                                <Avatar className="h-10 w-10 transition-transform group-hover:scale-105">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                                        {getInitials(staffMember.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-sm truncate">
                                                            {staffMember.name}
                                                        </p>
                                                        {hasExistingConvo && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-[10px] px-1.5 py-0"
                                                            >
                                                                Active
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Badge
                                                            variant="secondary"
                                                            className={cn(
                                                                "text-[10px] px-1.5 py-0 gap-1",
                                                                getRoleColor(staffMember.role)
                                                            )}
                                                        >
                                                            {getRoleIcon(staffMember.role)}
                                                            {staffMember.role}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {staffMember.department}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground/70">
                                                        <Building2 className="h-3 w-3" />
                                                        {staffMember.hospital}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        {/* Selected Recipient */}
                        {selectedStaff && (
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                        {getInitials(selectedStaff.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{selectedStaff.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{selectedStaff.role}</span>
                                        <span>•</span>
                                        <span>{selectedStaff.hospital}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setStep("select")}
                                    className="text-xs"
                                >
                                    Change
                                </Button>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="space-y-2">
                            <Textarea
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                className="resize-none"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Messages are encrypted and HIPAA compliant
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={sending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || sending}
                                className="gap-2"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

