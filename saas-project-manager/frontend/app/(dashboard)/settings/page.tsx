"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Configuración
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra las preferencias de tu cuenta y workspace.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-24">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
          <SettingsIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium text-foreground">
          Próximamente
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs text-center">
          La sección de configuración está en desarrollo.
        </p>
      </div>
    </motion.div>
  );
}
