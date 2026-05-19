# Etapa 1: Base y Dependencias
FROM node:20-alpine AS deps
# libc6-compat es necesario en alpine para algunas librerías nativas
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalamos dependencias
COPY package.json package-lock.json* ./
RUN npm ci

# Etapa 2: Construcción (Builder)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Deshabilitamos telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Construimos la aplicación para producción
RUN npm run build

# Etapa 3: Producción (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Buenas prácticas: Crear un usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos lo necesario desde el builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000

# Comando por defecto para producción
CMD ["npm", "start"]
