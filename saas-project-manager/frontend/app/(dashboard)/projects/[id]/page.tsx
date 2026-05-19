"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { api } from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import {
  Plus,
  GripVertical,
  MessageSquare,
  Calendar,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Flame,
  X,
  Loader2,
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  order: number;
  dueDate?: string;
  assignee?: { id: string; email: string; name?: string };
  _count?: { comments: number };
  labels?: { label: { id: string; name: string; color: string } }[];
};

const COLUMNS = [
  { id: "BACKLOG", label: "Backlog", color: "bg-zinc-400" },
  { id: "TODO", label: "Por Hacer", color: "bg-blue-400" },
  { id: "IN_PROGRESS", label: "En Progreso", color: "bg-yellow-400" },
  { id: "IN_REVIEW", label: "En Revisión", color: "bg-purple-400" },
  { id: "DONE", label: "Completado", color: "bg-green-400" },
];

const PRIORITY_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  URGENT: { icon: Flame, color: "text-red-500", label: "Urgente" },
  HIGH: { icon: ArrowUp, color: "text-orange-500", label: "Alta" },
  MEDIUM: { icon: Minus, color: "text-yellow-500", label: "Media" },
  LOW: { icon: ArrowDown, color: "text-blue-500", label: "Baja" },
  NONE: { icon: Minus, color: "text-muted-foreground", label: "Sin prioridad" },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuth();

  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks?projectId=${projectId}`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Error fetching project", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getTasksByColumn = (status: string) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  const handleCreateTask = async (status: string) => {
    if (!newTaskTitle.trim() || !user?.email) return;
    setCreatingTask(true);
    try {
      // Sync user first
      const userRes = await api.post("/users", { email: user.email, id: user.uid });
      const res = await api.post("/tasks", {
        title: newTaskTitle,
        status,
        projectId,
        creatorId: userRes.data.id,
      });
      setTasks((prev) => [...prev, res.data]);
      setNewTaskTitle("");
      setNewTaskColumn(null);
    } catch (err) {
      console.error("Error creating task", err);
    } finally {
      setCreatingTask(false);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTask || draggedTask.status === targetColumn) {
      setDraggedTask(null);
      return;
    }

    const tasksInColumn = getTasksByColumn(targetColumn);
    const newOrder = tasksInColumn.length;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggedTask.id ? { ...t, status: targetColumn, order: newOrder } : t
      )
    );
    setDraggedTask(null);

    try {
      await api.patch(`/tasks/${draggedTask.id}/status`, {
        status: targetColumn,
        order: newOrder,
      });
    } catch {
      fetchData(); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: project?.color || "#6366f1" }}
          />
          <h1 className="text-lg font-semibold text-foreground">
            {project?.name || "Proyecto"}
          </h1>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {tasks.length} tareas
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colTasks = getTasksByColumn(col.id);
          return (
            <div
              key={col.id}
              className={cn(
                "flex w-72 shrink-0 flex-col rounded-xl border border-border bg-muted/30 transition-colors",
                dragOverColumn === col.id && "border-primary/50 bg-primary/5"
              )}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", col.color)} />
                  <span className="text-xs font-semibold text-foreground">
                    {col.label}
                  </span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => setNewTaskColumn(col.id)}
                  className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Tasks */}
              <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-2">
                {/* New Task Input */}
                <AnimatePresence>
                  {newTaskColumn === col.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-lg border border-primary/50 bg-card p-2 shadow-sm">
                        <input
                          autoFocus
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreateTask(col.id);
                            if (e.key === "Escape") setNewTaskColumn(null);
                          }}
                          placeholder="Título de la tarea..."
                          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                        />
                        <div className="mt-2 flex items-center justify-end gap-1">
                          <button
                            onClick={() => setNewTaskColumn(null)}
                            className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleCreateTask(col.id)}
                            disabled={creatingTask || !newTaskTitle.trim()}
                            className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                          >
                            {creatingTask ? "..." : "Crear"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Task Cards */}
                {colTasks.map((task) => {
                  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.NONE;
                  const PriorityIcon = priorityCfg.icon;
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      className={cn(
                        "group cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:cursor-grabbing",
                        draggedTask?.id === task.id && "opacity-50"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-snug">
                            {task.title}
                          </p>

                          {/* Labels */}
                          {task.labels && task.labels.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {task.labels.map((tl) => (
                                <span
                                  key={tl.label.id}
                                  className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                                  style={{
                                    backgroundColor: tl.label.color + "20",
                                    color: tl.label.color,
                                  }}
                                >
                                  {tl.label.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Bottom row */}
                          <div className="mt-2 flex items-center gap-2">
                            <PriorityIcon
                              className={cn("h-3 w-3", priorityCfg.color)}
                            />
                            {task.dueDate && (
                              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Calendar className="h-2.5 w-2.5" />
                                {new Date(task.dueDate).toLocaleDateString("es-CR", { month: "short", day: "numeric" })}
                              </span>
                            )}
                            {task._count && task._count.comments > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <MessageSquare className="h-2.5 w-2.5" />
                                {task._count.comments}
                              </span>
                            )}
                            {task.assignee && (
                              <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[8px] font-semibold text-primary">
                                {(task.assignee.name || task.assignee.email)[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
