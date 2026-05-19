import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de manera inteligente.
 * Resuelve conflictos entre clases (ej: "px-4" y "px-2" → "px-2").
 * Este es el estándar de la industria usado por shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
