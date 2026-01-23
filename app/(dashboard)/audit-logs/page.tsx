import { getAuditLogs } from "@/app/actions/audit-logs";
import AuditLogsClient from "./audit-logs-client";

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return <AuditLogsClient initialLogs={logs as any} />;
}
