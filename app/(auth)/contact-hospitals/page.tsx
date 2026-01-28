import { getHospitalsForContact } from "@/app/actions/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  Search,
  Filter,
  User,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Hospital } from "@prisma/client";

interface HospitalWithType extends Omit<Hospital, "type"> {
  type: string;
  specialties: string[];
}

interface FilterState {
  search: string;
  type: string;
  hasSpecialties: boolean;
}

export default async function ContactHospitalsPage() {
  const hospitals =
    (await getHospitalsForContact()) as unknown as HospitalWithType[];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "GENERAL":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200";
      case "SPECIALTY":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200";
      case "CLINIC":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200";
      case "REHABILITATION":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "GENERAL":
        return "🏥";
      case "SPECIALTY":
        return "🎯";
      case "CLINIC":
        return "🏢";
      case "REHABILITATION":
        return "♿";
      default:
        return "🏥";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/login" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Request System Access
                </h1>
                <p className="text-muted-foreground">
                  Contact hospital administrators to request access to the
                  referral system
                </p>
              </div>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      How to Request Access
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      1. Find your hospital below
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      2. Contact the administrator
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      3. Wait for approval email
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-background">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Processing time: 2-3 business days
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hospital List */}
        <div className="space-y-6">
          {/* Search and Filter - Client Component would go here */}
          <div className="grid gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search hospitals by name, location, or specialty..."
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="SPECIALTY">Specialty</SelectItem>
                  <SelectItem value="CLINIC">Clinic</SelectItem>
                  <SelectItem value="REHABILITATION">Rehabilitation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hospitals.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No hospitals available
                </h3>
                <p className="text-muted-foreground">
                  Please check back later or contact system support.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {hospitals.map((hospital: HospitalWithType) => (
                <Card
                  key={hospital.id}
                  className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                          {getTypeIcon(hospital.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {hospital.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={`mt-1 ${getTypeColor(hospital.type)}`}
                          >
                            {hospital.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Hospital Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{hospital.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4 shrink-0" />
                          <a
                            href={`mailto:${hospital.contactEmail}`}
                            className="text-primary hover:underline truncate"
                          >
                            {hospital.contactEmail}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4 shrink-0" />
                          <a
                            href={`tel:${hospital.contactPhone}`}
                            className="text-primary hover:underline"
                          >
                            {hospital.contactPhone}
                          </a>
                        </div>
                      </div>

                      {/* Specialties */}
                      {hospital.specialties &&
                        hospital.specialties.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                              Specialties:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {hospital.specialties
                                .slice(0, 3)
                                .map((s: string) => (
                                  <Badge
                                    key={s}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {s}
                                  </Badge>
                                ))}
                              {hospital.specialties.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{hospital.specialties.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button asChild className="flex-1">
                          <a
                            href={`mailto:${hospital.contactEmail}?subject=Refero System Access Request&body=Dear Hospital Administrator,%0D%0A%0D%0AI would like to request access to the Refero Hospital Referral System.%0D%0A%0D%0APlease provide me with the necessary credentials and access permissions.%0D%0A%0D%0ABest regards,`}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Request Access
                          </a>
                        </Button>
                        <Button variant="outline" asChild className="flex-1">
                          <a href={`tel:${hospital.contactPhone}`}>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Now
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Information Section */}
        <Card className="mt-8 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Important Information
            </CardTitle>
            <CardDescription>
              What to include in your access request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Required Information</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-primary">1</span>
                    </div>
                    <span>Full name and professional title</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-primary">2</span>
                    </div>
                    <span>Department and role in the hospital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-primary">3</span>
                    </div>
                    <span>Employee ID or verification details</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">What Happens Next</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Administrator reviews your request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>You receive login credentials via email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Complete initial setup and training</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <div className="inline-block p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Having trouble reaching your hospital? Contact our support team at{" "}
              <a
                href="mailto:support@refero.health"
                className="text-primary font-medium hover:underline"
              >
                support@refero.health
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
