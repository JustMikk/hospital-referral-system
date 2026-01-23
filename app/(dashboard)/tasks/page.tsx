import { getTasks } from "@/app/actions/tasks";
import { getPatients } from "@/app/actions/patients";
import TasksClient from "./tasks-client";

export default async function TasksPage() {
    const [tasksData, patientsData] = await Promise.all([
        getTasks(),
        getPatients(),
    ]);

    // Map Prisma data to match frontend expectations
    const tasks = tasksData.map((t: any) => ({
        id: t.id,
        patient: t.patient?.name || "Unknown",
        room: t.patient?.roomNumber || "N/A",
        task: t.title,
        time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: t.status === "COMPLETED" ? "Completed" : "Pending",
        priority: t.priority === "EMERGENCY" ? "Emergency" : t.priority === "URGENT" ? "Urgent" : "Normal",
    }));

    const patients = patientsData.map(p => ({
        id: p.id,
        name: p.name,
    }));

    return <TasksClient initialTasks={tasks as any} patients={patients} />;
}
