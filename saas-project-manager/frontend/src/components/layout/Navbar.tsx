"use client";

import { cn } from "@/src/lib/utils";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Moon, Sun, Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Genera breadcrumbs a partir del pathname
function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [{ label: "Dashboard", href: "/" }];

  const labels: Record<string, string> = {
    projects: "Proyectos",
    settings: "Configuración",
    dashboard: "Dashboard",
  };

  return segments.map((seg, i) => ({
    label: labels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));
}

interface NavbarProps {
  collapsed: boolean;
  onOpenCommandPalette?: () => void;
}

export function Navbar({ collapsed, onOpenCommandPalette }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md transition-[padding-left] duration-200",
        collapsed ? "pl-[80px]" : "pl-[272px]"
      )}
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.href} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-muted-foreground">/</span>
            )}
            <span
              className={cn(
                "font-medium",
                i === breadcrumbs.length - 1
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {crumb.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button
          onClick={onOpenCommandPalette}
          className="flex h-8 items-center gap-2 rounded-md border border-input bg-background px-3 text-xs text-muted-foreground hover:bg-accent transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Buscar...</span>
          <kbd className="hidden sm:inline rounded border border-border bg-muted px-1 py-0.5 text-[10px]">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Theme Toggle */}
        {mounted && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </motion.button>
        )}
      </div>
    </header>
  );
}
