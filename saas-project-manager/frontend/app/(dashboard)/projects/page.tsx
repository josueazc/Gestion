"use client";

import { motion } from "framer-motion";
import { FolderKanban, Plus } from "lucide-react";

export default function ProjectsPage() {
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
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-24">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
          <FolderKanban className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium text-foreground">
          No hay proyectos aún
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs text-center">
          Crea tu primer proyecto para comenzar a organizar tareas con tu equipo.
        </p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Crear Proyecto
        </button>
      </div>
    </motion.div>
  );
}
