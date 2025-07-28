# Étape 1 : Build Angular
FROM node:20-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers de dépendances pour tirer parti du cache Docker
COPY package*.json ./

RUN npm ci

# Copier tout le dossier frontend
COPY . .

# Construire l'application Angular
RUN npm run build

# Étape 2 : Serveur Nginx pour servir le build
FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

# Vider le dossier par défaut de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier le build Angular vers le dossier nginx par défaut
COPY --from=builder /app/dist/untitled/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
