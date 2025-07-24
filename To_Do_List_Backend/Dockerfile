FROM node:20-alpine

LABEL org.opencontainers.image.source="todo-backend"

WORKDIR /app

COPY package*.json ./
# Check for existing node_modules to avoid re-installing
RUN if [ ! -d "/node_modules" ]; then npm ci --only=production; else echo "Using cached node_modules"; fi

COPY src/ ./src/

# Ensure data directory exists (persisted via PVC)
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]