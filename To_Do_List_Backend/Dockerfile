FROM node:20-alpine

LABEL org.opencontainers.image.source="inline-cache"

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

# Crée un dossier pour les données (persistants si montés via PVC)
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]
