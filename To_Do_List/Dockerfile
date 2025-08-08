FROM nginx:latest

# Copie la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Supprime les anciens fichiers HTML
RUN rm -rf /usr/share/nginx/html/*

# Copie les fichiers buildés dans Jenkins
COPY dist/untitled/browser/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
