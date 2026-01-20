import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Activity,
  AlertTriangle,
  FileText,
  Pill,
  Stethoscope,
  ShieldAlert,
  Plus,
  History,
} from "lucide-react";
import { getPatientById } from "@/app/actions/patients";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientById(id);

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
                {patient.hospital.name}
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
          <AlertDescription>
            {patient.allergies.length > 0 ? patient.allergies.join(", ") : "None reported"}
          </AlertDescription>
        </Alert>
        <Alert className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30">
          <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">Chronic Conditions</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-500">
            {patient.chronicConditions.length > 0 ? patient.chronicConditions.join(", ") : "None reported"}
          </AlertDescription>
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
                {patient.medicalRecords.filter(r => r.type === "Diagnosis").slice(0, 3).map((item, i) => (
                  <div key={i} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.details}</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                ))}
                {patient.medicalRecords.filter(r => r.type === "Diagnosis").length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No active diagnoses found.</p>
                )}
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
                {patient.medicalRecords.filter(r => r.type === "Prescription").map((med, i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{med.title}</p>
                      <p className="text-xs text-muted-foreground">{med.details}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                ))}
                {patient.medicalRecords.filter(r => r.type === "Prescription").length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No active medications found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {patient.medicalRecords.map((item, i) => (
                <div key={i} className="flex items-center p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                    <History className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{item.type}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              ))}
              {patient.medicalRecords.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No medical history found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {patient.medicalRecords.filter(r => r.type === "Prescription").map((med, i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{med.title}</p>
                      <p className="text-sm text-muted-foreground">{med.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">Prescribed on {new Date(med.date).toLocaleDateString()}</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                ))}
                {patient.medicalRecords.filter(r => r.type === "Prescription").length === 0 && (
                  <p className="text-muted-foreground text-sm italic">No medications found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {patient.medicalRecords.filter(r => r.type === "Lab Result").map((lab, i) => (
                <div key={i} className="flex items-center p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{lab.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{new Date(lab.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Normal</Badge>
                </div>
              ))}
              {patient.medicalRecords.filter(r => r.type === "Lab Result").length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No lab results found.</p>
                </div>
              )}
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
