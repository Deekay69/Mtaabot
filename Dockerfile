# Stage 1: Builder
FROM node:22.12.0-alpine AS builder

WORKDIR /app

# Copy manifest files first to leverage Docker cache
COPY package*.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
WORKDIR /app/backend
RUN npx prisma generate

# Build Backend
WORKDIR /app
RUN npm run build:backend

# Stage 2: Runner
FROM node:22.12.0-alpine AS runner

WORKDIR /app
RUN apk add --no-cache openssl

# Copy files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package.json backend/
COPY --from=builder /app/backend/dist backend/dist
COPY --from=builder /app/backend/prisma backend/prisma
COPY --from=builder /app/index.js .

# Environment setup
ENV NODE_ENV=production
ENV PORT=3000

# Expose port (default for Railway)
EXPOSE 3000

# Start command
CMD ["npm", "start"]
