"use client";

import { useAuth } from "@/src/context/AuthContext";
import { logout } from "@/src/services/authService";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Panel</h1>
          <p className="text-gray-500 mt-2">Has iniciado sesión correctamente.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
        >
          Cerrar Sesión
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Tus Datos de Cuenta</h3>
        <div className="space-y-3 text-gray-600">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>ID de Usuario:</strong> {user?.uid}</p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Activo
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
