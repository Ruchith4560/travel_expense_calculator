# ==============================================================================
# Multi-Stage Production Dockerfile for React TypeScript Vite Application
# ==============================================================================

# Stage 1: Build the static frontend bundle
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests and install packages
COPY package*.json ./
RUN npm ci

# Copy application sources and compile production bundle
COPY . .
RUN npm run build

# Stage 2: Serve using high-performance Nginx Alpine
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx public directory
RUN rm -rf ./*

# Copy compiled production assets from builder
COPY --from=builder /app/dist .

# Copy production Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
