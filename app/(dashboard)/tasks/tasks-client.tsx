"use client";

import { useState } from "react";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateTaskStatus } from "@/app/actions/tasks";

interface Task {
    id: string;
    patient: string;
    room: string;
    task: string;
    time: string;
    status: string;
    priority: string;
}

interface TasksClientProps {
    initialTasks: Task[];
}

export default function TasksClient({ initialTasks }: TasksClientProps) {
    const [tasks, setTasks] = useState(initialTasks);

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
        } catch (error) {
            console.error("Failed to update task status:", error);
            // Rollback on error
            setTasks(initialTasks);
        }
    };

    const pendingTasks = tasks.filter(t => t.status === "Pending");
    const completedTasks = tasks.filter(t => t.status === "Completed");

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Tasks"
                description="Manage your daily nursing responsibilities and patient care tasks"
            >
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                </Button>
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
                                {tasks.filter(t => t.priority === "High" && t.status === "Pending").length}
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
                        <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
                    ))}
                    {pendingTasks.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No pending tasks. Great job!
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="completed" className="mt-4 space-y-4">
                    {completedTasks.map((task) => (
                        <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function TaskItem({ task, onToggle }: { task: Task, onToggle: () => void }) {
    return (
        <Card className={cn(
            "transition-all hover:shadow-md",
            task.priority === "High" && task.status === "Pending" && "border-l-4 border-l-amber-500"
        )}>
            <CardContent className="p-4 flex items-center gap-4">
                <Checkbox
                    checked={task.status === "Completed"}
                    onCheckedChange={onToggle}
                    className="h-6 w-6"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className={cn("font-medium", task.status === "Completed" && "line-through text-muted-foreground")}>
                            {task.task}
                        </h4>
                        {task.priority === "High" && (
                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">High Priority</Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {task.patient} • Room {task.room} • Due: {task.time}
                    </p>
                </div>
                <Button variant="ghost" size="sm">Details</Button>
            </CardContent>
        </Card>
    );
}
