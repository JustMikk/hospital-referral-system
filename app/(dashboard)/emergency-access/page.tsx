import { getEmergencyAccessLogs, getActiveEmergencySessionCount } from "@/app/actions/emergency-access";
import EmergencyAccessClient from "./emergency-access-client";

export default async function EmergencyAccessPage() {
    const logs = await getEmergencyAccessLogs();
    const activeCount = await getActiveEmergencySessionCount();

    return <EmergencyAccessClient initialLogs={logs as any} activeCount={activeCount} />;
}
