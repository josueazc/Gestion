"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import {
  FolderKanban,
  Plus,
  Users,
  Loader2,
  X,
  Trash2,
} from "lucide-react";
import { useToast } from "@/src/components/ui/toast";

type Project = {
  id: string;
  name: string;
  description?: string;
  color: string;
  _count?: { tasks: number };
  members?: any[];
};

const PROJECT_COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState(PROJECT_COLORS[0]);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.email) return;
    const fetchProjects = async () => {
      try {
        const userRes = await api.post("/users", { email: user.email, id: user.uid });
        const res = await api.get(`/projects?userId=${userRes.data.id}`);
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const handleCreate = async () => {
    if (!newName.trim() || !user?.email) return;
    setCreating(true);
    try {
      const userRes = await api.post("/users", { email: user.email, id: user.uid });
      const res = await api.post("/projects", {
        name: newName,
        description: newDesc,
        color: newColor,
        userId: userRes.data.id,
      });
      setProjects((prev) => [res.data, ...prev]);
      setNewName("");
      setNewDesc("");
      setShowCreate(false);
      toast("Proyecto creado exitosamente");
    } catch (err) {
      console.error(err);
      toast("Error al crear proyecto", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!confirm("¿Eliminar este proyecto y todas sus tareas?")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast("Proyecto eliminado");
    } catch (err) {
      toast("Error al eliminar proyecto", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Proyectos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona y organiza todos tus proyectos.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Crear Proyecto
              </h3>
              <button
                onClick={() => setShowCreate(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Nombre del proyecto"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Descripción (opcional)"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Color:</span>
                {PROJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={cn(
                      "h-5 w-5 rounded-full transition-all",
                      newColor === c
                        ? "ring-2 ring-ring ring-offset-2 ring-offset-background scale-110"
                        : "hover:scale-110"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !newName.trim()}
                  className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Crear"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-24">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
            <FolderKanban className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-foreground">
            No hay proyectos aún
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs text-center">
            Crea tu primer proyecto para comenzar a organizar tareas.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Crear Proyecto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -2 }}
              onClick={() => router.push(`/projects/${project.id}`)}
              className="group cursor-pointer rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      {project.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => handleDelete(e, project.id)}
                  className="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                  aria-label="Eliminar proyecto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FolderKanban className="h-3 w-3" />
                  {project._count?.tasks || 0} tareas
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {project.members?.length || 1} miembros
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
