"use client";

import { cn } from "@/src/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  Plus,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

// Animación de stagger para items
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Datos mock para el dashboard
const stats = [
  {
    label: "Proyectos Activos",
    value: "12",
    change: "+2",
    trend: "up" as const,
    icon: FolderKanban,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Tareas Completadas",
    value: "48",
    change: "+12",
    trend: "up" as const,
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "En Progreso",
    value: "23",
    change: "-3",
    trend: "down" as const,
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "Miembros",
    value: "8",
    change: "+1",
    trend: "up" as const,
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const recentActivity = [
  {
    id: 1,
    user: "Josué",
    action: "completó la tarea",
    target: "Diseño del Dashboard",
    time: "hace 5 min",
    type: "completed",
  },
  {
    id: 2,
    user: "María",
    action: "comentó en",
    target: "API de Usuarios",
    time: "hace 15 min",
    type: "comment",
  },
  {
    id: 3,
    user: "Carlos",
    action: "creó el proyecto",
    target: "App Móvil v2",
    time: "hace 1 hora",
    type: "created",
  },
  {
    id: 4,
    user: "Ana",
    action: "asignó a Josué",
    target: "Integración Stripe",
    time: "hace 2 horas",
    type: "assigned",
  },
  {
    id: 5,
    user: "Josué",
    action: "movió a Review",
    target: "Auth con Firebase",
    time: "hace 3 horas",
    type: "moved",
  },
];

const recentProjects = [
  {
    id: 1,
    name: "Plataforma SaaS",
    description: "Dashboard y gestión de proyectos",
    progress: 68,
    members: 4,
    tasks: 24,
    color: "bg-primary",
  },
  {
    id: 2,
    name: "App Móvil",
    description: "Versión React Native",
    progress: 35,
    members: 3,
    tasks: 18,
    color: "bg-success",
  },
  {
    id: 3,
    name: "Landing Page",
    description: "Marketing y conversión",
    progress: 90,
    members: 2,
    tasks: 8,
    color: "bg-warning",
  },
];

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
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
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className={cn("rounded-lg p-2", stat.bg)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
              <div
                className={cn(
                  "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                  stat.trend === "up"
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">
                Proyectos Recientes
              </h2>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Ver todos →
              </button>
            </div>
            <div className="divide-y divide-border">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      project.color
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {project.members}
                    </div>
                    <div className="w-24">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className={cn("h-full rounded-full", project.color)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item}>
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Actividad Reciente
              </h2>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.map((act) => (
                <div key={act.id} className="px-5 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary mt-0.5">
                      {act.user[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground leading-relaxed">
                        <span className="font-medium">{act.user}</span>{" "}
                        <span className="text-muted-foreground">
                          {act.action}
                        </span>{" "}
                        <span className="font-medium">{act.target}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {act.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
