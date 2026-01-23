"use client";

import { useState } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  FileText,
  Download,
  Eye,
  MoreVertical,
  Upload,
  Filter,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading"; // Import the Loading component

const medicalRecords = [
  {
    id: "REC001",
    patientName: "John Smith",
    patientId: "PT001",
    type: "Lab Report",
    date: "2024-01-15",
    uploadedBy: "Dr. Sarah Chen",
    size: "2.4 MB",
    status: "verified",
  },
  {
    id: "REC002",
    patientName: "Maria Garcia",
    patientId: "PT002",
    type: "MRI Scan",
    date: "2024-01-14",
    uploadedBy: "Dr. Michael Brown",
    size: "15.8 MB",
    status: "pending",
  },
  {
    id: "REC003",
    patientName: "Robert Johnson",
    patientId: "PT003",
    type: "X-Ray",
    date: "2024-01-13",
    uploadedBy: "Dr. Emily Davis",
    size: "8.2 MB",
    status: "verified",
  },
  {
    id: "REC004",
    patientName: "Sarah Williams",
    patientId: "PT004",
    type: "Blood Test",
    date: "2024-01-12",
    uploadedBy: "Dr. Sarah Chen",
    size: "1.1 MB",
    status: "verified",
  },
  {
    id: "REC005",
    patientName: "James Brown",
    patientId: "PT005",
    type: "CT Scan",
    date: "2024-01-11",
    uploadedBy: "Dr. Michael Brown",
    size: "22.5 MB",
    status: "pending",
  },
];

export default function RecordsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("query") || ""; // Use searchParams to get the query

  const filteredRecords = medicalRecords.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Suspense fallback={<Loading />}> {/* Wrap the component in a Suspense boundary */}
      <div className="space-y-6">
        <PageHeader
          title="Medical Records"
          description="Access and manage patient medical records securely"
        >
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Record
          </Button>
        </PageHeader>

        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground">
                All Records
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-[300px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => {
                      // Update the search query in the URL
                      window.history.pushState({}, "", `?query=${e.target.value}`);
                    }}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Record ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {record.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-card-foreground">
                            {record.patientName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {record.patientId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.uploadedBy}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.size}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={record.status === "verified" ? "default" : "secondary"}
                          className={
                            record.status === "verified"
                              ? "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20"
                              : "bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20"
                          }
                        >
                          {record.status === "verified" ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Record
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Download className="h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
