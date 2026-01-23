import { getStaff } from "@/app/actions/staff";
import StaffClient from "./staff-client";

export default async function StaffManagementPage() {
    const staff = await getStaff();

    return <StaffClient initialStaff={staff as any} />;
}
