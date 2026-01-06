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

# Declare build arguments
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_URL

# Make them available as environment variables during build
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_URL=$VITE_API_URL

# Build
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# Copy and setup entrypoint
COPY --from=builder /app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port (documented)
EXPOSE 3000

# Start Nginx using custom entrypoint
ENTRYPOINT ["/entrypoint.sh"]
