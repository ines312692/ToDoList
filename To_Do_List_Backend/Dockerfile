FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund

# Copy source code
COPY src/ ./src/

# Use smaller and more specific base image
FROM node:20-alpine-slim

WORKDIR /app

# Copy only what's needed from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

# Create data directory
RUN mkdir -p /app/data

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:3001/health || exit 1

EXPOSE 3001

# Use non-root user for better security
USER node

CMD ["node", "src/app.js"]
