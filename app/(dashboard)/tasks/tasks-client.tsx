"use client";

import { useState } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Clock, CheckCircle2, AlertCircle, Plus, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateTaskStatus, createTask } from "@/app/actions/tasks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";

interface Task {
    id: string;
    patient: string;
    room: string;
    task: string;
    time: string;
    status: string;
    priority: string;
    assignedTo?: string | null;
    assignedBy?: string | null;
}

interface TasksClientProps {
    initialTasks: Task[];
    patients: { id: string; name: string }[];
    nurses: { id: string; name: string; department: string | null }[];
}

export default function TasksClient({ initialTasks, patients, nurses }: TasksClientProps) {
    const router = useRouter();
    const { userRole } = useAuth();
    const [tasks, setTasks] = useState(initialTasks);
    const isDoctor = userRole === "doctor";

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTask, setNewTask] = useState({
        patientId: "",
        title: "",
        priority: "NORMAL",
        assignedToId: "",
    });

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newStatus = task.status === "Pending" ? "COMPLETED" : "PENDING";

        // Optimistic update
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, status: task.status === "Pending" ? "Completed" : "Pending" } : t
        ));

        try {
            await updateTaskStatus(id, newStatus);
            router.refresh();
        } catch (error) {
            console.error("Failed to update task status:", error);
            // Rollback on error
            setTasks(initialTasks);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createTask(newTask);
            toast.success("Task created successfully");
            setIsAddTaskOpen(false);
            setNewTask({ patientId: "", title: "", priority: "NORMAL", assignedToId: "" });
            router.refresh();
        } catch (error) {
            toast.error("Failed to create task");
        } finally {
            setIsSubmitting(false);
        }
    };

    const pendingTasks = tasks.filter(t => t.status === "Pending");
    const completedTasks = tasks.filter(t => t.status === "Completed");

    return (
        <div className="space-y-6">
            <PageHeader
                title={isDoctor ? "Task Management" : "My Tasks"}
                description={isDoctor ? "Assign and monitor tasks for nursing staff" : "Manage your daily nursing responsibilities and patient care tasks"}
            >
                {(userRole === "doctor" || userRole === "nurse") && (
                    <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Task</DialogTitle>
                                <DialogDescription>
                                    Create a new task for patient care.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddTask} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="patient">Patient</Label>
                                    <Select
                                        value={newTask.patientId}
                                        onValueChange={(v) => setNewTask({ ...newTask, patientId: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select patient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Task Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Check vitals, Administer medication"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select
                                        value={newTask.priority}
                                        onValueChange={(v) => setNewTask({ ...newTask, priority: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NORMAL">Normal</SelectItem>
                                            <SelectItem value="URGENT">Urgent</SelectItem>
                                            <SelectItem value="EMERGENCY">Emergency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {isDoctor && nurses.length > 0 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="assignedTo">Assign to Nurse</Label>
                                        <Select
                                            value={newTask.assignedToId}
                                            onValueChange={(v) => setNewTask({ ...newTask, assignedToId: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select nurse (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {nurses.map(n => (
                                                    <SelectItem key={n.id} value={n.id}>
                                                        {n.name} {n.department ? `(${n.department})` : ""}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Task"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </PageHeader>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Task Summary Cards */}
                <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Pending</p>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{pendingTasks.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">Completed</p>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{completedTasks.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-amber-900 dark:text-amber-300">High Priority</p>
                            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                                {tasks.filter(t => (t.priority === "Emergency" || t.priority === "Urgent") && t.status === "Pending").length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList>
                    <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-4 space-y-4">
                    {pendingTasks.map((task) => (
                        <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} canToggle={!isDoctor} />
                    ))}
                    {pendingTasks.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            {isDoctor ? "No pending tasks assigned." : "No pending tasks. Great job!"}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="completed" className="mt-4 space-y-4">
                    {completedTasks.map((task) => (
                        <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} canToggle={!isDoctor} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function TaskItem({ task, onToggle, canToggle }: { task: Task, onToggle: () => void, canToggle: boolean }) {
    return (
        <Card className={cn(
            "transition-all hover:shadow-md",
            (task.priority === "Emergency" || task.priority === "Urgent") && task.status === "Pending" && "border-l-4 border-l-red-500"
        )}>
            <CardContent className="p-4 flex items-center gap-4">
                {canToggle ? (
                    <Checkbox
                        checked={task.status === "Completed"}
                        onCheckedChange={onToggle}
                        className="h-6 w-6"
                    />
                ) : (
                    <div className={cn(
                        "h-6 w-6 rounded border-2 flex items-center justify-center",
                        task.status === "Completed" ? "bg-primary border-primary" : "border-muted-foreground/30"
                    )}>
                        {task.status === "Completed" && (
                            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                        )}
                    </div>
                )}
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={cn("font-medium", task.status === "Completed" && "line-through text-muted-foreground")}>
                            {task.task}
                        </h4>
                        {task.priority === "Emergency" && (
                            <Badge variant="destructive" className="gap-1">Emergency</Badge>
                        )}
                        {task.priority === "Urgent" && (
                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Urgent</Badge>
                        )}
                        {task.assignedTo && (
                            <Badge variant="secondary" className="gap-1">
                                <User className="h-3 w-3" />
                                {task.assignedTo}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {task.patient} • Room {task.room} • Due: {task.time}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
