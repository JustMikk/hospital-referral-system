"use client";

import { useState } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Building2,
  MapPin,
  Phone,
  Users,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { hospitals } from "@/lib/mock-data";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Loading = () => null;

export default function HospitalsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      hospital.location.toLowerCase().includes(localSearchQuery.toLowerCase())
  );

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <PageHeader
          title="Partner Hospitals"
          description="View and manage hospital network connections"
        >
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Hospital
          </Button>
        </PageHeader>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-[400px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search hospitals..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHospitals.map((hospital) => (
            <Card
              key={hospital.id}
              className="group border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 bg-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary">
                        {hospital.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={
                          hospital.status === "Connected"
                            ? "bg-[#22C55E]/10 text-[#22C55E]"
                            : hospital.status === "Pending"
                              ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {hospital.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {hospital.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {hospital.contactPhone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {hospital.type}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {hospital.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {hospital.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{hospital.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Suspense>
  );
}
