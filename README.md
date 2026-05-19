<div align="center">
  <h1>🚀 Gestión</h1>
  <p><strong>Plataforma SaaS moderna para gestión de proyectos</strong></p>
  <p>Inspirada en Linear, Notion y Jira — construida con Next.js, NestJS, Prisma y PostgreSQL</p>

  <br />

  ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)
  ![NestJS](https://img.shields.io/badge/NestJS-10-red?style=flat-square&logo=nestjs)
  ![Prisma](https://img.shields.io/badge/Prisma-6-blue?style=flat-square&logo=prisma)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
  ![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=flat-square&logo=docker)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Funcionalidades](#-funcionalidades)
- [Instalación](#-instalación)
- [Desarrollo](#-desarrollo)
- [Base de Datos](#-base-de-datos)
- [API Endpoints](#-api-endpoints)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roadmap](#-roadmap)

---

## 📖 Descripción

**Gestión** es una plataforma SaaS de gestión de proyectos con una interfaz premium inspirada en herramientas como Linear, Notion y Vercel Dashboard. Permite crear proyectos, gestionar tareas con un tablero Kanban, agregar comentarios y colaborar en equipo.

### Características Principales

- 🎨 **UI/UX Premium** — Diseño dark/light mode con animaciones suaves (Framer Motion)
- 📊 **Dashboard** — Vista general con estadísticas en tiempo real desde la BD
- 📋 **Kanban Board** — Drag & drop nativo entre 5 columnas de estado
- 💬 **Comentarios** — Sistema de comentarios en tiempo real por tarea
- 🔐 **Autenticación** — Firebase Auth con sincronización a PostgreSQL
- ⌘ **Command Palette** — Acceso rápido con `⌘K` estilo Linear/Raycast
- 📱 **Responsive** — Sidebar drawer en mobile, diseño adaptativo
- 🐳 **Dockerizado** — Desarrollo completo con Docker Compose

---

## 🛠 Stack Tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| **Next.js 16** (App Router) | Framework React con SSR |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Sistema de estilos |
| **Framer Motion** | Animaciones fluidas |
| **Radix UI** | Primitivas de accesibilidad |
| **Lucide Icons** | Iconografía consistente |
| **Firebase Auth** | Autenticación de usuarios |
| **Axios** | Cliente HTTP |

### Backend
| Tecnología | Uso |
|---|---|
| **NestJS** | Framework backend enterprise |
| **Prisma ORM** | Acceso tipado a la BD |
| **PostgreSQL 16** | Base de datos relacional |
| **Docker** | Contenedorización |

---

## 🏗 Arquitectura

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│                  │    │                  │    │                  │
│   Next.js App    │───▶│   NestJS API     │───▶│   PostgreSQL     │
│   (Port 3000)    │    │   (Port 3001)    │    │   (Port 5432)    │
│                  │    │                  │    │                  │
│  - App Router    │    │  - REST API      │    │  - Users         │
│  - Framer Motion │    │  - Prisma ORM    │    │  - Projects      │
│  - Firebase Auth │    │  - CORS          │    │  - Tasks         │
│  - Tailwind CSS  │    │  - Validation    │    │  - Comments      │
│                  │    │                  │    │  - Labels        │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

---

## ✨ Funcionalidades

### Autenticación
- Login / Registro con Firebase
- Sincronización automática de usuarios con PostgreSQL
- Rutas protegidas con redirección

### Dashboard
- Estadísticas en tiempo real (proyectos, tareas, miembros)
- Lista de proyectos recientes con acceso directo
- Loading state animado

### Gestión de Proyectos
- Crear proyectos con nombre, descripción y color personalizado
- Visualizar todos los proyectos con contador de tareas
- Eliminar proyectos con confirmación

### Tablero Kanban
- 5 columnas: Backlog → Por Hacer → En Progreso → En Revisión → Completado
- Drag & drop nativo para mover tareas entre columnas
- Creación rápida de tareas inline
- Indicadores de prioridad (Urgente, Alta, Media, Baja)

### Task Modal (Panel Lateral)
- Editar título, descripción, estado, prioridad y fecha límite
- Sistema de comentarios en tiempo real
- Eliminar tareas

### UX Avanzado
- **Command Palette** (`⌘K`) — Navegación rápida y acciones
- **Dark/Light Mode** — Toggle con next-themes
- **Toast Notifications** — Feedback visual en acciones
- **Sidebar colapsable** — Más espacio de trabajo
- **Breadcrumbs** — Navegación contextual
- **Mobile responsive** — Drawer sidebar en pantallas pequeñas

---

## 🚀 Instalación

### Prerrequisitos

- [Docker](https://www.docker.com/) y Docker Compose
- [Node.js](https://nodejs.org/) 20+ (para desarrollo local)
- Cuenta de [Firebase](https://firebase.google.com/) (para autenticación)

### 1. Clonar el repositorio

```bash
git clone https://github.com/josueazc/Gestion.git
cd Gestion
```

### 2. Configurar variables de entorno

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://postgres:password@db:5432/saas_db?schema=public"
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
```

### 3. Levantar con Docker

```bash
docker-compose up -d
```

Esto levanta:
- 🗄️ **PostgreSQL** en `localhost:5432`
- ⚙️ **Backend (NestJS)** en `localhost:3001`
- 🌐 **Frontend (Next.js)** en `localhost:3000`

### 4. Sincronizar la Base de Datos

```bash
docker exec saas_backend npx prisma db push
```

---

## 💻 Desarrollo

### Desarrollo local (sin Docker para frontend)

```bash
# Backend + DB en Docker
docker-compose up -d db backend

# Frontend local (hot-reload más rápido)
cd frontend
npm install
npm run dev
```

### Comandos útiles

| Comando | Descripción |
|---|---|
| `docker-compose up -d` | Levantar todos los servicios |
| `docker-compose down` | Detener todos los servicios |
| `docker-compose logs -f` | Ver logs en tiempo real |
| `docker-compose restart backend` | Reiniciar el backend |
| `docker exec saas_backend npx prisma studio` | Abrir Prisma Studio |
| `docker system prune -af` | Limpiar imágenes Docker |

---

## 🗄 Base de Datos

### Modelos

```
User ─────────── ProjectMember ─────────── Project
  │                                          │
  │ (created/assigned)                       │
  ▼                                          ▼
Task ──── TaskLabel ──── Label              Activity
  │
  ▼
Comment
```

### Enums

**TaskStatus:** `BACKLOG` | `TODO` | `IN_PROGRESS` | `IN_REVIEW` | `DONE`

**TaskPriority:** `URGENT` | `HIGH` | `MEDIUM` | `LOW` | `NONE`

---

## 🔌 API Endpoints

### Users
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/users` | Crear/actualizar usuario |
| `GET` | `/users/:id` | Obtener usuario por ID |
| `GET` | `/users/email/:email` | Obtener usuario por email |

### Projects
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/projects` | Crear proyecto |
| `GET` | `/projects?userId=` | Listar proyectos del usuario |
| `GET` | `/projects/:id` | Detalle del proyecto con tareas |
| `PUT` | `/projects/:id` | Actualizar proyecto |
| `DELETE` | `/projects/:id` | Eliminar proyecto |

### Tasks
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/tasks` | Crear tarea |
| `GET` | `/tasks?projectId=` | Listar tareas del proyecto |
| `GET` | `/tasks/:id` | Detalle de tarea |
| `PUT` | `/tasks/:id` | Actualizar tarea |
| `PATCH` | `/tasks/:id/status` | Cambiar estado (Kanban) |
| `DELETE` | `/tasks/:id` | Eliminar tarea |

### Comments
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/comments` | Crear comentario |
| `GET` | `/comments?taskId=` | Listar comentarios de tarea |
| `DELETE` | `/comments/:id` | Eliminar comentario |

---

## 📁 Estructura del Proyecto

```
Gestion/
├── frontend/                    # Next.js App
│   ├── app/
│   │   ├── (auth)/              # Route group: Login, Register
│   │   ├── (dashboard)/         # Route group: Dashboard protegido
│   │   │   ├── page.tsx         # Dashboard home
│   │   │   ├── projects/        # Lista de proyectos
│   │   │   │   └── [id]/        # Kanban Board del proyecto
│   │   │   └── settings/        # Configuración
│   │   ├── layout.tsx           # Root layout (ThemeProvider)
│   │   ├── globals.css          # Design System tokens
│   │   └── not-found.tsx        # Página 404
│   └── src/
│       ├── components/
│       │   ├── layout/          # Sidebar, Navbar, CommandPalette
│       │   ├── projects/        # TaskModal
│       │   └── ui/              # Button, Toast
│       ├── context/             # AuthContext, ThemeProvider
│       ├── services/            # API client, Auth service
│       └── lib/                 # Utilities (cn)
│
├── backend/                     # NestJS API
│   ├── src/
│   │   ├── prisma/              # PrismaService, PrismaModule
│   │   ├── users/               # Users CRUD
│   │   ├── projects/            # Projects CRUD
│   │   ├── tasks/               # Tasks CRUD + Kanban
│   │   └── comments/            # Comments CRUD
│   └── prisma/
│       └── schema.prisma        # Database schema
│
├── docker-compose.yml           # Orquestación de servicios
└── README.md
```

---

## 🗺 Roadmap

Consulta el archivo [`ROADMAP.md`](./ROADMAP.md) para ver las funcionalidades pendientes y próximos pasos.

---

## 👤 Autor

**Josué Azofeifa**
- GitHub: [@josueazc](https://github.com/josueazc)

---

<div align="center">
  <sub>Construido con ❤️ usando Next.js, NestJS, Prisma y PostgreSQL</sub>
</div>
