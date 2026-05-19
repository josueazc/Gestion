"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 text-gray-800">
        <p className="text-xl font-medium animate-pulse">Verificando sesión...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">SaaS Manager</h2>
        <nav className="space-y-4">
          <a href="/dashboard" className="block text-gray-600 hover:text-blue-600 font-medium">Inicio</a>
          <a href="#" className="block text-gray-600 hover:text-blue-600 font-medium">Proyectos</a>
          <a href="#" className="block text-gray-600 hover:text-blue-600 font-medium">Configuración</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
