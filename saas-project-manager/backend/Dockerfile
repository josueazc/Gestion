# Etapa 1: Dependencias
FROM node:20-alpine AS deps
# Instalamos openssl necesario para Prisma en Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instalamos dependencias y generamos el cliente de Prisma
RUN npm ci
RUN npx prisma generate

# Etapa 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Compilamos el código TypeScript a JavaScript
RUN npm run build

# Etapa 3: Runner (Producción)
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Buenas prácticas de seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER nestjs

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
