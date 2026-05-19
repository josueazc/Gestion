"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  Settings,
  Sun,
  Moon,
  LogOut,
  Plus,
} from "lucide-react";
import { useTheme } from "next-themes";

type Command = {
  id: string;
  label: string;
  icon: any;
  category: string;
  action: () => void;
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    {
      id: "dashboard",
      label: "Ir al Dashboard",
      icon: LayoutDashboard,
      category: "Navegación",
      action: () => { router.push("/"); onClose(); },
    },
    {
      id: "projects",
      label: "Ver Proyectos",
      icon: FolderKanban,
      category: "Navegación",
      action: () => { router.push("/projects"); onClose(); },
    },
    {
      id: "settings",
      label: "Configuración",
      icon: Settings,
      category: "Navegación",
      action: () => { router.push("/settings"); onClose(); },
    },
    {
      id: "new-project",
      label: "Crear Nuevo Proyecto",
      icon: Plus,
      category: "Acciones",
      action: () => { router.push("/projects"); onClose(); },
    },
    {
      id: "toggle-theme",
      label: theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro",
      icon: theme === "dark" ? Sun : Moon,
      category: "Preferencias",
      action: () => { setTheme(theme === "dark" ? "light" : "dark"); onClose(); },
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [filtered, selectedIndex, onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    setQuery("");
    setSelectedIndex(0);
  }, [open]);

  let flatIndex = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-border bg-popover shadow-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe un comando o busca..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden sm:inline rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No se encontraron resultados.
                </p>
              ) : (
                Object.entries(grouped).map(([category, cmds]) => (
                  <div key={category}>
                    <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {category}
                    </p>
                    {cmds.map((cmd) => {
                      const idx = flatIndex++;
                      return (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors",
                            selectedIndex === idx
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/50"
                          )}
                        >
                          <cmd.icon className="h-4 w-4 text-muted-foreground" />
                          {cmd.label}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
              <span>↑↓ navegar</span>
              <span>↵ seleccionar</span>
              <span>esc cerrar</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
