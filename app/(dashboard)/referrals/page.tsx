"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, FileText, ArrowUpRight } from "lucide-react";
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
import { StatusBadge } from "@/components/medical/status-badge";
import { EmptyState } from "@/components/medical/empty-state";
import { referrals } from "@/lib/mock-data";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default function ReferralsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredReferrals = referrals.filter((referral) => {
    const matchesSearch =
      referral.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.fromHospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.toHospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || referral.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || referral.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <PageHeader
          title="Referrals"
          description="Manage patient referrals between hospitals"
        >
          <Button asChild>
            <Link href="/referrals/create">
              <Plus className="mr-2 h-4 w-4" />
              New Referral
            </Link>
          </Button>
        </PageHeader>

        {/* Filters */}
        <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search referrals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        {filteredReferrals.length === 0 ? (
          <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
            <CardContent className="py-12">
              <EmptyState
                icon={FileText}
                title="No referrals found"
                description="Try adjusting your search or filter criteria, or create a new referral."
                action={{
                  label: "Create Referral",
                  onClick: () => {},
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredReferrals.map((referral) => (
              <Link
                key={referral.id}
                href={`/referrals/${referral.id}`}
                className="group"
              >
                <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">
                            {referral.patientName}
                          </h3>
                          <StatusBadge status={referral.priority} size="sm" />
                          <span className="text-xs text-muted-foreground">
                            {referral.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{referral.fromHospital}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          <span>{referral.toHospital}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {referral.reason}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>From: {referral.referringDoctor}</span>
                          <span>To: {referral.receivingDoctor}</span>
                          <span>
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={referral.status} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}
