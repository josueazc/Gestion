# 🗺 Roadmap — Gestión

Estado actual del proyecto y funcionalidades pendientes.

---

## ✅ Completado

### Backend
- [x] NestJS con arquitectura modular
- [x] Prisma ORM con PostgreSQL
- [x] CRUD completo de Users (upsert con Firebase)
- [x] CRUD completo de Projects (crear, listar, detalle, editar, eliminar)
- [x] CRUD completo de Tasks (crear, listar, detalle, editar, cambiar estado/orden, eliminar)
- [x] CRUD de Comments (crear, listar por tarea, eliminar)
- [x] CORS configurado
- [x] Docker Compose (backend + db + frontend)
- [x] Schema con relaciones: User, Project, ProjectMember, Task, Label, TaskLabel, Comment, Activity

### Frontend
- [x] Design System completo (CSS tokens, dark/light mode)
- [x] ThemeProvider con next-themes
- [x] Login/Register premium (split layout, animaciones)
- [x] Dashboard con stats reales de la BD
- [x] Sidebar colapsable con animación (Framer Motion)
- [x] Navbar con breadcrumbs y theme toggle
- [x] Command Palette (⌘K)
- [x] Página de Proyectos (crear, listar, eliminar, color picker)
- [x] Kanban Board con drag & drop nativo
- [x] Task Modal lateral (editar estado, prioridad, descripción, comentarios)
- [x] Settings (perfil, selector de tema, logout)
- [x] Toast notifications (success, error, info)
- [x] Mobile responsive (drawer sidebar)
- [x] Página 404
- [x] Loading states animados

---

## 🔜 Próximas Funcionalidades

### Prioridad Alta

- [ ] **Asignar miembros a tareas** — Dropdown con lista de miembros del proyecto
- [ ] **Invitar miembros al proyecto** — Modal para agregar usuarios por email
- [ ] **Filtros en el Kanban** — Filtrar por prioridad, asignado, fecha
- [ ] **Búsqueda global** — Buscar tareas y proyectos desde el Command Palette
- [ ] **Labels/Etiquetas** — Crear y asignar etiquetas a tareas con colores
- [ ] **Notificaciones reales** — Mostrar actividad cuando alguien comenta o mueve una tarea

### Prioridad Media

- [ ] **Editar proyecto** — Modal para cambiar nombre, descripción y color
- [ ] **Vista de lista** — Alternar entre vista Kanban y vista de tabla/lista
- [ ] **Drag & drop entre tareas** — Reordenar tareas dentro de la misma columna
- [ ] **Actividad del proyecto** — Feed de actividad usando el modelo Activity
- [ ] **Subtareas** — Checklist dentro de cada tarea
- [ ] **Fechas con calendario** — Date picker visual con `react-day-picker`
- [ ] **Editar perfil** — Cambiar nombre y avatar del usuario

### Prioridad Baja

- [ ] **Dashboard avanzado** — Gráficos con Recharts (tareas por estado, burndown chart)
- [ ] **Exportar datos** — Exportar proyectos/tareas a CSV
- [ ] **Temas personalizados** — Más paletas de colores
- [ ] **Atajos de teclado** — Más shortcuts (N = nueva tarea, E = editar, etc.)
- [ ] **WebSockets** — Actualizaciones en tiempo real con Socket.io
- [ ] **Roles y permisos** — Lógica de owner/admin/member en el frontend
- [ ] **Archivo de proyectos** — Archivar proyectos completados
- [ ] **Markdown en descripciones** — Editor rich text para descripciones de tareas

---

## 🏗 Mejoras Técnicas

- [ ] **Validación de DTOs** — class-validator en NestJS para validar inputs
- [ ] **Auth middleware** — Verificar tokens de Firebase en el backend
- [ ] **Paginación** — Paginar tareas y proyectos en endpoints de listado
- [ ] **Tests** — Unit tests (Jest) y E2E tests (Playwright)
- [ ] **CI/CD** — GitHub Actions para lint, test y deploy
- [ ] **Deploy** — Railway / Vercel / Fly.io
- [ ] **Rate limiting** — Proteger endpoints de la API
- [ ] **Logging** — Winston o Pino para logs estructurados
- [ ] **Error boundaries** — React error boundaries en el frontend
- [ ] **Image upload** — Avatares de usuario con S3/Cloudinary
- [ ] **PWA** — Progressive Web App para uso offline

---

## 📊 Métricas del Proyecto

| Métrica | Valor |
|---|---|
| Modelos de BD | 8 (User, Project, ProjectMember, Task, Label, TaskLabel, Comment, Activity) |
| Endpoints API | 16 |
| Componentes React | 12+ |
| Páginas | 7 (Login, Register, Dashboard, Projects, Project Detail, Settings, 404) |
