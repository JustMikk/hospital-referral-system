import { getAllHospitals } from "@/app/actions/admin";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import HospitalsClient from "./hospitals-client";

export default async function HospitalManagementPage() {
    const session = await getSession();
    if (!session || session.user.role !== "SYSTEM_ADMIN") {
        redirect("/login");
    }

    const hospitals = await getAllHospitals();

    return <HospitalsClient initialHospitals={hospitals} />;
}
