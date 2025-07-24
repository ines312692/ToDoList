FROM node:20-alpine AS builder
WORKDIR /app
# Mount node_modules from PVC to avoid re-installing
COPY package*.json ./
RUN if [ ! -d "/node_modules" ]; then npm ci; else echo "Using cached node_modules"; fi
COPY . .
RUN npm run build

FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/untitled/browser/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
