# Stage 1: Builder
FROM node:22.12.0-alpine AS builder

WORKDIR /app

# Copy manifest files
COPY package.json .
COPY package-lock.json .

# Install dependencies (workaround for monorepo structure in isolated docker build)
# We only need frontend deps here, but lockfile might complain. 
# Using npm ci usually works if lockfile is present.
RUN npm install

# Copy source
COPY . .

# Build
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
