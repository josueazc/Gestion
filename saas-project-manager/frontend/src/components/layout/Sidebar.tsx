"use client";

import { cn } from "@/src/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/src/context/AuthContext";
import { logout } from "@/src/services/authService";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronsLeft,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Proyectos",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Configuración",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "US";

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        "will-change-[width]"
      )}
    >
      {/* Header — Logo */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-primary-foreground">
                  G
                </span>
              </div>
              <span className="text-sm font-semibold tracking-tight">
                Gestión
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">G</span>
          </div>
        )}

        {!collapsed && (
          <button
            onClick={onToggle}
            className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            aria-label="Colapsar sidebar"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="px-3 py-3 space-y-1">
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Search className="h-3.5 w-3.5" />
            <span>Buscar...</span>
            <kbd className="ml-auto rounded border border-sidebar-border bg-sidebar px-1 py-0.5 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-md bg-sidebar-accent"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                <item.icon
                  className={cn(
                    "relative z-10 h-4 w-4 shrink-0",
                    isActive && "text-primary"
                  )}
                />
                {!collapsed && (
                  <span className="relative z-10 truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* New Project Button */}
        {!collapsed && (
          <div className="mt-6 px-1">
            <button className="flex w-full items-center gap-2 rounded-md border border-dashed border-sidebar-border px-2 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Nuevo Proyecto
            </button>
          </div>
        )}
      </nav>

      {/* Footer — User */}
      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">
                {user?.email?.split("@")[0] || "Usuario"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email || ""}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={onToggle}
            className="mx-auto flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            aria-label="Expandir sidebar"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </button>
        </div>
      )}
    </motion.aside>
  );
}
