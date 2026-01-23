import { getStaff } from "@/app/actions/staff";
import { getHospitalDepartments } from "@/app/actions/admin";
import StaffClient from "./staff-client";

export default async function StaffManagementPage() {
    const [staff, departments] = await Promise.all([
        getStaff(),
        getHospitalDepartments(),
    ]);

    return <StaffClient initialStaff={staff as any} departments={departments} />;
}
