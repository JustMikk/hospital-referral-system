import { getAllDocuments } from "@/app/actions/documents";
import RecordsClient from "./records-client";

export default async function RecordsPage() {
    const documents = await getAllDocuments();

    return <RecordsClient documents={documents} />;
}
