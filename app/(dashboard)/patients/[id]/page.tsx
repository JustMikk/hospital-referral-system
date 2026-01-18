"use client";

import { useState } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Activity,
  AlertTriangle,
  FileText,
  Pill,
  Stethoscope,
  Clock,
  ShieldAlert,
  ChevronRight,
  Plus,
  History,
  User
} from "lucide-react";
import { patients } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

// Mock data extensions for the profile
const medicalHistory = [
  { date: "2024-03-10", diagnosis: "Acute Bronchitis", doctor: "Dr. Wilson", hospital: "General Hospital" },
  { date: "2023-11-15", diagnosis: "Hypertension (Stage 1)", doctor: "Dr. Chen", hospital: "City Clinic" },
];

const medications = [
  { name: "Amoxicillin", dosage: "500mg", freq: "3x daily", status: "Active", prescribed: "2024-03-10" },
  { name: "Lisinopril", dosage: "10mg", freq: "1x daily", status: "Active", prescribed: "2023-11-15" },
];

const labResults = [
  { name: "Complete Blood Count", date: "2024-03-10", status: "Normal" },
  { name: "Lipid Panel", date: "2023-11-15", status: "Abnormal" },
];

export default function PatientProfilePage({ params }: { params: { id: string } }) {
  // In a real app, fetch patient by ID
  const patient = patients.find(p => p.id === params.id) || patients[0]; // Fallback for demo

  if (!patient) return notFound();

  return (
    <div className="space-y-6">
      {/* Header - Always Visible */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`} />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{patient.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>{patient.age} yrs</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span>ID: {patient.id}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="gap-1">
                <Building2Icon className="h-3 w-3" />
                {patient.hospital}
              </Badge>
              {patient.status === "Critical" && (
                <Badge variant="destructive" className="animate-pulse gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Critical Status
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            View History
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Critical Alerts - Never Hidden */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Allergies</AlertTitle>
          <AlertDescription>Penicillin (Severe), Peanuts (Mild)</AlertDescription>
        </Alert>
        <Alert className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30">
          <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">Chronic Conditions</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-500">Asthma, Type 2 Diabetes</AlertDescription>
        </Alert>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
          >
            Medical History
          </TabsTrigger>
          <TabsTrigger
            value="medications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
          >
            Medications
          </TabsTrigger>
          <TabsTrigger
            value="labs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
          >
            Lab Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Active Diagnoses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicalHistory.slice(0, 1).map((item, i) => (
                  <div key={i} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.diagnosis}</p>
                      <p className="text-sm text-muted-foreground">Diagnosed by {item.doctor}</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((med, i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{med.name} {med.dosage}</p>
                      <p className="text-xs text-muted-foreground">{med.freq}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{med.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {medicalHistory.map((item, i) => (
                <div key={i} className="flex items-center p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                    <History className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.diagnosis}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.hospital}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="mt-6">
          {/* Reusing similar structure or detailed table */}
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-sm">Detailed medication history would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {labResults.map((lab, i) => (
                <div key={i} className="flex items-center p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{lab.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{lab.date}</span>
                    </div>
                  </div>
                  <Badge variant={lab.status === "Normal" ? "secondary" : "destructive"}>
                    {lab.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Building2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}
