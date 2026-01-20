import { getAnalytics } from "@/app/actions/analytics";
import AnalyticsClient from "./analytics-client";

export default async function AnalyticsPage() {
    const data = await getAnalytics();

    return <AnalyticsClient initialData={data as any} />;
}
