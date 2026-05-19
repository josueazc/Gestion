"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import {
  X,
  MessageSquare,
  Calendar,
  User,
  Flag,
  Send,
  Loader2,
  Flame,
  ArrowUp,
  ArrowDown,
  Minus,
  Trash2,
} from "lucide-react";

const STATUSES = [
  { id: "BACKLOG", label: "Backlog", color: "bg-zinc-400" },
  { id: "TODO", label: "Por Hacer", color: "bg-blue-400" },
  { id: "IN_PROGRESS", label: "En Progreso", color: "bg-yellow-400" },
  { id: "IN_REVIEW", label: "En Revisión", color: "bg-purple-400" },
  { id: "DONE", label: "Completado", color: "bg-green-400" },
];

const PRIORITIES = [
  { id: "URGENT", label: "Urgente", icon: Flame, color: "text-red-500" },
  { id: "HIGH", label: "Alta", icon: ArrowUp, color: "text-orange-500" },
  { id: "MEDIUM", label: "Media", icon: Minus, color: "text-yellow-500" },
  { id: "LOW", label: "Baja", icon: ArrowDown, color: "text-blue-500" },
  { id: "NONE", label: "Ninguna", icon: Minus, color: "text-muted-foreground" },
];

interface TaskModalProps {
  taskId: string | null;
  userId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export function TaskModal({ taskId, userId, onClose, onUpdate }: TaskModalProps) {
  const [task, setTask] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!taskId) return;
    const fetchTask = async () => {
      setLoading(true);
      try {
        const [taskRes, commentsRes] = await Promise.all([
          api.get(`/tasks/${taskId}`),
          api.get(`/comments?taskId=${taskId}`),
        ]);
        setTask(taskRes.data);
        setTitle(taskRes.data.title);
        setDescription(taskRes.data.description || "");
        setComments(commentsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const updateField = async (field: string, value: any) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { [field]: value });
      setTask(res.data);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setSending(true);
    try {
      const res = await api.post("/comments", {
        content: newComment,
        taskId,
        authorId: userId,
      });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {taskId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-border bg-background shadow-2xl"
          >
            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {task?.id?.slice(0, 8)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleDelete}
                      className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      aria-label="Eliminar tarea"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={onClose}
                      className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      aria-label="Cerrar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-5 space-y-5">
                    {/* Title */}
                    {editingTitle ? (
                      <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => {
                          setEditingTitle(false);
                          if (title !== task.title) updateField("title", title);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditingTitle(false);
                            if (title !== task.title) updateField("title", title);
                          }
                        }}
                        className="w-full bg-transparent text-lg font-semibold text-foreground outline-none border-b-2 border-primary pb-1"
                      />
                    ) : (
                      <h2
                        onClick={() => setEditingTitle(true)}
                        className="text-lg font-semibold text-foreground cursor-text hover:text-primary/80 transition-colors"
                      >
                        {task?.title}
                      </h2>
                    )}

                    {/* Properties Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {/* Status */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Estado</label>
                        <select
                          value={task?.status}
                          onChange={(e) => updateField("status", e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground"
                        >
                          {STATUSES.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Prioridad</label>
                        <select
                          value={task?.priority}
                          onChange={(e) => updateField("priority", e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground"
                        >
                          {PRIORITIES.map((p) => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Due Date */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Fecha límite</label>
                        <input
                          type="date"
                          value={task?.dueDate?.split("T")[0] || ""}
                          onChange={(e) => updateField("dueDate", e.target.value || null)}
                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Descripción</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => {
                          if (description !== (task?.description || ""))
                            updateField("description", description);
                        }}
                        placeholder="Agrega una descripción..."
                        rows={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    {/* Comments */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground">
                          Comentarios ({comments.length})
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                              {(comment.author?.name || comment.author?.email || "U")[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-foreground">
                                  {comment.author?.name || comment.author?.email?.split("@")[0]}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString("es-CR", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-foreground/80 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* New comment input */}
                      <div className="flex gap-2">
                        <input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                          placeholder="Escribe un comentario..."
                          className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <button
                          onClick={handleSendComment}
                          disabled={sending || !newComment.trim()}
                          className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                          {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
