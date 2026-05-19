"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import {
  ArrowUpRight,
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  Plus,
  Activity,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    if (!user?.email) return;
    const fetchData = async () => {
      try {
        const userRes = await api.post("/users", { email: user.email, id: user.uid });
        setDbUser(userRes.data);
        const res = await api.get(`/projects?userId=${userRes.data.id}`);
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const totalTasks = projects.reduce((sum, p) => sum + (p._count?.tasks || 0), 0);

  const stats = [
    {
      label: "Proyectos Activos",
      value: String(projects.length),
      icon: FolderKanban,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total de Tareas",
      value: String(totalTasks),
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Miembros",
      value: String(new Set(projects.flatMap((p: any) => p.members?.map((m: any) => m.userId) || [])).size || 1),
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Bienvenido de vuelta 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí tienes un resumen de tu workspace.
          </p>
        </div>
        <button
          onClick={() => router.push("/projects")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className={cn("rounded-lg p-2", stat.bg)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Projects */}
      <motion.div variants={item}>
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Tus Proyectos</h2>
            <button
              onClick={() => router.push("/projects")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver todos →
            </button>
          </div>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <FolderKanban className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No tienes proyectos aún.{" "}
                <button
                  onClick={() => router.push("/projects")}
                  className="text-primary hover:underline"
                >
                  Crea uno
                </button>
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {projects.slice(0, 5).map((project: any) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {project.description || "Sin descripción"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {project._count?.tasks || 0} tareas
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
