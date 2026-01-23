import { getCurrentUser } from "@/app/actions/profile";
import { getHospitalDepartments } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const departments = await getHospitalDepartments();

    return (
        <SettingsClient
            user={{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                hospital: user.hospital,
            }}
            departments={departments}
        />
    );
}
