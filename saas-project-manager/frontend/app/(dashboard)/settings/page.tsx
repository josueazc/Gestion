"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { logout } from "@/src/services/authService";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Palette,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Shield,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const themes = [
    { id: "light", label: "Claro", icon: Sun },
    { id: "dark", label: "Oscuro", icon: Moon },
    { id: "system", label: "Sistema", icon: Monitor },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl space-y-8"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Configuración
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra tu cuenta y preferencias.
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <User className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Perfil</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {user?.email?.split("@")[0] || "Usuario"}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user?.email || "Sin correo"}
              </p>
            </div>
          </div>
          <div className="rounded-md bg-muted/50 px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              Autenticado con Firebase
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Apariencia</h2>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-3">
            Selecciona el tema de la interfaz.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
                  theme === t.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/30"
                )}
              >
                <t.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/30 bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-destructive/30 px-5 py-4">
          <LogOut className="h-4 w-4 text-destructive" />
          <h2 className="text-sm font-semibold text-destructive">Zona de Peligro</h2>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-3">
            Cerrar sesión te redirigirá a la página de inicio.
          </p>
          <button
            onClick={handleLogout}
            className="rounded-md bg-destructive px-4 py-2 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </motion.div>
  );
}
