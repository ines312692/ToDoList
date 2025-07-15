FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy only necessary files for build
COPY tsconfig*.json ./
COPY angular.json ./
COPY src/ ./src/

# Build with optimizations
RUN npm run build:prod

# Use smaller nginx image
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/untitled/browser/ /usr/share/nginx/html/

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
