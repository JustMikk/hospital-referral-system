import { getTasks } from "@/app/actions/tasks";
import TasksClient from "./tasks-client";

export default async function TasksPage() {
    const tasksData = await getTasks();

    // Map Prisma data to match frontend expectations
    const tasks = tasksData.map((t: any) => ({
        id: t.id,
        patient: t.patient?.name || "Unknown",
        room: t.patient?.roomNumber || "N/A",
        task: t.title,
        time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: t.status === "COMPLETED" ? "Completed" : "Pending",
        priority: (t.priority as string) === "HIGH" ? "High" : "Normal",
    }));

    return <TasksClient initialTasks={tasks as any} />;
}
