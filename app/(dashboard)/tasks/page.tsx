import { getTasks } from "@/app/actions/tasks";
import { getPatients } from "@/app/actions/patients";
import { getNursesForAssignment } from "@/app/actions/staff";
import TasksClient from "./tasks-client";
import { getSession } from "@/lib/auth";

export default async function TasksPage() {
    const session = await getSession();
    const isDoctor = session?.user.role === "DOCTOR";

    const [tasksData, patientsData, nursesData] = await Promise.all([
        getTasks(),
        getPatients(),
        isDoctor ? getNursesForAssignment() : Promise.resolve([]),
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
        assignedTo: t.assignedTo?.name || null,
        assignedBy: t.assignedBy?.name || null,
    }));

    const patients = patientsData.map(p => ({
        id: p.id,
        name: p.name,
    }));

    const nurses = nursesData.map(n => ({
        id: n.id,
        name: n.name,
        department: n.department,
    }));

    return <TasksClient initialTasks={tasks as any} patients={patients} nurses={nurses} />;
}
