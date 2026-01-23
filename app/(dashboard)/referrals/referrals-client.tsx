"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, FileText, ArrowUpRight, ArrowDownLeft, Clock, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/medical/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/medical/status-badge";
import { EmptyState } from "@/components/medical/empty-state";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { updateReferralStatus } from "@/app/actions/referrals";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Referral {
    id: string;
    patientName: string;
    fromHospital: string;
    toHospital: string;
    referringDoctor: string;
    receivingDoctor: string;
    status: string;
    priority: string;
    reason: string;
    createdAt: string;
}

interface ReferralsClientProps {
    initialIncoming: Referral[];
    initialOutgoing: Referral[];
}

export default function ReferralsClient({ initialIncoming, initialOutgoing }: ReferralsClientProps) {
    const { userRole } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [activeTab, setActiveTab] = useState("outgoing");

    const currentList = activeTab === "incoming" ? initialIncoming : initialOutgoing;

    const filteredReferrals = currentList.filter((referral) => {
        const matchesSearch =
            referral.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            referral.fromHospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
            referral.toHospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
            referral.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || referral.status.toLowerCase() === statusFilter.toLowerCase();

        const matchesPriority =
            priorityFilter === "all" || referral.priority.toLowerCase() === priorityFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <PageHeader
                    title="Referrals"
                    description="Manage patient transfers and incoming cases"
                />
                {userRole !== "nurse" && (
                    <Button asChild className="shrink-0">
                        <Link href="/referrals/create">
                            <Plus className="mr-2 h-4 w-4" />
                            New Referral
                        </Link>
                    </Button>
                )}
            </div>

            <Tabs defaultValue="incoming" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                    <TabsTrigger value="incoming" className="gap-2">
                        <ArrowDownLeft className="h-4 w-4" />
                        Incoming (Inbox)
                        <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {initialIncoming.filter(r => r.status === "SENT").length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="outgoing" className="gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        Outgoing (Sent)
                    </TabsTrigger>
                </TabsList>

                {/* Filters */}
                <Card className="shadow-sm border-border/40 bg-background/50 backdrop-blur-sm mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                                <Input
                                    placeholder="Search referrals..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-40 bg-background/50 border-border/50 focus:ring-primary/20">
                                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="SENT">Sent</SelectItem>
                                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-full sm:w-40 bg-background/50 border-border/50 focus:ring-primary/20">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priority</SelectItem>
                                    <SelectItem value="NORMAL">Normal</SelectItem>
                                    <SelectItem value="URGENT">Urgent</SelectItem>
                                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <TabsContent value="incoming" className="mt-0">
                    <ReferralList referrals={filteredReferrals} type="incoming" />
                </TabsContent>

                <TabsContent value="outgoing" className="mt-0">
                    <ReferralList referrals={filteredReferrals} type="outgoing" />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ReferralList({ referrals, type }: { referrals: any[], type: "incoming" | "outgoing" }) {
    const router = useRouter();
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleAccept = async (e: React.MouseEvent, referralId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setProcessingId(referralId);
        try {
            await updateReferralStatus(referralId, "ACCEPTED");
            toast.success("Referral accepted successfully");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to accept referral");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (e: React.MouseEvent, referralId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setProcessingId(referralId);
        try {
            await updateReferralStatus(referralId, "REJECTED");
            toast.success("Referral rejected");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to reject referral");
        } finally {
            setProcessingId(null);
        }
    };

    const sortedReferrals = [...referrals].sort((a, b) => {
        // Priority sorting
        const priorityOrder = { EMERGENCY: 0, URGENT: 1, NORMAL: 2 };
        const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];

        if (priorityDiff !== 0) return priorityDiff;

        // Date sorting (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (sortedReferrals.length === 0) {
        return (
            <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
                <CardContent className="py-12">
                    <EmptyState
                        icon={FileText}
                        title={`No ${type} referrals found`}
                        description="Try adjusting your search or filter criteria."
                        action={type === "outgoing" ? {
                            label: "Create Referral",
                            onClick: () => window.location.href = "/referrals/create",
                        } : undefined}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {sortedReferrals.map((referral) => (
                <Link
                    key={referral.id}
                    href={`/referrals/${referral.id}`}
                    className="group block"
                >
                    <Card className={cn(
                        "transition-all duration-200 hover:shadow-md border-border/40",
                        referral.priority === "EMERGENCY"
                            ? "border-l-4 border-l-red-500 bg-red-50/10 dark:bg-red-900/10"
                            : "hover:-translate-y-0.5"
                    )}>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                                            {referral.patientName}
                                            {referral.priority === "EMERGENCY" && (
                                                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                            )}
                                        </h3>
                                        <StatusBadge status={referral.priority} size="sm" />
                                        <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">
                                            {referral.id.slice(0, 8)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        {type === "incoming" ? (
                                            <>
                                                <span className="font-medium text-foreground/80">From: {referral.fromHospital}</span>
                                                <span className="text-muted-foreground/50">•</span>
                                                <span>{referral.referringDoctor}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-medium text-foreground/80">To: {referral.toHospital}</span>
                                                <span className="text-muted-foreground/50">•</span>
                                                <span>{referral.receivingDoctor}</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {referral.reason}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(referral.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <StatusBadge status={referral.status} />

                                    {/* Quick Actions for Incoming Pending Referrals */}
                                    {type === "incoming" && referral.status === "SENT" && (
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                onClick={(e) => handleReject(e, referral.id)}
                                                disabled={processingId === referral.id}
                                            >
                                                {processingId === referral.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={(e) => handleAccept(e, referral.id)}
                                                disabled={processingId === referral.id}
                                            >
                                                {processingId === referral.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
