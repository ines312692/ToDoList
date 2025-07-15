FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund

COPY src/ ./src/

RUN mkdir -p /app/data

EXPOSE 3001

CMD ["node", "src/app.js"]
