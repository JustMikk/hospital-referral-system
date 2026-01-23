import { getHospitalsForContact } from "@/app/actions/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    MapPin,
    Stethoscope,
} from "lucide-react";

export default async function ContactHospitalsPage() {
    const hospitals = await getHospitalsForContact();

    const getTypeColor = (type: string) => {
        switch (type) {
            case "GENERAL":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "SPECIALTY":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
            case "CLINIC":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "REHABILITATION":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/login" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Login
                        </Link>
                    </Button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                            <Stethoscope className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Contact a Hospital
                            </h1>
                            <p className="text-muted-foreground">
                                Reach out to request system access
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hospital List */}
                <div className="space-y-4">
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
                        hospitals.map((hospital) => (
                            <Card
                                key={hospital.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <Building2 className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {hospital.name}
                                                    </h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className={getTypeColor(hospital.type)}
                                                    >
                                                        {hospital.type}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="grid gap-2 mt-4 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    <span>{hospital.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="h-4 w-4 shrink-0" />
                                                    <a
                                                        href={`mailto:${hospital.contactEmail}`}
                                                        className="text-primary hover:underline"
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

                                            {hospital.specialties.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-4">
                                                    {hospital.specialties.slice(0, 4).map((s) => (
                                                        <Badge
                                                            key={s}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {s}
                                                        </Badge>
                                                    ))}
                                                    {hospital.specialties.length > 4 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{hospital.specialties.length - 4} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 md:items-end">
                                            <Button asChild>
                                                <a href={`mailto:${hospital.contactEmail}?subject=Access Request for Refero System`}>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Request Access
                                                </a>
                                            </Button>
                                            <Button variant="outline" asChild>
                                                <a href={`tel:${hospital.contactPhone}`}>
                                                    <Phone className="mr-2 h-4 w-4" />
                                                    Call
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>
                        Need help? Contact{" "}
                        <a href="mailto:support@refero.health" className="text-primary hover:underline">
                            support@refero.health
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

